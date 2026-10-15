import React, { useEffect, useMemo } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  PeopleAlt,
  Business,
  VerifiedUser,
  Apartment,
  Email,
  Event,
  Description,
  ReceiptLong,
  Star,
  ArrowForward,
  CheckCircle,
  PendingActions,
  TrendingUp,
  AdminPanelSettings,
  Schedule,
  RateReview,
  DashboardRounded,
  ArrowOutward,
  HomeWork,
  CurrencyRupee,
  NotificationsActive,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { getAllUsers } from "../../features/user/userSlice";
import { getAllOwners } from "../../features/owner/ownerSlice";
import { getAllAgents } from "../../features/agent/agentSlice";
import { getAllProperties } from "../../features/property/propertySlice";
import { getAllInquiries } from "../../features/inquiry/inquirySlice";
import { getAllAppointments } from "../../features/appointment/appointmentSlice";
import { getAllReviews } from "../../features/review/reviewSlice";

const THEME = {
  ink: "#14231f",
  muted: "#71817c",
  green: "#087f5b",
  greenDark: "#075e45",
  greenSoft: "#e8f7f0",
  border: "#e3ece7",
  canvas: "#f5f8f6",
  white: "#ffffff",
};

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  note?: string;
  color: string;
  path: string;
};

type QuickAction = {
  icon: React.ReactNode;
  label: string;
  description: string;
  path: string;
  color: string;
};

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  note,
  color,
  path,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(path)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") navigate(path);
      }}
      sx={{
        height: "100%",
        cursor: "pointer",
        border: `1px solid ${THEME.border}`,
        borderRadius: 4,
        boxShadow: "0 5px 20px rgba(20, 35, 31, 0.035)",
        transition:
          "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: color,
          boxShadow: "0 14px 30px rgba(20, 35, 31, 0.09)",
        },
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, sm: 2.4 },
          "&:last-child": { pb: { xs: 2, sm: 2.4 } },
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 46,
              height: 46,
              display: "grid",
              placeItems: "center",
              borderRadius: 3,
              bgcolor: `${color}16`,
              color,
              "& svg": { fontSize: 24 },
            }}
          >
            {icon}
          </Box>
          <ArrowOutward sx={{ color: "#a6b3ad", fontSize: 19 }} />
        </Stack>
        <Typography
          sx={{
            mt: 2.1,
            fontSize: { xs: "1.7rem", sm: "2rem" },
            fontWeight: 850,
            letterSpacing: "-1px",
            color: THEME.ink,
            lineHeight: 1.1,
          }}
        >
          {value}
        </Typography>
        <Typography
          sx={{
            mt: 0.8,
            color: THEME.ink,
            fontWeight: 750,
            fontSize: ".88rem",
          }}
        >
          {label}
        </Typography>
        {note && (
          <Typography sx={{ mt: 0.45, color: THEME.muted, fontSize: ".75rem" }}>
            {note}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const SectionTitle: React.FC<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}> = ({ title, subtitle, icon, action }) => (
  <Stack
    direction="row"
    spacing={2}
    sx={{ alignItems: "center", justifyContent: "space-between", mb: 2.2 }}
  >
    <Stack
      direction="row"
      spacing={1.2}
      sx={{ minWidth: 0, alignItems: "center" }}
    >
      {icon && (
        <Box
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            borderRadius: 2.5,
            bgcolor: THEME.greenSoft,
            color: THEME.green,
            display: "grid",
            placeItems: "center",
          }}
        >
          {icon}
        </Box>
      )}
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            color: THEME.ink,
            fontWeight: 850,
            fontSize: { xs: "1.05rem", sm: "1.2rem" },
            letterSpacing: "-.35px",
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ mt: 0.3, color: THEME.muted, fontSize: ".8rem" }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
    {action}
  </Stack>
);

