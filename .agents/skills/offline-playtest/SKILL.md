---
name: offline-playtest
description: Define el playtest periódico que demuestra que La República Imposible funciona localmente sin Internet. Usar al preparar o ejecutar validaciones de frontend, Convex self-hosted, LM Studio, LAN, celulares y reconnect.
---

# Offline Playtest

## Preparación

1. Descargar previamente dependencias, imágenes de contenedores y modelos.
2. Iniciar Convex self-hosted, frontend y LM Studio.
3. Confirmar que el modelo de chat y el modelo de embeddings estén cargados.
4. Desconectar Internet sin apagar el router ni la LAN local.

## Comprobación eventual

1. Abrir el frontend público en la PC.
2. Conectar hasta cuatro celulares por LAN.
3. Ingresar, refrescar un celular y comprobar reconnect.
4. Completar una interacción con un NPC.
5. Generar y recuperar un recuerdo mediante embeddings.
6. Confirmar que frontend, Convex self-hosted y LM Studio siguen operativos.
7. Revisar logs y tráfico para detectar cualquier dependencia runtime de cloud.

## Criterio

- Considerar exitosa la prueba solamente si todas las funciones validadas operan sin Internet y ningún dispositivo necesita acceder a un servicio cloud.
- Mantener este skill como instruction-only hasta que se autorice crear scripts.
