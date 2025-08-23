import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./admin/routes";
import ClientRoutes from './client/routes';

const App = () => {
  return (
    <Routes>
      <Route path="/*" element={<ClientRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
};

export default App;


