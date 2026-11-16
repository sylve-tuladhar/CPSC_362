import "./Editor.css";
import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

const STORAGE_KEY = "portfolio-customization";
const PROJECT_STORAGE_PREFIX = "portfolio-customization-project-";

const DEFAULT_SETTINGS = {
  template: "Portfolio",
  name: "Alex Morgan",
  logo: "A",
  headline: "Designer & developer creating thoughtful digital experiences.",
  role: "Independent designer & developer",
  about:
    "I build thoughtful digital experiences, visual identities, and products for people with ambitious ideas.",
  location: "Based in Los Angeles, CA",
  email: "hello@alexmorgan.design",
  projects: [
    {
      title: "Brand system",
      type: "Identity / 2026",
      description: "A flexible visual identity for a growing creative studio.",
      link: "https://example.com",
      color: "#e89b86",
    },
    {
      title: "Digital product",
      type: "Product design / 2025",
      description: "A calm, useful product experience for everyday work.",
      link: "https://example.com",
      color: "#1b3159",
    },
    {
      title: "Editorial objects",
      type: "Art direction / 2025",
      description: "An exploration of image, type, and physical materials.",
      link: "https://example.com",
      color: "#9caf88",
    },
  ],
  accent: "#6d28d9",
  background: "#ffffff",
  fontColor: "#24212b",
  font: "Arial, sans-serif",
};

const TEMPLATE_STYLE_BY_NAME = {
  "Minimal Studio": "minimal",
  "Creative Zine": "zine",
  "Clean Portfolio": "clean",
  "Visual Story": "visual",
  "Bold Type": "bold",
  "Soft Grid": "grid",
  Portfolio: "minimal",
};
const TEMPLATE_STYLES = Object.values(TEMPLATE_STYLE_BY_NAME);
const TEMPLATE_NAME_BY_STYLE = Object.fromEntries(
  Object.entries(TEMPLATE_STYLE_BY_NAME)
    .filter(([name]) => name !== "Portfolio")
    .map(([name, style]) => [style, name]),
);

const TEMPLATE_DEFAULTS = {
  "Minimal Studio": {
    ...DEFAULT_SETTINGS,
    template: "Minimal Studio",
    accent: "#9caf88",
    background: "#eae8e3",
    font: "Georgia, serif",
  },
  "Creative Zine": {
    ...DEFAULT_SETTINGS,
    template: "Creative Zine",
    accent: "#18314f",
    background: "#f6dcd4",
  },
  "Clean Portfolio": {
    ...DEFAULT_SETTINGS,
    template: "Clean Portfolio",
    accent: "#e9d8a6",
    background: "#e6eae4",
  },
  "Visual Story": {
    ...DEFAULT_SETTINGS,
    template: "Visual Story",
    accent: "#1e596c",
    background: "#f7ded5",
  },
  "Bold Type": {
    ...DEFAULT_SETTINGS,
    template: "Bold Type",
    accent: "#183153",
    background: "#ede4dd",
  },
  "Soft Grid": {
    ...DEFAULT_SETTINGS,
    template: "Soft Grid",
    accent: "#63818a",
    background: "#e2e5ff",
  },
  Portfolio: DEFAULT_SETTINGS,
};

const FONT_OPTIONS = [
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Trebuchet MS", value: "Trebuchet MS, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
  { label: "ui-monospace", value: "ui-monospace, monospace" },
  { label: "Courier New", value: "Courier New, monospace" },
];

function getStorageKey(projectId) {
  return projectId ? `${PROJECT_STORAGE_PREFIX}${projectId}` : STORAGE_KEY;
}

function getTemplateDefaults(templateName) {
  return TEMPLATE_DEFAULTS[templateName] || {
    ...DEFAULT_SETTINGS,
    template: templateName || DEFAULT_SETTINGS.template,
  };
}

function isValidColor(value) {
  return typeof value === "string" && /^#[\da-f]{6}$/i.test(value);
}

function getTemplateStyle(templateName) {
  if (TEMPLATE_STYLES.includes(templateName)) return templateName;
  return TEMPLATE_STYLE_BY_NAME[templateName] || "minimal";
}

