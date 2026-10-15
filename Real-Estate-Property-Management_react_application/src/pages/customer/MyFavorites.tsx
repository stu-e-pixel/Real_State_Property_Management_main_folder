import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Button,
  Box,
  Divider,
  IconButton,
  Tooltip,
  Skeleton,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  Delete,
  Visibility,
  LocationOn,
  Bed,
  Bathtub,
  SquareFoot,
} from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import {
  getMyFavorites,
  removeFavorite,
} from "../../features/favorite/favoriteSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import type { Favorite } from "../../typescript/type/favorite.types";
import type { Property } from "../../typescript/type/property.types";
import { IndianRupee } from "lucide-react";



const isPopulatedProperty = (
  value: Property | string | undefined,
): value is Property =>
  !!value && typeof value === "object" && "title" in value;



const MyFavorites = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { favorites, loading } = useAppSelector((state) => state.favorite);

  const [removingIds, setRemovingIds] = useState<string[]>([]);

  
  useEffect(() => {
    dispatch(getMyFavorites());
  }, [dispatch]);

  

  const handleRemove = async (propertyId: string): Promise<void> => {
    if (removingIds.includes(propertyId)) return;

    const confirmed = window.confirm(
      "Remove this property from your favorites?",
    );

    if (!confirmed) return;

    setRemovingIds((previous) => [...previous, propertyId]);

    try {
      await dispatch(removeFavorite(propertyId));
    } finally {
      setRemovingIds((previous) => previous.filter((id) => id !== propertyId));
    }
  };

  

  const handleViewDetails = (propertyId: string): void => {
    navigate(`/user/properties/${propertyId}`);
  };

  

  const formatCurrency = (amount: number): string =>
    `₹${(amount ?? 0).toLocaleString()}`;

  

  return (
    <MainLayout>
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
        }}
      >
       

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              My Favorites
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Properties you've saved for later
            </Typography>
          </Box>

          <Chip
            icon={<FavoriteIcon />}
            label={`${favorites.length} Saved`}
            color="error"
            variant="outlined"
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        

        {loading && favorites.length === 0 ? (
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
                    md: "calc(33.3333% - 16px)",
                  },
                  minWidth: 0,
                }}
              >
                <Skeleton
                  variant="rounded"
                  height={340}
                  sx={{ borderRadius: 3 }}
                />
              </Box>
            ))}
          </Box>
        ) : favorites.length === 0 ? (
          

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              py: 10,
            }}
          >
            <FavoriteIcon
              sx={{
                fontSize: 100,
                color: "text.disabled",
                mb: 2,
              }}
            />

            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No favorites yet
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start saving properties you love by clicking the heart icon.
            </Typography>

            <Button variant="contained" onClick={() => navigate("/properties")}>
              Browse Properties
            </Button>
          </Box>
        ) : (
          

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {favorites.map((favorite: Favorite) => {
              const property = isPopulatedProperty(favorite.property)
                ? favorite.property
                : null;

              if (!property) return null;

              const propertyId = property._id;
              const isRemoving = removingIds.includes(propertyId);
              const propertyImages = property.images ?? [];
              const imageUrl = propertyImages[0]?.image;

              const coordinates = property.location?.coordinates;

              return (
                <Box
                  key={favorite._id}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 12px)",
                      md: "calc(33.3333% - 16px)",
                    },
                    minWidth: 0,
                    display: "flex",
                  }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    

                    <Box sx={{ position: "relative" }}>
                      {imageUrl ? (
                        <CardMedia
                          component="img"
                          image={imageUrl}
                          alt={property.title}
                          loading="lazy"
                          onClick={() => handleViewDetails(propertyId)}
                          sx={{
                            height: 200,
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                        />
                      ) : (
                        <Box
                          onClick={() => handleViewDetails(propertyId)}
                          sx={{
                            height: 200,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "action.hover",
                            cursor: "pointer",
                          }}
                        >
                          <FavoriteIcon
                            sx={{
                              fontSize: 56,
                              color: "text.disabled",
                            }}
                          />
                        </Box>
                      )}

                      <Chip
                        label={property.purpose}
                        size="small"
                        color={
                          property.purpose === "Sale" ? "primary" : "secondary"
                        }
                        sx={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          fontWeight: 600,
                        }}
                      />

                      <Chip
                        label={property.propertyType}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          fontWeight: 600,
                          bgcolor: "background.paper",
                          color: "text.primary",
                        }}
                      />

                      

                      <Tooltip title="Remove from favorites">
                        <span>
                          <IconButton
                            size="small"
                            disabled={isRemoving}
                            onClick={() => handleRemove(propertyId)}
                            aria-label="Remove from favorites"
                            sx={{
                              position: "absolute",
                              bottom: 8,
                              right: 8,
                              bgcolor: "background.paper",
                              boxShadow: 1,
                              "&:hover": {
                                bgcolor: "action.hover",
                              },
                            }}
                          >
                            <FavoriteIcon
                              fontSize="small"
                              sx={{ color: "error.main" }}
                            />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>

                    

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          cursor: "pointer",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        onClick={() => handleViewDetails(propertyId)}
                      >
                        {property.title}
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
                          minHeight: "2.5em",
                        }}
                      >
                        {property.description || "No description available."}
                      </Typography>



                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <IndianRupee
                          fontSize="small"
                          color="success.main"
                        />

                        <Typography
                          variant="h6"
                          color="success.main"
                          sx={{ fontWeight: 700 }}
                        >
                          {formatCurrency(property.price)}
                        </Typography>
                      </Box>

                      

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
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
                            {property.bedrooms ?? "—"}
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
                            {property.bathrooms ?? "—"}
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
                            {property.area?.toLocaleString() ?? "—"} sqft
                          </Typography>
                        </Box>
                      </Box>

                      

                      {coordinates && coordinates.length >= 2 && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <LocationOn fontSize="small" color="action" />

                          <Typography variant="caption" color="text.secondary">
                            {coordinates[1]?.toFixed(4)},{" "}
                            {coordinates[0]?.toFixed(4)}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>

                    <Divider />

                    

                    <CardActions
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 1,
                        p: 1.5,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Saved{" "}
                        {favorite.createdAt
                          ? new Date(favorite.createdAt).toLocaleDateString()
                          : "—"}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Tooltip title="Remove favorite">
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={isRemoving}
                              onClick={() => handleRemove(propertyId)}
                              aria-label="Remove favorite"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<Visibility />}
                          onClick={() => handleViewDetails(propertyId)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                        >
                          More Details
                        </Button>
                      </Box>
                    </CardActions>
                  </Card>
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>
    </MainLayout>
  );
};

export default MyFavorites;
