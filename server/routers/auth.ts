import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import * as authDb from "../db/auth";
import { generateToken, verifyPassword } from "../utils/auth";

export const authRouter = router({
  /**
   * Login con email y contraseña
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("Email inválido"),
        password: z.string().min(4, "Contraseña debe tener al menos 4 caracteres"),
      })
    )
    .mutation(async ({ input }) => {
      const usuario = await authDb.getUsuarioByEmail(input.email);

      if (!usuario) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email o contraseña incorrectos",
        });
      }

      if (!usuario.activo) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Usuario inactivo. Contacte al administrador.",
        });
      }

      if (!usuario.password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Usuario configurado para OAuth. Use el método de inicio de sesión correcto.",
        });
      }

      const isValidPassword = await verifyPassword(input.password, usuario.password);

      if (!isValidPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email o contraseña incorrectos",
        });
      }

      // Generar token JWT
      const token = generateToken({
        userId: usuario.id,
        email: usuario.email!,
        rol: usuario.rol as "admin" | "vendedor" | "gerente",
      });

      return {
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        },
      };
    }),

  /**
   * Registro de nuevo usuario (solo admin)
   */
  register: publicProcedure
    .input(
      z.object({
        nombre: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
        email: z.string().email("Email inválido"),
        password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
        rol: z.enum(["admin", "vendedor", "gerente"]).optional(),
        sucursalId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Verificar si el email ya existe
      const existingUser = await authDb.getUsuarioByEmail(input.email);

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "El email ya está registrado",
        });
      }

      const usuario = await authDb.createUsuario(input);

      // Generar token JWT
      const token = generateToken({
        userId: usuario.id,
        email: usuario.email!,
        rol: usuario.rol as "admin" | "vendedor" | "gerente",
      });

      return {
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        },
      };
    }),

  /**
   * Verificar token JWT
   */
  verifyToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { verifyToken } = await import("../utils/auth");
      const payload = verifyToken(input.token);

      if (!payload) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Token inválido o expirado",
        });
      }

      const usuario = await authDb.getUsuarioById(payload.userId);

      if (!usuario || !usuario.activo) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario no encontrado o inactivo",
        });
      }

      return {
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        },
      };
    }),
});
