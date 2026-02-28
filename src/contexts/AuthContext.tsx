import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import { hasApiKey, setApiKey, clearApiKey, adminApi } from "@/lib/admin-api";

interface AuthContext {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (key: string) => Promise<boolean>;
  logout: () => void;
}

const AuthCtx = createContext<AuthContext>({
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuth] = useState(false);
  const [isLoading, setLoading] = useState(true);

  // Check existing key on mount
  useEffect(() => {
    if (hasApiKey()) {
      adminApi
        .verify()
        .then(() => setAuth(true))
        .catch(() => {
          clearApiKey();
          setAuth(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (key: string) => {
    setApiKey(key);
    try {
      await adminApi.verify();
      setAuth(true);
      return true;
    } catch {
      clearApiKey();
      setAuth(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    clearApiKey();
    setAuth(false);
  }, []);

  return (
    <AuthCtx.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
