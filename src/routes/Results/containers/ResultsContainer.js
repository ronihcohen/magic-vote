import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { forEach, map, sortBy, size, filter } from "lodash";
import Theme from "theme";
import Score from "../../Home/components/Score";
import RaisedButton from "material-ui/RaisedButton";
import Subheader from "material-ui/Subheader";

import {
  firebaseConnect,
  isLoaded,
  pathToJS,
  dataToJS
} from "react-redux-firebase";
import classes from "./ResultsContainer.scss";
import Paper from "material-ui/Paper";

const getCurrentVote = (votes, maxVoters, votesLength) => {
  let voters = 0;
  let currentVote;
  forEach(votes, userVotesObject => {
    if (voters === maxVoters - 1) {
      currentVote = userVotesObject;
    }
    voters++;
  });
  return currentVote;
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
      if (val) {
        const score = parseInt(key);
        results[val] = results.hasOwnProperty(val)
          ? results[val] + score
          : score;
      }
    });
  });
  return sortBy(
    map(results, (val, key) => {
      return {
        option: key,
        score: val
      };
    }),
    "score"
  );
};

@firebaseConnect([{ path: "votes" }])
@connect(({ firebase }) => ({
  auth: pathToJS(firebase, "auth"),
  account: pathToJS(firebase, "profile"),
  votes: dataToJS(firebase, "votes")
}))
export default class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxVoters: 1
    };
  }

  render() {
    const { votes } = this.props;
    if (!isLoaded(votes)) return null;

    const votesLength = size(votes);
    let results = generateResults(votes, this.state.maxVoters, votesLength);
    const currentVote = getCurrentVote(
      votes,
      this.state.maxVoters,
      votesLength
    );

    return (
      <div className={classes.container}>
        <Subheader>Vote #{this.state.maxVoters}</Subheader>
        <div
          className={classes.scoreContainer}
          style={{ color: Theme.palette.primary2Color }}
        >
          {currentVote.map(
            (value, index) =>
              value ? (
                <div className={classes.score} key={index}>
                  <div className={classes.title}>{value}</div> <br />
                  <Score value={index} />
                </div>
              ) : null
          )}
        </div>
        <Subheader>Total</Subheader>

        <div
          className={classes.scoreContainer}
          style={{ color: Theme.palette.primary2Color }}
        >
          {results.map((value, index) => (
            <div className={classes.score} key={index}>
              <div className={classes.title}>{value.option}</div> <br />
              <Score value={value.score} />
            </div>
          ))}
        </div>
        <RaisedButton
          label="Next"
          primary={true}
          disabled={this.state.maxVoters === votesLength}
          onClick={() => {
            this.setState({ maxVoters: this.state.maxVoters + 1 });
          }}
        />

        <p>{`${this.state.maxVoters} of ${votesLength} votes`}</p>
      </div>
    );
  }
}
