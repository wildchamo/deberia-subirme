# ¿Debería Subirme?
*Una app para verificar placas de vehículos por WhatsApp*

**Author(s):** Jose Luis Bedoya (wildchamo)  
**Status:** Draft  
**Última actualización:** 20-abr-2025

---

## 🔗 Links
- [Citizen](https://citizen.com/)

---

## 🎯 Objetivo

Permitir que personas consulten y dejen reseñas sobre placas de vehículos a través de WhatsApp, con el fin de mejorar la seguridad al abordar transporte. La app buscará brindar una fuente colaborativa de confianza, especialmente útil para mujeres y personas en situaciones vulnerables.

---

## 🧠 Background

¿Sabes si el Uber al que te vas a subir es seguro?  
¿Sabías que cualquier persona puede comprar cuentas de Uber para operar?  
Hay numerosos reportes de mujeres siendo violentadas en vehículos que parecían seguros.

Muchas veces, quienes usamos plataformas como Uber o Didi no tenemos forma de saber si un vehículo ha tenido incidentes previos. Este proyecto nace de la necesidad de contar con una herramienta rápida, accesible y colaborativa para verificar placas antes de subirse a un auto.

---

## 💡 Solución

### Frontend

La interfaz será mediante **WhatsApp**, por las siguientes razones:

- Alta accesibilidad y familiaridad del usuario promedio.
- Bajo costo de desarrollo y mantenimiento.
- Menor fricción comparado con una app nativa o app web.
- Se puede expandir con flujo conversacional tipo chatbot.

### Backend

- Usaré **Express** como framework principal, suficiente para un proyecto pequeño, dificilmente tendrá más de 3 acciones de lectura o escritura en la BD.
- Base de datos: **MongoDB**, ideal para estructura documental flexible.
- Arquitectura simple y escalable, con posibilidad de integrar sistemas de autenticación y moderación de contenido en el futuro.

---

## 🚀 Próximos pasos

- [X] Diseñar flujo de conversación en WhatsApp
- [ ] Definir estructura de base de datos documental: reseñas, consultas
- [ ] Configurar webhook con API de WhatsApp Business
- [ ] Implementar sistema básico de reputación por placa
- [ ] Escribir tests y documentación inicial

---

## 📝 Notas adicionales

Este documento es un punto de partida. A medida que se desarrollen pruebas de concepto y feedback de usuarios, se actualizarán tanto las herramientas como los objetivos del proyecto.
