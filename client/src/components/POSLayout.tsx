import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  BarChart3,
  FileText,
  LogOut,
  Menu,
  Package,
  Receipt,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

interface POSLayoutProps {
  children: React.ReactNode;
}

export default function POSLayout({ children }: POSLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: config } = trpc.configuracion.obtener.useQuery();
  const nombreTienda = config?.nombreTienda || "Creativos Gift Shop POS v2.0";

  const menuItems = [
    { icon: ShoppingCart, label: "Punto de Venta", path: "/pos" },
    { icon: Package, label: "Productos", path: "/productos" },
    { icon: Users, label: "Clientes", path: "/clientes" },
    { icon: FileText, label: "Cotizaciones", path: "/cotizaciones" },
    { icon: Receipt, label: "Historial Ventas", path: "/ventas" },
    { icon: BarChart3, label: "Reportes", path: "/reportes" },
    { label: "---", path: "" },
    { icon: FileText, label: "Notas de Crédito", path: "/notas-credito" },
    { icon: Receipt, label: "Corte de Caja", path: "/corte-caja" },
    { icon: FileText, label: "Crédito", path: "/credito" },
    { icon: FileText, label: "Promociones", path: "/promociones" },
    { icon: Package, label: "Consumibles", path: "/consumibles" },
    { icon: FileText, label: "Libros SAR", path: "/libros-sar" },
    { icon: Users, label: "Usuarios", path: "/usuarios" },
    { icon: BarChart3, label: "Configuración", path: "/configuracion" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white border-r border-gray-200 flex flex-col
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {APP_LOGO && (
              <img src={APP_LOGO} alt="Logo" className="w-10 h-10 rounded" />
            )}
            <div>
              <h1 className="text-lg font-bold text-gray-900">{nombreTienda}</h1>
              <p className="text-xs text-gray-500">Sistema POS</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item, idx) => {
            if (item.label === "---") {
              return <div key={`sep-${idx}`} className="border-t border-gray-200 my-2" />;
            }
            
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path}>
                <a
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
                  <span className="truncate">{item.label}</span>
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.nombre || user?.email}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
