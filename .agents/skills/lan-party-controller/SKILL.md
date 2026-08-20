---
name: lan-party-controller
description: Guía la arquitectura LAN de una PC host y hasta cuatro celulares, incluyendo join por QR, sesiones locales, reconnect y privacidad. Usar al diseñar red local, controller sessions, rutas móviles o queries públicas y privadas.
---

# LAN Party Controller

## Topología

- Usar una PC host y hasta cuatro celulares en la misma LAN.
- No requerir deployment público, cuentas ni autenticación cloud.
- Mostrar información pública en la PC e información privada en cada celular.
- Generar un QR local para ingresar a la partida.
- No exponer LM Studio directamente a ningún dispositivo.

## Sesiones

- Usar un token de sesión local no predecible.
- Permitir reconnect con el mismo jugador después de refrescar o reabrir el navegador.
- Resolver la identidad en backend a partir del token; no confiar en un `playerId` enviado por el cliente.

## Privacidad

- Proteger alineaciones, objetivos, información privada y decisiones no reveladas.
- No incluir secretos en queries públicas.
- Nunca enviar datos privados del jugador A al jugador B.
- Agregar tests de no filtración cuando se implemente cualquier superficie privada.
