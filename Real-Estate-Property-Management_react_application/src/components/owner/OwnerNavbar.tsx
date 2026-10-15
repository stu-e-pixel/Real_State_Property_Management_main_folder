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
  Chip,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  AccountCircle,
  Dashboard,
  HomeWork,
  KeyboardArrowDown,
  LockReset,
  Logout,
  PersonOutlineOutlined,
} from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import NotificationBell from "../notification/NotificationBell";

const OwnerNavbar: React.FC = () => {
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
        bgcolor: "#ffffff",
        color: "#0f172a",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 3px 15px rgba(15, 23, 42, 0.04)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 64, md: 76 },
          px: { xs: 2, sm: 3, md: 5 },
          gap: 2,
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
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
              borderRadius: 2.5,
              background: "linear-gradient(135deg, #134e4a 0%, #047857 100%)",
              color: "#d1fae5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 5px 12px rgba(4, 120, 87, 0.18)",
            }}
          >
            <HomeWork sx={{ fontSize: 25 }} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: { xs: 15, sm: 18 },
                letterSpacing: "-0.5px",
                lineHeight: 1.3,
                color: "#0f172a",
              }}
            >
              RealEstate
            </Typography>

            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: { xs: 1, sm: 1.6 },
                color: "#047857",
                textTransform: "uppercase",
                mt: 0.25,
              }}
            >
              Owner Workspace
            </Typography>
          </Box>
        </Box>

        {isAuthenticated ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1.5 },
            }}
          >
            <NotificationBell />

            <Button
              component={Link}
              to="/owner/dashboard"
              startIcon={<Dashboard />}
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                color: "#475569",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: 2,
                px: 2,
                "&:hover": {
                  bgcolor: "#ecfdf5",
                  color: "#047857",
                },
              }}
            >
              Dashboard
            </Button>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                display: { xs: "none", sm: "block" },
                my: 1,
                borderColor: "#e2e8f0",
              }}
            />

            <Button
              onClick={handleMenu}
              endIcon={
                <KeyboardArrowDown
                  sx={{
                    color: "#64748b",
                    transition: "transform 0.2s",
                    transform: anchorEl ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              }
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 0.75,
                pl: 1,
                borderRadius: 3,
                textTransform: "none",
                color: "#0f172a",
                "&:hover": {
                  bgcolor: "#f1f5f9",
                },
                "& .MuiButton-endIcon": {
                  ml: { xs: 0, sm: 0.5 },
                },
              }}
            >
              <Avatar
                src={user?.image || undefined}
                alt={user?.name || "Owner"}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#d1fae5",
                  color: "#065f46",
                  border: "2px solid #a7f3d0",
                  fontWeight: 800,
                  fontSize: 16,
                }}
              >
                {user?.name?.trim()?.charAt(0)?.toUpperCase() || (
                  <AccountCircle />
                )}
              </Avatar>

              <Box
                sx={{
                  display: { xs: "none", sm: "block" },
                  textAlign: "left",
                  maxWidth: 150,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#0f172a",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 150,
                  }}
                >
                  {user?.name || "Owner"}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 11,
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  Property Owner
                </Typography>
              </Box>
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
                  sx: {
                    mt: 1.5,
                    minWidth: 250,
                    borderRadius: 3,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 15px 40px rgba(15, 23, 42, 0.12)",
                    overflow: "hidden",
                  },
                },
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  bgcolor: "#f8fafc",
                }}
              >
                <Avatar
                  src={user?.image || undefined}
                  alt={user?.name || "Owner"}
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: "#d1fae5",
                    color: "#065f46",
                    fontWeight: 800,
                  }}
                >
                  {user?.name?.trim()?.charAt(0)?.toUpperCase() || (
                    <AccountCircle />
                  )}
                </Avatar>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: "#0f172a",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {user?.name || "Owner"}
                  </Typography>

                  <Chip
                    label="Verified workspace"
                    size="small"
                    sx={{
                      mt: 0.5,
                      height: 21,
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#047857",
                      bgcolor: "#d1fae5",
                    }}
                  />
                </Box>
              </Box>

              <Divider />

              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/owner/profile");
                }}
                sx={{
                  py: 1.25,
                  mx: 1,
                  mt: 1,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#ecfdf5" },
                }}
              >
                <ListItemIcon>
                  <PersonOutlineOutlined sx={{ color: "#047857" }} />
                </ListItemIcon>
                <ListItemText
                  primary="My Profile"
                  secondary="Manage your account"
                  slotProps={{
                    primary: {
                      sx: { fontSize: 13, fontWeight: 700 },
                    },
                    secondary: {
                      sx: { fontSize: 11 },
                    },
                  }}
                />
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/owner/change-password");
                }}
                sx={{
                  py: 1.25,
                  mx: 1,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#ecfdf5" },
                }}
              >
                <ListItemIcon>
                  <LockReset sx={{ color: "#047857" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Change Password"
                  secondary="Update your security"
                  slotProps={{
                    primary: {
                      sx: { fontSize: 13, fontWeight: 700 },
                    },
                    secondary: {
                      sx: { fontSize: 11 },
                    },
                  }}
                />
              </MenuItem>

              <Divider sx={{ my: 1 }} />

              <MenuItem
                onClick={handleLogout}
                sx={{
                  py: 1.25,
                  mx: 1,
                  mb: 1,
                  borderRadius: 2,
                  color: "#dc2626",
                  "&:hover": { bgcolor: "#fef2f2" },
                }}
              >
                <ListItemIcon>
                  <Logout sx={{ color: "#dc2626" }} />
                </ListItemIcon>

                <ListItemText
                  primary="Logout"
                  slotProps={{
                    primary: {
                      sx: { fontSize: 13, fontWeight: 800 },
                    },
                  }}
                />
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Button
              component={Link}
              to="/login"
              sx={{
                color: "#334155",
                fontWeight: 800,
                textTransform: "none",
                borderRadius: 2,
                px: { xs: 1.25, sm: 2 },
                "&:hover": { bgcolor: "#f1f5f9" },
              }}
            >
              Login
            </Button>

            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                bgcolor: "#047857",
                color: "#ffffff",
                fontWeight: 800,
                textTransform: "none",
                borderRadius: 2,
                px: { xs: 1.5, sm: 2.5 },
                py: 1,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#065f46",
                  boxShadow: "none",
                },
              }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default OwnerNavbar;
