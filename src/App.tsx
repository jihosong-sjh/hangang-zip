import { Navigate, Route, Routes } from "react-router-dom";
import { MapPage } from "./pages/MapPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
      <Route path="/parks/:parkSlug" element={<MapPage />} />
      <Route path="/delivery-zones/:zoneId" element={<MapPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
