import React, { useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
} from "@mui/material";
import {
  Apartment,
  Email,
  Event,
  AssignmentTurnedIn,
  Description,
  LocalOffer,
  ReceiptLong,
  Star,
  ArrowForward,
  Add,
  TrendingUp,
  HomeWork,
  ArrowOutward,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { getOwnerProperties } from "../../features/property/propertySlice";
import { getOwnerInquiries } from "../../features/inquiry/inquirySlice";
import { getOwnerAppointments } from "../../features/appointment/appointmentSlice";
import { getSaleOfferByOwner } from "../../features/saleOffer/saleOfferSlice";
import { getOwnerReviews } from "../../features/review/reviewSlice";
import { IndianRupee } from "lucide-react";

// =====================================================
// TYPES
// =====================================================

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subtitle: string;
  color: string;
  path: string;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  path: string;
  color: string;
}

// =====================================================
// HELPERS
// =====================================================

const formatDate = (date: string | Date | undefined) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount: number | string | undefined) => {
  const value = Number(amount);

  return `₹${(Number.isFinite(value) ? value : 0).toLocaleString("en-US")}`;
};

const getInitial = (name?: string) => {
  return name?.trim()?.charAt(0)?.toUpperCase() || "?";
};

// =====================================================
// STAT CARD
// =====================================================

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  subtitle,
  color,
  path,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(path)}
      sx={{
        height: "100%",
        minWidth: 0,
        cursor: "pointer",
        overflow: "hidden",
        position: "relative",
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        boxShadow: "0 3px 14px rgba(15, 23, 42, 0.035)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 28px rgba(15, 23, 42, 0.09)",
          "& .stat-arrow": {
            opacity: 1,
            transform: "translate(0, 0)",
          },
        },
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2.5,
          }}
        >
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 2.5,
              bgcolor: `${color}14`,
              color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {React.cloneElement(
              icon as React.ReactElement<{ sx?: object }>,
              { sx: { fontSize: 25 } }
            )}
          </Box>

          <ArrowOutward
            className="stat-arrow"
            sx={{
              fontSize: 20,
              color: "text.disabled",
              opacity: 0.4,
              transform: "translate(-3px, 3px)",
              transition: "all 0.2s ease",
            }}
          />
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-1px",
            lineHeight: 1.2,
            mb: 0.75,
            overflowWrap: "anywhere",
          }}
        >
          {value}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#475569",
            fontWeight: 700,
            mb: 1,
          }}
        >
          {label}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "#64748b",
            display: "block",
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </Typography>
      </CardContent>

      <Box
        sx={{
          height: 3,
          width: "100%",
          bgcolor: color,
          opacity: 0.8,
        }}
      />
    </Card>
  );
};

// =====================================================
// SECTION HEADER
// =====================================================

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  path: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  path,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1.5,
        mb: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            bgcolor: "#ecfdf5",
            color: "#047857",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="h6"
          sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.05rem" }}
        >
          {title}
        </Typography>
      </Box>

      <Button
        size="small"
        endIcon={<ArrowForward />}
        onClick={() => navigate(path)}
        sx={{
          textTransform: "none",
          fontWeight: 700,
          color: "#047857",
          "&:hover": { bgcolor: "#ecfdf5" },
        }}
      >
        View all
      </Button>
    </Box>
  );
};

// =====================================================
// EMPTY STATE
// =====================================================

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <Box
    sx={{
      py: 5,
      px: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      color: "text.secondary",
    }}
  >
    <HomeWork sx={{ fontSize: 42, mb: 1, opacity: 0.25 }} />
    <Typography variant="body2">{message}</Typography>
  </Box>
);

// =====================================================
// OWNER DASHBOARD
// =====================================================

const OwnerDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux state
  const { user } = useAppSelector((state) => state.auth);
  const { properties } = useAppSelector((state) => state.property);

  const { inquiries, loading: loadingInquiries } = useAppSelector(
    (state) => state.inquiry
  );

  const { appointments } = useAppSelector((state) => state.appointment);
  const { saleOffers } = useAppSelector((state) => state.saleOffer);
  const { reviews } = useAppSelector((state) => state.review);

  // Fetch dashboard data
  useEffect(() => {
    dispatch(getOwnerProperties());
    dispatch(getOwnerInquiries());
    dispatch(getOwnerAppointments());
    dispatch(getSaleOfferByOwner());
    dispatch(getOwnerReviews());
  }, [dispatch]);

  // Safe array values
  const propertyList = properties ?? [];
  const inquiryList = inquiries ?? [];
  const appointmentList = appointments ?? [];
  const offerList = saleOffers ?? [];
  const reviewList = reviews ?? [];

  // Property statistics
  const totalProperties = propertyList.length;

  const approvedProperties = propertyList.filter(
    (property) => property.approvalStatus === "Approved"
  ).length;

  const pendingProperties = propertyList.filter(
    (property) => property.approvalStatus === "Pending"
  ).length;

  const rentedProperties = propertyList.filter(
    (property) => property.status === "Rented"
  ).length;

  const totalValue = propertyList.reduce(
    (sum, property) => sum + (Number(property.price) || 0),
    0
  );

  const totalValueFormatted =
    totalValue > 0
      ? `₹${(totalValue / 1_000_000).toFixed(2)}M`
      : "₹0";

  // Inquiry statistics
  const totalInquiries = inquiryList.length;

  const pendingInquiries = inquiryList.filter(
    (inquiry) => inquiry.status === "pending"
  ).length;

  // Appointment statistics
  const totalAppointments = appointmentList.length;

  const activeAppointments = appointmentList.filter((appointment) =>
    ["pending", "confirmed", "rescheduled"].includes(appointment.status)
  ).length;

  // Offer statistics
  const totalOffers = offerList.length;

  const activeOffers = offerList.filter((offer) =>
    ["pending", "countered"].includes(offer.status)
  ).length;

  const acceptedOffers = offerList.filter(
    (offer) => offer.status === "accepted"
  ).length;

  // Review statistics
  const totalReviews = reviewList.length;

  const avgRating =
    totalReviews > 0
      ? (
          reviewList.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        ).toFixed(1)
      : "—";

  // Recent activity
  const recentInquiries = [...inquiryList]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  const recentOffers = [...offerList]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  // Dashboard cards
  const primaryStats: StatCardProps[] = [
    {
      icon: <Apartment />,
      label: "Total Properties",
      value: totalProperties,
      subtitle: `${approvedProperties} approved · ${pendingProperties} pending`,
      color: "#2563eb",
      path: "/owner/properties",
    },
    {
      icon: <Email />,
      label: "Inquiries",
      value: totalInquiries,
      subtitle: `${pendingInquiries} awaiting response`,
      color: "#7c3aed",
      path: "/owner/inquiries",
    },
    {
      icon: <Event />,
      label: "Appointments",
      value: totalAppointments,
      subtitle: `${activeAppointments} active appointments`,
      color: "#d97706",
      path: "/owner/appointments",
    },
    {
      icon: <LocalOffer />,
      label: "Sale Offers",
      value: totalOffers,
      subtitle: `${activeOffers} active · ${acceptedOffers} accepted`,
      color: "#dc2626",
      path: "/owner/sale-offers",
    },
  ];

  const secondaryStats: StatCardProps[] = [
    {
      icon: <IndianRupee />,
      label: "Portfolio Value",
      value: totalValueFormatted,
      subtitle: "Combined listed property value",
      color: "#059669",
      path: "/owner/properties",
    },
    {
      icon: <AssignmentTurnedIn />,
      label: "Rentals",
      value: rentedProperties,
      subtitle: "Currently rented properties",
      color: "#0891b2",
      path: "/owner/rentals",
    },
    {
      icon: <Star />,
      label: "Average Rating",
      value: avgRating,
      subtitle: `${totalReviews} total reviews`,
      color: "#ca8a04",
      path: "/owner/reviewmanage",
    },
    {
      icon: <ReceiptLong />,
      label: "Accepted Offers",
      value: acceptedOffers,
      subtitle: "Offers marked as accepted",
      color: "#4f46e5",
      path: "/owner/sale-transactions",
    },
  ];

  const quickActions: QuickAction[] = [
    {
      icon: <Apartment />,
      label: "My Properties",
      path: "/owner/properties",
      color: "#2563eb",
    },
    {
      icon: <Email />,
      label: "Inquiries",
      path: "/owner/inquiries",
      color: "#7c3aed",
    },
    {
      icon: <Event />,
      label: "Appointments",
      path: "/owner/appointments",
      color: "#d97706",
    },
    {
      icon: <AssignmentTurnedIn />,
      label: "Rentals",
      path: "/owner/rentals",
      color: "#059669",
    },
    {
      icon: <Description />,
      label: "Leases",
      path: "/owner/leases",
      color: "#0891b2",
    },
    {
      icon: <Star />,
      label: "Reviews",
      path: "/owner/reviewmanage",
      color: "#ca8a04",
    },
  ];

  // Render
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1600px",
        mx: "auto",
        pb: 4,
      }}
    >
      {/* WELCOME BANNER */}
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          p: { xs: 2.5, sm: 3.5, md: 4 },
          mb: 3,
          borderRadius: 4,
          color: "#fff",
          background:
            "linear-gradient(125deg, #0f172a 0%, #134e4a 62%, #047857 100%)",
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.10)",
            top: -150,
            right: -35,
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: 190,
            height: 190,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.045)",
            bottom: -125,
            right: 125,
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              minWidth: 0,
            }}
          >
            <Avatar
              src={user?.image}
              alt={user?.name || "Owner"}
              sx={{
                width: { xs: 54, sm: 68 },
                height: { xs: 54, sm: 68 },
                flexShrink: 0,
                bgcolor: "rgba(255,255,255,0.14)",
                color: "#fff",
                fontSize: 27,
                fontWeight: 800,
                border: "2px solid rgba(255,255,255,0.35)",
              }}
            >
              {getInitial(user?.name)}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Chip
                label="OWNER WORKSPACE"
                size="small"
                sx={{
                  mb: 1,
                  color: "#d1fae5",
                  bgcolor: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  fontWeight: 800,
                  fontSize: 10,
                  letterSpacing: 1,
                }}
              />

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "-0.8px",
                  lineHeight: 1.2,
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
                  overflowWrap: "anywhere",
                }}
              >
                Welcome back, {user?.name?.trim().split(" ")[0] || "Owner"}!
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: "rgba(255,255,255,0.78)",
                  maxWidth: 500,
                  lineHeight: 1.7,
                }}
              >
                Manage your properties, follow up on inquiries, and keep your
                real-estate business moving forward.
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/owner/properties/create")}
            sx={{
              alignSelf: { xs: "stretch", sm: "center" },
              bgcolor: "#d1fae5",
              color: "#064e3b",
              px: 2.5,
              py: 1.25,
              borderRadius: 2.5,
              fontWeight: 800,
              textTransform: "none",
              whiteSpace: "nowrap",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#a7f3d0",
                boxShadow: "none",
              },
            }}
          >
            Add New Property
          </Button>
        </Box>

        <Divider
          sx={{
            my: 3,
            borderColor: "rgba(255,255,255,0.15)",
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 2, sm: 4 },
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Apartment sx={{ color: "#a7f3d0", fontSize: 20 }} />
            <Box>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.65)", display: "block" }}
              >
                Properties
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                {totalProperties} listed
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Email sx={{ color: "#c4b5fd", fontSize: 20 }} />
            <Box>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.65)", display: "block" }}
              >
                Pending inquiries
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                {pendingInquiries} to review
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TrendingUp sx={{ color: "#fde68a", fontSize: 20 }} />
            <Box>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.65)", display: "block" }}
              >
                Active offers
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                {activeOffers} in progress
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* PRIMARY STATISTICS */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "#0f172a" }}
          >
            Business overview
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            A snapshot of your property management activity.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {primaryStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </Box>
      </Box>

      {/* SECONDARY STATISTICS */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "#0f172a" }}
          >
            Portfolio insights
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            Property value, rental activity, and customer feedback.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {secondaryStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </Box>
      </Box>

      {/* RECENT ACTIVITY */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "repeat(2, minmax(0, 1fr))",
          },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        {/* RECENT INQUIRIES */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            minWidth: 0,
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            boxShadow: "0 3px 14px rgba(15, 23, 42, 0.035)",
          }}
        >
          <SectionHeader
            icon={<Email fontSize="small" />}
            title="Recent Inquiries"
            path="/owner/inquiries"
          />

          <Divider sx={{ mb: 1 }} />

          {loadingInquiries && recentInquiries.length === 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, py: 1 }}>
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} variant="rounded" height={68} />
              ))}
            </Box>
          ) : recentInquiries.length === 0 ? (
            <EmptyState message="No inquiries yet. New inquiries will appear here." />
          ) : (
            <List disablePadding>
              {recentInquiries.map((inquiry, index) => (
                <ListItem
                  key={inquiry._id}
                  disableGutters
                  sx={{
                    py: 1.75,
                    alignItems: "center",
                    gap: 1,
                    borderBottom:
                      index < recentInquiries.length - 1
                        ? "1px solid #eef2f7"
                        : "none",
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 48 }}>
                    <Avatar
                      sx={{
                        width: 42,
                        height: 42,
                        bgcolor: "#ede9fe",
                        color: "#6d28d9",
                        fontWeight: 800,
                      }}
                    >
                      {getInitial(inquiry.name)}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    sx={{ minWidth: 0, my: 0 }}
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 800, color: "#0f172a" }}
                          noWrap
                        >
                          {inquiry.name || "Unknown visitor"}
                        </Typography>

                        <Chip
                          label={inquiry.status}
                          size="small"
                          color={
                            inquiry.status === "pending"
                              ? "warning"
                              : inquiry.status === "contacted"
                                ? "info"
                                : "success"
                          }
                          sx={{
                            height: 21,
                            fontSize: 10,
                            fontWeight: 800,
                            textTransform: "capitalize",
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.5,
                        }}
                      >
                        {inquiry.message || "No message provided."}
                      </Typography>
                    }
                  />

                  <Typography
                    variant="caption"
                    sx={{
                      ml: 0.5,
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                      color: "#94a3b8",
                      fontSize: 10,
                    }}
                  >
                    {formatDate(inquiry.createdAt)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        {/* RECENT SALE OFFERS */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            minWidth: 0,
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            boxShadow: "0 3px 14px rgba(15, 23, 42, 0.035)",
          }}
        >
          <SectionHeader
            icon={<LocalOffer fontSize="small" />}
            title="Recent Sale Offers"
            path="/owner/sale-offers"
          />

          <Divider sx={{ mb: 1 }} />

          {recentOffers.length === 0 ? (
            <EmptyState message="No sale offers yet. Offers from buyers will appear here." />
          ) : (
            <List disablePadding>
              {recentOffers.map((offer, index) => (
                <ListItem
                  key={offer._id}
                  disableGutters
                  sx={{
                    py: 1.75,
                    alignItems: "center",
                    gap: 1,
                    borderBottom:
                      index < recentOffers.length - 1
                        ? "1px solid #eef2f7"
                        : "none",
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 48 }}>
                    <Avatar
                      sx={{
                        width: 42,
                        height: 42,
                        bgcolor: "#fef3c7",
                        color: "#b45309",
                      }}
                    >
                      <IndianRupee />
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    sx={{ minWidth: 0, my: 0 }}
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 800, color: "#0f172a" }}
                        >
                          {formatCurrency(offer.currentOfferPrice)}
                        </Typography>

                        <Chip
                          label={offer.status}
                          size="small"
                          color={
                            offer.status === "pending"
                              ? "warning"
                              : offer.status === "accepted"
                                ? "success"
                                : offer.status === "countered"
                                  ? "info"
                                  : "default"
                          }
                          sx={{
                            height: 21,
                            fontSize: 10,
                            fontWeight: 800,
                            textTransform: "capitalize",
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          display: "block",
                          color: "#64748b",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {typeof offer.property === "object" &&
                        offer.property !== null &&
                        "title" in offer.property &&
                        typeof offer.property.title === "string"
                          ? offer.property.title
                          : "Property"}
                      </Typography>
                    }
                  />

                  <Typography
                    variant="caption"
                    sx={{
                      ml: 0.5,
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                      color: "#94a3b8",
                      fontSize: 10,
                    }}
                  >
                    {formatDate(offer.createdAt)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>

      {/* QUICK ACTIONS */}
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          boxShadow: "0 3px 14px rgba(15, 23, 42, 0.035)",
        }}
      >
        <Box sx={{ mb: 2.5 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "#0f172a" }}
          >
            Quick Actions
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            Jump directly to the tools you use most.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
              lg: "repeat(6, minmax(0, 1fr))",
            },
            gap: 1.5,
          }}
        >
          {quickActions.map((action) => (
            <Card
              key={action.label}
              onClick={() => navigate(action.path)}
              elevation={0}
              sx={{
                minWidth: 0,
                cursor: "pointer",
                textAlign: "center",
                borderRadius: 2.5,
                border: "1px solid #e2e8f0",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: action.color,
                  bgcolor: `${action.color}06`,
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 20px rgba(15, 23, 42, 0.06)",
                },
              }}
            >
              <CardContent
                sx={{
                  p: 2,
                  "&:last-child": { pb: 2 },
                }}
              >
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    mx: "auto",
                    mb: 1.5,
                    borderRadius: 2.5,
                    bgcolor: `${action.color}14`,
                    color: action.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {React.cloneElement(
                    action.icon as React.ReactElement<{ sx?: object }>,
                    { sx: { fontSize: 25 } }
                  )}
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#334155",
                    fontWeight: 800,
                    fontSize: 12,
                    overflowWrap: "anywhere",
                  }}
                >
                  {action.label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default OwnerDashboard;