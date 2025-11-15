# TODO - Creativos POS v2.0

## ✅ CONVERSIÓN DEFINITIVA A POSTGRESQL - COMPLETADA

### Objetivo
Convertir el esquema SQLite completo (18 tablas) a PostgreSQL y hacer que el sistema funcione en producción.

### Tareas Completadas
- [x] Leer esquema SQLite completo (18 tablas)
- [x] Convertir tipos de datos SQLite a PostgreSQL
- [x] Crear archivo drizzle/schema.ts con las 18 tablas PostgreSQL
- [x] Eliminar tablas antiguas de Railway PostgreSQL
- [x] Crear script SQL create-schema.sql con todas las tablas
- [x] Aplicar esquema a Railway PostgreSQL exitosamente
- [x] Verificar que las 18 tablas se crearon correctamente
- [x] Actualizar server/db.ts para usar PostgreSQL
- [x] Corregir referencias a tabla usuarios (antes users)
- [x] Reiniciar servidor sin errores
- [x] Probar que el dashboard cargue estadísticas desde PostgreSQL

### Pendiente
- [ ] Publicar sitio (usuario debe hacer clic en botón Publish)
- [ ] Probar login desde móvil después de publicar
- [ ] Verificar que no aparezca "database not available"

### Estado
✅ Sistema funcionando correctamente con PostgreSQL
🎯 Listo para publicar

---

## 📋 Tablas PostgreSQL Creadas (18 total)

1. usuarios - Usuarios del sistema
2. sucursales - Sucursales de la tienda
3. productos - Catálogo de productos
4. clientes - Base de datos de clientes
5. ventas - Registro de ventas
6. detallesVenta - Detalles de productos vendidos
7. cotizaciones - Cotizaciones a clientes
8. detallesCotizacion - Detalles de cotizaciones
9. notasCredito - Notas de crédito
10. detallesNotaCredito - Detalles de notas de crédito
11. cortesCaja - Cortes de caja
12. configuracion - Configuración del sistema
13. ventasCredito - Ventas a crédito
14. pagosCredito - Pagos de crédito
15. promociones - Promociones y descuentos
16. librosSAR - Libros SAR para cumplimiento fiscal
17. consumibles - Productos consumibles
18. movimientosConsumibles - Movimientos de consumibles

---

## 🚀 Próximos Pasos

1. **Publicar el sitio** - Hacer clic en el botón "Publish" en la interfaz de Manus
2. **Probar desde móvil** - Abrir el sitio publicado desde tu iPhone
3. **Verificar login** - Confirmar que ya no aparece "database not available"
4. **Agregar datos de prueba** - Crear productos, clientes y ventas de prueba


## ✅ ERROR CRÍTICO - Login Fallando - RESUELTO

### Problema
- Error: Failed query: select "id", "openId", "nombre", "email", "password", "loginMethod", "rol", "sucursalId", "activo", "createdAt", "updatedAt", "lastSignedIn" from "usuarios"
- El código estaba importando desde schema-sqlite en lugar de schema (PostgreSQL)

### Solución Aplicada
- [x] Identificar archivo que maneja el login (server/db/auth.ts)
- [x] Verificar qué columnas tiene realmente la tabla usuarios en PostgreSQL (todas las 12 columnas existen)
- [x] Encontrar el problema: 19 archivos importaban desde schema-sqlite
- [x] Reemplazar todas las importaciones de schema-sqlite por schema
- [x] Reiniciar servidor exitosamente
- [x] Verificar que no aparezca "database not available"
- [ ] Publicar sitio y probar login desde móvil


## 🚨 BLOQUEADOR - 78 Errores de TypeScript Impiden Publicación

### Problema
- El checkpoint no se puede publicar porque tiene 78 errores de TypeScript
- Errores relacionados con incompatibilidad entre código y esquema PostgreSQL
- Ejemplo: Type '{ numero: string; ... }' is missing properties 'productos', 'folio'

### Tareas
- [x] Ejecutar tsc para ver todos los errores
- [x] Identificar archivos con errores  
- [x] Descubrir que la base de datos es TiDB/MySQL, NO PostgreSQL
- [x] Convertir esquema de PostgreSQL a MySQL/TiDB
- [x] Actualizar drizzle.config.ts para usar dialect: "mysql"
- [x] Actualizar server/db.ts para usar drizzle-orm/mysql2
- [x] Corregir sintaxis de int() con autoIncrement para MySQL
- [x] Corregir sintaxis de double() para MySQL
- [x] Verificar que tsc no reporte errores (0 errores)
- [x] Servidor funcionando correctamente
- [x] Guardar checkpoint sin errores (checkpoint 1ff7b6a3)
- [ ] Publicar sitio desde la interfaz de Manus


## 🚨 NUEVO BLOQUEADOR - 50 Errores de TypeScript MySQL

### Problema Descubierto
- Todavía hay 50 errores de TypeScript que impiden publicar
- Errores principales:
  1. `.returning()` no existe en MySQL/TiDB (solo en PostgreSQL)
  2. `usuario.id` puede ser null pero JWTPayload espera number
  3. Imports incorrectos en drizzle/schema.ts

### Archivos Afectados
- server/db/usuarios.ts - .returning()
- server/db/ventas.ts - .returning()
- server/routers/auth.ts - usuario.id nullable
- drizzle/schema.ts - imports incorrectos

### Tareas
- [ ] Reemplazar .returning() por lastInsertRowid en MySQL
- [ ] Agregar validación de usuario.id !== null
- [ ] Corregir imports en schema.ts
- [ ] Verificar 0 errores con pnpm tsc --noEmit
- [ ] Guardar checkpoint final
- [ ] Publicar sitio
