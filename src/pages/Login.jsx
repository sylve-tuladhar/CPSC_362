import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { registerOrLogin } from "../auth";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  function handleSubmit(event) { // Handle username submission
    event.preventDefault();
    const normalizedUsername = username.trim();

    if (!/^[a-zA-Z0-9_ -]{2,24}$/.test(normalizedUsername)) {
      setError("Use 2–24 letters, numbers, spaces, hyphens, or underscores.");
      return;
    }

    registerOrLogin(normalizedUsername);
    navigate(location.state?.from || "/your-projects", { replace: true });
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <Link className="logo" to="/homepage">
          PortfolioBuilder<span>.</span>
        </Link>
        <p className="eyebrow">Welcome back</p>
        <h1>Log in to your workspace.</h1>
        <p className="login-description">
          Enter a username to register or return to your classroom portfolio.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
              setError("");
            }}
            placeholder="e.g. John"
            autoComplete="username"
            autoFocus
          />
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="primary-button" type="submit">
            Continue
          </button>
        </form>

        <Link className="login-home-link" to="/homepage">Return home</Link>
      </div>
    </main>
  );
}

export default Login;
