import { TrendingUp, TrendingDown } from "lucide-react";
import styles from "./StatCard.module.css";

interface StatCardProps {
  title: string;
  current: number;
  previous: number;
  percentageChange: number;
  icon: React.ElementType;
}

export default function StatCard({
  title,
  current,
  previous,
  percentageChange,
  icon: Icon,
}: StatCardProps) {
  console.log(previous);
  const isPositive = percentageChange >= 0;
  const displayPercentage = isPositive ? percentageChange : Math.abs(percentageChange);

  return (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <div className={styles.statIcon}>
          <Icon size={24} />
        </div>
        <div className={styles.statTitle}>{title}</div>
      </div>
      <div className={styles.statContent}>
        <div className={styles.statValue}>{current.toLocaleString()}</div>
        <div className={styles.statChange}>
          <div className={`${styles.changeIndicator} ${isPositive ? styles.positive : styles.negative}`}>
            {isPositive ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span>{displayPercentage}%</span>
          </div>
          <span className={styles.changeLabel}>vs previous period</span>
        </div>
      </div>
    </div>
  );
}
