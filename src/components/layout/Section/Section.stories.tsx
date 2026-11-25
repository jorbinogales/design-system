import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { EngineBayIcon } from '../../../icons/EngineBayIcon';
import { ExteriorWashIcon } from '../../../icons/ExteriorWashIcon';
import { InteriorIcon } from '../../../icons/InteriorIcon';
import { VacuumIcon } from '../../../icons/VacuumIcon';
import { componentDocs } from '../../../storybook/docSpec';
import { bs } from '../../../theme/theme';
import { Section } from './Section';

const m = {
  es: { services: 'Servicios', exterior: 'Exterior', vacuum: 'Aspirado', interior: 'Interior', engine: 'Motor', note: 'Elige un servicio para ver paquetes y precios.' },
  en: { services: 'Services', exterior: 'Exterior', vacuum: 'Vacuum', interior: 'Interior', engine: 'Engine bay', note: 'Pick a service to see packages and prices.' },
};

function Demo() {
  const t = useT(m);
  const items = [
    { icon: ExteriorWashIcon, label: t.exterior },
    { icon: VacuumIcon, label: t.vacuum },
    { icon: InteriorIcon, label: t.interior },
    { icon: EngineBayIcon, label: t.engine },
  ];
  return (
    <Box sx={{ width: 350 }}>
      <Section title={t.services} description={t.note} onAction={() => undefined}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
          {items.map(({ icon: Icon, label }) => (
            <Box key={label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 64, height: 64, borderRadius: '50%', display: 'grid', placeItems: 'center', backgroundColor: bs.surface.subtle }}>
                <Icon sx={{ fontSize: 28 }} />
              </Box>
              <Typography variant="caption" sx={{ textAlign: 'center' }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Section>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Estructura/Sección',
  component: Section,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Bloque titulado de una pantalla con ritmo vertical consistente. Renderiza `<section>` etiquetado por su encabezado.',
          anatomy: ['**Encabezado de sección** (opcional, con “Ver todo”)', '**Contenido**'],
          props: ['`spacing`: `sm` · `md` · `lg` controla el espacio entre encabezado y contenido y el relleno vertical.', 'Pasa `actionHref` u `onAction` para mostrar “Ver todo”.'],
          states: ['Sin estados.'],
          tokens: [
            ['Separación', 'space.sm · md · lg'],
            ['Título', 'typeScale.h3'],
          ],
          responsive: ['Ocupa el ancho del contenedor; el contenido decide su rejilla.'],
          a11y: ['`<section aria-labelledby>` apunta al título: los lectores de pantalla lo listan como región.', 'Título `h2` por defecto (`headingLevel` para ajustar la jerarquía).'],
          content: [['Servicios · Ver todo', 'Services · See all']],
          example: 'La historia reproduce la sección Servicios del Inicio con los iconos de categoría de Black Six.',
        }),
      },
    },
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BusinessExample: Story = { name: 'Ejemplo de negocio', args: { children: null }, render: () => <Demo /> };
