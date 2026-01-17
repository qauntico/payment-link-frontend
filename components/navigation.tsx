"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./navigation.module.css";

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/signin");
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>$</div>
          <span className={styles.logoText}>SLT</span>
        </Link>
        <div className={styles.navActions}>
          {isAuthenticated ? (
            <>
              <Link href="/profile" className={styles.signInLink}>
                {user?.firstName || "Profile"}
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                className={styles.signUpButton}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin" className={styles.signInLink}>
                Sign in
              </Link>
              <Button asChild variant="outline" className={styles.signUpButton}>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
