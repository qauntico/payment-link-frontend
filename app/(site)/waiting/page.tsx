"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePaymentStore } from "@/stores/paymentStore";
import { getPaymentStatus } from "@/lib/api/payments";
import { Loader2 } from "lucide-react";
import styles from "./page.module.css";

function WaitingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const { setReceipt, setError } = usePaymentStore();

  useEffect(() => {
    if (!paymentId) {
      router.push("/");
      return;
    }

    let pollInterval: NodeJS.Timeout;
    let isPolling = true;

    const pollPaymentStatus = async () => {
      if (!isPolling) return;

      try {
        console.log("Polling payment status for paymentId:", paymentId);
        const status = await getPaymentStatus(paymentId);
        console.log("payment status:", status);

        if (status.status === "confirmed") {
          // Stop polling
          isPolling = false;
          if (pollInterval) {
            clearInterval(pollInterval);
          }

          // Store receipt in Zustand
          setReceipt({
            paymentId: status.paymentId,
            status: status.status,
            externalReference: status.externalReference,
            receiptUrl: status.receiptUrl,
          });

          // Redirect to success page (replace history to prevent back navigation)
          router.replace("/payment-success");
        }
      } catch (error) {
        console.error("Error polling payment status:", error);
        // Continue polling even on error (might be temporary)
      }
    };

    // Start polling immediately
    pollPaymentStatus();

    // Then poll every 3 seconds
    pollInterval = setInterval(pollPaymentStatus, 10000);

    // Cleanup on unmount
    return () => {
      isPolling = false;
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [paymentId, router, setReceipt, setError]);

  if (!paymentId) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>Payment ID not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Loader2 className={styles.loader} size={48} />
        <h1 className={styles.title}>Waiting for Payment Confirmation</h1>
        <p className={styles.description}>
          Please complete your payment. We are checking the payment status...
        </p>
      </div>
    </div>
  );
}

export default function WaitingPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.content}>
            <Loader2 className={styles.loader} size={48} />
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <WaitingContent />
    </Suspense>
  );
}
