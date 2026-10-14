import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  Schedule,
  Send,
  WhatsApp,
  ArrowForward,
  HeadsetMic,
  MessageRounded,
} from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

// =====================================================
// VALIDATION
// =====================================================

const contactSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .required("Name is required"),

  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),

  phone: yup
    .string()
    .trim()
    .matches(/^[0-9+\-\s()]{7,20}$/, "Please enter a valid phone number")
    .required("Phone is required"),

  subject: yup
    .string()
    .trim()
    .min(3, "Subject must contain at least 3 characters")
    .required("Subject is required"),

  message: yup
    .string()
    .trim()
    .min(10, "Message must contain at least 10 characters")
    .required("Message is required"),
});

type ContactFormValues = yup.InferType<typeof contactSchema>;

// =====================================================
// CONTACT INFORMATION
// Replace these sample details with your actual details.
// =====================================================

const CONTACT_INFO = [
  {
    icon: LocationOn,
    title: "Our Office",
    lines: ["123 Real Estate Avenue", "New York, NY 10001"],
    color: "#2563eb",
    background: "#eff6ff",
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+1 (234) 567-8900", "+1 (234) 567-8901"],
    color: "#0f766e",
    background: "#f0fdfa",
  },
  {
    icon: Email,
    title: "Email Us",
    lines: ["hello@realestate.com", "support@realestate.com"],
    color: "#b45309",
    background: "#fffbeb",
  },
  {
    icon: Schedule,
    title: "Working Hours",
    lines: ["Mon - Fri: 9 AM - 6 PM", "Sat: 10 AM - 4 PM"],
    color: "#7c3aed",
    background: "#f5f3ff",
  },
];

// Replace with your real WhatsApp number in international format.
// Do not include +, spaces, or hyphens.
const WHATSAPP_NUMBER = "12345678900";

// =====================================================
// PAGE
// =====================================================

