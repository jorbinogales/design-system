import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { layout } from '../../../theme/tokens';
import { ActionGroup } from '../../actions/ActionGroup/ActionGroup';
import { BottomActionBar } from '../../actions/BottomActionBar/BottomActionBar';
import { Button } from '../../actions/Button/Button';
import { KeyValue, KeyValueList } from '../../layout/KeyValue/KeyValue';
import { TopBar } from '../../navigation/TopBar/TopBar';
import { StepProgress, useBookingSteps } from './StepProgress';

const m = {
  es: {
    back: 'Atrás',
    next: 'Continuar',
    confirm: 'Confirmar reserva',
    title: 'Reservar Detailing',
    step: 'Paso actual',
    vehicle: 'Vehículo',
    vehicleValue: 'Toyota Camry 2022 · blanco',
    service: 'Servicio',
    serviceValue: 'Detailing Completo · 3 h',
    schedule: 'Horario',
    scheduleValue: 'Sábado 14 de diciembre, 10:00 a. m.',
    payment: 'Pago',
    paymentValue: 'Visa •••• 4821',
    compact: 'Compacto (móvil)',
    full: 'Completo (escritorio)',
  },
  en: {
    back: 'Back',
    next: 'Continue',
    confirm: 'Confirm booking',
    title: 'Book Detailing',
    step: 'Current step',
    vehicle: 'Vehicle',
    vehicleValue: '2022 Toyota Camry · white',
    service: 'Service',
    serviceValue: 'Full Detailing · 3 h',
    schedule: 'Schedule',
    scheduleValue: 'Saturday, December 14, 10:00 AM',
    payment: 'Payment',
    paymentValue: 'Visa •••• 4821',
    compact: 'Compact (mobile)',
    full: 'Full (desktop)',
  },
};

function InteractiveDemo({ variant, startAt }: { variant?: 'responsive' | 'compact' | 'full'; startAt?: number }) {
  const t = useT(m);
  const steps = useBookingSteps();
  const [current, setCurrent] = useState(startAt ?? 1);
  return (
    <Box sx={{ width: 720, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <StepProgress steps={steps} current={current} variant={variant} />
      <ActionGroup align="start">
        <Button variant="secondary" size="md" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
          {t.back}
        </Button>
        <Button size="md" disabled={current === steps.length - 1} onClick={() => setCurrent((c) => c + 1)}>
          {t.next}
        </Button>
      </ActionGroup>
    </Box>
  );
}

function VariantsDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const steps = useBookingSteps();
  return (
    <Showcase maxWidth={760}>
      <Specimen label={t.compact} direction="column" align="stretch">
        <Box sx={{ width: 350, maxWidth: '100%' }}>
          <StepProgress steps={steps} current={1} variant="compact" />
        </Box>
      </Specimen>
      <Specimen label={`${t.full} · ${l.states}`} direction="column" align="stretch" gap={5}>
        {[0, 2, 4].map((i) => (
          <StepProgress key={i} steps={steps} current={i} variant="full" />
        ))}
      </Specimen>
    </Showcase>
  );
}

/** Booking form step 4: compact progress in the top bar on mobile. */
function BookingScreen() {
  const t = useT(m);
  const steps = useBookingSteps();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <TopBar title={t.title} onBack={() => undefined}>
        <StepProgress steps={steps} current={3} variant="compact" />
      </TopBar>
      <Box sx={{ px: `${layout.gutter.mobile}px`, py: 6, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <Typography variant="h2" component="h2">
          {steps[3].label}
        </Typography>
        <KeyValueList>
          <KeyValue label={t.vehicle} value={t.vehicleValue} layout="stacked" />
          <KeyValue label={t.service} value={t.serviceValue} layout="stacked" />
          <KeyValue label={t.schedule} value={t.scheduleValue} layout="stacked" />
          <KeyValue label={t.payment} value={t.paymentValue} layout="stacked" />
        </KeyValueList>
      </Box>
      <BottomActionBar>
        <Button fullWidth>{t.confirm}</Button>
      </BottomActionBar>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Feedback/Progreso por pasos',
  component: StepProgress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Muestra **en qué paso de la reserva** está la persona: Vehículo · Servicio · Horario · Pago · Confirmación. **Compacto** (“Paso 2 de 5”) en móvil y **completo** en escritorio.',
          anatomy: ['**Compacto**: texto “Paso N de M · nombre” y barra segmentada', '**Completo**: lista numerada con círculo (número o check), nombre y conector', '**Paso actual** y **pasos completados** marcados'],
          props: ['`variant`: `responsive` (por defecto: compacto bajo 600 px, completo desde ahí), `compact`, `full`.', '`current` es el índice (desde 0) del paso actual; los anteriores se marcan completados.', '`useBookingSteps()` devuelve los cinco pasos en el idioma activo; para otros flujos pasa tu propia lista `{ id, label }`.', 'No navega: la navegación entre pasos vive en los botones Atrás / Continuar.'],
          states: ['Completado: círculo `brand.primary` con check y conector naranja', 'Actual: círculo `brand.primary` con número y nombre en negrita', 'Pendiente: círculo con borde `border.strong` y texto secundario'],
          tokens: [['Paso hecho / actual', 'brand.primary · action.primary.fg (#111111)'], ['Paso pendiente', 'border.strong · text.secondary'], ['Conector', 'border.subtle'], ['Segmento pendiente', 'surface.muted'], ['Círculo', '28 px']],
          responsive: ['Móvil (< 600 px): compacto dentro de la barra superior o bajo el título.', 'Escritorio: lista horizontal; los conectores absorben el ancho sobrante.', 'En 320 px el compacto muestra el nombre del paso con salto de línea, sin desbordar.'],
          a11y: ['Contenedor `nav` con nombre “Progreso de la reserva”.', 'El paso actual lleva `aria-current="step"`; completado y actual también se dicen en texto oculto.', 'El estado no depende del color: número, check y negrita lo refuerzan.', 'La barra segmentada es decorativa (`aria-hidden`); el texto “Paso 2 de 5” la sustituye.'],
          content: [['Paso 2 de 5 · Servicio', 'Step 2 of 5 · Service'], ['Vehículo · Servicio · Horario · Pago · Confirmación', 'Vehicle · Service · Schedule · Payment · Confirmation']],
          example: '**Ejemplo de negocio**: reserva de Detailing Completo en el paso 4 (Pago) con la barra superior de móvil y el resumen del vehículo, servicio y horario.',
        }),
      },
    },
  },
} satisfies Meta<typeof StepProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { steps: [], current: 0 };

export const Interactive: Story = {
  name: 'Interactivo',
  args: { ...base, variant: 'responsive' },
  argTypes: { steps: { control: false }, current: { control: false }, variant: { control: 'inline-radio', options: ['responsive', 'compact', 'full'] } },
  render: (args) => <InteractiveDemo variant={args.variant} />,
};
export const Variants: Story = { name: 'Compacto y completo', args: base, render: () => <VariantsDemo /> };
export const BusinessExample: Story = {
  name: 'Ejemplo de negocio · Reserva en móvil',
  args: base,
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
  render: () => <BookingScreen />,
};
