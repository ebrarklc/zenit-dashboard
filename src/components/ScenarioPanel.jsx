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

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ScenarioPanel = ({ scenario, setScenario, currentStep, setCurrentStep, autoMode }) => {
  const [point, setPoint] = useState("");
  const [action, setAction] = useState("al");

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
    if (autoMode) {
      toast.warn("🛑 Otomatik mod açıkken manuel geçiş yapılamaz.");
      return;
    }

    if (currentStep + 1 < scenario.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.info("🎉 Tüm görevler tamamlandı!");
    }
  };

  const handleRemove = (index) => {
    const updated = [...scenario];
    updated.splice(index, 1);
    setScenario(updated);
    toast.info("Görev silindi.");
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(scenario, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "senaryo.json";
    link.click();
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (Array.isArray(data)) {
          setScenario(data);
          toast.success("Senaryo yüklendi!");
        } else {
          toast.error("Geçersiz dosya formatı!");
        }
      } catch (err) {
        toast.error("Yükleme sırasında hata oluştu.");
      }
    };
    reader.readAsText(file);
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
                <button
                  onClick={() => handleRemove(index)}
                  style={{
                    marginLeft: "10px",
                    color: "red",
                    fontWeight: "bold",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ✖
                </button>
              </ListItem>
            ))}
          </List>
          <Button className="next" onClick={handleNext}>
            Sonraki Adım
          </Button>
          <Row>
            <Button onClick={handleDownload}>Senaryoyu Kaydet</Button>
            <input type="file" accept=".json" onChange={handleUpload} />
          </Row>
        </>
      )}
    </Panel>
  );
};

export default ScenarioPanel;
