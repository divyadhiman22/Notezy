import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";  

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
