import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { forEach, map, sortBy, size } from "lodash";
import RaisedButton from "material-ui/RaisedButton";
import ScorePanel from "../components/ScorePanel";
import keydown from "react-keydown";

import {
  firebaseConnect,
  isLoaded,
  pathToJS,
  dataToJS
} from "react-redux-firebase";
import classes from "./ResultsContainer.scss";

const sortVotesByScore = (votes, invert) => {
  return sortBy(
    map(votes, (val, key) => {
      if (!val) return;
      return {
        option: invert ? val : key,
        score: invert ? key : val
      };
    }),
    "score"
  );
};

const getCurrentVote = (votes, maxVoters) => {
  let voters = 0;
  let currentVote;
  forEach(votes, userVotesObject => {
    if (voters === maxVoters - 1) {
      currentVote = userVotesObject;
    }
    voters++;
  });
  return sortVotesByScore(currentVote, true);
};

const generateResults = (votes, maxVoters) => {
  let results = {};
  let voters = 0;
  forEach(votes, userVotesObject => {
    if (voters >= maxVoters) {
      return;
    }
    voters++;
    forEach(userVotesObject, (val, key) => {
      if (val && val.text) {
        const score = parseInt(key);
        results[val.text] = results.hasOwnProperty(val.text)
          ? results[val.text] + score
          : score;
      }
    });
  });
  return sortVotesByScore(results);
};

@firebaseConnect([{ path: "votes" }, { path: "competitionName" }])
@connect(({ firebase }) => ({
  auth: pathToJS(firebase, "auth"),
  account: pathToJS(firebase, "profile"),
  votes: dataToJS(firebase, "votes"),
  competitionName: dataToJS(firebase, "competitionName")
}))
export default class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxVoters: 1
    };
  }

  @keydown("enter")
  showTotal(event) {
    this.setState({
      showTotal: true
    });
  }

  @keydown("n")
  next(event) {
    if (
      this.state.maxVoters !==
      size(this.props.votes[this.props.competitionName])
    ) {
      this.setState({
        maxVoters: this.state.maxVoters + 1,
        showTotal: false
      });
    }
  }

  @keydown("b")
  back(event) {
    if (this.state.maxVoters !== 1) {
      this.setState({
        maxVoters: this.state.maxVoters - 1,
        showTotal: false
      });
    }
  }

  render() {
    const { competitionName } = this.props;
    if (!isLoaded(competitionName)) return null;
    const votes = this.props.votes[competitionName];

    const votesLength = size(votes);
    const total = generateResults(votes, this.state.maxVoters, votesLength);
    const currentVote = getCurrentVote(votes, this.state.maxVoters);

    return (
      <div className={classes.container}>
        <ScorePanel
          votes={currentVote}
          header={`Vote #${this.state.maxVoters}`}
        />
        {this.state.showTotal && (
          <ScorePanel votes={total} header="Total" fadeIn={true} />
        )}
        <div className={classes.row}>
          {!this.state.showTotal && (
            <RaisedButton
              label="Total"
              onClick={() => {
                this.setState({
                  showTotal: true
                });
              }}
            />
          )}
          <br />
          <RaisedButton
            label="Next"
            primary={true}
            disabled={this.state.maxVoters === votesLength}
            onClick={() => {
              this.setState({
                maxVoters: this.state.maxVoters + 1,
                showTotal: false
              });
            }}
          />
        </div>
        <p>{`${this.state.maxVoters} - ${votesLength}`}</p>
      </div>
    );
  }
}
