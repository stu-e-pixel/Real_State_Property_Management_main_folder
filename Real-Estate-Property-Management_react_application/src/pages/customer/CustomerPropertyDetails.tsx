import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Divider,
  Avatar,
  Skeleton,
} from "@mui/material";
import {
  ArrowBack,
  LocationOn,
  Bed,
  Bathtub,
  SquareFoot,
  CheckCircle,
  Email,
  Home,
  EventAvailable,
  AssignmentTurnedIn,
  LocalOffer,
  Star,
} from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import InquiryModal from "./InquiryModal";
import BookAppointmentModal from "./BookAppointmentModal";
import RentalApplicationModal from "./RentalApplicationModal";
import MakeSaleOfferModal from "./MakeSaleOfferModal";
import FavoriteButton from "./FavoriteButton";

// ✅ NEW IMPORTS
import ReviewModal from "./ReviewModal";
import PropertyReviewsSection from "./PropertyReviewsSection";

import {
  getPropertyById,
  clearSelectedProperty,
} from "../../features/property/propertySlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type { PopulatedUser } from "../../typescript/type/property.types";
import { IndianRupee } from "lucide-react";

// =====================================================
// TYPE GUARD
// =====================================================

const isPopulatedUser = (
  value: string | PopulatedUser | null | undefined,
): value is PopulatedUser =>
  !!value && typeof value === "object" && "name" in value;

// =====================================================
// PAGE
// =====================================================

