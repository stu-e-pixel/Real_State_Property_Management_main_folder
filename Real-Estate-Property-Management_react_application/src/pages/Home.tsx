import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  Divider,
  Rating,
} from "@mui/material";
import {
  ArrowForward,
  Home as HomeIcon,
  Verified,
  Speed,
  SupportAgent,
  Search,
  LocationOn,
  Key,
  TrendingUp,
  ArrowOutward,
  Bed,
  Bathtub,
  SquareFoot,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// =====================================================
// DATA
// =====================================================

const FEATURES = [
  {
    icon: Search,
    title: "Smart Property Search",
    description:
      "Find the right property with intuitive filters and a search experience built around your needs.",
  },
  {
    icon: Verified,
    title: "Verified Properties",
    description:
      "Explore reviewed listings and make informed decisions with greater confidence.",
  },
  {
    icon: Speed,
    title: "A Simpler Process",
    description:
      "From discovering a property to contacting its owner, keep every step straightforward.",
  },
  {
    icon: SupportAgent,
    title: "Dedicated Support",
    description:
      "Get assistance with property inquiries and navigate your property journey with ease.",
  },
];

const PROPERTIES = [
  {
    id: 1,
    title: "The Modern Family Residence",
    location: "New York, NY",
    price: 850000,
    purpose: "Sale",
    type: "House",
    beds: 4,
    baths: 3,
    area: 2850,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&auto=format&fit=crop&q=85",
    tag: "FEATURED",
  },
  {
    id: 2,
    title: "Contemporary City Apartment",
    location: "Los Angeles, CA",
    price: 3200,
    purpose: "Rent",
    type: "Apartment",
    beds: 2,
    baths: 2,
    area: 1450,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000&auto=format&fit=crop&q=85",
    tag: "POPULAR",
  },
  {
    id: 3,
    title: "The Azure Luxury Villa",
    location: "Miami, FL",
    price: 1450000,
    purpose: "Sale",
    type: "Villa",
    beds: 5,
    baths: 4,
    area: 4200,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1000&auto=format&fit=crop&q=85",
    tag: "PREMIUM",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Johnson",
    role: "Home Buyer",
    initials: "SJ",
    rating: 5,
    text: "The entire experience felt effortless. I found a home that matched my needs, and connecting with the property owner was simple.",
  },
  {
    name: "Michael Chen",
    role: "Property Owner",
    initials: "MC",
    rating: 5,
    text: "Managing my listing and receiving genuine inquiries has been much easier. The platform makes property management feel organized.",
  },
  {
    name: "Priya Sharma",
    role: "First-time Buyer",
    initials: "PS",
    rating: 5,
    text: "I appreciated how easy it was to explore different options. The clear property details helped me make a more confident decision.",
  },
];

const STATS = [
  { value: "10K+", label: "Property listings" },
  { value: "500+", label: "Property professionals" },
  { value: "25K+", label: "Happy customers" },
  { value: "50+", label: "Cities covered" },
];

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

// =====================================================
// PAGE
// =====================================================

const HomePage = () => {
  const navigate = useNavigate();

  
  const [location, setLocation] = useState("");
  

  

  const handleSearch = () => {
    

    

    navigate(`/login`);
  };

  return (
    <Box sx={{ overflow: "hidden", bgcolor: "background.default" }}>
      {/* =====================================================
          HERO
      ===================================================== */}

      <Box
        sx={{
          position: "relative",
          color: "#fff",
          background:
            "linear-gradient(110deg, #101f35 0%, #17385b 52%, #24577b 100%)",
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 15 },
          "&::before": {
            content: '""',
            position: "absolute",
            width: { xs: 260, md: 500 },
            height: { xs: 260, md: 500 },
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
            right: { xs: -120, md: -80 },
            top: -100,
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: { xs: 5, md: 7 },
            }}
          >
            <Box sx={{ width: { xs: "100%", md: "calc(50% - 28px)" } }}>
              <Chip
                icon={
                  <Verified
                    sx={{ color: "#b9e6d3 !important", fontSize: 17 }}
                  />
                }
                label="A smarter way to find your next home"
                sx={{
                  mb: 3,
                  color: "#e4f4ed",
                  bgcolor: "rgba(255,255,255,0.09)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  fontWeight: 500,
                  borderRadius: 2,
                  height: 36,
                }}
              />

              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2.65rem", sm: "3.4rem", md: "4.1rem" },
                  lineHeight: 1.12,
                  letterSpacing: "-0.045em",
                  maxWidth: 620,
                  mb: 3,
                }}
              >
                Find a place to call{" "}
                <Box
                  component="span"
                  sx={{
                    color: "#9fe3c4",
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 500,
                  }}
                >
                  home.
                </Box>
              </Typography>

              <Typography
                sx={{
                  color: "rgba(255,255,255,0.76)",
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.9,
                  maxWidth: 500,
                  mb: 4,
                }}
              >
                Discover exceptional homes, explore trusted listings, and
                connect with property professionals who understand what matters
                to you.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: { xs: 4, md: 0 },
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate("/login")}
                  sx={{
                    bgcolor: "#b9e8d1",
                    color: "#122b27",
                    textTransform: "none",
                    fontWeight: 700,
                    px: 3.5,
                    py: 1.6,
                    borderRadius: 2,
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "#d1f4e3",
                      boxShadow: "0 10px 28px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  Explore properties
                </Button>

                <Button
                  variant="outlined"
                  endIcon={<ArrowOutward />}
                  onClick={() => navigate("/about")}
                  sx={{
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.35)",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "#fff",
                      bgcolor: "rgba(255,255,255,0.06)",
                    },
                  }}
                >
                  Discover our story
                </Button>
              </Box>
            </Box>

            {/* HERO IMAGE */}

            <Box
              sx={{
                width: { xs: "100%", md: "calc(50% - 28px)" },
                position: "relative",
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  height: { xs: 300, sm: 390, md: 470 },
                  borderRadius: { xs: 3, md: 5 },
                  backgroundImage:
                    "linear-gradient(180deg, rgba(9,24,39,0.02), rgba(9,24,39,0.30)), url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&auto=format&fit=crop&q=90')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: "1px solid rgba(255,255,255,0.22)",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: { xs: 12, sm: 20 },
                    right: { xs: 12, sm: 20 },
                    bottom: { xs: 12, sm: 20 },
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.96)",
                    color: "#142a3b",
                    backdropFilter: "blur(12px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#557065",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                      }}
                    >
                      DISCOVER YOUR NEXT CHAPTER
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: { xs: "1rem", sm: "1.2rem" },
                        fontWeight: 750,
                        mt: 0.5,
                      }}
                    >
                      A home that feels like you
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 0.5,
                        color: "text.secondary",
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 15, color: "#27825e" }} />
                      <Typography variant="caption">
                        Explore verified listings
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 2,
                      bgcolor: "#e3f4eb",
                      color: "#225a46",
                    }}
                  >
                    <HomeIcon />
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  top: { xs: 12, sm: 24 },
                  left: { xs: -5, sm: -22 },
                  p: 1.5,
                  bgcolor: "#fff",
                  color: "#17385b",
                  borderRadius: 3,
                  boxShadow: "0 12px 35px rgba(0,0,0,0.18)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#e1f4e9",
                    color: "#24704e",
                    borderRadius: 2,
                  }}
                >
                  <Key />
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: "0.95rem" }}>
                    Your next home
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Starts with a search
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* =====================================================
          PROPERTY SEARCH
      ===================================================== */}

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          mt: { xs: -5, md: -7 },
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            p: { xs: 2, sm: 3, md: 3.5 },
            borderRadius: 3,
            boxShadow: "0 18px 60px rgba(15,35,55,0.13)",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2.5,
            }}
          >
            <Search sx={{ color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 750 }}>
              Find your perfect property
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "stretch",
              gap: 2,
            }}
          >
            <TextField
              select
              label="Looking to"
              
              
              sx={{ flex: "1 1 145px", minWidth: 0 }}
            >
              <MenuItem value="Sale">Buy a property</MenuItem>
              <MenuItem value="Rent">Rent a property</MenuItem>
            </TextField>

            <TextField
              select
              label="Property type"
              
              
              sx={{ flex: "1 1 145px", minWidth: 0 }}
            >
              <MenuItem value="Any">Any property</MenuItem>
              <MenuItem value="Apartment">Apartment</MenuItem>
              <MenuItem value="House">House</MenuItem>
              <MenuItem value="Villa">Villa</MenuItem>
              <MenuItem value="Land">Land</MenuItem>
              <MenuItem value="Office">Office</MenuItem>
              <MenuItem value="Shop">Shop</MenuItem>
              <MenuItem value="Warehouse">Warehouse</MenuItem>
            </TextField>

            <TextField
              label="Location"
              placeholder="Enter city or location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSearch();
              }}
              sx={{ flex: "2 1 220px", minWidth: 0 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              variant="contained"
              onClick={handleSearch}
              startIcon={<Search />}
              sx={{
                minHeight: 56,
                px: 3.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "none",
                flex: "0 0 auto",
              }}
            >
              Search homes
            </Button>
          </Box>
        </Box>
      </Container>

      {/* =====================================================
          STATS
      ===================================================== */}

      <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 7 }, pb: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            rowGap: 3,
          }}
        >
          {STATS.map((stat, index) => (
            <Box
              key={stat.label}
              sx={{
                width: { xs: "50%", md: "25%" },
                px: 2,
                textAlign: "center",
                borderRight: {
                  xs: index % 2 === 0 ? "1px solid" : "none",
                  md: index !== 3 ? "1px solid" : "none",
                },
                borderColor: "divider",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "primary.main",
                  letterSpacing: "-0.03em",
                }}
              >
                {stat.value}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* =====================================================
          FEATURED PROPERTIES
      ===================================================== */}

      <Box
        sx={{
          py: { xs: 7, md: 10 },
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "flex-end" },
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 4,
            }}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: "primary.main",
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                }}
              >
                HANDPICKED FOR YOU
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "1.9rem", md: "2.6rem" },
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  mt: 0.5,
                }}
              >
                Homes worth discovering
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 1, lineHeight: 1.8 }}
              >
                Explore a few standout spaces for your next chapter.
              </Typography>
            </Box>

            <Button
              endIcon={<ArrowForward />}
              onClick={() => navigate("/login")}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              View all properties
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {PROPERTIES.map((property) => (
              <Box
                key={property.id}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 12px)",
                    md: "calc(33.3333% - 16px)",
                  },
                  minWidth: 0,
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0 4px 20px rgba(20,40,60,0.04)",
                    transition: "transform 0.25s, box-shadow 0.25s",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 18px 40px rgba(20,40,60,0.12)",
                    },
                  }}
                >
                  <Box sx={{ position: "relative", overflow: "hidden" }}>
                    <CardMedia
                      component="img"
                      image={property.image}
                      alt={property.title}
                      sx={{
                        height: 240,
                        objectFit: "cover",
                        transition: "transform 0.4s",
                        "&:hover": { transform: "scale(1.04)" },
                      }}
                    />

                    <Chip
                      label={property.tag}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        bgcolor: "#fff",
                        color: "#183c35",
                        fontWeight: 800,
                        fontSize: "0.65rem",
                        letterSpacing: "0.06em",
                      }}
                    />

                    <Chip
                      label={`For ${property.purpose}`}
                      size="small"
                      sx={{
                        position: "absolute",
                        right: 14,
                        bottom: 14,
                        bgcolor: "#183b35",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <CardContent sx={{ p: 2.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "text.secondary",
                        mb: 1.5,
                      }}
                    >
                      <LocationOn sx={{ fontSize: 17 }} />
                      <Typography variant="body2">
                        {property.location}
                      </Typography>
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 750,
                        fontSize: "1.1rem",
                        lineHeight: 1.5,
                        mb: 1,
                      }}
                    >
                      {property.title}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.7,
                        mb: 2,
                      }}
                    >
                      <Rating
                        value={property.rating}
                        precision={0.1}
                        size="small"
                        readOnly
                      />
                      <Typography variant="caption" color="text.secondary">
                        {property.rating.toFixed(1)}
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 1.5,
                        mb: 2.5,
                        color: "text.secondary",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Bed sx={{ fontSize: 18 }} />
                        <Typography variant="caption">
                          {property.beds} Beds
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Bathtub sx={{ fontSize: 18 }} />
                        <Typography variant="caption">
                          {property.baths} Baths
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <SquareFoot sx={{ fontSize: 18 }} />
                        <Typography variant="caption">
                          {property.area.toLocaleString()} sq ft
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          {property.purpose === "Rent"
                            ? "Monthly rent"
                            : "Asking price"}
                        </Typography>

                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            color: "primary.main",
                          }}
                        >
                          {formatPrice(property.price)}
                          {property.purpose === "Rent" && (
                            <Box
                              component="span"
                              sx={{
                                color: "text.secondary",
                                fontSize: "0.75rem",
                                fontWeight: 400,
                              }}
                            >
                              /mo
                            </Box>
                          )}
                        </Typography>
                      </Box>

                      <Button
                        variant="outlined"
                        endIcon={<ArrowOutward />}
                        onClick={() => navigate("/login")}
                        sx={{
                          flexShrink: 0,
                          textTransform: "none",
                          fontWeight: 700,
                          borderRadius: 2,
                        }}
                      >
                        Explore
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* =====================================================
          WHY CHOOSE US
      ===================================================== */}

      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            gap: { xs: 4, md: 6 },
            mb: 5,
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "35%" } }}>
            <Typography
              variant="overline"
              sx={{
                color: "primary.main",
                fontWeight: 800,
                letterSpacing: "0.16em",
              }}
            >
              THE DIFFERENCE
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "2rem", md: "2.6rem" },
                fontWeight: 800,
                letterSpacing: "-0.04em",
                mt: 1,
                mb: 2,
              }}
            >
              Property hunting, made better.
            </Typography>

            <Typography color="text.secondary" sx={{ lineHeight: 1.9, mb: 3 }}>
              Your next move deserves more than endless searching. We bring
              useful property information and a straightforward experience
              together in one place.
            </Typography>

            <Button
              endIcon={<ArrowForward />}
              onClick={() => navigate("/about")}
              sx={{ textTransform: "none", fontWeight: 700 }}
            >
              Learn about our approach
            </Button>
          </Box>

          <Box
            sx={{
              flex: 1,
              minWidth: { xs: "100%", md: 0 },
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {FEATURES.map((feature) => {
              const FeatureIcon = feature.icon;

              return (
                <Box
                  key={feature.title}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 8px)",
                    },
                  }}
                >
                  <Card
                    variant="outlined"
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      borderColor: "divider",
                      transition: "border-color 0.2s, transform 0.2s",
                      "&:hover": {
                        borderColor: "primary.main",
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 2,
                          bgcolor: "action.hover",
                          color: "primary.main",
                          mb: 2,
                        }}
                      >
                        <FeatureIcon sx={{ fontSize: 25 }} />
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{ fontSize: "1.05rem", fontWeight: 750, mb: 1 }}
                      >
                        {feature.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.8 }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Container>

      {/* =====================================================
          TESTIMONIALS
      ===================================================== */}

      <Box
        sx={{
          bgcolor: "action.hover",
          py: { xs: 7, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography
              variant="overline"
              sx={{
                color: "primary.main",
                fontWeight: 800,
                letterSpacing: "0.16em",
              }}
            >
              REAL PEOPLE, REAL EXPERIENCES
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "2rem", md: "2.6rem" },
                fontWeight: 800,
                letterSpacing: "-0.04em",
                mt: 1,
                mb: 1.5,
              }}
            >
              Stories that feel like home
            </Typography>

            <Typography color="text.secondary">
              Hear from people who have used our platform.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {TESTIMONIALS.map((testimonial) => (
              <Box
                key={testimonial.name}
                sx={{
                  width: {
                    xs: "100%",
                    md: "calc(33.3333% - 16px)",
                  },
                  minWidth: 0,
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "none",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      sx={{
                        fontFamily: "Georgia, serif",
                        fontSize: "3rem",
                        lineHeight: 1,
                        color: "primary.main",
                        mb: 1,
                      }}
                    >
                      “
                    </Typography>

                    <Rating
                      value={testimonial.rating}
                      readOnly
                      size="small"
                      sx={{ mb: 2 }}
                    />

                    <Typography
                      sx={{
                        lineHeight: 1.9,
                        color: "text.secondary",
                        mb: 3,
                      }}
                    >
                      {testimonial.text}
                    </Typography>

                    <Divider sx={{ mb: 2.5 }} />

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                          color: "#fff",
                          fontWeight: 700,
                        }}
                      >
                        {testimonial.initials}
                      </Box>

                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 750 }}
                        >
                          {testimonial.name}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>

                      <Box sx={{ flex: 1 }} />

                      <Verified sx={{ color: "success.main", fontSize: 21 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: { xs: 3, md: 5 },
            p: { xs: 3, sm: 5, md: 7 },
            color: "#fff",
            bgcolor: "#173b38",
            background:
              "linear-gradient(120deg, #173b38 0%, #22574e 60%, #2e6b5c 100%)",
            "&::after": {
              content: '""',
              position: "absolute",
              width: 280,
              height: 280,
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "50%",
              right: -90,
              top: -110,
              boxShadow:
                "0 0 0 35px rgba(255,255,255,0.025), 0 0 0 70px rgba(255,255,255,0.02)",
              pointerEvents: "none",
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1, maxWidth: 700 }}>
            <Chip
              icon={<TrendingUp sx={{ color: "#c6f1dd !important" }} />}
              label="Your next chapter starts here"
              sx={{
                mb: 2.5,
                bgcolor: "rgba(255,255,255,0.1)",
                color: "#e7f7ef",
                fontWeight: 600,
              }}
            />

            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "2rem", md: "3.2rem" },
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.2,
                mb: 2,
              }}
            >
              The right place changes everything.
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.78)",
                lineHeight: 1.9,
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                maxWidth: 580,
                mb: 4,
              }}
            >
              Whether you are buying your first home, looking for a rental, or
              managing a property, take the next step with confidence.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate("/login")}
                sx={{
                  bgcolor: "#c2ecd7",
                  color: "#163a32",
                  px: 3.5,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 750,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#dcf8e9" },
                }}
              >
                Start exploring
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/login")}
                sx={{
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.4)",
                  px: 3.5,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 650,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#fff",
                    bgcolor: "rgba(255,255,255,0.06)",
                  },
                }}
              >
                Join our community
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* =====================================================
          FOOTER NOTE
      ===================================================== */}

      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          py: 3,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <HomeIcon color="primary" />

              <Typography sx={{ fontWeight: 800 }}>
                Estate<span style={{ color: "#27825e" }}>Ease</span>
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary">
              Find your place. Make it yours.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
