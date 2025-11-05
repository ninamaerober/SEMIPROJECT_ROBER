import { BrowserRouter, Route, Routes } from  "react-router";
import LandingPage from "./pages/LandingPage";
import StudentsPage from "./pages/StudentsPage";
import SubjectsPage from "./pages/SubjectsPage";
import GradesPage from "./pages/GradesPage";
import { Toaster } from "react-hot-toast";


export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/grades" element={<GradesPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

