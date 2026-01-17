"use client";

import { useState, useEffect, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import styles from "./page.module.css";
import ProductCard from "../../../components/products/ProductCard";


function ProductsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products", debouncedSearch],
    queryFn: () => getProducts({ search: debouncedSearch || undefined }),
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Product & Services Catalog</h1>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={20} />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {isLoading && (
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.loader} size={32} />
          <p>Loading products...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>
            {error instanceof Error
              ? error.message
              : "Failed to load products"}
          </p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {products && products.length > 0 ? (
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyContainer}>
              <p>No products found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.loader} size={32} />
          <p>Loading products...</p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
