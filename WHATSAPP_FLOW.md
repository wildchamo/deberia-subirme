# Flujos de WhatsApp

Estos son los flujos conversacionales que el usuario tendrá al interactuar con el sistema *¿Debería Subirme?* por WhatsApp. Están pensados para una implementación inicial tipo chatbot.

## Flujo de bienvenida

¡Hola! Bienvenido a ¿Debería Subirme?

¿Qué te gustaría hacer hoy?

1️⃣ Consultar una placa  
2️⃣ Registrar una experiencia  

## Flujo: Consultar una placa

**Paso 1: Usuario elige opción 1**

Por favor, escribe el número de placa en el siguiente formato:
ABC-123

**Paso 2: Usuario envía placa**

*(Sistema consulta base de datos)*

#### Si hay registros

¡Encontramos resultados!

El vehículo con placa ABC-123 tiene:  
 • 3 reportes de tipo 🚨 comportamiento agresivo  
 • 2 reportes de tipo ⚠️ conducción peligrosa  

Gracias por usar ¿Debería Subirme?
¿Hay algo más en lo que pueda ayudarte?

#### Si NO hay registros

El vehículo con placa ABC-123 no cuenta con registros en nuestra plataforma.

¿Hay algo más en lo que pueda ayudarte?

## Flujo: Registrar una experiencia

**Paso 1: Usuario elige opción 2**

Gracias por querer compartir tu experiencia y ayudar a salvar vidas.

Por favor, ingresa la placa del vehículo en el siguiente formato:
ABC-123

**Paso 2: Usuario envía placa**

Ahora, selecciona una categoría para tu experiencia:  
1️⃣ Comportamiento agresivo
2️⃣ Conducción peligrosa  
3️⃣ Comentarios inapropiados  
4️⃣ Intento de acoso  
5️⃣ Otro  

**Paso 3: Usuario elige categoría**

Por último, ¿te gustaría contarnos más sobre lo que ocurrió?
📢 Tu información es completamente anónima.

1️⃣ Sí, quiero compartir más detalles  
2️⃣ No, prefiero dejarlo así  

#### Si elige **1 (Sí, compartir más detalles):**

Escribe tu experiencia aquí. Cuéntanos lo que ocurrió (puedes escribir lo que quieras).

✅ ¡Gracias por compartir! Nos ayudas a salvar vidas 💚

¿Hay algo más en lo que pueda ayudarte?

### 🌱 Flujo extra: Apoyo al proyecto

🚗 Este es un proyecto en desarrollo.
Si quieres apoyar o compartir, visita:
🌐 <https://nomoinforma.lat/>
