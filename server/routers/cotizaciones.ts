import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as cotizacionesDb from "../db/cotizaciones";

const detalleCotizacionSchema = z.object({
  productoId: z.number(),
  cantidad: z.number().min(1),
  precioUnitario: z.number().min(0),
  descuento: z.number().min(0).default(0),
  subtotal: z.number().min(0),
});

export const cotizacionesRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(500).optional(),
        offset: z.number().min(0).optional(),
        estado: z.enum(["Pendiente", "Aprobada", "Rechazada", "Convertida"]).optional(),
        usuarioId: z.number().optional(),
        sucursalId: z.number().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      return cotizacionesDb.getAllCotizaciones(input);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return cotizacionesDb.getCotizacionById(input.id);
    }),

  create: protectedProcedure
    .input(
      z.object({
        cotizacion: z.object({
          numero: z.string(),
          clienteId: z.number().optional(),
          usuarioId: z.number(),
          sucursalId: z.number(),
          subtotal: z.number().min(0),
          descuento: z.number().min(0).default(0),
          impuesto: z.number().min(0).default(0),
          total: z.number().min(0),
          validezDias: z.number().min(1).default(30),
          notas: z.string().optional(),
        }),
        detalles: z.array(detalleCotizacionSchema).min(1),
      })
    )
    .mutation(async ({ input }) => {
      return cotizacionesDb.createCotizacion(input);
    }),

  updateEstado: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        estado: z.enum(["Pendiente", "Aprobada", "Rechazada", "Convertida"]),
      })
    )
    .mutation(async ({ input }) => {
      return cotizacionesDb.updateEstadoCotizacion(input.id, input.estado);
    }),

  generarNumero: protectedProcedure
    .input(z.object({ sucursalId: z.number() }))
    .query(async ({ input }) => {
      return cotizacionesDb.generarNumeroCotizacion(input.sucursalId);
    }),
});
