import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';
import { Price } from '../../data-display/Price/Price';
import { ActionGroup } from '../ActionGroup/ActionGroup';
import { Button } from '../Button/Button';
import { BottomActionBar } from './BottomActionBar';

const m = {
  es: {
    title: 'Lavado a domicilio',
    body: 'Personal Washing llega a tu dirección con agua y productos propios. Solo necesitamos acceso al vehículo y unos 3 m libres alrededor.',
    details: 'Sábado 14 de diciembre · 10:00 a. m. · SUV mediano',
    continue: 'Continuar',
    total: 'Total',
    confirm: 'Confirmar reserva',
    reset: 'Restablecer',
    apply: 'Aplicar',
  },
  en: {
    title: 'At-home wash',
    body: 'Personal Washing comes to your address with its own water and products. We only need access to the vehicle and about 10 ft of clear space around it.',
    details: 'Saturday, December 14 · 10:00 AM · Midsize SUV',
    continue: 'Continue',
    total: 'Total',
    confirm: 'Confirm booking',
    reset: 'Reset',
    apply: 'Apply',
  },
};

function ScreenBody() {
  const t = useT(m);
  return (
    <Box sx={{ pt: `calc(${layout.safeAreaTop} + 24px)`, px: `${layout.gutter.mobile}px`, pb: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h1">{t.title}</Typography>
      <Typography variant="body1" sx={{ color: bs.text.secondary }}>
        {t.body}
      </Typography>
      <Typography variant="label">{t.details}</Typography>
    </Box>
  );
}

function SingleDemo() {
  const t = useT(m);
  return (
    <>
      <ScreenBody />
      <BottomActionBar>
        <Button fullWidth>{t.continue}</Button>
      </BottomActionBar>
    </>
  );
}

function SummaryDemo() {
  const t = useT(m);
  return (
    <>
      <ScreenBody />
      <BottomActionBar
        summary={
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="caption" sx={{ color: bs.text.secondary }}>
              {t.total}
            </Typography>
            <Price amount={64} size="lg" />
          </Box>
        }
      >
        <Button>{t.confirm}</Button>
      </BottomActionBar>
    </>
  );
}

function GroupDemo() {
  const t = useT(m);
  return (
    <>
      <ScreenBody />
      <BottomActionBar>
        <ActionGroup>
          <Button variant="secondary">{t.reset}</Button>
          <Button>{t.apply}</Button>
        </ActionGroup>
      </BottomActionBar>
    </>
  );
}

const meta = {
  title: 'Componentes/Acciones/Barra de acción inferior',
  component: BottomActionBar,
  args: { children: null, position: 'sticky' },
  argTypes: { position: { control: 'inline-radio', options: ['sticky', 'fixed', 'static'] }, children: { control: false }, summary: { control: false } },
  parameters: {
    layout: 'fullscreen',
    device: {},
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Mantiene visible la acción principal de la pantalla (Continuar, Confirmar reserva) al final de un flujo con scroll.',
          anatomy: ['**Superficie** elevada con esquinas superiores redondeadas', '**Resumen** a la izquierda, p. ej. el total (opcional)', '**Acción**: un Botón a ancho completo o un Grupo de acciones', '**Relleno inferior** que respeta el área segura'],
          props: ['`position`: `sticky` (por defecto, al final de una columna flexible con scroll) · `fixed` · `static`.', '`summary` reduce la acción a su ancho natural y deja el resumen a la izquierda.'],
          states: ['Sin estados propios; la acción interna aporta cargando y deshabilitado.'],
          tokens: [
            ['Fondo', 'surface.raised'],
            ['Borde superior', 'border.subtle'],
            ['Sombra', 'elevation.e2'],
            ['Radio superior', 'radius.xl (24 px)'],
            ['Relleno inferior', '16 px + layout.safeAreaBottom'],
            ['Capa', 'zLayer.bottomBar'],
          ],
          responsive: [
            'Móvil: ocupa todo el ancho; el relleno inferior suma `env(safe-area-inset-bottom)` (en Storybook, el marco expone `--bs-safe-area-bottom`).',
            'Escritorio: el contenido se limita a 840 px centrados.',
            'Con el teclado abierto, al ser `sticky` queda sobre el teclado en navegadores que redimensionan el viewport.',
          ],
          a11y: ['Va después del contenido en el DOM: el orden de foco termina en la acción principal.', 'No atrapa el foco ni tapa campos: el contenido debe tener espacio inferior suficiente.'],
          content: [
            ['Continuar', 'Continue'],
            ['Total · Confirmar reserva', 'Total · Confirm booking'],
            ['Restablecer · Aplicar', 'Reset · Apply'],
          ],
          example: 'Las tres historias muestran una reserva de Personal Washing dentro del marco del teléfono; **Con resumen** lleva el total de $64.00.',
        }),
      },
    },
  },
} satisfies Meta<typeof BottomActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = { name: 'Acción única', render: () => <SingleDemo /> };
export const WithSummary: Story = { name: 'Con resumen', render: () => <SummaryDemo /> };
export const WithGroup: Story = { name: 'Con grupo de acciones', render: () => <GroupDemo /> };
