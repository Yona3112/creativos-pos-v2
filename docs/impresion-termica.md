# Guía de Impresión Térmica

Esta guía explica cómo funciona la impresión térmica de tickets de 88mm en el sistema POS y cómo configurar impresoras físicas.

## Funcionalidad Actual

El sistema genera automáticamente dos documentos cuando se procesa una venta:

1. **Factura PDF** - Documento completo en formato A4 para archivo
2. **Ticket Térmico 88mm** - Recibo optimizado para impresoras térmicas

## Cómo Funciona

Cuando se procesa una venta en el POS:

1. Se descarga automáticamente la factura en PDF
2. Se abre una ventana de impresión con el ticket térmico formateado
3. El usuario puede imprimir el ticket en cualquier impresora conectada

## Formato del Ticket (88mm)

El ticket incluye:

- **Encabezado:** Nombre de la tienda, RTN, dirección, teléfono
- **Información de venta:** Número de factura, fecha y hora
- **Productos:** Lista con cantidad, precio unitario y subtotal
- **Totales:** Subtotal, ISV (15%) y Total
- **Pago:** Método de pago, efectivo recibido y cambio
- **Pie de página:** Mensaje de agradecimiento

## Impresoras Compatibles

### Impresoras Térmicas Recomendadas

#### 1. **Epson TM-T20III** (Recomendada)
- **Precio:** ~$200 USD
- **Ancho:** 80mm (compatible con 88mm)
- **Velocidad:** 250 mm/seg
- **Conectividad:** USB, Ethernet, Serial
- **Driver:** ESC/POS
- **Ventajas:** Muy confiable, drivers para Windows/Mac/Linux

#### 2. **Star Micronics TSP143IIIU**
- **Precio:** ~$180 USD
- **Ancho:** 80mm
- **Velocidad:** 250 mm/seg
- **Conectividad:** USB
- **Driver:** Star Line Mode
- **Ventajas:** Fácil configuración, muy rápida

#### 3. **Bixolon SRP-350III**
- **Precio:** ~$150 USD
- **Ancho:** 80mm
- **Velocidad:** 250 mm/seg
- **Conectividad:** USB, Serial, Ethernet
- **Driver:** ESC/POS
- **Ventajas:** Económica, buena calidad

#### 4. **Impresoras Genéricas (58mm/80mm)**
- **Precio:** $50-100 USD
- **Ancho:** 58mm o 80mm
- **Conectividad:** USB, Bluetooth
- **Driver:** ESC/POS genérico
- **Nota:** Calidad variable, verificar compatibilidad

### Dónde Comprar en Honduras

1. **Tiendas Locales:**
   - Compucentro (Tegucigalpa, San Pedro Sula)
   - Intelaf (Tegucigalpa)
   - Grupo Karim (San Pedro Sula)

2. **Online (Envío a Honduras):**
   - Amazon (con envío internacional)
   - AliExpress (más económico, tarda más)
   - eBay

## Instalación y Configuración

### Paso 1: Conectar la Impresora

1. Conecta la impresora térmica a tu computadora vía USB
2. Enciende la impresora
3. Espera a que el sistema operativo la detecte

### Paso 2: Instalar Drivers

#### Windows:
1. Descarga el driver desde el sitio web del fabricante
2. Ejecuta el instalador
3. Reinicia la computadora
4. Verifica en "Dispositivos e impresoras" que aparezca

#### macOS:
1. Descarga el driver desde el sitio web del fabricante
2. Instala el archivo .dmg
3. Ve a "Preferencias del Sistema" → "Impresoras y escáneres"
4. Haz clic en "+" para agregar la impresora
5. Selecciona tu impresora térmica

#### Linux:
```bash
# Para impresoras ESC/POS
sudo apt-get install printer-driver-escpos

# Agregar impresora
sudo lpadmin -p ThermalPrinter -E -v usb://YOUR_PRINTER_URI -m escpos.ppd
```

### Paso 3: Configurar como Predeterminada

1. Ve a la configuración de impresoras de tu sistema operativo
2. Selecciona la impresora térmica
3. Márcala como "Impresora predeterminada" (opcional)

### Paso 4: Probar Impresión

1. En el sistema POS, procesa una venta de prueba
2. Cuando aparezca la ventana de impresión del ticket:
   - Selecciona tu impresora térmica
   - Ajusta la configuración si es necesario
   - Haz clic en "Imprimir"

## Configuración Avanzada

### Ajustar Tamaño de Papel

Si el ticket no se imprime correctamente:

1. **Windows:**
   - Panel de Control → Dispositivos e impresoras
   - Clic derecho en la impresora → "Preferencias de impresión"
   - Configurar tamaño de papel: 80mm x Continuo

