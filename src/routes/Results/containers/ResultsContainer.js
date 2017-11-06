import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { forEach, map, sortBy, size } from "lodash";
import RaisedButton from "material-ui/RaisedButton";
import ScorePanel from "../components/ScorePanel";

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
      if (val) {
        const score = parseInt(key);
        results[val] = results.hasOwnProperty(val)
          ? results[val] + score
          : score;
      }
    });
  });
  return sortVotesByScore(results);
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
    const total = generateResults(votes, this.state.maxVoters, votesLength);
    const currentVote = getCurrentVote(votes, this.state.maxVoters);

    return (
      <div className={classes.container}>
        <ScorePanel
          votes={currentVote}
          header={`Vote #${this.state.maxVoters}`}
        />
        <ScorePanel votes={total} header="Total" />

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
