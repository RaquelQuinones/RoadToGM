import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Modules from "./pages/Modules";
import Clubs from "./pages/Clubs";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/modules" element={<Modules />} />
      <Route path="/clubs" element={<Clubs />} />
    </Routes>
  );
}

export default App;