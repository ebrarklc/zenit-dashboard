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
  background-color: ${({ isRobot, isVisited, isTask, isActiveTask, isBarrier, isCharging }) =>
    isRobot ? "limegreen"
    : isActiveTask ? "#60a5fa"
    : isTask ? "#fbbf24"
    : isBarrier ? "#111827"
    : isCharging ? "#3b82f6"
    : isVisited ? "#e5e7eb"
    : "white"};
  width: 30px;
  height: 30px;
  border: 1px solid #aaa;
`;

const ZenitMap = ({
  robotPosition,
  visited,
  taskPoints = [],
  activeTask,
  barriers = [],
  chargingStations = [],
}) => {
  const totalCells = 20 * 20;

  return (
    <MapGrid>
      {Array.from({ length: totalCells }).map((_, index) => {
        const x = index % 20;
        const y = Math.floor(index / 20);
        const key = `${x},${y}`;

        const isRobot = x === robotPosition.x && y === robotPosition.y;
        const isVisited = visited.includes(key) && !isRobot;

        const taskMatch = taskPoints.find(p => p.x === x && p.y === y);
        const isActiveTask = activeTask && activeTask.x === x && activeTask.y === y;
        const isTask = !!taskMatch;

        const isBarrier = barriers.some(b => b.x === x && b.y === y);
        const isCharging = chargingStations.some(s => s.x === x && s.y === y);

        return (
          <Cell
            key={index}
            isRobot={isRobot}
            isVisited={isVisited}
            isTask={isTask}
            isActiveTask={isActiveTask}
            isBarrier={isBarrier}
            isCharging={isCharging}
          />
        );
      })}
    </MapGrid>
  );
};

export default ZenitMap;
