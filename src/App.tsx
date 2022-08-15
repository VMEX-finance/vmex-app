import React from "react";
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
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="/lending" element={<Lending />} />
        <Route path="/borrowing" element={<Borrowing />} />
        <Route path="/staking" element={<Staking />} />
        <Route path="/markets" element={<Markets />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
