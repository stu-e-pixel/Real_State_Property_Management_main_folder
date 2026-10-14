import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import agentReducer from "../features/agent/agentSlice";
import ownerReducer from "../features/owner/ownerSlice";
import userReducer from "../features/user/userSlice";
import propertyReducer from "../features/property/propertySlice";
import inquiryReducer from "../features/inquiry/inquirySlice";
import appointmentReducer from "../features/appointment/appointmentSlice";
import rentalReducer from "../features/rental/rentalSlice";
import leaseReducer from "../features/lease/leaseSlice";
import saleOfferReducer from "../features/saleOffer/saleOfferSlice";
import saleTransactionReducer from "../features/saleTransaction/saleTransactionSlice";
import favoriteReducer from "../features/favorite/favoriteSlice";
import reviewReducer from "../features/review/reviewSlice";
import notificationReducer from "../features/notification/notificationSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    agent: agentReducer,
    owner: ownerReducer,
    user:userReducer,
    property:propertyReducer,
    inquiry:inquiryReducer,
    appointment: appointmentReducer,
    rental: rentalReducer,
    lease: leaseReducer,
    saleOffer: saleOfferReducer,
    saleTransaction: saleTransactionReducer,
    favorite: favoriteReducer,
    review: reviewReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;