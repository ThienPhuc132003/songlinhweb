import { memo } from "react";
import { Tag } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * WCAG luminance-based contrast color picker.
 * Returns "white" for dark backgrounds, "black" for light backgrounds.
 */
export function getContrastColor(hex: string): "white" | "black" {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "white";
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "black" : "white";
}

/**
 * Get a Lucide icon component by name.
 * Falls back to Tag icon if not found.
 */
function getLucideIcon(name: string | null | undefined): React.ComponentType<{ className?: string }> {
  if (!name) return Tag;
  // Convert kebab-case to PascalCase
  const pascalName = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  const icon = (LucideIcons as Record<string, unknown>)[pascalName];
  if (typeof icon === "function") return icon as React.ComponentType<{ className?: string }>;
  // Also try the original name (some icons might be directly named)
  const direct = (LucideIcons as Record<string, unknown>)[name];
  if (typeof direct === "function") return direct as React.ComponentType<{ className?: string }>;
  return Tag;
}

interface FeatureBadgeProps {
  name: string;
  color?: string | null;
  icon?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Visual feature badge with dynamic color and Lucide icon.
 * Automatically handles contrast (white/black text) based on background color.
 */
export const FeatureBadge = memo(function FeatureBadge({
  name,
  color,
  icon,
  size = "sm",
  className,
}: FeatureBadgeProps) {
  const IconComponent = getLucideIcon(icon);
  const hasColor = color && /^#[0-9a-fA-F]{6}$/.test(color);
  const bgColor = hasColor ? color : undefined;
  const fgColor = hasColor ? getContrastColor(color!) : undefined;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-0.5",
    md: "px-2.5 py-1 text-xs gap-1",
    lg: "px-3 py-1.5 text-sm gap-1.5",
  };

  const iconSizes = {
    sm: "h-2.5 w-2.5",
    md: "h-3 w-3",
    lg: "h-3.5 w-3.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-colors",
        sizeClasses[size],
        !hasColor && "bg-primary/10 text-primary",
        className,
      )}
      style={
        hasColor
          ? {
              backgroundColor: bgColor,
              color: fgColor,
            }
          : undefined
      }
    >
      <IconComponent className={iconSizes[size]} />
      {name}
    </span>
  );
});

export default FeatureBadge;
