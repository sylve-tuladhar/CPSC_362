import { useState } from "react";
import HomePage from "./pages/HomePage";
import Templates from "./pages/Templates";
import Editor from "./pages/Editor";
import Preview from "./pages/Preview";
import "./App.css";

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

export default App;