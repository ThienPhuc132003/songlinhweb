import { Outlet, NavLink, Navigate, useNavigate, useLocation } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import {
  LayoutDashboard,
  Package,
  FolderKanban,
  Layers,
  FileText,
  Image,
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
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/admin-api";

/** Product sub-module routes (Catalog Management) */
const productSubItems = [
  { to: "/admin/products", icon: List, label: "Danh sách sản phẩm" },
  { to: "/admin/brands", icon: Tags, label: "Thương hiệu" },
  { to: "/admin/categories", icon: Layers, label: "Danh mục" },
  { to: "/admin/features", icon: Sparkles, label: "Tính năng" },
];

/** Inbox sub-module routes (Lead Management) */
const inboxSubItems = [
  { to: "/admin/quotations", icon: ClipboardList, label: "Yêu cầu báo giá" },
  { to: "/admin/contacts", icon: Mail, label: "Liên hệ" },
];

/** Top-level nav items (excluding product sub-items) */
const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/projects", icon: FolderKanban, label: "Dự án" },
];

const bottomNavItems = [
  { to: "/admin/posts", icon: FileText, label: "Tin tức & Kiến thức" },
  { to: "/admin/gallery", icon: Image, label: "Thư viện" },
  { to: "/admin/partners", icon: Handshake, label: "Đối tác" },
  { to: "/admin/settings", icon: Settings, label: "Cài đặt" },
];

/** Check if current path is a product sub-route (Catalog) */
function isProductRoute(pathname: string): boolean {
  return ["/admin/products", "/admin/brands", "/admin/categories", "/admin/features"]
    .some(p => pathname === p || pathname.startsWith(p + "/"));
}

/** Check if current path is an inbox sub-route (Leads) */
function isInboxRoute(pathname: string): boolean {
  return ["/admin/quotations", "/admin/contacts"]
    .some(p => pathname === p || pathname.startsWith(p + "/"));
}

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
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
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

export default function AdminLayout() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-expand product menu when on a product sub-route
  const [productMenuOpen, setProductMenuOpen] = useState(() =>
    isProductRoute(location.pathname),
  );

  // Auto-expand inbox menu when on an inbox sub-route
  const [inboxMenuOpen, setInboxMenuOpen] = useState(() =>
    isInboxRoute(location.pathname),
  );

  // Badge count for new quotation requests
  const [newQuoteCount, setNewQuoteCount] = useState(0);

  // Keep product menu open when navigating between sub-routes
  useEffect(() => {
    if (isProductRoute(location.pathname)) {
      setProductMenuOpen(true);
    }
    if (isInboxRoute(location.pathname)) {
      setInboxMenuOpen(true);
    }
  }, [location.pathname]);

  // Fetch count of "new" quotation requests for badge
  useEffect(() => {
    adminApi.quotations
      .list({ status: "new", limit: 1 })
      .then((r) => setNewQuoteCount(r.total))
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
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <span className="text-primary text-lg font-bold">Song Linh Admin</span>
          <button
            className="rounded p-1 hover:bg-slate-100 lg:hidden"
            onClick={closeMobileSidebar}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {/* Top nav items */}
          {navItems.map(({ to, icon, label, end }) => (
            <NavItem
              key={to}
              to={to}
              icon={icon}
              label={label}
              end={end}
              onClick={closeMobileSidebar}
            />
          ))}

          {/* ═══ Product Group (collapsible) ═══ */}
          <div>
            <button
              onClick={() => setProductMenuOpen(!productMenuOpen)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isProductRoute(location.pathname)
                  ? "bg-primary/5 text-primary"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Package className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Sản phẩm</span>
              {productMenuOpen ? (
                <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
              )}
            </button>

            {/* Sub-items with slide animation */}
            <div
              className={`overflow-hidden transition-all duration-200 ease-in-out ${
                productMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="ml-2 mt-0.5 space-y-0.5 border-l border-slate-200 pl-3">
                {productSubItems.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={closeMobileSidebar}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    }
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ Inbox Group (collapsible) ═══ */}
          <div>
            <button
              onClick={() => setInboxMenuOpen(!inboxMenuOpen)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isInboxRoute(location.pathname)
                  ? "bg-primary/5 text-primary"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Inbox className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Hộp thư</span>
              {newQuoteCount > 0 && (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                  {newQuoteCount > 99 ? "99+" : newQuoteCount}
                </span>
              )}
              {inboxMenuOpen ? (
                <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
              )}
            </button>

            {/* Sub-items with slide animation */}
            <div
              className={`overflow-hidden transition-all duration-200 ease-in-out ${
                inboxMenuOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="ml-2 mt-0.5 space-y-0.5 border-l border-slate-200 pl-3">
                {inboxSubItems.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={closeMobileSidebar}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    }
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {label}
                    {to === "/admin/quotations" && newQuoteCount > 0 && (
                      <span className="ml-auto inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                        {newQuoteCount > 99 ? "99+" : newQuoteCount}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom nav items */}
          {bottomNavItems.map(({ to, icon, label }) => (
            <NavItem
              key={to}
              to={to}
              icon={icon}
              label={label}
              onClick={closeMobileSidebar}
            />
          ))}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white px-4 lg:px-6">
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

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
