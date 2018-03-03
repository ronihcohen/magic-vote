import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./OptionItem.scss";
import { ListItem } from "material-ui/List";
import Checkbox from "material-ui/Checkbox";
import Delete from "material-ui/svg-icons/action/delete";
import { isObject } from "lodash";

export default class TodoItem extends Component {
  static propTypes = {
    option: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  render() {
    const { option, id, onDeleteClick } = this.props;

    return (
      <div className={classes.container}>
        <ListItem primaryText={option} />
      </div>
    );
  }
}
