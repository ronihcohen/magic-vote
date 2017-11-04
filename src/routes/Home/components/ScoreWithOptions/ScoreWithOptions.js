import classes from "./ScoreWithOptions.scss";
import React from "react";
import PropTypes from "prop-types";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import Score from "../Score";

const points = value => {
  return value === 1 ? "point" : "points";
};

const ScoreWithOptions = ({ value, handleChange, options, selectedOption }) => {
  if (selectedOption) {
    options = [selectedOption];
  }

  return (
    <div className={classes.container}>
      <Score value={value} />
      <SelectField
        style={{ marginLeft: "20px" }}
        value={selectedOption}
        hintText={`Your vote for ${value} ${points(value)}`}
        onChange={(event, index, option) => handleChange(value, option)}
      >
        {options.map(option => (
          <MenuItem value={option} primaryText={option} key={option} />
        ))}
      </SelectField>
    </div>
  );
};

export default ScoreWithOptions;
