import React, { useEffect, useState } from "react";
import ZenitMap from "../components/ZenitMap";
import JoystickPanel from "../components/JoystickPanel";
import EmergencyPanel from "../components/EmergencyPanel";
import StatusPanel from "../components/StatusPanel";
import LogPanel from "../components/LogPanel";

const MapPage = () => {
  const [position, setPosition] = useState({ x: 1, y: 1 });
  const [visited, setVisited] = useState([]);
  const [direction, setDirection] = useState("N");
  const [currentStep, setCurrentStep] = useState(0);
  const [carrying, setCarrying] = useState(false);
  const [logs, setLogs] = useState([]);



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
    let newPos = { ...prev };
    if (direction === "N") newPos.y = Math.max(prev.y - 1, 0);
    if (direction === "S") newPos.y = Math.min(prev.y + 1, 19);
    if (direction === "E") newPos.x = Math.min(prev.x + 1, 19);
    if (direction === "W") newPos.x = Math.max(prev.x - 1, 0);
    if (newPos.x !== prev.x || newPos.y !== prev.y) {
      addLog(`Pozisyon değişti: (${newPos.x}, ${newPos.y})`);
    }
    return newPos;
  });
};

  const turnLeft = () => {
  const dirs = ["N", "W", "S", "E"];
  setDirection((d) => {
    const newDir = dirs[(dirs.indexOf(d) + 1) % 4];
    addLog(`Yön değişti: ${newDir}`);
    return newDir;
  });
};


  const turnRight = () => {
    const dirs = ["N", "E", "S", "W"];
    setDirection((d) => dirs[(dirs.indexOf(d) + 1) % 4]);
  };

  const stop = () => alert("Robot durdu.");

  const addLog = (message) => {
  setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
};


 useEffect(() => {
  const key = `${position.x},${position.y}`;
  setVisited((prev) => (prev.includes(key) ? prev : [...prev, key]));

  const currentTask = scenario[currentStep];
  const taskCoords = parsePoint(currentTask);

 if (position.x === taskCoords.x && position.y === taskCoords.y) {
  if (currentTask.islem === "al") {
    setCarrying(true);
    addLog(`Yük alındı: ${currentTask.nokta}`);
  } else if (currentTask.islem === "birak") {
    setCarrying(false);
    addLog(`Yük bırakıldı: ${currentTask.nokta}`);
  }

  if (currentStep + 1 < scenario.length) {
    setCurrentStep(currentStep + 1);
    addLog(`Görev ilerletildi: ${scenario[currentStep + 1].nokta} (${scenario[currentStep + 1].islem})`);
  }
}

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
      <StatusPanel
  data={{
    battery: 72,
    charging: false,
    barrier: false,
    x: position.x,
    y: position.y,
    direction: direction,
    qr: "QA4.1",
    rfid: "TAG-123456",
    carrying: carrying,
  }}
/>

      <JoystickPanel
        onForward={moveForward}
        onTurnLeft={turnLeft}
        onTurnRight={turnRight}
        onStop={stop}
      />
      <EmergencyPanel />
      <LogPanel logs={logs} />
    </div>
  );
};

export default MapPage;
