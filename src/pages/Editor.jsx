import "./Editor.css";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const STORAGE_KEY = "portfolio-customization";
const PROJECT_STORAGE_PREFIX = "portfolio-customization-project-";

const DEFAULT_SETTINGS = {
  template: "Portfolio",
  name: "Alex Morgan",
  headline: "Designer & developer creating thoughtful digital experiences.",
  accent: "#6d28d9",
  background: "#ffffff",
  font: "Arial, sans-serif",
};

const MINIMAL_STUDIO_SETTINGS = {
  template: "Minimal Studio",
  name: "Alex Morgan",
  headline: "Designer & developer creating thoughtful digital experiences.",
  accent: "#9caf88",
  background: "#eae8e3",
  font: "Georgia, serif",
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
  return projectId
    ? `${PROJECT_STORAGE_PREFIX}${projectId}`
    : STORAGE_KEY;
}

function readSettings(templateName, projectId, isNewProject) {
  const templateDefaults =
    templateName === "Minimal Studio" ? MINIMAL_STUDIO_SETTINGS : DEFAULT_SETTINGS;

  if (isNewProject) {
    return { settings: templateDefaults, error: "" };
  }

  try {
    const saved = window.localStorage.getItem(getStorageKey(projectId));
    if (!saved) return { settings: templateDefaults, error: "" };

    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Saved customization data is invalid.");
    }

    return {
      settings: {
        template: templateName || (
          typeof parsed.template === "string"
            ? parsed.template
            : templateDefaults.template
        ),
        name: typeof parsed.name === "string" ? parsed.name : templateDefaults.name,
        headline:
          typeof parsed.headline === "string"
            ? parsed.headline
            : templateDefaults.headline,
        accent:
          typeof parsed.accent === "string" && /^#[\da-f]{6}$/i.test(parsed.accent)
            ? parsed.accent
            : templateDefaults.accent,
        background:
          typeof parsed.background === "string" &&
          /^#[\da-f]{6}$/i.test(parsed.background)
            ? parsed.background
            : templateDefaults.background,
        font: FONT_OPTIONS.some((option) => option.value === parsed.font)
          ? parsed.font
          : templateDefaults.font,
      },
      error: "",
    };
  } catch (error) {
    return {
      settings: templateDefaults,
      error: `Could not load saved customizations: ${error.message}`,
    };
  }
}

function Editor() {
  const location = useLocation();
  const selectedTemplate = location.state?.template;
  const projectId = location.state?.projectId;
  const [initialState] = useState(() =>
    readSettings(selectedTemplate, projectId, location.state?.isNewProject),
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
    saveSettings(
      selectedTemplate === "Minimal Studio"
        ? MINIMAL_STUDIO_SETTINGS
        : DEFAULT_SETTINGS,
    );
  }

  return (
    <section
      className={`editor-page ${
        settings.template === "Minimal Studio" ? "minimal-studio-editor" : ""
      }`}
    >
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
            {location.state?.template
              ? `${location.state.template} template`
              : "Make it yours"}
          </p>
          <h1 id="editor-title">Personalize your portfolio</h1>
          <p>Update your details and style. Your choices are saved on this device.</p>
        </header>

        <div className="editor-layout">
          <form className="customization-panel" onSubmit={(event) => event.preventDefault()}>
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
            <label className="customization-field">
              Font style
              <select name="font" value={settings.font} onChange={updateSetting}>
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

            <button className="reset-customization" type="button" onClick={resetSettings}>
              Reset to defaults
            </button>
            {storageError && (
              <p className="storage-error" role="alert">
                {storageError}
              </p>
            )}
          </form>

          <section
            className={`portfolio-preview ${settings.template === "Minimal Studio" ? "minimal-studio-preview" : ""}`}
            aria-label="Live portfolio preview"
            style={{
              "--preview-accent": settings.accent,
              "--preview-background": settings.background,
              "--preview-font": settings.font,
            }}
          >
            <div className="preview-topline">
              <span className="preview-mark" aria-hidden="true">
                {settings.name.trim().charAt(0).toUpperCase() || "A"}
              </span>
              <span>
                {settings.template === "Minimal Studio"
                  ? "SELECTED WORK / 2026"
                  : "PORTFOLIO"}
              </span>
            </div>
            <div className="preview-content">
              <p className="preview-label">
                {settings.template === "Minimal Studio" ? "DESIGNER & DEVELOPER" : "HELLO, I'M"}
              </p>
              <h2>{settings.name || "Your name"}</h2>
              <p className="preview-headline">
                {settings.headline || "Add a short introduction about yourself."}
              </p>
              {settings.template === "Minimal Studio" && (
                <div className="minimal-project-grid" aria-label="Selected projects">
                  <div className="minimal-project minimal-project-one">01 / Brand system</div>
                  <div className="minimal-project minimal-project-two">02 / Digital product</div>
                </div>
              )}
              <button className="preview-contact" type="button">
                {settings.template === "Minimal Studio" ? "View selected work" : "Get in touch"}
              </button>
            </div>
            <p className="preview-caption">Live preview</p>
          </section>
        </div>
      </div>
    </section>
  );
}

export default Editor;