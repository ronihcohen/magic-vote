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
  imgUrl: dataToJS(firebase, "imgUrl")
}))
export default class Config extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optionsNumber: 5,
      wasSaved: false
    };
    this.debouncedAfterSave = debounce(this.afterSave, 1000);
  }

  afterSave = () => {
    this.setState({ wasSaved: true });
  };

  render() {
    const { firebase, imgUrl } = this.props;

    return !isLoaded(imgUrl) ? (
      <CircularProgress />
    ) : (
      <Paper className={classes.paper}>
        <Subheader>System Configuration</Subheader>
        <div className={classes.container}>
          <SelectField
            floatingLabelText="Votes per user"
            value={this.state.optionsNumber}
            onChange={(e, value) => this.setState({ optionsNumber: value })}
          >
            <MenuItem value={1} primaryText="1" />
            <MenuItem value={2} primaryText="2" />
            <MenuItem value={3} primaryText="3" />
            <MenuItem value={4} primaryText="4" />
            <MenuItem value={5} primaryText="5" />
            <MenuItem value={6} primaryText="6" />
            <MenuItem value={7} primaryText="7" />
          </SelectField>
          <TextField floatingLabelText="Floating Label Text" />
          <TextField floatingLabelText="Floating Label Text" />
          <TextField floatingLabelText="Floating Label Text" />
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
