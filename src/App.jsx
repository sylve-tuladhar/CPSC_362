import HomePage from "./pages/HomePage";
import Templates from "./pages/Templates";
import Editor from "./pages/Editor";
import Preview from "./pages/Preview";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
/*
function App() {
  // Temporary container for the app content
  return (
    <div className="app"> 
      <HomePage />
      <Templates />
      <Editor />
      <Preview />
    </div>
  );
}
  */

function App() {
  // Temporary container for the app content
  return (
    <BrowserRouter>
    <Routes> 
        <Route path="/" element={<HomePage />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/preview" element={<Preview />} />
    </Routes>    
    </BrowserRouter>
  );
}

export default App;
