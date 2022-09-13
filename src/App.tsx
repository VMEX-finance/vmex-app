import React from "react";
import useGeneralTokenData from "hooks/user-data/token-data";
import { 
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Landing from "./pages/landing"
import Lending from "./pages/lending"
import Borrowing from "./pages/borrowing";
import Staking from "./pages/staking";
import Markets from "./pages/markets";

function App() {
  useGeneralTokenData();
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="/supply" element={<Lending />} />
        <Route path="/borrow" element={<Borrowing />} />
        <Route path="/stake" element={<Staking />} />
        <Route path="/markets" element={<Markets />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
