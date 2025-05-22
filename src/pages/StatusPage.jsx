import React from "react";
import StatusPanel from "../components/StatusPanel";
import styled from "styled-components";

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
`;

const StatusPage = () => {
  const mockData = {
    battery: 72,
    charging: true,
    barrier: false,
    x: 15880,
    y: 8880,
    direction: "N",
    qr: "QA4.1",
    rfid: "TAG-123456"
  };

  return (
    <div>
      <Title>Robot Durumu</Title>
      <StatusPanel data={mockData} />
    </div>
  );
};

export default StatusPage;
