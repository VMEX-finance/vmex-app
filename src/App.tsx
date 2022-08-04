import React from "react";
import { 
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Landing from "./pages/landing"
import Lending from "./pages/lending"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="/app" >
          <Route
            index
            element={<Lending />}
          />
          <Route
            path="borrowing"
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
