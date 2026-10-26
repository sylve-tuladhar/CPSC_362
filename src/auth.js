const USERS_KEY = "portfolio-builder-users";
const SESSION_KEY = "portfolio-builder-session";
const PROJECTS_KEY = "portfolio-builder-projects";

function readUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

export function getCurrentUser() {
  return localStorage.getItem(SESSION_KEY);
}

export function registerOrLogin(username) {
  const normalizedUsername = username.trim();
  const users = readUsers();

  if (!users.includes(normalizedUsername)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, normalizedUsername]));
  }

  localStorage.setItem(SESSION_KEY, normalizedUsername);
  return normalizedUsername;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getProjectsForUser(username) {
  try {
    const projects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || "[]");
    return Array.isArray(projects)
      ? projects.filter((project) => project.username === username)
      : [];
  } catch {
    return [];
  }
}

export function createProject(username, template) {
  const projects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || "[]");
  const project = {
    id: `${Date.now()}-${template.id}`,
    username,
    template: template.name,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(PROJECTS_KEY, JSON.stringify([...projects, project]));
  return project;
}

export function updateProjectName(projectId, username, name) {
  const projects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || "[]");
  const normalizedName = name.trim();
  const updatedProjects = projects.map((project) =>
    project.id === projectId && project.username === username
      ? { ...project, name: normalizedName }
      : project,
  );

  localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
}

export function deleteProject(projectId, username) {
  const projects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || "[]");
  const updatedProjects = projects.filter(
    (project) => project.id !== projectId || project.username !== username,
  );

  localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
}
