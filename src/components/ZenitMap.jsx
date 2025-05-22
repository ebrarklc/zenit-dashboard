import React from "react";
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
  background-color: ${({ isRobot }) => (isRobot ? "limegreen" : "white")};
  border: 1px solid #aaa;
`;

const ZenitMap = ({ robotPosition }) => {
  const totalCells = 20 * 20;

  const getIndex = (x, y) => y * 20 + x;

  return (
    <MapGrid>
      {Array.from({ length: totalCells }).map((_, index) => {
        const x = index % 20;
        const y = Math.floor(index / 20);
        const isRobot = x === robotPosition.x && y === robotPosition.y;

        return <Cell key={index} isRobot={isRobot} />;
      })}
    </MapGrid>
  );
};

export default ZenitMap;
