import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { BusinessUnit } from '../domain/units';
import { HomePage } from './Home';
import { UnitPage } from './UnitPage';

/** One bundle for the whole site: each HTML page names itself with `data-page` on #root. */
const root = document.getElementById('root')!;
const page = root.dataset.page ?? 'home';
const unitPages: BusinessUnit[] = ['detailing', 'towing', 'personal-washing'];

createRoot(root).render(<StrictMode>{unitPages.includes(page as BusinessUnit) ? <UnitPage unit={page as BusinessUnit} /> : <HomePage />}</StrictMode>);
