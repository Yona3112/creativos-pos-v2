import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as creditoDB from "../db/credito";

export const creditoRouter = router({
  crear: protectedProcedure
    .input(z.object({
      ventaId: z.number(),
      clienteId: z.number(),
      montoTotal: z.number(),
      fechaVencimiento: z.date(),
    }))
    .mutation(({ input }) => creditoDB.crearVentaCredito(input)),

  registrarPago: protectedProcedure
    .input(z.object({
      ventaCreditoId: z.number(),
      monto: z.number(),
      metodoPago: z.string(),
      referencia: z.string().optional(),
      notas: z.string().optional(),
    }))
    .mutation(({ input }) => creditoDB.registrarPago(input.ventaCreditoId, input)),

  listarPendientes: protectedProcedure
    .query(() => creditoDB.listarCreditosPendientes()),

  obtener: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => creditoDB.obtenerCredito(input.id)),
});
