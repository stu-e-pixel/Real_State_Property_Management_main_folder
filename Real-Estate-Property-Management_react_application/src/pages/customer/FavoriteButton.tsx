import React from "react";
import { IconButton, Tooltip, CircularProgress } from "@mui/material";
import { FavoriteBorder, Favorite as FavoriteIcon } from "@mui/icons-material";

import {
  addFavorite,
  removeFavorite,
} from "../../features/favorite/favoriteSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

interface FavoriteButtonProps {
  propertyId: string;
  /** Optional size override */
  size?: "small" | "medium" | "large";
  /** Optional style override for positioning */
  sx?: object;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  propertyId,
  size = "small",
  sx,
}) => {
  const dispatch = useAppDispatch();

  const { favoritePropertyIds, loading } = useAppSelector(
    (state) => state.favorite
  );
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const userRole = useAppSelector((state) => state.auth.user?.role);

  const isFavorite = favoritePropertyIds.includes(propertyId);
  const isCustomer = userRole === "customer";

  const handleToggle = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.stopPropagation(); // prevent card click navigation

    if (!isAuthenticated || !isCustomer) {
      return; // optionally: show login prompt
    }

    if (isFavorite) {
      await dispatch(removeFavorite(propertyId));
    } else {
      await dispatch(addFavorite(propertyId));
    }
  };

  // Only show for customers
  if (!isCustomer) return null;

  return (
    <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
      <IconButton
        onClick={handleToggle}
        disabled={loading}
        size={size}
        sx={{
          bgcolor: "rgba(255,255,255,0.9)",
          "&:hover": { bgcolor: "rgba(255,255,255,1)" },
          boxShadow: 1,
          ...sx,
        }}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {loading ? (
          <CircularProgress size={16} />
        ) : isFavorite ? (
          <FavoriteIcon fontSize={size} sx={{ color: "#ef4444" }} />
        ) : (
          <FavoriteBorder fontSize={size} sx={{ color: "#6b7280" }} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default FavoriteButton;