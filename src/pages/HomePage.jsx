import "./HomePage.css";
import { Link } from "react-router-dom";

// Data for the features section of the homepage
const features = [
  {
    number: "01",
    title: "Choose a template",
    description: "Start with a pre-made layout with refined typography and balanced spacing built in from the start.",
  },
  {
    number: "02",
    title: "Make it yours",
    description: "Customize your portfolio colors, content, projects, and skills without having to write a single line of code.",
  },
  {
    number: "03",
    title: "Share your work",
    description: "Preview your portfolio and publish it when you are ready.",
  },
];

// Main component for the homepage
function HomePage() {
  return (
    <div className="homepage">
      <header className="navbar">
        <a className="logo" href="/">
          PortfolioBuilder<span>.</span>
        </a>

        <nav aria-label="Main navigation">
          <a href="#templates">Templates</a>
          <a href="#features">How it works</a>
          <Link className="nav-button" to="/templates">
            Start building
          </Link>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">Your work deserves a home</p>

            <h1>
              Build a portfolio that feels like <em>you.</em>
            </h1>

            <p className="hero-description">
              Choose a template, customize every detail, and create a
              professional portfolio without writing any code.
            </p>

            <div className="hero-actions">
              <Link className="primary-button" to="/templates">
                Browse templates
              </Link>

              <a className="secondary-link" href="#features">
                See how it works
              </a>
            </div>
          </div>

          <div className="portfolio-preview" aria-label="Portfolio preview">
            <div className="browser-bar">
              <span />
              <span />
              <span />
              <div>yourportfolio.com</div>
            </div>

            <div className="preview-content">
              <div className="preview-navigation">
                <strong>AM.</strong>
                <span>Work&nbsp;&nbsp; About&nbsp;&nbsp; Contact</span>
              </div>

              <p>PRODUCT DESIGNER</p>
              <h2>I create thoughtful digital experiences.</h2>

              <div className="preview-projects">
                <div className="preview-project project-one">Project One</div>
                <div className="preview-project project-two">Project Two</div>
              </div>
            </div>
          </div>
        </section>

        <section className="templates" id="templates">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Pick your starting point</p>
              <h2>Templates for every kind of creator.</h2>
            </div>

            <Link className="outline-button" to="/templates">
              View all templates
            </Link>
          </div>

          <div className="template-grid">
            <article className="template-card">
              <div className="template-image template-minimal">
                <span>Modern</span>
              </div>
              <h3>Modern</h3>
              <p>A clean and contemporary look with bold typography.</p>
            </article>

            <article className="template-card">
              <div className="template-image template-bold">
                <span>Artistic</span>
              </div>
              <h3>Artistic</h3>
              <p>An expressive and colorful layout good for creative work.</p>
            </article>

            <article className="template-card">
              <div className="template-image template-clean">
                <span>Professional</span>
              </div>
              <h3>Professional</h3>
              <p>A polished layout with structured sections.</p>
            </article>
          </div>
        </section>

        <section className="features" id="features">
          <div className="features-intro">
            <p className="eyebrow">How it works</p>
            <h2>From blank page to polished portfolio.</h2>
          </div>

          <div className="feature-list">
            {features.map((feature) => (
              <article className="feature" key={feature.number}>
                <span>{feature.number}</span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <div className="homepage-conclusion">
        <h2>Ready to build your portfolio?</h2>
        <button className="primary-button" type="button">
          Get Started Free
        </button>
        <Link className="outline-button" to="/templates">
          View Templates
        </Link>
      </div>

      <footer>
        <a className="logo" href="/">
          PortfolioBuilder<span>.</span>
        </a>
        <p>Build something worth sharing.</p>
        <p>© 2026 PortfolioBuilder</p>
      </footer>
    </div>
  );
}

export default HomePage;