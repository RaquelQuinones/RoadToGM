import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import Modules from "./pages/Modules";
import ModuleDetailsPage from "./pages/ModuleDetailsPage";
import ExercisePage from "./pages/chess_pages/ExercisePage";
//import CreateModulePage from "./pages/CreateModulePage";
import CreateContentPage from "./pages/CreateContentPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EditModulePage from "./pages/EditModulePage";
import MyModulesPage from "./pages/MyModulesPage";

import ClassesPage from "./pages/ClassesPage";
import MyClassesPage from "./pages/MyClassesPage";
import SharedModulesPage from "./pages/SharedModulesPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/modules" element={<Modules />} />
      <Route path="/modules/:id" element={<ModuleDetailsPage />} />
      <Route path="/exercise/:id" element={<ExercisePage />} />
      <Route path="/create" element={<CreateContentPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/modules/:id/edit" element={<EditModulePage />} />
      <Route path="/my-modules" element={<MyModulesPage />} />
      <Route path="/classes" element={<ClassesPage />} />
      <Route path="/my-classes" element={<MyClassesPage />} />
      <Route path="/shared-modules" element={<SharedModulesPage />} />
    </Routes>
  );
}