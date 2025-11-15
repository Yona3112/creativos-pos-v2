import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as librosSARDB from "../db/librosSAR";

export const librosSARRouter = router({
  registrarVenta: protectedProcedure
    .input(z.object({
      fecha: z.date(),
      numeroFactura: z.string(),
      clienteNombre: z.string(),
      clienteRTN: z.string().optional(),
      exentas: z.number(),
      gravadas15: z.number(),
      isv15: z.number(),
      total: z.number(),
    }))
    .mutation(({ input }) => librosSARDB.registrarVentaSAR(input)),

  obtenerLibroVentas: protectedProcedure
    .input(z.object({
      fechaInicio: z.date(),
      fechaFin: z.date(),
    }))
    .query(({ input }) => librosSARDB.obtenerLibroVentas(input.fechaInicio, input.fechaFin)),
});
