import React from "react";
import classes from "./Score.scss";

const points = value => {
  return value === 1 ? "point" : "points";
};

const Score = ({ value }) => (
  <div className={classes.score}>
    <span>{value}</span>
    <br />
    <span className={classes.points}>{points(value)}</span>
  </div>
);

export default Score;
