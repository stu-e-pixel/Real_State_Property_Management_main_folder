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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  InputAdornment,
  Skeleton,
} from "@mui/material";

import {
  Visibility,
  Close,
  LocationOn,
  Bed,
  Bathtub,
  SquareFoot,
  Refresh,
  Search,
  CheckCircle,
  Home,
  Email,
  Phone,
} from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";

import {
  getMyApprovedProperties,
  getPropertyById,
  clearSelectedProperty,
} from "../../features/property/propertySlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type { PopulatedUser } from "../../typescript/type/property.types";
import { IndianRupee } from "lucide-react";

const PURPOSES = [
  { value: "", label: "All Purposes" },
  { value: "Sale", label: "For Sale" },
  { value: "Rent", label: "For Rent" },
];

const isPopulatedUser = (
  val: string | PopulatedUser | null | undefined,
): val is PopulatedUser => !!val && typeof val === "object" && "name" in val;

const AgentApprovedProperties: React.FC = () => {
  const dispatch = useAppDispatch();

  const { properties, property, pagination, loading } = useAppSelector(
    (state) => state.property,
  );

  const agent = useAppSelector((state) => state.auth.user);

  const [page, setPage] = useState<number>(0);

  const [rowsPerPage, setRowsPerPage] = useState<number>(9);

  const [search, setSearch] = useState<string>("");

  const [purpose, setPurpose] = useState<string>("");

  const [viewOpen, setViewOpen] = useState<boolean>(false);

  const fetchProperties = useCallback((): void => {
    dispatch(
      getMyApprovedProperties({
        page: page + 1,
        limit: rowsPerPage,

        ...(search && {
          search,
        }),

        ...(purpose && {
          purpose,
        }),
      }),
    );
  }, [dispatch, page, rowsPerPage, search, purpose]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    setPage(0);
  };

  const handleReset = (): void => {
    setSearch("");
    setPurpose("");
    setPage(0);
  };

  const handleView = async (id: string): Promise<void> => {
    await dispatch(getPropertyById(id));

    setViewOpen(true);
  };

  const closeView = (): void => {
    setViewOpen(false);

    dispatch(clearSelectedProperty());
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
            mb: 2,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              src={agent?.image}
              sx={{
                width: 56,
                height: 56,
                fontSize: 24,
              }}
            >
              {agent?.name?.charAt(0)}
            </Avatar>

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                }}
              >
                My Approved Properties
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                }}
              >
                Properties assigned to you that have been approved
              </Typography>
            </Box>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
            }}
          >
            <Chip
              icon={<CheckCircle />}
              label={`${pagination?.total ?? 0} Approved`}
              color="success"
              variant="outlined"
            />
          </Stack>
        </Box>

        <Divider
          sx={{
            mb: 3,
          }}
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
            alignItems: "center",
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
          </Box>

          <FormControl
            size="small"
            sx={{
              minWidth: 180,
            }}
          >
            <InputLabel>Purpose</InputLabel>

            <Select
              value={purpose}
              onChange={(e) => {
                setPurpose(e.target.value);
                setPage(0);
              }}
              label="Purpose"
            >
              {PURPOSES.map((p) => (
                <MenuItem key={p.value} value={p.value}>
                  {p.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleReset}
          >
            Reset
          </Button>
        </Box>

        {loading && properties.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Box
                key={i}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 12px)",
                    md: "calc(33.333% - 16px)",
                  },
                }}
              >
                <Skeleton
                  variant="rounded"
                  height={340}
                  sx={{
                    borderRadius: 3,
                  }}
                />
              </Box>
            ))}
          </Box>
        ) : properties.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
            }}
          >
            <Home
              sx={{
                fontSize: 80,
                color: "text.disabled",
                mb: 2,
              }}
            />

            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                mb: 1,
              }}
            >
              No approved properties yet
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mb: 2,
              }}
            >
              Properties assigned to you will appear here once an admin approves
              them.
            </Typography>

            {(search || purpose) && (
              <Button variant="outlined" onClick={handleReset}>
                Clear Filters
              </Button>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {properties.map((p) => (
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
                    transition: "transform 0.2s, box-shadow 0.2s",

                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                >
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

                    <Chip
                      label="Approved"
                      icon={<CheckCircle fontSize="small" />}
                      size="small"
                      color="success"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <CardContent
                    sx={{
                      flexGrow: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      noWrap
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {p.title}
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
                      {p.description}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <IndianRupee fontSize="small" />

                      <Typography
                        variant="h6"
                        sx={{
                          color: "success.main",
                          fontWeight: 700,
                        }}
                      >
                        {p.price.toLocaleString()}
                      </Typography>
                    </Stack>

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

                        <Box
                          sx={{
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              display: "block",
                            }}
                          >
                            Owner
                          </Typography>

                          <Typography
                            variant="caption"
                            noWrap
                            sx={{
                              fontWeight: 600,
                              display: "block",
                            }}
                          >
                            {p.owner.name}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </CardContent>

                  <Divider />

                  <CardActions
                    sx={{
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        pl: 1,
                      }}
                    >
                      {new Date(p.createdAt).toLocaleDateString()}
                    </Typography>

                    <Tooltip title="View details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleView(p._id)}
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

        {pagination && properties.length > 0 && (
          <TablePagination
            component="div"
            count={pagination.total}
            page={page}
            onPageChange={(_e, newPage) => {
              setPage(newPage);
            }}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));

              setPage(0);
            }}
            rowsPerPageOptions={[6, 9, 12, 24]}
          />
        )}
      </Paper>

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
            <Box
              sx={{
                textAlign: "center",
                py: 4,
              }}
            >
              <Skeleton
                variant="rounded"
                height={200}
                sx={{
                  mb: 2,
                }}
              />

              <Skeleton variant="text" width="60%" />

              <Skeleton variant="text" width="40%" />
            </Box>
          ) : property ? (
            <>
              {property.images?.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mb: 2,
                    overflow: "auto",
                  }}
                >
                  {property.images.map((img, i) => (
                    <Box
                      key={i}
                      component="img"
                      src={img.image}
                      alt={`${property.title}-${i}`}
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

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                {property.title}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 1,
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    {property.description}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Type
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {property.propertyType}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Purpose
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {property.purpose}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Price
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    ₹{property.price.toLocaleString()}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Area
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {property.area} sqft
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Bedrooms
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {property.bedrooms}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Bathrooms
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {property.bathrooms}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Furnishing
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {property.furnishingStatus}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Status
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {property.status}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Approval
                  </Typography>

                  <Box
                    sx={{
                      mt: 0.5,
                    }}
                  >
                    <Chip
                      label="Approved"
                      icon={<CheckCircle fontSize="small" />}
                      color="success"
                      size="small"
                    />
                  </Box>
                </Box>

                {isPopulatedUser(property.owner) && (
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Divider
                      sx={{
                        my: 1,
                      }}
                    />

                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      Owner
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
                        src={property.owner.image}
                        sx={{
                          width: 44,
                          height: 44,
                        }}
                      >
                        {property.owner.name?.charAt(0)}
                      </Avatar>

                      <Box
                        sx={{
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {property.owner.name}
                        </Typography>

                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{
                            alignItems: "center",
                            flexWrap: "wrap",
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
                              sx={{
                                color: "text.secondary",
                              }}
                            />

                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                              }}
                            >
                              {property.owner.email}
                            </Typography>
                          </Box>

                          {property.owner.phone && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Phone
                                fontSize="small"
                                sx={{
                                  color: "text.secondary",
                                }}
                              />

                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                }}
                              >
                                {property.owner.phone}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Box>
                    </Box>
                  </Box>
                )}

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
                      mt: 1,
                    }}
                  >
                    <LocationOn fontSize="small" color="action" />

                    <Typography variant="caption">
                      Coordinates: [{property.location.coordinates.join(", ")}]
                    </Typography>
                  </Box>
                </Box>

                {property.amenities?.length > 0 && (
                  <Box
                    sx={{
                      width: "100%",
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
                        gap: 1,
                        flexWrap: "wrap",
                        mt: 0.5,
                      }}
                    >
                      {property.amenities.map((a) => (
                        <Chip key={a} label={a} size="small" />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
            >
              Property not found.
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeView}>Close</Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default AgentApprovedProperties;
