import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Package, Search, X, Plus, Minus, Trash2, Send } from "lucide-react";
import { APP_LOGO } from "@/const";
import { toast } from "sonner";
import CotizacionDialog from "@/components/dialogs/CotizacionCatalogoDialog";

interface CartItem {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
}

export default function Catalogo() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCotizacionDialog, setShowCotizacionDialog] = useState(false);

  const { data: productos, isLoading } = trpc.productos.getAll.useQuery({
    activo: true,
    limit: 100,
  });

  // Obtener categorías únicas
  const categories = useMemo(() => {
    if (!productos) return [];
    const cats = new Set(productos.map(p => p.categoria || "General"));
    return Array.from(cats).sort();
  }, [productos]);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    if (!productos) return [];

    return productos.filter((producto) => {
      // Búsqueda por nombre
      const matchesSearch = producto.nombre.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro por categoría
      const matchesCategory =
        selectedCategory === "all" || producto.categoria === selectedCategory;

      // Filtro por rango de precio
      let matchesPrice = true;
      if (priceRange === "0-50") matchesPrice = producto.precio <= 50;
      else if (priceRange === "50-100") matchesPrice = producto.precio > 50 && producto.precio <= 100;
      else if (priceRange === "100-200") matchesPrice = producto.precio > 100 && producto.precio <= 200;
      else if (priceRange === "200+") matchesPrice = producto.precio > 200;

      // Filtro por disponibilidad
      let matchesStock = true;
      if (stockFilter === "in-stock") matchesStock = producto.stock > (producto.stockMinimo || 0);
      else if (stockFilter === "low-stock") matchesStock = producto.stock <= (producto.stockMinimo || 0) && producto.stock > 0;
      else if (stockFilter === "out-of-stock") matchesStock = producto.stock === 0;

      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    });
  }, [productos, searchQuery, selectedCategory, priceRange, stockFilter]);

  // Limpiar filtros
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange("all");
    setStockFilter("all");
  };

  // Funciones del carrito
  const addToCart = (producto: NonNullable<typeof productos>[number]) => {
    const existingItem = cart.find(item => item.productoId === producto.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.productoId === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productoId: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        imagen: producto.imagen || undefined,
      }]);
    }
    
    toast.success(`${producto.nombre} agregado al carrito`);
    setShowCart(true);
  };

  const updateQuantity = (productoId: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.productoId === productoId) {
        const newQuantity = Math.max(1, item.cantidad + delta);
        return { ...item, cantidad: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (productoId: number) => {
    setCart(cart.filter(item => item.productoId !== productoId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-6 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <img src={APP_LOGO} alt="Logo" className="w-10 h-10" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
                <p className="text-gray-500 text-sm mt-1">Creativos Gift Shop - Todos nuestros productos disponibles</p>
              </div>
            </div>
            
            {/* Botón del carrito */}
            <Button
              onClick={() => setShowCart(!showCart)}
              className="relative"
              variant="outline"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Carrito
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filtros */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Nombre del producto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Categoría */}
            <div>
              <Label>Categoría</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rango de Precio */}
            <div>
              <Label>Precio</Label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="0-50">L 0 - L 50</SelectItem>
                  <SelectItem value="50-100">L 50 - L 100</SelectItem>
                  <SelectItem value="100-200">L 100 - L 200</SelectItem>
                  <SelectItem value="200+">L 200+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Disponibilidad */}
            <div>
              <Label>Disponibilidad</Label>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="in-stock">En Stock</SelectItem>
                  <SelectItem value="low-stock">Stock Bajo</SelectItem>
                  <SelectItem value="out-of-stock">Agotado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              {filteredProducts?.length || 0} producto(s) encontrado(s)
            </p>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Limpiar filtros
            </Button>
          </div>
        </Card>

        {/* Grid de productos */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando productos...</p>
            </div>
          </div>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((producto) => (
              <Card key={producto.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {producto.imagen ? (
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  {producto.stock <= (producto.stockMinimo || 0) && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Stock bajo
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      {producto.categoria || "General"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                    {producto.nombre}
                  </h3>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">
                        L {producto.precio.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500 block">Disponible</span>
                      <span className={`text-sm font-medium ${
                        producto.stock > (producto.stockMinimo || 0) ? "text-green-600" : "text-red-600"
                      }`}>
                        {producto.stock} unidades
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => addToCart(producto)}
                    className="w-full mt-4"
                    disabled={producto.stock === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {producto.stock === 0 ? "Agotado" : "Agregar al carrito"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No se encontraron productos con los filtros seleccionados</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </div>
        )}
      </main>

      {/* Panel del carrito */}
      {showCart && (
        <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col">
          <div className="p-4 border-b flex items-center justify-between bg-blue-600 text-white">
            <h2 className="text-xl font-bold">Carrito de Compras</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowCart(false)} className="text-white hover:bg-blue-700">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <Card key={item.productoId} className="p-4">
                    <div className="flex gap-3">
                      {item.imagen ? (
                        <img src={item.imagen} alt={item.nombre} className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm line-clamp-2">{item.nombre}</h3>
                        <p className="text-blue-600 font-bold mt-1">L {item.precio.toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.productoId, -1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="font-medium">{item.cantidad}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.productoId, 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCart(item.productoId)}
                            className="ml-auto text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-lg">Total:</span>
                <span className="text-2xl font-bold text-blue-600">L {cartTotal.toFixed(2)}</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  setShowCotizacionDialog(true);
                  setShowCart(false);
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                Solicitar Cotización
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Diálogo de cotización */}
      <CotizacionDialog
        open={showCotizacionDialog}
        onClose={() => setShowCotizacionDialog(false)}
        cart={cart}
        total={cartTotal}
        onSuccess={() => {
          setCart([]);
          setShowCotizacionDialog(false);
        }}
      />

      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2024 Creativos Gift Shop. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
