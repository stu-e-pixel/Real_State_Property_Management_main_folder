import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Verified,
  Handshake,
  Favorite,
  People,
  TrendingUp,
  ArrowForward,
  CheckCircle,
  Home,
  
} from "@mui/icons-material";

import {ShieldCheck,
  Target,
  Building2,
  Sparkles,
  Award,
  Globe,} from "lucide-react"
import { useNavigate } from "react-router-dom";

const TEAM = [
  { name: "John Smith", role: "CEO & Founder", color: "#2563eb", initials: "JS" },
  { name: "Emily Davis", role: "Head of Operations", color: "#0f766e", initials: "ED" },
  { name: "Rahul Verma", role: "Lead Property Agent", color: "#b45309", initials: "RV" },
  { name: "Lisa Anderson", role: "Customer Success", color: "#7c3aed", initials: "LA" },
];

const VALUES = [
  {
    icon: Verified,
    title: "Trust & Transparency",
    description:
      "We believe property decisions should be built on clear information, honest communication, and dependable service.",
    color: "#2563eb",
    background: "#eff6ff",
  },
  {
    icon: Handshake,
    title: "Customer First",
    description:
      "We put your needs at the center of the journey, helping you explore options and make confident decisions.",
    color: "#0f766e",
    background: "#f0fdfa",
  },
  {
    icon: Favorite,
    title: "Care & Commitment",
    description:
      "Every property journey matters. We aim to make every interaction thoughtful, useful, and stress-free.",
    color: "#db2777",
    background: "#fdf2f8",
  },
  {
    icon: TrendingUp,
    title: "Continuous Innovation",
    description:
      "We keep improving the digital property experience with practical tools and a focus on usability.",
    color: "#7c3aed",
    background: "#f5f3ff",
  },
];

const MILESTONES = [
  {
    year: "2018",
    title: "The Beginning",
    text: "Started with a mission to make property discovery simpler.",
  },
  {
    year: "2020",
    title: "Growing Listings",
    text: "Reached an important milestone in property listings.",
  },
  {
    year: "2022",
    title: "Wider Reach",
    text: "Expanded our vision to serve more property seekers.",
  },
  {
    year: "2024",
    title: "Looking Ahead",
    text: "Continued building a more convenient property experience.",
  },
];

