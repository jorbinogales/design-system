# Decisiones abiertas

Lo que el design system asume hoy y que el negocio debe confirmar. Cada punto indica dónde vive
la suposición para cambiarla en un solo lugar.

## Negocio y flujo de reserva

| Tema | Suposición actual | Dónde |
|---|---|---|
| ¿Elegir método de pago confirma la cita? ¿Black Seat cobra dentro de la PWA? | Tarjeta y Apple Pay se cobran en línea al confirmar; Zelle y efectivo confirman la cita con el pago pendiente. | `src/mocks/catalog.ts` (`paymentMethods`), `src/blacksix/PaymentPanel`, pantallas `Reserva/07` y `09` |
| Estados exactos de reserva, asignación y pago | Los del brief: 5 de reserva, 2 de asignación, 4 de pago. | `src/domain/status.ts` |
| Política de cancelación y reembolso | Más de 24 h: reembolso completo; menos de 24 h: 20 %; reembolso en 3 a 5 días hábiles. | `src/screens/profile/data.ts` (FAQ), `src/screens/bookings/CancelBookingScreen` |
| Cupón de bienvenida | `BIENVENIDA` aplica un descuento en el resumen. | `src/mocks/bookings.ts`, `Reserva/09` |
| Recompensa por invitar | $10 por amigo. | `src/screens/profile/data.ts` |
| Oferta "40 %" | Oferta local de ejemplo; el mock oficial solo tiene 15 % en Premium. | `src/screens/home/data.ts` (`offer40`) |
| Mercado y moneda | Miami (EE. UU.), USD, formatos es-US / en-US. | `src/i18n/format.ts` |

## Formatos

| Tema | Suposición actual | Dónde |
|---|---|---|
| Código OTP | 4 dígitos. | `CodeField` (`length`), `Acceso/08` |
| Número de lote | 6 a 8 dígitos, conserva ceros iniciales. | `validateAuctionPickup` en `src/blacksix/AuctionPickupForm` |
| Código de recogida | 4 dígitos, conserva ceros iniciales. | `validateAuctionPickup` |
| Acceso con contraseña | Existe (correo + contraseña) además de Apple y Google. | `Acceso/06`, `07`, `09`, `Perfil/10` |

## Recursos que faltan

- **Logotipo oficial.** El wordmark y la marca "6" son provisionales (`src/brand/`).
- **Fotografía real** por unidad, centro y paquete. Hoy todo usa el respaldo diseñado de `Media`;
  las fotos van en `public/` y se pasan por `src` / `photoSrc` (añadir `staticDirs: ['../public']`
  en `.storybook/main.ts` con el primer archivo).
- **Textos legales.** La política de privacidad, las condiciones de cancelación y los datos de
  contacto (`blackseatmiami.com`, teléfonos `555-01xx`) son contenido de ejemplo para revisión legal.
- **Copy de marketing.** Titulares de bienvenida y onboarding son un primer borrador ES/EN.

## Pendientes técnicos menores

- Los campos de fecha (`DateRangePicker`) solo tienen altura de 52 px; si se usan junto a los
  controles compactos de 44 px del escritorio, añadir un tamaño `small` en el tema.
- El mapa (`MapCanvas`) es un dibujo SVG; cambiarlo por un mapa real conservando sus props.
- Las pantallas del operador (bandeja, asignación, detalle) existen como componentes con historias
  de escritorio; no hay pantallas de operador en la lista del brief.
