import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

const Panel = styled.div`
  max-width: 500px;
  margin: 0 auto;
  margin-top: 30px;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
`;

const Select = styled.select`
  padding: 8px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #059669;
  }

  &.next {
    background-color: #3b82f6;
    margin-top: 10px;

    &:hover {
      background-color: #2563eb;
    }
  }
`;

const List = styled.ul`
  margin-top: 20px;
  padding: 0;
  list-style: none;
`;

const ListItem = styled.li`
  margin-bottom: 8px;
  background-color: ${({ isActive }) => (isActive ? "#d1fae5" : "#f3f4f6")};
  padding: 8px;
  border-radius: 6px;
  font-weight: ${({ isActive }) => (isActive ? "bold" : "normal")};
`;

const ScenarioPanel = ({ scenario, setScenario }) => {
  const [point, setPoint] = useState("");
  const [action, setAction] = useState("al");
  const [currentStep, setCurrentStep] = useState(0);

  const handleAdd = () => {
    if (!point) {
      toast.error("Lütfen bir nokta girin.");
      return;
    }

    const task = { nokta: point.toUpperCase(), islem: action };
    setScenario([...scenario, task]);
    setPoint("");
    setAction("al");
    toast.success("Görev eklendi!");
  };

  const handleNext = () => {
    if (currentStep + 1 < scenario.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.info("🎉 Tüm görevler tamamlandı!");
    }
  };

  return (
    <Panel>
      <h3>Senaryo Oluştur</h3>
      <Row>
        <Input
          type="text"
          placeholder="Nokta (örn: A5)"
          value={point}
          onChange={(e) => setPoint(e.target.value)}
        />
        <Select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="al">Al</option>
          <option value="birak">Bırak</option>
        </Select>
        <Button onClick={handleAdd}>Ekle</Button>
      </Row>

      {scenario.length > 0 && (
        <>
          <List>
            {scenario.map((t, index) => (
              <ListItem key={index} isActive={index === currentStep}>
                {index + 1}. Nokta: {t.nokta}, İşlem: {t.islem.toUpperCase()}
              </ListItem>
            ))}
          </List>
          <Button className="next" onClick={handleNext}>
            Sonraki Adım
          </Button>
        </>
      )}
    </Panel>
  );
};

export default ScenarioPanel;