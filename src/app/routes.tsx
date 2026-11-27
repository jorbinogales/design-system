import { routesA } from './routes.a';
import { routesB } from './routes.b';

/**
 * Route name → screen. Bottom-nav tabs use the BottomNav values (home, explore, bookings, chat, profile).
 * Each table receives the route params (`p`) for screens that show a specific unit, booking, conversation…
 */
export const routes = { ...routesA, ...routesB };
