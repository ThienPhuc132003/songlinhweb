import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { CartProvider } from "./contexts/CartContext";
import { CompareProvider } from "./contexts/CompareContext";
import { router } from "./router";
import "./styles/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

import { hydrateRoot } from "react-dom/client";

const rootElement = document.getElementById("root")!;
const app = (
  <StrictMode>
    <ThemeProvider>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <CompareProvider>
              <RouterProvider router={router} />
            </CompareProvider>
          </CartProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ThemeProvider>
  </StrictMode>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
