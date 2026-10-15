import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Divider,
} from "@mui/material";

import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
  Home,
} from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";

const LandingFooter = () => {
  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Properties", path: "/login" },
    { label: "Services", path: "/services" },
    { label: "About", path: "/about" },
  ];

  const supportLinks = [
    { label: "Contact Us", path: "/contact" },
    { label: "Help Center", path: "/help" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Privacy Policy", path: "/privacy" },
  ];

  const socialLinks = [
    { label: "Facebook", Icon: Facebook, url: "https://facebook.com" },
    { label: "Twitter", Icon: Twitter, url: "https://twitter.com" },
    { label: "Instagram", Icon: Instagram, url: "https://instagram.com" },
    { label: "LinkedIn", Icon: LinkedIn, url: "https://linkedin.com" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#0f172a",
        color: "#cbd5e1",
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            mb: 4,
          }}
        >
          <Box sx={{ flex: "1 1 240px", minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <Home sx={{ color: "primary.main", fontSize: 28 }} />

              <Typography
                component="h2"
                variant="h6"
                sx={{ fontWeight: 800, color: "#fff" }}
              >
                RealEstate
              </Typography>
            </Box>

            <Typography
              component="p"
              variant="body2"
              sx={{ mb: 2, lineHeight: 1.7, color: "#cbd5e1" }}
            >
              Your trusted partner for finding, buying, and renting properties
              across the country.
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              {socialLinks.map(({ label, Icon, url }) => (
                <IconButton
                  key={label}
                  component="a"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  size="small"
                  sx={{
                    color: "#94a3b8",
                    bgcolor: "#1e293b",
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "#fff",
                    },
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
          </Box>

          <Box sx={{ flex: "1 1 130px", minWidth: 0 }}>
            <Typography
              component="h3"
              variant="subtitle2"
              sx={{ fontWeight: 700, color: "#fff", mb: 2 }}
            >
              Quick Links
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {quickLinks.map((item) => (
                <Link
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  underline="none"
                  sx={{
                    color: "#94a3b8",
                    fontSize: 14,
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Box>
          </Box>

          <Box sx={{ flex: "1 1 130px", minWidth: 0 }}>
            <Typography
              component="h3"
              variant="subtitle2"
              sx={{ fontWeight: 700, color: "#fff", mb: 2 }}
            >
              Support
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {supportLinks.map((item) => (
                <Link
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  underline="none"
                  sx={{
                    color: "#94a3b8",
                    fontSize: 14,
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Box>
          </Box>

          <Box sx={{ flex: "1 1 240px", minWidth: 0 }}>
            <Typography
              component="h3"
              variant="subtitle2"
              sx={{ fontWeight: 700, color: "#fff", mb: 2 }}
            >
              Contact
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <LocationOn
                  fontSize="small"
                  sx={{ color: "primary.main", flexShrink: 0, mt: 0.2 }}
                />

                <Typography
                  component="p"
                  variant="body2"
                  sx={{ color: "#cbd5e1", lineHeight: 1.6 }}
                >
                  123 Real Estate Ave, New York, NY 10001
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone
                  fontSize="small"
                  sx={{ color: "primary.main", flexShrink: 0 }}
                />

                <Typography component="p" variant="body2">
                  +1 (234) 567-8900
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email
                  fontSize="small"
                  sx={{ color: "primary.main", flexShrink: 0 }}
                />

                <Typography component="p" variant="body2">
                  hello@realestate.com
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#334155", mb: 3 }} />

        <Typography
          component="p"
          variant="caption"
          sx={{
            color: "#64748b",
            display: "block",
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} RealEstate. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default LandingFooter;