const EmptyState: React.FC<{ icon: React.ReactNode; message: string }> = ({
  icon,
  message,
}) => (
  <Stack
    spacing={1}
    sx={{
      py: 4,
      px: 2,
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Box
      sx={{
        width: 52,
        height: 52,
        display: "grid",
        placeItems: "center",
        borderRadius: "50%",
        bgcolor: THEME.greenSoft,
        color: THEME.green,
        "& svg": { fontSize: 26 },
      }}
    >
      {icon}
    </Box>
    <Typography
      sx={{ color: THEME.muted, fontWeight: 650, fontSize: ".86rem" }}
    >
      {message}
    </Typography>
  </Stack>
);

const panelSx = {
  p: { xs: 2, sm: 2.6 },
  border: `1px solid ${THEME.border}`,
  borderRadius: 4,
  boxShadow: "0 5px 20px rgba(20, 35, 31, 0.035)",
  bgcolor: THEME.white,
};

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const { users } = useAppSelector((state) => state.user);
  const { owners } = useAppSelector((state) => state.owner);
  const { agents } = useAppSelector((state) => state.agent);
  const { properties, loading: loadingProperties } = useAppSelector(
    (state) => state.property,
  );
  const { inquiries } = useAppSelector((state) => state.inquiry);
  const { appointments } = useAppSelector((state) => state.appointment);
  const { saleOffers } = useAppSelector((state) => state.saleOffer);
  const { reviews } = useAppSelector((state) => state.review);

  useEffect(() => {
    dispatch(getAllUsers({ page: 1, limit: 100, role: "customer" }));
    dispatch(getAllOwners({ page: 1, limit: 100 }));
    dispatch(getAllAgents({ page: 1, limit: 100 }));
    dispatch(getAllProperties({ page: 1, limit: 100 }));
    dispatch(getAllInquiries());
    dispatch(getAllAppointments());
    dispatch(getAllReviews());
  }, [dispatch]);

  const totalCustomers = users?.length ?? 0;
  const totalOwners = owners?.length ?? 0;
  const totalAgents = agents?.length ?? 0;
  const totalProperties = properties?.length ?? 0;
  const totalInquiries = inquiries?.length ?? 0;
  const totalAppointments = appointments?.length ?? 0;
  const totalOffers = saleOffers?.length ?? 0;
  const totalReviews = reviews?.length ?? 0;

  const approvedProperties =
    properties?.filter((item) => item.approvalStatus === "Approved").length ??
    0;
  const pendingProperties =
    properties?.filter((item) => item.approvalStatus === "Pending").length ?? 0;
  const pendingReviews =
    reviews?.filter((item) => item.status === "pending").length ?? 0;
  const avgRating = totalReviews
    ? (
        reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
        totalReviews
      ).toFixed(1)
    : "—";
  const totalPortfolioValue =
    properties
      ?.filter((item) => item.approvalStatus === "Approved")
      .reduce((sum, item) => sum + (Number(item.price) || 0), 0) ?? 0;
  const totalPortfolioFormatted =
    totalPortfolioValue > 0
      ? `₹${(totalPortfolioValue / 1_000_000).toFixed(2)}M`
      : "₹0";

  const recentPendingReviews = useMemo(
    () =>
      [...(reviews ?? [])]
        .filter((review) => review.status === "pending")
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 3),
    [reviews],
  );
  const recentPendingProperties = useMemo(
    () =>
      [...(properties ?? [])]
        .filter((property) => property.approvalStatus === "Pending")
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 3),
    [properties],
  );

  const quickActions: QuickAction[] = [
    {
      icon: <PeopleAlt />,
      label: "Customers",
      description: "Manage user accounts",
      path: "/admin/users",
      color: "#2563eb",
    },
    {
      icon: <Business />,
      label: "Owners",
      description: "Owner directory",
      path: "/admin/owners",
      color: "#087f5b",
    },
    {
      icon: <VerifiedUser />,
      label: "Agents",
      description: "Agent accounts",
      path: "/admin/agents",
      color: "#7c3aed",
    },
    {
      icon: <Apartment />,
      label: "Approvals",
      description: "Review property listings",
      path: "/admin/properties",
      color: "#d97706",
    },
    {
      icon: <Email />,
      label: "Inquiries",
      description: "Customer requests",
      path: "/admin/inquiries",
      color: "#0891b2",
    },
    {
      icon: <Event />,
      label: "Appointments",
      description: "Upcoming visits",
      path: "/admin/appointments",
      color: "#db2777",
    },
    {
      icon: <Description />,
      label: "Leases",
      description: "Lease documents",
      path: "/admin/AllLeases",
      color: "#6366f1",
    },
    {
      icon: <ReceiptLong />,
      label: "Transactions",
      description: "Sales and payments",
      path: "/admin/sale-transactions",
      color: "#0d9488",
    },
    {
      icon: <Star />,
      label: "Reviews",
      description: "Customer feedback",
      path: "/admin/allreview",
      color: "#ca8a04",
    },
  ];

  const stats: StatCardProps[] = [
    {
      icon: <PeopleAlt />,
      label: "Customers",
      value: totalCustomers,
      color: "#2563eb",
      path: "/admin/users",
    },
    {
      icon: <Business />,
      label: "Property owners",
      value: totalOwners,
      color: "#087f5b",
      path: "/admin/owners",
    },
    {
      icon: <VerifiedUser />,
      label: "Agents",
      value: totalAgents,
      color: "#7c3aed",
      path: "/admin/agents",
    },
    {
      icon: <Apartment />,
      label: "Properties",
      value: totalProperties,
      note: `${approvedProperties} approved listings`,
      color: "#d97706",
      path: "/admin/properties",
    },
    {
      icon: <Email />,
      label: "Inquiries",
      value: totalInquiries,
      color: "#0891b2",
      path: "/admin/inquiries",
    },
    {
      icon: <Event />,
      label: "Appointments",
      value: totalAppointments,
      color: "#db2777",
      path: "/admin/appointments",
    },
  ];

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Box
      sx={{
        minHeight: "100%",
        bgcolor: THEME.canvas,
        p: { xs: 1.5, sm: 2.5, lg: 3 },
        borderRadius: { xs: 2, md: 4 },
      }}
    >
      {/* Welcome banner */}
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          p: { xs: 2.5, sm: 3.5, md: 4 },
          mb: 3.5,
          borderRadius: 5,
          color: "#fff",
          background:
            "linear-gradient(115deg, #102b23 0%, #08664c 58%, #16a078 100%)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 300,
            height: 300,
            border: "1px solid rgba(255,255,255,.15)",
            borderRadius: "50%",
            right: -80,
            top: -170,
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 210,
            height: 210,
            bgcolor: "rgba(255,255,255,.06)",
            borderRadius: "50%",
            right: 130,
            bottom: -155,
            pointerEvents: "none",
          }}
        />
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            position: "relative",
            zIndex: 1,
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{ minWidth: 0, alignItems: "center" }}
          >
            <Avatar
              src={user?.image || undefined}
              alt={user?.name || "Admin"}
              sx={{
                width: { xs: 56, sm: 70 },
                height: { xs: 56, sm: 70 },
                bgcolor: "rgba(255,255,255,.16)",
                border: "2px solid rgba(255,255,255,.38)",
                fontWeight: 800,
                fontSize: 26,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Chip
                icon={<AdminPanelSettings />}
                label="ADMIN WORKSPACE"
                size="small"
                sx={{
                  mb: 1,
                  bgcolor: "rgba(255,255,255,.14)",
                  color: "#d9fff0",
                  fontWeight: 800,
                  letterSpacing: 1,
                  fontSize: ".65rem",
                  "& .MuiChip-icon": { color: "#b8f5dc" },
                }}
              />
              <Typography
                sx={{
                  fontWeight: 850,
                  letterSpacing: "-1px",
                  fontSize: { xs: "1.65rem", sm: "2.2rem", md: "2.5rem" },
                  lineHeight: 1.12,
                }}
              >
                Welcome{user?.name ? `, ${user.name}` : " back"}!
              </Typography>
              <Typography
                sx={{
                  mt: 1,
                  color: "rgba(255,255,255,.78)",
                  fontSize: ".9rem",
                }}
              >
                Your real-estate operations, all in one place.
              </Typography>
              <Typography
                sx={{
                  mt: 1.2,
                  color: "#b8f5dc",
                  fontWeight: 650,
                  fontSize: ".78rem",
                }}
              >
                {today}
              </Typography>
            </Box>
          </Stack>
          <Stack
            sx={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {pendingProperties > 0 && (
              <Chip
                icon={<PendingActions />}
                label={`${pendingProperties} property approvals`}
                onClick={() => navigate("/admin/properties")}
                sx={{
                  bgcolor: "rgba(255,255,255,.14)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,.18)",
                  fontWeight: 700,
                  cursor: "pointer",
                  "& .MuiChip-icon": { color: "#ffe29a" },
                  "&:hover": { bgcolor: "rgba(255,255,255,.22)" },
                }}
              />
            )}
            {pendingReviews > 0 && (
              <Chip
                icon={<NotificationsActive />}
                label={`${pendingReviews} reviews to check`}
                onClick={() => navigate("/admin/allreview")}
                sx={{
                  bgcolor: "rgba(255,255,255,.14)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,.18)",
                  fontWeight: 700,
                  cursor: "pointer",
                  "& .MuiChip-icon": { color: "#ffe29a" },
                  "&:hover": { bgcolor: "rgba(255,255,255,.22)" },
                }}
              />
            )}
          </Stack>
        </Stack>
      </Paper>

      <SectionTitle
        title="Platform overview"
        subtitle="A live snapshot of your real-estate platform."
        icon={<DashboardRounded />}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(3, minmax(0, 1fr))",
            xl: "repeat(6, minmax(0, 1fr))",
          },
          gap: 1.7,
          mb: 3.5,
        }}
      >
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </Box>

      <SectionTitle
        title="Business insights"
        subtitle="Property portfolio and customer feedback at a glance."
        icon={<TrendingUp />}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1.7,
          mb: 3.5,
        }}
      >
        <StatCard
          icon={<CurrencyRupee />}
          label="Portfolio value"
          value={totalPortfolioFormatted}
          note="Approved listing value"
          color="#059669"
          path="/admin/properties"
        />
        <StatCard
          icon={<PendingActions />}
          label="Pending approvals"
          value={pendingProperties}
          note="Awaiting admin review"
          color="#d97706"
          path="/admin/properties"
        />
        <StatCard
          icon={<ReceiptLong />}
          label="Sale offers"
          value={totalOffers}
          note="Platform-wide offers"
          color="#6366f1"
          path="/admin/sale-transactions"
        />
        <StatCard
          icon={<Star />}
          label="Average rating"
          value={avgRating}
          note={`${totalReviews} total reviews`}
          color="#ca8a04"
          path="/admin/allreview"
        />
      </Box>

      <SectionTitle
        title="Moderation center"
        subtitle="Handle items that need your attention."
        icon={<CheckCircle />}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3.5,
        }}
      >
        <Paper elevation={0} sx={panelSx}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mb: 1.4,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 3,
                  bgcolor: "#fff4dc",
                  color: "#bd7600",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <HomeWork />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, color: THEME.ink }}>
                  Property approvals
                </Typography>
                <Typography sx={{ color: THEME.muted, fontSize: ".76rem" }}>
                  Recently submitted listings
                </Typography>
              </Box>
            </Stack>
            <Chip
              label={pendingProperties}
              size="small"
              sx={{ bgcolor: "#fff4dc", color: "#9a5c00", fontWeight: 800 }}
            />
          </Stack>
          <Divider sx={{ borderColor: THEME.border }} />
          {loadingProperties && recentPendingProperties.length === 0 ? (
            <Stack spacing={1.2} sx={{ py: 2 }}>
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} variant="rounded" height={64} />
              ))}
            </Stack>
          ) : recentPendingProperties.length === 0 ? (
            <EmptyState
              icon={<CheckCircle />}
              message="You're all caught up. No pending properties."
            />
          ) : (
            <List disablePadding>
              {recentPendingProperties.map((property, index) => (
                <ListItem
                  key={property._id}
                  disableGutters
                  sx={{
                    py: 1.5,
                    gap: 1,
                    borderBottom:
                      index < recentPendingProperties.length - 1
                        ? `1px solid ${THEME.border}`
                        : "none",
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 50 }}>
                    <Avatar
                      src={property.images?.[0]?.image || undefined}
                      variant="rounded"
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                        bgcolor: "#fff4dc",
                        color: "#bd7600",
                      }}
                    >
                      <Apartment />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ minWidth: 0, mr: 0.5 }}
                    primary={
                      <Typography
                        noWrap
                        sx={{
                          color: THEME.ink,
                          fontWeight: 750,
                          fontSize: ".86rem",
                        }}
                      >
                        {property.title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        sx={{
                          mt: 0.35,
                          color: THEME.muted,
                          fontSize: ".75rem",
                        }}
                      >
                        {property.propertyType} · ₹
                        {Number(property.price || 0).toLocaleString("en-IN")}
                      </Typography>
                    }
                  />
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => navigate("/admin/properties")}
                    sx={{
                      flexShrink: 0,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 750,
                      bgcolor: "#b77908",
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#925f05", boxShadow: "none" },
                    }}
                  >
                    Review
                  </Button>
                </ListItem>
              ))}
            </List>
          )}
          <Button
            fullWidth
            endIcon={<ArrowForward />}
            onClick={() => navigate("/admin/properties")}
            sx={{
              mt: 1.5,
              py: 1,
              borderRadius: 2.5,
              bgcolor: THEME.greenSoft,
              color: THEME.greenDark,
              textTransform: "none",
              fontWeight: 800,
              "&:hover": { bgcolor: "#d6f1e4" },
            }}
          >
            View all properties
          </Button>
        </Paper>

        <Paper elevation={0} sx={panelSx}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mb: 1.4,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 3,
                  bgcolor: "#fff5d9",
                  color: "#ad7900",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <RateReview />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, color: THEME.ink }}>
                  Review moderation
                </Typography>
                <Typography sx={{ color: THEME.muted, fontSize: ".76rem" }}>
                  Latest customer feedback
                </Typography>
              </Box>
            </Stack>
            <Chip
              label={pendingReviews}
              size="small"
              sx={{ bgcolor: "#fff4dc", color: "#9a5c00", fontWeight: 800 }}
            />
          </Stack>
          <Divider sx={{ borderColor: THEME.border }} />
          {recentPendingReviews.length === 0 ? (
            <EmptyState
              icon={<CheckCircle />}
              message="You're all caught up. No pending reviews."
            />
          ) : (
            <List disablePadding>
              {recentPendingReviews.map((review, index) => {
                const reviewerName =
                  typeof review.user === "object" &&
                  review.user !== null &&
                  "name" in review.user
                    ? String(review.user.name || "Customer")
                    : "Customer";
                return (
                  <ListItem
                    key={review._id}
                    disableGutters
                    sx={{
                      py: 1.5,
                      gap: 1,
                      borderBottom:
                        index < recentPendingReviews.length - 1
                          ? `1px solid ${THEME.border}`
                          : "none",
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 50 }}>
                      <Avatar
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2.5,
                          bgcolor: "#fff4dc",
                          color: "#9a6b00",
                          fontWeight: 800,
                          fontSize: ".8rem",
                        }}
                      >
                        {Number(review.rating || 0).toFixed(1)}★
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      sx={{ minWidth: 0, mr: 0.5 }}
                      primary={
                        <Typography
                          noWrap
                          sx={{
                            color: THEME.ink,
                            fontWeight: 750,
                            fontSize: ".86rem",
                          }}
                        >
                          {review.comment || "No written comment"}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{
                            mt: 0.35,
                            color: THEME.muted,
                            fontSize: ".75rem",
                          }}
                        >
                          {reviewerName} ·{" "}
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-IN",
                          )}
                        </Typography>
                      }
                    />
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => navigate("/admin/allreview")}
                      sx={{
                        flexShrink: 0,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 750,
                        bgcolor: "#b77908",
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#925f05", boxShadow: "none" },
                      }}
                    >
                      Review
                    </Button>
                  </ListItem>
                );
              })}
            </List>
          )}
          <Button
            fullWidth
            endIcon={<ArrowForward />}
            onClick={() => navigate("/admin/allreview")}
            sx={{
              mt: 1.5,
              py: 1,
              borderRadius: 2.5,
              bgcolor: THEME.greenSoft,
              color: THEME.greenDark,
              textTransform: "none",
              fontWeight: 800,
              "&:hover": { bgcolor: "#d6f1e4" },
            }}
          >
            View all reviews
          </Button>
        </Paper>
      </Box>

      <Paper elevation={0} sx={panelSx}>
        <SectionTitle
          title="Quick actions"
          subtitle="Go straight to the tools you use most."
          icon={<Schedule />}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
              lg: "repeat(5, minmax(0, 1fr))",
            },
            gap: 1.4,
          }}
        >
          {quickActions.map((action) => (
            <Card
              key={action.label}
              onClick={() => navigate(action.path)}
              sx={{
                minWidth: 0,
                cursor: "pointer",
                border: `1px solid ${THEME.border}`,
                borderRadius: 3,
                boxShadow: "none",
                transition: "all .2s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  borderColor: action.color,
                  bgcolor: "#fbfdfc",
                  boxShadow: "0 8px 20px rgba(20,35,31,.06)",
                },
              }}
            >
              <CardContent sx={{ p: 1.7, "&:last-child": { pb: 1.7 } }}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center", justifyContent: "space-between" }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      flexShrink: 0,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 2.5,
                      bgcolor: `${action.color}16`,
                      color: action.color,
                      "& svg": { fontSize: 22 },
                    }}
                  >
                    {action.icon}
                  </Box>
                  <ArrowForward sx={{ color: "#a6b3ad", fontSize: 18 }} />
                </Stack>
                <Typography
                  sx={{
                    mt: 1.5,
                    color: THEME.ink,
                    fontWeight: 800,
                    fontSize: ".86rem",
                  }}
                >
                  {action.label}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.4,
                    color: THEME.muted,
                    fontSize: ".72rem",
                    lineHeight: 1.45,
                  }}
                >
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
