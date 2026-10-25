import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../auth";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const username = getCurrentUser();

  if (!username) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
