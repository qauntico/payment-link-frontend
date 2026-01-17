"use client";

import { Payment } from "@/lib/api/products";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import styles from "./PaymentsTable.module.css";

interface PaymentsTableProps {
  payments: Payment[];
}

export default function PaymentsTable({ payments }: PaymentsTableProps) {
  if (payments.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p>No payment transactions found</p>
      </div>
    );
  }

  const handleViewReceipt = (receiptUrl: string) => {
    window.open(receiptUrl, "_blank");
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return styles.statusConfirmed;
      case "pending":
        return styles.statusPending;
      case "failed":
        return styles.statusFailed;
      default:
        return styles.statusDefault;
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Receipt</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.customerName}</td>
              <td>{payment.customerEmail}</td>
              <td>{payment.customerPhoneNumber}</td>
              <td>
                {payment.amount} {payment.currencyCode}
              </td>
              <td>
                <span
                  className={`${styles.statusBadge} ${getStatusBadgeClass(
                    payment.status
                  )}`}
                >
                  {payment.status}
                </span>
              </td>
              <td>
                {new Date(payment.createdAt).toLocaleDateString()}
              </td>
              <td>
                {payment.receipt ? (
                  <Button
                    onClick={() => handleViewReceipt(payment.receipt!.receiptUrl)}
                    variant="outline"
                    size="sm"
                    className={styles.receiptButton}
                  >
                    <ExternalLink size={14} />
                    View Receipt
                  </Button>
                ) : (
                  <span className={styles.noReceipt}>No receipt</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
