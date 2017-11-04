import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { forEach, map } from "lodash";
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

    let results = {};
    forEach(votes, userVotes => {
      forEach(userVotes, vote => {
        if (vote)
          results[vote] = results.hasOwnProperty(vote) ? results[vote] + 1 : 1;
      });
    });

    return (
      <div
        className={classes.container}
        style={{ color: Theme.palette.primary2Color }}
      >
        {map(results, (value, score) => (
          <div className={classes.scoreRow} key={score}>
            <div className={classes.title}>{score}</div> <br />
            <Score value={value} />
          </div>
        ))}
      </div>
    );
  }
}
