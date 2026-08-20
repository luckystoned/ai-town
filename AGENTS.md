# Repository instructions

## Working methodology

- Trabajar una única tarea o milestone pequeño por iteración.
- Nunca avanzar automáticamente al siguiente milestone.
- Después de cada implementación, detenerse y esperar `CONTINUAR`.
- Antes de implementar, describir brevemente el cambio.
- Después de implementar, reportar los archivos modificados.
- Proporcionar comandos exactos para la prueba manual y explicar el resultado esperado.
- Ejecutar los tests relevantes.
- No realizar refactors no relacionados.

## Architecture

- Usar AI Town como engine base y preservar su arquitectura salvo necesidad demostrable.
- No reescribir componentes existentes innecesariamente.
- Mantener determinísticas las reglas del juego.
- Impedir que el LLM modifique directamente el game state. Puede producir intención o narración, pero el engine debe validar toda acción.
- Mantener el proyecto completamente operable en LAN, sin dependencias cloud obligatorias.
- Usar LM Studio como proveedor local de inferencia.
- Tratar la PC como pantalla pública y los celulares como controles y pantallas privadas.
- No implementar reconocimiento de voz. La conversación entre jugadores sucede físicamente en la mesa.
- Diseñar inicialmente en español todo contenido nuevo visible.

## Validation

Después de cada tarea:

1. Ejecutar el test mínimo relevante.
2. Ejecutar lint cuando corresponda.
3. Ejecutar build cuando corresponda.
4. Reportar errores preexistentes por separado de los errores introducidos.
5. No corregir problemas no relacionados sin autorización.
