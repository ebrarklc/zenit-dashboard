import React from "react";
import styled from "styled-components";

const Panel = styled.div`
  max-height: 200px;
  overflow-y: auto;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
`;

const LogItem = styled.div`
  font-size: 14px;
  margin-bottom: 6px;
  border-left: 4px solid #3b82f6;
  padding-left: 8px;
`;

const LogPanel = ({ logs }) => {
  return (
    <Panel>
      {logs.slice(0).reverse().map((log, i) => (
        <LogItem key={i}>{log}</LogItem>
      ))}
    </Panel>
  );
};

export default LogPanel;