function getSavedSettings(parsed, templateName) {
  const templateDefaults = getTemplateDefaults(templateName);

  return {
    template:
      templateName ||
      (typeof parsed.template === "string"
        ? parsed.template
        : templateDefaults.template),
    name: typeof parsed.name === "string" ? parsed.name : templateDefaults.name,
    logo:
      typeof parsed.logo === "string" && parsed.logo.trim()
        ? parsed.logo
        : templateDefaults.logo,
    headline:
      typeof parsed.headline === "string"
        ? parsed.headline
        : templateDefaults.headline,
    role: typeof parsed.role === "string" ? parsed.role : templateDefaults.role,
    about:
      typeof parsed.about === "string" ? parsed.about : templateDefaults.about,
    location:
      typeof parsed.location === "string"
        ? parsed.location
        : templateDefaults.location,
    email:
      typeof parsed.email === "string" ? parsed.email : templateDefaults.email,
    projects: Array.isArray(parsed.projects)
      ? parsed.projects.map((project, index) => ({
          title:
            typeof project?.title === "string"
              ? project.title
              : templateDefaults.projects[index]?.title || "Selected project",
          type:
            typeof project?.type === "string"
              ? project.type
              : templateDefaults.projects[index]?.type || "Project / 2026",
          description:
            typeof project?.description === "string"
              ? project.description
              : templateDefaults.projects[index]?.description || "",
          link:
            typeof project?.link === "string"
              ? project.link
              : templateDefaults.projects[index]?.link || "",
          color: isValidColor(project?.color)
            ? project.color
            : templateDefaults.projects[index]?.color || "#e89b86",
        }))
      : templateDefaults.projects,
    accent: isValidColor(parsed.accent)
      ? parsed.accent
      : templateDefaults.accent,
    background: isValidColor(parsed.background)
      ? parsed.background
      : templateDefaults.background,
    fontColor: isValidColor(parsed.fontColor)
      ? parsed.fontColor
      : templateDefaults.fontColor,
    font: FONT_OPTIONS.some((option) => option.value === parsed.font)
      ? parsed.font
      : templateDefaults.font,
  };
}

