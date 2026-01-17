"use client";

import { AdminPayment } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import styles from "./AdminTransactionsTable.module.css";

interface AdminTransactionsTableProps {
  payments: AdminPayment[];
}

function getStatusBadgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case "confirmed":
      return styles.confirmed;
    case "pending":
      return styles.pending;
    case "initiated":
      return styles.initiated;
    case "failed":
      return styles.failed;
    default:
      return styles.default;
  }
}

export default function AdminTransactionsTable({
  payments,
}: AdminTransactionsTableProps) {
  const handleViewReceipt = (receiptUrl: string) => {
    window.open(receiptUrl, "_blank");
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Customer</th>
            <th className={styles.th}>Email</th>
            <th className={styles.th}>Phone</th>
            <th className={styles.th}>Amount</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Date</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className={styles.td}>{payment.customerName}</td>
              <td className={styles.td}>{payment.customerEmail}</td>
              <td className={styles.td}>{payment.customerPhoneNumber}</td>
              <td className={styles.td}>
                {payment.amount} {payment.currencyCode}
              </td>
              <td className={styles.td}>
                <span
                  className={`${styles.statusBadge} ${getStatusBadgeClass(payment.status)}`}
                >
                  {payment.status}
                </span>
              </td>
              <td className={styles.td}>
                {new Date(payment.createdAt).toLocaleDateString()}
              </td>
              <td className={styles.td}>
                {payment.receipt ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewReceipt(payment.receipt!.receiptUrl)}
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
