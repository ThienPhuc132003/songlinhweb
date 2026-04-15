import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Pencil,
  Plus,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  SearchX,
  DatabaseZap,
} from "lucide-react";

/* ─── Empty State Illustration ──────────────────────────────────────────────── */

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  /** Variant controls icon style */
  variant?: "search" | "empty";
}

export function EmptyState({
  title,
  description,
  icon,
  variant = "empty",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      {/* Illustration */}
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/5 to-primary/10 blur-2xl scale-150" />
        <div className="relative flex items-center justify-center h-20 w-20 rounded-sm bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
          {icon || (
            variant === "search" ? (
              <SearchX className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            ) : (
              <DatabaseZap className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            )
          )}
        </div>
      </div>
      <h3 className="text-sm font-semibold text-foreground">
        {title || (variant === "search" ? "Không tìm thấy kết quả" : "Chưa có dữ liệu")}
      </h3>
      <p className="mt-1.5 text-xs text-muted-foreground max-w-[280px] leading-relaxed">
        {description || (
          variant === "search"
            ? "Thử thay đổi từ khóa tìm kiếm hoặc bỏ bộ lọc để xem tất cả."
            : "Bắt đầu bằng cách thêm mới dữ liệu vào hệ thống."
        )}
      </p>
    </div>
  );
}

/* ─── Data Table ───────────────────────────────────────────────────────────── */