const STATS = [
  { value: "10K+", label: "Property Listings", icon: Home },
  { value: "500+", label: "Property Agents", icon: People },
  { value: "25K+", label: "Customers Served", icon: Favorite },
  { value: "50+", label: "Cities Reached", icon: Globe },
];

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ overflow: "hidden", bgcolor: "#ffffff" }}>
      {/* HERO */}
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
            width: 340,
            height: 340,
            right: -130,
            top: -150,
            border: "1px solid rgba(37,99,235,0.14)",
            borderRadius: "50%",
          }}
        />

        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            width: 230,
            height: 230,
            left: -130,
            bottom: -130,
            border: "1px solid rgba(37,99,235,0.12)",
            borderRadius: "50%",
          }}
        />

        <Container maxWidth="lg">
          <Box
            sx={{
              position: "relative",
              maxWidth: 850,
              mx: "auto",
              py: { xs: 8, sm: 10, md: 13 },
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
                bgcolor: "rgba(255,255,255,0.85)",
                color: "#1d4ed8",
              }}
            >
              <Building2 fontSize="small" />
              <Typography
                variant="body2"
                sx={{ fontWeight: 800, letterSpacing: 1 }}
              >
                ABOUT OUR PLATFORM
              </Typography>
            </Box>

            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontWeight: 900,
                color: "#0f172a",
                fontSize: { xs: "2.4rem", sm: "3.4rem", md: "4.4rem" },
                letterSpacing: { xs: -1.2, md: -2.5 },
                lineHeight: 1.12,
                mb: 3,
              }}
            >
              More than properties.
              <Box component="span" sx={{ display: "block", color: "#2563eb" }}>
                We're building trust.
              </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                maxWidth: 680,
                mx: "auto",
                color: "#64748b",
                fontWeight: 400,
                lineHeight: 1.9,
                fontSize: { xs: "1rem", md: "1.15rem" },
                mb: 4,
              }}
            >
              We bring property seekers, owners, and agents together through a
              more organized, accessible, and convenient real-estate experience.
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
                endIcon={<ArrowForward />}
                onClick={() => navigate("/login")}
                sx={{
                  px: 3.5,
                  py: 1.6,
                  borderRadius: 2.5,
                  bgcolor: "#2563eb",
                  textTransform: "none",
                  fontWeight: 800,
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
                  fontWeight: 800,
                  "&:hover": {
                    borderColor: "#2563eb",
                    bgcolor: "#f8fafc",
                  },
                }}
              >
                Get in Touch
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: { xs: 2, sm: 4 },
                mt: 5,
              }}
            >
              {["People-focused", "Property-driven", "Built for convenience"].map(
                (item) => (
                  <Box
                    key={item}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <CheckCircle sx={{ fontSize: 18, color: "#16a34a" }} />
                    <Typography
                      variant="body2"
                      sx={{ color: "#475569", fontWeight: 600 }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ),
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* OUR STORY */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: { xs: 5, md: 8 },
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "calc(50% - 32px)" } }}>
            <Typography
              variant="overline"
              sx={{ color: "#2563eb", fontWeight: 800, letterSpacing: 2 }}
            >
              OUR STORY
            </Typography>

            <Typography
              component="h2"
              variant="h3"
              sx={{
                mt: 1,
                mb: 3,
                fontWeight: 900,
                color: "#0f172a",
                fontSize: { xs: "2rem", md: "3rem" },
                lineHeight: 1.2,
                letterSpacing: -1,
              }}
            >
              Making every property decision feel simpler.
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: "#64748b", lineHeight: 2, mb: 2.5 }}
            >
              Finding the right property can feel overwhelming. Too many
              choices, scattered information, and complicated processes can
              make an important life decision more difficult than it needs to be.
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: "#64748b", lineHeight: 2, mb: 2.5 }}
            >
              Our platform aims to bring property information, discovery, and
              communication together in one convenient place. Whether you are
              searching for a home, listing a property, or connecting with an
              agent, we want the experience to feel more organized.
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: "#64748b", lineHeight: 2, mb: 3.5 }}
            >
              We continue to focus on building tools that make the real-estate
              journey easier to navigate.
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  bgcolor: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Target fontSize="medium" />
              </Box>

              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#0f172a", fontWeight: 800 }}
                >
                  Our mission
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  A clearer path to your next property.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              width: { xs: "100%", md: "calc(50% - 32px)" },
              position: "relative",
            }}
          >
            <Box
              sx={{
                minHeight: { xs: 300, sm: 380, md: 440 },
                position: "relative",
                overflow: "hidden",
                borderRadius: { xs: 4, md: 5 },
                background:
                  "linear-gradient(145deg, #172554 0%, #1d4ed8 58%, #60a5fa 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 24px 60px rgba(37,99,235,0.18)",
              }}
            >
              <Box
                aria-hidden="true"
                sx={{
                  position: "absolute",
                  width: 320,
                  height: 320,
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: "50%",
                }}
              />
              <Box
                aria-hidden="true"
                sx={{
                  position: "absolute",
                  width: 220,
                  height: 220,
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                }}
              />

              <Box sx={{ position: "relative", textAlign: "center", px: 3 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    mx: "auto",
                    mb: 3,
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.13)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Home sx={{ fontSize: 55, color: "#ffffff" }} />
                </Box>

                <Typography
                  variant="h4"
                  sx={{
                    color: "#ffffff",
                    fontWeight: 900,
                    mb: 1.5,
                    fontSize: { xs: "1.6rem", md: "2rem" },
                  }}
                >
                  Every move matters.
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.8 }}
                >
                  Helping you move forward, one property at a time.
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                position: { xs: "relative", sm: "absolute" },
                right: { sm: -18 },
                bottom: { sm: 24 },
                mt: { xs: 2, sm: 0 },
                maxWidth: { xs: "100%", sm: 265 },
                p: 2.5,
                border: "1px solid #e2e8f0",
                borderRadius: 3,
                bgcolor: "#ffffff",
                boxShadow: "0 14px 35px rgba(15,23,42,0.1)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    bgcolor: "#dcfce7",
                    color: "#15803d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShieldCheck />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#0f172a", fontWeight: 800 }}
                  >
                    Built around trust
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Clear information. Better decisions.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* OUR VALUES */}
      <Box
        sx={{
          py: { xs: 8, md: 11 },
          bgcolor: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 700, mx: "auto", textAlign: "center", mb: 7 }}>
            <Typography
              variant="overline"
              sx={{ color: "#2563eb", fontWeight: 800, letterSpacing: 2 }}
            >
              WHAT GUIDES US
            </Typography>

            <Typography
              component="h2"
              variant="h3"
              sx={{
                mt: 1,
                mb: 2,
                fontWeight: 900,
                color: "#0f172a",
                fontSize: { xs: "2rem", md: "3rem" },
                letterSpacing: -1,
              }}
            >
              The values behind our work
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: "#64748b", lineHeight: 1.9 }}
            >
              These principles shape how we design our platform and how we aim
              to serve every person who uses it.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {VALUES.map((value) => {
              const ValueIcon = value.icon;

              return (
                <Box
                  key={value.title}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 12px)",
                      md: "calc(25% - 18px)",
                    },
                    display: "flex",
                  }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      width: "100%",
                      border: "1px solid #e2e8f0",
                      borderRadius: 4,
                      bgcolor: "#ffffff",
                      transition:
                        "transform 0.25s ease, box-shadow 0.25s ease",
                      "&:hover": {
                        transform: "translateY(-7px)",
                        boxShadow: "0 18px 40px rgba(15,23,42,0.07)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: "left" }}>
                      <Box
                        sx={{
                          width: 58,
                          height: 58,
                          mb: 3,
                          borderRadius: 3,
                          bgcolor: value.background,
                          color: value.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ValueIcon sx={{ fontSize: 29 }} />
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
                        {value.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ color: "#64748b", lineHeight: 1.9 }}
                      >
                        {value.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* JOURNEY */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 11 } }}>
        <Box sx={{ maxWidth: 700, mx: "auto", textAlign: "center", mb: 7 }}>
          <Typography
            variant="overline"
            sx={{ color: "#2563eb", fontWeight: 800, letterSpacing: 2 }}
          >
            OUR JOURNEY
          </Typography>

          <Typography
            component="h2"
            variant="h3"
            sx={{
              mt: 1,
              mb: 2,
              color: "#0f172a",
              fontWeight: 900,
              fontSize: { xs: "2rem", md: "3rem" },
              letterSpacing: -1,
            }}
          >
            Growing with every step
          </Typography>

          <Typography variant="body1" sx={{ color: "#64748b", lineHeight: 1.9 }}>
            Every milestone represents another step toward a more convenient
            property experience.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          {MILESTONES.map((milestone, index) => (
            <Box
              key={milestone.year}
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 12px)",
                  md: "calc(25% - 18px)",
                },
                display: "flex",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  p: 3,
                  border: "1px solid #e2e8f0",
                  borderTop: "4px solid #2563eb",
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 15px 35px rgba(15,23,42,0.06)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2.5,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ color: "#2563eb", fontWeight: 900 }}
                  >
                    {milestone.year}
                  </Typography>
                  <Box
                    sx={{
                      width: 35,
                      height: 35,
                      borderRadius: 2,
                      bgcolor: "#eff6ff",
                      color: "#2563eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {index === 0 ? (
                      <Sparkles fontSize="small" />
                    ) : index === 1 ? (
                      <Home fontSize="small" />
                    ) : index === 2 ? (
                      <Globe fontSize="small" />
                    ) : (
                      <Award fontSize="small" />
                    )}
                  </Box>
                </Box>

                <Typography
                  component="h3"
                  variant="h6"
                  sx={{ color: "#0f172a", fontWeight: 800, mb: 1.5 }}
                >
                  {milestone.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: "#64748b", lineHeight: 1.9 }}
                >
                  {milestone.text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>

      {/* TEAM */}
      <Box
        sx={{
          py: { xs: 8, md: 11 },
          bgcolor: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 700, mx: "auto", textAlign: "center", mb: 7 }}>
            <Typography
              variant="overline"
              sx={{ color: "#2563eb", fontWeight: 800, letterSpacing: 2 }}
            >
              THE PEOPLE BEHIND THE PLATFORM
            </Typography>

            <Typography
              component="h2"
              variant="h3"
              sx={{
                mt: 1,
                mb: 2,
                color: "#0f172a",
                fontWeight: 900,
                fontSize: { xs: "2rem", md: "3rem" },
                letterSpacing: -1,
              }}
            >
              Meet the team
            </Typography>

            <Typography variant="body1" sx={{ color: "#64748b", lineHeight: 1.9 }}>
              A team focused on creating a helpful and accessible property
              experience.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {TEAM.map((member) => (
              <Box
                key={member.name}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 12px)",
                    md: "calc(25% - 18px)",
                  },
                  display: "flex",
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    width: "100%",
                    border: "1px solid #e2e8f0",
                    borderRadius: 4,
                    textAlign: "center",
                    bgcolor: "#ffffff",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 18px 40px rgba(15,23,42,0.07)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3.5 }}>
                    <Box
                      sx={{
                        width: 112,
                        height: 112,
                        mx: "auto",
                        mb: 2.5,
                        p: 0.6,
                        border: `2px solid ${member.color}30`,
                        borderRadius: "50%",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: "100%",
                          height: "100%",
                          bgcolor: member.color,
                          fontSize: 34,
                          fontWeight: 800,
                        }}
                      >
                        {member.initials}
                      </Avatar>
                    </Box>

                    <Typography
                      component="h3"
                      variant="h6"
                      sx={{ color: "#0f172a", fontWeight: 800, mb: 0.75 }}
                    >
                      {member.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: "#64748b", lineHeight: 1.7 }}
                    >
                      {member.role}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* STATS */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            p: { xs: 3, sm: 5, md: 6 },
            borderRadius: { xs: 4, md: 5 },
            color: "#ffffff",
            background:
              "linear-gradient(125deg, #172554 0%, #1d4ed8 60%, #3b82f6 100%)",
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute",
              width: 280,
              height: 280,
              top: -170,
              right: -60,
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "50%",
            }}
          />

          <Box sx={{ position: "relative" }}>
            <Box sx={{ textAlign: "center", mb: 5 }}>
              <Typography
                variant="overline"
                sx={{ color: "#bfdbfe", fontWeight: 800, letterSpacing: 2 }}
              >
                OUR PLATFORM AT A GLANCE
              </Typography>

              <Typography
                component="h2"
                variant="h3"
                sx={{
                  mt: 1,
                  fontWeight: 900,
                  fontSize: { xs: "1.9rem", md: "2.75rem" },
                  letterSpacing: -1,
                }}
              >
                The numbers behind our journey
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: { xs: 3, md: 0 },
              }}
            >
              {STATS.map((stat, index) => {
                const StatIcon = stat.icon;

                return (
                  <Box
                    key={stat.label}
                    sx={{
                      width: { xs: "calc(50% - 12px)", md: "25%" },
                      px: { xs: 1, md: 2 },
                      textAlign: "center",
                      borderRight: {
                        xs: "none",
                        md: index < STATS.length - 1
                          ? "1px solid rgba(255,255,255,0.2)"
                          : "none",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 43,
                        height: 43,
                        mx: "auto",
                        mb: 2,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(255,255,255,0.12)",
                        color: "#bfdbfe",
                      }}
                    >
                      <StatIcon />
                    </Box>

                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 900,
                        fontSize: { xs: "1.8rem", md: "2.5rem" },
                        mb: 0.75,
                      }}
                    >
                      {stat.value}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Container>

      {/* FINAL CTA */}
      <Box sx={{ pb: { xs: 8, md: 11 } }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                mx: "auto",
                mb: 2.5,
                borderRadius: 3,
                bgcolor: "#eff6ff",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Home sx={{ fontSize: 30 }} />
            </Box>

            <Typography
              component="h2"
              variant="h3"
              sx={{
                color: "#0f172a",
                fontWeight: 900,
                fontSize: { xs: "2rem", md: "2.8rem" },
                letterSpacing: -1,
                mb: 2,
              }}
            >
              Let's find your next place.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                maxWidth: 600,
                mx: "auto",
                color: "#64748b",
                lineHeight: 1.9,
                mb: 4,
              }}
            >
              Explore available properties and take the next step toward your
              real-estate goals.
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
                endIcon={<ArrowForward />}
                onClick={() => navigate("/login")}
                sx={{
                  px: 3.5,
                  py: 1.5,
                  borderRadius: 2.5,
                  bgcolor: "#2563eb",
                  textTransform: "none",
                  fontWeight: 800,
                  "&:hover": { bgcolor: "#1d4ed8" },
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
                  borderColor: "#cbd5e1",
                  color: "#334155",
                  textTransform: "none",
                  fontWeight: 800,
                  "&:hover": {
                    borderColor: "#2563eb",
                    bgcolor: "#f8fafc",
                  },
                }}
              >
                Contact Us
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Divider sx={{ borderColor: "#e2e8f0" }} />
    </Box>
  );
};

export default AboutPage;