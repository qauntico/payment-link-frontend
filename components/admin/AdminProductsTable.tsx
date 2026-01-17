"use client";

import { useRouter } from "next/navigation";
import { AdminProduct } from "@/lib/api/admin";
import styles from "./AdminProductsTable.module.css";

interface AdminProductsTableProps {
  products: AdminProduct[];
}

export default function AdminProductsTable({ products }: AdminProductsTableProps) {
  const router = useRouter();

  const handleProductClick = (productId: string) => {
    router.push(`/admin/products/${productId}`);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Mechant</th>
            <th className={styles.th}>Title</th>
            <th className={styles.th}>Description</th>
            <th className={styles.th}>Price</th>
            <th className={styles.th}>Quantity</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Created</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className={styles.tableRow}
            >
              <td className={styles.td}>{product.merchantId}</td>
              <td className={styles.td}>
                <span className={styles.productTitle}>{product.title}</span>
              </td>
              <td className={styles.td}>
                <span className={styles.description}>
                  {product.description.length > 50
                    ? `${product.description.substring(0, 50)}...`
                    : product.description}
                </span>
              </td>
              <td className={styles.td}>
                {product.price} {product.currency}
              </td>
              <td className={styles.td}>
                {product.quantity !== null ? product.quantity : "N/A"}
              </td>
              <td className={styles.td}>
                <span
                  className={`${styles.statusBadge} ${
                    product.isActive ? styles.active : styles.inactive
                  }`}
                >
                  {product.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className={styles.td}>
                {new Date(product.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
