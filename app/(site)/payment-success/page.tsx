"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePaymentStore } from "@/stores/paymentStore";
import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink } from "lucide-react";
import styles from "./page.module.css";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { receipt } = usePaymentStore();

  useEffect(() => {
    // Redirect if no receipt
    if (!receipt) {
      router.push("/");
    }
  }, [receipt, router]);

  if (!receipt) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>No payment receipt found</p>
        </div>
      </div>
    );
  }

  const handleViewReceipt = () => {
    window.open(receipt.receiptUrl, "_blank");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <CheckCircle className={styles.successIcon} size={64} />
        </div>

        <h1 className={styles.title}>Payment Successful!</h1>
        <p className={styles.description}>
          Your payment has been confirmed successfully.
        </p>

        <div className={styles.receiptSection}>
          <h2 className={styles.receiptTitle}>Payment Receipt</h2>
          <div className={styles.receiptInfo}>
            <div className={styles.receiptItem}>
              <span className={styles.receiptLabel}>Payment ID:</span>
              <span className={styles.receiptValue}>{receipt.paymentId}</span>
            </div>
            <div className={styles.receiptItem}>
              <span className={styles.receiptLabel}>Status:</span>
              <span className={styles.receiptValue}>{receipt.status}</span>
            </div>
            <div className={styles.receiptItem}>
              <span className={styles.receiptLabel}>Reference:</span>
              <span className={styles.receiptValue}>
                {receipt.externalReference}
              </span>
            </div>
          </div>

          <Button
            onClick={handleViewReceipt}
            className={styles.receiptButton}
            size="lg"
          >
            <ExternalLink size={20} />
            View Receipt
          </Button>
        </div>

        <div className={styles.actions}>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className={styles.homeButton}
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
