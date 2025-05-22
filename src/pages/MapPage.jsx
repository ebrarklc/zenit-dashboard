import React, { useState } from "react";
import ZenitMap from "../components/ZenitMap";
import JoystickPanel from "../components/JoystickPanel";

const MapPage = () => {
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [direction, setDirection] = useState("N");

  const moveForward = () => {
    setPosition((prev) => {
      switch (direction) {
        case "N": return { ...prev, y: Math.max(prev.y - 1, 0) };
        case "S": return { ...prev, y: Math.min(prev.y + 1, 19) };
        case "E": return { ...prev, x: Math.min(prev.x + 1, 19) };
        case "W": return { ...prev, x: Math.max(prev.x - 1, 0) };
        default: return prev;
      }
    });
  };

  const turnLeft = () => {
    const directions = ["N", "W", "S", "E"];
    const index = directions.indexOf(direction);
    setDirection(directions[(index + 1) % 4]);
  };

  const turnRight = () => {
    const directions = ["N", "E", "S", "W"];
    const index = directions.indexOf(direction);
    setDirection(directions[(index + 1) % 4]);
  };

  const stop = () => {
    alert("Robot durduruldu.");
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Harita (Yön: {direction})</h2>
      <ZenitMap robotPosition={position} />
      <JoystickPanel
        onForward={moveForward}
        onTurnLeft={turnLeft}
        onTurnRight={turnRight}
        onStop={stop}
      />
    </div>
  );
};

export default MapPage;
