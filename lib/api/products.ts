import api from './client';

export interface CreateProductRequest {
  image: File | string;
  title: string;
  description: string;
  price: number;
  quantity?: number;
}

export interface Product {
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

export const createProduct = async (
  data: CreateProductRequest
): Promise<Product> => {
  const formData = new FormData();

  // Append image file
  if (data.image instanceof File) {
    formData.append('image', data.image);
  } else {
    formData.append('image', data.image);
  }

  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('price', data.price.toString());

  // Only append quantity if it's provided (not undefined/null)
  if (data.quantity !== undefined && data.quantity !== null && data.quantity !== 0) {
    formData.append('quantity', data.quantity.toString());
  }

  const response = await api.post<Product>('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export interface GetProductsParams {
  search?: string;
}

export const getProducts = async (
  params?: GetProductsParams
): Promise<Product[]> => {
  const queryParams = new URLSearchParams();
  
  if (params?.search) {
    queryParams.append('search', params.search);
  }

  const queryString = queryParams.toString();
  const url = `/products${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get<Product[]>(url);
  return response.data;
};

export interface Receipt {
  id: number;
  paymentId: number;
  receiptUrl: string;
  createdAt: string;
}

export interface Payment {
  id: number;
  productId: number;
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
  receipt: Receipt | null;
}

export interface ProductDetail {
  id: number | string;
  merchantId: number | string;
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
  payments: Payment[];
}

export const getProductById = async (id: string): Promise<ProductDetail> => {
  const response = await api.get<ProductDetail>(`/products/${id}`);
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

export const updateProductStatus = async (
  productId: string,
  isActive: boolean
): Promise<UpdateProductStatusResponse> => {
  const response = await api.patch<UpdateProductStatusResponse>(
    `/products/${productId}/status`,
    { isActive }
  );
  return response.data;
};
