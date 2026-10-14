import React, { useEffect, useMemo, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Box,
  Divider,
  TextField,
  InputAdornment,
  Avatar,
  Button,
  Skeleton,
} from "@mui/material";

import {
  Search,
  Refresh,
  Description,
  CalendarMonth,
  CheckCircle,
  HourglassEmpty,
  Cancel,
  ArrowForward,
} from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import Loader from "../../components/common/Loader";
import { getAllLeases } from "../../features/lease/leaseSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import type { PopulatedUserLite } from "../../typescript/type/inquiry.types";
import type { Property } from "../../typescript/type/property.types";
import { IndianRupee } from "lucide-react";

const COLORS = {
  navy: "#0f172a",
  teal: "#134e4a",
  emerald: "#0f766e",
  emeraldHover: "#115e59",
  mint: "#ecfdf5",
  border: "#dbe7e4",
  slate: "#64748b",
  background: "#f8fafc",
  white: "#ffffff",
};

const STATUS_COLORS: Record<
  string,
  "success" | "default" | "error" | "warning"
> = {
  active: "success",
  expired: "default",
  terminated: "error",
};

const isPopulatedProperty = (
  val: Property | string | undefined,
): val is Property => !!val && typeof val === "object" && "title" in val;

const isPopulatedUser = (
  val: PopulatedUserLite | string | null | undefined,
): val is PopulatedUserLite =>
  !!val && typeof val === "object" && "name" in val;

const formatDate = (date: string | Date) => {
  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime())
    ? "—"
    : parsedDate.toLocaleDateString();
};

const formatCurrency = (amount: number) =>
  `₹${Number(amount || 0).toLocaleString()}`;

