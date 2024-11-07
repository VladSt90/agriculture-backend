// src/App.tsx

import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import ImageSetPage from "./pages/ImageSetPage/ImageSetPage";
import ImageSetsPage from "./pages/ImageSetsPage/ImageSetsPage";
import LoginPage from "./pages/LoginPage/LoginPage";
// Import your dashboard or other components
// import Dashboard from "./components/Dashboard"; // Placeholder for dashboard component

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/imagesets" element={<ImageSetsPage />} />
        <Route path="/imagesets/:imagesetId" element={<ImageSetPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
