import "./Templates.css";
import { Link } from "react-router-dom";

function Templates() {
  return (
    <div className="templates-page">
      <h1>Templates</h1>
      <p>This is the templates page of our portfolio website. Choose a template to get started.</p>
      <Link className="outline-button" to="/editor">
        Go to editor
      </Link>
    </div>
  );
}

export default Templates;