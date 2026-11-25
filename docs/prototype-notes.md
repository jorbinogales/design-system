# Prototipo MVP Black Seat — brief y referencias

PRD: [ChatPRD · Black Seat — PRD del MVP](https://app.chatprd.ai/chat/3af4a79e-393c-4de5-9a6b-1a013c6f5030?doc=5b3d2e5e-5ac7-4b6f-ae1a-ec390a79b7e6)
Fuente: reunión con Elio y Jesús (Granola, 24 nov 2026). Entrega: preview antes del lunes 30 nov.

## Brief de una página

| | |
|---|---|
| Qué | Prototipo navegable de baja fidelidad con datos de ejemplo, construido con los componentes reales del design system. |
| Para quién | Cliente estadounidense en Carolina del Norte (móvil) y el equipo de Black Seat, Elio y Jesús (escritorio). |
| Acción principal | Cliente: reservar un servicio sin escribir por WhatsApp. Operador: ver y asignar los trabajos de hoy. |
| Adjetivos | Preciso · confiable · rápido. |
| Alcance | Inicio con 3 unidades + VIP · portal de unidad (paquetes, horario, quién atiende) · fecha y hora · dirección o recogida en subasta · pago y resumen · confirmación · mis reservas · VIP · operador: Hoy + asignación + detalle. |
| Fuera | GPS en vivo, updates por hora, App Store, chat. |
| Mercado | Charlotte y Raleigh, NC. USD. ES por defecto, EN completo. Claro/oscuro/sistema. |
| Dirección de arte | Ya cerrada en `DESIGN.md` §1 (carbón y blanco, una sola señal naranja #FF5000, Archivo). No se reabre. |
| Estado | Pendiente de visto bueno del usuario. |

Diferencia con los mocks del DS: en la reunión, Personal Washing es **pressure washing, botes de basura y alfombras** (no lavado de autos a domicilio). El prototipo usa esa definición y Carolina del Norte.

## Referencias Mobbin (método: estimado, desde capturas)

### Inicio del cliente
- [Urban Company](https://mobbin.com/screens/cc99064d-d8ab-40f7-a377-7bd721256f49?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — tarjetas fotográficas a ancho completo con un solo CTA por servicio. **Adoptado:** 3 unidades apiladas a ancho completo, no carrusel; son solo 3 y cada una es una puerta.
- [Angi](https://mobbin.com/screens/b2b7bce6-aaf1-4b0a-85fa-48e79f488f49?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — precio "from $160" sobre la foto. **Adoptado:** precio "desde" visible en cada unidad.
- [Careem](https://mobbin.com/screens/ff4258d2-8b0e-430c-9bf7-c7b011542b24?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — cuadrícula de muchas categorías. **Descartado:** Black Seat tiene 3 unidades; una cuadrícula las diluye.

### Portal de unidad y paquetes
- [Klook](https://mobbin.com/screens/e2fcac0f-b85d-435e-b260-cbb25200ffef?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — paquetes como tarjetas con radio, borde de selección y barra inferior con total + Continuar. **Adoptado** (PackageCard + BottomActionBar).
- [Careem Packers](https://mobbin.com/screens/cae14f06-3e8a-4d23-8dc9-989f0f24d5cd?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — barra de progreso fina "Next step". **Adoptado:** paso actual + siguiente en el encabezado del flujo.
- [State Farm](https://mobbin.com/screens/6a5bbd97-9160-4994-8988-704bd5be2d6a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — "qué cubre y qué no" en checklist. **Adoptado** para Towing (incluye / no incluye).
- [Lugg](https://mobbin.com/screens/d1709554-cee2-4137-869e-eb5a471d43f3?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — tipos de servicio de transporte en lista con precio base. Referencia secundaria.

### Fecha y hora
- [Careem Salon](https://mobbin.com/screens/a030486a-580e-4b86-b331-2b7cdddf94c8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — tira de días + horas en píldoras + aviso de cancelación + total fijo abajo. **Adoptado** completo (AppointmentPicker + Banner + BottomActionBar).
- [Angi](https://mobbin.com/screens/ce81e62f-b49e-45a1-a528-3d9e0d057de1?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — "reprogramación gratis hasta 24 h". **Adoptado** como aviso bajo las horas.
- [Fresha](https://mobbin.com/screens/d411fbb9-4912-4e43-8bc4-b5dd4422f6a8?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — días en tarjetas con día deshabilitado visible. Coincide con DayStrip del DS.

### Recogida en subasta (Towing)
- [Wanderlog](https://mobbin.com/screens/021f0c01-482a-4f06-b235-b7f265a063de?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — campos rellenos con etiqueta arriba y calendario debajo. **Adoptado** (AuctionPickupForm ya sigue este patrón).
- [Navan](https://mobbin.com/screens/4aae6ec7-7264-4f8b-8660-e1f044098c2d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — recogida y entrega en una sola tarjeta. **Adoptado:** resumen recogida → entrega.

### Resumen y pago
- [Airbnb](https://mobbin.com/screens/a28898c6-3abf-48d9-8d2d-7cdd41662620?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — secciones con fila de método de pago, desglose y línea legal sobre el CTA. **Adoptado.**
- [Tripadvisor](https://mobbin.com/screens/01f75ddf-59bb-40e1-9d3b-f274acb84078?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — "Total" y "Due today" separados. **Adoptado:** con Zelle/efectivo, "Pagas hoy: $0".
- [IHG](https://mobbin.com/screens/866599fb-bea7-42cc-ac9e-22d4a59d484e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — "Editar" por sección. Coincide con BookingSummary `onEdit`.

### Confirmación
- [Angi](https://mobbin.com/screens/5109cc03-d63b-4c01-9f16-93d6d339e2d2?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — check, título, tarjeta con dirección/fecha/duración y "Añadir al calendario". **Adoptado.**
- [Peerspace](https://mobbin.com/screens/1eff368a-bd8e-4ef8-9eef-8a1390c6b2dc?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — acciones posteriores (cancelar, recibo) como filas. **Adoptado** como lista bajo la tarjeta.
- [Zocdoc](https://mobbin.com/screens/163db635-5f53-47b0-aa35-def409b9ee40?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — sugerir otro servicio tras confirmar. **Adoptado** de forma ligera (venta cruzada a VIP).

### VIP
- [Superpower](https://mobbin.com/screens/4b39d6f4-1f18-4f41-a682-feb104cbe088?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — precio protagonista + lista de beneficios con icono + CTA negro. **Adoptado** (en Black Seat el CTA es naranja: es la única acción).
- [Citi Bike](https://mobbin.com/screens/85aa776b-4962-4c26-935f-8ba19b80d59b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — beneficio con título + una línea de detalle. **Adoptado.**
- [Panera](https://mobbin.com/screens/09814cd7-8e39-4740-9574-ff733def15f0?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — mensual vs anual lado a lado. **Adoptado** con SegmentedControl.

### Operador (escritorio)
- [Jobber](https://mobbin.com/screens/882db7c6-4012-4459-ba02-1e93355fa689?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — saludo + fecha, tarjetas de flujo con conteos y "citas de hoy". **Adoptado:** 4 contadores sobre la bandeja.
- [7shifts](https://mobbin.com/screens/0ecb4e52-3ceb-4907-9c34-9244d758ac66?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — panel lateral derecho sobre la agenda. **Adoptado:** detalle de orden en panel lateral.
- [GoDaddy](https://mobbin.com/screens/53a40bc5-e278-4d2c-a9b0-64164515158d?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — tabla del día con hora, servicio, cliente, responsable. Coincide con DailyJobsTray.
- [Deputy](https://mobbin.com/screens/a0e97f81-c13c-4ca3-ba74-1e00efd1ad19?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) — vista semanal por persona. **Descartado** para el MVP: el negocio pidió "lo de hoy".

## Datos de Carolina del Norte

Patios reales de subasta (direcciones públicas): IAA Charlotte (1710 Starita Rd, Charlotte 28206), Copart China Grove (1081 Recovery Rd, 28023), Copart Raleigh North (1900 Old Crews Rd, Knightdale 27545), IAA Raleigh (60 Sadisco Rd, Clayton 27520). Clientes, direcciones de clientes y teléfonos (555-01xx) son inventados.

---

# Revisión completa de la reunión (transcripción, 24 nov 2026)

Lo que pide el negocio y todavía no está en el prototipo ni en el PRD:

| # | Hallazgo en la transcripción | Estado | Acción |
|---|---|---|---|
| 1 | Leandro ofreció una app para **gestionar clientes, vendedores y las comisiones a repartir**. | Falta | Módulo de vendedores y comisiones (fase 2). Confirmar con Elio quiénes son los vendedores y cómo se calcula la comisión. |
| 2 | Ya tenían una web: **se venció el hosting y el dominio**. | Falta | Recuperar o comprar dominio y hosting para la nueva web. |
| 3 | Towing: el cliente "se prepara para el pago **o da una inicial antes de buscar el auto**". | Falta | Depósito/anticipo en Towing antes de la recogida. |
| 4 | Towing: mostrar **con qué subastas trabajan, horario, días y si hacen domicilio**. | Parcial | Portal de Towing ya muestra horario y Copart/IAA; falta "días de trabajo" y entrega a domicilio explícita. |
| 5 | **"Todo el mundo usa iPhone"**. | Riesgo | Probar la PWA en Safari iOS e incluir guía "Agregar a pantalla de inicio". App Store después (~$200). |
| 6 | Colores: **"mayormente blanco y negro; naranja poco"**. Leandro recomendó una versión del logo con color. | Ajustar | La web y la app reducen el naranja a la acción principal. Proponer versión del logo con acento naranja. |
| 7 | **Updates cada hora** del avance (referencia Albi) — "eso le gusta mucho al gringo". | Futuro | Subir prioridad: es el diferencial frente a competencia. |
| 8 | **GPS/tracking** opcional ("lo activa el que quiera"), cuando haya empleados. | Futuro | Sin cambios. |
| 9 | Jesús debe hacer **estudio de precios** de pressure cleaning; incluye alfombras; químicos y equipo pendientes. | Bloqueante de precios | Precios de Personal Washing son de ejemplo. |
| 10 | Elio ofreció un **boceto en papel** de cómo imagina la app. | Pendiente | Pedirlo por el grupo. |
| 11 | Quieren **"agarrar ranking"** y crecer contratando 2–3 personas. | Falta | Reseñas de clientes + perfil en Google; gestión de personal en el panel. |
| 12 | Mercado: NC (Charlotte; mencionan Richmond y Greenport), luego SC, Virginia, Nashville, Atlanta. | OK | Zona de servicio en la web. |
| 13 | Grupo de WhatsApp: **Alejandro, Jordi, Elio y Leandro** (el resumen de Granola puso a Jesús en lugar de Leandro). | Corrección | — |
| 14 | El proyecto sirve como **portafolio para clientes americanos**; posible LLC con Elio como representante. | Comercial | Fuera del producto. |

# Landing pública (web del proyecto)

**Brief.** Web de una página, bilingüe, que presente Black Seat como una marca con tres unidades y lleve a reservar en la app. Público: cliente americano en Carolina del Norte. Acción principal: Reservar. Tono del flyer: póster en blanco y negro, titulares condensados en mayúsculas, naranja solo en la acción.

**Secciones:** cabecera · hero · índice de unidades · Detailing · Towing · Personal Washing · cómo funciona · VIP · zona de servicio · preguntas frecuentes · cierre y footer.

| Sección | Referencias Mobbin | Decisión |
|---|---|---|
| Hero | [Freshman](https://mobbin.com/sites/sections/efd2c199-fe77-4b3a-971a-0ec6bdeb686b?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Webflow/Shift](https://mobbin.com/sites/sections/f031eb65-6ef5-49bc-9e49-b6f591d58125?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) | Titular gigante en mayúsculas sobre negro, como Freshman y el flyer; un solo CTA naranja. |
| Índice de unidades | [metic. lista](https://mobbin.com/sites/sections/257ac093-d995-4565-8574-f0b9ff580b04?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [YLLW](https://mobbin.com/sites/sections/4992ac8d-926b-404b-8042-8f1ff17fd7a4?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Fiasco](https://mobbin.com/sites/sections/814e0a13-81d8-4d89-95f1-33b72ef0d9d3?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) | Filas tipo metic: nombre grande, una línea, "desde", flecha. Titulares condensados como YLLW. |
| Cómo funciona | [Escape Cafe](https://mobbin.com/sites/sections/68d54554-65f5-4fd2-a974-c30e7c9eaffc?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Titan](https://mobbin.com/sites/sections/0d103afa-c85e-4568-a98a-0a1e7cbd5e8f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) | Tres columnas con título condensado y regla superior (Escape Cafe). |
| VIP | [MasterClass](https://mobbin.com/sites/sections/34f6ea6b-ceac-49d3-98c7-2d0cd7574a00?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Superpower](https://mobbin.com/sites/sections/6116ce47-e74a-4afc-a67f-fa7496e8579f?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) | Banda negra: título + CTA a la izquierda, beneficios con icono a la derecha (MasterClass); precio protagonista (Superpower). |
| FAQ | [DICE](https://mobbin.com/sites/sections/39efc6da-f1f5-4a4f-abd1-8f1009712c2e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Mixpanel](https://mobbin.com/sites/sections/67d59fad-c6e5-43b0-814b-469bcf735e79?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) | Acordeón sobrio de una columna. |
| Footer | [Cosmos](https://mobbin.com/sites/sections/277145c1-b152-4185-ba3a-5568988cc33a?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Chronicle](https://mobbin.com/sites/sections/62013f0b-73f1-4c27-83fc-c8bf21aa687c?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp), [Luma](https://mobbin.com/sites/sections/5b439406-fe96-4064-8312-5a744023659e?utm_source=claude&utm_medium=ai-assistant&utm_source_platform=mcp) | Logotipo BLACKSEAT gigante de borde a borde (Cosmos), columnas de enlaces (Chronicle). |
