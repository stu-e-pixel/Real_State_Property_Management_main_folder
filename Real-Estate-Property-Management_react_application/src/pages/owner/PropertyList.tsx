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
} from "@mui/material";

import {
  Add,
  Edit,
  Delete,
  CheckCircle,
  Visibility,
  LocationOn,
  Bed,
  Bathtub,
  SquareFoot,
  Close,
} from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import Loader from "../../components/common/Loader";

import {
  getAllProperties,
  softDeleteProperty,
  approveProperty,
  setFilters,
} from "../../features/property/propertySlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type { Property } from "../../typescript/type/property.types";

const PropertyList: React.FC = () => {
  const dispatch = useAppDispatch();

  const { properties, pagination, loading, filters } = useAppSelector(
    (state) => state.property,
  );

  const user = useAppSelector((state) => state.auth.user);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(9);
  const [titleInput, setTitleInput] = useState<string>("");

  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Property | null>(null);

  const isOwner = user?.role === "owner";
  const isAdmin = user?.role === "admin";

  
  const fetchData = useCallback((): void => {
    dispatch(
      getAllProperties({
        page: page + 1,
        limit: rowsPerPage,

        ...(titleInput.trim() && {
          propertyTitle: titleInput.trim(),
        }),

        ...(filters.minPrice && {
          minprice: filters.minPrice,
        }),

        ...(filters.maxPrice && {
          maxprice: filters.maxPrice,
        }),
      }),
    );
  }, [
    dispatch,
    page,
    rowsPerPage,
    titleInput,
    filters.minPrice,
    filters.maxPrice,
  ]);

  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  
  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

   
    setPage(0);
  };

  

  const handleApprove = async (id: string): Promise<void> => {
    const result = await dispatch(approveProperty(id));

    if (approveProperty.fulfilled.match(result)) {
      fetchData();
    }
  };

  const handleSoftDelete = async (id: string): Promise<void> => {
    const confirmed = window.confirm("Move this property to trash?");

    if (!confirmed) {
      return;
    }

    const result = await dispatch(softDeleteProperty(id));

    if (softDeleteProperty.fulfilled.match(result)) {
      fetchData();
    }
  };

  

  const openView = (property: Property): void => {
    setSelected(property);
    setViewOpen(true);
  };

  const closeView = (): void => {
    setViewOpen(false);
    setSelected(null);
  };

  

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
              Properties
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mt: 0.5,
              }}
            >
              {isOwner
                ? "Your listed properties"
                : isAdmin
                  ? "All properties in the system"
                  : "Browse available properties"}
            </Typography>
          </Box>

          {isOwner && (
            <Button
              variant="contained"
              startIcon={<Add />}
              href="/owner/properties/create"
            >
              New Property
            </Button>
          )}
        </Box>

      

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TextField
              placeholder="Search by title..."
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              size="small"
              sx={{
                minWidth: 260,
              }}
            />

            <Button type="submit" variant="outlined">
              Search
            </Button>
          </Box>

          <TextField
            placeholder="Min price"
            type="number"
            size="small"
            value={filters.minPrice}
            onChange={(e) =>
              dispatch(
                setFilters({
                  minPrice: e.target.value,
                }),
              )
            }
            sx={{
              width: 140,
            }}
          />

          <TextField
            placeholder="Max price"
            type="number"
            size="small"
            value={filters.maxPrice}
            onChange={(e) =>
              dispatch(
                setFilters({
                  maxPrice: e.target.value,
                }),
              )
            }
            sx={{
              width: 140,
            }}
          />

          <Button variant="outlined" onClick={fetchData}>
            Apply
          </Button>
        </Box>

      

        {loading ? (
          <Loader message="Loading properties..." />
        ) : properties.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
              }}
            >
              No properties found.
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
            {properties.map((property) => (
              <Box
                key={property._id}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 12px)",
                    md: "calc(33.333% - 16px)",
                  },
                  display: "flex",
                }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* IMAGE */}

                  <CardMedia
                    component="img"
                    height="180"
                    image={
                      property.images?.[0]?.image ||
                      "https://via.placeholder.com/300x180"
                    }
                    alt={property.title}
                  />

                  {/* CONTENT */}

                  <CardContent
                    sx={{
                      flexGrow: 1,
                    }}
                  >
                   

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Chip
                        label={property.purpose}
                        size="small"
                        color={
                          property.purpose === "Sale" ? "primary" : "secondary"
                        }
                      />

                      <Chip
                        label={property.approvalStatus}
                        size="small"
                        color={
                          property.approvalStatus === "Approved"
                            ? "success"
                            : property.approvalStatus === "rejected"
                              ? "error"
                              : "warning"
                        }
                      />
                    </Box>

                  

                    <Typography
                      variant="h6"
                      noWrap
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {property.title}
                    </Typography>

                 

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        mb: 1,
                      }}
                    >
                      {property.description}
                    </Typography>

                   

                    <Typography
                      variant="h6"
                      sx={{
                        color: "primary.main",
                        fontWeight: 700,
                      }}
                    >
                      ₹{property.price.toLocaleString()}
                    </Typography>

                   

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mt: 1,
                        flexWrap: "wrap",
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

                        <Typography variant="caption">
                          {property.bedrooms}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Bathtub fontSize="small" color="action" />

                        <Typography variant="caption">
                          {property.bathrooms}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <SquareFoot fontSize="small" color="action" />

                        <Typography variant="caption">
                          {property.area} sqft
                        </Typography>
                      </Box>
                    </Box>

                    

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 1,
                      }}
                    >
                      <LocationOn fontSize="small" color="action" />

                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                        }}
                      >
                        {property.location.coordinates[1].toFixed(3)},{" "}
                        {property.location.coordinates[0].toFixed(3)}
                      </Typography>
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
                        onClick={() => openView(property)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      

                      {isAdmin && property.approvalStatus === "Pending" && (
                        <Tooltip title="Approve">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleApprove(property._id)}
                          >
                            <CheckCircle fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      

                      {isOwner && (
                        <>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="primary"
                              href={`/owner/properties/edit/${property._id}`}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleSoftDelete(property._id)}
                            >
                              <Delete fontSize="small" />
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

  

      <Dialog open={viewOpen} onClose={closeView} maxWidth="md" fullWidth>
        {selected && (
          <>
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontWeight: 700,
                }}
              >
                {selected.title}
              </Typography>

              <IconButton onClick={closeView} size="small">
                <Close />
              </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent>


              {selected.images?.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mb: 3,
                    overflowX: "auto",
                    pb: 1,
                  }}
                >
                  {selected.images.map((image, index) => (
                    <Box
                      key={`${image.image}-${index}`}
                      component="img"
                      src={image.image}
                      alt={`${selected.title}-${index}`}
                      sx={{
                        width: 200,
                        height: 140,
                        objectFit: "cover",
                        borderRadius: 2,
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </Box>
              )}



              <Box
                sx={{
                  mb: 3,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Description
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  {selected.description}
                </Typography>
              </Box>


              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 8px)",
                    },
                  }}
                >
                  <DetailItem label="Type" value={selected.propertyType} />
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 8px)",
                    },
                  }}
                >
                  <DetailItem label="Purpose" value={selected.purpose} />
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 8px)",
                    },
                  }}
                >
                  <DetailItem
                    label="Price"
                    value={`₹${selected.price.toLocaleString()}`}
                  />
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 8px)",
                    },
                  }}
                >
                  <DetailItem label="Area" value={`${selected.area} sqft`} />
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 8px)",
                    },
                  }}
                >
                  <DetailItem label="Bedrooms" value={selected.bedrooms} />
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 8px)",
                    },
                  }}
                >
                  <DetailItem label="Bathrooms" value={selected.bathrooms} />
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 8px)",
                    },
                  }}
                >
                  <DetailItem
                    label="Furnishing"
                    value={selected.furnishingStatus}
                  />
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 8px)",
                    },
                  }}
                >
                  <DetailItem label="Status" value={selected.status} />
                </Box>
              </Box>

            

              {selected.amenities?.length > 0 && (
                <Box
                  sx={{
                    mt: 3,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Amenities
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                      mt: 1,
                    }}
                  >
                    {selected.amenities.map((amenity) => (
                      <Chip key={amenity} label={amenity} size="small" />
                    ))}
                  </Box>
                </Box>
              )}
            </DialogContent>

            <DialogActions>
              <Button onClick={closeView}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </MainLayout>
  );
};

/*
 * ============================================================
 * SMALL REUSABLE DETAIL COMPONENT
 * ============================================================
 */

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

export default PropertyList;
