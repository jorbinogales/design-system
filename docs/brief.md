# Brief del usuario (texto original)

Fuente de verdad del encargo. Las referencias visuales están en `ref/` (ver `ref/README.md`).

## Encargo

Crear un design system para Black Seat (unidades: Detailing, Towing y Personal Washing) con
modo claro (fondo blanco) y modo oscuro (fondo negro). El naranja provisional #FF681D se
reemplaza por #FF5000. La previsualización se hace en Storybook: componentes, colores y
pantallas. Las pantallas toman como referencia el kit de `ref/`.

## Pantallas

- Splash Screen
- Welcome Screen
- Onboarding Screens
- Sign In, Create an Account, Verify the Code and new Password, Create Your Profile Screens
- Your Location, Enter Your Location, Notification Access Screens
- Home Screen
- Explore Screen
- Service Details (About, Services, Gallery, Review), Washing Center Location, Get Direction, You have Arrived Screens
- Demo Video, Gallery Screens
- Write Review Screen
- Select Vehicle, Add Vehicle, Book Service, Pick up & Delivery Address, Payment Methods, Add Card, Review Summary, Congratulation, E-Receipt Screens
- Bookmark, Remove from Bookmark Screens
- Filter, Search Screens
- Notification Screen
- Chat, Chat Details, Video Call, Voice Call Screens
- Category from Home See All, Exterior Cleaning from Category Screens
- Specialforyou from (Home See All), 40% off from Specialforyou, Popular Service Provider from Home See All Screens
- My Bookings (Active, Completed, Cancelled) Screens
- Track Order, Track Live Location Screens
- Cancel Booking Screen
- Profile, Your Profile, Payment Methods, Manage Address, Add Address, Wallet, Add Money, Top Up E-Wallet, Top Up Success, Password Manager, Help Center, Privacy Policy, Invite Friends, Logout Screens

## 4. Inventario de componentes

| Familia | Componentes que necesitas | Variantes o decisiones que conviene documentar |
|---|---|---|
| Acciones | Botón, botón de icono, enlace, grupo de acciones, barra de acción inferior | Primario, secundario, discreto y destructivo. Con icono, ancho completo, cargando y deshabilitado. |
| Navegación móvil | Barra superior, botón volver, navegación inferior, pestañas, selector segmentado | Cliente y operador tienen destinos distintos. La barra inferior debe contemplar el área segura del dispositivo. |
| Navegación de escritorio | Barra lateral, encabezado de página, migas de pan, menú de usuario | Barra expandida o compacta, destino activo y acceso condicionado por rol. |
| Estructura | Contenedor, sección, encabezado de sección, divisor, tarjeta base, fila de lista, par etiqueta–valor | Densidad cómoda para el cliente y compacta para escritorio. Una fila puede abrir un detalle o mostrar información estática. |
| Campos | Campo de texto, texto largo, correo, teléfono, búsqueda, contraseña si hay acceso por clave, campo de código | Etiqueta, ayuda, requerido, opcional, error, solo lectura y acción para limpiar. Código y lote deben admitir ceros iniciales. |
| Selección | Checkbox, radio, interruptor, select, combobox con búsqueda, chip de filtro | Selección única o múltiple. El servicio se elige con selección única. Los filtros de la bandeja pueden combinarse. |
| Fecha y hora | Calendario, selector de día, franja horaria, grupo de horarios, selector de rango, navegación entre fechas | Disponible, seleccionado, completo, fuera del horario laboral y sin disponibilidad. |
| Direcciones | Búsqueda de dirección, formulario manual, tarjeta de ubicación y resumen de recogida/destino | Dirección encontrada, sin resultados y edición manual. El personal debe poder leer la dirección completa. |
| Presentación de datos | Avatar con iniciales, insignia de estado, contador, etiqueta, precio, desglose de importes, bloque de identificador con acción copiar | Estado con texto e icono cuando aporte significado. Para códigos, confirmación breve al copiar. |
| Capas y menús | Menú de acciones, desplegable, popover, panel inferior móvil, panel lateral de detalle, diálogo de confirmación | Cierre, retorno del foco y comportamiento al descartar cambios. El mismo detalle puede abrir como página en móvil y panel lateral en escritorio. |
| Feedback | Mensaje de campo, aviso en línea, banner, toast, indicador de carga, skeleton, progreso por pasos | Éxito, advertencia, error e información. Envío en curso, fallo recuperable y confirmación persistente de la reserva. |
| Estados de pantalla | Estado vacío, búsqueda sin resultados, error con reintento, sin conexión, acceso restringido, confirmación | Distinguir Hoy no tienes trabajos de No pudimos cargar los trabajos. Cada uno requiere una acción diferente. |
| Tablas y bandejas | Tabla, cabecera ordenable, fila, barra de filtros, búsqueda, paginación, menú por fila y detalle | Vista Hoy, filtro por unidad, responsable y estado. En móvil, la fila se transforma en una tarjeta de trabajo. |
| Preferencias | Selector de idioma, selector de apariencia y menú de cuenta | Español / English. Apariencia clara, oscura o del sistema. |

