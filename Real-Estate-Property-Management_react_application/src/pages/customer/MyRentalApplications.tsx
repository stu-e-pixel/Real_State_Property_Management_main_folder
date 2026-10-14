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
  AssignmentTurnedIn,
  Close,
  Home,
  Visibility,
  Cancel,
  Edit,
  Work,
  Person,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MainLayout from "../../components/layout/MainLayout";
import FormInput from "../../components/common/FormInput";
import { rentalApplicationSchema } from "../../utils/validations";
import {
  getMyRentalApplications,
  getRentalApplicationById,
  withdrawRentalApplication,
  updateRentalApplication,
  clearSelectedRental,
} from "../../features/rental/rentalSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import type {
  RentalApplication,
  RentalApplicationFormValues,
} from "../../typescript/type/rental.types";
import type { Property } from "../../typescript/type/property.types";
import { IndianRupee } from "lucide-react";

const STATUS_COLORS: Record<
  string,
  "default" | "info" | "success" | "error" | "warning"
> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
  withdrawn: "default",
};

const isPopulatedProperty = (
  val: Property | string | undefined,
): val is Property => !!val && typeof val === "object" && "title" in val;

const MyRentalApplications: React.FC = () => {
  const dispatch = useAppDispatch();

  const { applications, application, loading } = useAppSelector(
    (state) => state.rental,
  );

  const [tab, setTab] = useState<string>("all");
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editTarget, setEditTarget] = useState<RentalApplication | null>(null);

  const { control, handleSubmit, reset } = useForm<RentalApplicationFormValues>(
    {
      resolver: yupResolver(rentalApplicationSchema),
      defaultValues: {
        monthlyIncome: 0,
        employmentStatus: "",
        occupation: "",
        message: "",
      },
    },
  );

  useEffect(() => {
    dispatch(getMyRentalApplications());

    return () => {
      dispatch(clearSelectedRental());
    };
  }, [dispatch]);

  // ================= VIEW =================

  const handleView = async (id: string): Promise<void> => {
    await dispatch(getRentalApplicationById(id));
    setViewOpen(true);
  };

  const closeView = (): void => {
    setViewOpen(false);
    dispatch(clearSelectedRental());
  };

  // ================= EDIT =================

  const openEdit = (a: RentalApplication): void => {
    setEditTarget(a);

    reset({
      monthlyIncome: a.monthlyIncome ?? 0,
      employmentStatus: a.employmentStatus ?? "",
      occupation: a.occupation ?? "",
      message: a.message ?? "",
    });

    setEditOpen(true);
  };

  const closeEdit = (): void => {
    setEditOpen(false);
    setEditTarget(null);

    reset({
      monthlyIncome: 0,
      employmentStatus: "",
      occupation: "",
      message: "",
    });
  };

  const submitEdit = async (
    data: RentalApplicationFormValues,
  ): Promise<void> => {
    if (!editTarget) return;

    const result = await dispatch(
      updateRentalApplication({
        id: editTarget._id,
        data,
      }),
    );

    if (updateRentalApplication.fulfilled.match(result)) {
      closeEdit();
    }
  };

  // ================= WITHDRAW =================

  const handleWithdraw = (id: string): void => {
    if (window.confirm("Withdraw this rental application?")) {
      dispatch(withdrawRentalApplication(id));
    }
  };

  // ================= FILTER =================

  const filtered =
    tab === "all" ? applications : applications.filter((a) => a.status === tab);

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    withdrawn: applications.filter((a) => a.status === "withdrawn").length,
  };

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
              My Rental Applications
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Track the rental applications you've submitted
            </Typography>
          </Box>

          <Chip
            label={`${applications.length} Total`}
            color="primary"
            variant="outlined"
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

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
          <Tab value="all" label={`All (${counts.all})`} />

          <Tab value="pending" label={`Pending (${counts.pending})`} />

          <Tab value="approved" label={`Approved (${counts.approved})`} />

          <Tab value="rejected" label={`Rejected (${counts.rejected})`} />

          <Tab value="withdrawn" label={`Withdrawn (${counts.withdrawn})`} />
        </Tabs>

        {/* ================= CONTENT ================= */}

        {loading && applications.length === 0 ? (
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
            <AssignmentTurnedIn
              sx={{
                fontSize: 80,
                color: "text.disabled",
                mb: 2,
              }}
            />

            <Typography color="text.secondary">
              No applications in this category.
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

                    {/* Application info */}

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
                        <IndianRupee fontSize="small" color="action" />

                        <Typography variant="body2">
                          Monthly income: ₹{a.monthlyIncome.toLocaleString()}
                        </Typography>
                      </Box>

                      {a.employmentStatus && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Work fontSize="small" color="action" />

                          <Typography variant="body2">
                            {a.employmentStatus}
                          </Typography>
                        </Box>
                      )}

                      {a.occupation && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Person fontSize="small" color="action" />

                          <Typography variant="body2">
                            {a.occupation}
                          </Typography>
                        </Box>
                      )}

                      {a.message && (
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
                      )}
                    </Box>

                    {a.rejectionReason && (
                      <Alert
                        severity="error"
                        sx={{
                          mt: 1.5,
                          py: 0.5,
                        }}
                      >
                        <Typography variant="caption">
                          <b>Reason:</b> {a.rejectionReason}
                        </Typography>
                      </Alert>
                    )}

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mt: 1,
                      }}
                    >
                      Applied {new Date(a.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent>

                  <Divider />

                  <CardActions
                    sx={{
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1,
                      p: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
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

                      {a.status === "pending" && (
                        <>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() => openEdit(a)}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Withdraw">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleWithdraw(a._id)}
                            >
                              <Cancel fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>
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
          Application Details
          <IconButton onClick={closeView} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          {loading && !application ? (
            <Skeleton variant="rounded" height={220} />
          ) : application ? (
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
                  {isPopulatedProperty(application.property)
                    ? application.property.title
                    : "Property"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Monthly Income
                </Typography>

                <Typography variant="body1">
                  ₹{application.monthlyIncome.toLocaleString()}
                </Typography>
              </Box>

              {application.employmentStatus && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Employment Status
                  </Typography>

                  <Typography variant="body1">
                    {application.employmentStatus}
                  </Typography>
                </Box>
              )}

              {application.occupation && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Occupation
                  </Typography>

                  <Typography variant="body1">
                    {application.occupation}
                  </Typography>
                </Box>
              )}

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
                    label={application.status}
                    color={STATUS_COLORS[application.status] ?? "default"}
                    size="small"
                  />
                </Box>
              </Box>

              {application.message && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Message
                  </Typography>

                  <Typography variant="body2">{application.message}</Typography>
                </Box>
              )}

              {application.rejectionReason && (
                <Alert severity="error">
                  <b>Reason:</b> {application.rejectionReason}
                </Alert>
              )}
            </Box>
          ) : null}
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
          }}
        >
          <Button onClick={closeView}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ================= EDIT DIALOG ================= */}

      <Dialog
        open={editOpen}
        onClose={closeEdit}
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
        <DialogTitle>Edit Rental Application</DialogTitle>

        <Divider />

        <DialogContent>
          <Box
            sx={{
              pt: 2,
            }}
          >
            <form
              id="edit-rental-application-form"
              onSubmit={handleSubmit(submitEdit)}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <FormInput<RentalApplicationFormValues>
                  name="monthlyIncome"
                  control={control}
                  label="Monthly Income"
                  type="number"
                />

                <FormInput<RentalApplicationFormValues>
                  name="employmentStatus"
                  control={control}
                  label="Employment Status"
                />

                <FormInput<RentalApplicationFormValues>
                  name="occupation"
                  control={control}
                  label="Occupation"
                />

                <FormInput<RentalApplicationFormValues>
                  name="message"
                  control={control}
                  label="Message"
                  multiline
                  rows={4}
                />
              </Box>
            </form>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            gap: 1,
          }}
        >
          <Button onClick={closeEdit}>Cancel</Button>

          <Button
            type="submit"
            form="edit-rental-application-form"
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default MyRentalApplications;
