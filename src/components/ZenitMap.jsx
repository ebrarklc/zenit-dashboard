import React, { useEffect, useState } from "react";
import styled from "styled-components";

const MapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(20, 30px);
  grid-template-rows: repeat(20, 30px);
  gap: 1px;
  background-color: #ccc;
  padding: 10px;
  width: max-content;
  margin: 0 auto;
`;

const Cell = styled.div`
  width: 30px;
  height: 30px;
  background-color: ${({ isRobot, isVisited }) =>
    isRobot ? "limegreen" : isVisited ? "#bbb" : "white"};
  border: 1px solid #aaa;
`;

const ZenitMap = ({ robotPosition }) => {
  const [visited, setVisited] = useState([]);

  useEffect(() => {
    const posKey = `${robotPosition.x},${robotPosition.y}`;
    setVisited((prev) => (prev.includes(posKey) ? prev : [...prev, posKey]));
  }, [robotPosition]);

  const totalCells = 20 * 20;

  return (
    <MapGrid>
      {Array.from({ length: totalCells }).map((_, index) => {
        const x = index % 20;
        const y = Math.floor(index / 20);
        const key = `${x},${y}`;
        const isRobot = x === robotPosition.x && y === robotPosition.y;
        const isVisited = visited.includes(key) && !isRobot;

        return <Cell key={index} isRobot={isRobot} isVisited={isVisited} />;
      })}
    </MapGrid>
  );
};

export default ZenitMap;
