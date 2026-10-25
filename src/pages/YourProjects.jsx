import "./YourProjects.css";
import { Link } from "react-router-dom";
import {
  getCurrentUser,
  getProjectsForUser,
  logout,
  updateProjectName,
  deleteProject,
} from "../auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function YourProjects() {
  const navigate = useNavigate();
  const username = getCurrentUser();
  const [projects, setProjects] = useState(() => getProjectsForUser(username));
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectNames, setProjectNames] = useState(() =>
    Object.fromEntries(
      getProjectsForUser(username).map((project) => [
        project.id,
        project.name || project.template,
      ]),
    ),
  );

  function handleLogout() {
    logout();
    navigate("/homepage");
  }

  function handleRename(project) {
    const name = projectNames[project.id].trim();

    if (!name) {
      setProjectNames((currentNames) => ({
        ...currentNames,
        [project.id]: project.name || project.template,
      }));
      setEditingProjectId(null);
      return;
    }

    updateProjectName(project.id, username, name);
    setEditingProjectId(null);
  }

  function handleDelete(project) {
    if (!window.confirm(`Delete "${projectNames[project.id]}"?`)) {
      return;
    }

    deleteProject(project.id, username);
    setProjects((currentProjects) =>
      currentProjects.filter((currentProject) => currentProject.id !== project.id),
    );
    setEditingProjectId(null);
  }

  return (
    <div className="your-projects">
      <header className="navbar">
      <Link className="logo" to="/homepage">
        PortfolioBuilder<span>.</span>
      </Link>

      <nav aria-label="Main navigation">
        <Link to="/homepage">Return Home</Link>
        <Link to="/template-gallery">Templates</Link>
        <div className="account-menu">
          <button
            className="welcome-user"
            type="button"
            aria-expanded={accountMenuOpen}
            onClick={() => setAccountMenuOpen((isOpen) => !isOpen)}
          >
            Hi, {username}
          </button>
          {accountMenuOpen && (
            <div className="account-dropdown">
              <button type="button" onClick={handleLogout}>
                Log out
              </button>
            </div>
          )}
        </div>
      </nav>
      </header>

      <main>
        <div className="projects-hero">
          <div className="projects-hero-content">
            <p className="eyebrow">View all your projects with ease</p>
            <h1>Your Projects</h1>
            <p className="hero-description">
              Here, you can view all the projects you've created, manage them, and make updates as needed.
              </p>
            {projects.length > 0 ? (
              <div className="projects-grid">
                {projects.map((project) => (
                  <article className="project-card" key={project.id}>
                    {editingProjectId === project.id ? (
                      <div className="rename-form">
                        <label htmlFor={`project-name-${project.id}`}>
                          Project name
                        </label>
                        <input
                          id={`project-name-${project.id}`}
                          value={projectNames[project.id]}
                          maxLength={50}
                          onChange={(event) =>
                            setProjectNames((currentNames) => ({
                              ...currentNames,
                              [project.id]: event.target.value,
                            }))
                          }
                          autoFocus
                        />
                        <div className="rename-actions">
                          <button
                            type="button"
                            onClick={() => handleRename(project)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="cancel-rename"
                            onClick={() => setEditingProjectId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Link
                          className="project-card-link"
                          to="/editor"
                          state={{
                            template: project.template,
                            projectId: project.id,
                            isNewProject: false,
                          }}
                        >
                          <h3>{projectNames[project.id]}</h3>
                          <p>Created {new Date(project.createdAt).toLocaleDateString()}</p>
                          <span>Continue editing →</span>
                        </Link>
                        <button
                          className="rename-button"
                          type="button"
                          onClick={() => setEditingProjectId(project.id)}
                        >
                          Rename
                        </button>
                        <button
                          className="delete-button"
                          type="button"
                          onClick={() => handleDelete(project)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-projects">
                You have not created a project yet. Choose a template to get started.
              </p>
            )}

            <div className="projects-actions">
              <Link className="btn btn-primary" to="/template-gallery">
                Create New Project
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div className="footer-content">
          <p>&copy; 2026 PortfolioBuilder. All rights reserved.</p>
        </div>
      </footer>
      
    </div>
  );
}

export default YourProjects;