const CustomerPropertyDetails = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { property, loading } = useAppSelector((state) => state.property);

  // =====================================================
  // MODAL STATES
  // =====================================================

  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [rentalOpen, setRentalOpen] = useState(false);
  const [saleOfferOpen, setSaleOfferOpen] = useState(false);

  // ✅ NEW — Review modal state
  const [reviewOpen, setReviewOpen] = useState(false);

  // =====================================================
  // FETCH PROPERTY
  // =====================================================

  useEffect(() => {
    if (propertyId) {
      dispatch(getPropertyById(propertyId));
    }

    return () => {
      dispatch(clearSelectedProperty());
    };
  }, [dispatch, propertyId]);

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading && !property) {
    return (
      <MainLayout>
        <Paper
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
          }}
        >
          <Skeleton
            variant="rounded"
            height={300}
            sx={{ mb: 3, borderRadius: 2 }}
          />

          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="40%" />

          <Skeleton
            variant="rounded"
            height={200}
            sx={{ mt: 2, borderRadius: 2 }}
          />
        </Paper>
      </MainLayout>
    );
  }

  // =====================================================
  // NOT FOUND STATE
  // =====================================================

  if (!property) {
    return (
      <MainLayout>
        <Paper
          sx={{
            p: { xs: 3, sm: 6 },
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Home
            sx={{
              fontSize: 80,
              color: "text.disabled",
              mb: 2,
            }}
          />

          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Property Not Found
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            The property you're looking for doesn't exist or has been removed.
          </Typography>

          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/user")}
          >
            Back to Properties
          </Button>
        </Paper>
      </MainLayout>
    );
  }

  // =====================================================
  // PROPERTY HELPERS
  // =====================================================

  const images = property.images ?? [];
  const amenities = property.amenities ?? [];
  const coordinates = property.location?.coordinates ?? [];
  const owner = isPopulatedUser(property.owner) ? property.owner : null;

  const formatCurrency = (amount: number): string =>
    `₹${(amount ?? 0).toLocaleString()}`;

  // =====================================================
  // MAIN RENDER
  // =====================================================

  return (
    <MainLayout>
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <IconButton onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowBack />
          </IconButton>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                overflowWrap: "anywhere",
              }}
            >
              {property.title}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {property.propertyType} • For {property.purpose}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Chip
              icon={<CheckCircle />}
              label="Approved"
              color="success"
              variant="outlined"
            />

            <FavoriteButton propertyId={property._id} size="medium" />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* PROPERTY IMAGES */}

        {images.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 3,
              overflowX: "auto",
              pb: 1,
            }}
          >
            {images.map((image, index) => (
              <Box
                key={image.public_id ?? `${image.image}-${index}`}
                component="img"
                src={image.image}
                alt={`${property.title} - image ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
                sx={{
                  width: {
                    xs: 240,
                    sm: 300,
                  },
                  height: {
                    xs: 170,
                    sm: 200,
                  },
                  objectFit: "cover",
                  borderRadius: 2,
                  flexShrink: 0,
                  bgcolor: "action.hover",
                }}
              />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              height: 200,
              mb: 3,
              borderRadius: 2,
              bgcolor: "action.hover",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Home
              sx={{
                fontSize: 64,
                color: "text.disabled",
              }}
            />
          </Box>
        )}

        {/* MAIN CONTENT */}

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 3,
            flexDirection: {
              xs: "column",
              md: "row",
            },
          }}
        >
          {/* LEFT: PROPERTY DETAILS */}

          <Box
            sx={{
              width: {
                xs: "100%",
                md: "calc(66.6667% - 8px)",
              },
              minWidth: 0,
            }}
          >
            {/* DESCRIPTION */}

            <Paper
              variant="outlined"
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Description
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: "pre-line", overflowWrap: "anywhere" }}
              >
                {property.description || "No description available."}
              </Typography>

              {/* PRICE */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 3,
                  mb: 2,
                }}
              >
                <IndianRupee
                  
                    fontSize={32}
                />

                <Typography
                  variant="h4"
                  color="success.main"
                  sx={{
                    fontWeight: 700,
                    overflowWrap: "anywhere",
                  }}
                >
                  {formatCurrency(property.price)}
                </Typography>
              </Box>

              {/* KEY STATS */}

              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 2, sm: 3 },
                  flexWrap: "wrap",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Bed color="action" />

                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block" }}
                    >
                      Bedrooms
                    </Typography>

                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {property.bedrooms ?? "—"}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Bathtub color="action" />

                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block" }}
                    >
                      Bathrooms
                    </Typography>

                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {property.bathrooms ?? "—"}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <SquareFoot color="action" />

                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block" }}
                    >
                      Area
                    </Typography>

                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {property.area?.toLocaleString() ?? "—"} sqft
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* PROPERTY DETAILS */}

            <Paper
              variant="outlined"
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Property Details
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                {[
                  { label: "Type", value: property.propertyType },
                  { label: "Purpose", value: property.purpose },
                  {
                    label: "Furnishing",
                    value: property.furnishingStatus,
                  },
                  { label: "Status", value: property.status },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      width: {
                        xs: "calc(50% - 8px)",
                        sm: "calc(33.333% - 11px)",
                      },
                      minWidth: 0,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {item.label}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {item.value || "—"}
                    </Typography>
                  </Box>
                ))}

                {/* LOCATION */}

                <Box sx={{ width: "100%", mt: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 0.5,
                    }}
                  >
                    <LocationOn fontSize="small" color="action" />

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Coordinates
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ overflowWrap: "anywhere" }}
                      >
                        {coordinates.length > 0
                          ? coordinates.join(", ")
                          : "Not available"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* AMENITIES */}

            {amenities.length > 0 && (
              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Amenities
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {amenities.map((amenity) => (
                    <Chip key={amenity} label={amenity} variant="outlined" />
                  ))}
                </Box>
              </Paper>
            )}
          </Box>

          {/* RIGHT: ACTIONS SIDEBAR */}

          <Box
            sx={{
              width: {
                xs: "100%",
                md: "calc(33.3333% - 16px)",
              },
              minWidth: 0,
            }}
          >
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                position: { md: "sticky" },
                top: { md: 100 },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Actions
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {/* INQUIRY */}

                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<Email />}
                  onClick={() => setInquiryOpen(true)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Send Inquiry
                </Button>

                {/* BOOK A VISIT */}

                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<EventAvailable />}
                  onClick={() => setBookingOpen(true)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Book a Visit
                </Button>

                {/* RENTAL APPLICATION */}

                {property.purpose === "Rent" && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<AssignmentTurnedIn />}
                    onClick={() => setRentalOpen(true)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Apply for Rent
                  </Button>
                )}

                {/* SALE OFFER */}

                {property.purpose === "Sale" && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="warning"
                    size="large"
                    startIcon={<LocalOffer />}
                    onClick={() => setSaleOfferOpen(true)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Make an Offer
                  </Button>
                )}

                {/* ✅ NEW — WRITE A REVIEW */}

                <Button
                  fullWidth
                  variant="outlined"
                  color="warning"
                  size="large"
                  startIcon={<Star />}
                  onClick={() => setReviewOpen(true)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Write a Review
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* LISTED BY */}

              {owner && (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 1 }}
                  >
                    Listed By
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.5,
                      bgcolor: "action.hover",
                      borderRadius: 2,
                    }}
                  >
                    <Avatar
                      src={owner.image || undefined}
                      sx={{
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                      }}
                    >
                      {owner.name?.charAt(0)}
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600 }}
                        noWrap
                      >
                        {owner.name}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {owner.email}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>

        {/* =====================================================
            ✅ NEW — PROPERTY REVIEWS SECTION
            Placed below the main grid, full width
        ===================================================== */}

        <Box sx={{ mt: 3 }}>
          <PropertyReviewsSection propertyId={property._id} />
        </Box>
      </Paper>

      {/* =====================================================
          MODALS
      ===================================================== */}

      {inquiryOpen && (
        <InquiryModal
          open={inquiryOpen}
          onClose={() => setInquiryOpen(false)}
          property={property}
        />
      )}

      {bookingOpen && (
        <BookAppointmentModal
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
          property={property}
        />
      )}

      {rentalOpen && (
        <RentalApplicationModal
          open={rentalOpen}
          onClose={() => setRentalOpen(false)}
          property={property}
        />
      )}

      {saleOfferOpen && (
        <MakeSaleOfferModal
          open={saleOfferOpen}
          onClose={() => setSaleOfferOpen(false)}
          property={property}
        />
      )}

      {/* ✅ NEW — REVIEW MODAL */}

      {reviewOpen && (
        <ReviewModal
          open={reviewOpen}
          onClose={() => setReviewOpen(false)}
          property={property}
        />
      )}
    </MainLayout>
  );
};

export default CustomerPropertyDetails;