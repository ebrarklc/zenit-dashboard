import React, { useEffect, useState } from "react";
import ZenitMap from "../components/ZenitMap";
import JoystickPanel from "../components/JoystickPanel";
import EmergencyPanel from "../components/EmergencyPanel";

const MapPage = () => {
  const [position, setPosition] = useState({ x: 1, y: 1 });
  const [visited, setVisited] = useState([]);
  const [direction, setDirection] = useState("N");
  const [currentStep, setCurrentStep] = useState(0);

  // Simüle görev noktaları
  const scenario = [
    { nokta: "A5", islem: "al" },
    { nokta: "G6", islem: "birak" },
    { nokta: "B9", islem: "al" },
  ];

  const parsePoint = (p) => {
    const letter = p.nokta[0].toUpperCase();
    const number = parseInt(p.nokta.slice(1));
    return {
      x: letter.charCodeAt(0) - 65,
      y: number - 1
    };
  };

  const taskPoints = scenario.map(parsePoint);
  const activeTask = taskPoints[currentStep];

  const moveForward = () => {
    setPosition((prev) => {
      const newPos = { ...prev };
      if (direction === "N") newPos.y = Math.max(prev.y - 1, 0);
      if (direction === "S") newPos.y = Math.min(prev.y + 1, 19);
      if (direction === "E") newPos.x = Math.min(prev.x + 1, 19);
      if (direction === "W") newPos.x = Math.max(prev.x - 1, 0);
      return newPos;
    });
  };

  const turnLeft = () => {
    const dirs = ["N", "W", "S", "E"];
    setDirection((d) => dirs[(dirs.indexOf(d) + 1) % 4]);
  };

  const turnRight = () => {
    const dirs = ["N", "E", "S", "W"];
    setDirection((d) => dirs[(dirs.indexOf(d) + 1) % 4]);
  };

  const stop = () => alert("Robot durdu.");

  useEffect(() => {
    const key = `${position.x},${position.y}`;
    setVisited((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }, [position]);

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
        Harita (Yön: {direction})
      </h2>
      <ZenitMap
        robotPosition={position}
        visited={visited}
        taskPoints={taskPoints}
        activeTask={activeTask}
      />
      <JoystickPanel
        onForward={moveForward}
        onTurnLeft={turnLeft}
        onTurnRight={turnRight}
        onStop={stop}
      />
      <EmergencyPanel />
    </div>
  );
};

export default MapPage;
