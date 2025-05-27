import React, { useEffect, useState } from "react";
import ZenitMap from "../components/ZenitMap";
import JoystickPanel from "../components/JoystickPanel";
import EmergencyPanel from "../components/EmergencyPanel";
import StatusPanel from "../components/StatusPanel";
import LogPanel from "../components/LogPanel";
import { toast } from 'react-toastify';

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
  const [battery, setBattery] = useState(72);
  const [autoMode, setAutoMode] = useState(false);
  const [emergencyStop, setEmergencyStop] = useState(false);

  const playSound = (filename) => {
    const audio = new Audio(`/sounds/${filename}`);
    audio.play();
  };

  const barriers = [
    { x: 3, y: 3 },
    { x: 4, y: 3 },
    { x: 5, y: 3 },
  ];

  const chargingStations = [{ x: 10, y: 10 }];

  const [scenario, setScenario] = useState([
    { nokta: "A5", islem: "al" },
    { nokta: "G6", islem: "birak" },
    { nokta: "B9", islem: "al" },
  ]);

  const parsePoint = (p) => {
    const letter = p.nokta[0].toUpperCase();
    const number = parseInt(p.nokta.slice(1));
    return { x: letter.charCodeAt(0) - 65, y: number - 1 };
  };

  const taskPoints = scenario.map(parsePoint);
  const activeTask = taskPoints[currentStep];

  const addLog = (message) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };

  const moveForward = () => {
    if (emergencyStop) return;
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
    if (emergencyStop) return;
    const dirs = ["N", "W", "S", "E"];
    setDirection((d) => {
      const newDir = dirs[(dirs.indexOf(d) + 1) % 4];
      addLog(`Yön değişti: ${newDir}`);
      return newDir;
    });
  };

  const turnRight = () => {
    if (emergencyStop) return;
    const dirs = ["N", "E", "S", "W"];
    setDirection((d) => {
      const newDir = dirs[(dirs.indexOf(d) + 1) % 4];
      addLog(`Yön değişti: ${newDir}`);
      return newDir;
    });
  };

  const stop = () => {
    if (emergencyStop) return;
    alert("Robot durdu.");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:8080/api/status")
        .then((res) => res.json())
        .then((data) => {
          setPosition({ x: data.x, y: data.y });
          setDirection(data.direction);
          setQr(data.qr);
          setRfid(data.rfid);
          setCarrying(data.carrying);
          setBarrier(data.barrier);
          setCharging(data.charging);
          setBattery(data.battery);
          addLog("🔄 Robot durumu güncellendi");
        })
        .catch((err) => {
          console.error("Veri alınamadı:", err);
          addLog("⚠️ Backend'den veri alınamadı.");
        });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!autoMode || emergencyStop) return;
    const interval = setInterval(() => {
      const currentTask = scenario[currentStep];
      if (!currentTask) {
        clearInterval(interval);
        setAutoMode(false);
        addLog("✅ Senaryo tamamlandı.");
        playSound("complete.mp3");
        return;
      }
      const taskCoords = parsePoint(currentTask);
      const dx = taskCoords.x - position.x;
      const dy = taskCoords.y - position.y;
      if (dx !== 0) {
        setPosition((prev) => ({ ...prev, x: prev.x + Math.sign(dx) }));
      } else if (dy !== 0) {
        setPosition((prev) => ({ ...prev, y: prev.y + Math.sign(dy) }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [autoMode, emergencyStop, position, currentStep]);

  useEffect(() => {
    const key = `${position.x},${position.y}`;
    setVisited((prev) => (prev.includes(key) ? prev : [...prev, key]));

    const currentTask = scenario[currentStep];
    const taskCoords = parsePoint(currentTask);

    if (position.x === taskCoords.x && position.y === taskCoords.y) {
      if (currentTask.islem === "al") {
        setCarrying(true);
        addLog(`Yük alındı: ${currentTask.nokta}`);
        playSound("pickup.mp3");
        toast.success("✅ Yük alındı!");
      } else if (currentTask.islem === "birak") {
        setCarrying(false);
        addLog(`Yük bırakıldı: ${currentTask.nokta}`);
        playSound("drop.mp3");
        toast.info("📦 Yük bırakıldı!");
      }
      if (currentStep + 1 < scenario.length) {
        setCurrentStep(currentStep + 1);
        addLog(`Görev ilerletildi: ${scenario[currentStep + 1].nokta} (${scenario[currentStep + 1].islem})`);
      }
    }

    const qrCode = `Q${position.x}${position.y}`;
    setQr(qrCode);
    addLog(`📶 QR okundu: ${qrCode}`);

    if (position.x === 5 && position.y === 5) {
      if (rfid !== "TAG-XY102") {
        setRfid("TAG-XY102");
        addLog("💾 RFID okundu: TAG-XY102");
      }
    }

    const inBarrier = barriers.some(b => b.x === position.x && b.y === position.y);
    setBarrier(inBarrier);
    if (inBarrier) addLog("🚫 Engel bölgesine girildi!");

    const inCharging = chargingStations.some(s => s.x === position.x && s.y === position.y);
    setCharging(inCharging);
    if (inCharging) addLog("🔌 Şarj alanına girildi.");
  }, [position]);

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Harita (Yön: {direction})</h2>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <button onClick={() => {
          setAutoMode(true);
          setEmergencyStop(false);
          addLog("▶️ Otomatik senaryo başlatıldı.");
        }} style={{ backgroundColor: "#3b82f6", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
          Simülasyonu Başlat
        </button>
        <button onClick={() => {
          setEmergencyStop(true);
          setAutoMode(false);
          addLog("❌ Acil Durdurma Uygulandı!");
          toast.error("❌ Acil durdurma uygulandı!");
        }} style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginLeft: "10px" }}>
          ACİL DURDUR
        </button>
      </div>

      {logs[logs.length - 1]?.includes("Yük alındı") && (
        <div style={{ color: "green", textAlign: "center", fontSize: "24px", animation: "blink 1s infinite" }}>
          ✅ YÜK ALINDI!
        </div>
      )}
      {logs[logs.length - 1]?.includes("Yük bırakıldı") && (
        <div style={{ color: "orange", textAlign: "center", fontSize: "24px", animation: "blink 1s infinite" }}>
          📦 YÜK BIRAKILDI!
        </div>
      )}

      <style>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.2; }
          100% { opacity: 1; }
        }
      `}</style>

      <ZenitMap robotPosition={position} visited={visited} taskPoints={taskPoints} activeTask={activeTask} barriers={barriers} chargingStations={chargingStations} />

      <StatusPanel data={{ battery, charging, barrier, x: position.x, y: position.y, direction, qr, rfid, carrying }} />

      <JoystickPanel onForward={moveForward} onTurnLeft={turnLeft} onTurnRight={turnRight} onStop={stop} />
      <EmergencyPanel />
      <LogPanel logs={logs} />
    </div>
  );
};

export default MapPage;