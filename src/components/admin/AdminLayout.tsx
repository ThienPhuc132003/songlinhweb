import { Outlet, NavLink, Navigate, useNavigate, useLocation } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import {
  LayoutDashboard,
  Package,
  FolderKanban,
  Layers,
  FileText,
  ImageIcon,
  Handshake,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  Tags,
  ChevronDown,
  ChevronRight,
  List,
  Sparkles,
  ClipboardList,
  Inbox,
  Newspaper,
  Lightbulb,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/admin-api";

/* ═══════════════════════════════════════════════════════════════════════════════
 * SIDEBAR NAV CONFIGURATION — Enterprise Control Center
 * Groups: Hộp thư (Inbox) → Sản phẩm (Products) → Nội dung (CMS) → Cài đặt
 * ═══════════════════════════════════════════════════════════════════════════════ */

/** Inbox sub-module routes (Lead Management) — PRIORITY: B2B leads first */
const inboxSubItems = [
  { to: "/admin/quotations", icon: ClipboardList, label: "Yêu cầu báo giá" },
  { to: "/admin/contacts", icon: Mail, label: "Liên hệ" },
];

/** Product sub-module routes (Catalog Management) */
const productSubItems = [
  { to: "/admin/products", icon: List, label: "Danh sách sản phẩm" },
  { to: "/admin/brands", icon: Tags, label: "Thương hiệu" },
  { to: "/admin/categories", icon: Layers, label: "Danh mục" },
  { to: "/admin/features", icon: Sparkles, label: "Tính năng" },
];

/** Content/CMS sub-module routes */
const contentSubItems = [
  { to: "/admin/solutions", icon: Lightbulb, label: "Giải pháp" },
  { to: "/admin/projects", icon: FolderKanban, label: "Dự án" },
  { to: "/admin/posts", icon: FileText, label: "Tin tức & Kiến thức" },
  { to: "/admin/gallery", icon: ImageIcon, label: "Thư viện ảnh" },
  { to: "/admin/partners", icon: Handshake, label: "Đối tác" },
];

/** Check if current path is an inbox sub-route (Leads) */
function isInboxRoute(pathname: string): boolean {
  return ["/admin/quotations", "/admin/contacts"]
    .some(p => pathname === p || pathname.startsWith(p + "/"));
}

/** Check if current path is a product sub-route (Catalog) */
function isProductRoute(pathname: string): boolean {
  return ["/admin/products", "/admin/brands", "/admin/categories", "/admin/features"]
    .some(p => pathname === p || pathname.startsWith(p + "/"));
}

/** Check if current path is a content/CMS sub-route */
function isContentRoute(pathname: string): boolean {
  return ["/admin/solutions", "/admin/projects", "/admin/posts", "/admin/gallery", "/admin/partners"]
    .some(p => pathname === p || pathname.startsWith(p + "/"));
}

/* ─── Sidebar Nav Item ───────────────────────────────────────────────────────── */

function NavItem({
  to,
  icon: Icon,
  label,
  end,
  onClick,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  end?: boolean;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </NavLink>
  );
}

/* ─── Collapsible Group ──────────────────────────────────────────────────────── */

interface CollapsibleGroupProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  isActive: boolean;
  badge?: number;
  items: Array<{ to: string; icon: React.ComponentType<{ className?: string }>; label: string }>;
  onItemClick?: () => void;
  /** Per-item badge config */
  itemBadges?: Record<string, number>;
}

