


export type PropertyType =
  | "Apartment"
  | "House"
  | "Villa"
  | "Land"
  | "Office"
  | "Shop"
  | "Warehouse";

export type PropertyPurpose = "Sale" | "Rent";

export type FurnishingStatus =
  | "Furnished"
  | "Semi-Furnished"
  | "Unfurnished";

export type PropertyStatus =
  | "Available"
  | "Sold"
  | "Rented"
  | "Unavailable";

export type ApprovalStatus = "Pending" | "Approved" | "rejected";


export interface PropertyImage {
  image: string;
  public_id: string;
}

export interface PropertyLocation {
  type: "Point";
  coordinates: [number, number]; 
}

export interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  purpose: PropertyPurpose;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  furnishingStatus: FurnishingStatus;
  owner: string | PopulatedUser;
  agentId?: string | PopulatedUser | null;
  images: PropertyImage[];
  amenities: string[];
  status: PropertyStatus;
  approvalStatus: ApprovalStatus;
  location: PropertyLocation;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  rejectionReason:string;
}



export interface CreatePropertyData {
  title: string;
  description: string;
  propertyType: PropertyType;
  purpose: PropertyPurpose;
  price: number | string;
  area: number | string;
  bedrooms: number | string;
  bathrooms: number | string;
  furnishingStatus: FurnishingStatus;
  amenities?: string[] | string;
  status: PropertyStatus;
  location: {
    type: "Point";
    coordinates: [number, number] | [string, string] | number[];
  };
  agentId?: string;
  images?: FileList | File[];
}

export interface UpdatePropertyData extends Partial<CreatePropertyData> {
  approvalStatus?: ApprovalStatus;
}



export interface GetAllPropertiesResponse {
  status: boolean;
  message: string;
  totalProperty?: number;
  count?: number;
  currentPage: number;
  totalpage: number;
  data: Property[];
}

export interface PropertyResponse {
  status: boolean;
  message: string;
  data: Property;
}

export interface DeletePropertyResponse {
  status: boolean;
  message: string;
}



export interface PropertyState {
  properties: Property[];
  property: Property | null;
  pagination: {
    currentPage: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    purpose: string;
    status: string;
    approvalStatus: string;
    minPrice: string;
    maxPrice: string;
  };
}



export interface PropertyFormValues {
  title: string;
  description: string;
  propertyType: PropertyType;
  purpose: PropertyPurpose;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  furnishingStatus: FurnishingStatus;
  amenities: string; // comma-separated in the form
  status: PropertyStatus;
  agentId?: string;
  longitude: number;
  latitude: number;
}

export interface GetPropertyByIdResponse {
  success: boolean;
  message: string;
  data: Property|null;
}

export interface MyApprovedPropertiesParams {
  search?: string;
  purpose?: "" | "Sale" | "Rent";
  page?: number;
  limit?: number;
}

export interface PublicApprovedParams {
  search?: string;
  purpose?: "" | "Sale" | "Rent";
  propertyType?: string;
  minprice?: number | string;
  maxprice?: number | string;
  bedrooms?: number | string;
  furnishingStatus?: string;
  sortBy?: "price" | "createdAt" | "area" | "bedrooms";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
