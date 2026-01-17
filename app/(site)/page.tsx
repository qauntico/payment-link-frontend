import Navigation from "@/components/navigation";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.headline}>
              Sell online easier with{" "}
              <span className={styles.headlineLarge}>SLT APP</span>
            </h1>
            <p className={styles.description}>
              Set up your online store on Instagram, WhatsApp and more. Share
              links and collect payments with SLT App
            </p>
          </div>
          <div className={styles.backgroundImage}>
            {/* Placeholder background - replace with your image */}
            <div className={styles.placeholderBg}></div>
          </div>
        </div>

        <div className={styles.featuresSection}>
          <div className={styles.featuresContainer}>
            <div className={styles.featureBlock}>
              <div className={styles.featureNumber}>01</div>
              <h2 className={styles.featureTitle}>
                Start selling online, even without a website
              </h2>
              <p className={styles.featureDescription}>
                Don't have a website? No worries. Create payment links with a
                few taps and share them via WhatsApp or Instagram, all on
                mobile.
              </p>
            </div>

            <div className={styles.featureBlock}>
              <div className={styles.featureNumber}>02</div>
              <h2 className={styles.featureTitle}>
                Accept Payments from 20+ channels
              </h2>
              <p className={styles.featureDescription}>
                Accept payments from multiple payment methods and channels,
                making it easy for your customers to pay you.
              </p>
            </div>

            <div className={styles.featureBlock}>
              <div className={styles.featureNumber}>03</div>
              <h2 className={styles.featureTitle}>
                Get notified in real-time as you get paid
              </h2>
              <p className={styles.featureDescription}>
                Receive instant notifications whenever a payment is received, so
                you never miss a transaction.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.socialIcons}>
          <a href="#" className={styles.socialIcon} aria-label="LinkedIn">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <a href="#" className={styles.socialIcon} aria-label="Twitter">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>
          </a>
          <a href="#" className={styles.socialIcon} aria-label="Facebook">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          <a href="#" className={styles.socialIcon} aria-label="Instagram">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>
      </main>
    </div>
  );
}
