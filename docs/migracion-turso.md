# Guía de Migración a Turso

Esta guía te ayudará a migrar tu base de datos SQLite local a Turso para producción.

## Paso 1: Crear cuenta en Turso

1. Visita https://turso.tech/
2. Haz clic en "Get Started" o "Sign up"
3. Crea tu cuenta (puedes usar GitHub, Google o email)

## Paso 2: Instalar Turso CLI

### En tu máquina local (no en el servidor de desarrollo):

**macOS/Linux:**
```bash
curl -sSL tur.so/install | sh
```

**Windows:**
```powershell
irm tur.so/install.ps1 | iex
```

### Verificar instalación:
```bash
turso --version
```

## Paso 3: Autenticarse

```bash
turso auth login
```

Esto abrirá tu navegador para completar la autenticación.

## Paso 4: Crear base de datos en Turso

```bash
# Crear base de datos
turso db create creativos-pos

# Ver detalles de la base de datos
turso db show creativos-pos
```

**Salida esperada:**
```
Name:           creativos-pos
URL:            libsql://creativos-pos-[tu-usuario].turso.io
ID:             [database-id]
Locations:      [región más cercana]
Size:           0 B
```

## Paso 5: Obtener credenciales

### Obtener URL de la base de datos:
```bash
turso db show creativos-pos --url
```

**Ejemplo de salida:**
```
libsql://creativos-pos-usuario.turso.io
```

### Crear token de autenticación:
```bash
turso db tokens create creativos-pos
```

**Ejemplo de salida:**
```
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE:** Guarda este token de forma segura. Solo se muestra una vez.

## Paso 6: Configurar variables de entorno

### En el panel de Manus (Settings → Secrets):

Agrega las siguientes variables de entorno:

1. **TURSO_DATABASE_URL**
   - Valor: `libsql://creativos-pos-[tu-usuario].turso.io`
   - (La URL que obtuviste en el Paso 5)

2. **TURSO_AUTH_TOKEN**
   - Valor: `eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...`
   - (El token que obtuviste en el Paso 5)

### Alternativamente, en archivo `.env` local:

```env
TURSO_DATABASE_URL=libsql://creativos-pos-[tu-usuario].turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

## Paso 7: Migrar esquema a Turso

### Opción A: Usando Drizzle Kit (Recomendado)

```bash
# Generar migración
pnpm drizzle-kit generate

# Aplicar migración a Turso
pnpm drizzle-kit migrate
```

### Opción B: Usando Turso CLI

```bash
# Exportar esquema desde SQLite local
sqlite3 data/pos.db .schema > schema.sql

# Importar esquema a Turso
turso db shell creativos-pos < schema.sql
```

## Paso 8: Migrar datos existentes (Opcional)

Si ya tienes datos en tu base de datos SQLite local:

```bash
# Exportar datos
sqlite3 data/pos.db .dump > data-dump.sql

# Importar a Turso
turso db shell creativos-pos < data-dump.sql
```

⚠️ **Nota:** Esto puede tomar tiempo si tienes muchos datos.

## Paso 9: Actualizar código de la aplicación

El código ya está preparado para usar Turso automáticamente cuando las variables de entorno están configuradas.

### Archivo `server/db.ts` actualizado:

```typescript
import { getDbTurso, isTursoConfigured } from "./db-turso";
import { getDbSQLite } from "./db-sqlite";

export async function getDb() {
  // Usar Turso si está configurado, sino SQLite local
  if (isTursoConfigured()) {
    return await getDbTurso();
  }
  return await getDbSQLite();
}
```

## Paso 10: Probar la conexión

### Verificar en logs del servidor:

Deberías ver:
```
[Database] Connected to Turso successfully
```

### Probar operaciones básicas:

1. Inicia sesión en el POS
2. Crea un producto de prueba
3. Verifica que se guarde correctamente

### Verificar datos en Turso:

```bash
# Abrir shell de Turso
turso db shell creativos-pos

