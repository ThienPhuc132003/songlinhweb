import * as LucideIcons from "lucide-react";
import { FileCheck, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Convert kebab-case to PascalCase for Lucide lookup */
function toPascalCase(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/** Resolve a Lucide icon by name (supports both kebab-case and PascalCase) */
function resolveIcon(name: string): LucideIcon {
  // Try direct lookup first (PascalCase)
  const direct = (LucideIcons as Record<string, unknown>)[name];
  if (typeof direct === "function") return direct as LucideIcon;

  // Try converting kebab-case → PascalCase
  const pascal = toPascalCase(name);
  const converted = (LucideIcons as Record<string, unknown>)[pascal];
  if (typeof converted === "function") return converted as LucideIcon;

  return FileCheck;
}

interface SolutionIconProps {
  /** Icon name (e.g. "camera", "scan-face", "Camera", "ShieldCheck") */
  name: string;
  className?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

/**
 * Renders a Lucide icon from a string name.
 * Supports both kebab-case ("scan-face") and PascalCase ("ScanFace").
 * Falls back to FileCheck if the name isn't recognized.
 */
export function SolutionIcon({ name, className, size = "md" }: SolutionIconProps) {
  const Icon = resolveIcon(name);

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

