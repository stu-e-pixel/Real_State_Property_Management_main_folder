import React, { useEffect, useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Badge,
  Divider,
  ListItemIcon,
  TextField,
  InputAdornment,
} from "@mui/material";

import {
  AccountCircle,
  Logout,
  Email,
  Person,
  Lock,
  Event,
  AssignmentTurnedIn,
  Description,
  LocalOffer,
  Favorite as FavoriteIcon,
  Star,
  ReceiptLong,
  Search,
  Home,
} from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import { getMyFavorites } from "../../features/favorite/favoriteSlice";
import type { UserRole } from "../../typescript/type/auth.types";
import NotificationBell from "../notification/NotificationBell";

const getProfileRoute = (role?: UserRole): string => {
  switch (role) {
    case "admin":
      return "/admin/profile";
    case "agent":
      return "/agent/profile";
    case "owner":
      return "/owner/profile";
    case "customer":
    default:
      return "/user/profile";
  }
};

const getChangePasswordRoute = (role?: UserRole): string => {
  switch (role) {
    case "admin":
      return "/admin/change-password";
    case "agent":
      return "/agent/change-password";
    case "owner":
      return "/owner/change-password";
    case "customer":
    default:
      return "/change-password";
  }
};

const getDashboardRoute = (role?: UserRole): string => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "agent":
      return "/agent/dashboard";
    case "owner":
      return "/owner/dashboard";
    case "customer":
    default:
      return "/user";
  }
};

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const { favoritePropertyIds } = useAppSelector((state) => state.favorite);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isCustomer = user?.role === "customer";
  const favoriteCount = favoritePropertyIds.length;

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

  const handleSearch = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    navigate(`/user/properties/search?search=${encodeURIComponent(query)}`);
  };

  useEffect(() => {
    if (isCustomer) {
      dispatch(getMyFavorites());
    }
  }, [isCustomer, dispatch]);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.96)",
        color: "#0f172a",
        borderBottom: "1px solid #dbe7e4",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 64, md: 76 },
          maxWidth: 1440,
          width: "100%",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          gap: { xs: 1.5, md: 3 },
          flexWrap: { xs: "wrap", md: "nowrap" },
          py: { xs: 1.5, md: 0 },
        }}
      >
        <Typography
          variant="h5"
          component={Link}
          to={isAuthenticated ? getDashboardRoute(user?.role) : "/"}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1.25,
            flexGrow: { xs: 1, md: 0 },
            textDecoration: "none",
            color: "#0f172a",
            fontWeight: 900,
            fontSize: { xs: 21, sm: 24 },
            letterSpacing: "-1px",
            whiteSpace: "nowrap",
            "&:hover": { color: "#0f766e" },
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              display: "grid",
              placeItems: "center",
              borderRadius: "13px",
              color: "#ffffff",
              background: "linear-gradient(135deg, #0f172a 0%, #0f766e 100%)",
              boxShadow: "0 5px 14px rgba(15, 118, 110, 0.22)",
              fontSize: 21,
              fontWeight: 900,
              letterSpacing: 0,
            }}
          >
            <Home />
          </Box>

          <Box component="span">
            Homerenters
            <Box
              component="span"
              sx={{
                display: "block",
                fontSize: 9,
                letterSpacing: 2.5,
                color: "#0f766e",
                fontWeight: 800,
                mt: -0.25,
              }}
            >
              FIND YOUR PLACE
            </Box>
          </Box>
        </Typography>

        {isCustomer && (
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: "flex",
              alignItems: "center",
              flex: { xs: "1 1 100%", md: "1 1 auto" },
              order: { xs: 3, md: 0 },
              maxWidth: { md: 500 },
              mx: { md: "auto" },
              minWidth: 0,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search properties, locations..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              slotProps={{
                htmlInput: {
                  "aria-label": "Search properties",
                },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#0f766e", fontSize: 21 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 44,
                  borderRadius: "12px 0 0 12px",
                  bgcolor: "#f8fafc",
                  color: "#0f172a",
                  "& fieldset": { borderColor: "#dbe7e4" },
                  "&:hover fieldset": { borderColor: "#5eead4" },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0f766e",
                    borderWidth: 1.5,
                  },
                },
                "& .MuiInputBase-input": { fontSize: 14 },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              aria-label="Search properties"
              sx={{
                minWidth: { xs: 48, sm: 100 },
                height: 44,
                borderRadius: "0 12px 12px 0",
                textTransform: "none",
                fontWeight: 800,
                bgcolor: "#0f766e",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#115e59",
                  boxShadow: "none",
                },
              }}
            >
              <Search sx={{ mr: { xs: 0, sm: 0.75 }, fontSize: 20 }} />
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Search
              </Box>
            </Button>
          </Box>
        )}

        {isAuthenticated ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1.5 },
              ml: { md: "auto" },
            }}
          >
            <NotificationBell />

            {isCustomer && (
              <IconButton
                component={Link}
                to="/user/favorites"
                aria-label={`Favorites (${favoriteCount})`}
                sx={{
                  width: 42,
                  height: 42,
                  color: "#0f766e",
                  bgcolor: "#ecfdf5",
                  border: "1px solid #d1fae5",
                  display: { xs: "none", sm: "inline-flex" },
                  "&:hover": {
                    bgcolor: "#d1fae5",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Badge
                  badgeContent={favoriteCount}
                  color="error"
                  overlap="circular"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: 10,
                      fontWeight: 800,
                      minWidth: 17,
                      height: 17,
                    },
                  }}
                >
                  <FavoriteIcon fontSize="small" />
                </Badge>
              </IconButton>
            )}

            <IconButton
              onClick={handleMenu}
              aria-label="Open profile menu"
              sx={{
                p: 0.5,
                border: "2px solid transparent",
                "&:hover": {
                  borderColor: "#99f6e4",
                  bgcolor: "#f0fdfa",
                },
              }}
            >
              {user?.image ? (
                <Avatar
                  src={user.image}
                  alt={user?.name || "User"}
                  sx={{
                    width: 38,
                    height: 38,
                    border: "2px solid #fff",
                    boxShadow: "0 0 0 1px #ccfbf1",
                  }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: "#ccfbf1",
                    color: "#0f766e",
                  }}
                >
                  <AccountCircle />
                </Avatar>
              )}
            </IconButton>

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
                    minWidth: 255,
                    maxWidth: "calc(100vw - 24px)",
                    borderRadius: 3,
                    border: "1px solid #dbe7e4",
                    boxShadow: "0 16px 45px rgba(15, 23, 42, 0.14)",
                    overflow: "hidden",
                    "& .MuiMenuItem-root": {
                      mx: 0.75,
                      my: 0.25,
                      borderRadius: 1.5,
                      py: 1.1,
                      fontSize: 14,
                      color: "#334155",
                      "&:hover": {
                        bgcolor: "#ecfdf5",
                        color: "#0f766e",
                      },
                    },
                    "& .MuiListItemIcon-root": {
                      minWidth: 36,
                      color: "#0f766e",
                    },
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
                  background:
                    "linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)",
                }}
              >
                <Avatar
                  src={user?.image || undefined}
                  alt={user?.name || "User"}
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: "#ccfbf1",
                    color: "#0f766e",
                  }}
                >
                  {!user?.image && <AccountCircle />}
                </Avatar>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    noWrap
                    sx={{ fontWeight: 800, color: "#0f172a" }}
                  >
                    {user?.name}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "#64748b",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.email}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      display: "inline-block",
                      mt: 0.5,
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      bgcolor: "#d1fae5",
                      color: "#065f46",
                      fontWeight: 800,
                      textTransform: "capitalize",
                    }}
                  >
                    {user?.role}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 0.75, borderColor: "#edf2f0" }} />

              {isCustomer && (
                <>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate("/user/inquiries");
                    }}
                  >
                    <ListItemIcon>
                      <Email fontSize="small" />
                    </ListItemIcon>
                    My Inquiries
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate("/user/appointments");
                    }}
                  >
                    <ListItemIcon>
                      <Event fontSize="small" />
                    </ListItemIcon>
                    My Appointments
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate("/user/rental-applications");
                    }}
                  >
                    <ListItemIcon>
                      <AssignmentTurnedIn fontSize="small" />
                    </ListItemIcon>
                    My Rentals
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate("/user/leases");
                    }}
                  >
                    <ListItemIcon>
                      <Description fontSize="small" />
                    </ListItemIcon>
                    My Leases
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate("/user/sale-offers");
                    }}
                  >
                    <ListItemIcon>
                      <LocalOffer fontSize="small" />
                    </ListItemIcon>
                    My Offers
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate("/user/reviews");
                    }}
                  >
                    <ListItemIcon>
                      <Star fontSize="small" sx={{ color: "#d97706" }} />
                    </ListItemIcon>
                    My Reviews
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate("/user/sale-transactions");
                    }}
                  >
                    <ListItemIcon>
                      <ReceiptLong fontSize="small" />
                    </ListItemIcon>
                    My Transactions
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate("/user/favorites");
                    }}
                  >
                    <ListItemIcon>
                      <FavoriteIcon fontSize="small" />
                    </ListItemIcon>
                    Favorites
                    {favoriteCount > 0 && (
                      <Box
                        component="span"
                        sx={{
                          ml: "auto",
                          bgcolor: "#d1fae5",
                          color: "#065f46",
                          fontSize: 11,
                          fontWeight: 800,
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                        }}
                      >
                        {favoriteCount}
                      </Box>
                    )}
                  </MenuItem>

                  <Divider sx={{ my: 0.75, borderColor: "#edf2f0" }} />
                </>
              )}

              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate(getProfileRoute(user?.role));
                }}
              >
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                My Profile
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate(getChangePasswordRoute(user?.role));
                }}
              >
                <ListItemIcon>
                  <Lock fontSize="small" />
                </ListItemIcon>
                Change Password
              </MenuItem>

              <Divider sx={{ my: 0.75, borderColor: "#edf2f0" }} />

              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: "#dc2626 !important",
                  "&:hover": { bgcolor: "#fef2f2 !important" },
                  "& .MuiListItemIcon-root": {
                    color: "#dc2626 !important",
                  },
                }}
              >
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.75, sm: 1.25 },
              ml: "auto",
            }}
          >
            <Button
              component={Link}
              to="/login"
              variant="text"
              sx={{
                px: { xs: 1.25, sm: 2 },
                borderRadius: 2,
                color: "#334155",
                fontWeight: 800,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#ecfdf5",
                  color: "#0f766e",
                },
              }}
            >
              Login
            </Button>

            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                px: { xs: 1.75, sm: 2.5 },
                py: 1,
                borderRadius: 2,
                fontWeight: 800,
                textTransform: "none",
                whiteSpace: "nowrap",
                bgcolor: "#0f766e",
                boxShadow: "0 5px 14px rgba(15, 118, 110, 0.2)",
                "&:hover": {
                  bgcolor: "#115e59",
                  boxShadow: "0 7px 18px rgba(15, 118, 110, 0.28)",
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

export default Navbar;
