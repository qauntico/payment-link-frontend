"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/api/products";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(product.paymentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleNavigate = () => {
    router.push(`/products/${product.id}`);
  };

  const handleViewMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/${product.id}`);
  };

  const description =
    product.description.length > 20 && !showFullDescription
      ? product.description.substring(0, 20) + "..."
      : product.description;

  const shouldShowViewMore =
    product.description.length > 20 && !showFullDescription;

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer} onClick={handleNavigate}>
        <img
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

      <div className={styles.cardContent}>
        <h3 className={styles.title} onClick={handleNavigate}>
          {product.title}
        </h3>

        <div className={styles.descriptionContainer}>
          <p className={styles.description}>{description}</p>
          {shouldShowViewMore && (
            <button
              onClick={handleViewMore}
              className={styles.viewMoreButton}
            >
              <Eye size={14} />
              View more
            </button>
          )}
        </div>

        <div className={styles.priceContainer}>
          <span className={styles.price}>
            {product.price} {product.currency}
          </span>
          {product.quantity !== null && (
            <span className={styles.quantity}>Qty: {product.quantity}</span>
          )}
        </div>

        <div className={styles.paymentLinkContainer}>
          <div className={styles.paymentLinkWrapper}>
            <span className={styles.paymentLinkLabel}>Payment Link:</span>
            <code className={styles.paymentLink}>{product.paymentLink}</code>
          </div>
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className={styles.copyButton}
            type="button"
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

        <div className={styles.metaContainer}>
          <span className={styles.metaText}>
            Created: {new Date(product.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
