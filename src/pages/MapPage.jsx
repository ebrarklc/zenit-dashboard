import React from "react";
import ZenitMap from "../components/ZenitMap";

const mockPosition = { x: 5, y: 7 };

const MapPage = () => {
  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "16px" }}>Harita</h2>
      <ZenitMap robotPosition={mockPosition} />
    </div>
  );
};

export default MapPage;
