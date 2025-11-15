import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as clientesDb from "../db/clientes";

export const clientesRouter = router({
  /**
   * Listar todos los clientes
   */
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(500).optional(),
        offset: z.number().min(0).optional(),
        search: z.string().optional(),
        activo: z.boolean().optional(),
        nivel: z.enum(["bronce", "plata", "oro", "platino"]).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      return clientesDb.getAllClientes(input);
    }),

  /**
   * Obtener un cliente por ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return clientesDb.getClienteById(input.id);
    }),

  /**
   * Obtener un cliente por RTN
   */
  getByRtn: protectedProcedure
    .input(z.object({ rtn: z.string() }))
    .query(async ({ input }) => {
      return clientesDb.getClienteByRtn(input.rtn);
    }),

  /**
   * Crear un nuevo cliente
   */
  create: protectedProcedure
    .input(
      z.object({
        nombre: z.string().min(1),
        rtn: z.string().optional(),
        telefono: z.string().optional(),
        email: z.string().email().optional(),
        direccion: z.string().optional(),
        nivel: z.enum(["bronce", "plata", "oro", "platino"]).optional(),
        descuento: z.number().min(0).max(100).optional(),
      })
    )
    .mutation(async ({ input }) => {
      return clientesDb.createCliente(input);
    }),

  /**
   * Actualizar un cliente
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        nombre: z.string().min(1).optional(),
        rtn: z.string().optional(),
        telefono: z.string().optional(),
        email: z.string().email().optional(),
        direccion: z.string().optional(),
        nivel: z.enum(["bronce", "plata", "oro", "platino"]).optional(),
        descuento: z.number().min(0).max(100).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return clientesDb.updateCliente(id, data);
    }),

  /**
   * Eliminar un cliente (soft delete)
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await clientesDb.deleteCliente(input.id);
      return { success: true };
    }),

  /**
   * Actualizar crédito de un cliente
   */
  updateCredito: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        monto: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return clientesDb.updateCredito(input.id, input.monto);
    }),

  /**
   * Contar clientes
   */
  count: protectedProcedure
    .input(
      z.object({
        activo: z.boolean().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      return clientesDb.countClientes(input);
    }),
});
