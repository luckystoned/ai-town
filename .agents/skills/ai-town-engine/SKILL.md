---
name: ai-town-engine
description: Preserva la arquitectura interna de AI Town al modificar el engine, sus inputs, el loop de simulación, pathfinding, movimiento o tablas de estado. Usar antes de cualquier cambio en `convex/engine`, `convex/aiTown` o flujos que muten game state.
---

# AI Town Engine

## Flujo de trabajo

1. Inspeccionar la implementación existente antes de modificarla.
2. Leer `ARCHITECTURE.md` cuando el cambio afecte el engine, su estado o el loop de simulación.
3. Identificar qué capa es dueña del estado involucrado.
4. Diseñar la extensión mínima compatible con los patrones existentes.
5. Ejecutar tests relevantes y revisar el diff antes de cerrar la tarea.

## Restricciones

- Respetar el ownership exclusivo del estado del engine.
- Enviar acciones mediante inputs del engine.
- No usar mutations externas para saltear el engine o modificar directamente sus tablas.
- Preservar tick, pathfinding y movimiento salvo necesidad explícita y demostrable.
- Preferir extensiones pequeñas sobre reescrituras.
- Mantener determinísticas las reglas y validaciones mecánicas.
