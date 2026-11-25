import type { GalleryItem, Localized } from '../../domain/booking';
import type { BusinessUnit } from '../../domain/units';
import { galleryItems } from '../../mocks/bookings';

/** The service every screen of this flow shows: Detailing at Black Six Doral. */
export const serviceUnit: BusinessUnit = 'detailing';
export const serviceCenterId = 'c-doral';

/** Aggregate rating of the center. `distribution[0]` is the share of 5-star reviews, in %. */
export const serviceRating = { value: 4.9, count: 365, distribution: [78, 16, 4, 1, 1] };

export interface ServicePhoto extends Pick<GalleryItem, 'id' | 'unit' | 'caption' | 'ratio'> {}

const extra = (n: number, es: string, en: string, ratio: ServicePhoto['ratio']): ServicePhoto => ({ id: `gal-x${n}`, unit: 'detailing', caption: { es, en }, ratio });

/** 16 photos of the center: the 6 of the shared gallery mock plus 10 more of Detailing work. */
export const servicePhotos: ServicePhoto[] = [
  ...galleryItems,
  extra(1, 'Sedán negro antes y después del pulido', 'Black sedan before and after polish', '4:3'),
  extra(2, 'Descontaminación con arcilla en el capó', 'Clay-bar decontamination on the hood', '1:1'),
  extra(3, 'Limpieza de tapicería en un SUV', 'Upholstery cleaning on an SUV', '3:4'),
  extra(4, 'Bahía de detailing con luz controlada', 'Detailing bay with controlled light', '4:3'),
  extra(5, 'Brillo de llantas y rines', 'Tire and wheel shine', '1:1'),
  extra(6, 'Limpieza de motor del paquete Premium', 'Premium package engine bay cleaning', '4:5'),
  extra(7, 'Sellador aplicado en una pickup', 'Sealant applied on a pickup truck', '4:3'),
  extra(8, 'Interior de cuero hidratado', 'Conditioned leather interior', '3:4'),
  extra(9, 'Revisión de calidad al entregar', 'Quality check at handover', '1:1'),
  extra(10, 'Coupé azul con recubrimiento cerámico', 'Blue coupe with ceramic coating', '4:3'),
];

/** Photos shown in the hero strip; the last one carries the "+N" chip. */
export const stripCount = 6;

export const reviewMeta: Record<string, { verified: boolean; photos: number }> = {
  'rev-1': { verified: true, photos: 2 },
  'rev-2': { verified: true, photos: 0 },
  'rev-3': { verified: true, photos: 0 },
  'rev-4': { verified: true, photos: 1 },
  'rev-5': { verified: false, photos: 0 },
  'rev-6': { verified: true, photos: 0 },
};

/** Reviews dated on or after this day count as "Recientes". */
export const recentSince = '2026-11-11';

export interface DemoVideo {
  id: string;
  title: Localized;
  seconds: number;
}

export const demoVideos: DemoVideo[] = [
  { id: 'v-premium', title: { es: 'Paquete Premium paso a paso', en: 'Premium package step by step' }, seconds: 135 },
  { id: 'v-correction', title: { es: 'Corrección de pintura en 60 segundos', en: 'Paint correction in 60 seconds' }, seconds: 65 },
  { id: 'v-bay', title: { es: 'Recorrido por la bahía de Doral', en: 'Tour of the Doral bay' }, seconds: 48 },
  { id: 'v-interior', title: { es: 'Antes y después: interior', en: 'Before and after: interior' }, seconds: 92 },
];

export const formatClock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