const ContactPage = () => {
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues): Promise<void> => {
    setSubmitting(true);

    try {
      // TODO: Connect your real contact API here.
      // Example:
      // await contactService.sendMessage(data);

      console.info("Contact form data:", data);

      toast.error(
        "The contact API is not connected yet. Please connect your backend endpoint.",
      );
    } catch {
      toast.error("Unable to send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const openWhatsApp = (): void => {
    const message = encodeURIComponent(
      "Hello, I would like to know more about your real estate services.",
    );

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

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
            width: 320,
            height: 320,
            top: -140,
            right: -100,
            border: "1px solid rgba(37,99,235,0.15)",
            borderRadius: "50%",
          }}
        />

        <Container maxWidth="lg">
          <Box
            sx={{
              position: "relative",
              maxWidth: 800,
              mx: "auto",
              py: { xs: 8, sm: 10, md: 12 },
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
              <MessageRounded sx={{ fontSize: 18 }} />
              <Typography
                variant="body2"
                sx={{ fontWeight: 800, letterSpacing: 1 }}
              >
                WE'RE HERE TO HELP
              </Typography>
            </Box>

            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontWeight: 900,
                color: "#0f172a",
                fontSize: { xs: "2.5rem", sm: "3.4rem", md: "4.3rem" },
                lineHeight: 1.12,
                letterSpacing: { xs: -1.2, md: -2.5 },
                mb: 3,
              }}
            >
              Let's start a
              <Box component="span" sx={{ display: "block", color: "#2563eb" }}>
                conversation.
              </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                maxWidth: 650,
                mx: "auto",
                color: "#64748b",
                fontWeight: 400,
                fontSize: { xs: "1rem", md: "1.15rem" },
                lineHeight: 1.9,
                mb: 4,
              }}
            >
              Have a question about buying, selling, renting, or managing
              property? Our team is ready to help you take the next step.
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
                onClick={() =>
                  document
                    .getElementById("contact-form")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
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
                Send a Message
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<WhatsApp />}
                onClick={openWhatsApp}
                sx={{
                  px: 3.5,
                  py: 1.6,
                  borderRadius: 2.5,
                  borderColor: "#bbf7d0",
                  color: "#15803d",
                  bgcolor: "#ffffff",
                  textTransform: "none",
                  fontWeight: 800,
                  "&:hover": {
                    borderColor: "#16a34a",
                    bgcolor: "#f0fdf4",
                  },
                }}
              >
                Chat on WhatsApp
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* CONTACT INFORMATION CARDS */}
      <Container
        maxWidth="lg"
        sx={{ mt: { xs: 4, md: -4 }, position: "relative", zIndex: 2, pb: 3 }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {CONTACT_INFO.map((info) => {
            const InfoIcon = info.icon;

            return (
              <Box
                key={info.title}
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
                      transform: "translateY(-6px)",
                      boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 54,
                        height: 54,
                        mb: 2.5,
                        borderRadius: 3,
                        bgcolor: info.background,
                        color: info.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <InfoIcon sx={{ fontSize: 27 }} />
                    </Box>

                    <Typography
                      component="h2"
                      variant="h6"
                      sx={{ color: "#0f172a", fontWeight: 800, mb: 1.5 }}
                    >
                      {info.title}
                    </Typography>

                    {info.lines.map((line) => (
                      <Typography
                        key={line}
                        variant="body2"
                        sx={{
                          color: "#64748b",
                          lineHeight: 1.9,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {line}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
      </Container>

      {/* CONTACT FORM + OFFICE SIDEBAR */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            gap: { xs: 4, md: 5 },
          }}
        >
          {/* FORM */}
          <Box
            id="contact-form"
            sx={{ width: { xs: "100%", md: "calc(60% - 20px)" }, scrollMarginTop: 100 }}
          >
            <Box
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                border: "1px solid #e2e8f0",
                borderRadius: 4,
                bgcolor: "#ffffff",
                boxShadow: "0 15px 45px rgba(15,23,42,0.05)",
              }}
            >
              <Box
                sx={{
                  width: 54,
                  height: 54,
                  mb: 2.5,
                  borderRadius: 3,
                  bgcolor: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HeadsetMic sx={{ fontSize: 28 }} />
              </Box>

              <Typography
                component="h2"
                variant="h4"
                sx={{
                  color: "#0f172a",
                  fontWeight: 900,
                  fontSize: { xs: "1.7rem", md: "2rem" },
                  mb: 1.5,
                }}
              >
                Send us a message
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#64748b", lineHeight: 1.9, mb: 4 }}
              >
                Fill in the details below. Fields marked with an error message
                need your attention before submitting.
              </Typography>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2.5,
                  }}
                >
                  <Box sx={{ width: { xs: "100%", sm: "calc(50% - 10px)" } }}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Your Name"
                          placeholder="Enter your full name"
                          autoComplete="name"
                          error={Boolean(errors.name)}
                          helperText={errors.name?.message}
                        />
                      )}
                    />
                  </Box>

                  <Box sx={{ width: { xs: "100%", sm: "calc(50% - 10px)" } }}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Email Address"
                          placeholder="you@example.com"
                          type="email"
                          autoComplete="email"
                          error={Boolean(errors.email)}
                          helperText={errors.email?.message}
                        />
                      )}
                    />
                  </Box>

                  <Box sx={{ width: { xs: "100%", sm: "calc(50% - 10px)" } }}>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Phone Number"
                          placeholder="+91 98765 43210"
                          type="tel"
                          autoComplete="tel"
                          error={Boolean(errors.phone)}
                          helperText={errors.phone?.message}
                        />
                      )}
                    />
                  </Box>

                  <Box sx={{ width: { xs: "100%", sm: "calc(50% - 10px)" } }}>
                    <Controller
                      name="subject"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Subject"
                          placeholder="How can we help?"
                          error={Boolean(errors.subject)}
                          helperText={errors.subject?.message}
                        />
                      )}
                    />
                  </Box>

                  <Box sx={{ width: "100%" }}>
                    <Controller
                      name="message"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Your Message"
                          placeholder="Tell us a little about what you need..."
                          multiline
                          minRows={5}
                          error={Boolean(errors.message)}
                          helperText={errors.message?.message}
                        />
                      )}
                    />
                  </Box>

                  <Box sx={{ width: "100%", pt: 0.5 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      endIcon={<Send />}
                      disabled={submitting}
                      sx={{
                        px: 4,
                        py: 1.6,
                        borderRadius: 2.5,
                        bgcolor: "#2563eb",
                        textTransform: "none",
                        fontWeight: 800,
                        boxShadow: "0 8px 20px rgba(37,99,235,0.18)",
                        "&:hover": { bgcolor: "#1d4ed8" },
                      }}
                    >
                      {submitting ? "Sending..." : "Send Message"}
                    </Button>

                    <Typography
                      variant="caption"
                      sx={{ display: "block", color: "#94a3b8", mt: 2 }}
                    >
                      Your information should be handled securely by our
                      contact service.
                    </Typography>
                  </Box>
                </Box>
              </form>
            </Box>
          </Box>

          {/* SIDEBAR */}
          <Box
            sx={{
              width: { xs: "100%", md: "calc(40% - 20px)" },
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Office panel */}
            <Box
              sx={{
                minHeight: 300,
                p: { xs: 3, md: 4 },
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: 4,
                color: "#ffffff",
                background:
                  "linear-gradient(145deg, #172554 0%, #1d4ed8 70%, #3b82f6 100%)",
                boxShadow: "0 18px 40px rgba(37,99,235,0.16)",
              }}
            >
              <Box
                aria-hidden="true"
                sx={{
                  position: "absolute",
                  width: 200,
                  height: 200,
                  top: -90,
                  right: -60,
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                }}
              />

              <Box sx={{ position: "relative" }}>
                <Box
                  sx={{
                    width: 54,
                    height: 54,
                    mb: 3,
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.13)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LocationOn sx={{ fontSize: 29 }} />
                </Box>

                <Typography
                  component="h2"
                  variant="h5"
                  sx={{ fontWeight: 900, mb: 1.5 }}
                >
                  Visit our office
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    lineHeight: 1.9,
                    mb: 3,
                  }}
                >
                  123 Real Estate Avenue
                  <br />
                  New York, NY 10001
                </Typography>

                <Button
                  variant="outlined"
                  endIcon={<ArrowForward />}
                  onClick={() =>
                    window.open(
                      "https://www.google.com/maps/search/?api=1&query=123+Real+Estate+Avenue+New+York",
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                  sx={{
                    color: "#ffffff",
                    borderColor: "rgba(255,255,255,0.5)",
                    textTransform: "none",
                    fontWeight: 700,
                    "&:hover": {
                      borderColor: "#ffffff",
                      bgcolor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  Get Directions
                </Button>
              </Box>
            </Box>

            {/* WhatsApp panel */}
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                border: "1px solid #e2e8f0",
                borderRadius: 4,
                bgcolor: "#ffffff",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    flexShrink: 0,
                    borderRadius: 2.5,
                    bgcolor: "#dcfce7",
                    color: "#15803d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <WhatsApp sx={{ fontSize: 26 }} />
                </Box>

                <Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "#0f172a", fontWeight: 800 }}
                  >
                    Prefer instant chat?
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Start a WhatsApp conversation.
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2.5, borderColor: "#f1f5f9" }} />

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<WhatsApp />}
                onClick={openWhatsApp}
                sx={{
                  py: 1.5,
                  borderRadius: 2.5,
                  bgcolor: "#16a34a",
                  color: "#ffffff",
                  textTransform: "none",
                  fontWeight: 800,
                  "&:hover": { bgcolor: "#15803d" },
                }}
              >
                Chat on WhatsApp
              </Button>

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "#94a3b8",
                  textAlign: "center",
                  mt: 2,
                  lineHeight: 1.8,
                }}
              >
                Replace the sample number with your actual WhatsApp number.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactPage;