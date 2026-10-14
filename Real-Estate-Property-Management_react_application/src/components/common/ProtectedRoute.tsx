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

/**
 * Get the "home" route for each role after login.
 * Used when a wrong role tries to access a route.
 */
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

  // Not logged in
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Decode role from token
  const role = getRoleFromToken(accessToken);

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Build the list of allowed roles (supports both single & multiple)
  const roles: Role[] = allowedRoles
    ? allowedRoles
    : allowedRole
    ? [allowedRole]
    : [];

  // If a role restriction exists and the user's role isn't allowed → redirect home
  if (roles.length > 0 && !roles.includes(role as Role)) {
    return <Navigate to={getRoleHome(role)} replace />;
  }

  // Authorized — render nested routes
  return <Outlet />;
};

export default ProtectedRoute;