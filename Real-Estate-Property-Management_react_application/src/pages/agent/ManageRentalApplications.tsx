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
  CheckCircle,
  Cancel,
  Work,
  Person,
  Email,
  Phone,
  Gavel,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MainLayout from "../../components/layout/MainLayout";
import FormInput from "../../components/common/FormInput";
import CreateLeaseModal from "./CreateLeaseModal";

import { rentalActionSchema } from "../../utils/validations";

import {
  getOwnerRentalApplications,
  getAgentRentalApplications,
  getRentalApplicationById,
  rentalApplicationAction,
  clearSelectedRental,
} from "../../features/rental/rentalSlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type {
  RentalApplication,
  RentalActionFormValues,
} from "../../typescript/type/rental.types";

import type { PopulatedUserLite } from "../../typescript/type/inquiry.types";
import type { Property } from "../../typescript/type/property.types";
import { IndianRupee } from "lucide-react";

// =====================================================
// STATUS COLORS
// =====================================================

const STATUS_COLORS: Record<
  string,
  "default" | "info" | "success" | "error" | "warning"
> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
  withdrawn: "default",
};

// =====================================================
// TYPE GUARDS
// =====================================================

const isPopulatedProperty = (
  val: Property | string | undefined
): val is Property => !!val && typeof val === "object" && "title" in val;

const isPopulatedUser = (
  val: PopulatedUserLite | string | null | undefined
): val is PopulatedUserLite =>
  !!val && typeof val === "object" && "name" in val;

// =====================================================
// PROPS
// =====================================================

interface ManageRentalApplicationsProps {
  mode: "owner" | "agent";
}

// =====================================================
// COMPONENT
// =====================================================

