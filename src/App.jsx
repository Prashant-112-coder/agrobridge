import { Routes, Route, Navigate } from "react-router-dom";
import { FarmProvider } from "./context/FarmContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import FarmDiagnostics from "./pages/FarmDiagnostics";
import CropDoctor from "./pages/CropDoctor";
import MandiPage from "./pages/MandiPage";
import AdvisoryPage from "./pages/AdvisoryPage";
import HistoryPage from "./pages/HistoryPage";
import PomegranateAI from "./pages/PomegranateAI";

export default function App() {
  return (
    <FarmProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="diagnostics" element={<FarmDiagnostics />} />
          <Route path="crop-doctor" element={<CropDoctor />} />
          <Route path="mandi-rates" element={<MandiPage />} />
          <Route path="advisory" element={<AdvisoryPage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>
        <Route path="/pomegranate" element={<PomegranateAI />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </FarmProvider>
  );
}
