import React, { Component } from "react";
import { connect } from "react-redux";
import Home from "../components/Home/Home";

import {
  firebaseConnect,
  isLoaded,
  pathToJS,
  dataToJS
} from "react-redux-firebase";
import LoadingSpinner from "components/LoadingSpinner";

@firebaseConnect(["/"])
@connect(({ firebase }) => ({
  competitionName: dataToJS(firebase, "competitionName")
}))
export default class HomeContainer extends Component {
  render() {
    return !isLoaded(this.props.competitionName) ? (
      <LoadingSpinner />
    ) : (
      <Home {...this.props} />
    );
  }
}
