import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as cortesCajaDB from "../db/cortesCaja";

export const cortesCajaRouter = router({
  abrir: protectedProcedure
    .input(z.object({
      usuarioId: z.number(),
      montoInicial: z.number(),
    }))
    .mutation(({ input }) => cortesCajaDB.abrirCaja(input.usuarioId, input.montoInicial)),

  cerrar: protectedProcedure
    .input(z.object({
      id: z.number(),
      montoReal: z.number(),
      notas: z.string().optional(),
    }))
    .mutation(({ input }) => cortesCajaDB.cerrarCaja(input.id, input.montoReal, input.notas)),

  actual: protectedProcedure
    .input(z.object({ usuarioId: z.number() }))
    .query(({ input }) => cortesCajaDB.obtenerCajaActual(input.usuarioId)),

  listar: protectedProcedure
    .query(() => cortesCajaDB.listarCortes()),
});
