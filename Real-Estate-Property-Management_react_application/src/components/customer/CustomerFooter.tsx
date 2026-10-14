import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Divider,
  TextField,
  Button,
  InputAdornment,
  Chip,
  Avatar,
  Tooltip,
} from "@mui/material";

import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Email,
  Phone,
  LocationOn,
  Send,
  Home,
  ArrowForward,
  Verified,
  Business,
  Apartment,
  Villa,
  Store,
  Warehouse as WarehouseIcon,
  Lan,
  Receipt,
  LocalOffer,
  Support,
  Policy,
  Gavel,
} from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";
import toast from "react-hot-toast";

// =====================================================
// CONFIG
// =====================================================

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "Browse Properties", to: "/properties" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Blog", to: "/blog" },
];

const PROPERTY_CATEGORIES = [
  {
    label: "Apartments",
    to: "/properties?type=Apartment",
    icon: <Apartment fontSize="small" />,
  },
  {
    label: "Houses",
    to: "/properties?type=House",
    icon: <Home fontSize="small" />,
  },
  {
    label: "Villas",
    to: "/properties?type=Villa",
    icon: <Villa fontSize="small" />,
  },
  {
    label: "Offices",
    to: "/properties?type=Office",
    icon: <Business fontSize="small" />,
  },
  {
    label: "Shops",
    to: "/properties?type=Shop",
    icon: <Store fontSize="small" />,
  },
  {
    label: "Warehouses",
    to: "/properties?type=Warehouse",
    icon: <WarehouseIcon fontSize="small" />,
  },
  {
    label: "Land",
    to: "/properties?type=Land",
    icon: <Lan fontSize="small" />,
  },
];

const SUPPORT_LINKS = [
  {
    label: "Help Center",
    to: "/help",
    icon: <Support fontSize="small" />,
  },
  {
    label: "Terms of Service",
    to: "/terms",
    icon: <Gavel fontSize="small" />,
  },
  {
    label: "Privacy Policy",
    to: "/privacy",
    icon: <Policy fontSize="small" />,
  },
  {
    label: "Refund Policy",
    to: "/refund",
    icon: <Receipt fontSize="small" />,
  },
  {
    label: "Pricing",
    to: "/pricing",
    icon: <LocalOffer fontSize="small" />,
  },
];

const SOCIAL_LINKS = [
  {
    icon: <Facebook />,
    href: "https://facebook.com",
    label: "Facebook",
    color: "#1877F2",
  },
  {
    icon: <Twitter />,
    href: "https://twitter.com",
    label: "Twitter",
    color: "#1DA1F2",
  },
  {
    icon: <Instagram />,
    href: "https://instagram.com",
    label: "Instagram",
    color: "#E4405F",
  },
  {
    icon: <LinkedIn />,
    href: "https://linkedin.com",
    label: "LinkedIn",
    color: "#0A66C2",
  },
  {
    icon: <YouTube />,
    href: "https://youtube.com",
    label: "YouTube",
    color: "#FF0000",
  },
];

// =====================================================
// COMPONENT
// =====================================================

