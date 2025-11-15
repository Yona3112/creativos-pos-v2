import { useState } from "react";
import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Trash2, Plus, Minus, Package, ShoppingCart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import VentaDialog from "@/components/dialogs/VentaDialog";
import { desglosarTotal } from "@shared/utils/isv";

interface CartItem {
  productoId: number;
  codigo: string;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

export default function POS() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [showVentaDialog, setShowVentaDialog] = useState(false);

  // Queries
  const { data: productos } = trpc.productos.getAll.useQuery({
    search: searchQuery,
    activo: true,
    limit: 20,
  });

  // Calcular totales (el precio ya incluye ISV)
  const totalConISV = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const { subtotal, isv: impuesto, total } = desglosarTotal(totalConISV);

  // Agregar producto al carrito
  const addToCart = (producto: { id: number; codigo: string; nombre: string; precio: number }) => {
    const existingItem = cart.find(item => item.productoId === producto.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.productoId === producto.id
          ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * item.precio }
          : item
      ));
    } else {
      setCart([...cart, {
        productoId: producto.id,
        codigo: producto.codigo,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        subtotal: producto.precio,
      }]);
    }
  };

  // Actualizar cantidad
  const updateQuantity = (productoId: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.productoId === productoId) {
        const newQuantity = Math.max(1, item.cantidad + delta);
        return { ...item, cantidad: newQuantity, subtotal: newQuantity * item.precio };
      }
      return item;
    }));
  };

  // Eliminar del carrito
  const removeFromCart = (productoId: number) => {
    setCart(cart.filter(item => item.productoId !== productoId));
  };

  // Procesar venta
  const procesarVenta = () => {
    if (cart.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }
    setShowVentaDialog(true);
  };

  const handleVentaSuccess = () => {
    setCart([]);
  };

  return (
    <POSLayout>
      <div className="h-full flex">
        {/* Panel izquierdo - Productos */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Punto de Venta</h2>
            
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar producto por nombre o código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productos?.map((producto) => (
              <Card
                key={producto.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => addToCart(producto)}
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  {producto.imagen ? (
                    <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Package className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
                  {producto.nombre}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{producto.codigo}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    L {producto.precio.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">
                    Stock: {producto.stock}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Panel derecho - Carrito */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Carrito de Compra</h3>
          </div>

          {/* Items del carrito */}
          <div className="flex-1 overflow-auto p-4 space-y-2">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>El carrito está vacío</p>
              </div>
            ) : (
              cart.map((item) => (
                <Card key={item.productoId} className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 truncate">
                        {item.nombre}
                      </h4>
                      <p className="text-xs text-gray-500">{item.codigo}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.productoId)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productoId, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.cantidad}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productoId, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <span className="font-bold text-blue-600">
                      L {item.subtotal.toFixed(2)}
                    </span>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Totales y botones */}
          <div className="p-6 border-t border-gray-200 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">L {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ISV (15%):</span>
                <span className="font-medium">L {impuesto.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span className="text-blue-600">L {total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={procesarVenta}
              disabled={cart.length === 0}
            >
              Procesar Venta
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setCart([])}
              disabled={cart.length === 0}
            >
              Limpiar Carrito
            </Button>
          </div>
        </div>
      </div>

      <VentaDialog
        open={showVentaDialog}
        onClose={() => setShowVentaDialog(false)}
        cart={cart}
        subtotal={subtotal}
        impuesto={impuesto}
        total={total}
        onSuccess={handleVentaSuccess}
      />
    </POSLayout>
  );
}
