import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generarPDFVentas(ventas: any[], fechaInicio: string, fechaFin: string) {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.text("Reporte de Ventas", 14, 20);
  
  // Período
  doc.setFontSize(11);
  doc.text(`Período: ${fechaInicio} - ${fechaFin}`, 14, 30);
  
  // Tabla de ventas
  const tableData = ventas.map((v: any) => [
    v.id,
    new Date(v.fecha).toLocaleDateString(),
    v.cliente || "Público General",
    `L ${v.total.toFixed(2)}`,
    v.metodoPago,
    v.estado
  ]);
  
  autoTable(doc, {
    startY: 40,
    head: [["#", "Fecha", "Cliente", "Total", "Método Pago", "Estado"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [59, 130, 246] },
  });
  
  // Total
  const totalVentas = ventas.reduce((sum: number, v: any) => sum + v.total, 0);
  const finalY = (doc as any).lastAutoTable.finalY || 40;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total: L ${totalVentas.toFixed(2)}`, 14, finalY + 10);
  
  // Descargar
  doc.save(`reporte-ventas-${new Date().toISOString().split("T")[0]}.pdf`);
}

export function generarPDFInventario(productos: any[]) {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.text("Reporte de Inventario", 14, 20);
  
  // Fecha
  doc.setFontSize(11);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Tabla de productos
  const tableData = productos.map((p: any) => [
    p.codigo,
    p.nombre,
    p.stock,
    `L ${p.precio.toFixed(2)}`,
    `L ${(p.stock * p.precio).toFixed(2)}`,
    p.stock < 10 ? "⚠️ Bajo" : "✓ OK"
  ]);
  
  autoTable(doc, {
    startY: 40,
    head: [["Código", "Producto", "Stock", "Precio", "Valor Total", "Estado"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [59, 130, 246] },
  });
  
  // Totales
  const totalProductos = productos.length;
  const totalStock = productos.reduce((sum: number, p: any) => sum + p.stock, 0);
  const valorTotal = productos.reduce((sum: number, p: any) => sum + (p.stock * p.precio), 0);
  
  const finalY = (doc as any).lastAutoTable.finalY || 40;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Productos: ${totalProductos}`, 14, finalY + 10);
  doc.text(`Total Unidades: ${totalStock}`, 14, finalY + 17);
  doc.text(`Valor Total Inventario: L ${valorTotal.toFixed(2)}`, 14, finalY + 24);
  
  // Descargar
  doc.save(`reporte-inventario-${new Date().toISOString().split("T")[0]}.pdf`);
}

export function generarPDFCorteCaja(corte: any) {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.text("Corte de Caja", 14, 20);
  
  // Información del corte
  doc.setFontSize(11);
  doc.text(`Fecha: ${new Date(corte.fecha).toLocaleDateString()}`, 14, 35);
  doc.text(`Usuario: ${corte.usuario}`, 14, 42);
  doc.text(`Turno: ${corte.turno}`, 14, 49);
  
  // Línea separadora
  doc.line(14, 55, 196, 55);
  
  // Montos
  doc.setFontSize(12);
  let y = 65;
  
  doc.text("Monto Inicial:", 14, y);
  doc.text(`L ${corte.montoInicial.toFixed(2)}`, 140, y, { align: "right" });
  y += 10;
  
  doc.text("Ventas Efectivo:", 14, y);
  doc.text(`L ${corte.ventasEfectivo.toFixed(2)}`, 140, y, { align: "right" });
  y += 7;
  
  doc.text("Ventas Tarjeta:", 14, y);
  doc.text(`L ${corte.ventasTarjeta.toFixed(2)}`, 140, y, { align: "right" });
  y += 7;
  
  doc.text("Ventas Transferencia:", 14, y);
  doc.text(`L ${corte.ventasTransferencia.toFixed(2)}`, 140, y, { align: "right" });
  y += 10;
  
  // Línea
  doc.line(14, y, 196, y);
  y += 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Total Ventas:", 14, y);
  doc.text(`L ${(corte.ventasEfectivo + corte.ventasTarjeta + corte.ventasTransferencia).toFixed(2)}`, 140, y, { align: "right" });
  y += 10;
  
  doc.text("Monto Final Esperado:", 14, y);
  doc.text(`L ${corte.montoFinalEsperado.toFixed(2)}`, 140, y, { align: "right" });
  y += 7;
  
  doc.text("Monto Final Real:", 14, y);
  doc.text(`L ${corte.montoFinalReal.toFixed(2)}`, 140, y, { align: "right" });
  y += 10;
  
  // Diferencia
  const diferencia = corte.montoFinalReal - corte.montoFinalEsperado;
  doc.setTextColor(diferencia >= 0 ? 0 : 255, diferencia >= 0 ? 128 : 0, 0);
  doc.text("Diferencia:", 14, y);
  doc.text(`L ${diferencia.toFixed(2)}`, 140, y, { align: "right" });
  
  // Observaciones
  if (corte.observaciones) {
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Observaciones:", 14, y + 15);
    doc.text(corte.observaciones, 14, y + 22, { maxWidth: 180 });
  }
  
  // Descargar
  doc.save(`corte-caja-${new Date().toISOString().split("T")[0]}.pdf`);
}
