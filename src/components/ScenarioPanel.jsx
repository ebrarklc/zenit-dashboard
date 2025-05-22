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
`;

const List = styled.ul`
  margin-top: 20px;
  padding: 0;
  list-style: none;
`;

const ListItem = styled.li`
  margin-bottom: 8px;
  background-color: #f3f4f6;
  padding: 8px;
  border-radius: 6px;
`;

const ScenarioPanel = () => {
  const [point, setPoint] = useState("");
  const [action, setAction] = useState("al");
  const [tasks, setTasks] = useState([]);

  const handleAdd = () => {
    if (!point) {
      toast.error("Lütfen bir nokta girin.");
      return;
    }

    const task = { nokta: point, islem: action };
    setTasks([...tasks, task]);
    setPoint("");
    setAction("al");
    toast.success("Görev eklendi!");
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

      <List>
        {tasks.map((t, index) => (
          <ListItem key={index}>
            {index + 1}. Nokta: {t.nokta.toUpperCase()}, İşlem: {t.islem.toUpperCase()}
          </ListItem>
        ))}
      </List>
    </Panel>
  );
};

export default ScenarioPanel;
