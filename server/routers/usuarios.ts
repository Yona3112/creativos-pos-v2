import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as usuariosDB from "../db/usuarios";

export const usuariosRouter = router({
  crear: protectedProcedure
    .input(z.object({
      nombre: z.string(),
      email: z.string().email(),
      password: z.string(),
      rol: z.enum(["admin", "gerente", "vendedor"]),
    }))
    .mutation(({ input }) => usuariosDB.crearUsuario(input)),

  actualizar: protectedProcedure
    .input(z.object({
      id: z.number(),
      nombre: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string().optional(),
      rol: z.enum(["admin", "gerente", "vendedor"]).optional(),
    }))
    .mutation(({ input }) => usuariosDB.actualizarUsuario(input.id, input)),

  eliminar: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => usuariosDB.eliminarUsuario(input.id)),

  listar: protectedProcedure
    .query(() => usuariosDB.listarUsuarios()),

  obtener: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => usuariosDB.obtenerUsuario(input.id)),
});
