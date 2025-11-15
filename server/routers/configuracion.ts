import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as configuracionDB from "../db/configuracion";

export const configuracionRouter = router({
  obtener: protectedProcedure
    .query(() => configuracionDB.obtenerConfiguracion()),

  actualizar: protectedProcedure
    .input(z.object({
      nombreEmpresa: z.string().optional(),
      rtn: z.string().optional(),
      telefono: z.string().optional(),
      email: z.string().optional(),
      direccion: z.string().optional(),
      moneda: z.string().optional(),
      simboloMoneda: z.string().optional(),
      tasaImpuesto: z.number().optional(),
      nombreImpuesto: z.string().optional(),
      cai: z.string().optional(),
      rangoInicio: z.string().optional(),
      rangoFin: z.string().optional(),
      fechaLimiteEmision: z.date().optional(),
    }))
    .mutation(({ input }) => configuracionDB.actualizarConfiguracion(input)),
});
