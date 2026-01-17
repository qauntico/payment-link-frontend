import { create } from 'zustand';
import { PaymentProductResponse } from '@/lib/api/payments';

export interface PaymentReceipt {
  paymentId: string;
  status: string;
  externalReference: string;
  receiptUrl: string;
}

interface PaymentState {
  productData: PaymentProductResponse | null;
  paymentSessionId: string | null;
  paymentId: string | null;
  receipt: PaymentReceipt | null;
  isLoading: boolean;
  error: string | null;
  setProductData: (data: PaymentProductResponse | null) => void;
  setPaymentSessionId: (id: string | null) => void;
  setPaymentId: (id: string | null) => void;
  setReceipt: (receipt: PaymentReceipt | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearProductData: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  productData: null,
  paymentSessionId: null,
  paymentId: null,
  receipt: null,
  isLoading: false,
  error: null,
  setProductData: (data) => set({ productData: data, error: null }),
  setPaymentSessionId: (id) => set({ paymentSessionId: id }),
  setPaymentId: (id) => set({ paymentId: id }),
  setReceipt: (receipt) => set({ receipt }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  clearProductData: () => set({ 
    productData: null, 
    paymentSessionId: null, 
    paymentId: null,
    receipt: null,
    error: null, 
    isLoading: false 
  }),
}));
