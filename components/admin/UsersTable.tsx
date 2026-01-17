"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restrictUser, User } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Ban, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import styles from "./UsersTable.module.css";

interface UsersTableProps {
  users: User[];
}

export default function UsersTable({ users }: UsersTableProps) {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRestricting, setIsRestricting] = useState(false);

  const restrictMutation = useMutation({
    mutationFn: restrictUser,
    onSuccess: () => {
      toast.success(
        selectedUser?.restricted
          ? "User has been unblocked successfully"
          : "User has been blocked successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setIsModalOpen(false);
      setSelectedUser(null);
      setIsRestricting(false);
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        error instanceof AxiosError && error.response?.data
          ? (error.response.data as { message?: string }).message || "Failed to update user status"
          : "Failed to update user status";
      toast.error(errorMessage);
      setIsRestricting(false);
    },
  });

  const handleBlockClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedUser) return;

    setIsRestricting(true);
    restrictMutation.mutate({
      userId: selectedUser.id,
      restricted: !selectedUser.restricted,
    });
  };

  return (
    <>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Email</th>
              <th className={styles.th}>Phone</th>
              <th className={styles.th}>Business</th>
              <th className={styles.th}>Role</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className={styles.td}>
                  {user.firstName} {user.lastName}
                </td>
                <td className={styles.td}>{user.email}</td>
                <td className={styles.td}>{user.phoneNumber}</td>
                <td className={styles.td}>{user.businessName}</td>
                <td className={styles.td}>
                  <span className={styles.roleBadge}>{user.role}</span>
                </td>
                <td className={styles.td}>
                  <span
                    className={`${styles.statusBadge} ${
                      user.restricted ? styles.restricted : styles.active
                    }`}
                  >
                    {user.restricted ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className={styles.td}>
                  <Button
                    variant={user.restricted ? "default" : "destructive"}
                    size="sm"
                    onClick={() => handleBlockClick(user)}
                    disabled={restrictMutation.isPending}
                    className={user.restricted ? styles.unblockButton : styles.actionButton}
                  >
                    {user.restricted ? (
                      <>
                        <UserCheck size={16} />
                        Unblock
                      </>
                    ) : (
                      <>
                        <Ban size={16} />
                        Block
                      </>
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirm}
        title={
          selectedUser?.restricted
            ? "Unblock User"
            : "Block User"
        }
        description={
          selectedUser?.restricted
            ? `Are you sure you want to unblock ${selectedUser.firstName} ${selectedUser.lastName}? They will be able to access the platform again.`
            : `Are you sure you want to block ${selectedUser?.firstName} ${selectedUser?.lastName}? They will not be able to access the platform.`
        }
        confirmText={selectedUser?.restricted ? "Unblock" : "Block"}
        cancelText="Cancel"
        variant="destructive"
        isLoading={isRestricting}
      />
    </>
  );
}
