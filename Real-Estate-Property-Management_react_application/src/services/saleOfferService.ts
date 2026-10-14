import api from "./api";
import type {
  CreateSaleOfferData,
  RespondToSaleOfferData,
  GetSaleOffersResponse,
  SaleOfferMutationResponse,
  DeleteSaleOfferResponse,
} from "../typescript/type/saleOffer.types";

const BASE = "/v11/api"; // adjust to your mount prefix

const saleOfferService = {
  // ---------------- CREATE (customer) ----------------
  createSaleOffer: async (
    data: CreateSaleOfferData
  ): Promise<SaleOfferMutationResponse> => {
    const response = await api.post<SaleOfferMutationResponse>(
      `${BASE}/createSale`,
      data
    );
    return response.data;
  },

  // ---------------- MY OFFERS (customer) ----------------
  getMySaleOffers: async (): Promise<GetSaleOffersResponse> => {
    const response = await api.get<GetSaleOffersResponse>(
      `${BASE}/my-offers`
    );
    return response.data;
  },

  // ---------------- PROPERTY OFFERS (owner/agent) ----------------
  getPropertySaleOffers: async (
    propertyId: string
  ): Promise<GetSaleOffersResponse> => {
    const response = await api.get<GetSaleOffersResponse>(
      `${BASE}/property/${propertyId}`
    );
    return response.data;
  },

  // ---------------- RESPOND (owner/agent) ----------------
  respondToSaleOffer: async (
    data: RespondToSaleOfferData
  ): Promise<SaleOfferMutationResponse> => {
    const { id, ...body } = data;
    const response = await api.patch<SaleOfferMutationResponse>(
      `${BASE}/${id}/respond`,
      body
    );
    return response.data;
  },

  // ---------------- WITHDRAW (customer) ----------------
  withdrawSaleOffer: async (
    id: string
  ): Promise<SaleOfferMutationResponse> => {
    const response = await api.patch<SaleOfferMutationResponse>(
      `${BASE}/${id}/withdraw`
    );
    return response.data;
  },

  // ---------------- DELETE (customer) ----------------
  deleteSaleOffer: async (id: string): Promise<DeleteSaleOfferResponse> => {
    const response = await api.delete<DeleteSaleOfferResponse>(
      `${BASE}/${id}`
    );
    return response.data;
  },

  
getSaleOfferByOwner: async (): Promise<GetSaleOffersResponse> => {
  const response = await api.get<GetSaleOffersResponse>(
    `${BASE}/owner/my-offers`
  );
  return response.data;
},

getSaleOfferByAgent: async (): Promise<GetSaleOffersResponse> => {
  const response = await api.get<GetSaleOffersResponse>(
    `${BASE}/agent/my-offers`
  );
  return response.data;
},
};

export default saleOfferService;