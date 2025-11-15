import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DetalleVenta {
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface DatosFactura {
  numeroFactura: string;
  fecha: Date;
  clienteNombre?: string;
  clienteRTN?: string;
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

export function generarFacturaPDF(datos: DatosFactura) {
  const doc = new jsPDF();
  
  // Configuración
  const pageWidth = doc.internal.pageSize.width;
  let yPos = 20;

  // Encabezado de la tienda
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(datos.nombreTienda, pageWidth / 2, yPos, { align: "center" });
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  if (datos.rtnTienda) {
    doc.text(`RTN: ${datos.rtnTienda}`, pageWidth / 2, yPos, { align: "center" });
    yPos += 5;
  }
  if (datos.direccionTienda) {
    doc.text(datos.direccionTienda, pageWidth / 2, yPos, { align: "center" });
    yPos += 5;
  }
  if (datos.telefonoTienda) {
    doc.text(`Tel: ${datos.telefonoTienda}`, pageWidth / 2, yPos, { align: "center" });
    yPos += 5;
  }

  // Línea separadora
  yPos += 5;
  doc.setLineWidth(0.5);
  doc.line(15, yPos, pageWidth - 15, yPos);
  yPos += 10;

  // Información de la factura
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`FACTURA #${datos.numeroFactura}`, 15, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Fecha: ${new Date(datos.fecha).toLocaleString("es-HN")}`, 15, yPos);
  yPos += 6;

  if (datos.clienteNombre) {
    doc.text(`Cliente: ${datos.clienteNombre}`, 15, yPos);
    yPos += 6;
  }
  if (datos.clienteRTN) {
    doc.text(`RTN: ${datos.clienteRTN}`, 15, yPos);
    yPos += 6;
  }

  yPos += 5;

  // Tabla de productos
  const tableData = datos.detalles.map((detalle) => [
    detalle.productoNombre,
    detalle.cantidad.toString(),
    `L ${detalle.precioUnitario.toFixed(2)}`,
    `L ${detalle.subtotal.toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Producto", "Cant.", "Precio Unit.", "Subtotal"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [59, 130, 246], // blue-500
      textColor: 255,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 25, halign: "center" },
      2: { cellWidth: 35, halign: "right" },
      3: { cellWidth: 35, halign: "right" },
    },
  });

  // Obtener posición Y después de la tabla
  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Totales
  const xRight = pageWidth - 15;
  const xLabel = xRight - 60;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  doc.text("Subtotal:", xLabel, yPos);
  doc.text(`L ${datos.subtotal.toFixed(2)}`, xRight, yPos, { align: "right" });
  yPos += 6;

  doc.text("ISV (15%):", xLabel, yPos);
  doc.text(`L ${datos.impuesto.toFixed(2)}`, xRight, yPos, { align: "right" });
  yPos += 6;

  // Línea antes del total
  doc.setLineWidth(0.3);
  doc.line(xLabel, yPos, xRight, yPos);
  yPos += 6;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL:", xLabel, yPos);
  doc.text(`L ${datos.total.toFixed(2)}`, xRight, yPos, { align: "right" });
  yPos += 10;

  // Información de pago
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Método de Pago: ${datos.metodoPago}`, 15, yPos);
  yPos += 6;

  if (datos.metodoPago === "Efectivo" && datos.efectivo) {
    doc.text(`Efectivo Recibido: L ${datos.efectivo.toFixed(2)}`, 15, yPos);
    yPos += 6;
    if (datos.cambio) {
      doc.text(`Cambio: L ${datos.cambio.toFixed(2)}`, 15, yPos);
      yPos += 6;
    }
  }

  // Pie de página
  yPos += 10;
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text("¡Gracias por su compra!", pageWidth / 2, yPos, { align: "center" });
  yPos += 5;
  doc.text("Conserve esta factura para cualquier reclamo", pageWidth / 2, yPos, { align: "center" });

  return doc;
}

export function descargarFacturaPDF(datos: DatosFactura) {
  const doc = generarFacturaPDF(datos);
  doc.save(`Factura-${datos.numeroFactura}.pdf`);
}

export function imprimirFacturaPDF(datos: DatosFactura) {
  const doc = generarFacturaPDF(datos);
  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank");
}
