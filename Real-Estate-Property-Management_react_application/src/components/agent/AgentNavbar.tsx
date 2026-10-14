import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Divider,
} from "@mui/material";
import { AccountCircle, Apartment, KeyboardArrowDown, LockReset, Logout } from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import NotificationBell from "../notification/NotificationBell";

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleLogout = async (): Promise<void> => {
    handleClose();

    await dispatch(logout());

    navigate("/login");
  };

  return (
    <AppBar
  position="sticky"
  elevation={0}
  sx={{
    background: "rgba(255, 255, 255, 0.96)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #dbe7e4",
    color: "#0f172a",
  }}
>
  <Toolbar
    sx={{
      minHeight: { xs: 64, md: 76 },
      px: { xs: 2, sm: 3, md: 5 },
      gap: 2,
    }}
  >
    {/* BRAND */}
    <Box
      component={Link}
      to="/"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.3,
        flexGrow: 1,
        textDecoration: "none",
        color: "inherit",
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: 43,
          height: 43,
          borderRadius: "13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #134e4a, #0f766e)",
          color: "#fff",
          boxShadow: "0 5px 14px rgba(15, 118, 110, 0.22)",
          flexShrink: 0,
        }}
      >
        <Apartment sx={{ fontSize: 25 }} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: { xs: "1rem", sm: "1.15rem" },
            fontWeight: 800,
            letterSpacing: "-0.5px",
            lineHeight: 1.3,
            color: "#0f172a",
          }}
        >
          RealEstate
        </Typography>

        <Typography
          sx={{
            fontSize: "0.7rem",
            fontWeight: 600,
            color: "#0f766e",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            display: { xs: "none", sm: "block" },
          }}
        >
          Agent Workspace
        </Typography>
      </Box>
    </Box>

    {/* AUTHENTICATED USER */}
    {isAuthenticated ? (
      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
        {/* Welcome text */}
        <NotificationBell />
        <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
          
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "#64748b",
              fontWeight: 500,
            }}
          >
            Welcome back,
          </Typography>

          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "#0f172a",
              maxWidth: 180,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user?.name || "Agent"}
          </Typography>
        </Box>

        {/* Profile button */}
        <Button
          onClick={handleMenu}
          aria-label="Open profile menu"
          aria-haspopup="true"
          aria-expanded={Boolean(anchorEl)}
          endIcon={<KeyboardArrowDown />}
          sx={{
            minWidth: 0,
            p: { xs: 0.5, sm: 0.8 },
            pl: { sm: 1.2 },
            border: "1px solid #dbe7e4",
            borderRadius: "14px",
            textTransform: "none",
            color: "#0f172a",
            "&:hover": {
              backgroundColor: "#ecfdf5",
              borderColor: "#99c9bd",
            },
          }}
        >
          <Avatar
            src={user?.image || undefined}
            alt={user?.name || "Agent"}
            sx={{
              width: 39,
              height: 39,
              bgcolor: "#134e4a",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              border: "2px solid #d1fae5",
            }}
          >
            {!user?.image && (user?.name?.charAt(0)?.toUpperCase() || "A")}
          </Avatar>
        </Button>

        {/* PROFILE MENU */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                mt: 1.5,
                minWidth: 235,
                borderRadius: "16px",
                border: "1px solid #dbe7e4",
                boxShadow: "0 14px 40px rgba(15, 23, 42, 0.12)",
                overflow: "hidden",
                "& .MuiMenuItem-root": {
                  mx: 1,
                  my: 0.5,
                  px: 1.5,
                  py: 1.2,
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  gap: 1.5,
                },
              },
            },
          }}
        >
          {/* Menu header */}
          <Box sx={{ px: 2.2, py: 2, mb: 0.5, bgcolor: "#f0fdfa" }}>
            <Typography sx={{ fontWeight: 800, color: "#134e4a" }}>
              {user?.name || "Agent"}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.78rem",
                color: "#64748b",
                mt: 0.4,
              }}
            >
              Agent Account
            </Typography>
          </Box>

          <Divider sx={{ borderColor: "#e2e8f0", mb: 0.7 }} />

          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/agent/profile");
            }}
          >
            <AccountCircle sx={{ color: "#0f766e" }} />
            My Profile
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/agent/change-password");
            }}
          >
            <LockReset sx={{ color: "#0f766e" }} />
            Change Password
          </MenuItem>

          <Divider sx={{ borderColor: "#e2e8f0", my: 0.7 }} />

          <MenuItem
            onClick={handleLogout}
            sx={{
              color: "#dc2626",
              "&:hover": { backgroundColor: "#fef2f2" },
            }}
          >
            <Logout fontSize="small" />
            Logout
          </MenuItem>
        </Menu>
      </Box>
    ) : (
      /* GUEST USER */
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 1.5 },
        }}
      >
        <Button
          component={Link}
          to="/login"
          variant="text"
          sx={{
            color: "#134e4a",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "10px",
            px: { xs: 1.2, sm: 2 },
            "&:hover": { bgcolor: "#ecfdf5" },
          }}
        >
          Login
        </Button>

        <Button
          component={Link}
          to="/register"
          variant="contained"
          sx={{
            px: { xs: 1.5, sm: 2.5 },
            py: 1.1,
            borderRadius: "11px",
            textTransform: "none",
            fontWeight: 700,
            whiteSpace: "nowrap",
            bgcolor: "#0f766e",
            boxShadow: "0 4px 12px rgba(15, 118, 110, 0.2)",
            "&:hover": {
              bgcolor: "#115e59",
              boxShadow: "0 6px 16px rgba(15, 118, 110, 0.28)",
            },
          }}
        >
          Get Started
        </Button>
      </Box>
    )}
  </Toolbar>
</AppBar>
  );
};

export default Navbar;
