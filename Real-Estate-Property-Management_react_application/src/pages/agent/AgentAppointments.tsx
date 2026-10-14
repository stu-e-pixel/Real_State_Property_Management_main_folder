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
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Schedule,
  TaskAlt,
  MoreVert,
  Visibility,
  Close,
  Home,
  Email,
  Phone,
  Message,
  Event,
  Timer,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MainLayout from "../../components/layout/MainLayout";
import FormInput from "../../components/common/FormInput";
import {
  cancelAppointmentFormSchema,
  rescheduleSchema,
} from "../../utils/validations";
import {
  getAgentAppointments,
  getOwnerAppointments,
  getAppointmentById,
  appointmentAction,
  cancelAppointment,
  clearSelectedAppointment,
} from "../../features/appointment/appointmentSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import type {
  Appointment,
  CancelFormValues,
  RescheduleFormValues,
} from "../../typescript/type/appointment.types";
import type { Property } from "../../typescript/type/property.types";
import type { PopulatedUserLite } from "../../typescript/type/inquiry.types";

// =====================================================
// CONFIG
// =====================================================

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
  val: Property | string | undefined
): val is Property =>
  !!val && typeof val === "object" && "title" in val;

const isPopulatedUser = (
  val: PopulatedUserLite | string | null | undefined
): val is PopulatedUserLite =>
  !!val && typeof val === "object" && "name" in val;

// =====================================================
// PROPS
// =====================================================

interface AgentAppointmentsProps {
  mode: "agent" | "owner";
}

const pad = (n: number) => String(n).padStart(2, "0");

