# 🚂 Guía de Deploy a Railway - Creativos POS v2.0

## 📋 Requisitos Previos

- ✅ Código en GitHub: https://github.com/Yona3112/creativos-pos-v2
- ✅ Base de datos PostgreSQL en Railway (ya existe)
- ✅ Cuenta de Railway (gratis): https://railway.app

---

## 🚀 Paso a Paso: Deploy a Railway

### **Paso 1: Crear cuenta en Railway**

1. Ir a: **https://railway.app**
2. Clic en **"Start a New Project"** o **"Login with GitHub"**
3. Autorizar Railway para acceder a GitHub
4. Confirmar email (si es necesario)

---

### **Paso 2: Crear nuevo proyecto**

1. En el dashboard de Railway, clic en **"New Project"**
2. Seleccionar **"Deploy from GitHub repo"**
3. Buscar y seleccionar: **`Yona3112/creativos-pos-v2`**
4. Railway comenzará a detectar el proyecto automáticamente

**Railway detectará:**
- ✅ Node.js (por package.json)
- ✅ pnpm (por pnpm-lock.yaml)
- ✅ Build y start scripts

---

### **Paso 3: Conectar con tu PostgreSQL existente**

Ya tienes PostgreSQL en Railway, ahora conecta el web service:

#### **Opción A: Usar PostgreSQL existente**

1. En tu proyecto Railway, verás dos servicios:
   - 🗄️ **PostgreSQL** (ya existe)
   - 🌐 **creativos-pos-v2** (nuevo)

2. Clic en el servicio **creativos-pos-v2**
3. Ir a **"Variables"** tab
4. Buscar la variable **DATABASE_URL**

Railway automáticamente la conectará, pero si no:

5. Clic en **"+ New Variable"**
6. **Reference** → Seleccionar **PostgreSQL** → **DATABASE_URL**
7. Esto creará la referencia automática

**Resultado:**
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

#### **Opción B: Copiar manualmente**

Si tienes la URL de PostgreSQL:

```env
DATABASE_URL=postgresql://postgres:ObITRLMUVZHwebCkMIFKWAkxphOyGzuK@trolley.proxy.rlwy.net:30355/railway
```

---

### **Paso 4: Configurar Variables de Entorno**

En el servicio **creativos-pos-v2**, ir a **Variables** y agregar:

```env
# Base de datos (automática o manual)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT Secret (IMPORTANTE: cambia esto)
JWT_SECRET=tu_secreto_super_seguro_aqui_2024

# Modo producción
NODE_ENV=production

# Puerto (Railway lo asigna automáticamente)
PORT=${{PORT}}
```

**Variables opcionales:**

```env
# Para S3 (si usas uploads)
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=tu_bucket

# Para email (si usas notificaciones)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_password_app
```

---

### **Paso 5: Configurar Build y Start Commands**

Railway detecta automáticamente, pero verifica:

1. En tu servicio, ir a **"Settings"** → **"Build & Deploy"**

**Build Command:**
```bash
pnpm install && pnpm build
```

**Start Command:**
```bash
pnpm start
```

**Watch Paths (opcional):**
```
package.json
pnpm-lock.yaml
```

---

### **Paso 6: Deploy**

1. Railway comenzará el deploy automáticamente
2. Verás los logs en tiempo real:
   ```
   📦 Installing dependencies...
   🔨 Building application...
   🚀 Starting server...
   ✅ Deployed successfully!
   ```

3. Espera 2-5 minutos (primera vez es más lento)

---

### **Paso 7: Obtener URL Pública**

1. En tu servicio **creativos-pos-v2**
2. Ir a **"Settings"** → **"Networking"**
3. Clic en **"Generate Domain"**
4. Railway te dará una URL tipo:
   ```
   https://creativos-pos-v2-production.up.railway.app
   ```

5. Copia esta URL y pruébala en el navegador

---

### **Paso 8: Inicializar Base de Datos**

Después del primer deploy, necesitas crear las tablas:

#### **Opción A: Desde Railway CLI** (Recomendado)

1. Instalar Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login:
   ```bash
   railway login
   ```

3. Link al proyecto:
   ```bash
   cd /ruta/a/creativos-pos-v2
   railway link
   ```

4. Ejecutar migraciones:
   ```bash
   railway run node init-db.mjs
   railway run node create-admin-user.mjs
   railway run node seed-productos.mjs
   ```

#### **Opción B: Desde Railway Dashboard**

1. En el dashboard, ir a tu servicio
2. Clic en **"Deploy"** → **"Run Command"**
3. Ejecutar:
   ```bash
   node init-db.mjs
   node create-admin-user.mjs
   node seed-productos.mjs
   ```

