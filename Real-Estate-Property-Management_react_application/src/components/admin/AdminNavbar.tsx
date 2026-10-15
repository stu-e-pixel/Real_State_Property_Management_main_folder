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
import {
  AccountCircle,
  Apartment,
  KeyboardArrowDown,
  LockReset,
  Logout,
} from "@mui/icons-material";

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
        bgcolor: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(12px)",
        color: "#0f172a",
        borderBottom: "1px solid #dbe7e4",
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
            minWidth: 0,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              background: "linear-gradient(135deg, #134e4a, #0f766e)",
              boxShadow: "0 5px 14px rgba(15,118,110,0.22)",
            }}
          >
            <Apartment sx={{ fontSize: 26 }} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: { xs: "1rem", sm: "1.2rem" },
                fontWeight: 800,
                letterSpacing: "-0.6px",
                lineHeight: 1.3,
                color: "#0f172a",
                whiteSpace: "nowrap",
              }}
            >
              RealEstate
            </Typography>

            <Typography
              sx={{
                display: { xs: "none", sm: "block" },
                mt: 0.2,
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "1.7px",
                textTransform: "uppercase",
                color: "#0f766e",
              }}
            >
              Admin Workspace
            </Typography>
          </Box>
        </Box>
        {isAuthenticated ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
            }}
          >
            <NotificationBell />
            <Box
              sx={{
                display: { xs: "none", sm: "block" },
                textAlign: "right",
              }}
            >
              <Typography sx={{ fontSize: "0.73rem", color: "#64748b" }}>
                Welcome back,
              </Typography>

              <Typography
                sx={{
                  mt: 0.2,
                  fontSize: "0.9rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  maxWidth: 180,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.name || "Administrator"}
              </Typography>
            </Box>

            <Button
              onClick={handleMenu}
              aria-label="Open admin profile menu"
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
                  bgcolor: "#ecfdf5",
                  borderColor: "#99c9bd",
                },
                "& .MuiButton-endIcon": {
                  ml: { xs: 0.2, sm: 0.8 },
                },
              }}
            >
              <Avatar
                src={user?.image || undefined}
                alt={user?.name || "Admin"}
                sx={{
                  width: 39,
                  height: 39,
                  bgcolor: "#134e4a",
                  color: "#fff",
                  fontWeight: 800,
                  border: "2px solid #d1fae5",
                }}
              >
                {!user?.image && (user?.name?.charAt(0)?.toUpperCase() || "A")}
              </Avatar>
            </Button>

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
                    overflow: "hidden",
                    boxShadow: "0 14px 40px rgba(15,23,42,0.12)",
                    "& .MuiMenuItem-root": {
                      mx: 1,
                      my: 0.5,
                      px: 1.5,
                      py: 1.2,
                      borderRadius: "10px",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      gap: 1.5,
                    },
                  },
                },
              }}
            >
              <Box sx={{ px: 2.2, py: 2, bgcolor: "#f0fdfa" }}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "0.95rem",
                    color: "#134e4a",
                  }}
                >
                  {user?.name || "Administrator"}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.4,
                    fontSize: "0.75rem",
                    color: "#64748b",
                  }}
                >
                  Admin Account
                </Typography>
              </Box>

              <Divider sx={{ my: 0.7, borderColor: "#e2e8f0" }} />

              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/admin/profile");
                }}
              >
                <AccountCircle sx={{ color: "#0f766e", fontSize: 21 }} />
                My Profile
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/admin/change-password");
                }}
              >
                <LockReset sx={{ color: "#0f766e", fontSize: 21 }} />
                Change Password
              </MenuItem>

              <Divider sx={{ my: 0.7, borderColor: "#e2e8f0" }} />

              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: "#dc2626",
                  "&:hover": { bgcolor: "#fef2f2" },
                  "& svg": { color: "#dc2626" },
                }}
              >
                <Logout sx={{ fontSize: 20 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1.2 },
            }}
          >
            <Button
              component={Link}
              to="/login"
              sx={{
                px: { xs: 1.2, sm: 2 },
                borderRadius: "10px",
                color: "#134e4a",
                fontWeight: 700,
                textTransform: "none",
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
                bgcolor: "#0f766e",
                color: "#fff",
                fontWeight: 700,
                textTransform: "none",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 12px rgba(15,118,110,0.2)",
                "&:hover": {
                  bgcolor: "#115e59",
                  boxShadow: "0 6px 16px rgba(15,118,110,0.25)",
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
