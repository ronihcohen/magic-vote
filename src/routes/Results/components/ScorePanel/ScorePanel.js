import React from "react";
import classes from "./ScorePanel.scss";
import Theme from "theme";
import Subheader from "material-ui/Subheader";
import Score from "components/Score";

const ScorePanel = ({ votes, header }) => (
  <div>
    <Subheader>{header}</Subheader>
    <div
      className={classes.scoreContainer}
      style={{ color: Theme.palette.primary2Color }}
    >
      {votes.map(
        (value, index) =>
          value ? (
            <div className={classes.score} key={index}>
              <div className={classes.title}>{value.option}</div> <br />
              <Score value={value.score} />
            </div>
          ) : null
      )}
    </div>
  </div>
);

export default ScorePanel;
