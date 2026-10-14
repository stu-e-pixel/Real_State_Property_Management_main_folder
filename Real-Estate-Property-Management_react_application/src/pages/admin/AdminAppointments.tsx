import React, { useEffect, useState } from "react";

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
  Tooltip,
} from "@mui/material";

import { Search, Refresh, Email, Phone } from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import Loader from "../../components/common/Loader";

import { getAllAppointments } from "../../features/appointment/appointmentSlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type { PopulatedUserLite } from "../../typescript/type/inquiry.types";
import type { Property } from "../../typescript/type/property.types";

// =====================================================
// STATUS COLORS
// =====================================================

const STATUS_COLORS: Record<
  string,
  "default" | "info" | "success" | "warning" | "error"
> = {
  pending: "warning",
  confirmed: "info",
  completed: "success",
  cancelled: "error",
  rejected: "error",
  rescheduled: "info",
};

// =====================================================
// TYPE GUARDS
// =====================================================

const isPopulatedProperty = (
  val: Property | string | undefined,
): val is Property => !!val && typeof val === "object" && "title" in val;

const isPopulatedUser = (
  val: PopulatedUserLite | string | null | undefined,
): val is PopulatedUserLite =>
  !!val && typeof val === "object" && "name" in val;

// =====================================================
// COMPONENT
// =====================================================

const AdminAppointments: React.FC = () => {
  const dispatch = useAppDispatch();

  const { appointments, loading } = useAppSelector(
    (state) => state.appointment,
  );

  const [search, setSearch] = useState<string>("");

  // ================= FETCH =================

  useEffect(() => {
    dispatch(getAllAppointments());
  }, [dispatch]);

  // ================= SEARCH =================

  const searchTerm = search.trim().toLowerCase();

  const filtered = appointments.filter((a) => {
    if (!searchTerm) return true;

    return (
      (isPopulatedUser(a.user) &&
        a.user.name.toLowerCase().includes(searchTerm)) ||
      (isPopulatedUser(a.user) &&
        a.user.email.toLowerCase().includes(searchTerm)) ||
      (isPopulatedProperty(a.property) &&
        a.property.title.toLowerCase().includes(searchTerm)) ||
      (isPopulatedUser(a.agent) &&
        a.agent.name.toLowerCase().includes(searchTerm)) ||
      a.status.toLowerCase().includes(searchTerm) ||
      (a.message ?? "").toLowerCase().includes(searchTerm)
    );
  });

  // ================= REFRESH =================

  const handleRefresh = (): void => {
    dispatch(getAllAppointments());
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <MainLayout>
      <Paper
        sx={{
          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          borderRadius: 3,
        }}
      >
        {/* ================= HEADER ================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
              }}
            >
              All Appointments
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
            >
              Monitor property visits scheduled across the platform
            </Typography>
          </Box>

          <Chip
            label={`${appointments.length} Total`}
            color="primary"
            variant="outlined"
          />
        </Box>

        <Divider
          sx={{
            mb: 3,
          }}
        />

        {/* ================= SEARCH AND REFRESH ================= */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            placeholder="Search by customer, property, agent, status..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <IconButton
            color="primary"
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Refresh appointments"
          >
            <Refresh />
          </IconButton>
        </Box>

        {/* ================= CONTENT ================= */}

        {loading && appointments.length === 0 ? (
          <Loader message="Loading appointments..." />
        ) : filtered.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
            }}
          >
            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              No appointments found.
            </Typography>
          </Box>
        ) : (
          <TableContainer
            sx={{
              width: "100%",
              overflowX: "auto",
            }}
          >
            <Table
              sx={{
                minWidth: 1100,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Property</TableCell>
                  <TableCell>Agent</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a._id} hover>
                    {/* ============ CUSTOMER ============ */}

                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          minWidth: 160,
                        }}
                      >
                        <Avatar
                          src={
                            isPopulatedUser(a.user) ? a.user.image : undefined
                          }
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: "primary.main",
                            fontSize: 14,
                          }}
                        >
                          {isPopulatedUser(a.user)
                            ? a.user.name?.charAt(0)?.toUpperCase()
                            : "?"}
                        </Avatar>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.25,
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: 160,
                            }}
                          >
                            {isPopulatedUser(a.user) ? a.user.name : "—"}
                          </Typography>

                          {isPopulatedUser(a.user) && (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <Email
                                  sx={{
                                    fontSize: 12,
                                    color: "text.secondary",
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "text.secondary",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: 140,
                                  }}
                                >
                                  {a.user.email}
                                </Typography>
                              </Box>

                              {a.user.phone && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <Phone
                                    sx={{
                                      fontSize: 12,
                                      color: "text.secondary",
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "text.secondary",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {a.user.phone}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    {/* ============ PROPERTY ============ */}

                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          minWidth: 140,
                        }}
                      >
                        {isPopulatedProperty(a.property) &&
                          a.property.images?.[0]?.image && (
                            <Avatar
                              src={a.property.images[0].image}
                              variant="rounded"
                              sx={{ width: 32, height: 32 }}
                            />
                          )}

                        <Typography
                          variant="body2"
                          noWrap
                          sx={{
                            maxWidth: 160,
                          }}
                        >
                          {isPopulatedProperty(a.property)
                            ? a.property.title
                            : "—"}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* ============ AGENT ============ */}

                    <TableCell>
                      {isPopulatedUser(a.agent) ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Avatar
                            src={a.agent.image}
                            sx={{
                              width: 28,
                              height: 28,
                              fontSize: 12,
                            }}
                          >
                            {a.agent.name?.charAt(0)?.toUpperCase()}
                          </Avatar>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 140 }}
                          >
                            {a.agent.name}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          —
                        </Typography>
                      )}
                    </TableCell>

                    {/* ============ DATE & TIME ============ */}

                    <TableCell>
                      <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                        {new Date(a.appointmentDate).toLocaleString()}
                      </Typography>
                    </TableCell>

                    {/* ============ DURATION ============ */}

                    <TableCell>
                      <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                        {a.duration} min
                      </Typography>
                    </TableCell>

                    {/* ============ MESSAGE ============ */}

                    <TableCell>
                      <Tooltip title={a.message || "No message"}>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{
                            maxWidth: 220,
                          }}
                        >
                          {a.message || "—"}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    {/* ============ STATUS ============ */}

                    <TableCell>
                      <Chip
                        label={a.status}
                        color={STATUS_COLORS[a.status] ?? "default"}
                        size="small"
                      />
                    </TableCell>

                    {/* ============ CREATED ============ */}

                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {new Date(a.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </MainLayout>
  );
};

export default AdminAppointments;
