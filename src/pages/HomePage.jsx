import "./HomePage.css";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../auth";
import { useState } from "react";

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
  const [username, setUsername] = useState(getCurrentUser);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setUsername(null);
    navigate("/homepage");
  }

  return (
    <div className="homepage">
      <header className="navbar">
        <a className="logo" href="/homepage">
          PortfolioBuilder<span>.</span>
        </a>

        <nav aria-label="Main navigation">
          <a href="#templates">Templates</a>
          <a href="#features">How it works</a>
          <Link className="nav-button" to="/template-gallery">
            Start building
          </Link>
          {username ? (
            <div className="account-menu">
              <button
                className="user-link"
                type="button"
                aria-expanded={accountMenuOpen}
                onClick={() => setAccountMenuOpen((isOpen) => !isOpen)}
              >
                Hi, {username}
              </button>
              {accountMenuOpen && (
                <div className="account-dropdown">
                  <Link to="/your-projects" onClick={() => setAccountMenuOpen(false)}>
                    Your Projects
                  </Link>
                  <button type="button" onClick={handleLogout}>
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link className="login-link" to="/login">
              Log in
            </Link>
          )}
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
              <Link className="primary-button" to="/template-gallery">
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
              <div>portfoliobuilder.com</div>
            </div>

            <div className="preview-content">
              <div className="preview-navigation">
                <strong>BRANDING</strong>
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

            <Link className="outline-button" to="/template-gallery">
              View all templates
            </Link>
          </div>

          <div className="template-grid">
            <article className="template-card">
              <div className="template-image template-minimal" aria-label="Minimal Studio template preview">
                <div className="template-preview-mini">
                  <div className="template-preview-nav">
                    <span>PortfolioBuilder.</span>
                    <span>MENU</span>
                  </div>
                  <div className="template-preview-content">
                    <p>SELECTED WORK / 2026</p>
                    <h3>Minimal Studio</h3>
                    <span>Creative work &amp; selected projects</span>
                  </div>
                  <div className="template-preview-projects">
                    <div />
                    <div />
                  </div>
                </div>
                <span className="template-category-label">Minimal</span>
              </div>
              <h3>Minimal Studio</h3>
              <p>A clean portfolio with elegant typography.</p>
            </article>

            <article className="template-card">
              <div className="template-image template-bold" aria-label="Creative Zine template preview">
                <div className="template-preview-mini">
                  <div className="template-preview-nav">
                    <span>PortfolioBuilder.</span>
                    <span>MENU</span>
                  </div>
                  <div className="template-preview-content">
                    <p>SELECTED WORK / 2026</p>
                    <h3>Creative Zine</h3>
                    <span>Creative work &amp; selected projects</span>
                  </div>
                  <div className="template-preview-projects">
                    <div />
                    <div />
                  </div>
                </div>
                <span className="template-category-label">Artistic</span>
              </div>
              <h3>Creative Zine</h3>
              <p>A bold editorial layout for creative minds.</p>
            </article>

            <article className="template-card">
              <div className="template-image template-clean" aria-label="Clean Portfolio template preview">
                <div className="template-preview-mini">
                  <div className="template-preview-nav">
                    <span>PortfolioBuilder.</span>
                    <span>MENU</span>
                  </div>
                  <div className="template-preview-content">
                    <p>SELECTED WORK / 2026</p>
                    <h3>Clean Portfolio</h3>
                    <span>Creative work &amp; selected projects</span>
                  </div>
                  <div className="template-preview-projects">
                    <div />
                    <div />
                  </div>
                </div>
                <span className="template-category-label">Professional</span>
              </div>
              <h3>Clean Portfolio</h3>
              <p>A polished portfolio for internships and jobs.</p>
            </article>
          </div>
        </section>

        <section className="features" id="features">
          <div className="features-intro">
            <p className="eyebrow">How it works</p>
            <h2>From a blank page to a polished portfolio.</h2>
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
        <div className="conclusion-actions">
          <Link className="primary-button" to="/template-gallery">
            View Templates
          </Link>
          <Link className="outline-button" to="/your-projects">
            Your Projects
          </Link>
        </div>
      </div>

      <footer>
        <a className="logo" href="/homepage">
          PortfolioBuilder<span>.</span>
        </a>
        <p>Build something worth sharing.</p>
        <p>© 2026 PortfolioBuilder</p>
      </footer>
    </div>
  );
}

export default HomePage;