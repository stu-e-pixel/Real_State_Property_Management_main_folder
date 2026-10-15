import React, { useState } from "react";
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
} from "@mui/material";
import { AccountCircle, Dashboard, Logout } from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";

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
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "primary.main",
            fontWeight: 700,
          }}
        >
          RealEstate
        </Typography>

        
        {isAuthenticated ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            
            <Button
              component={Link}
              to="/admin/dashboard"
              color="inherit"
              startIcon={<Dashboard />}
            >
              Dashboard
            </Button>

            
            <IconButton onClick={handleMenu} size="large">
              {user?.image ? (
                <Avatar
                  src={user.image}
                  sx={{
                    width: 36,
                    height: 36,
                  }}
                />
              ) : (
                <AccountCircle />
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
            >
              
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/profile");
                }}
              >
                Profile
              </MenuItem>

              
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/change-password");
                }}
              >
                Change Password
              </MenuItem>

              
              <MenuItem onClick={handleLogout}>
                <Logout fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          
          <Box
            sx={{
              display: "flex",
              gap: 1,
            }}
          >
            
            <Button component={Link} to="/login" color="inherit">
              Login
            </Button>

            
            <Button component={Link} to="/register" variant="contained">
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
