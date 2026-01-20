"use client";

import { Suspense, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getAdminProductTransactions, updateAdminProductStatus } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import styles from "./page.module.css";
import AdminTransactionsTable from "@/components/admin/AdminTransactionsTable";
import Image from "next/image";

function ProductDetailContent({ productId }: { productId: string }) {
  const queryClient = useQueryClient();
  const [isToggling, setIsToggling] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["adminProductTransactions", productId],
    queryFn: () => getAdminProductTransactions(productId),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ isActive }: { isActive: boolean }) =>
      updateAdminProductStatus(productId, isActive),
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(
        ["adminProductTransactions", productId],
        (oldData: typeof product) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            isActive: updatedProduct.isActive,
            updatedAt: updatedProduct.updatedAt,
          };
        }
      );
      toast.success(
        `Product ${updatedProduct.isActive ? "activated" : "deactivated"} successfully`
      );
      setIsToggling(false);
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        error instanceof AxiosError && error.response?.data
          ? (error.response.data as { message?: string }).message ||
            "Failed to update product status"
          : "Failed to update product status";
      toast.error(errorMessage);
      setIsToggling(false);
    },
  });

  const handleStatusToggle = async (checked: boolean) => {
    if (isToggling || !product) return;
    setIsToggling(true);
    updateStatusMutation.mutate({ isActive: checked });
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.loader} size={32} />
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>
            {error instanceof Error
              ? error.message
              : "Failed to load product details"}
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyContainer}>
          <p>Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{product.title}</h1>
        <div className={styles.switchContainer}>
          <Label htmlFor="status-switch" className={styles.switchLabel}>
            {product.isActive ? "Active" : "Inactive"}
          </Label>
          <Switch
            id="status-switch"
            checked={product.isActive}
            onCheckedChange={handleStatusToggle}
            disabled={isToggling}
            className={styles.statusSwitch}
          />
        </div>
      </div>

      <div className={styles.productSection}>
        <div className={styles.productGrid}>
          <div className={styles.imageContainer}>
            <Image
              width={100}
              height={100}
              quality={80}
              loading="eager"
              src={product.image}
              alt={product.title}
              className={styles.image}
            />
          </div>

          <div className={styles.productInfo}>
            <div className={styles.infoGroup}>
              <h3 className={styles.sectionTitle}>Product Details</h3>
              <div className={styles.details}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Description:</span>
                  <span className={styles.detailValue}>{product.description}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Price:</span>
                  <span className={styles.detailValue}>
                    {product.price} {product.currency}
                  </span>
                </div>
                {product.quantity !== null && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Quantity:</span>
                    <span className={styles.detailValue}>{product.quantity}</span>
                  </div>
                )}
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Status:</span>
                  <span
                    className={`${styles.detailValue} ${
                      product.isActive ? styles.activeStatus : styles.inactiveStatus
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Payment Link:</span>
                  <div className={styles.paymentLinkContainer}>
                    <code className={styles.paymentLink}>{product.paymentLink}</code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.open(product.paymentLink, "_blank");
                      }}
                      className={styles.linkButton}
                    >
                      <ExternalLink size={14} />
                      Open
                    </Button>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Created:</span>
                  <span className={styles.detailValue}>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.transactionsSection}>
        <h2 className={styles.sectionTitle}>Payment Transactions</h2>
        {product.payments && product.payments.length > 0 ? (
          <AdminTransactionsTable payments={product.payments} />
        ) : (
          <div className={styles.emptyTransactions}>
            <p>No transactions found for this product</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <Loader2 className={styles.loader} size={32} />
            <p>Loading product details...</p>
          </div>
        </div>
      }
    >
      <ProductDetailContent productId={productId} />
    </Suspense>
  );
}
