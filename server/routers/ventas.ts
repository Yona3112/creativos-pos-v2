import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as ventasDb from "../db/ventas";

const detalleVentaSchema = z.object({
  productoId: z.number(),
  cantidad: z.number().min(1),
  precioUnitario: z.number().min(0),
  descuento: z.number().min(0).default(0),
  subtotal: z.number().min(0),
});

export const ventasRouter = router({
  /**
   * Listar todas las ventas
   */
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(500).optional(),
        offset: z.number().min(0).optional(),
        fechaInicio: z.date().optional(),
        fechaFin: z.date().optional(),
        usuarioId: z.number().optional(),
        sucursalId: z.number().optional(),
        anulada: z.boolean().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      return ventasDb.getAllVentas(input);
    }),

  /**
   * Obtener una venta por ID con detalles
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return ventasDb.getVentaById(input.id);
    }),

  /**
   * Crear una nueva venta
   */
  create: protectedProcedure
    .input(
      z.object({
        venta: z.object({
          numeroFactura: z.string(),
          clienteId: z.number().optional(),
          usuarioId: z.number(),
          sucursalId: z.number(),
          subtotal: z.number().min(0),
          descuento: z.number().min(0).default(0),
          impuesto: z.number().min(0).default(0),
          total: z.number().min(0),
          metodoPago: z.enum(["Efectivo", "Tarjeta", "Transferencia", "Mixto"]),
          efectivo: z.number().min(0).optional(),
          tarjeta: z.number().min(0).optional(),
          transferencia: z.number().min(0).optional(),
          cambio: z.number().min(0).optional(),
          notas: z.string().optional(),
        }),
        detalles: z.array(detalleVentaSchema).min(1),
      })
    )
    .mutation(async ({ input }) => {
      return ventasDb.createVenta(input);
    }),

  /**
   * Anular una venta
   */
  anular: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return ventasDb.anularVenta(input.id);
    }),

  /**
   * Obtener total de ventas por período
   */
  getTotalVentas: protectedProcedure
    .input(
      z.object({
        fechaInicio: z.date(),
        fechaFin: z.date(),
        sucursalId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return ventasDb.getTotalVentas(input);
    }),

  /**
   * Obtener ventas del día
   */
  getVentasDelDia: protectedProcedure
    .input(
      z.object({
        sucursalId: z.number().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      return ventasDb.getVentasDelDia(input?.sucursalId);
    }),

  /**
   * Generar número de factura
   */
  generarNumeroFactura: protectedProcedure
    .input(z.object({ sucursalId: z.number() }))
    .query(async ({ input }) => {
      return ventasDb.generarNumeroFactura(input.sucursalId);
    }),
});
