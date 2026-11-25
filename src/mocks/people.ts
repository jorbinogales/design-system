/**
 * People mock: customers, their vehicles and addresses, and Black Seat staff.
 * Names and addresses are invented; none is a real person's home address.
 */
import type { Customer, CustomerAddress, Professional, Vehicle } from '../domain/booking';

/** The signed-in customer in cliente-side stories. */
export const currentCustomerId = 'cus-andrea';

export const customers: Customer[] = [
  { id: 'cus-andrea', name: 'Andrea Salcedo', email: 'andrea.salcedo@example.com', phone: '(305) 555-0188' },
  { id: 'cus-valeria', name: 'Valeria Ortiz', email: 'valeria.ortiz@example.com', phone: '(786) 555-0121' },
  { id: 'cus-marcos', name: 'Marcos Peña', email: 'marcos.pena@example.com', phone: '(305) 555-0134' },
  { id: 'cus-camila', name: 'Camila Reyes', email: 'camila.reyes@example.com', phone: '(786) 555-0165' },
  { id: 'cus-carlos', name: 'Carlos Duarte', email: 'carlos.duarte@example.com', phone: '(305) 555-0172' },
  { id: 'cus-sofia', name: 'Sofía Navarro', email: 'sofia.navarro@example.com', phone: '(786) 555-0153' },
  { id: 'cus-diego', name: 'Diego Alarcón', email: 'diego.alarcon@example.com', phone: '(305) 555-0196' },
  { id: 'cus-elena', name: 'Elena Cabrera', email: 'elena.cabrera@example.com', phone: '(954) 555-0147' },
  { id: 'cus-roberto', name: 'Roberto Gil', email: 'roberto.gil@example.com', phone: '(786) 555-0109' },
  { id: 'cus-paola', name: 'Paola Mena', email: 'paola.mena@example.com', phone: '(305) 555-0123' },
  { id: 'cus-javier', name: 'Javier Soto', email: 'javier.soto@example.com', phone: '(954) 555-0161' },
  { id: 'cus-lucia', name: 'Lucía Vargas', email: 'lucia.vargas@example.com', phone: '(786) 555-0175' },
  { id: 'cus-tomas', name: 'Tomás Ibarra', email: 'tomas.ibarra@example.com', phone: '(305) 555-0158' },
  { id: 'cus-hernan', name: 'Hernán Quiroga', email: 'hernan.quiroga@example.com', phone: '(786) 555-0182' },
];

export const getCustomer = (id: string) => customers.find((c) => c.id === id)!;

const v = (id: string, customerId: string, year: number, make: string, model: string, es: string, en: string, plate: string, kind: Vehicle['kind']): Vehicle => ({
  id,
  customerId,
  year,
  make,
  model,
  color: { es, en },
  plate,
  kind,
});

export const vehicles: Vehicle[] = [
  v('veh-andrea-1', 'cus-andrea', 2022, 'Toyota', 'RAV4', 'Gris', 'Gray', 'QLV 4821', 'suv'),
  v('veh-andrea-2', 'cus-andrea', 2019, 'Honda', 'Civic', 'Blanco', 'White', 'MTR 1907', 'sedan'),
  v('veh-valeria', 'cus-valeria', 2021, 'Mazda', 'CX-5', 'Rojo', 'Red', 'KJH 3345', 'suv'),
  v('veh-marcos', 'cus-marcos', 2018, 'Ford', 'F-150', 'Negro', 'Black', 'DPR 6620', 'pickup'),
  v('veh-camila', 'cus-camila', 2023, 'Kia', 'Sportage', 'Azul', 'Blue', 'NBC 9012', 'suv'),
  v('veh-carlos', 'cus-carlos', 2017, 'Chevrolet', 'Silverado', 'Plata', 'Silver', 'FWX 7731', 'pickup'),
  v('veh-sofia', 'cus-sofia', 2020, 'BMW', 'X3', 'Negro', 'Black', 'ZZT 2208', 'suv'),
  v('veh-diego', 'cus-diego', 2022, 'Tesla', 'Model 3', 'Blanco', 'White', 'HGE 5540', 'sedan'),
  v('veh-elena', 'cus-elena', 2016, 'Dodge', 'Challenger', 'Naranja', 'Orange', 'RLK 1183', 'sedan'),
  v('veh-roberto', 'cus-roberto', 2021, 'Audi', 'Q5', 'Gris', 'Gray', 'PXY 8864', 'suv'),
  v('veh-paola', 'cus-paola', 2019, 'Hyundai', 'Elantra', 'Plata', 'Silver', 'CMA 4417', 'sedan'),
  v('veh-javier', 'cus-javier', 2015, 'Toyota', 'Tacoma', 'Blanco', 'White', 'VNB 3306', 'pickup'),
  v('veh-lucia', 'cus-lucia', 2024, 'Mercedes-Benz', 'GLC 300', 'Negro', 'Black', 'TSE 7019', 'suv'),
  v('veh-tomas', 'cus-tomas', 2020, 'Nissan', 'Rogue', 'Gris', 'Gray', 'JUD 2951', 'suv'),
  v('veh-hernan', 'cus-hernan', 2018, 'Honda', 'Odyssey', 'Azul', 'Blue', 'WQA 6684', 'van'),
];

