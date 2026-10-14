import { Box, Container, Typography, Button, Card, CardContent, Divider } from "@mui/material";
import {
  Home,
  Search,
  Handshake,
  CheckCircle,
  KeyRound,
  ShieldCheck,
  ChartNoAxesCombined,
  AArrowUp,
  
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SERVICES = [
  {
    icon: Search,
    number: "01",
    title: "Property Discovery",
    description:
      "Discover properties that fit your lifestyle with flexible search options and practical filters.",
    accent: "#2563eb",
    background: "#eff6ff",
    features: ["Advanced property filters", "Detailed property listings"],
  },
  {
    icon: Home,
    number: "02",
    title: "Buying & Selling",
    description:
      "Navigate every step of your property journey with a simpler, more transparent process.",
    accent: "#0f766e",
    background: "#f0fdfa",
    features: ["Property listing support", "Purchase journey assistance"],
  },
  {
    icon: KeyRound,
    number: "03",
    title: "Rental & Leasing",
    description:
      "Find your next home or connect with potential tenants through a streamlined rental experience.",
    accent: "#7c3aed",
    background: "#f5f3ff",
    features: ["Rental property discovery", "Tenant inquiries"],
  },
  {
    icon: Handshake,
    number: "04",
    title: "Agent Connections",
    description:
      "Connect with property professionals who can help you understand your options and next steps.",
    accent: "#c2410c",
    background: "#fff7ed",
    features: ["Agent profiles", "Direct inquiries"],
  },
  {
    icon: ChartNoAxesCombined,
    number: "05",
    title: "Property Insights",
    description:
      "Explore property details and available market information to support more informed decisions.",
    accent: "#0369a1",
    background: "#f0f9ff",
    features: ["Property comparisons", "Listing information"],
  },
  {
    icon: ShieldCheck,
    number: "06",
    title: "Trusted Assistance",
    description:
      "Get guidance throughout the process and keep important property details organized in one place.",
    accent: "#be185d",
    background: "#fdf2f8",
    features: ["Property information", "Organized communication"],
  },
];

const BENEFITS = [
  "Simple property discovery",
  "Clear listing information",
  "Connections with property professionals",
  "A convenient inquiry process",
];

const ServicesPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ overflow: "hidden", bgcolor: "#ffffff" }}>
      {/* Hero section */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 85% 15%, rgba(37,99,235,0.12), transparent 28%), linear-gradient(135deg, #f8fafc 0%, #eff6ff 55%, #ffffff 100%)",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            top: -100,
            right: -80,
            width: 300,
            height: 300,
            border: "1px solid rgba(37,99,235,0.15)",
            borderRadius: "50%",
          }}
        />

        <Container maxWidth="lg">
          <Box
            sx={{
              position: "relative",
              py: { xs: 8, sm: 10, md: 13 },
              maxWidth: 850,
              mx: "auto",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                mb: 3,
                border: "1px solid #bfdbfe",
                borderRadius: 50,
                bgcolor: "rgba(255,255,255,0.8)",
                color: "#1d4ed8",
              }}
            >
              <Home size={17} />
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, letterSpacing: 0.5 }}
              >
                REAL ESTATE, MADE SIMPLER
              </Typography>
            </Box>

            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontSize: { xs: "2.35rem", sm: "3.2rem", md: "4.25rem" },
                lineHeight: 1.12,
                letterSpacing: { xs: -1.2, md: -2.5 },
                fontWeight: 900,
                color: "#0f172a",
                mb: 3,
              }}
            >
              The right services.
              <Box component="span" sx={{ display: "block", color: "#2563eb" }}>
                The right property.
              </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                maxWidth: 650,
                mx: "auto",
                color: "#64748b",
                fontWeight: 400,
                lineHeight: 1.8,
                fontSize: { xs: "1rem", md: "1.15rem" },
                mb: 4,
              }}
            >
              From discovering your next home to connecting with property
              professionals, we make every step of your real-estate journey
              easier to navigate.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<AArrowUp size={18} />}
                onClick={() => navigate("/login")}
                sx={{
                  px: 3.5,
                  py: 1.6,
                  borderRadius: 2.5,
                  bgcolor: "#2563eb",
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "0 10px 24px rgba(37,99,235,0.2)",
                  "&:hover": {
                    bgcolor: "#1d4ed8",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.25s ease",
                }}
              >
                Explore Properties
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/contact")}
                sx={{
                  px: 3.5,
                  py: 1.6,
                  borderRadius: 2.5,
                  borderColor: "#cbd5e1",
                  color: "#0f172a",
                  bgcolor: "#ffffff",
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": {
                    borderColor: "#2563eb",
                    bgcolor: "#f8fafc",
                  },
                }}
              >
                Talk to Our Team
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                gap: { xs: 2, sm: 4 },
                mt: 5,
              }}
            >
              {["Discover", "Compare", "Connect"].map((item) => (
                <Box
                  key={item}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <CheckCircle size={17} color="#16a34a" />
                  <Typography
                    variant="body2"
                    sx={{ color: "#475569", fontWeight: 600 }}
                  >
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Services section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ maxWidth: 700, mx: "auto", textAlign: "center", mb: 7 }}>
          <Typography
            variant="overline"
            sx={{
              color: "#2563eb",
              fontWeight: 800,
              letterSpacing: 2,
            }}
          >
            WHAT WE OFFER
          </Typography>

          <Typography
            component="h2"
            variant="h3"
            sx={{
              mt: 1,
              mb: 2,
              color: "#0f172a",
              fontWeight: 850,
              fontSize: { xs: "2rem", md: "3rem" },
              letterSpacing: -1,
            }}
          >
            Everything you need, in one place
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              lineHeight: 1.9,
              fontSize: { xs: "0.95rem", md: "1.05rem" },
            }}
          >
            Explore tools and services designed to help buyers, tenants,
            property owners, and agents manage their property journey.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          {SERVICES.map((service) => {
            const ServiceIcon = service.icon;

            return (
              <Box
                key={service.number}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 12px)",
                    md: "calc(33.3333% - 16px)",
                  },
                  display: "flex",
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid #e2e8f0",
                    borderRadius: 4,
                    bgcolor: "#ffffff",
                    overflow: "hidden",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-7px)",
                      borderColor: "#bfdbfe",
                      boxShadow: "0 20px 45px rgba(15,23,42,0.08)",
                    },
                    "&:hover .service-arrow": {
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: { xs: 3, md: 3.5 },
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          width: 58,
                          height: 58,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 3,
                          bgcolor: service.background,
                          color: service.accent,
                        }}
                      >
                        <ServiceIcon size={27} strokeWidth={1.8} />
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#94a3b8",
                          fontWeight: 800,
                          letterSpacing: 1,
                        }}
                      >
                        {service.number}
                      </Typography>
                    </Box>

                    <Typography
                      component="h3"
                      variant="h6"
                      sx={{
                        color: "#0f172a",
                        fontWeight: 800,
                        mb: 1.5,
                      }}
                    >
                      {service.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#64748b",
                        lineHeight: 1.9,
                        mb: 3,
                      }}
                    >
                      {service.description}
                    </Typography>

                    <Divider sx={{ mb: 2.5, borderColor: "#f1f5f9" }} />

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: "auto" }}>
                      {service.features.map((feature) => (
                        <Box
                          key={feature}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                          }}
                        >
                          <CheckCircle size={16} color={service.accent} />
                          <Typography
                            variant="body2"
                            sx={{ color: "#475569", fontWeight: 500 }}
                          >
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
      </Container>

      {/* Why choose us */}
      <Box sx={{ bgcolor: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: { xs: 4, md: 8 },
            }}
          >
            <Box sx={{ width: { xs: "100%", md: "calc(50% - 32px)" } }}>
              <Typography
                variant="overline"
                sx={{ color: "#2563eb", fontWeight: 800, letterSpacing: 2 }}
              >
                A BETTER EXPERIENCE
              </Typography>

              <Typography
                component="h2"
                variant="h3"
                sx={{
                  color: "#0f172a",
                  fontWeight: 850,
                  fontSize: { xs: "2rem", md: "2.8rem" },
                  lineHeight: 1.2,
                  letterSpacing: -1,
                  mt: 1,
                  mb: 2.5,
                }}
              >
                Your property journey deserves a better approach.
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: "#64748b", lineHeight: 1.9, mb: 3 }}
              >
                Whether you are searching for a home, managing a property, or
                connecting with an agent, our platform brings useful property
                information and communication together.
              </Typography>

              <Button
                variant="text"
                endIcon={<AArrowUp size={18} />}
                onClick={() => navigate("/about")}
                sx={{
                  px: 0,
                  color: "#2563eb",
                  fontWeight: 800,
                  textTransform: "none",
                  "&:hover": { bgcolor: "transparent", color: "#1d4ed8" },
                }}
              >
                Learn more about us
              </Button>
            </Box>

            <Box
              sx={{
                width: { xs: "100%", md: "calc(50% - 32px)" },
                p: { xs: 3, sm: 4 },
                border: "1px solid #e2e8f0",
                borderRadius: 4,
                bgcolor: "#ffffff",
                boxShadow: "0 15px 40px rgba(15,23,42,0.04)",
              }}
            >
              {BENEFITS.map((benefit, index) => (
                <Box key={benefit}>
                  {index > 0 && <Divider sx={{ my: 2.5, borderColor: "#f1f5f9" }} />}

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        bgcolor: "#eff6ff",
                        color: "#2563eb",
                      }}
                    >
                      <CheckCircle size={20} />
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{ color: "#334155", fontWeight: 650 }}
                    >
                      {benefit}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Call to action */}
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 11 } }}>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            p: { xs: 4, sm: 6, md: 8 },
            borderRadius: { xs: 4, md: 5 },
            background: "linear-gradient(120deg, #172554 0%, #1d4ed8 65%, #2563eb 100%)",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute",
              width: 250,
              height: 250,
              top: -120,
              right: -40,
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "50%",
            }}
          />

          <Box
            aria-hidden="true"
            sx={{
              position: "absolute",
              width: 180,
              height: 180,
              bottom: -100,
              left: -35,
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "50%",
            }}
          />

          <Box sx={{ position: "relative", maxWidth: 700, mx: "auto" }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                mb: 2.5,
                px: 2,
                py: 0.8,
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 50,
                bgcolor: "rgba(255,255,255,0.08)",
              }}
            >
              <Home size={16} />
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, letterSpacing: 0.4 }}
              >
                YOUR NEXT CHAPTER STARTS HERE
              </Typography>
            </Box>

            <Typography
              component="h2"
              variant="h3"
              sx={{
                fontWeight: 900,
                letterSpacing: { xs: -0.8, md: -1.5 },
                fontSize: { xs: "2rem", md: "3.25rem" },
                lineHeight: 1.2,
                mb: 2,
              }}
            >
              Ready to find your place?
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.8)",
                lineHeight: 1.9,
                mb: 4,
                fontSize: { xs: "0.95rem", md: "1.08rem" },
              }}
            >
              Start exploring available properties or get in touch with our team
              to learn more about the platform.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<AArrowUp size={18} />}
                onClick={() => navigate("/login")}
                sx={{
                  px: 3.5,
                  py: 1.5,
                  borderRadius: 2.5,
                  bgcolor: "#ffffff",
                  color: "#1d4ed8",
                  textTransform: "none",
                  fontWeight: 800,
                  "&:hover": {
                    bgcolor: "#eff6ff",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Browse Properties
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/contact")}
                sx={{
                  px: 3.5,
                  py: 1.5,
                  borderRadius: 2.5,
                  color: "#ffffff",
                  borderColor: "rgba(255,255,255,0.55)",
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": {
                    borderColor: "#ffffff",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Contact Us
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ServicesPage;