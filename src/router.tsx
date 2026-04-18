import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/ui/loading-spinner";
import { ErrorBoundary } from "./components/ui/error-boundary";

// Admin layout wrapper
import AdminLayout from "./components/admin/AdminLayout";
import { AuthProvider } from "./contexts/AuthContext";

/* ─── Lazy-load helper ─── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lazyRoute(Component: React.LazyExoticComponent<React.ComponentType<any>>) {
  return {
    element: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Component />
        </Suspense>
      </ErrorBoundary>
    ),
  };
}

/* ─── Lazy-loaded Pages ─── */

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Solutions = lazy(() => import("./pages/Solutions"));
const SolutionDetail = lazy(() => import("./pages/SolutionDetail"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const QuoteCart = lazy(() => import("./pages/QuoteCart"));

/* ─── Lazy-loaded Admin Pages ─── */

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminBrands = lazy(() => import("./pages/admin/AdminBrands"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminPosts = lazy(() => import("./pages/admin/AdminPosts"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));
const AdminPartners = lazy(() => import("./pages/admin/AdminPartners"));
const AdminContacts = lazy(() => import("./pages/admin/AdminContacts"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminFeatures = lazy(() => import("./pages/admin/AdminFeatures"));
const AdminQuotations = lazy(() => import("./pages/admin/AdminQuotations"));
const AdminSolutions = lazy(() => import("./pages/admin/AdminSolutions"));

/* ─── Router ─── */

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, ...lazyRoute(Home) },
      { path: "gioi-thieu", ...lazyRoute(About) },
      { path: "giai-phap", ...lazyRoute(Solutions) },
      { path: "giai-phap/:slug", ...lazyRoute(SolutionDetail) },
      { path: "san-pham", ...lazyRoute(Products) },
      { path: "san-pham/:slug", ...lazyRoute(ProductDetail) },
      { path: "du-an", ...lazyRoute(Projects) },
      { path: "du-an/:slug", ...lazyRoute(ProjectDetail) },
      { path: "tin-tuc", ...lazyRoute(Blog) },
      { path: "tin-tuc/:slug", ...lazyRoute(BlogPost) },
      { path: "thu-vien", ...lazyRoute(Gallery) },
      { path: "gio-hang-bao-gia", ...lazyRoute(QuoteCart) },
      { path: "lien-he", ...lazyRoute(Contact) },
      { path: "*", ...lazyRoute(NotFound) },
    ],
  },
  // Admin login (no layout wrapper)
  {
    path: "admin/login",
    element: (
      <AuthProvider>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <AdminLogin />
          </Suspense>
        </ErrorBoundary>
      </AuthProvider>
    ),
  },
  // Admin panel
  {
    path: "admin",
    element: (
      <AuthProvider>
        <AdminLayout />
      </AuthProvider>
    ),
    children: [
      { index: true, ...lazyRoute(AdminDashboard) },
      { path: "projects", ...lazyRoute(AdminProjects) },
      { path: "products", ...lazyRoute(AdminProducts) },
      { path: "brands", ...lazyRoute(AdminBrands) },
      { path: "categories", ...lazyRoute(AdminCategories) },
      { path: "posts", ...lazyRoute(AdminPosts) },
      { path: "gallery", ...lazyRoute(AdminGallery) },
      { path: "partners", ...lazyRoute(AdminPartners) },
      { path: "contacts", ...lazyRoute(AdminContacts) },
      { path: "settings", ...lazyRoute(AdminSettings) },
      { path: "features", ...lazyRoute(AdminFeatures) },
      { path: "quotations", ...lazyRoute(AdminQuotations) },
      { path: "solutions", ...lazyRoute(AdminSolutions) },
    ],
  },
]);
