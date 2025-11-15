import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as consumiblesDB from "../db/consumibles";

export const consumiblesRouter = router({
  crear: protectedProcedure
    .input(z.object({
      productoId: z.number(),
      unidadMedida: z.string(),
      cantidadPorUnidad: z.number(),
      stockActual: z.number(),
      stockMinimo: z.number().optional(),
    }))
    .mutation(({ input }) => consumiblesDB.crearConsumible(input)),

  registrarMovimiento: protectedProcedure
    .input(z.object({
      consumibleId: z.number(),
      tipo: z.enum(["entrada", "salida", "ajuste"]),
      cantidad: z.number(),
      motivo: z.string().optional(),
      usuarioId: z.number().optional(),
    }))
    .mutation(({ input }) => consumiblesDB.registrarMovimiento(input.consumibleId, input)),

  listar: protectedProcedure
    .query(() => consumiblesDB.listarConsumibles()),
});