## 5. Componentes propios de Black Seat

Estos componentes son los que le dan identidad al producto y conectan los dos lados del negocio.

| Componente | Qué debe contener |
|---|---|
| Tarjeta de unidad de negocio | Fotografía, nombre y descripción breve. Tres instancias: Detailing, Towing y Personal Washing. Deben distinguirse también por texto. |
| Tarjeta de paquete | Nombre, qué incluye, duración estimada y precio. Acción para elegir ese paquete. |
| Ficha de servicio | Imagen, descripción, alcance, horarios de atención, precio y acción Elegir horario. |
| Selector de cita | Fecha, horas disponibles y selección actual. Si una franja se ocupa antes de confirmar, conserva los datos y permite elegir otra. |
| Tarjeta de profesional | Nombre, iniciales o foto y función. Variante Pendiente de asignación para que el cliente sepa qué esperar. |
| Formulario de recogida en subasta | Subasta, código de recogida, número de lote, fecha y los datos de ubicación que requiera la operación. Cada identificador tiene su propia etiqueta. |
| Resumen de reserva | Unidad, paquete o servicio, fecha, hora, ubicación, responsable si está asignado, precio y método de pago. Permite corregir un dato antes de confirmar. |
| Método de pago y comprobante | Selector de método, resumen del importe, estado del pago y referencia cuando corresponda. Si hay pago en línea, los campos sensibles corresponden al proveedor de pagos. |
| Tarjeta de próxima cita | Servicio, fecha, hora y estado. Acción Ver reserva. La confirmación y el historial reutilizan el mismo identificador. |
| Tarjeta de trabajo del operador | Hora, unidad, cliente, ubicación, estado y próxima acción. En Towing, el número de lote aparece en la tarjeta. |
| Bandeja de pedidos del día | Fecha activa, filtros, tabla o lista, responsable y estado. Para Towing, acceso rápido a subasta, código y lote. |
| Panel de asignación | Trabajo seleccionado, horario, responsable actual, personal disponible, conflictos y confirmación del cambio. |
| Detalle de orden | La misma reserva vista desde operación, con información del servicio, datos de recogida cuando apliquen y acciones permitidas al rol. |
| Historial de estados | Estado, fecha, hora y responsable del cambio. Permite saber cuándo se confirmó, inició, completó o canceló un trabajo. |

### Estados del negocio que conviene separar

Una cita puede estar confirmada, tener un operador pendiente de asignación y un pago pendiente
al mismo tiempo. Para representarlo, usaría tres propiedades independientes.

| Dimensión | Propuesta inicial |
|---|---|
| booking.status | Pendiente de confirmación · Confirmada · En curso · Completada · Cancelada |
| assignment.status | Sin asignar · Asignada |
| payment.status | Pendiente · Pagado · Fallido · Reembolsado, si aplica |

