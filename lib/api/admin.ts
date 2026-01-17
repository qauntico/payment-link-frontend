import api from './client';

export interface DashboardStats {
  period: string;
  totalUsers: {
    current: number;
    previous: number;
    percentageChange: number;
  };
  totalPayments: {
    current: number;
    previous: number;
    percentageChange: number;
  };
  totalReceipts: {
    current: number;
    previous: number;
    percentageChange: number;
  };
  initiatedPayments: {
    current: number;
    previous: number;
    percentageChange: number;
  };
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>('/admin/dashboard/stats');
  return response.data;
};

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  businessName: string;
  supportEmail: string | null;
  restricted: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetUsersResponse {
  users: User[];
  pagination: PaginationMeta;
}

export const getUsers = async (params?: GetUsersParams): Promise<GetUsersResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  if (params?.search) {
    queryParams.append('search', params.search);
  }

  const queryString = queryParams.toString();
  const url = `/admin/users${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get<GetUsersResponse>(url);
  return response.data;
};

export interface RestrictUserRequest {
  userId: string;
  restricted: boolean;
}

export const restrictUser = async (data: RestrictUserRequest): Promise<void> => {
  await api.patch('/admin/users/restrict', data);
};

export interface AdminProduct {
  id: string;
  merchantId: string;
  image: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  quantity: number | null;
  email: string | null;
  paymentLink: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetAdminProductsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetAdminProductsResponse {
  products: AdminProduct[];
  pagination: PaginationMeta;
}

export const getAdminProducts = async (params?: GetAdminProductsParams): Promise<GetAdminProductsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  if (params?.search) {
    queryParams.append('search', params.search);
  }

  const queryString = queryParams.toString();
  const url = `/admin/products${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get<GetAdminProductsResponse>(url);
  return response.data;
};

export interface AdminPayment {
  id: string;
  productId: string;
  customerName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  amount: number;
  status: string;
  externalReference: string;
  momoReference: string;
  currencyCode: string;
  countryCode: string;
  createdAt: string;
  updatedAt: string;
  receipt: {
    id: string;
    paymentId: string;
    receiptUrl: string;
    createdAt: string;
  } | null;
}

export interface AdminProductDetail {
  id: string;
  merchantId: string;
  image: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  quantity: number | null;
  email: string | null;
  paymentLink: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  payments: AdminPayment[];
}

export const getAdminProductTransactions = async (productId: string): Promise<AdminProductDetail> => {
  const response = await api.get<AdminProductDetail>(`/admin/products/${productId}/transactions`);
  return response.data;
};

export interface UpdateProductStatusRequest {
  isActive: boolean;
}

export interface UpdateProductStatusResponse {
  id: string;
  merchantId: string;
  image: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  quantity: number | null;
  email: string | null;
  paymentLink: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const updateAdminProductStatus = async (
  productId: string,
  isActive: boolean
): Promise<UpdateProductStatusResponse> => {
  const response = await api.patch<UpdateProductStatusResponse>(
    `/admin/products/${productId}/status`,
    { isActive }
  );
  return response.data;
};
