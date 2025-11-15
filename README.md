# Creativos POS v2.0

Sistema de Punto de Venta (POS) completo para gestión de tiendas, desarrollado con tecnologías modernas y enfocado en la experiencia del usuario.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-18%2B-brightgreen.svg)

## 📋 Descripción

Creativos POS v2.0 es un sistema completo de punto de venta diseñado para pequeñas y medianas empresas. Incluye gestión de inventario, ventas, clientes, reportes y múltiples funcionalidades administrativas.

## ✨ Características Principales

### ✅ Módulos Implementados (15 en total)

1. **🛒 Punto de Venta (POS)**
   - Interfaz intuitiva de venta rápida
   - Grid de productos con búsqueda
   - Carrito de compras dinámico
   - Cálculo automático de ISV (15%)
   - Impresión de tickets/facturas

2. **📦 Productos**
   - CRUD completo de productos
   - Gestión de código, nombre, categoría
   - Control de costos y precios
   - Alertas de stock bajo
   - Stock mínimo configurable

3. **👥 Clientes**
   - Base de datos de clientes
   - Historial de compras
   - Información de contacto

4. **📝 Cotizaciones**
   - Creación de cotizaciones
   - Conversión a ventas
   - Seguimiento de estados

5. **📊 Historial de Ventas**
   - Registro completo de transacciones
   - Filtros por fecha, cliente, producto
   - Detalles de cada venta

6. **📈 Reportes**
   - Dashboard con métricas clave
   - Ventas del día
   - Valor de inventario
   - Exportación a PDF (jsPDF)

7. **💳 Notas de Crédito**
   - Gestión de devoluciones
   - Anulaciones de ventas

8. **💰 Corte de Caja**
   - Cierre diario de caja
   - Conciliación de efectivo
   - Reportes de caja

9. **🏦 Crédito**
   - Ventas a crédito
   - Control de pagos pendientes
   - Historial de abonos

10. **🎁 Promociones**
    - Descuentos y ofertas
    - Gestión de campañas

11. **🧾 Consumibles**
    - Control de suministros
    - Tickets, papel, etc.

12. **📚 Libros SAR**
    - Cumplimiento fiscal
    - Registros contables

13. **👤 Usuarios**
    - Roles y permisos
    - Gestión de vendedores
    - Control de acceso

14. **⚙️ Configuración**
    - Configuración de tienda
    - Parámetros del sistema
    - Personalización

15. **📋 Catálogo**
    - Vista de catálogo de productos
    - Organización por categorías

## 🛠️ Stack Tecnológico

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **API**: tRPC (Type-safe APIs)
- **Base de datos**: PostgreSQL (producción) / SQLite (desarrollo)
- **ORM**: Drizzle ORM
- **Autenticación**: JWT + bcryptjs
- **Validación**: Zod

### Frontend
- **Framework**: React 19.1
- **Bundler**: Vite 7.1
- **Router**: Wouter
- **UI Components**: Radix UI
- **Styling**: TailwindCSS 4.1
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form
- **Date Handling**: date-fns
- **Icons**: Lucide React

### Herramientas
- **Package Manager**: pnpm
- **TypeScript**: 5.9.3
- **Testing**: Vitest
- **PDF Generation**: jsPDF + jspdf-autotable
- **Email**: Nodemailer
- **File Upload**: Multer
- **Storage**: AWS S3 (opcional)

## 📦 Instalación

### Requisitos Previos

- Node.js 18 o superior
- PostgreSQL 14+ (para producción)
- pnpm (recomendado) o npm

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/creativos-pos-v2.git
cd creativos-pos-v2
```

### 2. Instalar dependencias

```bash
pnpm install
# o
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Base de datos (PostgreSQL - Producción)
DATABASE_URL=postgresql://usuario:password@host:puerto/database

# Base de datos (SQLite - Desarrollo)
# DATABASE_URL=file:./data/pos.db

# JWT Secret
JWT_SECRET=tu_secret_key_aqui

# Puerto del servidor
PORT=3000

# Modo
NODE_ENV=development

# S3 (Opcional - para uploads)
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=tu_bucket

# Email (Opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_password
```

### 4. Configurar la base de datos

#### Opción A: PostgreSQL (Producción)

```bash
# Conectar a PostgreSQL
psql "postgresql://usuario:password@host:puerto/database"

# Ejecutar schema
psql -f create-schema.sql

# O usar Drizzle
pnpm db:push
```

#### Opción B: SQLite (Desarrollo)

```bash
# Inicializar base de datos SQLite
node init-sqlite.mjs

# O aplicar migraciones
node apply-migration.mjs
```

### 5. Crear usuario administrador

```bash
node create-admin-user.mjs
```

Credenciales por defecto:
- **Email**: braham.admin@creativos.com
- **Contraseña**: admin123
- **Rol**: Admin

### 6. Ejecutar en desarrollo

```bash
pnpm dev
# o
npm run dev
```

El servidor iniciará en `http://localhost:3000`

### 7. Compilar para producción

```bash
pnpm build
pnpm start
```

## 📊 Estructura del Proyecto

