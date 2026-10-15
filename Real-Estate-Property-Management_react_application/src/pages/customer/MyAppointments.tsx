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
} from "@mui/material";
import {
  Event,
  Cancel,
  Visibility,
  Close,
  Home,
  Timer,
  Message,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MainLayout from "../../components/layout/MainLayout";
import FormInput from "../../components/common/FormInput";
import { cancelAppointmentFormSchema } from "../../utils/validations";
import {
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
  clearSelectedAppointment,
} from "../../features/appointment/appointmentSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import type {
  Appointment,
  CancelFormValues,
} from "../../typescript/type/appointment.types";
import type { Property } from "../../typescript/type/property.types";

const STATUS_COLORS: Record<
  string,
  "default" | "warning" | "info" | "success" | "error"
> = {
  pending: "warning",
  confirmed: "info",
  completed: "success",
  cancelled: "error",
  rejected: "error",
  rescheduled: "info",
};

const isPopulatedProperty = (
  val: Property | string | undefined,
): val is Property => !!val && typeof val === "object" && "title" in val;

const MyAppointments: React.FC = () => {
  const dispatch = useAppDispatch();

  const { appointments, appointment, loading } = useAppSelector(
    (state) => state.appointment,
  );

  const [tab, setTab] = useState<string>("all");
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [cancelOpen, setCancelOpen] = useState<boolean>(false);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);

  const { control, handleSubmit, reset } = useForm<CancelFormValues>({
    resolver: yupResolver(cancelAppointmentFormSchema),
    defaultValues: {
      cancellationReason: "",
    },
  });

  useEffect(() => {
    dispatch(getMyAppointments());

    return () => {
      dispatch(clearSelectedAppointment());
    };
  }, [dispatch]);

  const handleView = async (id: string): Promise<void> => {
    await dispatch(getAppointmentById(id));
    setViewOpen(true);
  };

  const closeView = (): void => {
    setViewOpen(false);
    dispatch(clearSelectedAppointment());
  };

  const openCancel = (a: Appointment): void => {
    setCancelTarget(a);
    reset({
      cancellationReason: "",
    });
    setCancelOpen(true);
  };

  const closeCancel = (): void => {
    setCancelOpen(false);
    setCancelTarget(null);
    reset({
      cancellationReason: "",
    });
  };

  const submitCancel = async (data: CancelFormValues): Promise<void> => {
    if (!cancelTarget) return;

    const result = await dispatch(
      cancelAppointment({
        id: cancelTarget._id,
        cancellationReason: data.cancellationReason,
      }),
    );

    if (cancelAppointment.fulfilled.match(result)) {
      closeCancel();
    }
  };

  const filtered =
    tab === "all" ? appointments : appointments.filter((a) => a.status === tab);

  console.log("filtered", filtered);

  const counts = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  const canCancel = (status: string): boolean =>
    ["pending", "confirmed", "rescheduled"].includes(status);

  return (
    <MainLayout>
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
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
              My Appointments
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Track your scheduled property visits
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
            mb: 2,
          }}
        />

        <Tabs
          value={tab}
          onChange={(_event, value) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 3,
          }}
        >
          <Tab value="all" label={`All (${counts.all})`} />
          <Tab value="pending" label={`Pending (${counts.pending})`} />
          <Tab value="confirmed" label={`Confirmed (${counts.confirmed})`} />
          <Tab value="completed" label={`Completed (${counts.completed})`} />
          <Tab value="cancelled" label={`Cancelled (${counts.cancelled})`} />
        </Tabs>

        {loading && appointments.length === 0 ? (
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
                  height={220}
                  sx={{
                    borderRadius: 3,
                  }}
                />
              </Box>
            ))}
          </Box>
        ) : filtered.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
            }}
          >
            <Event
              sx={{
                fontSize: 80,
                color: "text.disabled",
                mb: 2,
              }}
            />

            <Typography variant="h6" color="text.secondary">
              No appointments found
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {filtered.map((a) => (
              <Box
                key={a._id}
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
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
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
                            isPopulatedProperty(a.property)
                              ? a.property.images?.[0]?.image
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
                            sx={{
                              fontWeight: 700,
                            }}
                            noWrap
                          >
                            {isPopulatedProperty(a.property)
                              ? a.property.title
                              : "Property"}
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            {isPopulatedProperty(a.property) &&
                              `${a.property.propertyType} • ${a.property.purpose}`}
                          </Typography>
                        </Box>
                      </Box>

                      <Chip
                        label={a.status}
                        color={STATUS_COLORS[a.status] ?? "default"}
                        size="small"
                      />
                    </Box>

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
                          {new Date(a.appointmentDate).toLocaleString()}
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
                          {a.duration} minutes
                        </Typography>
                      </Box>

                      {a.message && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1,
                          }}
                        >
                          <Message
                            fontSize="small"
                            color="action"
                            sx={{
                              mt: 0.2,
                            }}
                          />

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {a.message}
                          </Typography>
                        </Box>
                      )}

                      {a.cancellationReason && (
                        <Typography variant="caption" color="error">
                          <b>Cancelled:</b> {a.cancellationReason}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>

                  <Divider />

                  <CardActions
                    sx={{
                      justifyContent: "space-between",
                    }}
                  >
                    <Tooltip title="View details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleView(a._id)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {canCancel(a.status) && (
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => openCancel(a)}
                      >
                        Cancel
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      <Dialog open={viewOpen} onClose={closeView} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Appointment Details
          <IconButton onClick={closeView} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          {loading && !appointment ? (
            <Skeleton variant="rounded" height={200} />
          ) : appointment ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
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
                  {isPopulatedProperty(appointment.property)
                    ? appointment.property.title
                    : "Property"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Date & Time
                </Typography>

                <Typography variant="body1">
                  {new Date(appointment.appointmentDate).toLocaleString()}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Duration
                </Typography>

                <Typography variant="body1">
                  {appointment.duration} minutes
                </Typography>
              </Box>

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
                    label={appointment.status}
                    color={STATUS_COLORS[appointment.status] ?? "default"}
                    size="small"
                  />
                </Box>
              </Box>

              {appointment.message && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Your Message
                  </Typography>

                  <Typography variant="body2">{appointment.message}</Typography>
                </Box>
              )}

              {appointment.cancellationReason && (
                <Box>
                  <Typography variant="caption" color="error">
                    Cancellation Reason
                  </Typography>

                  <Typography variant="body2" color="error">
                    {appointment.cancellationReason}
                  </Typography>
                </Box>
              )}
            </Box>
          ) : null}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeView}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={cancelOpen} onClose={closeCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Appointment</DialogTitle>

        <Divider />

        <DialogContent>
          <Box
            sx={{
              pt: 2,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
              }}
            >
              Are you sure you want to cancel this appointment?
            </Typography>

            <FormInput<CancelFormValues>
              name="cancellationReason"
              control={control}
              label="Reason (optional)"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeCancel}>Keep</Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleSubmit(submitCancel)}
          >
            Confirm Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default MyAppointments;
