import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import favoriteService from "../../services/favoriteService";
import type {
  FavoriteState,
  Favorite,
  GetFavoritesResponse,
  FavoriteMutationResponse,
} from "../../typescript/type/favorite.types";
import toast from "react-hot-toast";

const initialState: FavoriteState = {
  favorites: [],
  loading: false,
  error: null,
  favoritePropertyIds: [],
};

const extractPropertyIds = (favorites: Favorite[]): string[] =>
  favorites
    .map((f) => {
      if (typeof f.property === "string") return f.property;
      return f.property?._id ?? "";
    })
    .filter(Boolean);

export const addFavorite = createAsyncThunk<
  FavoriteMutationResponse,
  string,
  { rejectValue: string }
>("favorite/add", async (propertyId, { rejectWithValue }) => {
  try {
    return await favoriteService.addFavorite(propertyId);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to add to favorites",
    );
  }
});

export const removeFavorite = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("favorite/remove", async (propertyId, { rejectWithValue }) => {
  try {
    await favoriteService.removeFavorite(propertyId);
    return propertyId;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to remove from favorites",
    );
  }
});

export const getMyFavorites = createAsyncThunk<
  GetFavoritesResponse,
  void,
  { rejectValue: string }
>("favorite/getMine", async (_, { rejectWithValue }) => {
  try {
    return await favoriteService.getMyFavorites();
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch favorites",
    );
  }
});

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    clearFavoriteError: (state) => {
      state.error = null;
    },

    toggleFavoriteLocally: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const idx = state.favoritePropertyIds.indexOf(id);
      if (idx !== -1) {
        state.favoritePropertyIds.splice(idx, 1);
      } else {
        state.favoritePropertyIds.push(id);
      }
    },
    clearFavorites: (state) => {
      state.favorites = [];
      state.favoritePropertyIds = [];
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(addFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.data) {
          state.favorites = [action.payload.data, ...state.favorites];

          const propId =
            typeof action.payload.data.property === "string"
              ? action.payload.data.property
              : action.payload.data.property?._id;

          if (propId && !state.favoritePropertyIds.includes(propId)) {
            state.favoritePropertyIds.push(propId);
          }
        }

        toast.success("Added to favorites");
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
        toast.error(action.payload ?? "Failed to add to favorites");
      })

      .addCase(removeFavorite.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.loading = false;

        state.favorites = state.favorites.filter((f) => {
          const propId =
            typeof f.property === "string" ? f.property : f.property?._id;
          return propId !== action.payload;
        });

        state.favoritePropertyIds = state.favoritePropertyIds.filter(
          (id) => id !== action.payload,
        );

        toast.success("Removed from favorites");
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to remove from favorites");
      })

      .addCase(getMyFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload.data ?? [];
        state.favoritePropertyIds = extractPropertyIds(
          action.payload.data ?? [],
        );
      })
      .addCase(getMyFavorites.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload ?? "Failed to fetch favorites");
      });
  },
});

export const { clearFavoriteError, toggleFavoriteLocally, clearFavorites } =
  favoriteSlice.actions;
export default favoriteSlice.reducer;
