import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../auth";

/*
ProtectedRoute.jsx makes sure you are logged in before accessing
the your projects page. If you aren't logged in -> sends you to login page.
*/

function ProtectedRoute({ children }) {
  const location = useLocation();
  const username = getCurrentUser();

  if (!username) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
