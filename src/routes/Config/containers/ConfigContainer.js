import React, { Component } from "react";
import Paper from "material-ui/Paper";
import classes from "./ConfigContainer.scss";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import TextField from "material-ui/TextField";
import Subheader from "material-ui/Subheader";
import CircularProgress from "material-ui/CircularProgress";
import Snackbar from "material-ui/Snackbar";
import { debounce } from "lodash";

import {
  firebaseConnect,
  isLoaded,
  pathToJS,
  dataToJS // needed for full list and once
  // orderedToJS, // needed for ordered list
  // populatedDataToJS // needed for populated list
} from "react-redux-firebase";
import { connect } from "react-redux";

@firebaseConnect(["/"])
@connect(({ firebase }) => ({
  imgUrl: dataToJS(firebase, "imgUrl"),
  optionsNumber: dataToJS(firebase, "optionsNumber"),
  competitionName: dataToJS(firebase, "competitionName")
}))
export default class Config extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wasSaved: false
    };
    this.debouncedAfterSave = debounce(this.afterSave, 1000);
  }

  afterSave = () => {
    this.setState({ wasSaved: true });
  };

  render() {
    const { firebase, imgUrl, optionsNumber, competitionName } = this.props;

    return !isLoaded(imgUrl, optionsNumber, competitionName) ? (
      <CircularProgress />
    ) : (
      <Paper className={classes.paper}>
        <Subheader>System Configuration</Subheader>
        <div className={classes.container}>
          <SelectField
            floatingLabelText="Votes per user"
            value={optionsNumber}
            onChange={(e, value) =>
              firebase
                .set("optionsNumber", value)
                .then(this.debouncedAfterSave())}
          >
            {[...Array(10)].map((e, i) => (
              <MenuItem value={i} primaryText={i + " votes"} />
            ))}
          </SelectField>
          <TextField
            floatingLabelText="Competition Name"
            value={competitionName}
            onChange={(e, value) =>
              firebase
                .set("competitionName", value)
                .then(this.debouncedAfterSave())}
          />
          <TextField
            floatingLabelText="Image URL"
            fullWidth={true}
            value={imgUrl}
            onChange={(e, value) =>
              firebase.set("imgUrl", value).then(this.debouncedAfterSave())}
          />
        </div>

        <Snackbar
          open={this.state.wasSaved}
          message={"Saved!"}
          autoHideDuration={1000}
          onRequestClose={() => this.setState({ wasSaved: false })}
        />
      </Paper>
    );
  }
}