export interface Column<T> {
  key: string;
  header: string | React.ReactNode;
  render?: (row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

type SortDirection = "asc" | "desc" | null;

interface DataTableProps<T extends { id: number }> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  isLoading?: boolean;
  searchable?: boolean;
  /** Single search field (backward compat) */
  searchField?: keyof T;
  /** Multiple search fields for global search */
  searchFields?: (keyof T)[];
  searchPlaceholder?: string;
  /** Items per page. 0 = show all. Default 15 */
  pageSize?: number;
  /** External filter bar (rendered above table) */
  filterBar?: React.ReactNode;
  /** Bulk selection */
  selectedIds?: Set<number>;
  onSelectionChange?: (ids: Set<number>) => void;
  /** Extra actions per row */
  rowActions?: (row: T) => React.ReactNode;
  /** Empty state customization */
  emptyText?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
}

export function DataTable<T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
  isLoading,
  searchable = true,
  searchField,
  searchFields,
  searchPlaceholder = "Tìm kiếm...",
  pageSize: initialPageSize = 15,
  filterBar,
  selectedIds,
  onSelectionChange,
  rowActions,
  emptyText,
  emptyTitle,
  emptyDescription,
  emptyIcon,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSizeState, setPageSizeState] = useState(initialPageSize);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  // ─── Resolve search fields (support both single and multi-field) ───
  const resolvedSearchFields = useMemo(() => {
    if (searchFields && searchFields.length > 0) return searchFields;
    if (searchField) return [searchField];
    return [];
  }, [searchField, searchFields]);

  // ─── Search filter ───
  const searched = useMemo(() => {
    if (!searchable || resolvedSearchFields.length === 0 || !debouncedSearch.trim()) return data;
    const q = debouncedSearch.toLowerCase();
    return data.filter((row) => {
      return resolvedSearchFields.some((field) => {
        const val = String(row[field] ?? "").toLowerCase();
        return val.includes(q);
      });
    });
  }, [data, searchable, resolvedSearchFields, debouncedSearch]);

  const isSearchActive = debouncedSearch.trim().length > 0;

  // ─── Sort ───
  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return searched;
    return [...searched].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      const aStr = String(aVal ?? "");
      const bStr = String(bVal ?? "");
      const cmp = aStr.localeCompare(bStr, undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [searched, sortKey, sortDir]);

  // ─── Pagination ───
  const totalItems = sorted.length;
  const effectivePageSize = pageSizeState === 0 ? totalItems : pageSizeState;
  const totalPages = Math.max(1, Math.ceil(totalItems / effectivePageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginated = useMemo(() => {
    if (pageSizeState === 0) return sorted;
    const start = (safeCurrentPage - 1) * effectivePageSize;
    return sorted.slice(start, start + effectivePageSize);
  }, [sorted, safeCurrentPage, effectivePageSize, pageSizeState]);

  // Reset page when search changes
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  // Sort toggle
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") {
        setSortKey(null);
        setSortDir(null);
      }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  // Selection helpers
  const hasSelection = !!selectedIds && !!onSelectionChange;
  const allIds = data.map((d) => d.id);
  const allSelected =
    hasSelection && allIds.length > 0 && allIds.every((id) => selectedIds!.has(id));
  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) onSelectionChange(new Set());
    else onSelectionChange(new Set(allIds));
  };
  const toggleOne = (id: number) => {
    if (!onSelectionChange || !selectedIds) return;
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey) return <ArrowUpDown className="ml-1 inline h-3 w-3 opacity-30" />;
    if (sortDir === "asc") return <ArrowUp className="ml-1 inline h-3 w-3 text-primary" />;
    return <ArrowDown className="ml-1 inline h-3 w-3 text-primary" />;
  };

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex items-center justify-center py-12">
        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
        Đang tải...
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* ─── Toolbar: Search + Filters ─── */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        {searchable && resolvedSearchFields.length > 0 && (
          <div className="relative max-w-xs flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
        {filterBar}
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span>{totalItems} mục</span>
          <select
            className="border-input bg-background rounded-sm border px-2 py-1 text-xs"
            value={pageSizeState}
            onChange={(e) => {
              setPageSizeState(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10/trang</option>
            <option value={15}>15/trang</option>
            <option value={25}>25/trang</option>
            <option value={50}>50/trang</option>
            <option value={0}>Tất cả</option>
          </select>
        </div>
      </div>

      {/* ─── Table ─── */}
      <div className="overflow-hidden rounded-sm border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 dark:bg-slate-900/50">
                {hasSelection && (
                  <th className="w-10 px-3 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400 ${col.className || ""} ${col.sortable !== false ? "cursor-pointer select-none hover:text-slate-900 dark:hover:text-slate-200" : ""}`}
                    onClick={col.sortable !== false ? () => handleSort(col.key) : undefined}
                  >
                    <span className="inline-flex items-center">
                      {col.header}
                      {col.sortable !== false && typeof col.header === "string" && (
                        <SortIcon colKey={col.key} />
                      )}
                    </span>
                  </th>
                ))}
                {(onEdit || onDelete || rowActions) && (
                  <th className="w-24 px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">
                    Thao tác
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (hasSelection ? 1 : 0) +
                      (onEdit || onDelete || rowActions ? 1 : 0)
                    }
                  >
                    <EmptyState
                      variant={isSearchActive ? "search" : "empty"}
                      title={emptyTitle || emptyText}
                      description={emptyDescription}
                      icon={emptyIcon}
                    />
                  </td>
                </tr>
              ) : (
                paginated.map((row) => (
                  <tr
                    key={row.id}
                    className={`border-b last:border-0 transition-colors ${
                      selectedIds?.has(row.id)
                        ? "bg-primary/5"
                        : "hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                    }`}
                  >
                    {hasSelection && (
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds!.has(row.id)}
                          onChange={() => toggleOne(row.id)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 ${col.className || ""}`}
                      >
                        {col.render
                          ? col.render(row)
                          : String(
                              (row as Record<string, unknown>)[col.key] ?? "",
                            )}
                      </td>
                    ))}
                    {(onEdit || onDelete || rowActions) && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {rowActions?.(row)}
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onEdit(row)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive h-8 w-8"
                              onClick={() => onDelete(row)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Sticky Pagination Controls ─── */}
      {pageSizeState > 0 && totalPages > 1 && (
        <div className="sticky bottom-0 z-10 flex items-center justify-between border-t bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm px-4 py-2.5 text-sm -mx-0 mt-3 rounded-b-lg">
          <span className="text-muted-foreground text-xs">
            Hiển thị {(safeCurrentPage - 1) * effectivePageSize + 1}–
            {Math.min(safeCurrentPage * effectivePageSize, totalItems)} / {totalItems}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(1)}
              disabled={safeCurrentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-xs font-medium">
              {safeCurrentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(totalPages)}
              disabled={safeCurrentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Bulk Action Bar ──────────────────────────────────────────────────────── */

interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  children: React.ReactNode;
}

export function BulkActionBar({ selectedCount, onClear, children }: BulkActionBarProps) {
  if (selectedCount === 0) return null;
  return (
    <div className="flex items-center gap-3 rounded-sm border border-primary/20 bg-primary/5 dark:border-primary/30 dark:bg-primary/10 p-3 animate-in slide-in-from-top-2 duration-200">
      <span className="text-sm font-medium text-primary dark:text-primary">
        {selectedCount} đã chọn
      </span>
      <div className="flex gap-2">{children}</div>
      <button
        onClick={onClear}
        className="ml-auto text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400"
      >
        Bỏ chọn
      </button>
    </div>
  );
}

/* ─── Page Header ──────────────────────────────────────────────────────────── */

interface PageHeaderProps {
  title: string;
  description?: string;
  onAdd?: () => void;
  addLabel?: string;
}

export function PageHeader({
  title,
  description,
  onAdd,
  addLabel = "Thêm mới",
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {onAdd && (
        <Button onClick={onAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
      )}
    </div>
  );
}

/* ─── Confirm Delete Dialog ────────────────────────────────────────────────── */

interface ConfirmDeleteProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  loading?: boolean;
}

export function ConfirmDelete({
  open,
  onClose,
  onConfirm,
  title = "mục này",
  loading = false,
}: ConfirmDeleteProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Bạn có chắc muốn xóa <strong>{title}</strong>? Hành động này không thể
          hoàn tác.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? "Đang xóa..." : "Xóa"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Form Field Helpers ───────────────────────────────────────────────────── */

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export function Field({ label, required, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
    </div>
  );
}

/* ─── Form Dialog (Legacy — small modal) ───────────────────────────────────── */

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  submitLabel?: string;
}

export function FormDialog({
  open,
  onClose,
  title,
  children,
  onSubmit,
  loading = false,
  submitLabel = "Lưu",
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : submitLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Form Sheet (Large 80% side-sheet) ────────────────────────────────────── */

interface FormSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  submitLabel?: string;
}

export function FormSheet({
  open,
  onClose,
  title,
  subtitle,
  children,
  onSubmit,
  loading = false,
  submitLabel = "Lưu",
}: FormSheetProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="!max-w-[90vw] h-[92vh] flex flex-col !p-0 !gap-0"
        showCloseButton={false}
      >
        <form onSubmit={onSubmit} className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="border-b px-6 py-3 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-base">
                  {title}
                  {subtitle && (
                    <span className="text-muted-foreground font-normal ml-2">
                      — {subtitle}
                    </span>
                  )}
                </DialogTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  disabled={loading}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading}
                  className="min-w-[100px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Lưu...
                    </>
                  ) : (
                    `💾 ${submitLabel}`
                  )}
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Body */}
          <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Status Badge ─────────────────────────────────────────────────────────── */

export function StatusBadge({ active }: { active: boolean | number }) {
  const isActive = active === true || active === 1;
  return (
    <span
      className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ${
        isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
      }`}
    >
      {isActive ? "Công khai" : "Chờ duyệt"}
    </span>
  );
}
