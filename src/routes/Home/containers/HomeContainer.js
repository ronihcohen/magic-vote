import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { map, filter, find, size } from "lodash";
import Theme from "theme";
import { browserHistory } from "react-router";

import {
  firebaseConnect,
  isLoaded,
  pathToJS,
  dataToJS // needed for full list and once
  // orderedToJS, // needed for ordered list
  // populatedDataToJS // needed for populated list
} from "react-redux-firebase";
import CircularProgress from "material-ui/CircularProgress";
import Snackbar from "material-ui/Snackbar";
import RaisedButton from "material-ui/RaisedButton";
import Subheader from "material-ui/Subheader";

import ScoreWithOptions from "../components/ScoreWithOptions";

import classes from "./HomeContainer.scss";

// const populates = [{ child: 'owner', root: 'users', keyProp: 'uid' }]

@firebaseConnect([
  { path: "votes" },
  { path: "optionsNumber" },
  { path: "options", queryParams: ["orderByKey"] }
])
@connect(({ firebase }) => ({
  auth: pathToJS(firebase, "auth"),
  account: pathToJS(firebase, "profile"),
  votes: dataToJS(firebase, "votes"),
  options: dataToJS(firebase, "options"),
  optionsNumber: dataToJS(firebase, "optionsNumber")
}))
export default class Home extends Component {
  static propTypes = {
    votes: PropTypes.oneOfType([
      PropTypes.object, // object if using dataToJS
      PropTypes.array // array if using orderedToJS
    ]),
    options: PropTypes.oneOfType([
      PropTypes.object, // object if using dataToJS
      PropTypes.array // array if using orderedToJS
    ]),
    firebase: PropTypes.shape({
      set: PropTypes.func.isRequired,
      remove: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
      database: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
    }),
    auth: PropTypes.shape({
      uid: PropTypes.string
    })
  };

  state = {
    error: null,
    currentVote: {}
  };

  handleChange = (score, option) => {
    let newVote = { ...this.state.currentVote };
    newVote[score] = option;
    this.setState({
      currentVote: newVote
    });
  };

  handleSubmit = (score, option) => {
    const { auth, firebase, optionsNumber, votes } = this.props;
    const currentVoteSize = size(this.state.currentVote);

    const myVotes = votes && votes[auth.uid] ? votes[auth.uid] : {};

    if (size(myVotes) > 0) {
      return this.setState({ error: "Sorry, you can vote one time only" });
    }

    if (currentVoteSize !== parseInt(optionsNumber)) {
      return this.setState({ error: "One or more votes are missing" });
    }

    if (!auth || !auth.uid) {
      return this.setState({ error: "You must be Logged into Toggle Done" });
    }

    return firebase.set(`/votes/${auth.uid}/`, this.state.currentVote, err => {
      if (err) {
        return this.setState({ error: "ERROR! please try again :-(" });
      }
      this.setState({ error: "Your votes submitted successfully" });
    });
  };

  handleClean() {
    const { auth, firebase } = this.props;
    return firebase.remove(`/votes/${auth.uid}`).catch(err => {
      console.error("Error cleaning votes: ", err); // eslint-disable-line no-console
      this.setState({ error: "Error cleaning todo" });
      return Promise.reject(err);
    });
  }
  componentWillMount() {
    const { auth } = this.props;
    if (!auth || !auth.uid) {
      browserHistory.push("/login");
    }
  }
  render() {
    const { votes, options, auth, optionsNumber } = this.props;
    const { error, currentVote } = this.state;

    const filteredOptions = filter(
      options,
      (option, id) => !find(currentVote, (vote, id) => vote === option)
    );

    if (!auth || !auth.uid) {
      return <Subheader>Please login</Subheader>;
    }

    const optionsArray = map(options, (option, id) => option);

    const scoresArray = optionsNumber
      ? [...Array(parseInt(optionsNumber))]
      : [];

    return isLoaded(optionsNumber) ? (
      <div
        className={classes.container}
        style={{ color: Theme.palette.primary2Color }}
      >
        {scoresArray.map((x, i) => (
          <div className={classes.scoreRow} key={i}>
            <ScoreWithOptions
              key={scoresArray.length - i}
              value={scoresArray.length - i}
              selectedOption={this.state.currentVote[scoresArray.length - i]}
              options={filteredOptions}
              handleChange={this.handleChange}
            />
          </div>
        ))}
        <div className={classes.scoreRow}>
          <RaisedButton
            label="Submit"
            primary={true}
            onClick={() => this.handleSubmit()}
          />
        </div>
        {error ? (
          <Snackbar
            open={!!error}
            message={error}
            autoHideDuration={4000}
            onRequestClose={() => this.setState({ error: null })}
          />
        ) : null}
      </div>
    ) : null;
  }
}
