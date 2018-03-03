import classes from "./ScoreWithOptions.scss";
import React from "react";
import PropTypes from "prop-types";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import Score from "components/Score";
import { find } from "lodash";

const points = value => {
  return value === 1 ? "point" : "points";
};

const shouldShowOption = (option, currentVote, selectedOption) => {
  if (option.text === selectedOption) {
    return true;
  }
  return !find(currentVote, (vote, id) => vote === option.text);
};

const ScoreWithOptions = ({
  value,
  handleChange,
  options,
  selectedOption,
  currentVote
}) => {
  return (
    <div className={classes.container}>
      <Score value={value} />
      <SelectField
        style={{ marginLeft: "20px" }}
        value={selectedOption}
        hintText={`Your vote for ${value} ${points(value)}`}
        onChange={(event, index, option) => handleChange(value, option)}
      >
        {options.map(
          option =>
            shouldShowOption(option, currentVote, selectedOption) ? (
              <MenuItem
                value={option.text}
                primaryText={option.text}
                key={option.text}
              />
            ) : null
        )}
      </SelectField>
    </div>
  );
};

export default ScoreWithOptions;
