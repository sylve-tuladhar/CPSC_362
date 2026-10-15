import "./YourProjects.css";
import { Link } from "react-router-dom";

function YourProjects() {
  return (
    <div className="your-projects">
      <header className="navbar">
      <Link classname="logo" to="/homepage">
        PortfolioBuilder<span>.</span>
      </Link>

      <nav aria-label="Main navigation">
        <Link to="/homepage">Return Home</Link>
        <Link to="/template-gallery">Templates</Link>
      </nav>
      </header>

      <main>
        <div className="hero">
          <div className="hero-content">
            <p className="eyebrow">View all your projects with ease</p>
          </div>
        </div>
      </main>
      
    </div>
  );
}

export default YourProjects;