import "./Editor.css";
import { useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "portfolio-customization";

const DEFAULT_SETTINGS = {
  name: "Alex Morgan",
  headline: "Designer & developer creating thoughtful digital experiences.",
  accent: "#6d28d9",
  background: "#ffffff",
  font: "Arial, sans-serif",
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

function readSettings() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return { settings: DEFAULT_SETTINGS, error: "" };

    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Saved customization data is invalid.");
    }

    return {
      settings: {
        name: typeof parsed.name === "string" ? parsed.name : DEFAULT_SETTINGS.name,
        headline:
          typeof parsed.headline === "string"
            ? parsed.headline
            : DEFAULT_SETTINGS.headline,
        accent:
          typeof parsed.accent === "string" && /^#[\da-f]{6}$/i.test(parsed.accent)
            ? parsed.accent
            : DEFAULT_SETTINGS.accent,
        background:
          typeof parsed.background === "string" &&
          /^#[\da-f]{6}$/i.test(parsed.background)
            ? parsed.background
            : DEFAULT_SETTINGS.background,
        font: FONT_OPTIONS.some((option) => option.value === parsed.font)
          ? parsed.font
          : DEFAULT_SETTINGS.font,
      },
      error: "",
    };
  } catch (error) {
    return {
      settings: DEFAULT_SETTINGS,
      error: `Could not load saved customizations: ${error.message}`,
    };
  }
}

function Editor() {
  const [initialState] = useState(readSettings);
  const [settings, setSettings] = useState(initialState.settings);
  const [storageError, setStorageError] = useState(initialState.error);

  function saveSettings(nextSettings) {
    setSettings(nextSettings);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings));
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
    saveSettings(DEFAULT_SETTINGS);
  }

  return (
    <section className="editor-page">
      <div className="editor" aria-labelledby="editor-title">
        <Link className="home-link" to="/">
          Back to Home
        </Link>
        <header className="editor-heading">
          <p className="editor-eyebrow">Make it yours</p>
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
              <h2>Ready to continue?</h2>
              <Link className="choose-template-button" to="/templates">
                Choose a Template
              </Link>
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
            className="portfolio-preview"
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
              <span>PORTFOLIO</span>
            </div>
            <div className="preview-content">
              <p className="preview-label">HELLO, I'M</p>
              <h2>{settings.name || "Your name"}</h2>
              <p className="preview-headline">
                {settings.headline || "Add a short introduction about yourself."}
              </p>
              <button className="preview-contact" type="button">
                Get in touch
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