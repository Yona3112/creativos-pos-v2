/**
 * Utilidades para cálculo del ISV (Impuesto Sobre Ventas)
 * En Honduras, el ISV es del 15% y está INCLUIDO en el precio final
 */

export const ISV_RATE = 0.15; // 15%
export const ISV_DIVISOR = 1 + ISV_RATE; // 1.15

/**
 * Calcula el subtotal (precio sin ISV) a partir del total (precio con ISV incluido)
 * @param total - Precio total con ISV incluido
 * @returns Subtotal sin ISV
 * @example calcularSubtotal(100) // returns 86.96
 */
export function calcularSubtotal(total: number): number {
  return total / ISV_DIVISOR;
}

/**
 * Calcula el monto del ISV a partir del total (precio con ISV incluido)
 * @param total - Precio total con ISV incluido
 * @returns Monto del ISV
 * @example calcularISV(100) // returns 13.04
 */
export function calcularISV(total: number): number {
  const subtotal = calcularSubtotal(total);
  return total - subtotal;
}

/**
 * Calcula el total (precio con ISV) a partir del subtotal (precio sin ISV)
 * @param subtotal - Precio sin ISV
 * @returns Total con ISV incluido
 * @example calcularTotalDesdeSubtotal(86.96) // returns 100
 */
export function calcularTotalDesdeSubtotal(subtotal: number): number {
  return subtotal * ISV_DIVISOR;
}

/**
 * Desglosa un total en subtotal e ISV
 * @param total - Precio total con ISV incluido
 * @returns Objeto con subtotal, ISV y total
 * @example desglosarTotal(100) // returns { subtotal: 86.96, isv: 13.04, total: 100 }
 */
export function desglosarTotal(total: number): {
  subtotal: number;
  isv: number;
  total: number;
} {
  const subtotal = calcularSubtotal(total);
  const isv = total - subtotal;
  return {
    subtotal: Number(subtotal.toFixed(2)),
    isv: Number(isv.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}

/**
 * Calcula el desglose de una venta con múltiples productos
 * @param items - Array de items con precio y cantidad
 * @returns Desglose total de la venta
 */
export function calcularDesglosVenta(
  items: Array<{ precio: number; cantidad: number }>
): {
  subtotal: number;
  isv: number;
  total: number;
  cantidadItems: number;
} {
  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const desglose = desglosarTotal(total);

  return {
    ...desglose,
    cantidadItems: items.reduce((sum, item) => sum + item.cantidad, 0),
  };
}

/**
 * Formatea un monto en Lempiras
 * @param monto - Monto a formatear
 * @returns Monto formateado con símbolo de Lempira
 * @example formatearLempiras(100) // returns "L 100.00"
 */
export function formatearLempiras(monto: number): string {
  return `L ${monto.toFixed(2)}`;
}
