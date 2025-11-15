# Configuración de Email para Cotizaciones

El sistema de cotizaciones del catálogo público envía emails automáticamente usando **nodemailer** con Gmail. Para activar esta funcionalidad, necesitas configurar las variables de entorno.

---

## Paso 1: Crear una Contraseña de Aplicación en Gmail

Google requiere que uses una "contraseña de aplicación" en lugar de tu contraseña normal para aplicaciones de terceros.

### Instrucciones:

1. **Habilitar verificación en dos pasos:**
   - Ve a https://myaccount.google.com/security
   - En "Cómo inicias sesión en Google", activa "Verificación en dos pasos"
   - Sigue los pasos para configurar tu teléfono

2. **Generar contraseña de aplicación:**
   - Ve a https://myaccount.google.com/apppasswords
   - Selecciona "Correo" y "Otro (nombre personalizado)"
   - Escribe "Creativos POS" como nombre
   - Haz clic en "Generar"
   - **Copia la contraseña de 16 caracteres** (sin espacios)

---

## Paso 2: Configurar Variables de Entorno

Agrega estas variables de entorno en el panel de configuración de Manus:

```bash
GMAIL_USER=tu-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

**Ejemplo:**
```bash
GMAIL_USER=creativos.shop@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

---

## Paso 3: Reiniciar el Servidor

Después de configurar las variables de entorno:

1. Ve al panel de Manus
2. Haz clic en "Restart Server"
3. Espera a que el servidor se reinicie completamente

---

## Cómo Funciona

Cuando un cliente solicita una cotización desde el catálogo público:

1. **Email al administrador:**
   - Asunto: "Nueva Cotización de [Nombre] - L [Total]"
   - Contiene: datos del cliente, lista de productos, total
   - Se envía a: `GMAIL_USER`

2. **Email de confirmación al cliente:**
   - Asunto: "Confirmación de Solicitud de Cotización - Creativos Gift Shop"
   - Contiene: mensaje de agradecimiento, confirmación de recepción
   - Se envía a: email proporcionado por el cliente

---

## Solución de Problemas

### Error: "Invalid login"
- Verifica que hayas habilitado la verificación en dos pasos
- Asegúrate de usar la contraseña de aplicación, no tu contraseña normal
- Revisa que el email en `GMAIL_USER` sea correcto

### Error: "Connection timeout"
- Verifica tu conexión a internet
- Asegúrate de que Gmail no esté bloqueado por tu firewall
- Intenta con otro proveedor de email (ver alternativas abajo)

### Los emails no llegan
- Revisa la carpeta de spam del destinatario
- Verifica que las variables de entorno estén configuradas correctamente
- Revisa los logs del servidor para ver errores

---

## Alternativas a Gmail

Si prefieres usar otro proveedor de email:

### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.OUTLOOK_USER,
    pass: process.env.OUTLOOK_PASSWORD,
  },
});
```

### SendGrid (Recomendado para producción)
```javascript
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});
```

### SMTP Personalizado
```javascript
const transporter = nodemailer.createTransport({
  host: "smtp.tudominio.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
```

---

## Personalización de Templates

Los templates de email están en `server/routers/catalogo.ts`. Puedes personalizarlos editando las variables `emailHTML` y `confirmacionHTML`.

### Elementos que puedes personalizar:

- Colores del header (`background-color: #2563eb`)
- Logo de la tienda (agregar `<img>` en el header)
- Texto del footer
- Información de contacto
- Estilo de la tabla de productos

---

## Límites de Gmail

Gmail tiene límites de envío para cuentas gratuitas:

- **500 emails por día** (cuentas personales)
- **2000 emails por día** (Google Workspace)

Si esperas recibir más de 500 cotizaciones por día, considera usar SendGrid o Mailgun.

---

## Seguridad

**IMPORTANTE:**
- Nunca compartas tu contraseña de aplicación
- No la subas a repositorios públicos
- Usa variables de entorno (ya configurado en el sistema)
- Revoca la contraseña de aplicación si crees que fue comprometida

---

## Soporte

Si tienes problemas con la configuración de email, contacta al soporte de Manus o revisa la documentación de nodemailer: https://nodemailer.com/
