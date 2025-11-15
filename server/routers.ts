import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { authRouter } from "./routers/auth";
import { productosRouter } from "./routers/productos";
import { clientesRouter } from "./routers/clientes";
import { ventasRouter } from "./routers/ventas";
import { cotizacionesRouter } from "./routers/cotizaciones";
import { reportesRouter } from "./routers/reportes";
import { notasCreditoRouter } from "./routers/notasCredito";
import { cortesCajaRouter } from "./routers/cortesCaja";
import { usuariosRouter } from "./routers/usuarios";
import { configuracionRouter } from "./routers/configuracion";
import { creditoRouter } from "./routers/credito";
import { promocionesRouter } from "./routers/promociones";
import { librosSARRouter } from "./routers/librosSAR";
import { consumiblesRouter } from "./routers/consumibles";
import { catalogoRouter } from "./routers/catalogo";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Autenticación personalizada (JWT)
  authCustom: authRouter,
  
  // Módulos del POS
  productos: productosRouter,
  clientes: clientesRouter,
  ventas: ventasRouter,
  cotizaciones: cotizacionesRouter,
  reportes: reportesRouter,
  notasCredito: notasCreditoRouter,
  cortesCaja: cortesCajaRouter,
  usuarios: usuariosRouter,
  configuracion: configuracionRouter,
  credito: creditoRouter,
  promociones: promocionesRouter,
  librosSAR: librosSARRouter,
  consumibles: consumiblesRouter,
  catalogo: catalogoRouter,

  // Debug endpoint
  debug: router({
    testDb: publicProcedure.query(async () => {
      try {
        const hasEnv = !!process.env.DATABASE_URL;
        const envPreview = process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + "..." : "undefined";
        
        const { getDb } = await import("./db.js");
        const db = await getDb();
        
        if (!db) {
          return { success: false, error: "Database not available", hasEnv, envPreview };
        }
        
        const { usuarios } = await import("../drizzle/schema.js");
        const result = await db.select().from(usuarios).limit(1);
        return { success: true, count: result.length, hasEnv, envPreview };
      } catch (error: any) {
        return { 
          success: false, 
          error: error.message, 
          stack: error.stack?.split('\n').slice(0, 5).join('\n'),
          hasEnv: !!process.env.DATABASE_URL 
        };
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
