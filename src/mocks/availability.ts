/**
 * Availability mock for the appointment picker. Wednesday 2026-11-25 is "today".
 * Sundays and Thanksgiving (2026-11-26) are closed; 2026-12-02 is fully booked.
 */
import dayjs, { type Dayjs } from 'dayjs';
import type { DayState } from '../components/date-time/Calendar/Calendar';
import type { SlotOption } from '../components/date-time/TimeSlotGroup/TimeSlotGroup';
import type { BusinessUnit } from '../domain/units';

const closedDays = new Set(['2026-11-26']);
const fullDays = new Set(['2026-12-02']);

export function getDayState(day: Dayjs, unit: BusinessUnit = 'detailing'): DayState {
  const iso = day.format('YYYY-MM-DD');
  if (day.day() === 0 || closedDays.has(iso)) return 'closed';
  if (unit === 'towing' && day.day() === 6) return 'available';
  if (fullDays.has(iso)) return 'full';
  return 'available';
}

const hoursByUnit: Record<BusinessUnit, string[]> = {
  detailing: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  towing: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
  'personal-washing': ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
};

/** Slots of a day: a few "full" ones that depend on the date so every day looks different. */
export function getSlots(day: Dayjs, unit: BusinessUnit = 'detailing'): SlotOption[] {
  if (getDayState(day, unit) !== 'available') return [];
  const seed = day.date();
  return hoursByUnit[unit]
    .filter((h) => !(unit === 'towing' && day.day() === 6 && Number(h.slice(0, 2)) >= 12))
    .map((value, i) => ({ value, status: (i * 7 + seed) % 5 === 0 ? ('full' as const) : ('available' as const) }));
}

export const mockSlotDay = dayjs('2026-11-27');
