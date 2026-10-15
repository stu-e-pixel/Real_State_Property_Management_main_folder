import api from "./api";
import type {
  GetFavoritesResponse,
  FavoriteMutationResponse,
  RemoveFavoriteResponse,
} from "../typescript/type/favorite.types";

const BASE = "/v3/api"; 
const favoriteService = {
  
  addFavorite: async (
    propertyId: string
  ): Promise<FavoriteMutationResponse> => {
    const response = await api.post<FavoriteMutationResponse>(
      `${BASE}/addFavorite/${propertyId}`
    );
    return response.data;
  },


  removeFavorite: async (
    propertyId: string
  ): Promise<RemoveFavoriteResponse> => {
    const response = await api.delete<RemoveFavoriteResponse>(
      `${BASE}/removeFavorite/${propertyId}`
    );
    return response.data;
  },

  
  getMyFavorites: async (): Promise<GetFavoritesResponse> => {
    const response = await api.get<GetFavoritesResponse>(
      `${BASE}/findFavorite`
    );
    return response.data;
  },
};

export default favoriteService;