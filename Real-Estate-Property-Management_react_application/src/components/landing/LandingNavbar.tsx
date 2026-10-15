import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Container,
  Divider,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Close,
  Home,
  ArrowForward,
} from "@mui/icons-material";

import { Link } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const LandingNavbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <AppBar
      component="header"
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        color: "#0f172a",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 68, md: 80 },
            gap: 2,
          }}
        >
          <Box
            component={Link}
            to="/"
            aria-label="RealEstate home"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              textDecoration: "none",
              color: "#0f172a",
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 42,
                height: 42,
                borderRadius: 2.5,
                bgcolor: "#0f766e",
                color: "#ffffff",
                flexShrink: 0,
              }}
            >
              <Home sx={{ fontSize: 25 }} />
            </Box>

            <Box>
              <Typography
                component="span"
                sx={{
                  display: "block",
                  fontSize: { xs: 19, md: 22 },
                  fontWeight: 800,
                  letterSpacing: "-0.7px",
                  lineHeight: 1.2,
                  color: "#0f172a",
                }}
              >
                RealEstate
              </Typography>

              <Typography
                component="span"
                sx={{
                  display: { xs: "none", sm: "block" },
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "#64748b",
                  mt: 0.3,
                }}
              >
                Find Your Place
              </Typography>
            </Box>
          </Box>

          {!isMobile && (
            <Box
              component="nav"
              aria-label="Main navigation"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  sx={{
                    textTransform: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    color: "#475569",
                    "&:hover": {
                      bgcolor: "#f0fdfa",
                      color: "#0f766e",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}

              <Button
                component={Link}
                to="/login"
                variant="contained"
                endIcon={<ArrowForward />}
                sx={{
                  ml: 2,
                  px: 2.5,
                  py: 1.2,
                  borderRadius: 2.5,
                  bgcolor: "#0f766e",
                  color: "#ffffff",
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#115e59",
                    boxShadow: "0 6px 16px rgba(15, 118, 110, 0.2)",
                  },
                }}
              >
                Sign In
              </Button>
            </Box>
          )}

          {isMobile && (
            <IconButton
              aria-label="Open navigation menu"
              onClick={() => setDrawerOpen(true)}
              sx={{
                width: 44,
                height: 44,
                color: "#0f172a",
                bgcolor: "#f1f5f9",
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "#ccfbf1",
                  color: "#0f766e",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={closeDrawer}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "85%", sm: 320 },
              maxWidth: 360,
              bgcolor: "#ffffff",
              color: "#0f172a",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            p: 2.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              mb: 2,
            }}
          >
            <Box
              component={Link}
              to="/"
              onClick={closeDrawer}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                textDecoration: "none",
                color: "#0f172a",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  bgcolor: "#0f766e",
                  color: "#ffffff",
                }}
              >
                <Home />
              </Box>

              <Typography
                component="span"
                sx={{ fontSize: 19, fontWeight: 800 }}
              >
                RealEstate
              </Typography>
            </Box>

            <IconButton
              aria-label="Close navigation menu"
              onClick={closeDrawer}
              sx={{
                bgcolor: "#f1f5f9",
                color: "#475569",
                "&:hover": {
                  bgcolor: "#e2e8f0",
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>

          <Typography
            component="p"
            sx={{
              color: "#64748b",
              fontSize: 13,
              mb: 2,
            }}
          >
            Find your next place to call home.
          </Typography>

          <Divider sx={{ borderColor: "#e2e8f0", mb: 2 }} />

          <List disablePadding>
            {NAV_ITEMS.map((item) => (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={closeDrawer}
                  sx={{
                    py: 1.4,
                    px: 1.5,
                    borderRadius: 2,
                    color: "#334155",
                    "&:hover": {
                      bgcolor: "#f0fdfa",
                      color: "#0f766e",
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize: 15,
                          fontWeight: 600,
                        },
                      },
                    }}
                  />
                  <ArrowForward sx={{ fontSize: 17, color: "#94a3b8" }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 3,
              bgcolor: "#f0fdfa",
              border: "1px solid #ccfbf1",
            }}
          >
            <Typography
              component="p"
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: "#134e4a",
                mb: 0.5,
              }}
            >
              Ready to find your property?
            </Typography>

            <Typography
              component="p"
              sx={{
                fontSize: 12,
                color: "#64748b",
                mb: 2,
                lineHeight: 1.6,
              }}
            >
              Sign in to explore your real estate options.
            </Typography>

            <Button
              component={Link}
              to="/login"
              variant="contained"
              fullWidth
              endIcon={<ArrowForward />}
              onClick={closeDrawer}
              sx={{
                py: 1.2,
                borderRadius: 2,
                bgcolor: "#0f766e",
                color: "#ffffff",
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#115e59",
                  boxShadow: "none",
                },
              }}
            >
              Sign In
            </Button>
          </Box>

          <Typography
            component="p"
            sx={{
              textAlign: "center",
              color: "#94a3b8",
              fontSize: 11,
              mt: 2,
            }}
          >
            © {new Date().getFullYear()} RealEstate
          </Typography>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default LandingNavbar;
