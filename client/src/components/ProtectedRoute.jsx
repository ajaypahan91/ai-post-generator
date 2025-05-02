import { Navigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth(); // Assuming useAuth is a hook that gives the current user

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
