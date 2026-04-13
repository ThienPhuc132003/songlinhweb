import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import { loginWithKey, logoutSession, checkSession } from "@/lib/admin-api";

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

  // Check existing session cookie on mount via /api/admin/me
  useEffect(() => {
    checkSession()
      .then((valid) => setAuth(valid))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (key: string) => {
    try {
      const success = await loginWithKey(key);
      setAuth(success);
      return success;
    } catch {
      setAuth(false);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutSession();
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