export const getVehicle = (id: string) => vehicles.find((x) => x.id === id)!;
export const vehicleName = (x: Vehicle) => `${x.year} ${x.make} ${x.model}`;

export const customerAddresses: CustomerAddress[] = [
  { id: 'adr-andrea-home', customerId: 'cus-andrea', label: 'home', line1: '7845 NW 36th St', line2: 'Apt 210', city: 'Doral', state: 'FL', zip: '33166', reference: 'Portón negro, junto a la farmacia' },
  { id: 'adr-andrea-office', customerId: 'cus-andrea', label: 'office', line1: '800 Brickell Ave', line2: 'Suite 1500', city: 'Miami', state: 'FL', zip: '33131', reference: 'Estacionamiento P3, espacio 214' },
  { id: 'adr-andrea-other', customerId: 'cus-andrea', label: 'other', customLabel: 'Casa de mamá', line1: '4410 SW 8th St', city: 'Coral Gables', state: 'FL', zip: '33134' },
];

export const getAddress = (id: string) => customerAddresses.find((a) => a.id === id)!;
export const addressesOf = (customerId: string) => customerAddresses.filter((a) => a.customerId === customerId);

export const professionals: Professional[] = [
  { id: 'pro-luis', name: 'Luis Herrera', role: { es: 'Detailer senior', en: 'Senior detailer' }, roleKind: 'detailer', units: ['detailing', 'personal-washing'], centerId: 'c-doral', rating: 4.9 },
  { id: 'pro-daniela', name: 'Daniela Rojas', role: { es: 'Especialista en cerámico', en: 'Ceramic specialist' }, roleKind: 'detailer', units: ['detailing'], centerId: 'c-brickell', rating: 4.8 },
  { id: 'pro-andres', name: 'Andrés Molina', role: { es: 'Lavado a domicilio', en: 'On-site washing' }, roleKind: 'washer', units: ['personal-washing', 'detailing'], centerId: 'c-doral', rating: 4.7 },
  { id: 'pro-mateo', name: 'Mateo Salazar', role: { es: 'Conductor de grúa', en: 'Tow driver' }, roleKind: 'tow-driver', units: ['towing'], centerId: 'c-doral', rating: 4.9 },
  { id: 'pro-ricardo', name: 'Ricardo Paz', role: { es: 'Conductor de grúa', en: 'Tow driver' }, roleKind: 'tow-driver', units: ['towing'], centerId: 'c-lauderdale', rating: 4.6, daysOff: ['2026-11-25'] },
  { id: 'pro-natalia', name: 'Natalia Cruz', role: { es: 'Supervisora de operaciones', en: 'Operations supervisor' }, roleKind: 'supervisor', units: ['detailing', 'towing', 'personal-washing'], centerId: 'c-doral' },
];

export const getProfessional = (id: string) => professionals.find((p) => p.id === id);
export const professionalsForUnit = (unit: Professional['units'][number]) => professionals.filter((p) => p.units.includes(unit) && p.roleKind !== 'supervisor');
