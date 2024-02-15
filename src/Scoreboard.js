import React from "react";

const Scoreboard = ({ round, time }) => {
  return (
    <div className="scoreboard">
      <label htmlFor="round">
        Round
        <input id="round" type="text" value={round} readOnly />
      </label>
      <label htmlFor="time">
        Time
        <input id="time" type="text" value={time} readOnly />
      </label>
    </div>
  );
};

export default Scoreboard;
