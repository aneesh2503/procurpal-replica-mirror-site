
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
  iconClassName,
}: StatCardProps) {
  return (
    <div className={cn("dashboard-card p-6", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{title}</p>
          <h3 className="stat-value mt-1">{value}</h3>
          {trend && (
            <div className="flex items-center mt-2">
              <svg
                className={cn(
                  "h-3 w-3 mr-1",
                  trend.isPositive ? "text-procurpal-success" : "text-procurpal-danger"
                )}
                fill="none"
                viewBox="0 0 24 24"
              >
                {trend.isPositive ? (
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12L12 8M12 8L16 12M12 8V20"
                  />
                ) : (
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12L12 16M12 16L16 12M12 16V4"
                  />
                )}
              </svg>
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-procurpal-success" : "text-procurpal-danger"
                )}
              >
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center bg-procurpal-primary/10 text-procurpal-primary",
            iconClassName
          )}
        >
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