2. **macOS:**
   - Preferencias del Sistema → Impresoras y escáneres
   - Seleccionar impresora → "Opciones y suministros"
   - Pestaña "Driver" → Configurar tamaño de papel

### Configurar Corte Automático

Algunas impresoras térmicas tienen cuchilla automática:

1. En las preferencias de la impresora
2. Busca "Corte automático" o "Auto-cut"
3. Actívalo para que corte el papel después de cada ticket

### Ajustar Densidad de Impresión

Si el texto sale muy claro o muy oscuro:

1. En las preferencias de la impresora
2. Busca "Densidad" o "Darkness"
3. Ajusta el valor (generalmente 50-70%)

## Solución de Problemas

### El ticket no se imprime

**Solución:**
1. Verifica que la impresora esté encendida
2. Verifica que haya papel
3. Verifica que el driver esté instalado correctamente
4. Prueba imprimir una página de prueba desde el sistema operativo

### El ticket se imprime cortado

**Solución:**
1. Ajusta el tamaño de papel en las preferencias de la impresora
2. Verifica que el ancho sea 80mm (no 58mm)
3. Asegúrate de que el papel esté cargado correctamente

### El texto sale borroso

**Solución:**
1. Limpia el cabezal de impresión con alcohol isopropílico
2. Ajusta la densidad de impresión
3. Verifica que el papel sea térmico de buena calidad

### La impresora no corta el papel

**Solución:**
1. Verifica que la impresora tenga cuchilla automática
2. Activa el corte automático en las preferencias
3. Si no tiene cuchilla, corta manualmente con tijeras

### El ticket se imprime en formato A4

**Solución:**
1. En la ventana de impresión, selecciona la impresora térmica (no la impresora normal)
2. Configura el tamaño de papel como "Personalizado" o "80mm"
3. Guarda la configuración como predeterminada

## Uso sin Impresora Térmica

Si no tienes una impresora térmica, puedes:

1. **Imprimir en impresora normal:**
   - El ticket se adaptará al tamaño A4
   - Puedes recortar el papel después

2. **Guardar como HTML:**
   - Modifica el código para usar `descargarTicketHTML()` en lugar de `imprimirTicketTermico()`
   - Esto descargará el ticket como archivo HTML
   - Puedes abrirlo y enviarlo por email

3. **Usar solo la factura PDF:**
   - Comenta la línea de impresión térmica en `VentaDialog.tsx`
   - Solo se generará la factura PDF

## Integración con Impresoras ESC/POS

Para integración avanzada con comandos ESC/POS directos:

### Opción 1: Librería JavaScript

```bash
pnpm add escpos escpos-usb
```

```typescript
import escpos from 'escpos';
import USB from 'escpos-usb';

const device = new USB();
const printer = new escpos.Printer(device);

device.open(() => {
  printer
    .font('a')
    .align('ct')
    .text('Creativos Gift Shop')
    .cut()
    .close();
});
```

### Opción 2: Servidor de Impresión

Crear un servidor local que escuche peticiones HTTP y envíe comandos a la impresora:

```javascript
// server.js
const express = require('express');
const escpos = require('escpos');

const app = express();
app.post('/print', (req, res) => {
  // Procesar datos y enviar a impresora
});
app.listen(3001);
```

### Opción 3: Aplicación de Escritorio

Usar Electron para crear una aplicación de escritorio que tenga acceso directo al hardware:

```bash
pnpm add -D electron
```

## Recomendaciones

✅ **Usa papel térmico de calidad** - El papel barato se desvanece rápido  
✅ **Limpia el cabezal regularmente** - Cada 1-2 meses  
✅ **Guarda rollos en lugar fresco y seco** - El calor daña el papel térmico  
✅ **Ten rollos de repuesto** - Siempre ten al menos 2 rollos extra  
✅ **Configura impresión automática** - Para agilizar el proceso de venta  

## Costos Operativos

### Papel Térmico (80mm)

- **Rollo de 80mm x 80m:** $2-3 USD
- **Rendimiento:** ~400-500 tickets por rollo
- **Costo por ticket:** ~$0.005-0.007 USD

### Mantenimiento

- **Cabezal de impresión:** $50-100 USD (cada 2-3 años)
- **Cuchilla:** $20-30 USD (cada 1-2 años)
- **Limpieza:** $5 USD en alcohol isopropílico (anual)

## Próximos Pasos

1. ✅ Compra una impresora térmica compatible
2. ✅ Instala los drivers oficiales
3. ✅ Configura el tamaño de papel a 80mm
4. ✅ Prueba la impresión con una venta de prueba
5. ✅ Ajusta la densidad y configuración según necesites
6. ✅ Configura como impresora predeterminada para agilizar

---

**¿Necesitas ayuda?** Consulta el manual de tu impresora o contacta al soporte técnico del fabricante.