# Listar tablas
.tables

# Ver productos
SELECT * FROM productos LIMIT 5;

# Salir
.quit
```

## Paso 11: Configurar backups automáticos

Turso hace backups automáticos según tu plan:

- **Plan Gratuito:** 1 día de retención
- **Plan Developer:** 10 días de retención
- **Plan Scaler:** 30 días de retención
- **Plan Pro:** 90 días de retención

### Restaurar desde backup:

```bash
# Listar backups disponibles
turso db backups list creativos-pos

# Restaurar desde un punto específico
turso db restore creativos-pos --timestamp "2024-11-15T10:00:00Z"
```

## Paso 12: Monitoreo y mantenimiento

### Ver estadísticas de uso:

```bash
turso db inspect creativos-pos
```

### Ver logs:

```bash
turso db logs creativos-pos
```

### Dashboard web:

Visita https://turso.tech/app para ver:
- Uso de almacenamiento
- Lecturas/escrituras
- Bases de datos activas
- Métricas de rendimiento

## Troubleshooting

### Error: "Failed to connect to Turso"

**Solución:**
1. Verifica que las variables de entorno estén configuradas correctamente
2. Verifica que el token no haya expirado
3. Regenera el token si es necesario:
   ```bash
   turso db tokens create creativos-pos
   ```

### Error: "Table already exists"

**Solución:**
1. Elimina la base de datos y créala de nuevo:
   ```bash
   turso db destroy creativos-pos
   turso db create creativos-pos
   ```

### Rendimiento lento

**Solución:**
1. Verifica la región de tu base de datos:
   ```bash
   turso db show creativos-pos
   ```
2. Si es necesario, crea una réplica en una región más cercana:
   ```bash
   turso db replicate creativos-pos --location [región]
   ```

## Costos estimados

### Plan Gratuito (Recomendado para empezar):
- **Costo:** $0/mes
- **Bases de datos:** 100 totales, 100 activas/mes
- **Almacenamiento:** 5GB
- **Lecturas:** 500 millones/mes
- **Escrituras:** 10 millones/mes

**Suficiente para:**
- ✅ Tienda pequeña/mediana (< 1000 ventas/mes)
- ✅ Desarrollo y pruebas
- ✅ Primeros meses de operación

### Cuándo actualizar a plan pago:

**Plan Developer ($4.99/mes)** cuando:
- Superes 100 bases de datos activas/mes
- Necesites más de 5GB de almacenamiento
- Requieras 10 días de backups

**Plan Scaler ($24.92/mes)** cuando:
- Tengas múltiples sucursales
- Superes 500 bases de datos activas/mes
- Necesites 30 días de backups
- Requieras soporte de equipos

## Ventajas de usar Turso

✅ **Backups automáticos** - No te preocupes por perder datos  
✅ **Escalabilidad** - Crece según tus necesidades  
✅ **Distribución global** - Baja latencia en cualquier lugar  
✅ **Búsqueda vectorial** - Para futuras funcionalidades de IA  
✅ **Branching** - Crea copias de tu base de datos en segundos  
✅ **Monitoreo** - Dashboard con métricas en tiempo real  
✅ **Seguridad** - Encriptación y autenticación incluida  

## Soporte

- **Documentación oficial:** https://docs.turso.tech/
- **Discord de Turso:** https://discord.gg/turso
- **GitHub:** https://github.com/tursodatabase/libsql
- **Email de soporte:** support@turso.tech

## Próximos pasos

Una vez migrado a Turso:

1. ✅ Configura alertas de uso en el dashboard
2. ✅ Programa backups manuales periódicos
3. ✅ Monitorea el rendimiento semanalmente
4. ✅ Considera agregar réplicas si expandes a otras regiones

---

**¿Necesitas ayuda?** Consulta la documentación completa en `/docs/proveedores-sqlite-nube.md`
