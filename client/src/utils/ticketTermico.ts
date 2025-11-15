/**
 * Utilidad para generar tickets térmicos de 88mm
 * 
 * Nota: La impresión térmica real requiere hardware específico y drivers.
 * Esta implementación genera un HTML optimizado para impresoras térmicas
 * que puede ser impreso usando window.print() o enviado a una impresora ESC/POS.
 */

interface DetalleVenta {
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface DatosTicket {
  numeroFactura: string;
  fecha: Date;
  clienteNombre?: string;
  subtotal: number;
  impuesto: number;
  total: number;
  metodoPago: string;
  efectivo?: number;
  cambio?: number;
  detalles: DetalleVenta[];
  nombreTienda: string;
  rtnTienda?: string;
  direccionTienda?: string;
  telefonoTienda?: string;
}

/**
 * Genera HTML para ticket térmico de 88mm
 */
export function generarTicketHTML(datos: DatosTicket): string {
  const fecha = new Date(datos.fecha).toLocaleString("es-HN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ticket ${datos.numeroFactura}</title>
  <style>
    @media print {
      @page {
        size: 88mm auto;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
      }
    }
    
    body {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.4;
      width: 88mm;
      margin: 0 auto;
      padding: 5mm;
      color: #000;
      background: #fff;
    }
    
    .center {
      text-align: center;
    }
    
    .bold {
      font-weight: bold;
    }
    
    .large {
      font-size: 16px;
    }
    
    .separator {
      border-top: 1px dashed #000;
      margin: 5px 0;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    td {
      padding: 2px 0;
    }
    
    .right {
      text-align: right;
    }
    
    .product-line {
      border-bottom: 1px dotted #ccc;
    }
    
    .totals {
      margin-top: 10px;
    }
    
    .footer {
      margin-top: 15px;
      font-size: 10px;
    }
  </style>
</head>
<body>
  <!-- Encabezado -->
  <div class="center bold large">
    ${datos.nombreTienda}
  </div>
  `;

  if (datos.rtnTienda) {
    html += `<div class="center">RTN: ${datos.rtnTienda}</div>`;
  }
  if (datos.direccionTienda) {
    html += `<div class="center">${datos.direccionTienda}</div>`;
  }
  if (datos.telefonoTienda) {
    html += `<div class="center">Tel: ${datos.telefonoTienda}</div>`;
  }

  html += `
  <div class="separator"></div>
  
  <!-- Información de la venta -->
  <div class="center bold">FACTURA #${datos.numeroFactura}</div>
  <div class="center">${fecha}</div>
  `;

  if (datos.clienteNombre) {
    html += `<div>Cliente: ${datos.clienteNombre}</div>`;
  }

  html += `
  <div class="separator"></div>
  
  <!-- Productos -->
  <table>
  `;

  datos.detalles.forEach((detalle) => {
    html += `
    <tr class="product-line">
      <td colspan="3" class="bold">${detalle.productoNombre}</td>
    </tr>
    <tr class="product-line">
      <td>${detalle.cantidad} x</td>
      <td class="right">L ${detalle.precioUnitario.toFixed(2)}</td>
      <td class="right bold">L ${detalle.subtotal.toFixed(2)}</td>
    </tr>
    `;
  });

  html += `
  </table>
  
  <div class="separator"></div>
  
  <!-- Totales -->
  <div class="totals">
    <table>
      <tr>
        <td>Subtotal:</td>
        <td class="right">L ${datos.subtotal.toFixed(2)}</td>
      </tr>
      <tr>
        <td>ISV (15%):</td>
        <td class="right">L ${datos.impuesto.toFixed(2)}</td>
      </tr>
      <tr class="bold large">
        <td>TOTAL:</td>
        <td class="right">L ${datos.total.toFixed(2)}</td>
      </tr>
    </table>
  </div>
  
  <div class="separator"></div>
  
  <!-- Pago -->
  <div>Método de Pago: ${datos.metodoPago}</div>
  `;

  if (datos.metodoPago === "Efectivo" && datos.efectivo) {
    html += `
    <div>Efectivo: L ${datos.efectivo.toFixed(2)}</div>
    `;
    if (datos.cambio && datos.cambio > 0) {
      html += `<div class="bold">Cambio: L ${datos.cambio.toFixed(2)}</div>`;
    }
  }

  html += `
  <div class="separator"></div>
  
  <!-- Pie de página -->
  <div class="footer center">
    <div class="bold">¡Gracias por su compra!</div>
    <div>Conserve este ticket</div>
    <div>para cualquier reclamo</div>
  </div>
  
  <br><br>
</body>
</html>
  `;

  return html;
}

/**
 * Imprime un ticket térmico
 * Abre una ventana de impresión con el ticket formateado
 */
export function imprimirTicketTermico(datos: DatosTicket) {
  const ticketHTML = generarTicketHTML(datos);
  
  // Crear ventana de impresión
  const ventanaImpresion = window.open("", "_blank", "width=350,height=600");
  
  if (!ventanaImpresion) {
    alert("Por favor, permite las ventanas emergentes para imprimir el ticket");
    return;
  }
  
  ventanaImpresion.document.write(ticketHTML);
  ventanaImpresion.document.close();
  
  // Esperar a que cargue y luego imprimir
  ventanaImpresion.onload = () => {
    ventanaImpresion.focus();
    ventanaImpresion.print();
    
    // Cerrar ventana después de imprimir (opcional)
    // ventanaImpresion.onafterprint = () => {
    //   ventanaImpresion.close();
    // };
  };
}

/**
 * Descarga el ticket como HTML
 * Útil para pruebas o para enviar por email
 */
export function descargarTicketHTML(datos: DatosTicket) {
  const ticketHTML = generarTicketHTML(datos);
  const blob = new Blob([ticketHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = `Ticket-${datos.numeroFactura}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Genera comandos ESC/POS para impresoras térmicas
 * Nota: Esto requiere una librería adicional o comunicación directa con la impresora
 * Esta es una implementación de ejemplo que muestra la estructura
 */
export function generarComandosESCPOS(datos: DatosTicket): string {
  // Comandos ESC/POS básicos
  const ESC = "\x1B";
  const GS = "\x1D";
  
  let comandos = "";
  
  // Inicializar impresora
  comandos += ESC + "@";
  
  // Centrar texto
  comandos += ESC + "a" + "\x01";
  
  // Texto grande y negrita
  comandos += ESC + "!" + "\x30";
  comandos += datos.nombreTienda + "\n";
  
  // Texto normal
  comandos += ESC + "!" + "\x00";
  
  if (datos.rtnTienda) {
    comandos += `RTN: ${datos.rtnTienda}\n`;
  }
  if (datos.direccionTienda) {
    comandos += `${datos.direccionTienda}\n`;
  }
  if (datos.telefonoTienda) {
    comandos += `Tel: ${datos.telefonoTienda}\n`;
  }
  
  // Línea separadora
  comandos += "--------------------------------\n";
  
  // Número de factura
  comandos += ESC + "!" + "\x10"; // Negrita
  comandos += `FACTURA #${datos.numeroFactura}\n`;
  comandos += ESC + "!" + "\x00"; // Normal
  
  const fecha = new Date(datos.fecha).toLocaleString("es-HN");
  comandos += `${fecha}\n`;
  
  if (datos.clienteNombre) {
    comandos += `Cliente: ${datos.clienteNombre}\n`;
  }
  
  comandos += "--------------------------------\n";
  
  // Alinear a la izquierda
  comandos += ESC + "a" + "\x00";
  
  // Productos
  datos.detalles.forEach((detalle) => {
    comandos += ESC + "!" + "\x08"; // Negrita
    comandos += `${detalle.productoNombre}\n`;
    comandos += ESC + "!" + "\x00"; // Normal
    
    const cantidad = `${detalle.cantidad} x`;
    const precio = `L ${detalle.precioUnitario.toFixed(2)}`;
    const subtotal = `L ${detalle.subtotal.toFixed(2)}`;
    
    // Formatear línea con espacios
    const espacios1 = " ".repeat(10 - cantidad.length);
    const espacios2 = " ".repeat(15 - precio.length);
    
    comandos += `${cantidad}${espacios1}${precio}${espacios2}${subtotal}\n`;
  });
  
  comandos += "--------------------------------\n";
  
  // Totales
  comandos += `Subtotal:           L ${datos.subtotal.toFixed(2)}\n`;
  comandos += `ISV (15%):          L ${datos.impuesto.toFixed(2)}\n`;
  
  comandos += ESC + "!" + "\x30"; // Grande y negrita
  comandos += `TOTAL:              L ${datos.total.toFixed(2)}\n`;
  comandos += ESC + "!" + "\x00"; // Normal
  
  comandos += "--------------------------------\n";
  
  // Pago
  comandos += `Método de Pago: ${datos.metodoPago}\n`;
  
  if (datos.metodoPago === "Efectivo" && datos.efectivo) {
    comandos += `Efectivo:           L ${datos.efectivo.toFixed(2)}\n`;
    if (datos.cambio && datos.cambio > 0) {
      comandos += `Cambio:             L ${datos.cambio.toFixed(2)}\n`;
    }
  }
  
  comandos += "--------------------------------\n";
  
  // Centrar texto
  comandos += ESC + "a" + "\x01";
  
  // Pie de página
  comandos += "\n";
  comandos += ESC + "!" + "\x08"; // Negrita
  comandos += "¡Gracias por su compra!\n";
  comandos += ESC + "!" + "\x00"; // Normal
  comandos += "Conserve este ticket\n";
  comandos += "para cualquier reclamo\n";
  comandos += "\n\n\n";
  
  // Cortar papel (si la impresora lo soporta)
  comandos += GS + "V" + "\x00";
  
  return comandos;
}
