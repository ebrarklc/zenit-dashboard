import React, { useEffect, useState } from "react";
import ZenitMap from "../components/ZenitMap";

const MapPage = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Her saniyede 1 konum sağa kay
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => ({
        x: (prev.x + 1) % 20,
        y: prev.y,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "16px" }}>Harita</h2>
      <ZenitMap robotPosition={position} />
    </div>
  );
};

export default MapPage;
