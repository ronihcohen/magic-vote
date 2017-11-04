import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { forEach, map, invert } from "lodash";
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
      forEach(userVotes, (val, key) => {
        if (val) {
          const scope = parseInt(key);
          results[val] = results.hasOwnProperty(val)
            ? results[val] + scope
            : scope;
        }
      });
    });

    return (
      <div
        className={classes.container}
        style={{ color: Theme.palette.primary2Color }}
      >
        {map(invert(results), (score, value) => (
          <div className={classes.scoreRow} key={score}>
            <div className={classes.title}>{score}</div> <br />
            <Score value={value} />
          </div>
        ))}
      </div>
    );
  }
}
