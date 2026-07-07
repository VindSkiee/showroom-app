import type { VehicleStatus, VehicleType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "muted";
  className?: string;
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-surface text-ink",
  success: "bg-accent/10 text-accent",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-danger/10 text-danger",
  muted: "bg-surface text-ink-muted",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium leading-5",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: VehicleStatus }) {
  return (
    <Badge variant={status === "available" ? "success" : "muted"}>
      {status === "available" ? "Tersedia" : "Terjual"}
    </Badge>
  );
}

export function TypeBadge({ type }: { type: VehicleType }) {
  const labels: Record<VehicleType, string> = {
    matic: "Matic",
    manual: "Manual",
    sport: "Sport",
    cruiser: "Cruiser",
    scoopy: "Scoopy",
  };

  return <Badge variant="default">{labels[type]}</Badge>;
}
