import {
  Camera,
  Flame,
  Volume2,
  Network,
  Zap,
  Phone,
  ShieldCheck,
  Bell,
  Server,
  Building2,
  FileCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Camera,
  Flame,
  Volume2,
  Network,
  Zap,
  Phone,
  ShieldCheck,
  Bell,
  Server,
  Building2,
  FileCheck,
};

interface SolutionIconProps {
  /** Icon name from SOLUTIONS_DATA (e.g. "Camera", "Flame") */
  name: string;
  className?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

/**
 * Renders a Lucide icon from a string name.
 * Falls back to FileCheck if the name isn't recognized.
 */
export function SolutionIcon({ name, className, size = "md" }: SolutionIconProps) {
  const Icon = ICON_MAP[name] ?? FileCheck;

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return <Icon className={cn(sizeClasses[size], className)} />;
}

/** Icon container with background — for use in cards */
export function SolutionIconBadge({
  name,
  className,
  size = "md",
}: SolutionIconProps) {
  const containerSize = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary",
        containerSize[size],
        className,
      )}
    >
      <SolutionIcon name={name} size={size} />
    </div>
  );
}
