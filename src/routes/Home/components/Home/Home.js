import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { map, filter, find, size } from "lodash";
import Theme from "theme";
import { browserHistory } from "react-router";
import { compose } from "redux";

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

import ScoreWithOptions from "../ScoreWithOptions";

import classes from "./Home.scss";

const enhance = compose(
  firebaseConnect(props => {
    return [
      { path: `options/${props.competitionName}`, queryParams: ["orderByKey"] },
      { path: "votes" },
      { path: "optionsNumber" },
      { path: "imgUrl" }
    ];
  }),
  connect(({ firebase }, props) => ({
    options: dataToJS(firebase, `options/${props.competitionName}`),
    account: pathToJS(firebase, "profile"),
    optionsNumber: dataToJS(firebase, "optionsNumber"),
    imgUrl: dataToJS(firebase, "imgUrl"),
    votes: dataToJS(firebase, "votes"),
    auth: pathToJS(firebase, "auth")
  }))
);

class Home extends Component {
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
    currentVote: JSON.parse(localStorage.getItem("currentVote")) || {},
    submitting: false
  };

  handleChange = (score, option) => {
    let newVote = { ...this.state.currentVote };
    newVote[score] = option;
    this.setState({
      currentVote: newVote
    });
    localStorage.setItem("currentVote", JSON.stringify(newVote));
  };

  getUserVotesSize = () => {
    const { votes, auth, competitionName } = this.props;
    if (
      !votes ||
      !votes[competitionName] ||
      !votes[competitionName][auth.uid]
    ) {
      return 0;
    }
    const userVotesSize = size(votes[competitionName][auth.uid]);
    return userVotesSize;
  };

  handleSubmit = (score, option) => {
    const {
      auth,
      firebase,
      optionsNumber,
      votes,
      competitionName
    } = this.props;
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

    return firebase.set(
      `/votes/${competitionName}/${auth.uid}/`,
      this.state.currentVote,
      err => {
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
        localStorage.removeItem("currentVote");
      }
    );
  };

  handleClean() {
    this.setState({
      currentVote: {}
    });
    localStorage.removeItem("currentVote");
  }

  componentWillMount() {
    const { auth } = this.props;
    if (!auth || !auth.uid) {
      browserHistory.push("/login");
    }
  }
  render() {
    const { votes, options, auth, optionsNumber, imgUrl } = this.props;
    const { error, currentVote } = this.state;

    if (!auth || !auth.uid) {
      return (
        <div className={classes.container}>
          <h2 className={classes.scoreRow}>Please login first</h2>
        </div>
      );
    }

    if (this.getUserVotesSize() > 0) {
      return (
        <div className={classes.container}>
          <h2 className={classes.scoreRow}>Thank you for your vote!</h2>
          <img src={imgUrl} style={{ width: "320px", borderRadius: "10px" }} />
        </div>
      );
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
        <img src={imgUrl} style={{ width: "220px", borderRadius: "10px" }} />
        <br />
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

export default enhance(Home);
