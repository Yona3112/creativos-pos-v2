#!/bin/bash

# Crear componentes de diálogos
mkdir -p client/src/components/dialogs

# Crear páginas restantes
touch client/src/pages/Cotizaciones.tsx
touch client/src/pages/Reportes.tsx

# Crear componentes de diálogos
touch client/src/components/dialogs/ProductoDialog.tsx
touch client/src/components/dialogs/ClienteDialog.tsx
touch client/src/components/dialogs/VentaDialog.tsx
touch client/src/components/dialogs/CotizacionDialog.tsx

echo "Archivos creados"