```
creativos-pos-v2/
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── _core/         # Hooks y utilidades core
│   │   ├── components/    # Componentes React
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/          # Librerías y utilidades
│   │   └── utils/        # Utilidades (PDF, etc.)
├── server/                # Backend (Express + tRPC)
│   ├── _core/            # Core del servidor
│   ├── routers/          # tRPC routers
│   └── db/               # Configuración de DB
├── shared/               # Código compartido
│   └── types/           # Tipos TypeScript
├── drizzle/             # Schemas y migraciones
│   ├── schema.ts        # Schema PostgreSQL
│   ├── schema-sqlite.ts # Schema SQLite
│   └── migrations/      # Migraciones
├── docs/                # Documentación
├── patches/             # Patches de dependencias
├── .env                 # Variables de entorno
├── package.json         # Dependencias
├── tsconfig.json        # Configuración TypeScript
├── vite.config.ts       # Configuración Vite
└── drizzle.config.ts    # Configuración Drizzle
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo
pnpm dev                      # Iniciar en modo desarrollo
pnpm build                    # Compilar para producción
pnpm start                    # Iniciar en producción
pnpm check                    # Verificar tipos TypeScript

# Base de datos
pnpm db:push                  # Aplicar migraciones
node init-db.mjs             # Inicializar DB
node seed-admin.mjs          # Crear admin
node seed-productos.mjs      # Productos de prueba
node test-db-connection.mjs  # Probar conexión

# Testing
pnpm test                    # Ejecutar tests

# Utilidades
pnpm format                  # Formatear código
node list-tables.mjs        # Listar tablas DB
```

## 👥 Usuarios de Prueba

### Administrador
- **Email**: braham.admin@creativos.com
- **Contraseña**: admin123
- **Rol**: Admin
- **Permisos**: Acceso completo

### Productos de Prueba
El sistema incluye 8 productos de prueba:
1. Taza Personalizada - L 80.00 (Stock: 25)
2. Llavero Metálico - L 30.00 (Stock: 50)
3. Agenda 2025 - L 70.00 (Stock: 15)
4. Bolígrafo Premium - L 35.00 (Stock: 100)
5. Termo Térmico - L 150.00 (Stock: 10)
6. Cuaderno A4 - L 45.00 (Stock: 30)
7. Peluche Oso - L 120.00 (Stock: 8)
8. Marco de Fotos - L 65.00 (Stock: 20)

## 📱 Capturas de Pantalla

*(Agregar capturas de pantalla aquí)*

## 🔒 Seguridad

- ✅ Autenticación JWT
- ✅ Contraseñas hasheadas con bcryptjs
- ✅ Validación de datos con Zod
- ✅ Protección de rutas
- ✅ CORS configurado
- ✅ Variables de entorno

## 🌐 Deploy

### Railway (Recomendado)

1. Crear cuenta en [Railway.app](https://railway.app)
2. Crear nuevo proyecto PostgreSQL
3. Conectar repositorio GitHub
4. Configurar variables de entorno
5. Deploy automático

### Render

1. Crear cuenta en [Render.com](https://render.com)
2. Crear Web Service
3. Conectar repositorio
4. Configurar build command: `pnpm install && pnpm build`
5. Configurar start command: `pnpm start`

### VPS (DigitalOcean, Linode, etc.)

```bash
# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Clonar y configurar
git clone tu-repo
cd creativos-pos-v2
pnpm install
pnpm build

# Usar PM2 para proceso
npm install -g pm2
pm2 start dist/index.js --name creativos-pos
pm2 save
pm2 startup
```

## 🧪 Estado de Pruebas

### Módulos Probados: 5/15 ✅
- ✅ Login y Autenticación
- ✅ Dashboard Principal
- ✅ Productos (CRUD)
- ✅ Punto de Venta
- ✅ Reportes

### Módulos Pendientes: 10/15 ⏳
- ⏳ Clientes
- ⏳ Cotizaciones
- ⏳ Historial Ventas
- ⏳ Notas de Crédito
- ⏳ Corte de Caja
- ⏳ Crédito
- ⏳ Promociones
- ⏳ Consumibles
- ⏳ Libros SAR
- ⏳ Usuarios
- ⏳ Configuración

### Estado General
- **Funcionalidad**: ✅ Excelente
- **Interfaz**: ✅ Profesional y limpia
- **Responsive**: ✅ Sidebar colapsable
- **Navegación**: ✅ Fluida
- **Performance**: ✅ Carga rápida

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crear una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Roadmap

- [ ] Completar pruebas de módulos pendientes
- [ ] Implementar dashboard analytics avanzado
- [ ] Agregar soporte multi-sucursal
- [ ] Implementar facturación electrónica (Honduras)
- [ ] App móvil (React Native)
- [ ] Integración con pasarelas de pago
- [ ] Modo offline (PWA)
- [ ] Reportes avanzados con gráficos
- [ ] Backup automático
- [ ] API REST pública

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Creativos Gift Shop**

- Email: braham.admin@creativos.com
- Sistema: POS v2.0

## 🙏 Agradecimientos

- Radix UI por los componentes accesibles
- TailwindCSS por el sistema de diseño
- tRPC por las APIs type-safe
- Drizzle ORM por el ORM TypeScript-first
- Toda la comunidad open source

---

**Nota**: Este sistema está en producción activa. Para soporte o consultas, contactar al equipo de desarrollo.

**Versión**: 2.0.0  
**Última actualización**: Noviembre 2024
