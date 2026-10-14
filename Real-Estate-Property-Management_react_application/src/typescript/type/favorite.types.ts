
import type { Property } from "./property.types";

// =====================================================
// ENTITY
// =====================================================

export interface Favorite {
  _id: string;
  user: string;
  property: Property | string;
  createdAt: string;
  updatedAt: string;
}

// =====================================================
// RESPONSES
// =====================================================

export interface GetFavoritesResponse {
  status: boolean;
  message?: string;
  count?: number;
  data: Favorite[];
}

export interface FavoriteMutationResponse {
  status: boolean;
  message: string;
  data?: Favorite;
}

export interface RemoveFavoriteResponse {
  status: boolean;
  message: string;
}

// =====================================================
// STATE
// =====================================================

export interface FavoriteState {
  favorites: Favorite[];
  loading: boolean;
  error: string | null;
  /** Set of property IDs the current user has favorited — for quick lookups */
  favoritePropertyIds: string[];
}