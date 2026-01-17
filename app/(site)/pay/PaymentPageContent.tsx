"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPaymentProduct, PaymentProductResponse, authenticatePayment } from "@/lib/api/payments";
import { usePaymentStore } from "@/stores/paymentStore";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./page.module.css";

interface PaymentPageContentProps {
  productId?: string;
  initialData: PaymentProductResponse | null;
}

export default function PaymentPageContent({
  productId,
  initialData,
}: PaymentPageContentProps) {
  const router = useRouter();
  const [currentProductId, setCurrentProductId] = useState(productId || "");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { productData, setProductData, setPaymentSessionId, setLoading, setError } = usePaymentStore();

  // Get productId from URL if not provided
  useEffect(() => {
    if (!currentProductId && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const idFromUrl = params.get("productId");
      if (idFromUrl) {
        setCurrentProductId(idFromUrl);
      }
    }
  }, [currentProductId]);

  // Set initial data in store if provided
  useEffect(() => {
    if (initialData) {
      setProductData(initialData);
    }
  }, [initialData, setProductData]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["paymentProduct", currentProductId],
    queryFn: () => {
      if (!currentProductId) {
        throw new Error("Product ID is required");
      }
      return getPaymentProduct(currentProductId);
    },
    enabled: !!currentProductId,
    initialData: initialData || undefined,
    staleTime: 0,
    gcTime: 0,
  });

  // Update Zustand store when data changes
  useEffect(() => {
    if (data) {
      setProductData(data);
      setLoading(false);
      setError(null);
    }
  }, [data, setProductData, setLoading, setError]);

  // Update loading state
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  // Update error state
  useEffect(() => {
    if (error) {
      setError(error instanceof Error ? error.message : "Failed to load product information");
    } else {
      setError(null);
    }
  }, [error, setError]);

  // Use data from store or React Query
  const displayData = productData || data;

  if (!currentProductId) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>Product ID is required</p>
        </div>
      </div>
    );
  }

  const { isLoading: storeLoading, error: storeError } = usePaymentStore();
  const isCurrentlyLoading = isLoading || storeLoading;
  const currentError = error || storeError;

  if (isCurrentlyLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.loader} size={32} />
          <p>Loading product information...</p>
        </div>
      </div>
    );
  }

  if (currentError) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>
            {currentError instanceof Error
              ? currentError.message
              : currentError || "Failed to load product information"}
          </p>
        </div>
      </div>
    );
  }

  if (!displayData) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>Product not found</p>
        </div>
      </div>
    );
  }

  const { product, merchant } = displayData;

  const handleProceedToPayment = async () => {
    if (!currentProductId || !product.isActive) {
      return;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      const response = await authenticatePayment(currentProductId);
      setPaymentSessionId(response.id);
      router.push(`/proceed?sessionId=${response.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to authenticate payment"
      );
      setIsAuthenticating(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.productSection}>
          <div className={styles.imageContainer}>
            <img
              src={product.image}
              alt={product.title}
              className={styles.image}
            />
            {!product.isActive && (
              <div className={styles.inactiveOverlay}>
                <span className={styles.inactiveBadge}>Product Inactive</span>
              </div>
            )}
          </div>

          <div className={styles.productInfo}>
            <h1 className={styles.title}>{product.title}</h1>
            <p className={styles.description}>{product.description}</p>

            <div className={styles.priceSection}>
              <span className={styles.priceLabel}>Price:</span>
              <span className={styles.price}>
                {product.price} {product.currency}
              </span>
            </div>

            {product.quantity !== null && product.quantity > 0 && (
              <div className={styles.quantitySection}>
                <span className={styles.quantityLabel}>Available:</span>
                <span className={styles.quantity}>{product.quantity} units</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.merchantSection}>
          <h2 className={styles.merchantTitle}>Merchant Information</h2>
          <div className={styles.merchantInfo}>
            <div className={styles.merchantItem}>
              <span className={styles.merchantLabel}>Business Name:</span>
              <span className={styles.merchantValue}>
                {merchant.businessName}
              </span>
            </div>
            <div className={styles.merchantItem}>
              <span className={styles.merchantLabel}>Merchant:</span>
              <span className={styles.merchantValue}>
                {merchant.firstName} {merchant.lastName}
              </span>
            </div>
            <div className={styles.merchantItem}>
              <span className={styles.merchantLabel}>Email:</span>
              <span className={styles.merchantValue}>{merchant.email}</span>
            </div>
            {merchant.supportEmail && (
              <div className={styles.merchantItem}>
                <span className={styles.merchantLabel}>Support Email:</span>
                <span className={styles.merchantValue}>
                  {merchant.supportEmail}
                </span>
              </div>
            )}
            <div className={styles.merchantItem}>
              <span className={styles.merchantLabel}>Phone:</span>
              <span className={styles.merchantValue}>
                {merchant.phoneNumber}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.paymentSection}>
          <Button
            className={styles.proceedButton}
            disabled={!product.isActive || isAuthenticating}
            size="lg"
            onClick={handleProceedToPayment}
          >
            {isAuthenticating ? "Processing..." : "Proceed to Payment"}
          </Button>
          {!product.isActive && (
            <p className={styles.inactiveMessage}>
              This product is currently inactive and cannot be purchased.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
