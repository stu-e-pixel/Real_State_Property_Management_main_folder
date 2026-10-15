import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Divider,
  IconButton,
  Skeleton,
  TablePagination,
  useTheme,
  useMediaQuery,
  Drawer,
} from "@mui/material";

import {
  Refresh,
  FilterList,
  Close,
  Visibility,
  LocationOn,
  Bed,
  Bathtub,
  SquareFoot,
  Home,
  CheckCircle,
} from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import FavoriteButton from "./FavoriteButton";

import { getPublicApproved } from "../../features/property/propertySlice";
import { getMyFavorites } from "../../features/favorite/favoriteSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "../../hooks/useAppDispatch";

import type { Property } from "../../typescript/type/property.types";
import { IndianRupee } from "lucide-react";



const useDebounce = <T,>(value: T, delay = 500): T => {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};



const PropertySearch: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  

  const { properties, pagination, loading } = useAppSelector(
    (state) => state.property
  );

  const { user } = useAppSelector((state) => state.auth);



  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("search") ?? ""
  );

  const debouncedSearch = useDebounce(searchInput, 500);

  const [purposeInput, setPurposeInput] = useState(
    () => searchParams.get("purpose") ?? ""
  );

  const [propertyTypeInput, setPropertyTypeInput] = useState(
    () => searchParams.get("propertyType") ?? ""
  );

  const [furnishingStatus, setFurnishingStatus] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("createdAt-desc");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

 

  useEffect(() => {
    if (user?.role === "customer") {
      dispatch(getMyFavorites());
    }
  }, [dispatch, user?.role]);

  

  useEffect(() => {
    const [sortBy, sortOrder] = sort.split("-");

    dispatch(
      getPublicApproved({
        page: page + 1,
        limit: rowsPerPage,

        ...(debouncedSearch.trim() && {
          search: debouncedSearch.trim(),
        }),

        ...(purposeInput && { purpose: purposeInput }),

        ...(propertyTypeInput && {
          propertyType: propertyTypeInput,
        }),

        ...(furnishingStatus && { furnishingStatus }),

        ...(bedrooms && { bedrooms }),

        ...(minPrice && { minprice: minPrice }),

        ...(maxPrice && { maxprice: maxPrice }),

        sortBy,
        sortOrder,
      })
    );
  }, [
    dispatch,
    page,
    rowsPerPage,
    debouncedSearch,
    purposeInput,
    propertyTypeInput,
    furnishingStatus,
    bedrooms,
    minPrice,
    maxPrice,
    sort,
  ]);

  

  

  const handlePurposeChange = (value: string): void => {
    setPurposeInput(value);
    setPage(0);
  };

  const handlePropertyTypeChange = (value: string): void => {
    setPropertyTypeInput(value);
    setPage(0);
  };

  const handleReset = (): void => {
    setSearchInput("");
    setPurposeInput("");
    setPropertyTypeInput("");
    setFurnishingStatus("");
    setBedrooms("");
    setMinPrice("");
    setMaxPrice("");
    setSort("createdAt-desc");
    setPage(0);
    setRowsPerPage(12);
    setSearchParams({});
    setFilterDrawerOpen(false);
  };

  const handleView = (id: string): void => {
    navigate(`/user/properties/${id}`);
  };

  const handleApplyFilters = (): void => {
    setPage(0);

    const params = new URLSearchParams();

    if (searchInput.trim()) {
      params.set("search", searchInput.trim());
    }

    if (purposeInput) {
      params.set("purpose", purposeInput);
    }

    if (propertyTypeInput) {
      params.set("propertyType", propertyTypeInput);
    }

    setSearchParams(params);
    setFilterDrawerOpen(false);
  };

  

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      bgcolor: "#ffffff",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#0f766e",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#0f766e",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#0f766e",
    },
  };

 

  const FilterFields = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <FormControl fullWidth size="small" sx={fieldSx}>
        <InputLabel>Purpose</InputLabel>

        <Select
          value={purposeInput}
          label="Purpose"
          onChange={(event) =>
            handlePurposeChange(event.target.value)
          }
        >
          <MenuItem value="">All Purposes</MenuItem>
          <MenuItem value="Sale">For Sale</MenuItem>
          <MenuItem value="Rent">For Rent</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small" sx={fieldSx}>
        <InputLabel>Property Type</InputLabel>

        <Select
          value={propertyTypeInput}
          label="Property Type"
          onChange={(event) =>
            handlePropertyTypeChange(event.target.value)
          }
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="Apartment">Apartment</MenuItem>
          <MenuItem value="House">House</MenuItem>
          <MenuItem value="Villa">Villa</MenuItem>
          <MenuItem value="Land">Land</MenuItem>
          <MenuItem value="Office">Office</MenuItem>
          <MenuItem value="Shop">Shop</MenuItem>
          <MenuItem value="Warehouse">Warehouse</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small" sx={fieldSx}>
        <InputLabel>Furnishing</InputLabel>

        <Select
          value={furnishingStatus}
          label="Furnishing"
          onChange={(event) => {
            setFurnishingStatus(event.target.value);
            setPage(0);
          }}
        >
          <MenuItem value="">Any</MenuItem>
          <MenuItem value="Furnished">Furnished</MenuItem>
          <MenuItem value="Semi-Furnished">
            Semi-Furnished
          </MenuItem>
          <MenuItem value="Unfurnished">Unfurnished</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small" sx={fieldSx}>
        <InputLabel>Minimum Bedrooms</InputLabel>

        <Select
          value={bedrooms}
          label="Minimum Bedrooms"
          onChange={(event) => {
            setBedrooms(event.target.value);
            setPage(0);
          }}
        >
          <MenuItem value="">Any</MenuItem>

          {[1, 2, 3, 4, 5].map((number) => (
            <MenuItem key={number} value={String(number)}>
              {number}+
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        size="small"
        fullWidth
        type="number"
        label="Minimum Price"
        value={minPrice}
        onChange={(event) => {
          setMinPrice(event.target.value);
          setPage(0);
        }}
        sx={fieldSx}
        slotProps={{
          htmlInput: { min: 0 },
        }}
      />

      <TextField
        size="small"
        fullWidth
        type="number"
        label="Maximum Price"
        value={maxPrice}
        onChange={(event) => {
          setMaxPrice(event.target.value);
          setPage(0);
        }}
        sx={fieldSx}
        slotProps={{
          htmlInput: { min: 0 },
        }}
      />

      <Button
        variant="outlined"
        startIcon={<Refresh />}
        fullWidth
        onClick={handleReset}
        sx={{
          borderColor: "#cbd5e1",
          color: "#475569",
          borderRadius: 2,
          fontWeight: 700,
          textTransform: "none",
          py: 1,
          "&:hover": {
            borderColor: "#0f766e",
            color: "#0f766e",
            bgcolor: "#ecfdf5",
          },
        }}
      >
        Clear All Filters
      </Button>

      {isMobile && (
        <Button
          variant="contained"
          fullWidth
          onClick={handleApplyFilters}
          sx={{
            bgcolor: "#0f766e",
            borderRadius: 2,
            py: 1.2,
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { bgcolor: "#115e59" },
          }}
        >
          Apply Filters
        </Button>
      )}
    </Box>
  );



  return (
    <MainLayout>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f8fafc",
          px: { xs: 1.5, sm: 2, md: 3 },
          py: { xs: 2, md: 4 },
        }}
      >
        <Paper
          sx={{
            maxWidth: 1600,
            mx: "auto",
            p: { xs: 2, md: 4 },
            borderRadius: 4,
            bgcolor: "#ffffff",
            border: "1px solid #dbe7e4",
            boxShadow: "0 10px 35px rgba(15,23,42,0.05)",
          }}
        >
          
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              flexWrap: "wrap",
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: "#0f766e",
                  fontWeight: 800,
                  letterSpacing: 1.5,
                }}
              >
                DISCOVER YOUR NEXT HOME
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "#0f172a",
                  fontSize: { xs: "1.6rem", md: "2.1rem" },
                  mb: 0.7,
                }}
              >
                Search Properties
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#64748b" }}
              >
                Find properties that match your needs and budget.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Chip
                icon={<CheckCircle />}
                label={`${pagination?.total ?? 0} Results`}
                sx={{
                  bgcolor: "#ecfdf5",
                  color: "#047857",
                  border: "1px solid #a7f3d0",
                  fontWeight: 700,
                  "& .MuiChip-icon": { color: "#059669" },
                }}
              />

              {isMobile && (
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setFilterDrawerOpen(true)}
                  sx={{
                    borderColor: "#0f766e",
                    color: "#0f766e",
                    borderRadius: 2,
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  Filters
                </Button>
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 3, borderColor: "#e2e8f0" }} />

          
          

          

        
          <Box
            sx={{
              display: "flex",
              gap: 3,
              alignItems: "flex-start",
            }}
          >
          
            {!isMobile && (
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  width: 280,
                  flexShrink: 0,
                  position: "sticky",
                  top: 90,
                  borderColor: "#dbe7e4",
                  bgcolor: "#fcfefd",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#d1fae5",
                      color: "#047857",
                    }}
                  >
                    <FilterList />
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 800, color: "#0f172a" }}
                    >
                      Filters
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{ color: "#64748b" }}
                    >
                      Refine your results
                    </Typography>
                  </Box>
                </Box>

                {FilterFields}
              </Paper>
            )}

           
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {loading && properties.length === 0 ? (
                
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                  }}
                >
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Box
                      key={item}
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
                        height={360}
                        sx={{ borderRadius: 3 }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : properties.length === 0 ? (
              
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                    px: 2,
                    borderRadius: 3,
                    border: "1px dashed #cbd5e1",
                    bgcolor: "#f8fafc",
                  }}
                >
                  <Box
                    sx={{
                      width: 90,
                      height: 90,
                      borderRadius: "50%",
                      bgcolor: "#ecfdf5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Home sx={{ fontSize: 44, color: "#0f766e" }} />
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      color: "#0f172a",
                      fontWeight: 800,
                      mb: 1,
                    }}
                  >
                    No Properties Found
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", mb: 2.5 }}
                  >
                    Try adjusting your filters or search query.
                  </Typography>

                  <Button
                    variant="contained"
                    onClick={handleReset}
                    sx={{
                      bgcolor: "#0f766e",
                      fontWeight: 700,
                      textTransform: "none",
                      "&:hover": { bgcolor: "#115e59" },
                    }}
                  >
                    Clear Filters
                  </Button>
                </Box>
              ) : (
                <>
                  
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 3,
                    }}
                  >
                    {properties.map((p: Property) => (
                      <Box
                        key={p._id}
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
                            overflow: "hidden",
                            border: "1px solid #e2e8f0",
                            boxShadow:
                              "0 4px 15px rgba(15,23,42,0.04)",
                            transition: "all 0.25s ease",
                            "&:hover": {
                              transform: "translateY(-5px)",
                              borderColor: "#a7f3d0",
                              boxShadow:
                                "0 14px 30px rgba(15,23,42,0.11)",
                            },
                          }}
                        >
                          
                          <Box
                            sx={{
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={
                                p.images?.[0]?.image ||
                                "https://via.placeholder.com/300x180?text=No+Image"
                              }
                              alt={p.title}
                              sx={{
                                height: 200,
                                objectFit: "cover",
                                transition: "transform 0.35s ease",
                                "&:hover": {
                                  transform: "scale(1.04)",
                                },
                              }}
                            />

                            <Chip
                              label={p.purpose}
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 12,
                                left: 12,
                                bgcolor:
                                  p.purpose === "Sale"
                                    ? "#0f766e"
                                    : "#7c3aed",
                                color: "#ffffff",
                                fontWeight: 700,
                              }}
                            />

                            <Chip
                              label={p.propertyType}
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                maxWidth: "55%",
                                bgcolor: "rgba(255,255,255,0.95)",
                                color: "#0f172a",
                                fontWeight: 700,
                                "& .MuiChip-label": {
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                },
                              }}
                            />

                            <Box
                              sx={{
                                position: "absolute",
                                bottom: 10,
                                right: 10,
                              }}
                            >
                              <FavoriteButton propertyId={p._id} />
                            </Box>
                          </Box>

                          
                          <CardContent
                            sx={{
                              flexGrow: 1,
                              p: 2.5,
                              "&:last-child": { pb: 2.5 },
                            }}
                          >
                            <Typography
                              variant="h6"
                              title={p.title}
                              sx={{
                                fontWeight: 800,
                                color: "#0f172a",
                                fontSize: "1.05rem",
                                mb: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {p.title}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                color: "#64748b",
                                lineHeight: 1.7,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                minHeight: "3.4em",
                                mb: 2,
                              }}
                            >
                              {p.description}
                            </Typography>

                           
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                mb: 2,
                                p: 1.3,
                                borderRadius: 2,
                                bgcolor: "#ecfdf5",
                              }}
                            >
                              <IndianRupee
                                fontSize="small"
                                color="#047857"
                              />

                              <Typography
                                variant="h6"
                                sx={{
                                  color: "#047857",
                                  fontWeight: 800,
                                  fontSize: "1.15rem",
                                }}
                              >
                                {Number(p.price).toLocaleString("en-IN")}
                              </Typography>
                            </Box>

                           
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                                flexWrap: "wrap",
                                mb: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  color: "#64748b",
                                }}
                              >
                                <Bed fontSize="small" />

                                <Typography
                                  variant="caption"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {p.bedrooms} Beds
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  color: "#64748b",
                                }}
                              >
                                <Bathtub fontSize="small" />

                                <Typography
                                  variant="caption"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {p.bathrooms} Baths
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  color: "#64748b",
                                }}
                              >
                                <SquareFoot fontSize="small" />

                                <Typography
                                  variant="caption"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {p.area} sqft
                                </Typography>
                              </Box>
                            </Box>

                            <Divider
                              sx={{ mb: 1.5, borderColor: "#edf2f7" }}
                            />

                          
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 0.7,
                              }}
                            >
                              <LocationOn
                                fontSize="small"
                                sx={{ color: "#0f766e", mt: 0.1 }}
                              />

                              <Typography
                                variant="caption"
                                sx={{
                                  color: "#64748b",
                                  lineHeight: 1.6,
                                  overflowWrap: "anywhere",
                                }}
                              >
                                {p.location?.coordinates
                                  ? `${p.location.coordinates[1]?.toFixed(4)}, ${p.location.coordinates[0]?.toFixed(4)}`
                                  : "Location unavailable"}
                              </Typography>
                            </Box>
                          </CardContent>

                          <Divider sx={{ borderColor: "#edf2f7" }} />

                       
                          <CardActions
                            sx={{
                              justifyContent: "flex-end",
                              p: 2,
                              bgcolor: "#fcfdfd",
                            }}
                          >
                            <Button
                              size="medium"
                              variant="contained"
                              startIcon={<Visibility />}
                              onClick={() => handleView(p._id)}
                              sx={{
                                bgcolor: "#0f766e",
                                borderRadius: 2,
                                px: 2,
                                fontWeight: 700,
                                textTransform: "none",
                                boxShadow: "none",
                                "&:hover": {
                                  bgcolor: "#115e59",
                                  boxShadow:
                                    "0 5px 12px rgba(15,118,110,0.2)",
                                },
                              }}
                            >
                              More Details
                            </Button>
                          </CardActions>
                        </Card>
                      </Box>
                    ))}
                  </Box>

                 
                  {pagination && (
                    <Box
                      sx={{
                        mt: 4,
                        borderTop: "1px solid #e2e8f0",
                        pt: 2,
                      }}
                    >
                      <TablePagination
                        component="div"
                        count={pagination.total}
                        page={page}
                        onPageChange={(_event, newPage) =>
                          setPage(newPage)
                        }
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(event) => {
                          setRowsPerPage(
                            parseInt(event.target.value, 10)
                          );
                          setPage(0);
                        }}
                        rowsPerPageOptions={[6, 12, 24, 48]}
                      />
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>

     
      <Drawer
        anchor="left"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "90vw", sm: 360 },
              maxWidth: 360,
              p: 3,
              bgcolor: "#ffffff",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "#0f172a" }}
          >
            Property Filters
          </Typography>

          <IconButton
            onClick={() => setFilterDrawerOpen(false)}
            aria-label="Close filters"
            sx={{
              bgcolor: "#f1f5f9",
              "&:hover": { bgcolor: "#d1fae5" },
            }}
          >
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {FilterFields}
      </Drawer>
    </MainLayout>
  );
};

export default PropertySearch;