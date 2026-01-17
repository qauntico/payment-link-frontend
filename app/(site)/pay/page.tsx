import { Suspense } from "react";
import { getPaymentProductServer } from "@/lib/api/payments";
import PaymentPageContent from "./PaymentPageContent";

interface PageProps {
  searchParams: Promise<{ productId?: string }>;
}

export default async function PayPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const productId = params.productId;

  // Preload data on server if productId is available
  const initialData = productId ? await getPaymentProductServer(productId) : null;

  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <div>Loading...</div>
        </div>
      }
    >
      <PaymentPageContent productId={productId} initialData={initialData} />
    </Suspense>
  );
}
