"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/api/admin";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import UsersTable from "@/components/admin/UsersTable";
import DataPagination from "@/components/common/DataPagination";
import styles from "./page.module.css";

export default function AdminUsersPage() {
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
    queryKey: ["adminUsers", page, limit, debouncedSearch],
    queryFn: () => getUsers({ page, limit, search: debouncedSearch || undefined }),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Users Management</h1>
        <p className={styles.subtitle}>Manage and monitor user accounts</p>
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <Search className={styles.searchIcon} size={20} />
          <Input
            type="text"
            placeholder="Search users by name, email, or business..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.loader} size={32} />
          <p>Loading users...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>
            {error instanceof Error
              ? error.message
              : "Failed to load users"}
          </p>
        </div>
      ) : !data || data.users.length === 0 ? (
        <div className={styles.emptyContainer}>
          <p>No users found</p>
        </div>
      ) : (
        <>
          <UsersTable users={data.users} />

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
                {data.pagination.total} users
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
