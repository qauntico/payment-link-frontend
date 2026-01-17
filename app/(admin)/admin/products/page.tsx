"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminProducts } from "@/lib/api/admin";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";

import DataPagination from "@/components/common/DataPagination";
import styles from "./page.module.css";
import AdminProductsTable from "@/components/admin/AdminProductsTable";

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const limit = 5;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to first page when search changes
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["adminProducts", page, limit, debouncedSearch],
    queryFn: () => getAdminProducts({ page, limit, search: debouncedSearch || undefined }),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Products Management</h1>
        <p className={styles.subtitle}>Manage and monitor all products</p>
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <Search className={styles.searchIcon} size={20} />
          <Input
            type="text"
            placeholder="Search products by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.loader} size={32} />
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>
            {error instanceof Error
              ? error.message
              : "Failed to load products"}
          </p>
        </div>
      ) : !data || data.products.length === 0 ? (
        <div className={styles.emptyContainer}>
          <p>No products found</p>
        </div>
      ) : (
        <>
          <AdminProductsTable products={data.products} />

          {data.pagination.total_pages > 1 && (
            <div className={styles.paginationContainer}>
              <DataPagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.total_pages}
                onPageChange={handlePageChange}
              />
              <div className={styles.paginationInfo}>
                Showing {((data.pagination.page - 1) * data.pagination.limit) + 1} to{" "}
                {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of{" "}
                {data.pagination.total} products
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
