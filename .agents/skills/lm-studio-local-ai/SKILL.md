---
name: lm-studio-local-ai
description: Guía toda integración de IA local con LM Studio, incluyendo chat, embeddings, modelos OpenAI-compatible, healthchecks, timeouts y fallbacks. Usar al modificar proveedores, configuración o llamadas LLM del proyecto.
---

# LM Studio Local AI

## Principios

- Usar LM Studio como runtime local mediante su API OpenAI-compatible.
- No asumir Ollama ni agregar OpenAI cloud como dependencia runtime.
- Mantener chat y embeddings como responsabilidades separadas.
- Mantener configurables los nombres e identificadores de modelos.
- Detectar los IDs reales disponibles mediante `/v1/models`; no hardcodear nombres descargados.

## Validación

- Comprobar que LM Studio sea accesible desde el backend o la PC host.
- Comprobar que el modelo de chat y el modelo de embeddings estén disponibles.
- Validar explícitamente la dimensión real de cada embedding contra la dimensión configurada.
- Diseñar fallbacks seguros para runtime apagado, modelo ausente y timeout.
- Evitar que una indisponibilidad de IA rompa el juego o la ronda.

## Red

- Mantener LM Studio accesible solamente desde el backend o la PC host.
- No exponer su puerto directamente a celulares ni otros controles.
