import { Navigate } from 'react-router';

const RoleGuard = ({ children, allowedRoles }) => {
  const authUser = {
    role: 'admin', // test
  };

  if (!allowedRoles.includes(authUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleGuard;
