import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface Usuario {
  id: number;
  nombre: string | null;
  email: string | null;
  rol: "admin" | "vendedor" | "gerente";
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar token del localStorage al iniciar
    const storedToken = localStorage.getItem("pos_token");
    if (storedToken) {
      setToken(storedToken);
      // Aquí se podría verificar el token con el backend
      // Por ahora, asumimos que es válido
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Esta función será implementada con tRPC
    // Por ahora, es un placeholder
    console.log("Login:", email, password);
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem("pos_token");
    localStorage.removeItem("pos_usuario");
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
