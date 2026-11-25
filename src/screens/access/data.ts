import type { AddressSuggestion } from '../../components/address/AddressSearch/AddressSearch';

/** Miami-area addresses for the location search. */
export const addressDirectory: AddressSuggestion[] = [
  { id: 'a1', primary: '8502 NW 36th St', secondary: 'Doral, FL 33166' },
  { id: 'a2', primary: '8500 NW 25th St', secondary: 'Doral, FL 33122' },
  { id: 'a3', primary: '1450 Brickell Ave', secondary: 'Miami, FL 33131' },
  { id: 'a4', primary: '1111 Lincoln Rd', secondary: 'Miami Beach, FL 33139' },
  { id: 'a5', primary: '3250 NE 1st Ave', secondary: 'Miami, FL 33137' },
  { id: 'a6', primary: '2200 NW 7th St', secondary: 'Miami, FL 33125' },
  { id: 'a7', primary: '7900 W Flagler St', secondary: 'Miami, FL 33144' },
  { id: 'a8', primary: '2850 SW 8th St', secondary: 'Miami, FL 33135' },
];

export function searchAddresses(query: string): AddressSuggestion[] {
  const q = query.trim().toLocaleLowerCase();
  if (q.length < 3) return [];
  return addressDirectory.filter((a) => `${a.primary} ${a.secondary}`.toLocaleLowerCase().includes(q));
}

/** Demo customer used across the access flow. */
export const demoUser = { name: 'Andrea Salcedo', email: 'andrea.salcedo@example.com', phone: '3055550188' };

/** Service centers drawn on the onboarding map (percent coordinates). */
export const centerPins = [
  { id: 'doral', kind: 'service' as const, x: 30, y: 28, label: 'Black Six Doral' },
  { id: 'brickell', kind: 'service' as const, x: 66, y: 40, label: 'Black Six Brickell' },
  { id: 'hialeah', kind: 'service' as const, x: 22, y: 58, label: 'Black Six Hialeah' },
  { id: 'beach', kind: 'service' as const, x: 74, y: 22, label: 'Black Six Miami Beach' },
];