const AdminLeases: React.FC = () => {
  const dispatch = useAppDispatch();

  const { leases = [], loading } = useAppSelector((state) => state.lease);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getAllLeases());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) return leases;

    return leases.filter((lease) => {
      const tenantName = isPopulatedUser(lease.tenant) ? lease.tenant.name : "";

      const propertyTitle = isPopulatedProperty(lease.property)
        ? lease.property.title
        : "";

      const ownerName = isPopulatedUser(lease.owner) ? lease.owner.name : "";

      const agentName = isPopulatedUser(lease.agent) ? lease.agent.name : "";

      return [
        tenantName,
        propertyTitle,
        ownerName,
        agentName,
        lease.status,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(searchTerm),
      );
    });
  }, [leases, search]);

  const activeLeases = leases.filter(
    (lease) => lease.status === "active",
  ).length;

  const expiredLeases = leases.filter(
    (lease) => lease.status === "expired",
  ).length;

  const totalMonthlyRent = leases
    .filter((lease) => lease.status === "active")
    .reduce((sum, lease) => sum + (Number(lease.monthlyRent) || 0), 0);

  const handleRefresh = () => {
    dispatch(getAllLeases());
  };

  return (
    <MainLayout>
      <Box
        sx={{
          width: "100%",
          minHeight: "100%",
          bgcolor: COLORS.background,
          p: { xs: 1.5, sm: 2.5, md: 3 },
          borderRadius: { xs: 2, md: 3 },
          boxSizing: "border-box",
        }}
      >
        {/* WELCOME HEADER */}

        <Paper
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            p: { xs: 2.5, sm: 3.5 },
            mb: 3,
            borderRadius: "22px",
            color: COLORS.white,
            background:
              "linear-gradient(120deg, #0f172a 0%, #134e4a 52%, #0f766e 100%)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.12)",
              top: -110,
              right: -35,
              pointerEvents: "none",
            }}
          />

          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.8,
                minWidth: 0,
              }}
            >
              <Avatar
                sx={{
                  width: 58,
                  height: 58,
                  bgcolor: "rgba(255,255,255,0.13)",
                  color: "#d1fae5",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                <Description sx={{ fontSize: 30 }} />
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    letterSpacing: 1.5,
                    color: "#a7f3d0",
                    mb: 0.7,
                  }}
                >
                  ADMIN WORKSPACE
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "2rem" },
                    fontWeight: 800,
                    lineHeight: 1.2,
                    letterSpacing: "-0.7px",
                  }}
                >
                  Lease Management
                </Typography>

                <Typography
                  sx={{
                    mt: 0.8,
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  Manage and monitor platform-wide lease agreements.
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                borderRadius: "10px",
                px: 2,
                py: 1.1,
                textTransform: "none",
                fontWeight: 700,
                bgcolor: "rgba(255,255,255,0.13)",
                color: COLORS.white,
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.22)",
                  boxShadow: "none",
                },
              }}
            >
              Refresh Leases
            </Button>
          </Box>
        </Paper>

        {/* SUMMARY CARDS */}

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
            "& > *": {
              flex: {
                xs: "1 1 calc(50% - 16px)",
                sm: "1 1 calc(50% - 16px)",
                lg: "1 1 calc(25% - 16px)",
              },
              minWidth: 0,
            },
          }}
        >
          {[
            {
              label: "Total Leases",
              value: leases.length,
              icon: <Description />,
              color: "#2563eb",
              bg: "#eff6ff",
            },
            {
              label: "Active Leases",
              value: activeLeases,
              icon: <CheckCircle />,
              color: "#059669",
              bg: "#ecfdf5",
            },
            {
              label: "Expired Leases",
              value: expiredLeases,
              icon: <HourglassEmpty />,
              color: "#d97706",
              bg: "#fffbeb",
            },
            {
              label: "Monthly Rent",
              value: formatCurrency(totalMonthlyRent),
              icon: <IndianRupee />,
              color: "#7c3aed",
              bg: "#f5f3ff",
            },
          ].map((item) => (
            <Paper
              key={item.label}
              elevation={0}
              sx={{
                p: { xs: 1.8, sm: 2.3 },
                borderRadius: "17px",
                border: `1px solid ${COLORS.border}`,
                bgcolor: COLORS.white,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
                },
              }}
            >
              <Box
                sx={{
                  width: 43,
                  height: 43,
                  borderRadius: "13px",
                  bgcolor: item.bg,
                  color: item.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1.7,
                  "& svg": { fontSize: 24 },
                }}
              >
                {item.icon}
              </Box>

              <Typography
                sx={{
                  fontSize: { xs: "1.35rem", sm: "1.7rem" },
                  fontWeight: 800,
                  color: COLORS.navy,
                  overflowWrap: "anywhere",
                }}
              >
                {item.value}
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "#475569",
                }}
              >
                {item.label}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* LEASE TABLE */}

        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2.5, md: 3 },
            borderRadius: "20px",
            border: `1px solid ${COLORS.border}`,
            bgcolor: COLORS.white,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mb: 2.5,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: "1.1rem", sm: "1.3rem" },
                  fontWeight: 800,
                  color: COLORS.navy,
                }}
              >
                All Lease Agreements
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: "0.82rem",
                  color: COLORS.slate,
                }}
              >
                Search and review lease details.
              </Typography>
            </Box>

            <Chip
              label={`${filtered.length} ${
                filtered.length === 1 ? "Lease" : "Leases"
              }`}
              sx={{
                fontWeight: 800,
                bgcolor: COLORS.mint,
                color: COLORS.emerald,
                borderRadius: "9px",
              }}
            />
          </Box>

          <Divider sx={{ mb: 2.5, borderColor: "#edf2f7" }} />

          {/* SEARCH */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 2.5,
            }}
          >
            <TextField
              placeholder="Search tenant, property, owner, agent, status..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              size="small"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: COLORS.slate, fontSize: 21 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: "#fcfefd",
                  "& fieldset": {
                    borderColor: COLORS.border,
                  },
                  "&:hover fieldset": {
                    borderColor: COLORS.emerald,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: COLORS.emerald,
                  },
                },
              }}
            />

            <IconButton
              aria-label="Refresh leases"
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                width: 42,
                height: 42,
                flexShrink: 0,
                borderRadius: "12px",
                bgcolor: COLORS.mint,
                color: COLORS.emerald,
                "&:hover": { bgcolor: "#d1fae5" },
              }}
            >
              <Refresh />
            </IconButton>
          </Box>

          {/* TABLE */}

          {loading && leases.length === 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[1, 2, 3, 4].map((item) => (
                <Skeleton
                  key={item}
                  variant="rounded"
                  height={58}
                  sx={{ borderRadius: "10px" }}
                />
              ))}
              <Loader message="Loading leases..." />
            </Box>
          ) : filtered.length === 0 ? (
            <Box
              sx={{
                py: 7,
                px: 2,
                textAlign: "center",
                borderRadius: "15px",
                bgcolor: "#f8fafc",
              }}
            >
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  mx: "auto",
                  mb: 1.5,
                  borderRadius: "16px",
                  bgcolor: COLORS.mint,
                  color: COLORS.emerald,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Description sx={{ fontSize: 30 }} />
              </Box>

              <Typography sx={{ fontWeight: 800, color: COLORS.navy }}>
                No leases found
              </Typography>

              <Typography
                sx={{ mt: 0.6, fontSize: "0.83rem", color: COLORS.slate }}
              >
                Try another search term or refresh the lease list.
              </Typography>

              {search && (
                <Button
                  onClick={() => setSearch("")}
                  sx={{
                    mt: 1.5,
                    textTransform: "none",
                    color: COLORS.emerald,
                    fontWeight: 700,
                  }}
                >
                  Clear Search
                </Button>
              )}
            </Box>
          ) : (
            <TableContainer
              sx={{
                overflowX: "auto",
                border: "1px solid #edf2f7",
                borderRadius: "14px",
              }}
            >
              <Table sx={{ minWidth: 1050 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: "#f1f8f6",
                      "& .MuiTableCell-root": {
                        color: COLORS.teal,
                        fontWeight: 800,
                        fontSize: "0.77rem",
                        whiteSpace: "nowrap",
                        borderBottom: `1px solid ${COLORS.border}`,
                        py: 1.8,
                      },
                    }}
                  >
                    <TableCell>PROPERTY</TableCell>
                    <TableCell>TENANT</TableCell>
                    <TableCell>OWNER</TableCell>
                    <TableCell>AGENT</TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.7 }}
                      >
                        <CalendarMonth sx={{ fontSize: 17 }} />
                        PERIOD
                      </Box>
                    </TableCell>
                    <TableCell>MONTHLY RENT</TableCell>
                    <TableCell>STATUS</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filtered.map((lease) => {
                    const property = isPopulatedProperty(lease.property)
                      ? lease.property
                      : null;

                    const tenant = isPopulatedUser(lease.tenant)
                      ? lease.tenant
                      : null;

                    const owner = isPopulatedUser(lease.owner)
                      ? lease.owner
                      : null;

                    const agent = isPopulatedUser(lease.agent)
                      ? lease.agent
                      : null;

                    return (
                      <TableRow
                        key={lease._id}
                        hover
                        sx={{
                          "&:last-child td": { borderBottom: 0 },
                          "&:hover": { bgcolor: "#f8fdfb" },
                          "& .MuiTableCell-root": {
                            borderBottom: "1px solid #edf2f7",
                            py: 1.8,
                          },
                        }}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.2,
                              minWidth: 170,
                            }}
                          >
                            <Avatar
                              src={property?.images?.[0]?.image || undefined}
                              variant="rounded"
                              sx={{
                                width: 44,
                                height: 44,
                                borderRadius: "11px",
                                bgcolor: COLORS.mint,
                                color: COLORS.emerald,
                              }}
                            >
                              <Description />
                            </Avatar>

                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                sx={{
                                  fontSize: "0.83rem",
                                  fontWeight: 800,
                                  color: COLORS.navy,
                                  maxWidth: 180,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {property?.title || "—"}
                              </Typography>
                              <Typography
                                sx={{
                                  mt: 0.3,
                                  fontSize: "0.72rem",
                                  color: COLORS.slate,
                                }}
                              >
                                Lease agreement
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Typography
                            sx={{
                              fontSize: "0.82rem",
                              fontWeight: 700,
                              color: COLORS.navy,
                            }}
                          >
                            {tenant?.name || "—"}
                          </Typography>
                          {tenant?.email && (
                            <Typography
                              sx={{
                                mt: 0.3,
                                fontSize: "0.72rem",
                                color: COLORS.slate,
                              }}
                            >
                              {tenant.email}
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          <Typography
                            sx={{
                              fontSize: "0.82rem",
                              fontWeight: 600,
                              color: "#334155",
                            }}
                          >
                            {owner?.name || "—"}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            sx={{
                              fontSize: "0.82rem",
                              fontWeight: 600,
                              color: "#334155",
                            }}
                          >
                            {agent?.name || "—"}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            sx={{
                              fontSize: "0.78rem",
                              color: "#334155",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatDate(lease.startDate)}
                          </Typography>
                          <Typography
                            sx={{
                              mt: 0.3,
                              fontSize: "0.75rem",
                              color: COLORS.slate,
                              whiteSpace: "nowrap",
                            }}
                          >
                            to {formatDate(lease.endDate)}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            sx={{
                              fontSize: "0.85rem",
                              fontWeight: 800,
                              color: COLORS.navy,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatCurrency(lease.monthlyRent)}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              color: COLORS.slate,
                            }}
                          >
                            Per month
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={lease.status}
                            size="small"
                            color={STATUS_COLORS[lease.status] ?? "default"}
                            icon={
                              lease.status === "active" ? (
                                <CheckCircle />
                              ) : lease.status === "expired" ? (
                                <HourglassEmpty />
                              ) : lease.status === "terminated" ? (
                                <Cancel />
                              ) : undefined
                            }
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: 700,
                              fontSize: "0.72rem",
                              "& .MuiChip-icon": { fontSize: 15 },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
              mt: 2,
            }}
          >
            <Typography sx={{ fontSize: "0.76rem", color: COLORS.slate }}>
              Showing {filtered.length} of {leases.length} leases
            </Typography>

            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.6,
                fontSize: "0.76rem",
                fontWeight: 600,
                color: COLORS.emerald,
              }}
            >
              Lease Management
              <ArrowForward sx={{ fontSize: 15 }} />
            </Typography>
          </Box>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default AdminLeases;
