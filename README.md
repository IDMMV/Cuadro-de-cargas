# Cuadro de Cargas Hugo

Web estática para análisis de cargas y consumo de la vivienda.

Incluye:
- Cuadro de cargas editable.
- Potencia instalada.
- Factor de potencia (FP).
- Factor de demanda (FD).
- Máxima demanda.
- Corriente 1F/3F.
- kWh/día y kWh/mes.
- Costo diario/mensual.
- Comparación con 331 kWh/mes.
- Exportación a Excel.
- Base normativa peruana.

## Despliegue
Proyecto sin backend. Puede desplegarse directamente en Vercel como sitio estático.

## Normativa
La aplicación distingue entre referencia gremial y normativa técnica. CAPECO no es la norma eléctrica. Para el sustento del cuadro deben verificarse el RNE EM.010 y el Código Nacional de Electricidad – Utilización, especialmente la Sección 050 y Regla 050-200 aplicable a viviendas.

## Nota
Los FP, FD y potencias estimadas son editables. Las lecturas con pinza de fuga no deben convertirse automáticamente en kWh. Para consumo real se recomienda medidor/analizador de potencia.