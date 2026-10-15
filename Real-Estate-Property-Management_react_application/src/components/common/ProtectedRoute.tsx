import { Navigate, Outlet } from "react-router-dom";
import { getAuthCookie } from "../../utils/cookieUtils";

type Role = "admin" | "agent" | "owner" | "customer";

interface ProtectedRouteProps {
  allowedRole?: Role;
  allowedRoles?: Role[];
}

const getRoleFromToken = (token: string): string | null => {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const decodedPayload = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );

    return decodedPayload.role || null;
  } catch (error) {
    console.error("Failed to decode access token:", error);
    return null;
  }
};


const getRoleHome = (role: string): string => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "agent":
      return "/agent/dashboard";
    case "owner":
      return "/owner/dashboard";
    case "customer":
      return "/customer/dashboard";
    default:
      return "/login";
  }
};

const ProtectedRoute = ({ allowedRole, allowedRoles }: ProtectedRouteProps) => {
  const { accessToken } = getAuthCookie();

  
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  
  const role = getRoleFromToken(accessToken);

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  
  const roles: Role[] = allowedRoles
    ? allowedRoles
    : allowedRole
    ? [allowedRole]
    : [];

  
  if (roles.length > 0 && !roles.includes(role as Role)) {
    return <Navigate to={getRoleHome(role)} replace />;
  }

  
  return <Outlet />;
};

export default ProtectedRoute;