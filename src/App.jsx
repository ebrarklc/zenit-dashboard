import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import StatusPage from "./pages/StatusPage";
import MapPage from "./pages/MapPage";
import ScenarioPage from "./pages/ScenarioPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<StatusPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="scenario" element={<ScenarioPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