const toLocalInput = (iso: string): string => {
  const d = new Date(iso);

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// =====================================================
// PAGE
// =====================================================

const AgentAppointments: React.FC<AgentAppointmentsProps> = ({
  mode,
}) => {
  const dispatch = useAppDispatch();

  const { appointments, appointment, loading } = useAppSelector(
    (state) => state.appointment
  );

  const [tab, setTab] = useState<string>("all");
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [rescheduleOpen, setRescheduleOpen] =
    useState<boolean>(false);
  const [cancelOpen, setCancelOpen] = useState<boolean>(false);
  const [target, setTarget] = useState<Appointment | null>(null);

  // Row action menu
  const [menuAnchor, setMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [menuAppointment, setMenuAppointment] =
    useState<Appointment | null>(null);

  const rescheduleForm = useForm<RescheduleFormValues>({
    resolver: yupResolver(rescheduleSchema),
    defaultValues: {
      appointmentDate: "",
      duration: 60,
      message: "",
    },
  });

  const cancelForm = useForm<CancelFormValues>({
    resolver: yupResolver(cancelAppointmentFormSchema),
    defaultValues: {
      cancellationReason: "",
    },
  });

  // =====================================================
  // FETCH
  // =====================================================

  useEffect(() => {
    if (mode === "agent") {
      dispatch(getAgentAppointments());
    } else {
      dispatch(getOwnerAppointments());
    }

    return () => {
      dispatch(clearSelectedAppointment());
    };
  }, [dispatch, mode]);

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleView = async (id: string): Promise<void> => {
    await dispatch(getAppointmentById(id));
    setViewOpen(true);
  };

  const closeView = (): void => {
    setViewOpen(false);
    dispatch(clearSelectedAppointment());
  };

  const doAction = (
    a: Appointment,
    action: "confirm" | "reject" | "complete"
  ): void => {
    const verb =
      action.charAt(0).toUpperCase() + action.slice(1);

    if (window.confirm(`${verb} this appointment?`)) {
      dispatch(
        appointmentAction({
          id: a._id,
          action,
        })
      );
    }
  };

  const openReschedule = (a: Appointment): void => {
    setTarget(a);

    rescheduleForm.reset({
      appointmentDate: toLocalInput(a.appointmentDate),
      duration: a.duration,
      message: a.message ?? "",
    });

    setRescheduleOpen(true);
  };

  const closeReschedule = (): void => {
    setRescheduleOpen(false);
    setTarget(null);

    rescheduleForm.reset({
      appointmentDate: "",
      duration: 60,
      message: "",
    });
  };

  const submitReschedule = async (
    data: RescheduleFormValues
  ): Promise<void> => {
    if (!target) return;

    const result = await dispatch(
      appointmentAction({
        id: target._id,
        action: "reschedule",
        appointmentDate: new Date(
          data.appointmentDate
        ).toISOString(),
        duration: data.duration,
        message: data.message,
      })
    );

    if (appointmentAction.fulfilled.match(result)) {
      closeReschedule();
    }
  };

  const openCancel = (a: Appointment): void => {
    setTarget(a);

    cancelForm.reset({
      cancellationReason: "",
    });

    setCancelOpen(true);
  };

  const closeCancel = (): void => {
    setCancelOpen(false);
    setTarget(null);

    cancelForm.reset({
      cancellationReason: "",
    });
  };

  const submitCancel = async (
    data: CancelFormValues
  ): Promise<void> => {
    if (!target) return;

    const result = await dispatch(
      cancelAppointment({
        id: target._id,
        cancellationReason: data.cancellationReason,
      })
    );

    if (cancelAppointment.fulfilled.match(result)) {
      closeCancel();
    }
  };

  // =====================================================
  // MENU
  // =====================================================

  const openMenu = (
    e: React.MouseEvent<HTMLElement>,
    a: Appointment
  ): void => {
    setMenuAnchor(e.currentTarget);
    setMenuAppointment(a);
  };

  const closeMenu = (): void => {
    setMenuAnchor(null);
    setMenuAppointment(null);
  };

  // =====================================================
  // TAB COUNTS
  // =====================================================

  const filtered =
    tab === "all"
      ? appointments
      : appointments.filter((a) => a.status === tab);

  const counts = {
    all: appointments.length,
    pending: appointments.filter(
      (a) => a.status === "pending"
    ).length,
    confirmed: appointments.filter(
      (a) => a.status === "confirmed"
    ).length,
    rescheduled: appointments.filter(
      (a) => a.status === "rescheduled"
    ).length,
    completed: appointments.filter(
      (a) => a.status === "completed"
    ).length,
    cancelled: appointments.filter(
      (a) => a.status === "cancelled"
    ).length,
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <MainLayout>
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        {/* ================= HEADER ================= */}

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
              {mode === "agent"
                ? "Assigned Appointments"
                : "Property Visits"}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Manage visits for{" "}
              {mode === "agent"
                ? "your assigned properties"
                : "your properties"}
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

        {/* ================= TABS ================= */}

        <Tabs
          value={tab}
          onChange={(_event, value) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 3,
          }}
        >
          <Tab
            value="all"
            label={`All (${counts.all})`}
          />

          <Tab
            value="pending"
            label={`Pending (${counts.pending})`}
          />

          <Tab
            value="confirmed"
            label={`Confirmed (${counts.confirmed})`}
          />

          <Tab
            value="rescheduled"
            label={`Rescheduled (${counts.rescheduled})`}
          />

          <Tab
            value="completed"
            label={`Completed (${counts.completed})`}
          />

          <Tab
            value="cancelled"
            label={`Cancelled (${counts.cancelled})`}
          />
        </Tabs>

        {/* ================= APPOINTMENTS ================= */}

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
                  height={260}
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

            <Typography
              variant="h6"
              color="text.secondary"
            >
              No appointments in this category
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
                    {/* Header */}

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

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {isPopulatedProperty(a.property) &&
                              `${a.property.propertyType} • ${a.property.purpose}`}
                          </Typography>
                        </Box>
                      </Box>

                      <Chip
                        label={a.status}
                        color={
                          STATUS_COLORS[a.status] ??
                          "default"
                        }
                        size="small"
                      />
                    </Box>

                    {/* Customer Info */}

                    {isPopulatedUser(a.user) && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          p: 1,
                          bgcolor: "#f9fafb",
                          borderRadius: 1,
                          mb: 1.5,
                        }}
                      >
                        <Avatar
                          src={a.user.image}
                          sx={{
                            width: 28,
                            height: 28,
                          }}
                        >
                          {a.user.name?.charAt(0)}
                        </Avatar>

                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            {a.user.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "block",
                            }}
                          >
                            {a.user.email}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Date / Duration / Message */}

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
                        <Event
                          fontSize="small"
                          color="action"
                        />

                        <Typography variant="body2">
                          {new Date(
                            a.appointmentDate
                          ).toLocaleString()}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Timer
                          fontSize="small"
                          color="action"
                        />

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
                          >
                            {a.message}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>

                  <Divider />

                  <CardActions
                    sx={{
                      justifyContent: "space-between",
                    }}
                  >
                    <Tooltip title="View">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() =>
                          handleView(a._id)
                        }
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      {a.status === "pending" && (
                        <>
                          <Button
                            size="small"
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={() =>
                              doAction(
                                a,
                                "confirm"
                              )
                            }
                          >
                            Confirm
                          </Button>

                          <Button
                            size="small"
                            color="error"
                            startIcon={<Cancel />}
                            onClick={() =>
                              doAction(
                                a,
                                "reject"
                              )
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {a.status === "confirmed" && (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<TaskAlt />}
                          onClick={() =>
                            doAction(
                              a,
                              "complete"
                            )
                          }
                        >
                          Complete
                        </Button>
                      )}

                      {(a.status === "pending" ||
                        a.status === "confirmed" ||
                        a.status === "rescheduled") && (
                        <IconButton
                          size="small"
                          onClick={(event) =>
                            openMenu(event, a)
                          }
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* ================= ROW MENU ================= */}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
      >
        <MenuItem
          onClick={() => {
            if (menuAppointment) {
              openReschedule(menuAppointment);
            }

            closeMenu();
          }}
        >
          <ListItemIcon>
            <Schedule fontSize="small" />
          </ListItemIcon>

          Reschedule
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (menuAppointment) {
              openCancel(menuAppointment);
            }

            closeMenu();
          }}
        >
          <ListItemIcon>
            <Cancel fontSize="small" />
          </ListItemIcon>

          Cancel Appointment
        </MenuItem>
      </Menu>

      {/* ================= VIEW DIALOG ================= */}

      <Dialog
        open={viewOpen}
        onClose={closeView}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Appointment Details

          <IconButton
            onClick={closeView}
            size="small"
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          {loading && !appointment ? (
            <Skeleton
              variant="rounded"
              height={220}
            />
          ) : appointment ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Property
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {isPopulatedProperty(
                    appointment.property
                  )
                    ? appointment.property.title
                    : "Property"}
                </Typography>
              </Box>

              {/* Customer */}

              {isPopulatedUser(appointment.user) && (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Customer
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mt: 1,
                      p: 1.5,
                      bgcolor: "#f9fafb",
                      borderRadius: 2,
                    }}
                  >
                    <Avatar
                      src={appointment.user.image}
                      sx={{
                        width: 40,
                        height: 40,
                      }}
                    >
                      {appointment.user.name?.charAt(
                        0
                      )}
                    </Avatar>

                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {appointment.user.name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 2,
                          mt: 0.5,
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
                            fontSize="small"
                            color="action"
                          />

                          <Typography variant="caption">
                            {appointment.user.email}
                          </Typography>
                        </Box>

                        {appointment.user.phone && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Phone
                              fontSize="small"
                              color="action"
                            />

                            <Typography variant="caption">
                              {appointment.user.phone}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Date */}

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Date & Time
                </Typography>

                <Typography variant="body1">
                  {new Date(
                    appointment.appointmentDate
                  ).toLocaleString()}
                </Typography>
              </Box>

              {/* Duration */}

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Duration
                </Typography>

                <Typography variant="body1">
                  {appointment.duration} minutes
                </Typography>
              </Box>

              {/* Status */}

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Status
                </Typography>

                <Box
                  sx={{
                    mt: 0.5,
                  }}
                >
                  <Chip
                    label={appointment.status}
                    color={
                      STATUS_COLORS[
                        appointment.status
                      ] ?? "default"
                    }
                    size="small"
                  />
                </Box>
              </Box>

              {/* Message */}

              {appointment.message && (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Message
                  </Typography>

                  <Typography variant="body2">
                    {appointment.message}
                  </Typography>
                </Box>
              )}

              {/* Cancellation */}

              {appointment.cancellationReason && (
                <Box>
                  <Typography
                    variant="caption"
                    color="error"
                  >
                    Cancellation Reason
                  </Typography>

                  <Typography
                    variant="body2"
                    color="error"
                  >
                    {appointment.cancellationReason}
                  </Typography>
                </Box>
              )}
            </Box>
          ) : null}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeView}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= RESCHEDULE DIALOG ================= */}

      <Dialog
        open={rescheduleOpen}
        onClose={closeReschedule}
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
        <DialogTitle>
          Reschedule Appointment
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Box
            sx={{
              pt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormInput<RescheduleFormValues>
              name="appointmentDate"
              control={rescheduleForm.control}
              label="New Date & Time"
              type="datetime-local"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <FormInput<RescheduleFormValues>
              name="duration"
              control={rescheduleForm.control}
              label="Duration (minutes)"
              type="number"
            />

            <FormInput<RescheduleFormValues>
              name="message"
              control={rescheduleForm.control}
              label="Message (optional)"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeReschedule}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={rescheduleForm.handleSubmit(
              submitReschedule
            )}
          >
            Save New Time
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= CANCEL DIALOG ================= */}

      <Dialog
        open={cancelOpen}
        onClose={closeCancel}
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
        <DialogTitle>
          Cancel Appointment
        </DialogTitle>

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
              The customer will be notified of this
              cancellation.
            </Typography>

            <FormInput<CancelFormValues>
              name="cancellationReason"
              control={cancelForm.control}
              label="Reason"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeCancel}>
            Keep
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={cancelForm.handleSubmit(
              submitCancel
            )}
          >
            Confirm Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default AgentAppointments;