#### **Opción C: Usar Drizzle** (Más profesional)

```bash
railway run npx drizzle-kit push
```

---

### **Paso 9: Verificar Deployment**

1. Abre tu URL de Railway en el navegador
2. Deberías ver la página de login
3. Prueba las credenciales:
   - **Email**: braham.admin@creativos.com
   - **Password**: admin123

4. Si todo funciona: ✅ **¡Deploy exitoso!**

---

## 🔄 Deploy Automático (CI/CD)

Railway detecta cambios en GitHub automáticamente:

```
git add .
git commit -m "Fix: algún cambio"
git push origin main
```

Railway automáticamente:
1. Detecta el push
2. Hace pull del código
3. Ejecuta build
4. Deploya la nueva versión
5. ¡Sin downtime!

---

## 📊 Monitoreo

### **Ver Logs en Tiempo Real**

1. En Railway, clic en tu servicio
2. Ver tab **"Deployments"**
3. Clic en el deployment activo
4. Ver **"View Logs"**

### **Métricas**

Railway muestra:
- 📈 CPU usage
- 💾 Memory usage
- 🌐 Network traffic
- ⏱️ Response times

---

## 💰 Costos Estimados

### **Plan Gratuito (Trial)**
- **$5 de crédito** al registrarte
- Suficiente para 1 mes de testing

### **Plan Developer**
- **$5/mes** para uso básico
- **~$10/mes** para uso moderado
- **Pay-as-you-go** basado en uso

**Para Creativos POS:**
- Web Service: ~$5/mes
- PostgreSQL: ~$5/mes
- **Total: ~$10/mes**

---

## 🔧 Troubleshooting

### **Error: "Cannot connect to database"**

```bash
# Verificar DATABASE_URL
railway variables

# Probar conexión
railway run node test-db-connection.mjs
```

### **Error: "Port already in use"**

Railway asigna el puerto automáticamente. Verifica en `server/_core/index.ts`:

```typescript
const port = process.env.PORT || 3000;
```

### **Error: "Build failed"**

1. Ver logs de build
2. Verificar que todas las dependencias estén en `package.json`
3. Asegurar que `pnpm-lock.yaml` esté actualizado

```bash
# Local
pnpm install
pnpm build
# Si funciona local, push a GitHub
```

### **Error: "Module not found"**

Verificar en `package.json` que todos los imports estén como dependencias (no devDependencies):

```json
{
  "dependencies": {
    "express": "^4.21.2",
    "drizzle-orm": "^0.44.5",
    // ... todos los que se usan en producción
  }
}
```

---

## 🎯 Checklist de Deploy

- [ ] Código en GitHub actualizado
- [ ] Variables de entorno configuradas
- [ ] DATABASE_URL conectada
- [ ] JWT_SECRET configurado
- [ ] Build command correcto
- [ ] Start command correcto
- [ ] Deploy exitoso
- [ ] URL pública generada
- [ ] Base de datos inicializada
- [ ] Usuario admin creado
- [ ] Login funciona
- [ ] Todas las páginas cargan

---

## 📝 Comandos Útiles Railway CLI

```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Link proyecto
railway link

# Ver variables
railway variables

# Agregar variable
railway variables set KEY=value

# Ver logs
railway logs

# Ejecutar comando en Railway
railway run [comando]

# Abrir dashboard
railway open

# Deploy manual
railway up

# Ver status
railway status
```

---

## 🔗 Links Útiles

- **Dashboard**: https://railway.app/dashboard
- **Documentación**: https://docs.railway.app
- **Comunidad**: https://discord.gg/railway
- **Status**: https://status.railway.app
- **Pricing**: https://railway.app/pricing

---

## 🆘 Soporte

Si tienes problemas:

1. **Railway Discord**: https://discord.gg/railway
2. **Railway Docs**: https://docs.railway.app
3. **GitHub Issues**: https://github.com/Yona3112/creativos-pos-v2/issues

---

## ✅ Resumen

1. ✅ **Crear cuenta** en Railway
2. ✅ **Import desde GitHub**: Yona3112/creativos-pos-v2
3. ✅ **Conectar PostgreSQL** existente
4. ✅ **Configurar variables** de entorno
5. ✅ **Deploy automático**
6. ✅ **Generar URL pública**
7. ✅ **Inicializar base de datos**
8. ✅ **Verificar funcionamiento**

**Costo: ~$10/mes**
**Tiempo: 10-15 minutos**

---

**¡Tu Creativos POS v2.0 estará en producción!** 🚀

**URL final**: https://creativos-pos-v2-production.up.railway.app
**Costo**: $5-10/mes
**Always-on**: ✅ Sí
**Deploy automático**: ✅ Desde GitHub
