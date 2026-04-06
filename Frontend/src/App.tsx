import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import Modules from "./pages/Modules";
import ModuleDetailsPage from "./pages/ModuleDetailsPage";
import ExercisePage from "./pages/chess_pages/ExercisePage";
import CreateModulePage from "./pages/CreateModulePage";
import CreateContentPage from "./pages/CreateContentPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/modules" element={<Modules />} />
      <Route path="/modules/:id" element={<ModuleDetailsPage />} />
      <Route path="/exercise/:id" element={<ExercisePage />} />
      <Route path="/create-module" element={<CreateContentPage />} />
    </Routes>
  );
}