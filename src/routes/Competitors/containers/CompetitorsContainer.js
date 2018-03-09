import React, { Component } from "react";
import classes from "./CompetitorsContainer.scss";
import CircularProgress from "material-ui/CircularProgress";
import { map } from "lodash";

import { firebaseConnect, isLoaded, dataToJS } from "react-redux-firebase";
import { connect } from "react-redux";

@firebaseConnect(["/"])
@connect(({ firebase }) => ({
  options: dataToJS(firebase, "options"),
  competitionName: dataToJS(firebase, "competitionName"),
  imgUrl: dataToJS(firebase, "imgUrl")
}))
export default class Competitors extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { options, competitionName, imgUrl } = this.props;

    return isLoaded(options, competitionName) && options[competitionName] ? (
      <div>
        <h1>מתחרים</h1>
        <div className={classes.container}>
          {map(options[competitionName], (option, id) => (
            <div key={id} className={classes.option}>
              <p className={classes.title}>{option.text}</p>
              <p>{option.user}</p>
            </div>
          ))}
        </div>
        <img src={imgUrl} style={{ width: "320px", borderRadius: "10px" }} />
      </div>
    ) : (
      <CircularProgress />
    );
  }
}
