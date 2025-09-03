import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./admin/routes";
import ClientRoutes from './client/routes';

const App = () => {
  return (
    <Routes>

      {/* Все пути, которые начинаются просто с / (например, /, /films, /tickets) → клиентская часть */}
      <Route path="/*" element={<ClientRoutes />} />

      {/* Все пути, которые начинаются с /admin (например, /admin, /admin/halls) → админская часть */}
      <Route path="/admin/*" element={<AdminRoutes />} />

    </Routes>
  );
};

export default App;


