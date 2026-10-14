import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Button,
  Box,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Tabs,
  Tab,
  Skeleton,
  Alert,
} from "@mui/material";
import {
  Description,
  Close,
  Home,
  Visibility,
  Event,
  Timer,
} from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import {
  getMyLeases,
  getLeaseById,
  clearSelectedLease,
} from "../../features/lease/leaseSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type { Property } from "../../typescript/type/property.types";
import { IndianRupee } from "lucide-react";

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

const MyLeases: React.FC = () => {
  const dispatch = useAppDispatch();

  const { leases, lease, loading } = useAppSelector((state) => state.lease);

  const [tab, setTab] = useState<string>("all");
  const [viewOpen, setViewOpen] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getMyLeases());

    return () => {
      dispatch(clearSelectedLease());
    };
  }, [dispatch]);

  const handleView = async (id: string): Promise<void> => {
    await dispatch(getLeaseById(id));
    setViewOpen(true);
  };

  const closeView = (): void => {
    setViewOpen(false);
    dispatch(clearSelectedLease());
  };

  const filtered =
    tab === "all" ? leases : leases.filter((l) => l.status === tab);

  const counts = {
    all: leases.length,
    active: leases.filter((l) => l.status === "active").length,
    expired: leases.filter((l) => l.status === "expired").length,
    terminated: leases.filter((l) => l.status === "terminated").length,
  };

  return (
    <MainLayout>
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
              }}
            >
              My Leases
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Active and past lease agreements
            </Typography>
          </Box>

          <Chip
            label={`${leases.length} Total`}
            color="primary"
            variant="outlined"
          />
        </Box>

        <Divider
          sx={{
            mb: 2,
          }}
        />

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_e, value) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 3,
          }}
        >
          <Tab value="all" label={`All (${counts.all})`} />

          <Tab value="active" label={`Active (${counts.active})`} />

          <Tab value="expired" label={`Expired (${counts.expired})`} />

          <Tab value="terminated" label={`Terminated (${counts.terminated})`} />
        </Tabs>

        {/* Loading */}
        {loading && leases.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {[1, 2, 3].map((i) => (
              <Box
                key={i}
                sx={{
                  width: {
                    xs: "100%",
                    md: "calc(50% - 12px)",
                  },
                }}
              >
                <Skeleton
                  variant="rounded"
                  height={260}
                  sx={{
                    borderRadius: 3,
                  }}
                />
              </Box>
            ))}
          </Box>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <Box
            sx={{
              textAlign: "center",
              py: 8,
            }}
          >
            <Description
              sx={{
                fontSize: 80,
                color: "text.disabled",
                mb: 2,
              }}
            />

            <Typography color="text.secondary">
              No leases in this category.
            </Typography>
          </Box>
        ) : (
          /* Lease cards */
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {filtered.map((l) => (
              <Box
                key={l._id}
                sx={{
                  width: {
                    xs: "100%",
                    md: "calc(50% - 12px)",
                  },
                }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent
                    sx={{
                      flex: 1,
                    }}
                  >
                    {/* Property header */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          alignItems: "center",
                          minWidth: 0,
                        }}
                      >
                        <Avatar
                          src={
                            isPopulatedProperty(l.property)
                              ? l.property.images?.[0]?.image
                              : undefined
                          }
                          variant="rounded"
                          sx={{
                            width: 44,
                            height: 44,
                          }}
                        >
                          <Home />
                        </Avatar>

                        <Box
                          sx={{
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            noWrap
                            sx={{
                              fontWeight: 700,
                            }}
                          >
                            {isPopulatedProperty(l.property)
                              ? l.property.title
                              : "Property"}
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            {isPopulatedProperty(l.property) &&
                              `${l.property.propertyType} • ${l.property.purpose}`}
                          </Typography>
                        </Box>
                      </Box>

                      <Chip
                        label={l.status}
                        color={STATUS_COLORS[l.status] ?? "default"}
                        size="small"
                      />
                    </Box>

                    {/* Lease information */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Event fontSize="small" color="action" />

                        <Typography variant="body2">
                          {new Date(l.startDate).toLocaleDateString()} —{" "}
                          {new Date(l.endDate).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <IndianRupee fontSize="small" color="action" />

                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          ₹{l.monthlyRent.toLocaleString()}/month
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Timer fontSize="small" color="action" />

                        <Typography variant="body2">
                          Deposit: ₹{l.securityDeposit.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Termination reason */}
                    {l.terminationReason && (
                      <Alert
                        severity="error"
                        sx={{
                          mt: 1.5,
                          py: 0.5,
                        }}
                      >
                        <Typography variant="caption">
                          <b>Terminated:</b> {l.terminationReason}
                        </Typography>
                      </Alert>
                    )}
                  </CardContent>

                  <Divider />

                  <CardActions
                    sx={{
                      justifyContent: "flex-end",
                    }}
                  >
                    <Tooltip title="View details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleView(l._id)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* ================= VIEW DIALOG ================= */}
      <Dialog
        open={viewOpen}
        onClose={closeView}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Lease Details
          <IconButton onClick={closeView} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          {loading && !lease ? (
            <Skeleton variant="rounded" height={220} />
          ) : lease ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* Property */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Property
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {isPopulatedProperty(lease.property)
                    ? lease.property.title
                    : "Property"}
                </Typography>
              </Box>

              {/* Period */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Period
                </Typography>

                <Typography variant="body1">
                  {new Date(lease.startDate).toLocaleDateString()} —{" "}
                  {new Date(lease.endDate).toLocaleDateString()}
                </Typography>
              </Box>

              {/* Monthly rent */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Monthly Rent
                </Typography>

                <Typography variant="body1">
                  ₹{lease.monthlyRent.toLocaleString()}
                </Typography>
              </Box>

              {/* Security deposit */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Security Deposit
                </Typography>

                <Typography variant="body1">
                  ₹{lease.securityDeposit.toLocaleString()}
                </Typography>
              </Box>

              {/* Status */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>

                <Box
                  sx={{
                    mt: 0.5,
                  }}
                >
                  <Chip
                    label={lease.status}
                    color={STATUS_COLORS[lease.status] ?? "default"}
                    size="small"
                  />
                </Box>
              </Box>

              

              {(typeof lease.agreementDocument === "string"
                ? lease.agreementDocument
                : lease.agreementDocument?.url) && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Agreement Document
                  </Typography>

                  <Box sx={{ mt: 0.5 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      href={
                        typeof lease.agreementDocument === "string"
                          ? lease.agreementDocument
                          : (lease.agreementDocument?.url ?? "")
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<Description />}
                    >
                      View Document
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Termination reason */}
              {lease.terminationReason && (
                <Alert severity="error">
                  <b>Termination reason:</b> {lease.terminationReason}
                </Alert>
              )}
            </Box>
          ) : null}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeView}>Close</Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default MyLeases;
