// Generic API response structure
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AgentPagination extends Pagination {
  totalAgents: number;
}

export interface OwnerPagination extends Pagination {
  totalOwners: number;
}

export interface UserPagination extends Pagination {
  totalUsers: number;
}

export interface Filters {
  search: string;
  status: string;
  isEmailVerified: boolean | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
}