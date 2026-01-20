"use client";

import { Suspense, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getProductById, updateProductStatus } from "@/lib/api/products";
import { Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AxiosError } from "axios";
import styles from "./page.module.css";
import PaymentsTable from "../../../../components/products/PaymentsTable";
import Image from "next/image";

function ProductDetailContent({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });

  const handleCopy = async () => {
    if (!product) return;
    try {
      await navigator.clipboard.writeText(product.paymentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleStatusToggle = async (checked: boolean) => {
    if (!product || isToggling) return;

    setIsToggling(true);

    try {
      const updatedProduct = await updateProductStatus(id, checked);

      // Update React Query cache
      queryClient.setQueryData(["product", id], (oldData: typeof product) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          isActive: updatedProduct.isActive,
          updatedAt: updatedProduct.updatedAt,
        };
      });

      toast.success(
        `Product ${checked ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      console.error("Failed to update product status:", error);
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || "Failed to update product status"
          : "Failed to update product status";
      toast.error(errorMessage);
    } finally {
      setIsToggling(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.loader} size={32} />
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>
          {error instanceof Error
            ? error.message
            : "Failed to load product details"}
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.emptyContainer}>
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.productSection}>
        <div className={styles.imageContainer}>
          <Image
            width={100}
            height={100}
            src={product.image}
            alt={product.title}
            className={styles.image}
          />
          {product.isActive ? (
            <span className={styles.activeBadge}>Active</span>
          ) : (
            <span className={styles.inactiveBadge}>Inactive</span>
          )}
        </div>

        <div className={styles.productInfo}>
          <div className={styles.header}>
            <div className={styles.titleContainer}>
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
          </div>

          <div className={styles.description}>
            <h3 className={styles.sectionTitle}>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className={styles.details}>
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
              <span className={styles.detailLabel}>Created:</span>
              <span className={styles.detailValue}>
                {new Date(product.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className={styles.paymentLinkSection}>
            <h3 className={styles.sectionTitle}>Payment Link</h3>
            <div className={styles.paymentLinkContainer}>
              <code className={styles.paymentLink}>{product.paymentLink}</code>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className={styles.copyButton}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.paymentsSection}>
        <h2 className={styles.sectionTitle}>Payment Transactions</h2>
        <PaymentsTable payments={product.payments || []} />
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <Suspense
      fallback={
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.loader} size={32} />
          <p>Loading product details...</p>
        </div>
      }
    >
      <ProductDetailContent id={id} />
    </Suspense>
  );
}
