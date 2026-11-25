import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { Button } from '../../actions/Button/Button';
import { InlineAlert, type InlineAlertSeverity } from './InlineAlert';

const m = {
  es: {
    success: 'Dirección guardada',
    successBody: 'La usaremos para tu próxima recogida.',
    warning: 'Pocos horarios disponibles',
    warningBody: 'Solo quedan dos franjas el sábado 14 de diciembre.',
    error: 'No pudimos guardar el método de pago',
    errorBody: 'Revisa los datos de la tarjeta e inténtalo de nuevo.',
    info: 'Recogida en subasta',
    infoBody: 'Necesitamos el código de recogida y el número de lote para retirar el vehículo.',
    retry: 'Reintentar',
    seeTimes: 'Ver horarios',
    gatePass: 'El vehículo ya fue pagado a Copart',
    gatePassBody: 'Lote 04217753 · código de recogida 0093. Puedes programar la recogida.',
    lotMissing: 'Falta el número de lote',
    lotMissingBody: 'Sin el lote el conductor no puede identificar el vehículo en el patio de Copart Miami Norte.',
    add: 'Agregar lote',
    closeAlert: 'Cerrar aviso',
  },
  en: {
    success: 'Address saved',
    successBody: 'We will use it for your next pickup.',
    warning: 'Few time slots left',
    warningBody: 'Only two slots remain on Saturday, December 14.',
    error: 'We could not save the payment method',
    errorBody: 'Check the card details and try again.',
    info: 'Auction pickup',
    infoBody: 'We need the pickup code and the lot number to release the vehicle.',
    retry: 'Try again',
    seeTimes: 'See times',
    gatePass: 'The vehicle is already paid to Copart',
    gatePassBody: 'Lot 04217753 · pickup code 0093. You can schedule the pickup.',
    lotMissing: 'Lot number is missing',
    lotMissingBody: 'Without the lot the driver cannot identify the vehicle in the Copart Miami North yard.',
    add: 'Add lot number',
    closeAlert: 'Dismiss alert',
  },
};

function useCopy() {
  const t = useT(m);
  return {
    success: [t.success, t.successBody],
    warning: [t.warning, t.warningBody],
    error: [t.error, t.errorBody],
    info: [t.info, t.infoBody],
  } as const;
}

function InteractiveDemo({ severity, withTitle, withAction, dismissible }: { severity?: InlineAlertSeverity; withTitle?: boolean; withAction?: boolean; dismissible?: boolean }) {
  const t = useT(m);
  const copy = useCopy();
  const sev = severity ?? 'info';
  const [open, setOpen] = useState(true);
  if (!open) {
    return (
      <Button variant="secondary" size="md" onClick={() => setOpen(true)}>
        {t.retry}
      </Button>
    );
  }
  return (
    <Box sx={{ width: 380, maxWidth: '100%' }}>
      <InlineAlert
        severity={sev}
        title={withTitle ? copy[sev][0] : undefined}
        action={withAction ? <Button variant="quiet" size="sm">{t.retry}</Button> : undefined}
        onClose={dismissible ? () => setOpen(false) : undefined}
      >
        {copy[sev][1]}
      </InlineAlert>
    </Box>
  );
}

function VariantsDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const copy = useCopy();
  return (
    <Showcase maxWidth={420}>
      <Specimen label={l.variants} direction="column" align="stretch" gap={3}>
        {(['success', 'warning', 'error', 'info'] as const).map((s) => (
          <InlineAlert key={s} severity={s} title={copy[s][0]}>
            {copy[s][1]}
          </InlineAlert>
        ))}
      </Specimen>
      <Specimen label={`${l.withIcon} · acción / ${l.optional}`} direction="column" align="stretch" gap={3}>
        <InlineAlert severity="error" action={<Button variant="quiet" size="sm">{t.retry}</Button>}>
          {copy.error[0]}
        </InlineAlert>
        <InlineAlert severity="warning" onClose={() => undefined} action={<Button variant="quiet" size="sm">{t.seeTimes}</Button>}>
          {copy.warning[1]}
        </InlineAlert>
      </Specimen>
    </Showcase>
  );
}

function BusinessDemo() {
  const t = useT(m);
  return (
    <Showcase maxWidth={420}>
      <InlineAlert severity="success" title={t.gatePass}>
        {t.gatePassBody}
      </InlineAlert>
      <InlineAlert severity="error" title={t.lotMissing} action={<Button variant="quiet" size="sm">{t.add}</Button>}>
        {t.lotMissingBody}
      </InlineAlert>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Feedback/Aviso en línea',
  component: InlineAlert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Mensaje **dentro del contenido** de una página o formulario, junto a lo que describe: éxito, advertencia, error o información. Para toda la página usa **Banner**; para algo pasajero, **Toast**.',
          anatomy: ['**Icono** de severidad', '**Título** (opcional)', '**Texto**', '**Acción** única (opcional)', '**Cerrar** (opcional)'],
          props: ['`severity`: `success` · `warning` · `error` · `info`.', '`onClose` lo vuelve descartable; no lo uses en errores que bloquean el avance.', '`action`: un Botón discreto o un Enlace, nunca dos acciones.'],
          states: ['Visible · descartado', 'La acción y el botón cerrar tienen hover, foco y presionado propios'],
          tokens: [['Fondo', 'status.{tono}.bg'], ['Texto', 'status.{tono}.fg'], ['Borde', 'status.{tono}.border'], ['Radio', 'radius.md'], ['Tipografía', 'typeScale.body2 / label']],
          responsive: ['Ocupa el ancho del contenedor; texto con salto de línea completo.', 'La acción baja bajo el texto cuando no cabe a la derecha.'],
          a11y: ['Error y advertencia: `role="alert"`; éxito e información: `role="status"`.', 'Icono + texto en todas las severidades: el significado no depende del color.', 'El botón cerrar tiene nombre (“Cerrar aviso”) y es alcanzable por teclado.', 'Contraste ≥ 4.5:1 del texto sobre su fondo en ambos temas.'],
          content: [['Falta el número de lote · Agregar lote', 'Lot number is missing · Add lot number'], ['No pudimos guardar el método de pago · Reintentar', 'We could not save the payment method · Try again']],
          example: '**Ejemplo de negocio**: formulario de recogida de Towing en Copart Miami Norte: aviso de éxito con lote 04217753 y código 0093, y error por falta del número de lote con acción “Agregar lote”.',
        }),
      },
    },
  },
} satisfies Meta<typeof InlineAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: 'Interactivo',
  args: { severity: 'info', children: '', title: undefined },
  argTypes: { severity: { control: 'inline-radio', options: ['success', 'warning', 'error', 'info'] }, children: { control: false }, title: { control: false }, action: { control: false }, onClose: { control: false } },
  render: (args) => <InteractiveDemo severity={args.severity} withTitle withAction dismissible />,
};
export const Variants: Story = { name: 'Variantes', args: { severity: 'info', children: '' }, render: () => <VariantsDemo /> };
export const BusinessExample: Story = { name: 'Ejemplo de negocio', args: { severity: 'info', children: '' }, render: () => <BusinessDemo /> };
