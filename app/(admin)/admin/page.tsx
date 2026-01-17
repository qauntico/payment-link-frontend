"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/api/admin";
import { Loader2, Users, CreditCard, FileText, PlayCircle } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import styles from "./page.module.css";

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.loader} size={32} />
          <p>Loading dashboard stats...</p>
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
              : "Failed to load dashboard stats"}
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyContainer}>
          <p>No stats available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.period}>Period: {stats.period}</p>
      </div>

      <div className={styles.statsGrid}>
        <StatCard
          title="Total Users"
          current={stats.totalUsers.current}
          previous={stats.totalUsers.previous}
          percentageChange={stats.totalUsers.percentageChange}
          icon={Users}
        />
        <StatCard
          title="Total Payments"
          current={stats.totalPayments.current}
          previous={stats.totalPayments.previous}
          percentageChange={stats.totalPayments.percentageChange}
          icon={CreditCard}
        />
        <StatCard
          title="Total Receipts"
          current={stats.totalReceipts.current}
          previous={stats.totalReceipts.previous}
          percentageChange={stats.totalReceipts.percentageChange}
          icon={FileText}
        />
        <StatCard
          title="Initiated Payments"
          current={stats.initiatedPayments.current}
          previous={stats.initiatedPayments.previous}
          percentageChange={stats.initiatedPayments.percentageChange}
          icon={PlayCircle}
        />
      </div>
    </div>
  );
}
