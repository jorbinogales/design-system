import type { Locale } from '../i18n/locale';

/** Black Seat business units. Names are brand names and stay in English in both locales. */
export const businessUnits = ['detailing', 'towing', 'personal-washing'] as const;
export type BusinessUnit = (typeof businessUnits)[number];

export const unitMeta: Record<BusinessUnit, { name: string; summary: Record<Locale, string> }> = {
  detailing: {
    name: 'Detailing',
    summary: {
      es: 'Limpieza profunda, pulido y protección de pintura e interiores.',
      en: 'Deep cleaning, polishing and protection for paint and interiors.',
    },
  },
  towing: {
    name: 'Towing',
    summary: {
      es: 'Recogemos en la subasta el vehículo que compraste y lo llevamos a tu destino.',
      en: 'We pick up the vehicle you bought at auction and deliver it where you need it.',
    },
  },
  'personal-washing': {
    name: 'Personal Washing',
    summary: {
      es: 'Pressure washing, botes de basura y alfombras en tu casa.',
      en: 'Pressure washing, trash bins and carpets at your home.',
    },
  },
};
