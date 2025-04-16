
import { cn } from "@/lib/utils";

export interface ActivityItemProps {
  id: string;
  title: string;
  description: string;
  time: string;
  status?: "pending" | "approved" | "rejected" | "completed";
  user?: {
    name: string;
    avatar?: string;
  };
}

export function ActivityItem({
  title,
  description,
  time,
  status,
  user,
}: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-procurpal-primary/10 text-procurpal-primary">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-800 truncate">
            {title}
          </p>
          {status && (
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                status === "pending" && "bg-yellow-100 text-yellow-800",
                status === "approved" && "bg-green-100 text-green-800",
                status === "rejected" && "bg-red-100 text-red-800",
                status === "completed" && "bg-blue-100 text-blue-800"
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}
