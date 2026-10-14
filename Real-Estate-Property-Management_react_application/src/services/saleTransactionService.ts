import api from "./api";
import type {
  CreateSaleTransactionData,
  UpdateSaleTransactionData,
  GetSaleTransactionsResponse,
  GetSaleTransactionResponse,
  SaleTransactionMutationResponse,
} from "../typescript/type/saleTransaction.types";

const BASE = "/v12/api"; // adjust to your mount prefix

const saleTransactionService = {
  // ---------------- CREATE (owner/agent) ----------------
  createSaleTransaction: async (
    data: CreateSaleTransactionData
  ): Promise<SaleTransactionMutationResponse> => {
    const response = await api.post<SaleTransactionMutationResponse>(
      `${BASE}/offer/${data.offerId}`,
      { notes: data.notes ?? "" }
    );
    return response.data;
  },

  // ---------------- MY TRANSACTIONS (any role) ----------------
  getMySaleTransactions: async (): Promise<GetSaleTransactionsResponse> => {
    const response = await api.get<GetSaleTransactionsResponse>(
      `${BASE}/my-transactions`
    );
    return response.data;
  },

  // ---------------- SINGLE ----------------
  getSaleTransactionById: async (
    id: string
  ): Promise<GetSaleTransactionResponse> => {
    const response = await api.get<GetSaleTransactionResponse>(
      `${BASE}/${id}`
    );
    return response.data;
  },

  // ---------------- UPDATE (owner/agent) ----------------
  updateSaleTransaction: async (
    data: UpdateSaleTransactionData
  ): Promise<SaleTransactionMutationResponse> => {
    const { id, ...body } = data;
    const response = await api.patch<SaleTransactionMutationResponse>(
      `${BASE}/${id}`,
      body
    );
    return response.data;
  },


getAllSaleTransactionsAdmin: async (): Promise<GetSaleTransactionsResponse> => {
  const response = await api.get<GetSaleTransactionsResponse>(
    `${BASE}/admin/all`
  );
  return response.data;
},

};

export default saleTransactionService;