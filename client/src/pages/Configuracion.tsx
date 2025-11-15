import POSLayout from "@/components/POSLayout";
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
    nombreTienda: "",
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
              <Label>Nombre de Tienda (se muestra en el sistema)</Label>
              <Input
                value={config?.nombreTienda || formData.nombreTienda}
                onChange={(e) => setFormData({ ...formData, nombreTienda: e.target.value })}
                placeholder="Creativos Gift Shop POS v2.0"
              />
            </div>
            <div>
              <Label>Nombre de Empresa (para facturas)</Label>
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
