import api from "./api";
import type {
  GetFavoritesResponse,
  FavoriteMutationResponse,
  RemoveFavoriteResponse,
} from "../typescript/type/favorite.types";

const BASE = "/v3/api"; // adjust to your mount prefix

const favoriteService = {
  // ---------------- ADD ----------------
  addFavorite: async (
    propertyId: string
  ): Promise<FavoriteMutationResponse> => {
    const response = await api.post<FavoriteMutationResponse>(
      `${BASE}/addFavorite/${propertyId}`
    );
    return response.data;
  },

  // ---------------- REMOVE ----------------
  removeFavorite: async (
    propertyId: string
  ): Promise<RemoveFavoriteResponse> => {
    const response = await api.delete<RemoveFavoriteResponse>(
      `${BASE}/removeFavorite/${propertyId}`
    );
    return response.data;
  },

  // ---------------- MY FAVORITES ----------------
  getMyFavorites: async (): Promise<GetFavoritesResponse> => {
    const response = await api.get<GetFavoritesResponse>(
      `${BASE}/findFavorite`
    );
    return response.data;
  },
};

export default favoriteService;