Los estados exactos deben validarse con el negocio. En particular, falta definir si elegir un
método de pago basta para confirmar la cita o si Black Seat cobrará dentro de la PWA. Esa
decisión cambia el flujo y los mensajes que verá el cliente.

## 6. Qué documentar en cada componente

| Campo | Qué especificar |
|---|---|
| Propósito y anatomía | Qué tarea resuelve, qué partes lo componen y cuáles son opcionales. |
| Propiedades | Variante, tamaño, densidad, icono, texto, valor y acciones disponibles. |
| Estados de interacción | Reposo, hover cuando hay puntero, foco visible, presionado, seleccionado, deshabilitado, carga y error, según corresponda. |
| Tokens | Qué tokens controlan fondo, texto, borde, radio, separación, altura y foco. |
| Comportamiento adaptable | Qué cambia entre móvil y escritorio, con texto largo y al abrir el teclado. |
| Accesibilidad | Nombre accesible, orden de foco, interacción con teclado, anuncio de errores y significado independiente del color. |
| Contenido ES/EN | Etiquetas y mensajes reales en ambos idiomas. Incluir casos largos como Pendiente de asignación y Awaiting assignment. |
| Ejemplo de negocio | Una instancia con datos realistas de Detailing, Towing o Personal Washing. |

## Tokens de color para Black Seat

Naranja #FF5000, con negro #111111 y blanco #FFFFFF como base.

| Token | Modo claro | Modo oscuro | Uso |
|---|---|---|---|
| color.brand.primary | #FF5000 | #FF5000 | Naranja principal de las tres unidades |
| color.action.primary.bg | #FF5000 | #FF5000 | Botones Reservar, Confirmar recogida y Asignar |
| color.action.primary.fg | #111111 | #111111 | Texto e icono dentro del botón naranja |
| color.action.primary.hover | #FF6926 | #FF6926 | Botón al pasar el cursor en escritorio |
| color.action.primary.pressed | #E84900 | #E84900 | Botón mientras se pulsa |
| color.surface.canvas | #FFFFFF | #111111 | Fondo general |
| color.surface.subtle | #F4F5F6 | #1C1C1C | Campos, buscador y agrupaciones de contenido |
| color.surface.raised | #FFFFFF | #282828 | Tarjetas, menús y panel de detalle |
| color.text.primary | #111111 | #FFFFFF | Títulos, precios, horarios y números de lote |
| color.text.secondary | #57595D | #B8BABD | Descripciones, fechas y etiquetas auxiliares |
| color.text.link | #B33700 | #FF8A55 | Enlaces como Ver detalle o Cambiar horario |
| color.selection.bg | #FFF0E8 | #381D12 | Fondo de un paquete o una hora seleccionada |
| color.selection.border | #FF5000 | #FF6926 | Contorno de la opción seleccionada |
| color.border.subtle | #DFE1E3 | #383838 | Separadores de tarjetas, listas y tablas |

El detalle que más cambia la apariencia es el texto del botón. Sobre #FF5000, el carbón
#111111 tiene un contraste de 5,75:1 y el blanco de 3,28:1. Usaría texto carbón en todos los
botones naranjas. Para un enlace pequeño sobre fondo blanco, #B33700 alcanza 6,06:1.

Así lo aplicaría a tus pantallas:

- Inicio del cliente: fondo blanco, encabezado negro y tres tarjetas fotográficas para
  Detailing, Towing y Personal Washing. Las tres comparten paleta. La fotografía y el nombre
  permiten reconocer cada servicio.
- Reserva: el precio y la hora van en negro. La franja elegida lleva fondo naranja suave,
  borde naranja y una marca de selección. El botón Confirmar reserva concentra el naranja
  sólido.
- Operación: la agenda de Hoy usa superficies neutras para que destaquen hora, responsable y
  lote. El naranja identifica la acción disponible, como Asignar operador. Los estados
  Completada, Pendiente y Cancelada conservan sus propios colores y etiquetas.
