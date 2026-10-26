import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProject, getCurrentUser } from "../auth";
import "./TemplateGallery.css";

const portfolioTemplates = [
  {
    id: 1,
    name: "Minimal Studio",
    category: "Minimal",
    description: "A clean portfolio with elegant typography.",
    details:
      "A clean and timeless design that puts your work front and center. Refined typography, spacious layouts, and soft colors create a professional portfolio.",
    bestFor: ["Design", "Photography", "UI/UX"],
    colors: ["#9CAF88", "#E89B86", "#1B3159", "#C4C1B3"],
    background: "#EAE8E3",
    style: "minimal",
    headline: "Design Create Capture",
  },
  {
    id: 2,
    name: "Creative Zine",
    category: "Artistic",
    description: "A bold editorial layout for creative minds.",
    details:
      "Inspired by editorial magazines, this expressive design uses layered elements, contrasting colors, and bold typography to showcase creative work.",
    bestFor: ["Graphic Design", "Editorial", "Illustration"],
    colors: ["#18314F", "#E07A5F", "#6193B0", "#315B45"],
    background: "#F6DCD4",
    style: "zine",
    headline: "GOOD IDEAS TAKE SHAPE",
  },
  {
    id: 3,
    name: "Clean Portfolio",
    category: "Professional",
    description: "A polished portfolio for internships and jobs.",
    details:
      "A modern and professional design with a clean grid layout. Perfect for presenting projects, experience, and creative skills in an organized way.",
    bestFor: ["UI/UX", "Graphic Design", "Product Design"],
    colors: ["#E9D8A6", "#B5836B", "#192A56", "#C9C5B5"],
    background: "#E6EAE4",
    style: "clean",
    headline: "Selected Work",
  },
  {
    id: 4,
    name: "Visual Story",
    category: "Creative",
    description: "Tell your story through beautiful visual projects.",
    details:
      "An image-focused portfolio with large visuals and expressive typography. Ideal for photography, art, and storytelling projects.",
    bestFor: ["Photography", "Visual Design", "Creative Projects"],
    colors: ["#1E596C", "#E78C73", "#5B80A5", "#424D49"],
    background: "#F7DED5",
    style: "visual",
    headline: "Visual Stories",
  },
  {
    id: 5,
    name: "Bold Type",
    category: "Modern",
    description: "Make an impression with oversized typography.",
    details:
      "A confident and impactful portfolio built around oversized typography, strong contrast, and bold layouts.",
    bestFor: ["Graphic Design", "Typography", "Illustration"],
    colors: ["#183153", "#E8795B", "#A5C9BD", "#314C44"],
    background: "#EDE4DD",
    style: "bold",
    headline: "DESIGN FOR A BRIGHTER TOMORROW",
  },
  {
    id: 6,
    name: "Soft Grid",
    category: "Minimal",
    description: "A gentle, modern grid for showcasing creative work.",
    details:
      "A soft and flexible design with an organized grid structure, subtle colors, and balanced typography.",
    bestFor: ["Design", "Photography", "UI/UX"],
    colors: ["#63818A", "#F0B79E", "#24345A", "#191919"],
    background: "#E2E5FF",
    style: "grid",
    headline: "Simple Ideas Last Longer",
  },
];

