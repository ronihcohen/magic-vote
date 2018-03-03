import React, { Component } from "react";
import { connect } from "react-redux";
import OptionsList from "../components/OptionsList/OptionsList";

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
export default class Options extends Component {
  render() {
    return !isLoaded(this.props.competitionName) ? (
      <LoadingSpinner />
    ) : (
      <OptionsList {...this.props} />
    );
  }
}
