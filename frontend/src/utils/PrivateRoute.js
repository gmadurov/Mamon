import AuthContext from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useContext }  from "react";
export const PrivateRoute = ({ roles = [], children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles.length > 1) {
    if (!roles.map((role) => user.roles.includes(role)).includes(true)) {
      return <Navigate to="not-enought-rights" />;
    }
  } else {
    if (user.roles.includes(roles)) {
      return <Navigate to="not-enought-rights" />;
    }
  }

  return children;
};
export default PrivateRoute;
