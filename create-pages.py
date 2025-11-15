import os

pages_dir = "client/src/pages"

# Definir todas las páginas a crear
pages = {
    "NotasCredito.tsx": """import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Plus } from "lucide-react";

export default function NotasCredito() {
  const { data: notas, isLoading } = trpc.notasCredito.listar.useQuery();

  return (
    <POSLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notas de Crédito</h1>
            <p className="text-gray-500 mt-1">Gestión de devoluciones y notas de crédito</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Nota
          </Button>
        </div>

        <Card className="p-6">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Venta</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notas?.map((nota: any) => (
                  <TableRow key={nota.id}>
                    <TableCell className="font-medium">{nota.numeroNota}</TableCell>
                    <TableCell>#{nota.ventaId}</TableCell>
                    <TableCell>{nota.motivo}</TableCell>
                    <TableCell>L {nota.monto.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        nota.estado === 'aplicada' ? 'bg-green-100 text-green-800' :
                        nota.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {nota.estado}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(nota.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </POSLayout>
  );
}
""",

    "CorteCaja.tsx": """import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { DollarSign } from "lucide-react";

export default function CorteCaja() {
  const { user } = useAuth();
  const { data: cajaActual } = trpc.cortesCaja.actual.useQuery({ usuarioId: user?.id || 0 });
  const abrirCaja = trpc.cortesCaja.abrir.useMutation();
  const cerrarCaja = trpc.cortesCaja.cerrar.useMutation();

  return (
    <POSLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Corte de Caja</h1>

        {cajaActual?.estado === 'abierto' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Monto Inicial</h3>
              <p className="text-2xl font-bold">L {cajaActual.montoInicial.toFixed(2)}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Ventas</h3>
              <p className="text-2xl font-bold text-green-600">L {cajaActual.totalVentas.toFixed(2)}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Monto Esperado</h3>
              <p className="text-2xl font-bold">L {cajaActual.montoEsperado.toFixed(2)}</p>
            </Card>
            
            <Card className="p-6 col-span-full">
              <h3 className="font-semibold mb-4">Cerrar Caja</h3>
              <Button onClick={() => {
                const montoReal = prompt("Ingrese el monto real en caja:");
                if (montoReal) {
                  cerrarCaja.mutate({ id: cajaActual.id, montoReal: parseFloat(montoReal) });
                }
              }}>
                Cerrar Caja
              </Button>
            </Card>
          </div>
        ) : (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Abrir Caja</h3>
            <Button onClick={() => {
              const montoInicial = prompt("Ingrese el monto inicial:");
              if (montoInicial && user) {
                abrirCaja.mutate({ usuarioId: user.id, montoInicial: parseFloat(montoInicial) });
              }
            }}>
              <DollarSign className="w-4 h-4 mr-2" />
              Abrir Caja
            </Button>
          </Card>
        )}
      </div>
    </POSLayout>
  );
}
""",

    "Usuarios.tsx": """import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Plus, Trash2 } from "lucide-react";

export default function Usuarios() {
  const { data: usuarios, isLoading } = trpc.usuarios.listar.useQuery();
  const eliminar = trpc.usuarios.eliminar.useMutation();

  return (
    <POSLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
            <p className="text-gray-500 mt-1">Gestión de usuarios del sistema</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>

        <Card className="p-6">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios?.map((usuario: any) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">{usuario.nombre}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 capitalize">
                        {usuario.rol}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminar.mutate({ id: usuario.id })}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </POSLayout>
  );
}
""",

    "Configuracion.tsx": """import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function Configuracion() {
  const { data: config } = trpc.configuracion.obtener.useQuery();
  const actualizar = trpc.configuracion.actualizar.useMutation();
  
  const [formData, setFormData] = useState({
    nombreEmpresa: "",
    rtn: "",
    telefono: "",
    email: "",
    direccion: "",
    tasaImpuesto: 0.15,
  });

  return (
    <POSLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Configuración</h1>

        <Card className="p-6 max-w-2xl">
          <div className="space-y-4">
            <div>
              <Label>Nombre de Empresa</Label>
              <Input
                value={config?.nombreEmpresa || formData.nombreEmpresa}
                onChange={(e) => setFormData({ ...formData, nombreEmpresa: e.target.value })}
              />
            </div>
            <div>
              <Label>RTN</Label>
              <Input
                value={config?.rtn || formData.rtn}
                onChange={(e) => setFormData({ ...formData, rtn: e.target.value })}
              />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input
                value={config?.telefono || formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={config?.email || formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Dirección</Label>
              <Input
                value={config?.direccion || formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              />
            </div>
            <div>
              <Label>Tasa de Impuesto (ISV)</Label>
              <Input
                type="number"
                step="0.01"
                value={config?.tasaImpuesto || formData.tasaImpuesto}
                onChange={(e) => setFormData({ ...formData, tasaImpuesto: parseFloat(e.target.value) })}
              />
            </div>
            
            <Button onClick={() => actualizar.mutate(formData)}>
              Guardar Configuración
            </Button>
          </div>
        </Card>
      </div>
    </POSLayout>
  );
}
""",

    "Credito.tsx": """import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { DollarSign } from "lucide-react";

export default function Credito() {
  const { data: creditos, isLoading } = trpc.credito.listarPendientes.useQuery();
  const registrarPago = trpc.credito.registrarPago.useMutation();

  return (
    <POSLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Ventas a Crédito</h1>

        <Card className="p-6">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Monto Total</TableHead>
                  <TableHead>Pagado</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditos?.map((credito: any) => (
                  <TableRow key={credito.id}>
                    <TableCell className="font-medium">Cliente #{credito.clienteId}</TableCell>
                    <TableCell>L {credito.montoTotal.toFixed(2)}</TableCell>
                    <TableCell>L {credito.montoPagado.toFixed(2)}</TableCell>
                    <TableCell className="font-bold text-red-600">L {credito.saldo.toFixed(2)}</TableCell>
                    <TableCell>{new Date(credito.fechaVencimiento).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        credito.estado === 'pagado' ? 'bg-green-100 text-green-800' :
                        credito.estado === 'vencido' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {credito.estado}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => {
                          const monto = prompt("Monto del pago:");
                          if (monto) {
                            registrarPago.mutate({
                              ventaCreditoId: credito.id,
                              monto: parseFloat(monto),
                              metodoPago: "efectivo"
                            });
                          }
                        }}
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        Pagar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </POSLayout>
  );
}
""",

    "Promociones.tsx": """import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Plus, X } from "lucide-react";

export default function Promociones() {
  const { data: promociones, isLoading } = trpc.promociones.listarActivas.useQuery();
  const desactivar = trpc.promociones.desactivar.useMutation();

  return (
    <POSLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Promociones</h1>
            <p className="text-gray-500 mt-1">Gestión de descuentos y promociones</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Promoción
          </Button>
        </div>

        <Card className="p-6">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Aplica A</TableHead>
                  <TableHead>Vigencia</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promociones?.map((promo: any) => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-medium">{promo.nombre}</TableCell>
                    <TableCell className="capitalize">{promo.tipo}</TableCell>
                    <TableCell>
                      {promo.tipo === 'porcentaje' ? `${promo.valor}%` : `L ${promo.valor}`}
                    </TableCell>
                    <TableCell className="capitalize">{promo.aplicaA}</TableCell>
                    <TableCell>
                      {new Date(promo.fechaInicio).toLocaleDateString()} - {new Date(promo.fechaFin).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => desactivar.mutate({ id: promo.id })}
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </POSLayout>
  );
}
""",

    "Consumibles.tsx": """import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Plus } from "lucide-react";

export default function Consumibles() {
  const { data: consumibles, isLoading } = trpc.consumibles.listar.useQuery();

  return (
    <POSLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Consumibles</h1>
            <p className="text-gray-500 mt-1">Control de productos consumibles</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Consumible
          </Button>
        </div>

        <Card className="p-6">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Cant. por Unidad</TableHead>
                  <TableHead>Stock Actual</TableHead>
                  <TableHead>Stock Mínimo</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consumibles?.map((consumible: any) => (
                  <TableRow key={consumible.id}>
                    <TableCell className="font-medium">Producto #{consumible.productoId}</TableCell>
                    <TableCell>{consumible.unidadMedida}</TableCell>
                    <TableCell>{consumible.cantidadPorUnidad}</TableCell>
                    <TableCell>{consumible.stockActual}</TableCell>
                    <TableCell>{consumible.stockMinimo || "N/A"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        consumible.stockActual <= (consumible.stockMinimo || 0)
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {consumible.stockActual <= (consumible.stockMinimo || 0) ? 'Bajo' : 'OK'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </POSLayout>
  );
}
""",

    "LibrosSAR.tsx": """import POSLayout from "@/components/POSLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { FileText } from "lucide-react";

export default function LibrosSAR() {
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date());
  
  const { data: libro, isLoading } = trpc.librosSAR.obtenerLibroVentas.useQuery({
    fechaInicio,
    fechaFin
  });

  return (
    <POSLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Libros SAR</h1>
            <p className="text-gray-500 mt-1">Registro contable para SAR Honduras</p>
          </div>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        <Card className="p-6">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Factura</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>RTN</TableHead>
                  <TableHead>Exentas</TableHead>
                  <TableHead>Gravadas 15%</TableHead>
                  <TableHead>ISV 15%</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {libro?.map((registro: any) => (
                  <TableRow key={registro.id}>
                    <TableCell>{new Date(registro.fecha).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{registro.numeroFactura}</TableCell>
                    <TableCell>{registro.clienteNombre}</TableCell>
                    <TableCell>{registro.clienteRTN || "N/A"}</TableCell>
                    <TableCell>L {registro.exentas.toFixed(2)}</TableCell>
                    <TableCell>L {registro.gravadas15.toFixed(2)}</TableCell>
                    <TableCell>L {registro.isv15.toFixed(2)}</TableCell>
                    <TableCell className="font-bold">L {registro.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </POSLayout>
  );
}
""",

    "Catalogo.tsx": """import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ShoppingCart } from "lucide-react";

export default function Catalogo() {
  const { data: productos, isLoading } = trpc.productos.listar.useQuery();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
          <p className="text-gray-500 mt-1">Creativos Gift Shop</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <p>Cargando productos...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productos?.map((producto: any) => (
              <Card key={producto.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <ShoppingCart className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{producto.nombre}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{producto.descripcion}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    L {producto.precio.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {producto.stock}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
"""
}

# Crear todas las páginas
for filename, content in pages.items():
    filepath = os.path.join(pages_dir, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ Creado: {filename}")

print(f"\n✅ {len(pages)} páginas creadas exitosamente")
