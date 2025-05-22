import React from "react";
import styled from "styled-components";

const Panel = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 8px;
  border: none;
  background-color: #3b82f6;
  color: white;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;

const JoystickPanel = ({ onForward, onTurnLeft, onTurnRight, onStop }) => {
  return (
    <Panel>
      <Button onClick={onTurnLeft}>Sol</Button>
      <Button onClick={onForward}>İleri</Button>
      <Button onClick={onTurnRight}>Sağ</Button>
      <Button onClick={onStop}>Durdur</Button>
    </Panel>
  );
};

export default JoystickPanel;
