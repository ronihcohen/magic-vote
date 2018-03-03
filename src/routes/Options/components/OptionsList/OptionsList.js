import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  firebaseConnect,
  pathToJS,
  isLoaded,
  dataToJS
} from "react-redux-firebase";
import { map } from "lodash";

import LoadingSpinner from "components/LoadingSpinner";
import Snackbar from "material-ui/Snackbar";
import { List } from "material-ui/List";
import Paper from "material-ui/Paper";
import Subheader from "material-ui/Subheader";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import { ListItem } from "material-ui/List";

import classes from "./OptionsList.scss";

const enhance = compose(
  firebaseConnect(props => {
    return [
      { path: `options/${props.competitionName}`, queryParams: ["orderByKey"] }
    ];
  }),
  connect(({ firebase }, props) => ({
    options: dataToJS(firebase, `options/${props.competitionName}`),
    account: pathToJS(firebase, "profile")
  }))
);

class OptionsList extends Component {
  constructor(props) {
    super(props);
    const { account } = this.props;
    this.state = {
      newOption: "",
      wasSaved: false,
      user: account.displayName
    };
  }

  handleKeyPress = event => {
    if (event.key == "Enter") {
      this.handleAdd();
    }
  };

  handleAdd = () => {
    const { competitionName } = this.props;
    const { newOption, user } = this.state;

    if (!newOption) {
      return;
    }
    this.setState({ newOption: "", user: "" });
    return this.props.firebase
      .push("/options/" + competitionName, {
        text: newOption,
        user: user
      })
      .then(() => {
        this.setState({ wasSaved: true });
      });
  };

  render() {
    const { options, competitionName, account } = this.props;

    return !isLoaded(options) ? (
      <LoadingSpinner />
    ) : (
      <Paper className={classes.paper}>
        <Subheader>Competing Dishes</Subheader>
        {account ? (
          <div className={classes.inputContainer}>
            <TextField
              value={this.state.newOption}
              floatingLabelText="Add your dish"
              onKeyPress={this.handleKeyPress}
              onChange={({ target }) =>
                this.setState({ newOption: target.value })}
            />
            <br />
            <TextField
              value={this.state.user}
              floatingLabelText="Chef's name"
              onKeyPress={this.handleKeyPress}
              onChange={({ target }) => this.setState({ user: target.value })}
            />
            <br />
            <RaisedButton
              onClick={this.handleAdd}
              icon={<ContentAdd />}
              primary={true}
              label="Save"
            />
          </div>
        ) : (
          <p className={classes.warningMessage}>
            You must login before adding your dish
          </p>
        )}
        <List className={classes.list}>
          {options &&
            map(options, (option, id) => (
              <ListItem
                primaryText={option.text}
                secondaryText={option.user}
                key={id}
              />
            ))}
        </List>

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

// Export enhanced component
export default enhance(OptionsList);
