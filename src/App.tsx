import React from "react";
import { 
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Lending from "./pages/lending"
import Borrowing from "./pages/borrowing";
import Staking from "./pages/staking";
import Markets from "./pages/markets";
import Construction from "./pages/construction";
import { useGeneralTokenData } from "./hooks/user-data";

function App() {
  useGeneralTokenData();
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/supply" />} />
        <Route path="/supply" element={<Lending />} />
        <Route path="/borrow" element={<Borrowing />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/stake" element={<Staking />} />
        <Route path="/governance" element={<Construction />} />
        <Route path="/develop" element={<Construction />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
