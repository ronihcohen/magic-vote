import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { forEach, map, sortBy } from "lodash";
import Theme from "theme";
import Score from "../../Home/components/Score";

import {
  firebaseConnect,
  isLoaded,
  pathToJS,
  dataToJS
} from "react-redux-firebase";
import classes from "./ResultsContainer.scss";
import Paper from "material-ui/Paper";

const generateResults = votes => {
  let results = {};
  forEach(votes, userVotesObject => {
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
  render() {
    const { votes } = this.props;
    if (!isLoaded(votes)) return null;

    let results = generateResults(votes);
    return (
      <div
        className={classes.container}
        style={{ color: Theme.palette.primary2Color }}
      >
        {results.map((value, index) => (
          <div className={classes.scoreRow} key={index}>
            <div className={classes.title}>{value.option}</div> <br />
            <Score value={value.score} />
          </div>
        ))}
      </div>
    );
  }
}
