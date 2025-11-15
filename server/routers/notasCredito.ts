import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as notasCreditoDB from "../db/notasCredito";

export const notasCreditoRouter = router({
  crear: protectedProcedure
    .input(z.object({
      ventaId: z.number(),
      motivo: z.string(),
      detalles: z.array(z.object({
        productoId: z.number(),
        cantidad: z.number(),
        precioUnitario: z.number(),
      })),
    }))
    .mutation(({ input }) => notasCreditoDB.crearNotaCredito(input)),

  listar: protectedProcedure
    .query(() => notasCreditoDB.listarNotasCredito()),

  obtener: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => notasCreditoDB.obtenerNotaCredito(input.id)),

  aplicar: protectedProcedure
    .input(z.object({ id: z.number(), ventaId: z.number() }))
    .mutation(({ input }) => notasCreditoDB.aplicarNotaCredito(input.id, input.ventaId)),
});
