import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as promocionesDB from "../db/promociones";

export const promocionesRouter = router({
  crear: protectedProcedure
    .input(z.object({
      nombre: z.string(),
      descripcion: z.string().optional(),
      tipo: z.enum(["porcentaje", "monto_fijo", "2x1", "3x2"]),
      valor: z.number(),
      aplicaA: z.enum(["producto", "categoria", "cliente", "todos"]),
      productoId: z.number().optional(),
      clienteId: z.number().optional(),
      fechaInicio: z.date(),
      fechaFin: z.date(),
    }))
    .mutation(({ input }) => promocionesDB.crearPromocion(input)),

  listarActivas: protectedProcedure
    .query(() => promocionesDB.listarPromocionesActivas()),

  obtenerProducto: protectedProcedure
    .input(z.object({ productoId: z.number() }))
    .query(({ input }) => promocionesDB.obtenerPromocionesProducto(input.productoId)),

  desactivar: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => promocionesDB.desactivarPromocion(input.id)),
});
