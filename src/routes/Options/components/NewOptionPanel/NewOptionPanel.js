import React, { Component } from "react";
import PropTypes from "prop-types";
import IconButton from "material-ui/IconButton";
import Paper from "material-ui/Paper";
import TextField from "material-ui/TextField";
import ContentAdd from "material-ui/svg-icons/content/add";
import ContentSave from "material-ui/svg-icons/content/save";

import Subheader from "material-ui/Subheader";
import classes from "./NewOptionPanel.scss";

export default class NewOptionPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
  }

  static propTypes = {
    onNewClick: PropTypes.func,
    disabled: PropTypes.bool
  };

  handleAdd = () => {
    const { text } = this.state;
    const { newOption } = this.refs;

    this.props.onNewClick(text);
    this.setState({ text: "" });
  };

  handleKeyPress = event => {
    if (event.key == "Enter") {
      this.handleAdd();
    }
  };

  render() {
    const { disabled, number, imgUrl } = this.props;

    return (
      <div>
        <Paper className={classes.container}>
          <div className={classes.inputSection}>
            <TextField
              value={number}
              floatingLabelText="# options"
              type="number"
              onChange={({ target }) =>
                this.props.onSaveToDB("optionsNumber", target.value)}
            />
          </div>
          <br />
          <div className={classes.inputSection}>
            <TextField
              value={imgUrl}
              floatingLabelText="Image URL"
              onChange={({ target }) =>
                this.props.onSaveToDB("imgUrl", target.value)}
            />
          </div>
        </Paper>
        <Paper className={classes.container}>
          <div className={classes.inputSection}>
            <TextField
              value={this.state.text}
              floatingLabelText="New Option"
              onKeyPress={this.handleKeyPress}
              onChange={({ target }) => this.setState({ text: target.value })}
            />
            <IconButton
              onClick={this.handleAdd}
              disabled={disabled}
              tooltipPosition="top-center"
              tooltip={disabled ? "Login To Add Option" : "Add Option"}
            >
              <ContentAdd />
            </IconButton>
          </div>
        </Paper>
      </div>
    );
  }
}
