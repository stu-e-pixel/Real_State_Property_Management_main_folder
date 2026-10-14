import React, { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  Paper,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  TextField,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TablePagination,
  Stack,
  Avatar,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";

import {
  CheckCircle,
  Visibility,
  Close,
  LocationOn,
  Bed,
  Bathtub,
  SquareFoot,
  Refresh,
  Delete,
  DeleteForever,
  RestoreFromTrash,
} from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import Loader from "../../components/common/Loader";

import {
  getAllProperties,
  approveProperty,
  softDeleteProperty,
  permanentDeleteProperty,
  getPropertyById,
  clearSelectedProperty,
} from "../../features/property/propertySlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type {
  Property,
  PopulatedUser,
} from "../../typescript/type/property.types";
import { IndianRupee } from "lucide-react";

type TabValue = "Pending" | "Approved" | "rejected" | "all";

const TABS: { value: TabValue; label: string }[] = [
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
];

const isPopulatedUser = (
  val: string | PopulatedUser | null | undefined,
): val is PopulatedUser => !!val && typeof val === "object" && "name" in val;

const PropertyApproval: React.FC = () => {
  const dispatch = useAppDispatch();

  const { properties, property, pagination, loading } = useAppSelector(
    (state) => state.property,
  );

  // ------------------------------------------------
  // State
  // ------------------------------------------------

  const [tab, setTab] = useState<TabValue>("Pending");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(9);
  const [search, setSearch] = useState<string>("");

  const [viewOpen, setViewOpen] = useState<boolean>(false);

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);

  const [permanentDelete, setPermanentDelete] = useState<boolean>(false);

  // ------------------------------------------------
  // Fetch properties
  // ------------------------------------------------

  const fetchProperties = useCallback((): void => {
    dispatch(
      getAllProperties({
        page: page + 1,
        limit: rowsPerPage,
        ...(search.trim() && {
          propertyTitle: search.trim(),
        }),
      }),
    );
  }, [dispatch, page, rowsPerPage, search]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // ------------------------------------------------
  // Search
  // ------------------------------------------------

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Fetch will happen automatically because page changes.
    setPage(0);
  };

  // ------------------------------------------------
  // Actions
  // ------------------------------------------------

  const handleApprove = (id: string): void => {
    if (window.confirm("Approve this property?")) {
      dispatch(approveProperty(id));
    }
  };

  const handleView = async (id: string): Promise<void> => {
    await dispatch(getPropertyById(id));
    setViewOpen(true);
  };

  const closeView = (): void => {
    setViewOpen(false);
    dispatch(clearSelectedProperty());
  };

  const openDelete = (p: Property, permanent = false): void => {
    setDeleteTarget(p);
    setPermanentDelete(permanent);
    setDeleteOpen(true);
  };

  const confirmDelete = (): void => {
    if (!deleteTarget) return;

    if (permanentDelete) {
      dispatch(permanentDeleteProperty(deleteTarget._id));
    } else {
      dispatch(softDeleteProperty(deleteTarget._id));
    }

    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  // ------------------------------------------------
  // Filtering
  // ------------------------------------------------

  const filtered = properties.filter((p) => {
    if (tab === "all") return true;

    return p.approvalStatus === tab;
  });

  const counts = {
    Pending: properties.filter((p) => p.approvalStatus === "Pending").length,

    Approved: properties.filter((p) => p.approvalStatus === "Approved").length,

    rejected: properties.filter((p) => p.approvalStatus === "rejected").length,
  };

  // ------------------------------------------------
  // Render
  // ------------------------------------------------

  return (
    <MainLayout>
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography>Property Approvals</Typography>

            <Typography variant="body2" color="text.secondary">
              Review, approve, or remove property listings
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={`${counts.Pending} Pending`}
              color="warning"
              variant="outlined"
            />

            <Chip
              label={`${counts.Approved} Approved`}
              color="success"
              variant="outlined"
            />

            <Chip
              label={`${counts.rejected} Rejected`}
              color="error"
              variant="outlined"
            />
          </Stack>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* =====================================================
            TABS
        ===================================================== */}

        <Tabs
          value={tab}
          onChange={(_event, value: TabValue) => {
            setTab(value);
            setPage(0);
          }}
          sx={{ mb: 2 }}
        >
          {TABS.map((item) => (
            <Tab key={item.value} value={item.value} label={item.label} />
          ))}
        </Tabs>

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <Box component="form" onSubmit={handleSearch}>
            <TextField
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{
                minWidth: 280,
              }}
            />
          </Box>

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchProperties}
          >
            Refresh
          </Button>
        </Box>

        {/* =====================================================
            PROPERTY LIST
        ===================================================== */}

        {loading && properties.length === 0 ? (
          <Loader message="Loading properties..." />
        ) : filtered.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No {tab !== "all" ? tab.toLowerCase() : ""} properties found.
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
            {filtered.map((p) => (
              <Box
                key={p._id}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 12px)",
                    md: "calc(33.333% - 16px)",
                  },
                }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  {/* IMAGE */}

                  <Box
                    sx={{
                      position: "relative",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={
                        p.images?.[0]?.image ||
                        "https://via.placeholder.com/300x180?text=No+Image"
                      }
                      alt={p.title}
                    />

                    <Chip
                      label={p.approvalStatus}
                      size="small"
                      color={
                        p.approvalStatus === "Approved"
                          ? "success"
                          : p.approvalStatus === "rejected"
                            ? "error"
                            : "warning"
                      }
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        fontWeight: 600,
                      }}
                    />

                    <Chip
                      label={p.purpose}
                      size="small"
                      color={p.purpose === "Sale" ? "primary" : "secondary"}
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  {/* CONTENT */}

                  <CardContent
                    sx={{
                      flexGrow: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }} noWrap>
                      {p.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        mb: 1,
                      }}
                    >
                      {p.description}
                    </Typography>

                    {/* PRICE */}

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        mb: 1,
                        alignItems: "center",
                      }}
                    >
                      <IndianRupee
                        fontSize="small"
                      />

                      <Typography
                        variant="h6"
                        color="success.main"
                        sx={{ fontWeight: 700 }}
                      >
                        {p.price.toLocaleString()}
                      </Typography>
                    </Stack>

                    {/* PROPERTY FEATURES */}

                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        flexWrap: "wrap",
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Bed fontSize="small" color="action" />

                        <Typography variant="caption">{p.bedrooms}</Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Bathtub fontSize="small" color="action" />

                        <Typography variant="caption">{p.bathrooms}</Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <SquareFoot fontSize="small" color="action" />

                        <Typography variant="caption">{p.area} sqft</Typography>
                      </Box>
                    </Box>

                    {/* OWNER */}

                    {isPopulatedUser(p.owner) && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 1,
                          p: 1,
                          bgcolor: "#f9f9f9",
                          borderRadius: 1,
                        }}
                      >
                        <Avatar
                          src={p.owner.image}
                          sx={{
                            width: 28,
                            height: 28,
                          }}
                        >
                          {p.owner.name?.charAt(0)}
                        </Avatar>

                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block" }}
                          >
                            Owner
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 700 }}
                          >
                            {p.owner.name}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* REJECTION REASON */}

                    {p.rejectionReason && (
                      <Alert
                        severity="error"
                        sx={{
                          mt: 1,
                          py: 0,
                        }}
                      >
                        <Typography variant="caption">
                          <b>Rejected:</b> {p.rejectionReason}
                        </Typography>
                      </Alert>
                    )}
                  </CardContent>

                  <Divider />

                  {/* ACTIONS */}

                  <CardActions
                    sx={{
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Tooltip title="View details">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleView(p._id)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Soft delete">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => openDelete(p, false)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Permanent delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => openDelete(p, true)}
                        >
                          <DeleteForever fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {p.approvalStatus === "Pending" && (
                      <Tooltip title="Approve">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleApprove(p._id)}
                        >
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        {pagination && (
          <TablePagination
            component="div"
            count={pagination.total}
            page={page}
            onPageChange={(_event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[6, 9, 12, 24]}
          />
        )}
      </Paper>

      {/* =====================================================
          VIEW DIALOG
      ===================================================== */}

      <Dialog open={viewOpen} onClose={closeView} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Property Details
          <IconButton onClick={closeView} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          {loading && !property ? (
            <Loader message="Loading property..." />
          ) : property ? (
            <>
              {/* IMAGES */}

              {property.images?.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mb: 2,
                    overflowX: "auto",
                  }}
                >
                  {property.images.map((img, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={img.image}
                      alt={`${property.title}-${index}`}
                      sx={{
                        width: 220,
                        height: 150,
                        objectFit: "cover",
                        borderRadius: 2,
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </Box>
              )}

              <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                {property.title}
              </Typography>

              {/* DETAILS */}

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 1,
                }}
              >
                {/* DESCRIPTION */}

                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {property.description}
                  </Typography>
                </Box>

                {/* TYPE */}

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Type
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {property.propertyType}
                  </Typography>
                </Box>

                {/* PURPOSE */}

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Purpose
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {property.purpose}
                  </Typography>
                </Box>

                {/* PRICE */}

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Price
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ₹{property.price.toLocaleString()}
                  </Typography>
                </Box>

                {/* AREA */}

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Area
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {property.area} sqft
                  </Typography>
                </Box>

                {/* BEDROOMS */}

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Bedrooms
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {property.bedrooms}
                  </Typography>
                </Box>

                {/* BATHROOMS */}

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Bathrooms
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {property.bathrooms}
                  </Typography>
                </Box>

                {/* FURNISHING */}

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Furnishing
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {property.furnishingStatus}
                  </Typography>
                </Box>

                {/* STATUS */}

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {property.status}
                  </Typography>
                </Box>

                {/* APPROVAL */}

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Approval
                  </Typography>

                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={property.approvalStatus}
                      color={
                        property.approvalStatus === "Approved"
                          ? "success"
                          : property.approvalStatus === "rejected"
                            ? "error"
                            : "warning"
                      }
                      size="small"
                    />
                  </Box>
                </Box>

                {/* OWNER */}

                {isPopulatedUser(property.owner) && (
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Divider sx={{ my: 1 }} />

                    <Typography variant="caption" color="text.secondary">
                      Owner
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Avatar
                        src={property.owner.image}
                        sx={{
                          width: 36,
                          height: 36,
                        }}
                      >
                        {property.owner.name?.charAt(0)}
                      </Avatar>

                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {property.owner.name}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          {property.owner.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* AGENT */}

                {isPopulatedUser(property.agentId) && (
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Assigned Agent
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Avatar
                        src={property.agentId.image}
                        sx={{
                          width: 36,
                          height: 36,
                        }}
                      >
                        {property.agentId.name?.charAt(0)}
                      </Avatar>

                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {property.agentId.name}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          {property.agentId.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* REJECTION REASON */}

                {property.rejectionReason && (
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Alert severity="error">
                      <b>Rejection reason:</b> {property.rejectionReason}
                    </Alert>
                  </Box>
                )}

                {/* LOCATION */}

                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <LocationOn fontSize="small" color="action" />

                    <Typography variant="caption">
                      Coordinates: [{property.location.coordinates.join(", ")}]
                    </Typography>
                  </Box>
                </Box>

                {/* AMENITIES */}

                {property.amenities?.length > 0 && (
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Amenities
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        mt: 0.5,
                      }}
                    >
                      {property.amenities.map((amenity) => (
                        <Chip key={amenity} label={amenity} size="small" />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Property not found.
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          {property?.approvalStatus === "Pending" && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircle />}
              onClick={() => {
                handleApprove(property._id);
                closeView();
              }}
            >
              Approve
            </Button>
          )}

          <Button onClick={closeView}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          DELETE DIALOG
      ===================================================== */}

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {permanentDelete ? (
            <DeleteForever color="error" />
          ) : (
            <RestoreFromTrash color="warning" />
          )}

          {permanentDelete
            ? "Permanently Delete Property"
            : "Move Property to Trash"}
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Alert severity={permanentDelete ? "error" : "warning"}>
            {permanentDelete
              ? "This action CANNOT be undone. All images will be destroyed from Cloudinary and the property will be erased from the database."
              : "This property will be soft-deleted. Owners/admins can no longer see it, but it can still be restored."}
          </Alert>

          {deleteTarget && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Property
              </Typography>

              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {deleteTarget.title}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>

          <Button
            variant="contained"
            color={permanentDelete ? "error" : "warning"}
            startIcon={
              permanentDelete ? <DeleteForever /> : <RestoreFromTrash />
            }
            onClick={confirmDelete}
          >
            {permanentDelete ? "Delete Permanently" : "Move to Trash"}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default PropertyApproval;
