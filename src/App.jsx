import HomePage from "./pages/HomePage";
import Templates from "./pages/Templates";
import TemplateGallery from "./pages/TemplateGallery";
import Editor from "./pages/Editor";
import Preview from "./pages/Preview";
import YourProjects from "./pages/YourProjects";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  // Temporary container for the app content
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Navigate to="/homepage" replace />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/template-gallery" element={<TemplateGallery />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/your-projects"
          element={
            <ProtectedRoute>
              <YourProjects />
            </ProtectedRoute>
          }
        />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
