import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import ChatBubbleOutlineRounded from '@mui/icons-material/ChatBubbleOutlineRounded';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import HomeRounded from '@mui/icons-material/HomeRounded';
import NotificationsNoneRounded from '@mui/icons-material/NotificationsNoneRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import TuneRounded from '@mui/icons-material/TuneRounded';
import Box from '@mui/material/Box';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType } from 'react';
import { useT } from '../i18n/locale';
import { DetailingIcon } from '../icons/DetailingIcon';
import { EngineBayIcon } from '../icons/EngineBayIcon';
import { ExteriorWashIcon } from '../icons/ExteriorWashIcon';
import { InteriorIcon } from '../icons/InteriorIcon';
import { PersonalWashingIcon } from '../icons/PersonalWashingIcon';
import { PolishIcon } from '../icons/PolishIcon';
import { TiresIcon } from '../icons/TiresIcon';
import { TowingIcon } from '../icons/TowingIcon';
import { TowTruckIcon } from '../icons/TowTruckIcon';
import { VacuumIcon } from '../icons/VacuumIcon';
import { bs } from '../theme/theme';
import { radius } from '../theme/tokens';
import { FoundationPage, FoundationSection } from './foundationKit';

const m = {
  es: {
    title: 'Iconografía',
    intro: 'Iconos propios de Black Six para unidades y categorías: rejilla de 24 px, trazo de 1,75, extremos y uniones redondeados, siempre en currentColor (src/icons, creados con createStrokeIcon). Para la interfaz genérica, @mui/icons-material: variantes Outlined en reposo y Rounded rellenas para el estado activo. Nunca emojis.',
    units: 'Unidades de negocio',
    categories: 'Categorías de servicio',
    ui: 'Interfaz (MUI)',
    sizes: 'Tamaños',
    names: { DetailingIcon: 'Detailing', TowingIcon: 'Towing', PersonalWashingIcon: 'Personal Washing', ExteriorWashIcon: 'Exterior', InteriorIcon: 'Interior', VacuumIcon: 'Aspirado', EngineBayIcon: 'Motor', PolishIcon: 'Pulido', TiresIcon: 'Llantas', TowTruckIcon: 'Grúa' },
  },
  en: {
    title: 'Iconography',
    intro: 'Black Six icons for units and categories: 24px grid, 1.75 stroke, round caps and joins, always currentColor (src/icons, built with createStrokeIcon). For generic UI, @mui/icons-material: Outlined variants at rest and filled Rounded for the active state. Never emojis.',
    units: 'Business units',
    categories: 'Service categories',
    ui: 'Interface (MUI)',
    sizes: 'Sizes',
    names: { DetailingIcon: 'Detailing', TowingIcon: 'Towing', PersonalWashingIcon: 'Personal Washing', ExteriorWashIcon: 'Exterior', InteriorIcon: 'Interior', VacuumIcon: 'Vacuum', EngineBayIcon: 'Engine bay', PolishIcon: 'Polish', TiresIcon: 'Tires', TowTruckIcon: 'Tow truck' },
  },
};

type Named = [string, ComponentType<SvgIconProps>];

function Grid({ items, names }: { items: Named[]; names: Record<string, string> }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))', gap: 3 }}>
      {items.map(([n, Icon]) => (
        <Box key={n} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 4, borderRadius: `${radius.lg}px`, border: `1px solid ${bs.border.subtle}` }}>
          <Box sx={{ width: 64, height: 64, borderRadius: '50%', display: 'grid', placeItems: 'center', backgroundColor: bs.surface.subtle }}>
            <Icon sx={{ fontSize: 30 }} />
          </Box>
          <Typography variant="label" sx={{ textAlign: 'center' }}>
            {names[n] ?? n}
          </Typography>
          <Typography component="code" variant="caption" sx={{ color: bs.text.secondary }}>
            {n}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function IconPage() {
  const t = useT(m);
  const units: Named[] = [['DetailingIcon', DetailingIcon], ['TowingIcon', TowingIcon], ['PersonalWashingIcon', PersonalWashingIcon]];
  const cats: Named[] = [['ExteriorWashIcon', ExteriorWashIcon], ['InteriorIcon', InteriorIcon], ['VacuumIcon', VacuumIcon], ['EngineBayIcon', EngineBayIcon], ['PolishIcon', PolishIcon], ['TiresIcon', TiresIcon], ['TowTruckIcon', TowTruckIcon]];
  const ui: Named[] = [['ArrowBackRounded', ArrowBackRounded], ['SearchRounded', SearchRounded], ['TuneRounded', TuneRounded], ['NotificationsNoneRounded', NotificationsNoneRounded], ['ContentCopyRounded', ContentCopyRounded], ['HomeOutlined', HomeOutlined], ['HomeRounded', HomeRounded], ['ChatBubbleOutlineRounded', ChatBubbleOutlineRounded]];
  return (
    <FoundationPage title={t.title} intro={t.intro}>
      <FoundationSection title={t.units}>
        <Grid items={units} names={t.names} />
      </FoundationSection>
      <FoundationSection title={t.categories}>
        <Grid items={cats} names={t.names} />
      </FoundationSection>
      <FoundationSection title={t.ui}>
        <Grid items={ui} names={{}} />
      </FoundationSection>
      <FoundationSection title={t.sizes}>
        <Box sx={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
          {[16, 20, 24, 32, 48].map((s) => (
            <Box key={s} sx={{ textAlign: 'center' }}>
              <TowingIcon sx={{ fontSize: s }} />
              <Typography variant="caption" sx={{ display: 'block', color: bs.text.secondary }}>
                {s}px
              </Typography>
            </Box>
          ))}
        </Box>
      </FoundationSection>
    </FoundationPage>
  );
}

const meta = { title: 'Fundamentos/Iconografía', tags: ['!autodocs'], parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
export const Iconografia: StoryObj = { name: 'Iconografía', render: () => <IconPage /> };