function MinimalStudioEditor({
  settings,
  updateSetting,
  updateProject,
  resetSettings,
  storageError,
}) {
  const firstLetter = settings.name.trim().charAt(0).toUpperCase() || "A";
  const logoMark = settings.logo.trim() || firstLetter;
  const [expandedProject, setExpandedProject] = useState(null);
  const activeProject =
    expandedProject === null ? null : settings.projects[expandedProject];

  return (
    <section className="minimal-workspace" aria-labelledby="editor-title">
      <header className="minimal-workspace-header">
        <div>
          <p className="minimal-workspace-kicker">Minimal Studio / Editor</p>
          <h1 id="editor-title">
            Shape your <em>studio.</em>
          </h1>
        </div>
        <div className="minimal-workspace-actions">
          <Link className="minimal-text-link" to="/your-projects">
            Your Projects
          </Link>
          <Link className="minimal-save-button" to="/homepage">
            Done editing
          </Link>
        </div>
      </header>

      <div className="minimal-workspace-grid">
        <form
          className="minimal-controls"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="minimal-controls-heading">
            <span className="minimal-control-number">01</span>
            <div>
              <h2>Introduction</h2>
              <p>Tell visitors who you are and what you make.</p>
            </div>
          </div>
          <label className="minimal-field">
            Name
            <input
              name="name"
              value={settings.name}
              onChange={updateSetting}
              maxLength={60}
            />
          </label>
          <label className="minimal-field">
            Logo mark
            <input
              name="logo"
              value={settings.logo}
              onChange={updateSetting}
              aria-describedby="logo-mark-help"
            />
            <span id="logo-mark-help" className="minimal-field-help">
              Use your studio name or mark.
            </span>
          </label>
          <label className="minimal-field">
            Role
            <input
              name="role"
              value={settings.role}
              onChange={updateSetting}
              maxLength={80}
            />
          </label>
          <label className="minimal-field">
            Intro
            <textarea
              name="headline"
              value={settings.headline}
              onChange={updateSetting}
              rows={3}
              maxLength={180}
            />
          </label>

          <div className="minimal-controls-heading minimal-selected-work-heading">
            <span className="minimal-control-number">02</span>
            <div>
              <h2>Selected work</h2>
              <p>Give your best projects a place to shine.</p>
            </div>
          </div>
          {settings.projects.map((project, index) => (
            <div
              className="minimal-project-control minimal-selected-work-control"
              key={index}
            >
              <button
                type="button"
                className="minimal-project-toggle"
                aria-expanded={expandedProject === index}
                onClick={() =>
                  setExpandedProject(
                    expandedProject === index ? null : index,
                  )
                }
              >
                <span>0{index + 1}</span>
                <span className="minimal-project-toggle-title">
                  {project.title}
                </span>
                <span>{expandedProject === index ? "Hide details" : "Edit details"} ↗</span>
              </button>
            </div>
          ))}

          <div className="minimal-controls-heading">
            <span className="minimal-control-number">03</span>
            <div>
              <h2>About & contact</h2>
              <p>Make it easy for the right people to reach you.</p>
            </div>
          </div>
          <label className="minimal-field">
            About
            <textarea
              name="about"
              value={settings.about}
              onChange={updateSetting}
              rows={4}
              maxLength={240}
            />
          </label>
          <label className="minimal-field">
            Location
            <input
              name="location"
              value={settings.location}
              onChange={updateSetting}
              maxLength={80}
            />
          </label>
          <label className="minimal-field">
            Email
            <input
              name="email"
              type="email"
              value={settings.email}
              onChange={updateSetting}
              maxLength={100}
            />
          </label>

          <div className="minimal-controls-heading">
            <span className="minimal-control-number">04</span>
            <div>
              <h2>Studio style</h2>
              <p>Choose the feeling of your page.</p>
            </div>
          </div>
          <div className="minimal-style-controls">
            <label className="minimal-color-field">
              Accent
              <input
                name="accent"
                type="color"
                value={settings.accent}
                onChange={updateSetting}
              />
            </label>
            <label className="minimal-color-field">
              Canvas
              <input
                name="background"
                type="color"
                value={settings.background}
                onChange={updateSetting}
              />
            </label>
          </div>
          <button className="minimal-reset" type="button" onClick={resetSettings}>
            Reset to template defaults
          </button>
          {storageError && (
            <p className="storage-error" role="alert">
              {storageError}
            </p>
          )}
        </form>

        <section
          className="minimal-site-canvas"
          aria-label="Minimal Studio portfolio preview"
          style={{
            "--minimal-accent": settings.accent,
            "--minimal-background": settings.background,
            "--minimal-text": "#26302a",
          }}
        >
          <nav className="minimal-site-nav">
            <a href="#minimal-home" className="minimal-site-logo">
              {logoMark}.
            </a>
            <div>
              <a href="#minimal-work">Work</a>
              <a href="#minimal-about">About</a>
              <a href={`mailto:${settings.email}`}>Contact</a>
            </div>
          </nav>
          <main>
            <section id="minimal-home" className="minimal-site-hero">
              <p className="minimal-site-label">{settings.role}</p>
              <h2>{settings.name || "Your name"}</h2>
              <p className="minimal-site-intro">{settings.headline}</p>
              <a className="minimal-site-arrow" href="#minimal-work">
                Scroll to explore <span>↓</span>
              </a>
            </section>
            <section id="minimal-work" className="minimal-site-work">
              <div className="minimal-site-section-title">
                <span>01 — Selected work</span>
                <span>Recent projects</span>
              </div>
              <div className="minimal-site-projects">
                {settings.projects.map((project, index) => (
                  <article className="minimal-site-project" key={`${project.title}-${index}`}>
                    <div
                      className="minimal-site-project-art"
                      style={{ backgroundColor: project.color }}
                    >
                      <span>0{index + 1}</span>
                      <button
                        type="button"
                        className="minimal-project-open"
                        onClick={() => setExpandedProject(index)}
                        aria-label={`Edit ${project.title}`}
                      >
                        ↗
                      </button>
                    </div>
                    <div className="minimal-site-project-meta">
                      <h3>{project.title}</h3>
                      <p>{project.type}</p>
                      <p className="minimal-site-project-description">
                        {project.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <section id="minimal-about" className="minimal-site-about">
              <div className="minimal-site-section-title">
                <span>02 — A little about me</span>
              </div>
              <p>{settings.about}</p>
              <div className="minimal-site-contact-row">
                <span>{settings.location}</span>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </div>
            </section>
          </main>
          <footer className="minimal-site-footer">
            <span>© 2026 {settings.name}</span>
            <span>Built with intention.</span>
          </footer>
        </section>
      </div>
      {activeProject && (
        <div className="project-editor-overlay">
          <section
            className="project-editor-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-editor-title"
          >
            <div className="project-editor-dialog-header">
              <div>
                <p className="minimal-workspace-kicker">
                  Project {String(expandedProject + 1).padStart(2, "0")}
                </p>
                <h2 id="project-editor-title">Edit project</h2>
              </div>
              <button
                type="button"
                className="project-editor-close"
                onClick={() => setExpandedProject(null)}
                aria-label="Close project editor"
              >
                ×
              </button>
            </div>
            <p className="project-editor-description">
              Add the details visitors should see when they explore this work.
            </p>
            <div className="project-editor-fields">
              <label className="minimal-field">
                Project title
                <input
                  value={activeProject.title}
                  onChange={(event) =>
                    updateProject(expandedProject, "title", event.target.value)
                  }
                />
              </label>
              <label className="minimal-field">
                Category / year
                <input
                  value={activeProject.type}
                  onChange={(event) =>
                    updateProject(expandedProject, "type", event.target.value)
                  }
                />
              </label>
              <label className="minimal-field">
                Description
                <textarea
                  value={activeProject.description}
                  onChange={(event) =>
                    updateProject(
                      expandedProject,
                      "description",
                      event.target.value,
                    )
                  }
                  rows={5}
                />
              </label>
              <label className="minimal-field">
                Project link
                <input
                  type="url"
                  value={activeProject.link}
                  onChange={(event) =>
                    updateProject(expandedProject, "link", event.target.value)
                  }
                  placeholder="https://"
                />
              </label>
              <label className="project-editor-color">
                Project color
                <input
                  type="color"
                  value={activeProject.color}
                  onChange={(event) =>
                    updateProject(expandedProject, "color", event.target.value)
                  }
                />
              </label>
            </div>
            <button
              type="button"
              className="project-editor-done"
              onClick={() => setExpandedProject(null)}
            >
              Save project
            </button>
          </section>
        </div>
      )}
    </section>
  );
}

function readSettings(templateName, templateStyle, projectId, isNewProject) {
  const resolvedTemplate =
    templateName || TEMPLATE_NAME_BY_STYLE[templateStyle] || undefined;

  if (isNewProject) {
    return {
      settings: getTemplateDefaults(resolvedTemplate),
      error: "",
    };
  }

  try {
    const saved = window.localStorage.getItem(getStorageKey(projectId));
    if (!saved) {
      return {
        settings: getTemplateDefaults(resolvedTemplate),
        error: "",
      };
    }

    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Saved customization data is invalid.");
    }

    return {
      settings: getSavedSettings(parsed, resolvedTemplate),
      error: "",
    };
  } catch (error) {
    return {
      settings: getTemplateDefaults(resolvedTemplate),
      error: `Could not load saved customizations: ${error.message}`,
    };
  }
}

// Editor to customize portfolio
function Editor() {
  const [searchParams] = useSearchParams(); 
  const location = useLocation();
  const {
    template: selectedTemplate,
    templateStyle: selectedTemplateStyle,
    projectId,
    isNewProject,
  } =
    location.state || {};
  const requestedStyle =
    searchParams.get("template") || selectedTemplateStyle;
  const [initialState] = useState(() =>
    readSettings(selectedTemplate, requestedStyle, projectId, isNewProject),
  );
  const [settings, setSettings] = useState(initialState.settings);
  const [storageError, setStorageError] = useState(initialState.error);

  function saveSettings(nextSettings) {
    setSettings(nextSettings);
    try {
      window.localStorage.setItem(
        getStorageKey(projectId),
        JSON.stringify(nextSettings),
      );
      setStorageError("");
    } catch (error) {
      setStorageError(`Could not save customizations: ${error.message}`);
    }
  }

  function updateSetting(event) {
    const { name, value } = event.target;
    saveSettings({ ...settings, [name]: value });
  }

  function resetSettings() {
    saveSettings(getTemplateDefaults(selectedTemplate || settings.template));
  }

  // Determine which template is currently selected for conditional rendering
  const isMinimalStudio = settings.template === "Minimal Studio";
  const previewStyle = getTemplateStyle(settings.template);

  function updateProject(index, field, value) {
    const projects = settings.projects.map((project, projectIndex) =>
      projectIndex === index ? { ...project, [field]: value } : project,
    );
    saveSettings({ ...settings, projects });
  }

  if (isMinimalStudio) {
    return (
      <section className="editor-page minimal-studio-editor-page">
        <MinimalStudioEditor
          settings={settings}
          updateSetting={updateSetting}
          updateProject={updateProject}
          resetSettings={resetSettings}
          storageError={storageError}
        />
      </section>
    );
  }

  return (
    <section className="editor-page">
      <div className="editor" aria-labelledby="editor-title">
        <div className="editor-topbar">
          <Link className="editor-logo" to="/homepage">
            PortfolioBuilder<span>.</span>
          </Link>
          <div className="editor-actions">
            <Link className="home-link" to="/homepage">
              Back to Home
            </Link>
            <Link className="projects-link" to="/your-projects">
              Your Projects
            </Link>
          </div>
        </div>
        <header className="editor-heading">
          <p className="editor-eyebrow">
            {selectedTemplate ? `${selectedTemplate} template` : "Make it yours"}
          </p>
          <h1 id="editor-title">Personalize your portfolio</h1>
          <p>Update your details and style. Your choices are saved on this device.</p>
        </header>

        <div className="editor-layout">
          <form
            className="customization-panel"
            onSubmit={(event) => event.preventDefault()}
          >
            <h2>Your details</h2>
            <label className="customization-field">
              Display name
              <input
                name="name"
                type="text"
                value={settings.name}
                onChange={updateSetting}
                maxLength={60}
              />
            </label>
            <label className="customization-field">
              Introduction
              <textarea
                name="headline"
                value={settings.headline}
                onChange={updateSetting}
                rows={3}
                maxLength={180}
              />
            </label>

            <h2 className="appearance-title">Appearance</h2>
            <label className="customization-field color-field">
              Accent color
              <input
                name="accent"
                type="color"
                value={settings.accent}
                onChange={updateSetting}
              />
            </label>
            <label className="customization-field color-field">
              Background color
              <input
                name="background"
                type="color"
                value={settings.background}
                onChange={updateSetting}
              />
            </label>
            <label className="customization-field color-field">
              Font color
              <input
                name="fontColor"
                type="color"
                value={settings.fontColor}
                onChange={updateSetting}
              />
            </label>
            <label className="customization-field">
              Font style
              <select
                name="font"
                value={settings.font}
                onChange={updateSetting}
              >
                {FONT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="template-cta">
              <h2>{settings.template} selected</h2>
              <p>Customize your portfolio, then preview your finished project.</p>
            </div>

            <button
              className="reset-customization"
              type="button"
              onClick={resetSettings}
            >
              Reset to defaults
            </button>
            {storageError && (
              <p className="storage-error" role="alert">
                {storageError}
              </p>
            )}
          </form>

          <section
            className={`portfolio-preview preview-style-${previewStyle} ${
              isMinimalStudio ? "minimal-studio-preview" : ""
            }`}
            aria-label="Live portfolio preview"
            style={{
              "--preview-accent": settings.accent,
              "--preview-background": settings.background,
              "--preview-text": settings.fontColor,
              "--preview-font": settings.font,
            }}
          >
            <div className="preview-topline">
              <span className="preview-mark" aria-hidden="true">
                {settings.name.trim().charAt(0).toUpperCase() || "A"}
              </span>
              <span>PORTFOLIO</span>
            </div>
            <div className="preview-content">
              <p className="preview-label">HELLO, I'M</p>
              <h2>{settings.name || "Your name"}</h2>
              <p className="preview-headline">
                {settings.headline ||
                  "Add a short introduction about yourself."}
              </p>
              <button className="preview-contact" type="button">
                Get in touch
              </button>
            </div>
            <div className="preview-projects" aria-hidden="true">
              <span className="preview-project preview-project-one" />
              <span className="preview-project preview-project-two" />
              <span className="preview-project preview-project-three" />
            </div>
            <p className="preview-caption">Live preview</p>
          </section>
        </div>
      </div>
    </section>
  );
}

export default Editor;