import POSLayout from "@/components/POSLayout";
import UsuarioDialog from "@/components/dialogs/UsuarioDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus, Trash2 } from "lucide-react";

export default function Usuarios() {
  const [usuarioDialogOpen, setUsuarioDialogOpen] = useState(false);
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
          <Button onClick={() => setUsuarioDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>

        <Card className="p-6">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <div className="overflow-x-auto"><Table>
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
            </Table></div>
          )}
      <UsuarioDialog open={usuarioDialogOpen} onOpenChange={setUsuarioDialogOpen} />
        </Card>
      </div>
    </POSLayout>
  );
}
