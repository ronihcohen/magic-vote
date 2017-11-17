import React from "react";
import classes from "./ScorePanel.scss";
import Theme from "theme";
import Score from "components/Score";
import { fadeIn } from "react-animations";
import Radium, { StyleRoot } from "radium";

const styles = {
  fadeIn: {
    animation: "x 2s",
    animationName: Radium.keyframes(fadeIn, "fadeIn")
  }
};

const ScorePanel = ({ votes, header, fadeIn }) => (
  <div>
    <h2>{header}</h2>
    <div
      className={classes.scoreContainer}
      style={{ color: Theme.palette.primary2Color }}
    >
      {votes.map(
        (value, index) =>
          value ? (
            <StyleRoot key={index}>
              <div
                className={classes.score}
                style={fadeIn ? styles.fadeIn : null}
              >
                <div className={classes.title}>{value.option}</div> <br />
                <Score value={value.score} />
              </div>
            </StyleRoot>
          ) : null
      )}
    </div>
  </div>
);

export default ScorePanel;
