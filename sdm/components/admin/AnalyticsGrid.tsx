import type { LucideIcon } from "lucide-react";
import { StatsCard } from "./StatsCard";

interface StatItem {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
}

interface AnalyticsGridProps {
  stats: StatItem[];
  loading?: boolean;
}

/**
 * Responsive analytics grid component
 * Displays multiple stats in a responsive grid layout
 * Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns
 */
export function AnalyticsGrid({ stats, loading }: AnalyticsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={loading ? "—" : stat.value}
          suffix={stat.suffix}
        />
      ))}
    </div>
  );
}
