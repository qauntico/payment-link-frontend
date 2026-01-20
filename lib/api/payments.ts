import api from './client';

export interface PaymentProduct {
  id: string;
  merchantId: string;
  image: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  email: string | null;
  paymentLink: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Merchant {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  businessName: string;
  supportEmail: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentProductResponse {
  product: PaymentProduct;
  merchant: Merchant;
}

// Server-side function (uses fetch directly)
export const getPaymentProductServer = async (
  productId: string
): Promise<PaymentProductResponse | null> => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || '';
    
    if (!backendUrl) {
      console.error("BACKEND_URL is not configured");
      return null;
    }

    const response = await fetch(`${backendUrl}/payments/product/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error("Failed to fetch payment product:", response.status);
      return null;
    }

    const data: PaymentProductResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching payment product:", error);
    return null;
  }
};

// Client-side function (uses axios)
export const getPaymentProduct = async (
  productId: string
): Promise<PaymentProductResponse> => {
  const response = await api.get<PaymentProductResponse>(
    `/payments/product/${productId}`
  );
  return response.data;
};

export interface AuthenticatePaymentResponse {
  id: string;
  message: string;
}

export const authenticatePayment = async (
  productId: string
): Promise<AuthenticatePaymentResponse> => {
  const response = await api.post<AuthenticatePaymentResponse>(
    `/payments/authenticate/${productId}`
  );
  return response.data;
};

export interface InitiatePaymentRequest {
  paymentId: string;
  paymentMode: string;
  phoneNumber: string;
  quantity?: number;
  fullName: string;
  emailAddress: string;
  currencyCode: string;
  countryCode: string;
}

export interface InitiatePaymentResponse {
  id: string;
  message: string;
  providerStatus: string;
  internalPaymentId: string;
}

export const initiatePayment = async (
  data: InitiatePaymentRequest
): Promise<InitiatePaymentResponse> => {
  const response = await api.post<InitiatePaymentResponse>(
    '/payments/initiate',
    data
  );
  return response.data;
};

export interface PaymentStatusResponse {
  paymentId: string;
  status: string;
  externalReference: string;
  receiptUrl: string;
}

export const getPaymentStatus = async (
  paymentId: string
): Promise<PaymentStatusResponse> => {
  const response = await api.get<PaymentStatusResponse>(
    `/payments/status/${paymentId}`
  );
  return response.data;
};

export interface PaymentStatsResponse {
  total_completed_transactions: number;
  amount_earn: string;
}

export const getPaymentStats = async (): Promise<PaymentStatsResponse> => {
  const response = await api.get<PaymentStatsResponse>('/payments/stats');
  return response.data;
};
