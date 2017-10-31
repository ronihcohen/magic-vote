import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { map } from "lodash";
import Theme from "theme";
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

import Score from "../components/Score";
import Option from "../components/Option";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import classes from "./HomeContainer.scss";

// const populates = [{ child: 'owner', root: 'users', keyProp: 'uid' }]

@firebaseConnect([{ path: "votes" }])
@connect(({ firebase }) => ({
  auth: pathToJS(firebase, "auth"),
  account: pathToJS(firebase, "profile"),
  votes: dataToJS(firebase, "votes")
}))
export default class Home extends Component {
  static propTypes = {
    votes: PropTypes.oneOfType([
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
    error: null
  };

  handleDrop(index, item) {
    const { auth, firebase } = this.props;
    if (!auth || !auth.uid) {
      return this.setState({ error: "You must be Logged into Toggle Done" });
    }

    return firebase.set(`/votes/${auth.uid}/${index}/`, item.name);
  }

  handleClean() {
    const { auth, firebase } = this.props;
    return firebase.remove(`/votes/${auth.uid}`).catch(err => {
      console.error("Error cleaning votes: ", err); // eslint-disable-line no-console
      this.setState({ error: "Error cleaning todo" });
      return Promise.reject(err);
    });
  }

  render() {
    const { votes, auth } = this.props;
    const { error } = this.state;

    if (!auth || !auth.uid) {
      return <div>Please login</div>;
    }

    const myVotes = votes && votes[auth.uid] ? votes[auth.uid] : {};

    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div
          className={classes.container}
          style={{ color: Theme.palette.primary2Color }}
        >
          <div>
            <Option name="Banana" />
            <Option name="Tomato" />
          </div>
          <div>
            {[...Array(3)].map((x, i) => (
              <Score
                key={i + 1}
                value={i + 1}
                onDrop={item => this.handleDrop(i + 1, item)}
                option={myVotes[i + 1]}
              />
            ))}
          </div>
          <RaisedButton
            label="Clean votes"
            secondary={true}
            onClick={() => this.handleClean()}
          />
        </div>
      </DragDropContextProvider>
    );
  }
}
