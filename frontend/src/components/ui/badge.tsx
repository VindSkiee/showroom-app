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
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium leading-4 sm:rounded-full sm:px-2.5 sm:text-xs sm:leading-5",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: "available" | "sold_out" }) {
  return (
    <Badge variant={status === "available" ? "success" : "muted"}>
      {status === "available" ? "Tersedia" : "Tidak Tersedia"}
    </Badge>
  );
}

const typeLabels: Record<string, string> = {
  matic: "Matic",
  manual: "Manual",
  sport: "Sport",
  cruiser: "Cruiser",
  scoopy: "Scoopy",
  suv: "SUV",
  sedan: "Sedan",
  mpv: "MPV",
  hatchback: "Hatchback",
  lcgc: "LCGC",
  pickup: "Pickup",
};

export function TypeBadge({ type }: { type: string }) {
  return <Badge variant="default">{typeLabels[type] || type}</Badge>;
}
