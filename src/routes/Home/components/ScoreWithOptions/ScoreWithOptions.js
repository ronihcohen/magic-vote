import classes from "./ScoreWithOptions.scss";
import React from "react";
import PropTypes from "prop-types";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

const ScoreWithOptions = ({ value, handleChange, options, selectedOption }) => {
  if (selectedOption) {
    options = [selectedOption];
  }
  return (
    <div className={classes.container}>
      <div className={classes.score}>{value}</div>
      <SelectField
        floatingLabelText="Options"
        value={selectedOption}
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
