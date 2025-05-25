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
  const [qr, setQr] = useState("YOK");
  const [rfid, setRfid] = useState("YOK");
  const [barrier, setBarrier] = useState(false);
  const [charging, setCharging] = useState(false);

  // Engel bölgeleri
  const barriers = [
    { x: 3, y: 3 },
    { x: 4, y: 3 },
    { x: 5, y: 3 },
  ];

  // Şarj noktaları
  const chargingStations = [
    { x: 10, y: 10 },
  ];

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
      y: number - 1,
    };
  };

  const taskPoints = scenario.map(parsePoint);
  const activeTask = taskPoints[currentStep];

  const addLog = (message) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };

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
    setDirection((d) => {
      const newDir = dirs[(dirs.indexOf(d) + 1) % 4];
      addLog(`Yön değişti: ${newDir}`);
      return newDir;
    });
  };

  const stop = () => alert("Robot durdu.");

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
        addLog(
          `Görev ilerletildi: ${scenario[currentStep + 1].nokta} (${scenario[currentStep + 1].islem})`
        );
      }
    }

    // QR simülasyonu
    const qrCode = `Q${position.x}${position.y}`;
    setQr(qrCode);
    addLog(`📶 QR okundu: ${qrCode}`);

    // RFID sadece belirli noktada tetiklenir
    if (position.x === 5 && position.y === 5) {
      if (rfid !== "TAG-XY102") {
        setRfid("TAG-XY102");
        addLog("💾 RFID okundu: TAG-XY102");
      }
    }

    // Engel kontrolü
    const inBarrier = barriers.some(b => b.x === position.x && b.y === position.y);
    setBarrier(inBarrier);
    if (inBarrier) addLog("🚫 Engel bölgesine girildi!");

    // Şarj kontrolü
    const inCharging = chargingStations.some(s => s.x === position.x && s.y === position.y);
    setCharging(inCharging);
    if (inCharging) addLog("🔌 Şarj alanına girildi.");

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
        barriers={barriers}
        chargingStations={chargingStations}
      />
      <StatusPanel
        data={{
          battery: 72,
          charging: charging,
          barrier: barrier,
          x: position.x,
          y: position.y,
          direction: direction,
          qr: qr,
          rfid: rfid,
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