const ManageRentalApplications: React.FC<ManageRentalApplicationsProps> = ({
  mode,
}) => {
  const dispatch = useAppDispatch();

  const { applications, application, loading } = useAppSelector(
    (state) => state.rental
  );

  const [tab, setTab] = useState<string>("all");
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [rejectOpen, setRejectOpen] = useState<boolean>(false);
  const [rejectTarget, setRejectTarget] = useState<RentalApplication | null>(
    null
  );

  // ✅ NEW — tracks which application is being converted into a lease
  const [leaseApplication, setLeaseApplication] =
    useState<RentalApplication | null>(null);

  const { control, handleSubmit, reset } = useForm<RentalActionFormValues>({
    resolver: yupResolver(rentalActionSchema),
    defaultValues: {
      rejectionReason: "",
    },
  });

  // =====================================================
  // FETCH
  // =====================================================

  useEffect(() => {
    if (mode === "owner") {
      dispatch(getOwnerRentalApplications());
    } else {
      dispatch(getAgentRentalApplications());
    }

    return () => {
      dispatch(clearSelectedRental());
    };
  }, [dispatch, mode]);

  // =====================================================
  // VIEW
  // =====================================================

  const handleView = async (id: string): Promise<void> => {
    await dispatch(getRentalApplicationById(id));
    setViewOpen(true);
  };

  const closeView = (): void => {
    setViewOpen(false);
    dispatch(clearSelectedRental());
  };

  // =====================================================
  // APPROVE
  // =====================================================

  const handleApprove = (a: RentalApplication): void => {
    if (window.confirm(`Approve application from ${a.applicant}?`)) {
      dispatch(
        rentalApplicationAction({
          id: a._id,
          action: "approve",
        })
      );
    }
  };

  // =====================================================
  // REJECT
  // =====================================================

  const openReject = (a: RentalApplication): void => {
    setRejectTarget(a);

    reset({
      rejectionReason: "",
    });

    setRejectOpen(true);
  };

  const closeReject = (): void => {
    setRejectOpen(false);
    setRejectTarget(null);

    reset({
      rejectionReason: "",
    });
  };

  const submitReject = async (
    data: RentalActionFormValues
  ): Promise<void> => {
    if (!rejectTarget) return;

    const result = await dispatch(
      rentalApplicationAction({
        id: rejectTarget._id,
        action: "reject",
        rejectionReason: data.rejectionReason,
      })
    );

    if (rentalApplicationAction.fulfilled.match(result)) {
      closeReject();
    }
  };

  // =====================================================
  // FILTER / COUNTS
  // =====================================================

  const filtered =
    tab === "all" ? applications : applications.filter((a) => a.status === tab);

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <MainLayout>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
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
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {mode === "owner"
                ? "Rental Applications"
                : "Assigned Rental Applications"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {mode === "owner"
                ? "Applications for your rental properties"
                : "Applications for your assigned rental properties"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label={`${counts.pending} Pending`}
              color="warning"
              variant="outlined"
            />
            <Chip
              label={`${counts.approved} Approved`}
              color="success"
              variant="outlined"
            />
            <Chip
              label={`${counts.rejected} Rejected`}
              color="error"
              variant="outlined"
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* ================= TABS ================= */}

        <Tabs
          value={tab}
          onChange={(_event, value) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          <Tab value="all" label={`All (${counts.all})`} />
          <Tab value="pending" label={`Pending (${counts.pending})`} />
          <Tab value="approved" label={`Approved (${counts.approved})`} />
          <Tab value="rejected" label={`Rejected (${counts.rejected})`} />
        </Tabs>

        {/* ================= CONTENT ================= */}

        {loading && applications.length === 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {[1, 2, 3].map((i) => (
              <Box
                key={i}
                sx={{ width: { xs: "100%", md: "calc(50% - 12px)" } }}
              >
                <Skeleton
                  variant="rounded"
                  height={280}
                  sx={{ borderRadius: 3 }}
                />
              </Box>
            ))}
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <AssignmentTurnedIn
              sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
            />
            <Typography color="text.secondary">
              No applications in this category.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {filtered.map((a) => (
              <Box
                key={a._id}
                sx={{ width: { xs: "100%", md: "calc(50% - 12px)" } }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flex: 1 }}>
                    {/* ================= APPLICANT ================= */}

                    {isPopulatedUser(a.applicant) && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 2,
                        }}
                      >
                        <Avatar
                          src={a.applicant.image}
                          sx={{ width: 40, height: 40 }}
                        >
                          {a.applicant.name?.charAt(0)}
                        </Avatar>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700 }}
                          >
                            {a.applicant.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block" }}
                          >
                            {a.applicant.email}
                          </Typography>
                        </Box>

                        <Box sx={{ ml: "auto" }}>
                          <Chip
                            label={a.status}
                            color={STATUS_COLORS[a.status] ?? "default"}
                            size="small"
                          />
                        </Box>
                      </Box>
                    )}

                    {/* ================= PROPERTY ================= */}

                    {isPopulatedProperty(a.property) && (
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
                        <Home fontSize="small" color="action" />
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 600 }}
                        >
                          {a.property.title}
                        </Typography>
                      </Box>
                    )}

                    {/* ================= APPLICATION INFO ================= */}

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.75,
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
                        <Typography variant="caption">
                          Income: ₹{a.monthlyIncome.toLocaleString()}
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
                          <Typography variant="caption">
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
                          <Typography variant="caption">
                            {a.occupation}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {a.rejectionReason && (
                      <Alert severity="error" sx={{ mt: 1, py: 0 }}>
                        <Typography variant="caption">
                          <b>Rejected:</b> {a.rejectionReason}
                        </Typography>
                      </Alert>
                    )}
                  </CardContent>

                  <Divider />

                  {/* ================= ACTIONS ================= */}

                  <CardActions
                    sx={{
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1,
                      p: 1.5,
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

                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {a.status === "pending" && (
                        <>
                          <Button
                            size="small"
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={() => handleApprove(a)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<Cancel />}
                            onClick={() => openReject(a)}
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {/* ✅ NEW — Create Lease button for approved applications */}
                      {a.status === "approved" && (
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          startIcon={<Gavel />}
                          onClick={() => setLeaseApplication(a)}
                          sx={{ textTransform: "none", fontWeight: 600 }}
                        >
                          Create Lease
                        </Button>
                      )}
                    </Box>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* =====================================================
          VIEW DIALOG
      ===================================================== */}

      <Dialog
        open={viewOpen}
        onClose={closeView}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
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
            <Skeleton variant="rounded" height={240} />
          ) : application ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Applicant */}
              {isPopulatedUser(application.applicant) && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Applicant
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
                      src={application.applicant.image}
                      sx={{ width: 44, height: 44 }}
                    >
                      {application.applicant.name?.charAt(0)}
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600 }}
                      >
                        {application.applicant.name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
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
                          <Email fontSize="small" color="action" />
                          <Typography variant="caption">
                            {application.applicant.email}
                          </Typography>
                        </Box>

                        {application.applicant.phone && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Phone fontSize="small" color="action" />
                            <Typography variant="caption">
                              {application.applicant.phone}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Property */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Property
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {isPopulatedProperty(application.property)
                    ? application.property.title
                    : "Property"}
                </Typography>
              </Box>

              {/* Monthly Income */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Monthly Income
                </Typography>
                <Typography variant="body1">
                  ₹{application.monthlyIncome.toLocaleString()}
                </Typography>
              </Box>

              {/* Employment */}
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

              {/* Occupation */}
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

              {/* Message */}
              {application.message && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Applicant Message
                  </Typography>
                  <Alert severity="info" sx={{ mt: 0.5 }}>
                    {application.message}
                  </Alert>
                </Box>
              )}

              {/* Rejection */}
              {application.rejectionReason && (
                <Alert severity="error">
                  <b>Rejection reason:</b> {application.rejectionReason}
                </Alert>
              )}

              {/* Status */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={application.status}
                    color={STATUS_COLORS[application.status] ?? "default"}
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
          ) : null}
        </DialogContent>

        <DialogActions
          sx={{ justifyContent: "space-between", p: 2, flexWrap: "wrap", gap: 1 }}
        >
          <Button onClick={closeView}>Close</Button>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {application?.status === "pending" && (
              <>
                <Button
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => {
                    closeView();
                    if (application) openReject(application);
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={() => {
                    if (application) handleApprove(application);
                    closeView();
                  }}
                >
                  Approve
                </Button>
              </>
            )}

            {/* ✅ NEW — Create Lease from the dialog too */}
            {application?.status === "approved" && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Gavel />}
                onClick={() => {
                  const app = application;
                  closeView();
                  setLeaseApplication(app);
                }}
              >
                Create Lease
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          REJECT DIALOG
      ===================================================== */}

      <Dialog
        open={rejectOpen}
        onClose={closeReject}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle>Reject Application</DialogTitle>
        <Divider />

        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Provide a reason for rejection. The applicant will see this
              message.
            </Typography>

            <form
              id="reject-rental-application-form"
              onSubmit={handleSubmit(submitReject)}
            >
              <FormInput<RentalActionFormValues>
                name="rejectionReason"
                control={control}
                label="Rejection Reason"
                multiline
                rows={4}
              />
            </form>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={closeReject}>Cancel</Button>
          <Button
            type="submit"
            form="reject-rental-application-form"
            variant="contained"
            color="error"
          >
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          ✅ CREATE LEASE MODAL — rendered ONCE at the bottom
      ===================================================== */}

      {leaseApplication && (
        <CreateLeaseModal
          open
          onClose={() => setLeaseApplication(null)}
          application={leaseApplication}
        />
      )}
    </MainLayout>
  );
};

export default ManageRentalApplications;