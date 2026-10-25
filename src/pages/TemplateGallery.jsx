import { Link, useNavigate } from "react-router-dom";
import "./TemplateGallery.css";
import { createProject, getCurrentUser } from "../auth";

const portfolioTemplates = [
  {
    id: 1,
    name: "Minimal Studio",
    category: "Minimal",
    description: "A clean portfolio with elegant typography.",
    colors: ["#9CAF88", "#E89B86", "#1B3159", "#C4C1B3"],
    background: "#EAE8E3",
    style: "minimal",
  },
  {
    id: 2,
    name: "Creative Zine",
    category: "Artistic",
    description: "A bold editorial layout for creative minds.",
    colors: ["#18314F", "#E07A5F", "#6193B0", "#315B45"],
    background: "#F6DCD4",
    style: "zine",
  },
  {
    id: 3,
    name: "Clean Portfolio",
    category: "Professional",
    description: "A polished portfolio for internships and jobs.",
    colors: ["#E9D8A6", "#B5836B", "#192A56", "#C9C5B5"],
    background: "#E6EAE4",
    style: "clean",
  },
  {
    id: 4,
    name: "Visual Story",
    category: "Creative",
    description: "Tell your story through beautiful visual projects.",
    colors: ["#1E596C", "#E78C73", "#5B80A5", "#424D49"],
    background: "#F7DED5",
    style: "visual",
  },
  {
    id: 5,
    name: "Bold Type",
    category: "Modern",
    description: "Make an impression with oversized typography.",
    colors: ["#183153", "#E8795B", "#A5C9BD", "#314C44"],
    background: "#EDE4DD",
    style: "bold",
  },
  {
    id: 6,
    name: "Soft Grid",
    category: "Minimal",
    description: "A gentle, modern grid for showcasing creative work.",
    colors: ["#63818A", "#F0B79E", "#24345A", "#191919"],
    background: "#E2E5FF",
    style: "grid",
  },
];


function TemplateGallery() {
  const navigate = useNavigate();
  const username = getCurrentUser();

  function handleUseTemplate(template) {
    const username = getCurrentUser();

    if (!username) {
      navigate("/login", { state: { from: "/template-gallery" } });
      return;
    }

    const project = createProject(username, template);
    navigate("/editor", {
      state: {
        template: template.name,
        projectId: project.id,
        isNewProject: true,
      },
    });
  }

  return (
    <div className="template-gallery-page">

      <header className="gallery-navbar">
        <Link className="gallery-logo" to="/homepage">
            PortfolioBuilder<span>.</span>
        </Link>
        
        <nav aria-label="Main navigation">
            <Link className="gallery-start-button" to="/homepage">
              Return to Home
            </Link>
        </nav>
      </header>

      <main className="gallery-main">
        <p className="gallery-eyebrow">
          LET YOUR CREATIVITY BE SEEN
        </p>

        <h1>
          Find the perfect template for <em>you.</em>
        </h1>

        <p className="gallery-description">
          Explore unique portfolio designs and find the perfect
          starting point to showcase your work.
        </p>

        <section className="gallery-templates-section">

  <div className="gallery-section-heading">
    <div>
      <p className="gallery-eyebrow">MADE FOR YOUR CREATIVITY</p>
      <h2>Explore Our Templates</h2>
      <p>Find a design that matches your creative style.</p>
    </div>
  </div>

  <div className="gallery-template-grid">

    {portfolioTemplates.map((template) => (

      <article className="gallery-template-card" key={template.id}>

        {/* Template thumbnail */}
        <div
          className={`gallery-template-thumbnail gallery-style-${template.style}`}
          style={{ backgroundColor: template.background }}
        >

          <div className="gallery-template-mini">

            <div className="gallery-mini-nav">
              <span>PortfolioBuilder.</span>
              <span>MENU</span>
            </div>

            <div className="gallery-mini-content">
              <p>SELECTED WORK / 2026</p>
              <h3>{template.name}</h3>
              <span>Creative work & selected projects</span>
            </div>

            <div className="gallery-mini-projects">
              <div style={{ backgroundColor: template.colors[0] }} />
              <div style={{ backgroundColor: template.colors[1] }} />
            </div>

          </div>

          <span className="gallery-category-label">
            {template.category}
          </span>

        </div>

        {/* Template details */}
        <div className="gallery-template-info">

          <div className="gallery-template-title-row">
            <h3>{template.name}</h3>

            <div className="gallery-color-palette">
              {template.colors.map((color) => (
                <span
                  key={color}
                  className="gallery-color-dot"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <p>{template.description}</p>

          <div className="gallery-template-actions">

            <button
              type="button"
              className="gallery-preview-btn"
            >
              Preview
            </button>

            <button
              type="button"
              onClick={() => handleUseTemplate(template)}
              className="gallery-use-btn"
            >
              {username ? "Use Template →" : "Log in to use template"}
            </button>

          </div>

        </div>

      </article>

    ))}

  </div>

</section>
      </main>

    </div>
  );
}

export default TemplateGallery;