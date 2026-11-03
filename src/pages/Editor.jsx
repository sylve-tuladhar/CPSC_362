import "./Editor.css";
import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

const STORAGE_KEY = "portfolio-customization";
const PROJECT_STORAGE_PREFIX = "portfolio-customization-project-";

const DEFAULT_SETTINGS = {
  template: "Portfolio",
  name: "Alex Morgan",
  headline: "Designer & developer creating thoughtful digital experiences.",
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
    headline:
      typeof parsed.headline === "string"
        ? parsed.headline
        : templateDefaults.headline,
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

  const isMinimalStudio = settings.template === "Minimal Studio";
  const previewStyle = getTemplateStyle(settings.template);

  return (
    <section
      className={`editor-page ${
        isMinimalStudio ? "minimal-studio-editor" : ""
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
              <span>
                {isMinimalStudio ? "SELECTED WORK / 2026" : "PORTFOLIO"}
              </span>
            </div>
            <div className="preview-content">
              <p className="preview-label">
                {isMinimalStudio ? "DESIGNER & DEVELOPER" : "HELLO, I'M"}
              </p>
              <h2>{settings.name || "Your name"}</h2>
              <p className="preview-headline">
                {settings.headline ||
                  "Add a short introduction about yourself."}
              </p>
              {isMinimalStudio && (
                <div className="minimal-project-grid" aria-label="Selected projects">
                  <div className="minimal-project minimal-project-one">
                    01 / Brand system
                  </div>
                  <div className="minimal-project minimal-project-two">
                    02 / Digital product
                  </div>
                </div>
              )}
              <button className="preview-contact" type="button">
                {isMinimalStudio ? "View selected work" : "Get in touch"}
              </button>
            </div>
            {!isMinimalStudio && (
              <div className="preview-projects" aria-hidden="true">
                <span className="preview-project preview-project-one" />
                <span className="preview-project preview-project-two" />
                <span className="preview-project preview-project-three" />
              </div>
            )}
            <p className="preview-caption">Live preview</p>
          </section>
        </div>
      </div>
    </section>
  );
}

export default Editor;