function CollapsibleGroup({
  icon: GroupIcon,
  label,
  isOpen,
  onToggle,
  isActive,
  badge,
  items,
  onItemClick,
  itemBadges,
}: CollapsibleGroupProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-primary/5 text-primary"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <GroupIcon className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">{label}</span>
        {badge != null && badge > 0 && (
          <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
        {isOpen ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
        )}
      </button>

      {/* Sub-items with slide animation */}
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="ml-3 mt-0.5 space-y-0.5 border-l border-slate-200 pl-3">
          {items.map(({ to, icon: Icon, label: itemLabel }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onItemClick}
              className={({ isActive: itemActive }) =>
                `flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  itemActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {itemLabel}
              {itemBadges?.[to] != null && itemBadges[to] > 0 && (
                <span className="ml-auto inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {itemBadges[to] > 99 ? "99+" : itemBadges[to]}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
 * ADMIN LAYOUT
 * ═══════════════════════════════════════════════════════════════════════════════ */

export default function AdminLayout() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-expand menus when on a sub-route
  const [inboxMenuOpen, setInboxMenuOpen] = useState(() =>
    isInboxRoute(location.pathname),
  );
  const [productMenuOpen, setProductMenuOpen] = useState(() =>
    isProductRoute(location.pathname),
  );
  const [contentMenuOpen, setContentMenuOpen] = useState(() =>
    isContentRoute(location.pathname),
  );

  // Badge count for new quotation requests + contacts
  const [newQuoteCount, setNewQuoteCount] = useState(0);
  const [newContactCount, setNewContactCount] = useState(0);
  const totalInboxBadge = newQuoteCount + newContactCount;

  // Keep menus open when navigating between sub-routes
  useEffect(() => {
    if (isInboxRoute(location.pathname)) setInboxMenuOpen(true);
    if (isProductRoute(location.pathname)) setProductMenuOpen(true);
    if (isContentRoute(location.pathname)) setContentMenuOpen(true);
  }, [location.pathname]);

  // Fetch counts of "new" quotation requests + contacts for badge
  useEffect(() => {
    adminApi.quotations
      .list({ status: "new", limit: 1 })
      .then((r) => setNewQuoteCount(r.total))
      .catch(() => {});
    adminApi.contacts
      .list()
      .then((contacts) => {
        const newCount = contacts.filter((c) => c.status === "new").length;
        setNewContactCount(newCount);
      })
      .catch(() => {});
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const closeMobileSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 transform flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:relative lg:z-auto lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <LayoutDashboard className="h-4 w-4 text-primary" />
            </div>
            <span className="text-primary text-base font-bold tracking-tight">SLTECH</span>
          </div>
          <button
            className="rounded p-1 hover:bg-slate-100 lg:hidden"
            onClick={closeMobileSidebar}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {/* Dashboard */}
          <NavItem
            to="/admin"
            icon={LayoutDashboard}
            label="Dashboard"
            end
            onClick={closeMobileSidebar}
          />

          {/* ─── Section divider: Lead Management ─── */}
          <div className="px-4 pt-4 pb-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Quản lý
            </span>
          </div>

          {/* ═══ Hộp thư (Inbox/Leads) — FIRST for B2B priority ═══ */}
          <CollapsibleGroup
            icon={Inbox}
            label="Hộp thư"
            isOpen={inboxMenuOpen}
            onToggle={() => setInboxMenuOpen(!inboxMenuOpen)}
            isActive={isInboxRoute(location.pathname)}
            badge={totalInboxBadge}
            items={inboxSubItems}
            onItemClick={closeMobileSidebar}
            itemBadges={{ "/admin/quotations": newQuoteCount, "/admin/contacts": newContactCount }}
          />

          {/* ═══ Sản phẩm (Products/Catalog) ═══ */}
          <CollapsibleGroup
            icon={Package}
            label="Sản phẩm"
            isOpen={productMenuOpen}
            onToggle={() => setProductMenuOpen(!productMenuOpen)}
            isActive={isProductRoute(location.pathname)}
            items={productSubItems}
            onItemClick={closeMobileSidebar}
          />

          {/* ═══ Nội dung (CMS/Content) ═══ */}
          <CollapsibleGroup
            icon={Newspaper}
            label="Nội dung"
            isOpen={contentMenuOpen}
            onToggle={() => setContentMenuOpen(!contentMenuOpen)}
            isActive={isContentRoute(location.pathname)}
            items={contentSubItems}
            onItemClick={closeMobileSidebar}
          />

          {/* ─── Section divider: System ─── */}
          <div className="px-4 pt-4 pb-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Hệ thống
            </span>
          </div>

          {/* Settings */}
          <NavItem
            to="/admin/settings"
            icon={Settings}
            label="Cài đặt"
            onClick={closeMobileSidebar}
          />
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-200 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white/95 backdrop-blur-sm px-4 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary text-sm text-slate-500 transition-colors"
          >
            Xem website →
          </a>
        </header>

        {/* Page content — consistent 8px-grid padding */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
