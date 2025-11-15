import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as reportesDb from "../db/reportes";

export const reportesRouter = router({
  /**
   * Reporte de ventas por período
   */
  ventas: protectedProcedure
    .input(
      z.object({
        fechaInicio: z.date(),
        fechaFin: z.date(),
        sucursalId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return reportesDb.getReporteVentas(input);
    }),

  /**
   * Productos más vendidos
   */
  productosMasVendidos: protectedProcedure
    .input(
      z.object({
        fechaInicio: z.date(),
        fechaFin: z.date(),
        limit: z.number().min(1).max(100).optional(),
        sucursalId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return reportesDb.getProductosMasVendidos(input);
    }),

  /**
   * Ventas por método de pago
   */
  ventasPorMetodoPago: protectedProcedure
    .input(
      z.object({
        fechaInicio: z.date(),
        fechaFin: z.date(),
        sucursalId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return reportesDb.getVentasPorMetodoPago(input);
    }),

  /**
   * Clientes top compradores
   */
  clientesTopCompradores: protectedProcedure
    .input(
      z.object({
        fechaInicio: z.date(),
        fechaFin: z.date(),
        limit: z.number().min(1).max(100).optional(),
        sucursalId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return reportesDb.getClientesTopCompradores(input);
    }),

  /**
   * Inventario valorizado
   */
  inventarioValorizado: protectedProcedure
    .query(async () => {
      return reportesDb.getInventarioValorizado();
    }),

  /**
   * Productos con stock bajo
   */
  productosStockBajo: protectedProcedure
    .query(async () => {
      return reportesDb.getProductosStockBajo();
    }),

  /**
   * Estadísticas para el dashboard
   */
  estadisticasDashboard: protectedProcedure
    .input(
      z.object({
        fechaInicio: z.date(),
        fechaFin: z.date(),
      })
    )
    .query(async ({ input }) => {
      return reportesDb.getEstadisticasDashboard(input);
    }),

  /**
   * Ventas por período (para gráficos)
   */
  ventasPorPeriodo: protectedProcedure
    .input(
      z.object({
        fechaInicio: z.date(),
        fechaFin: z.date(),
      })
    )
    .query(async ({ input }) => {
      return reportesDb.getVentasPorPeriodo(input);
    }),
});
