import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  Divider,
  TablePagination,
  Skeleton,
} from "@mui/material";

import {
  Visibility,
  LocationOn,
  Bed,
  Bathtub,
  SquareFoot,
  CheckCircle,
  Home,
} from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";

import { getPublicApproved } from "../../features/property/propertySlice";
import { getMyFavorites } from "../../features/favorite/favoriteSlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type { Property } from "../../typescript/type/property.types";

import FavoriteButton from "./FavoriteButton";

const CustomerProperty: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux state
  const { properties, pagination, loading } = useAppSelector(
    (state) => state.property
  );

  const { user } = useAppSelector((state) => state.auth);

  // Search state
  

  // Pagination state
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(12);

  // Fetch approved properties
  useEffect(() => {
    dispatch(
      getPublicApproved({
        page: page + 1,
        limit: rowsPerPage,
        sortBy: "createdAt",
        sortOrder: "desc",
      })
    );
  }, [dispatch, page, rowsPerPage]);

  // Fetch customer's favorites
  useEffect(() => {
    if (user?.role === "customer") {
      dispatch(getMyFavorites());
    }
  }, [dispatch, user?.role]);

  // ✅ FIXED: Navigate to search results with "search" param (not "q")
  

  // Navigate to property details
  const handleView = (id: string): void => {
    navigate(`/user/properties/${id}`);
  };

  return (
    <MainLayout>
      <Paper
  sx={{
    p: { xs: 2, md: 4 },
    borderRadius: 4,
    bgcolor: "#ffffff",
    border: "1px solid #dbe7e4",
    boxShadow: "0 10px 35px rgba(15, 23, 42, 0.06)",
  }}
>
  {/* HERO BANNER */}
  <Box
    sx={{
      position: "relative",
      width: "100%",
      height: { xs: 300, md: 420 },
      borderRadius: 3,
      overflow: "hidden",
      mb: 5,
      bgcolor: "#0f172a",
    }}
  >
    <Box
      component="img"
      src="/Frame1.png"
      alt="Beautiful house"
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      }}
    />

    {/* Dark gradient overlay */}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(90deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.65) 50%, rgba(15,23,42,0.12) 100%)",
      }}
    />

    {/* Hero content */}
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: { xs: "6%", md: "8%" },
        right: { xs: "6%", md: "30%" },
        transform: "translateY(-50%)",
        color: "#ffffff",
      }}
    >
      <Chip
        label="FIND YOUR PERFECT PLACE"
        size="small"
        sx={{
          mb: 2,
          bgcolor: "rgba(16,185,129,0.18)",
          color: "#a7f3d0",
          border: "1px solid rgba(167,243,208,0.45)",
          fontWeight: 700,
          letterSpacing: 1,
        }}
      />

      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          lineHeight: 1.15,
          fontSize: { xs: "2rem", sm: "2.6rem", md: "3.5rem" },
          mb: 2,
          maxWidth: 650,
        }}
      >
        Find Your Dream Home
      </Typography>

      <Typography
        sx={{
          color: "#e2e8f0",
          fontSize: { xs: "0.9rem", md: "1.05rem" },
          lineHeight: 1.8,
          maxWidth: 460,
          mb: 3,
        }}
      >
        Discover thoughtfully selected properties and find a place
        that perfectly matches your lifestyle.
      </Typography>

      <Button
        variant="contained"
        onClick={() =>
          document
            .getElementById("available-properties")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        sx={{
          bgcolor: "#10b981",
          color: "#ffffff",
          px: 3.5,
          py: 1.3,
          borderRadius: 2,
          fontWeight: 700,
          textTransform: "none",
          boxShadow: "0 8px 20px rgba(16,185,129,0.25)",
          "&:hover": {
            bgcolor: "#059669",
            transform: "translateY(-2px)",
          },
          transition: "all 0.2s ease",
        }}
      >
        Explore Properties
      </Button>
    </Box>
  </Box>

  {/* HEADER */}
  <Box
    id="available-properties"
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: { xs: "flex-start", sm: "center" },
      flexWrap: "wrap",
      gap: 2,
      mb: 3,
      scrollMarginTop: "90px",
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
        EXPLORE REAL ESTATE
      </Typography>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: "#0f172a",
          fontSize: { xs: "1.6rem", md: "2rem" },
          mb: 0.7,
        }}
      >
        Available Properties
      </Typography>

      <Typography variant="body2" sx={{ color: "#64748b" }}>
        Browse approved listings and discover your next home.
      </Typography>
    </Box>

    <Chip
      icon={<CheckCircle />}
      label={`${pagination?.total ?? 0} Approved`}
      sx={{
        bgcolor: "#ecfdf5",
        color: "#047857",
        border: "1px solid #a7f3d0",
        fontWeight: 700,
        px: 1,
        py: 2.2,
        "& .MuiChip-icon": { color: "#059669" },
      }}
    />
  </Box>

  <Divider sx={{ mb: 4, borderColor: "#e2e8f0" }} />

  {/* LOADING STATE */}
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
            height={380}
            sx={{ borderRadius: 3 }}
          />
        </Box>
      ))}
    </Box>
  ) : properties.length === 0 ? (
    /* EMPTY STATE */
    <Box
      sx={{
        textAlign: "center",
        py: { xs: 7, md: 10 },
        px: 2,
        border: "1px dashed #cbd5e1",
        borderRadius: 3,
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
          mb: 2.5,
        }}
      >
        <Home sx={{ fontSize: 44, color: "#0f766e" }} />
      </Box>

      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}
      >
        No Properties Available
      </Typography>

      <Typography variant="body2" sx={{ color: "#64748b" }}>
        Approved property listings will appear here when available.
      </Typography>
    </Box>
  ) : (
    <>
      {/* PROPERTY CARDS */}
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
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 15px rgba(15,23,42,0.04)",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  borderColor: "#a7f3d0",
                  boxShadow: "0 16px 35px rgba(15,23,42,0.12)",
                },
              }}
            >
              {/* PROPERTY IMAGE */}
              <Box sx={{ position: "relative", overflow: "hidden" }}>
                <CardMedia
                  component="img"
                  image={
                    p.images?.[0]?.image ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={p.title}
                  sx={{
                    height: 220,
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                    "&:hover": { transform: "scale(1.04)" },
                  }}
                />

                {/* Image gradient */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: "50% 0 0",
                    background:
                      "linear-gradient(transparent, rgba(15,23,42,0.25))",
                    pointerEvents: "none",
                  }}
                />

                <Chip
                  label={p.purpose}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    bgcolor: p.purpose === "Sale" ? "#0f766e" : "#7c3aed",
                    color: "#ffffff",
                    fontWeight: 700,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  }}
                />

                <Chip
                  label={p.propertyType}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    bgcolor: "rgba(255,255,255,0.95)",
                    color: "#0f172a",
                    fontWeight: 700,
                    maxWidth: "55%",
                    "& .MuiChip-label": {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                />

                {/* FAVORITE BUTTON */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    zIndex: 1,
                  }}
                >
                  <FavoriteButton propertyId={p._id} />
                </Box>
              </Box>

              {/* PROPERTY CONTENT */}
              <CardContent
                sx={{
                  flexGrow: 1,
                  p: 2.5,
                  "&:last-child": { pb: 2.5 },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: "#0f172a",
                    fontSize: "1.08rem",
                    mb: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={p.title}
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

                {/* PRICE */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mb: 2,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "#ecfdf5",
                  }}
                >
                  

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: "#047857",
                      fontSize: "1.2rem",
                    }}
                  >
                   ₹{Number(p.price).toLocaleString("en-IN")}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{ color: "#64748b", ml: "auto" }}
                  >
                    {p.purpose === "Rent" ? "Rental price" : "Asking price"}
                  </Typography>
                </Box>

                {/* PROPERTY DETAILS */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  {[
                    {
                      icon: <Bed fontSize="small" />,
                      label: `${p.bedrooms} Beds`,
                    },
                    {
                      icon: <Bathtub fontSize="small" />,
                      label: `${p.bathrooms} Baths`,
                    },
                    {
                      icon: <SquareFoot fontSize="small" />,
                      label: `${p.area} sqft`,
                    },
                  ].map((detail) => (
                    <Box
                      key={detail.label}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.6,
                        color: "#64748b",
                      }}
                    >
                      {detail.icon}
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, color: "#475569" }}
                      >
                        {detail.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ borderColor: "#edf2f7", mb: 1.5 }} />

                {/* LOCATION */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 0.8,
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

              {/* CARD ACTIONS */}
              <CardActions
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                  p: 2,
                  bgcolor: "#fcfdfd",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#94a3b8", fontWeight: 500 }}
                >
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Date unavailable"}
                </Typography>

                <Button
                  size="medium"
                  variant="contained"
                  startIcon={<Visibility />}
                  onClick={() => handleView(p._id)}
                  sx={{
                    bgcolor: "#0f766e",
                    color: "#ffffff",
                    borderRadius: 2,
                    px: 2,
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "#115e59",
                      boxShadow: "0 5px 12px rgba(15,118,110,0.2)",
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

      {/* PAGINATION */}
      {pagination && (
        <Box
          sx={{
            mt: 4,
            borderTop: "1px solid #e2e8f0",
            pt: 2,
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                color: "#64748b",
              },
          }}
        >
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
            rowsPerPageOptions={[6, 12, 24, 48]}
          />
        </Box>
      )}
    </>
  )}
</Paper>
    </MainLayout>
  );
};

export default CustomerProperty;