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
    currentVote: {},
    submitting: false
  };

  handleChange = (score, option) => {
    let newVote = { ...this.state.currentVote };
    newVote[score] = option;
    this.setState({
      currentVote: newVote
    });
  };

  getUserVotesSize = () => {
    const { votes, auth } = this.props;
    if (!votes || !votes[auth.uid]) {
      return 0;
    }
    const userVotesSize = size(votes[auth.uid]);
    console.log(`Current user votes size: ${userVotesSize}`);
    return userVotesSize;
  };

  handleSubmit = (score, option) => {
    const { auth, firebase, optionsNumber, votes } = this.props;
    const currentVoteSize = size(this.state.currentVote);

    this.setState({ submitting: true });

    if (this.getUserVotesSize() > 0) {
      return this.setState({
        error: "Sorry, you can vote one time only",
        submitting: false
      });
    }

    if (currentVoteSize !== parseInt(optionsNumber)) {
      return this.setState({
        error: "One or more votes are missing",
        submitting: false
      });
    }

    if (!auth || !auth.uid) {
      return this.setState({
        error: "You must be logged in.",
        submitting: false
      });
    }

    return firebase.set(`/votes/${auth.uid}/`, this.state.currentVote, err => {
      if (err) {
        return this.setState({
          error: "ERROR! please try again :-(",
          submitting: false
        });
      }
      this.setState({
        error: "Your votes submitted successfully",
        submitting: false
      });
    });
  };

  handleClean() {
    this.setState({
      currentVote: {}
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

    if (!auth || !auth.uid) {
      return <h2 className={classes.scoreRow}>Please login first.</h2>;
    }

    if (this.getUserVotesSize() > 0) {
      return <h2 className={classes.scoreRow}>Thank you for your vote!</h2>;
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
              selectedOption={currentVote[scoresArray.length - i]}
              options={optionsArray}
              handleChange={this.handleChange}
              currentVote={currentVote}
            />
          </div>
        ))}
        <div className={classes.scoreRow}>
          {this.state.submitting ? (
            <CircularProgress />
          ) : (
            <div className={classes.scoreRow}>
              <RaisedButton
                label="Submit"
                primary={true}
                disabled={this.state.submitting}
                onClick={() => this.handleSubmit()}
              />
              <br />
              <RaisedButton
                label="Clear"
                secondary={true}
                onClick={() => this.handleClean()}
              />
            </div>
          )}
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
