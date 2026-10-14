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
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  Description,
  Close,
  Home,
  Visibility,
  Add,
  MoreVert,
  Edit,
  Block,
  Schedule,
  Timer,
  Email,
  Phone,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MainLayout from "../../components/layout/MainLayout";
import FormInput from "../../components/common/FormInput";
import {
  leaseSchema,
  updateLeaseSchema,
  terminateLeaseSchema,
} from "../../utils/validations";
import {
  getOwnerLeases,
  getAgentLeases,
  getLeaseById,
  createLease,
  updateLease,
  terminateLease,
  expireLease,
  clearSelectedLease,
} from "../../features/lease/leaseSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type {
  Lease,
  LeaseFormValues,
  UpdateLeaseFormValues,
  TerminateLeaseFormValues,
} from "../../typescript/type/lease.types";
import type { PopulatedUserLite } from "../../typescript/type/inquiry.types";
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

const isPopulatedUser = (
  val: PopulatedUserLite | string | null | undefined,
): val is PopulatedUserLite =>
  !!val && typeof val === "object" && "name" in val;

// Convert ISO date to datetime-local value
const pad = (n: number): string => String(n).padStart(2, "0");

const toInput = (iso: string): string => {
  const d = new Date(iso);

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
};

interface ManageLeasesProps {
  mode: "owner" | "agent";
}