const CustomerFooter: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [subscribing, setSubscribing] = useState<boolean>(false);

  const handleSubscribe = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const trimmed = email.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmed || !emailRegex.test(trimmed)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSubscribing(true);

    // Simulate API call
    setTimeout(() => {
      setSubscribing(false);
      setEmail("");

      toast.success("Subscribed! You'll hear from us soon.");
    }, 800);
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        bgcolor: "#0f172a",
        color: "#cbd5e1",
        pt: { xs: 6, md: 8 },
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* =====================================================
            TOP SECTION
        ===================================================== */}

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            mb: 5,
          }}
        >
          {/* =====================================================
              BRAND + NEWSLETTER
          ===================================================== */}

          <Box
            sx={{
              width: {
                xs: "100%",
                md: "calc(33.333% - 22px)",
              },
            }}
          >
            {/* Brand */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 44,
                  height: 44,
                }}
              >
                <Home />
              </Avatar>

              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#fff",
                    lineHeight: 1,
                    fontWeight: 800,
                  }}
                >
                  RealEstate
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: "#94a3b8",
                  }}
                >
                  Find Your Dream Home
                </Typography>
              </Box>
            </Box>

            {/* Description */}
            <Typography
              variant="body2"
              sx={{
                color: "#94a3b8",
                mb: 3,
                lineHeight: 1.7,
              }}
            >
              The trusted marketplace for buying, selling, and renting
              properties. Connect with verified agents and discover thousands of
              listings across the country.
            </Typography>

            {/* Newsletter Title */}
            <Typography
              variant="subtitle2"
              sx={{
                color: "#fff",
                mb: 1.5,
                fontWeight: 700,
              }}
            >
              Subscribe to our newsletter
            </Typography>

            {/* Newsletter Form */}
            <Box
              component="form"
              onSubmit={handleSubscribe}
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              <TextField
                size="small"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email
                          fontSize="small"
                          sx={{
                            color: "#64748b",
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#1e293b",
                    color: "#fff",

                    "& fieldset": {
                      borderColor: "#334155",
                    },

                    "&:hover fieldset": {
                      borderColor: "#475569",
                    },

                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },

                  "& input::placeholder": {
                    color: "#64748b",
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={subscribing}
                sx={{
                  minWidth: 48,
                  px: 2,
                  bgcolor: "primary.main",

                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                <Send fontSize="small" />
              </Button>
            </Box>

            {/* Verified Text */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 2,
                color: "#64748b",
              }}
            >
              <Verified fontSize="small" />

              <Typography variant="caption">
                Verified listings only. No spam, ever.
              </Typography>
            </Box>
          </Box>

          {/* =====================================================
              QUICK LINKS
          ===================================================== */}

          <Box
            sx={{
              width: {
                xs: "calc(50% - 16px)",
                sm: "calc(33.333% - 22px)",
                md: "calc(16.666% - 22px)",
              },
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: "#fff",
                mb: 2,
                fontWeight: 700,
              }}
            >
              Quick Links
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.2,
              }}
            >
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  to={link.to}
                  underline="none"
                  sx={{
                    color: "#94a3b8",
                    fontSize: 14,
                    transition: "all 0.2s",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,

                    "&:hover": {
                      color: "primary.main",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <ArrowForward
                    sx={{
                      fontSize: 12,
                      opacity: 0.7,
                    }}
                  />

                  {link.label}
                </Link>
              ))}
            </Box>
          </Box>

          {/* =====================================================
              PROPERTY CATEGORIES
          ===================================================== */}

          <Box
            sx={{
              width: {
                xs: "calc(50% - 16px)",
                sm: "calc(33.333% - 22px)",
                md: "calc(16.666% - 22px)",
              },
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: "#fff",
                mb: 2,
                fontWeight: 700,
              }}
            >
              Categories
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.2,
              }}
            >
              {PROPERTY_CATEGORIES.slice(0, 6).map((cat) => (
                <Link
                  key={cat.label}
                  component={RouterLink}
                  to={cat.to}
                  underline="none"
                  sx={{
                    color: "#94a3b8",
                    fontSize: 14,
                    transition: "all 0.2s",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,

                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: "#64748b",
                      display: "flex",
                    }}
                  >
                    {cat.icon}
                  </Box>

                  {cat.label}
                </Link>
              ))}
            </Box>
          </Box>

          {/* =====================================================
              SUPPORT
          ===================================================== */}

          <Box
            sx={{
              width: {
                xs: "calc(50% - 16px)",
                sm: "calc(33.333% - 22px)",
                md: "calc(16.666% - 22px)",
              },
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: "#fff",
                mb: 2,
                fontWeight: 700,
              }}
            >
              Support
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.2,
              }}
            >
              {SUPPORT_LINKS.map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  to={link.to}
                  underline="none"
                  sx={{
                    color: "#94a3b8",
                    fontSize: 14,
                    transition: "all 0.2s",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,

                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: "#64748b",
                      display: "flex",
                    }}
                  >
                    {link.icon}
                  </Box>

                  {link.label}
                </Link>
              ))}
            </Box>
          </Box>

          {/* =====================================================
              CONTACT
          ===================================================== */}

          <Box
            sx={{
              width: {
                xs: "calc(50% - 16px)",
                sm: "100%",
                md: "calc(16.666% - 22px)",
              },
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: "#fff",
                mb: 2,
                fontWeight: 700,
              }}
            >
              Contact
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* Address */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                <LocationOn
                  fontSize="small"
                  sx={{
                    color: "primary.main",
                    mt: 0.2,
                  }}
                />

                <Typography
                  variant="caption"
                  sx={{
                    color: "#94a3b8",
                  }}
                >
                  123 Real Estate Ave,
                  <br />
                  Suite 500
                  <br />
                  New York, NY 10001
                </Typography>
              </Box>

              {/* Phone */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Phone
                  fontSize="small"
                  sx={{
                    color: "primary.main",
                  }}
                />

                <Link
                  href="tel:+1234567890"
                  underline="hover"
                  sx={{
                    color: "#94a3b8",
                    fontSize: 13,
                  }}
                >
                  +1 (234) 567-890
                </Link>
              </Box>

              {/* Email */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Email
                  fontSize="small"
                  sx={{
                    color: "primary.main",
                  }}
                />

                <Link
                  href="mailto:support@realestate.com"
                  underline="hover"
                  sx={{
                    color: "#94a3b8",
                    fontSize: 13,
                  }}
                >
                  support@realestate.com
                </Link>
              </Box>

              {/* Social Icons */}
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    display: "block",
                    mb: 1,
                  }}
                >
                  Follow us
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    flexWrap: "wrap",
                  }}
                >
                  {SOCIAL_LINKS.map((social) => (
                    <Tooltip key={social.label} title={social.label}>
                      <IconButton
                        size="small"
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: "#94a3b8",
                          bgcolor: "#1e293b",
                          width: 34,
                          height: 34,
                          transition: "all 0.2s",

                          "&:hover": {
                            bgcolor: social.color,
                            color: "#fff",
                            transform: "translateY(-3px)",
                          },
                        }}
                      >
                        {React.cloneElement(social.icon, {
                          sx: {
                            fontSize: 16,
                          },
                        })}
                      </IconButton>
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* =====================================================
            TRUST BADGES
        ===================================================== */}

        <Box
          sx={{
            bgcolor: "#1e293b",
            borderRadius: 2,
            p: 2,
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
            }}
          >
            {/* Verified */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(33.333% - 11px)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Verified
                  sx={{
                    color: "success.main",
                  }}
                />

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#fff",
                      display: "block",
                      fontWeight: 700,
                    }}
                  >
                    100% Verified
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: "#94a3b8",
                    }}
                  >
                    Every listing is checked
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Support */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(33.333% - 11px)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Support
                  sx={{
                    color: "info.main",
                  }}
                />

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#fff",
                      display: "block",
                      fontWeight: 700,
                    }}
                  >
                    24/7 Support
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: "#94a3b8",
                    }}
                  >
                    We're always here to help
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Secure */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(33.333% - 11px)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Policy
                  sx={{
                    color: "warning.main",
                  }}
                />

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#fff",
                      display: "block",
                      fontWeight: 700,
                    }}
                  >
                    Secure Transactions
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: "#94a3b8",
                    }}
                  >
                    Your data is protected
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* =====================================================
            BOTTOM BAR
        ===================================================== */}

        <Divider
          sx={{
            borderColor: "#334155",
            mb: 3,
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* Copyright */}
          <Typography
            variant="caption"
            sx={{
              color: "#64748b",
            }}
          >
            © {new Date().getFullYear()} RealEstate. All rights reserved.
          </Typography>

          {/* Bottom Links */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Link
              component={RouterLink}
              to="/terms"
              underline="hover"
              sx={{
                color: "#64748b",
                fontSize: 12,

                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              Terms
            </Link>

            <Link
              component={RouterLink}
              to="/privacy"
              underline="hover"
              sx={{
                color: "#64748b",
                fontSize: 12,

                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              Privacy
            </Link>

            <Link
              component={RouterLink}
              to="/cookies"
              underline="hover"
              sx={{
                color: "#64748b",
                fontSize: 12,

                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              Cookies
            </Link>

            <Link
              component={RouterLink}
              to="/sitemap"
              underline="hover"
              sx={{
                color: "#64748b",
                fontSize: 12,

                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              Sitemap
            </Link>
          </Box>

          {/* Language */}
          <Chip
            label="🇺🇸 English"
            size="small"
            sx={{
              bgcolor: "#1e293b",
              color: "#94a3b8",
              fontSize: 11,
              height: 22,
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default CustomerFooter;
