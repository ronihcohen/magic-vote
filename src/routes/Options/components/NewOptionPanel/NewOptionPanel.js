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
    const { disabled, number } = this.props;

    return (
      <Paper className={classes.container}>
        <div className={classes.inputSection}>
          <TextField
            style={{ width: "70px", marginRight: "10px" }}
            value={number}
            floatingLabelText="# options"
            type="number"
            onChange={({ target }) => this.props.onSetNumber(target.value)}
          />

          <TextField
            style={{ width: "150px" }}
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
    );
  }
}
