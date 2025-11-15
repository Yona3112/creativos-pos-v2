import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as productosDb from "../db/productos";

export const productosRouter = router({
  /**
   * Obtener todos los productos
   */
  getAll: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().optional(),
          offset: z.number().optional(),
          categoriaId: z.number().optional(),
          search: z.string().optional(),
          activo: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      return productosDb.getAllProductos(input);
    }),

  /**
   * Obtener un producto por ID
   */
  getById: protectedProcedure.input(z.number()).query(async ({ input }) => {
    return productosDb.getProductoById(input);
  }),

  /**
   * Obtener un producto por código
   */
  getByCodigo: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return productosDb.getProductoByCodigo(input);
  }),

  /**
   * Crear un nuevo producto
   */
  create: protectedProcedure
    .input(
      z.object({
        codigo: z.string().min(1, "Código es requerido"),
        nombre: z.string().min(1, "Nombre es requerido"),
        descripcion: z.string().optional(),
        precio: z.number().positive("Precio debe ser positivo"),
        costo: z.number().nonnegative("Costo no puede ser negativo").optional(),
        stock: z.number().int().nonnegative("Stock no puede ser negativo"),
        stockMinimo: z.number().int().nonnegative("Stock mínimo no puede ser negativo").optional(),
        categoriaId: z.number().optional(),
        imagen: z.string().url().optional(),
        activo: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return productosDb.createProducto(input);
    }),

  /**
   * Actualizar un producto
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          codigo: z.string().min(1).optional(),
          nombre: z.string().min(1).optional(),
          descripcion: z.string().optional(),
          precio: z.number().positive().optional(),
          costo: z.number().nonnegative().optional(),
          stock: z.number().int().nonnegative().optional(),
          stockMinimo: z.number().int().nonnegative().optional(),
          categoriaId: z.number().optional(),
          imagen: z.string().url().optional(),
          activo: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      return productosDb.updateProducto(input.id, input.data);
    }),

  /**
   * Eliminar un producto (soft delete)
   */
  delete: protectedProcedure.input(z.number()).mutation(async ({ input }) => {
    await productosDb.deleteProducto(input);
    return { success: true };
  }),

  /**
   * Actualizar stock de un producto
   */
  updateStock: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        cantidad: z.number().int(),
      })
    )
    .mutation(async ({ input }) => {
      return productosDb.updateStock(input.id, input.cantidad);
    }),

  /**
   * Obtener productos con stock bajo
   */
  getBajoStock: protectedProcedure.query(async () => {
    return productosDb.getProductosBajoStock();
  }),

  /**
   * Contar productos
   */
  count: protectedProcedure
    .input(
      z
        .object({
          categoriaId: z.number().optional(),
          activo: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      return productosDb.countProductos(input);
    }),
});
