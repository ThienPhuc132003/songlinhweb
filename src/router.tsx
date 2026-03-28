import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/ui/loading-spinner";
import { ErrorBoundary } from "./components/ui/error-boundary";

// Lazy-load all page components for code splitting
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

// Admin pages
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

// Admin layout wrapper
import AdminLayout from "./components/admin/AdminLayout";
import { AuthProvider } from "./contexts/AuthContext";

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <Home />
          </SuspenseWrapper>
        ),
      },
      {
        path: "gioi-thieu",
        element: (
          <SuspenseWrapper>
            <About />
          </SuspenseWrapper>
        ),
      },
      {
        path: "giai-phap",
        element: (
          <SuspenseWrapper>
            <Solutions />
          </SuspenseWrapper>
        ),
      },
      {
        path: "giai-phap/:slug",
        element: (
          <SuspenseWrapper>
            <SolutionDetail />
          </SuspenseWrapper>
        ),
      },
      {
        path: "san-pham",
        element: (
          <SuspenseWrapper>
            <Products />
          </SuspenseWrapper>
        ),
      },
      {
        path: "san-pham/:slug",
        element: (
          <SuspenseWrapper>
            <ProductDetail />
          </SuspenseWrapper>
        ),
      },
      {
        path: "du-an",
        element: (
          <SuspenseWrapper>
            <Projects />
          </SuspenseWrapper>
        ),
      },
      {
        path: "du-an/:slug",
        element: (
          <SuspenseWrapper>
            <ProjectDetail />
          </SuspenseWrapper>
        ),
      },
      {
        path: "tin-tuc",
        element: (
          <SuspenseWrapper>
            <Blog />
          </SuspenseWrapper>
        ),
      },
      {
        path: "tin-tuc/:slug",
        element: (
          <SuspenseWrapper>
            <BlogPost />
          </SuspenseWrapper>
        ),
      },
      {
        path: "thu-vien",
        element: (
          <SuspenseWrapper>
            <Gallery />
          </SuspenseWrapper>
        ),
      },
      {
        path: "lien-he",
        element: (
          <SuspenseWrapper>
            <Contact />
          </SuspenseWrapper>
        ),
      },
      {
        path: "*",
        element: (
          <SuspenseWrapper>
            <NotFound />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  // Admin login (no layout wrapper)
  {
    path: "admin/login",
    element: (
      <AuthProvider>
        <SuspenseWrapper>
          <AdminLogin />
        </SuspenseWrapper>
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
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <AdminDashboard />
          </SuspenseWrapper>
        ),
      },
      {
        path: "projects",
        element: (
          <SuspenseWrapper>
            <AdminProjects />
          </SuspenseWrapper>
        ),
      },
      {
        path: "products",
        element: (
          <SuspenseWrapper>
            <AdminProducts />
          </SuspenseWrapper>
        ),
      },
      {
        path: "brands",
        element: (
          <SuspenseWrapper>
            <AdminBrands />
          </SuspenseWrapper>
        ),
      },
      {
        path: "categories",
        element: (
          <SuspenseWrapper>
            <AdminCategories />
          </SuspenseWrapper>
        ),
      },
      {
        path: "posts",
        element: (
          <SuspenseWrapper>
            <AdminPosts />
          </SuspenseWrapper>
        ),
      },
      {
        path: "gallery",
        element: (
          <SuspenseWrapper>
            <AdminGallery />
          </SuspenseWrapper>
        ),
      },
      {
        path: "partners",
        element: (
          <SuspenseWrapper>
            <AdminPartners />
          </SuspenseWrapper>
        ),
      },
      {
        path: "contacts",
        element: (
          <SuspenseWrapper>
            <AdminContacts />
          </SuspenseWrapper>
        ),
      },
      {
        path: "settings",
        element: (
          <SuspenseWrapper>
            <AdminSettings />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]);