const ManageLeases: React.FC<ManageLeasesProps> = ({ mode }) => {
  const dispatch = useAppDispatch();

  const { leases, lease, loading } = useAppSelector((state) => state.lease);

  const [tab, setTab] = useState<string>("all");
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [terminateOpen, setTerminateOpen] = useState<boolean>(false);

  const [editTarget, setEditTarget] = useState<Lease | null>(null);

  const [terminateTarget, setTerminateTarget] = useState<Lease | null>(null);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const [menuLease, setMenuLease] = useState<Lease | null>(null);

  const createForm = useForm<LeaseFormValues>({
    resolver: yupResolver(leaseSchema),
    defaultValues: {
      rentalApplication: "",
      startDate: "",
      endDate: "",
      monthlyRent: 0,
      securityDeposit: 0,
      agreementDocument: "",
    },
  });

  const editForm = useForm<UpdateLeaseFormValues>({
    resolver: yupResolver(updateLeaseSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      monthlyRent: 0,
      securityDeposit: 0,
      agreementDocument: "",
    },
  });

  const terminateForm = useForm<TerminateLeaseFormValues>({
    resolver: yupResolver(terminateLeaseSchema),
    defaultValues: {
      terminationReason: "",
    },
  });

  // ================= FETCH =================

  useEffect(() => {
    if (mode === "owner") {
      dispatch(getOwnerLeases());
    } else {
      dispatch(getAgentLeases());
    }

    return () => {
      dispatch(clearSelectedLease());
    };
  }, [dispatch, mode]);

  // ================= VIEW =================

  const handleView = async (id: string): Promise<void> => {
    await dispatch(getLeaseById(id));
    setViewOpen(true);
  };

  const closeView = (): void => {
    setViewOpen(false);
    dispatch(clearSelectedLease());
  };

  // ================= CREATE =================

  const openCreate = (): void => {
    createForm.reset({
      rentalApplication: "",
      startDate: "",
      endDate: "",
      monthlyRent: 0,
      securityDeposit: 0,
      agreementDocument: "",
    });

    setCreateOpen(true);
  };

  const closeCreate = (): void => {
    setCreateOpen(false);
    createForm.reset();
  };

  const submitCreate = async (data: LeaseFormValues): Promise<void> => {
    const result = await dispatch(
      createLease({
        rentalApplication: data.rentalApplication,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        monthlyRent: Number(data.monthlyRent),
        securityDeposit: Number(data.securityDeposit) || 0,
        agreementDocument: data.agreementDocument,
      }),
    );

    if (createLease.fulfilled.match(result)) {
      closeCreate();
    }
  };

  // ================= EDIT =================

  const openEdit = (l: Lease): void => {
    setEditTarget(l);

    editForm.reset({
      startDate: toInput(l.startDate),
      endDate: toInput(l.endDate),
      monthlyRent: l.monthlyRent,
      securityDeposit: l.securityDeposit,
      agreementDocument:
        typeof l.agreementDocument === "string"
          ? l.agreementDocument
          : (l.agreementDocument?.url ?? ""),
    });

    setEditOpen(true);
  };

  const closeEdit = (): void => {
    setEditOpen(false);
    setEditTarget(null);
    editForm.reset();
  };

  const submitEdit = async (data: UpdateLeaseFormValues): Promise<void> => {
    if (!editTarget) return;

    const result = await dispatch(
      updateLease({
        id: editTarget._id,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        monthlyRent: Number(data.monthlyRent),
        securityDeposit: Number(data.securityDeposit) || 0,
        agreementDocument: data.agreementDocument,
      }),
    );

    if (updateLease.fulfilled.match(result)) {
      closeEdit();
    }
  };

  // ================= TERMINATE =================

  const openTerminate = (l: Lease): void => {
    setTerminateTarget(l);

    terminateForm.reset({
      terminationReason: "",
    });

    setTerminateOpen(true);
  };

  const closeTerminate = (): void => {
    setTerminateOpen(false);
    setTerminateTarget(null);

    terminateForm.reset({
      terminationReason: "",
    });
  };

  const submitTerminate = async (
    data: TerminateLeaseFormValues,
  ): Promise<void> => {
    if (!terminateTarget) return;

    const result = await dispatch(
      terminateLease({
        id: terminateTarget._id,
        terminationReason: data.terminationReason,
      }),
    );

    if (terminateLease.fulfilled.match(result)) {
      closeTerminate();
    }
  };

  // ================= EXPIRE =================

  const handleExpire = (l: Lease): void => {
    if (window.confirm("Mark this lease as expired?")) {
      dispatch(
        expireLease({
          id: l._id,
        }),
      );
    }
  };

  // ================= MENU =================

  const openMenu = (e: React.MouseEvent<HTMLElement>, l: Lease): void => {
    setMenuAnchor(e.currentTarget);
    setMenuLease(l);
  };

  const closeMenu = (): void => {
    setMenuAnchor(null);
    setMenuLease(null);
  };

  // ================= FILTER =================

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
              {mode === "owner" ? "Leases" : "Assigned Leases"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {mode === "owner"
                ? "Lease agreements for your properties"
                : "Leases you manage as an agent"}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={`${counts.active} Active`}
              color="success"
              variant="outlined"
            />

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={openCreate}
            >
              Create Lease
            </Button>
          </Box>
        </Box>

        <Divider
          sx={{
            mb: 2,
          }}
        />

        {/* ================= TABS ================= */}

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

        {/* ================= CONTENT ================= */}

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
                  height={280}
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
                    {/* ================= TENANT ================= */}

                    {isPopulatedUser(l.tenant) && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 2,
                        }}
                      >
                        <Avatar
                          src={l.tenant.image}
                          sx={{
                            width: 40,
                            height: 40,
                          }}
                        >
                          {l.tenant.name?.charAt(0)}
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
                          >
                            {l.tenant.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "block",
                            }}
                          >
                            {l.tenant.email}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            ml: "auto",
                          }}
                        >
                          <Chip
                            label={l.status}
                            color={STATUS_COLORS[l.status] ?? "default"}
                            size="small"
                          />
                        </Box>
                      </Box>
                    )}

                    {/* ================= PROPERTY ================= */}

                    {isPopulatedProperty(l.property) && (
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
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {l.property.title}
                        </Typography>
                      </Box>
                    )}

                    {/* ================= LEASE INFO ================= */}

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
                        <Schedule fontSize="small" color="action" />

                        <Typography variant="caption">
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
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          ₹{l.monthlyRent.toLocaleString()}
                          /month
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

                        <Typography variant="caption">
                          Deposit: ₹{l.securityDeposit.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>

                    {/* ================= TERMINATION ================= */}

                    {l.terminationReason && (
                      <Alert
                        severity="error"
                        sx={{
                          mt: 1,
                          py: 0,
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
                      justifyContent: "space-between",
                    }}
                  >
                    <Tooltip title="View">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleView(l._id)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {l.status === "active" && (
                      <IconButton size="small" onClick={(e) => openMenu(e, l)}>
                        <MoreVert fontSize="small" />
                      </IconButton>
                    )}
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
            if (menuLease) {
              openEdit(menuLease);
            }

            closeMenu();
          }}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Edit Lease
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (menuLease) {
              openTerminate(menuLease);
            }

            closeMenu();
          }}
        >
          <ListItemIcon>
            <Block fontSize="small" />
          </ListItemIcon>
          Terminate Lease
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (menuLease) {
              handleExpire(menuLease);
            }

            closeMenu();
          }}
        >
          <ListItemIcon>
            <Schedule fontSize="small" />
          </ListItemIcon>
          Mark as Expired
        </MenuItem>
      </Menu>

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
            <Skeleton variant="rounded" height={240} />
          ) : lease ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* Tenant */}

              {isPopulatedUser(lease.tenant) && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tenant
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
                      src={lease.tenant.image}
                      sx={{
                        width: 44,
                        height: 44,
                      }}
                    >
                      {lease.tenant.name?.charAt(0)}
                    </Avatar>

                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {lease.tenant.name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
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
                          <Email fontSize="small" color="action" />

                          <Typography variant="caption">
                            {lease.tenant.email}
                          </Typography>
                        </Box>

                        {lease.tenant.phone && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Phone fontSize="small" color="action" />

                            <Typography variant="caption">
                              {lease.tenant.phone}
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

              {/* Monthly Rent */}

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Monthly Rent
                </Typography>

                <Typography variant="body1">
                  ₹{lease.monthlyRent.toLocaleString()}
                </Typography>
              </Box>

              {/* Security Deposit */}

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

              {/* Agreement */}

              {typeof lease.agreementDocument === "string"
                ? lease.agreementDocument && (
                    <Button
                      variant="outlined"
                      size="small"
                      href={lease.agreementDocument}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<Description />}
                      sx={{ alignSelf: "flex-start" }}
                    >
                      View Agreement
                    </Button>
                  )
                : lease.agreementDocument?.url && (
                    <Button
                      variant="outlined"
                      size="small"
                      href={lease.agreementDocument.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<Description />}
                      sx={{ alignSelf: "flex-start" }}
                    >
                      View Agreement
                    </Button>
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

      {/* ================= CREATE DIALOG ================= */}

      <Dialog
        open={createOpen}
        onClose={closeCreate}
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
        <DialogTitle>Create Lease</DialogTitle>

        <Divider />

        <DialogContent>
          <Box
            sx={{
              pt: 2,
            }}
          >
            <Alert
              severity="info"
              sx={{
                mb: 2,
              }}
            >
              Provide the ID of an <b>approved</b> rental application. The
              property must be for rent and not already leased.
            </Alert>

            <form
              id="create-lease-form"
              onSubmit={createForm.handleSubmit(submitCreate)}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <FormInput<LeaseFormValues>
                  name="rentalApplication"
                  control={createForm.control}
                  label="Rental Application ID"
                />

                <FormInput<LeaseFormValues>
                  name="startDate"
                  control={createForm.control}
                  label="Start Date"
                  type="datetime-local"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />

                <FormInput<LeaseFormValues>
                  name="endDate"
                  control={createForm.control}
                  label="End Date"
                  type="datetime-local"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />

                <FormInput<LeaseFormValues>
                  name="monthlyRent"
                  control={createForm.control}
                  label="Monthly Rent"
                  type="number"
                />

                <FormInput<LeaseFormValues>
                  name="securityDeposit"
                  control={createForm.control}
                  label="Security Deposit"
                  type="number"
                />

                <FormInput<LeaseFormValues>
                  name="agreementDocument"
                  control={createForm.control}
                  label="Agreement Document URL (optional)"
                />
              </Box>
            </form>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            gap: 1,
          }}
        >
          <Button onClick={closeCreate}>Cancel</Button>

          <Button variant="contained" type="submit" form="create-lease-form">
            Create
          </Button>
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
        <DialogTitle>Edit Lease</DialogTitle>

        <Divider />

        <DialogContent>
          <Box
            sx={{
              pt: 2,
            }}
          >
            <form
              id="edit-lease-form"
              onSubmit={editForm.handleSubmit(submitEdit)}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <FormInput<UpdateLeaseFormValues>
                  name="startDate"
                  control={editForm.control}
                  label="Start Date"
                  type="datetime-local"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />

                <FormInput<UpdateLeaseFormValues>
                  name="endDate"
                  control={editForm.control}
                  label="End Date"
                  type="datetime-local"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />

                <FormInput<UpdateLeaseFormValues>
                  name="monthlyRent"
                  control={editForm.control}
                  label="Monthly Rent"
                  type="number"
                />

                <FormInput<UpdateLeaseFormValues>
                  name="securityDeposit"
                  control={editForm.control}
                  label="Security Deposit"
                  type="number"
                />

                <FormInput<UpdateLeaseFormValues>
                  name="agreementDocument"
                  control={editForm.control}
                  label="Agreement Document URL"
                />
              </Box>
            </form>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            gap: 1,
          }}
        >
          <Button onClick={closeEdit}>Cancel</Button>

          <Button variant="contained" type="submit" form="edit-lease-form">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= TERMINATE DIALOG ================= */}

      <Dialog
        open={terminateOpen}
        onClose={closeTerminate}
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
        <DialogTitle>Terminate Lease</DialogTitle>

        <Divider />

        <DialogContent>
          <Box
            sx={{
              pt: 2,
            }}
          >
            <Alert
              severity="warning"
              sx={{
                mb: 2,
              }}
            >
              The property will be marked <b>Available</b> after termination.
              This action cannot be undone.
            </Alert>

            <form
              id="terminate-lease-form"
              onSubmit={terminateForm.handleSubmit(submitTerminate)}
            >
              <FormInput<TerminateLeaseFormValues>
                name="terminationReason"
                control={terminateForm.control}
                label="Termination Reason"
                multiline
                rows={3}
              />
            </form>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            gap: 1,
          }}
        >
          <Button onClick={closeTerminate}>Cancel</Button>

          <Button
            variant="contained"
            color="error"
            type="submit"
            form="terminate-lease-form"
          >
            Confirm Terminate
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default ManageLeases;
