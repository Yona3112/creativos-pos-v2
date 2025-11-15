import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Productos from "./pages/Productos";
import Clientes from "./pages/Clientes";
import Cotizaciones from "./pages/Cotizaciones";
import Reportes from "./pages/Reportes";
import Ventas from "./pages/Ventas";
import Factura from "./pages/Factura";
import NotasCredito from "./pages/NotasCredito";
import CorteCaja from "./pages/CorteCaja";
import Usuarios from "./pages/Usuarios";
import Configuracion from "./pages/Configuracion";
import Credito from "./pages/Credito";
import Promociones from "./pages/Promociones";
import Consumibles from "./pages/Consumibles";
import LibrosSAR from "./pages/LibrosSAR";
import Catalogo from "./pages/Catalogo";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/pos" component={POS} />
      <Route path="/productos" component={Productos} />
      <Route path="/clientes" component={Clientes} />
      <Route path="/cotizaciones" component={Cotizaciones} />
      <Route path="/reportes" component={Reportes} />
      <Route path="/ventas" component={Ventas} />
      <Route path="/factura/:id" component={Factura} />
      <Route path="/notas-credito" component={NotasCredito} />
      <Route path="/corte-caja" component={CorteCaja} />
      <Route path="/usuarios" component={Usuarios} />
      <Route path="/configuracion" component={Configuracion} />
      <Route path="/credito" component={Credito} />
      <Route path="/promociones" component={Promociones} />
      <Route path="/consumibles" component={Consumibles} />
      <Route path="/libros-sar" component={LibrosSAR} />
      <Route path="/catalogo" component={Catalogo} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
