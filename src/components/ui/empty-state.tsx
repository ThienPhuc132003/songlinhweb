import type { LucideIcon } from "lucide-react";
import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title = "Không có dữ liệu",
  description = "Chưa có nội dung nào được thêm vào mục này.",
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[30vh] items-center justify-center px-4 py-12">
      <div className="text-center">
        <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Icon className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="mb-1.5 text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground mb-5 max-w-sm text-sm">
          {description}
        </p>
        {actionLabel && actionHref && (
          <Button asChild variant="outline">
            <Link to={actionHref}>{actionLabel}</Link>
          </Button>
        )}
        {actionLabel && onAction && (
          <Button variant="outline" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
