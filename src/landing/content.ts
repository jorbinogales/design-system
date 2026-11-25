import type { Localized } from '../domain/booking';
import type { BusinessUnit } from '../domain/units';

/**
 * Copy for each unit landing. Facts come from the 24 Nov meeting (Copart/IAA, NC yards, seasonality,
 * at-home service); anything still to confirm with Black Seat is marked as sample in the footer.
 */
export interface UnitContent {
  promise: Localized;
  facts: { label: Localized; value: Localized }[];
  steps: { title: Localized; body: Localized }[];
  faqs: { q: Localized; a: Localized }[];
  bookLabel: Localized;
}

const L = (es: string, en: string): Localized => ({ es, en });

export const unitContent: Record<BusinessUnit, UnitContent> = {
  detailing: {
    promise: L('Tu auto, como el primer día.', 'Your car, like day one.'),
    facts: [
      { label: L('Dónde', 'Where'), value: L('Nuestra bahía en Charlotte', 'Our Charlotte bay') },
      { label: L('Duración', 'Duration'), value: L('De 2 h 30 a 8 h', '2.5 to 8 hours') },
      { label: L('Entrega', 'Handover'), value: L('Fotos del antes y el después', 'Before and after photos') },
    ],
    steps: [
      { title: L('Elige', 'Pick'), body: L('Esencial, Premium o Cerámico, según lo que necesite tu auto.', 'Essential, Premium or Ceramic, depending on what your car needs.') },
      { title: L('Agenda', 'Schedule'), body: L('Escoge el día y la hora libre y trae tu auto a la bahía.', 'Choose an open day and time and bring your car to the bay.') },
      { title: L('Trabajamos', 'We work'), body: L('Productos profesionales y una revisión de calidad al final.', 'Professional products and a quality check at the end.') },
      { title: L('Recoge', 'Pick up'), body: L('Te avisamos cuando está listo, con fotos del resultado.', 'We let you know when it is ready, with photos of the result.') },
    ],
    faqs: [
      { q: L('¿Tengo que llevar el auto?', 'Do I need to bring the car?'), a: L('Sí. Detailing se hace en nuestra bahía de Charlotte, con luz controlada y todo el equipo.', 'Yes. Detailing is done at our Charlotte bay, with controlled light and the full setup.') },
      { q: L('¿Qué no incluye?', "What's not included?"), a: L('Reparación de golpes o rayones profundos, y autos con moho severo, que se cotizan aparte.', 'Dent or deep scratch repair, and cars with severe mold, which are quoted separately.') },
      { q: L('¿Puedo cambiar la cita?', 'Can I change my appointment?'), a: L('Sí, sin costo hasta 24 horas antes. Los miembros VIP, hasta 2 horas antes.', 'Yes, for free up to 24 hours before. VIP members, up to 2 hours before.') },
    ],
    bookLabel: L('Reservar Detailing', 'Book Detailing'),
  },
  towing: {
    promise: L('De la subasta a tu puerta.', 'From the auction to your door.'),
    facts: [
      { label: L('Subastas', 'Auctions'), value: L('Copart e IAA', 'Copart and IAA') },
      { label: L('Entrega', 'Delivery'), value: L('NC, SC y Virginia', 'NC, SC and Virginia') },
      { label: L('Lo que necesitas', 'What you need'), value: L('Lote y código de recogida', 'Lot and pickup code') },
    ],
    steps: [
      { title: L('Subasta', 'Auction'), body: L('Elige Copart o IAA y el patio donde está tu vehículo.', 'Pick Copart or IAA and the yard where your vehicle is.') },
      { title: L('Datos', 'Details'), body: L('Escribe el número de lote y el código de recogida. Conservamos los ceros.', 'Enter the lot number and pickup code. We keep the leading zeros.') },
      { title: L('Fecha', 'Date'), body: L('Escoge el día de recogida y la dirección de entrega.', 'Choose the pickup day and the delivery address.') },
      { title: L('Entrega', 'Delivery'), body: L('Te enviamos fotos al cargarlo y te avisamos al llegar.', 'We send photos when it is loaded and let you know on arrival.') },
    ],
    faqs: [
      { q: L('¿Qué datos necesitan?', 'What details do you need?'), a: L('La subasta, el patio, el número de lote y el código de recogida que te dio la subasta.', 'The auction, the yard, the lot number and the pickup code the auction gave you.') },
      { q: L('¿Incluye los cargos de la subasta?', 'Are auction fees included?'), a: L('No. El pago de la subasta y los cargos de almacenamiento del patio corren por tu cuenta.', 'No. The auction payment and yard storage fees are on you.') },
      { q: L('¿Llevan fuera de Carolina del Norte?', 'Do you deliver outside North Carolina?'), a: L('Sí, con el traslado de larga distancia: Carolina del Sur y Virginia. Los peajes fuera de NC se cotizan.', 'Yes, with long-distance transport: South Carolina and Virginia. Tolls outside NC are quoted.') },
    ],
    bookLabel: L('Pedir recogida', 'Request pickup'),
  },
  'personal-washing': {
    promise: L('Tu casa, limpia por fuera.', 'Your home, clean outside.'),
    facts: [
      { label: L('Dónde', 'Where'), value: L('En tu casa', 'At your home') },
      { label: L('Equipo', 'Equipment'), value: L('Agua, equipo y químicos nuestros', 'Our own water, gear and chemicals') },
      { label: L('Temporada alta', 'Peak season'), value: L('Marzo y abril', 'March and April') },
    ],
    steps: [
      { title: L('Elige', 'Pick'), body: L('Botes de basura, entrada y aceras, o alfombras.', 'Trash bins, driveway and sidewalks, or carpets.') },
      { title: L('Agenda', 'Schedule'), body: L('Escoge el día y la hora, y la dirección de tu casa.', 'Choose the day, the time and your home address.') },
      { title: L('Llegamos', 'We arrive'), body: L('Con agua, equipo y productos propios. No necesitas nada.', 'With our own water, equipment and products. You need nothing.') },
      { title: L('Listo', 'Done'), body: L('Pagas en la app o al terminar.', 'Pay in the app or when we finish.') },
    ],
    faqs: [
      { q: L('¿Qué limpian?', 'What do you clean?'), a: L('Botes de basura, entradas, aceras y escalones de concreto, y alfombras dentro de la casa.', 'Trash bins, driveways, sidewalks and concrete steps, and carpets inside the home.') },
      { q: L('¿Limpian casas por dentro?', 'Do you clean houses inside?'), a: L('Todavía no. Es un servicio que viene más adelante.', 'Not yet. It is a service coming later.') },
      { q: L('¿Cuándo conviene reservar?', 'When should I book?'), a: L('Con anticipación en marzo y abril, cuando sube la demanda de pressure washing.', 'Ahead of time in March and April, when pressure washing demand peaks.') },
    ],
    bookLabel: L('Reservar Personal Washing', 'Book Personal Washing'),
  },
};