function PortfolioMockup({ template }) {
  return (
    <div
      className={`gallery-large-preview gallery-preview-${template.style}`}
      style={{ "--preview-bg": template.background }}
    >
      <div className="gallery-demo-site">
        <div className="gallery-demo-nav">
          <strong>PORTFOLIO.</strong>
          <span>Work &nbsp; About &nbsp; Contact</span>
        </div>

        <div className="gallery-demo-hero">
          <div className="gallery-demo-copy">
            <small>CREATIVE PORTFOLIO / 2026</small>
            <h2>{template.headline}</h2>
            <p>Exploring design, photography, and creative ideas.</p>
          </div>

          <div className="gallery-demo-hero-art">
            <div className="gallery-demo-art-shape" />
          </div>
        </div>

        <div className="gallery-demo-projects">
          {template.colors.slice(0, 3).map((color, index) => (
            <div
              className="gallery-demo-project"
              key={color}
              style={{ backgroundColor: color }}
            >
              <span>{["Branding", "Photography", "Creative Work"][index]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplateGallery() {
  const navigate = useNavigate();
  const username = getCurrentUser();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const modalRef = useRef(null);

  const selectedTemplate =
    selectedIndex === null ? null : portfolioTemplates[selectedIndex];

  const openPreview = (index) => {
    previousFocusRef.current = document.activeElement;
    setSelectedIndex(index);
  };

  const closePreview = () => {
    setSelectedIndex(null);
    requestAnimationFrame(() => previousFocusRef.current?.focus());
  };

  const changePreview = (direction) => {
    setSelectedIndex(
      (current) =>
        (current + direction + portfolioTemplates.length) %
        portfolioTemplates.length,
    );
  };

  const handleUseTemplate = (template) => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      navigate("/login", { state: { from: "/template-gallery" } });
      return;
    }

    const project = createProject(currentUser, template);
    navigate("/editor", {
      state: {
        template: template.name,
        projectId: project.id,
        isNewProject: true,
      },
    });
  };

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
        requestAnimationFrame(() => previousFocusRef.current?.focus());
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((current) => (current + 1) % portfolioTemplates.length);
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex(
          (current) =>
            (current - 1 + portfolioTemplates.length) % portfolioTemplates.length,
        );
      }

      if (event.key === "Tab" && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll(
            'button:not([disabled]), a[href], input:not([disabled])',
          ),
        );

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex === null]);

  return (
    <div className="template-gallery-page">
      <header className="gallery-navbar">
        <Link className="gallery-logo" to="/homepage">
          PortfolioBuilder<span>.</span>
        </Link>

        <nav aria-label="Main navigation">
          <Link to="/template-gallery">Templates</Link>
          <Link to="/#features">How it works</Link>
          <Link className="gallery-start-button" to="/templates">
            Start building
          </Link>
        </nav>
      </header>

      <main className="gallery-main">
        <p className="gallery-eyebrow">LET YOUR CREATIVITY BE SEEN</p>

        <h1>
          Find the perfect template for <em>you.</em>
        </h1>

        <p className="gallery-description">
          Explore unique portfolio designs and find the perfect starting point to
          showcase your work.
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
            {portfolioTemplates.map((template, index) => (
              <article className="gallery-template-card" key={template.id}>
                <div
                  className={`gallery-template-thumbnail gallery-style-${template.style}`}
                  style={{ backgroundColor: template.background }}
                >
                  <div className="gallery-template-mini">
                    <div className="gallery-mini-nav">
                      <span>PORTFOLIO.</span>
                      <span>MENU ↗</span>
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

                  <span className="gallery-category-label">{template.category}</span>
                </div>

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
                      onClick={() => openPreview(index)}
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

      {selectedTemplate && (
        <div
          className="gallery-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePreview();
            }
          }}
        >
          <section
            ref={modalRef}
            className="gallery-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-modal-title"
            aria-describedby="gallery-modal-description"
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="gallery-modal-close"
              onClick={closePreview}
              aria-label="Close preview"
            >
              ×
            </button>

            <div className="gallery-modal-left">
              <PortfolioMockup template={selectedTemplate} />

              <div className="gallery-modal-pagination">
                {portfolioTemplates.map((template, index) => (
                  <button
                    key={template.id}
                    type="button"
                    className={selectedIndex === index ? "active" : ""}
                    onClick={() => setSelectedIndex(index)}
                    aria-label={`Preview ${template.name}`}
                    aria-current={selectedIndex === index ? "true" : undefined}
                  />
                ))}
              </div>

              <button
                type="button"
                className="gallery-modal-arrow gallery-modal-prev"
                onClick={() => changePreview(-1)}
                aria-label="Previous template"
              >
                ‹
              </button>

              <button
                type="button"
                className="gallery-modal-arrow gallery-modal-next"
                onClick={() => changePreview(1)}
                aria-label="Next template"
              >
                ›
              </button>
            </div>

            <div className="gallery-modal-right">
              <span className="gallery-modal-category">{selectedTemplate.category}</span>

              <h2 id="gallery-modal-title">{selectedTemplate.name}</h2>

              <p className="gallery-modal-subtitle">{selectedTemplate.description}</p>

              <p id="gallery-modal-description" className="gallery-modal-description">
                {selectedTemplate.details}
              </p>

              <h3>Best for</h3>

              <div className="gallery-modal-tags">
                {selectedTemplate.bestFor.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <h3>Color palette</h3>

              <div className="gallery-modal-colors">
                {selectedTemplate.colors.map((color) => (
                  <span key={color} style={{ backgroundColor: color }} title={color} />
                ))}
              </div>

              <button
                type="button"
                className="gallery-modal-use"
                onClick={() => handleUseTemplate(selectedTemplate)}
              >
                {username ? "Use Template →" : "Log in to use template"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default TemplateGallery;
