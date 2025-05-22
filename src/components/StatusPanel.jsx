import React from "react";
import styled from "styled-components";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
`;

const Card = styled.div`
  background-color: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
  text-align: center;
`;

const Title = styled.h4`
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
`;

const Value = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const StatusPanel = ({ data }) => {
  return (
    <Grid>
      <Card>
        <Title>Batarya</Title>
        <Value>{data.battery}%</Value>
      </Card>
      <Card>
        <Title>Şarj Durumu</Title>
        <Value>{data.charging ? "Şarjda" : "Boşta"}</Value>
      </Card>
      <Card>
        <Title>Engel Durumu</Title>
        <Value>{data.barrier ? "Engel Var" : "Temiz"}</Value>
      </Card>
      <Card>
        <Title>Konum</Title>
        <Value>{`X: ${data.x}, Y: ${data.y}`}</Value>
      </Card>
      <Card>
        <Title>Yön</Title>
        <Value>{data.direction}</Value>
      </Card>
      <Card>
        <Title>QR</Title>
        <Value>{data.qr}</Value>
      </Card>
      <Card>
        <Title>RFID</Title>
        <Value>{data.rfid}</Value>
      </Card>
    </Grid>
  );
};

export default StatusPanel;
