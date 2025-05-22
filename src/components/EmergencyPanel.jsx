import React from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

const Panel = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  color: white;
  transition: 0.3s ease;

  &.emergency {
    background-color: #dc2626;

    &:hover {
      background-color: #b91c1c;
    }
  }

  &.cancel {
    background-color: #f97316;

    &:hover {
      background-color: #ea580c;
    }
  }
`;

const EmergencyPanel = () => {
  const handleEmergency = () => {
    toast.error("🚨 Acil Durdurma Aktif!", { autoClose: 3000 });
  };

  const handleCancel = () => {
    toast.info("❌ Görev iptal edildi.", { autoClose: 3000 });
  };

  return (
    <Panel>
      <Button className="emergency" onClick={handleEmergency}>Acil Durdur</Button>
      <Button className="cancel" onClick={handleCancel}>Görev İptal</Button>
    </Panel>
  );
};

export default EmergencyPanel;
