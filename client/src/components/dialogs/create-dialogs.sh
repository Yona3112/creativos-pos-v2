#!/bin/bash

# 1. NotaCreditoDialog.tsx
cat > NotaCreditoDialog.tsx << 'EOF'
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

interface NotaCreditoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ventaId?: number;
}

export default function NotaCreditoDialog({
  open,
  onOpenChange,
  ventaId,
}: NotaCreditoDialogProps) {
  const [formData, setFormData] = useState({
    ventaId: ventaId || 0,
    motivo: "",
    monto: 0,
  });

  const crear = trpc.notasCredito.crear.useMutation({
    onSuccess: () => {
      onOpenChange(false);
      setFormData({ ventaId: 0, motivo: "", monto: 0 });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    crear.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nueva Nota de Crédito</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>ID de Venta</Label>
            <Input
              type="number"
              value={formData.ventaId}
              onChange={(e) =>
                setFormData({ ...formData, ventaId: parseInt(e.target.value) })
              }
              required
            />
          </div>
          <div>
            <Label>Motivo</Label>
            <Textarea
              value={formData.motivo}
              onChange={(e) =>
                setFormData({ ...formData, motivo: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label>Monto</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.monto}
              onChange={(e) =>
                setFormData({ ...formData, monto: parseFloat(e.target.value) })
              }
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={crear.isPending}>
              {crear.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
EOF

# 2. UsuarioDialog.tsx
cat > UsuarioDialog.tsx << 'EOF'
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useState } from "react";

interface UsuarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuarioId?: number;
}

export default function UsuarioDialog({
  open,
  onOpenChange,
  usuarioId,
}: UsuarioDialogProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "vendedor" as "admin" | "gerente" | "vendedor",
  });

  const crear = trpc.usuarios.crear.useMutation({
    onSuccess: () => {
      onOpenChange(false);
      setFormData({ nombre: "", email: "", password: "", rol: "vendedor" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    crear.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo Usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label>Rol</Label>
            <Select
              value={formData.rol}
              onValueChange={(value: any) =>
                setFormData({ ...formData, rol: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="gerente">Gerente</SelectItem>
                <SelectItem value="vendedor">Vendedor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={crear.isPending}>
              {crear.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
EOF

# 3. PromocionDialog.tsx
cat > PromocionDialog.tsx << 'EOF'
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useState } from "react";

interface PromocionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PromocionDialog({
  open,
  onOpenChange,
}: PromocionDialogProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "porcentaje" as "porcentaje" | "monto",
    valor: 0,
    aplicaA: "todos" as "todos" | "producto" | "cliente",
    fechaInicio: new Date(),
    fechaFin: new Date(),
  });

  const crear = trpc.promociones.crear.useMutation({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    crear.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nueva Promoción</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, tipo: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="porcentaje">Porcentaje</SelectItem>
                  <SelectItem value="monto">Monto Fijo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Valor</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) =>
                  setFormData({ ...formData, valor: parseFloat(e.target.value) })
                }
                required
              />
            </div>
          </div>
          <div>
            <Label>Aplica A</Label>
            <Select
              value={formData.aplicaA}
              onValueChange={(value: any) =>
                setFormData({ ...formData, aplicaA: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="producto">Producto Específico</SelectItem>
                <SelectItem value="cliente">Cliente Específico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fecha Inicio</Label>
              <Input
                type="date"
                value={formData.fechaInicio.toISOString().split("T")[0]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fechaInicio: new Date(e.target.value),
                  })
                }
                required
              />
            </div>
            <div>
              <Label>Fecha Fin</Label>
              <Input
                type="date"
                value={formData.fechaFin.toISOString().split("T")[0]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fechaFin: new Date(e.target.value),
                  })
                }
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={crear.isPending}>
              {crear.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
EOF

# 4. ConsumibleDialog.tsx
cat > ConsumibleDialog.tsx << 'EOF'
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

interface ConsumibleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ConsumibleDialog({
  open,
  onOpenChange,
}: ConsumibleDialogProps) {
  const [formData, setFormData] = useState({
    productoId: 0,
    unidadMedida: "",
    cantidadPorUnidad: 1,
    stockActual: 0,
    stockMinimo: 0,
  });

  const crear = trpc.consumibles.crear.useMutation({
    onSuccess: () => {
      onOpenChange(false);
      setFormData({
        productoId: 0,
        unidadMedida: "",
        cantidadPorUnidad: 1,
        stockActual: 0,
        stockMinimo: 0,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    crear.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo Consumible</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>ID de Producto</Label>
            <Input
              type="number"
              value={formData.productoId}
              onChange={(e) =>
                setFormData({ ...formData, productoId: parseInt(e.target.value) })
              }
              required
            />
          </div>
          <div>
            <Label>Unidad de Medida</Label>
            <Input
              value={formData.unidadMedida}
              onChange={(e) =>
                setFormData({ ...formData, unidadMedida: e.target.value })
              }
              placeholder="ej: litros, metros, kg"
              required
            />
          </div>
          <div>
            <Label>Cantidad por Unidad</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.cantidadPorUnidad}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cantidadPorUnidad: parseFloat(e.target.value),
                })
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Stock Actual</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.stockActual}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stockActual: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>
            <div>
              <Label>Stock Mínimo</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.stockMinimo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stockMinimo: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={crear.isPending}>
              {crear.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
EOF

echo "✅ 4 diálogos creados"
