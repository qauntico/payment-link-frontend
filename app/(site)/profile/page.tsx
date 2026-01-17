"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

function ProfileContent() {
  const { user: authUser, logout, refreshUser } = useAuth();
  const router = useRouter();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    enabled: !!authUser, // Only fetch if user is authenticated
    retry: 1,
  });

  const handleLogout = async () => {
    await logout();
    router.push("/signin");
  };

  const displayUser = user || authUser;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Failed to load profile. Please try again.
        </div>
        <Button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>User Profile</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className={styles.logoutButton}
          >
            Logout
          </Button>
        </div>

        <div className={styles.profileContent}>
          <div className={styles.avatar}>
            <div className={styles.avatarIcon}>
              {displayUser?.firstName?.[0]?.toUpperCase() || "U"}
            </div>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>First Name</span>
              <span className={styles.value}>{displayUser?.firstName || "N/A"}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Last Name</span>
              <span className={styles.value}>{displayUser?.lastName || "N/A"}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{displayUser?.email || "N/A"}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Phone Number</span>
              <span className={styles.value}>
                {displayUser?.phoneNumber || "N/A"}
              </span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Business Name</span>
              <span className={styles.value}>
                {displayUser?.businessName || "N/A"}
              </span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Support Email</span>
              <span className={styles.value}>
                {displayUser?.supportEmail || "N/A"}
              </span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Role</span>
              <span className={styles.value}>{displayUser?.role || "N/A"}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Member Since</span>
              <span className={styles.value}>
                {displayUser?.createdAt
                  ? new Date(displayUser.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
