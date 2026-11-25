import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { Button } from '../../actions/Button/Button';
import { TextField } from '../../fields/TextField/TextField';
import { ConfirmDialog, DiscardChangesDialog } from './ConfirmDialog';

const m = {
  es: {
    openDefault: 'Confirmar recogida',
    openDestructive: 'Cancelar reserva',
    openDiscard: 'Salir del formulario',
    defaultTitle: '¿Confirmar la recogida?',
    defaultBody: 'Enviaremos a un conductor a Copart Miami Norte a las 1:00 p. m. para retirar el lote 04217753.',
    defaultConfirm: 'Confirmar recogida',
    keep: 'Volver',
    destTitle: '¿Cancelar esta reserva?',
    destBody: 'Detailing Completo · sábado 14 de diciembre, 10:00 a. m. Si cancelas con menos de 24 horas se cobra el 20 %.',
    destConfirm: 'Cancelar reserva',
    destCancel: 'Mantener reserva',
    form: 'Editar dirección de recogida',
    field: 'Dirección',
    fieldValue: '2150 NW 87th Ave, Doral',
    result: 'Resultado',
    none: 'Sin acción',
    confirmed: 'Confirmado',
    cancelled: 'Reserva cancelada',
    discarded: 'Cambios descartados',
    stayed: 'Sigues editando',
    sending: 'Cancelando…',
  },
  en: {
    openDefault: 'Confirm pickup',
    openDestructive: 'Cancel booking',
    openDiscard: 'Leave the form',
    defaultTitle: 'Confirm the pickup?',
    defaultBody: 'We will send a driver to Copart Miami North at 1:00 PM to pick up lot 04217753.',
    defaultConfirm: 'Confirm pickup',
    keep: 'Go back',
    destTitle: 'Cancel this booking?',
    destBody: 'Full Detailing · Saturday, December 14, 10:00 AM. Cancelling less than 24 hours ahead is charged 20%.',
    destConfirm: 'Cancel booking',
    destCancel: 'Keep booking',
    form: 'Edit pickup address',
    field: 'Address',
    fieldValue: '2150 NW 87th Ave, Doral',
    result: 'Result',
    none: 'No action',
    confirmed: 'Confirmed',
    cancelled: 'Booking cancelled',
    discarded: 'Changes discarded',
    stayed: 'Still editing',
    sending: 'Cancelling…',
  },
};

function Result({ text }: { text: string }) {
  const t = useT(m);
  return (
    <Typography variant="caption" sx={{ color: bs.text.secondary }} aria-live="polite">
      {t.result}: {text}
    </Typography>
  );
}

function InteractiveDemo({ variant }: { variant?: 'default' | 'destructive' }) {
  const t = useT(m);
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState(t.none);
  const destructive = variant === 'destructive';
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
      <Button variant={destructive ? 'destructive' : 'secondary'} size="md" onClick={() => setOpen(true)}>
        {destructive ? t.openDestructive : t.openDefault}
      </Button>
      <Result text={result} />
      <ConfirmDialog
        open={open}
        variant={variant}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          setResult(destructive ? t.cancelled : t.confirmed);
        }}
        title={destructive ? t.destTitle : t.defaultTitle}
        description={destructive ? t.destBody : t.defaultBody}
        confirmLabel={destructive ? t.destConfirm : t.defaultConfirm}
        cancelLabel={destructive ? t.destCancel : t.keep}
      />
    </Box>
  );
}

function VariantsDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [which, setWhich] = useState<'default' | 'destructive' | 'loading' | null>(null);
  const close = () => setWhich(null);
  return (
    <Showcase>
      <Specimen label={`${l.primary} / ${l.destructive} / ${l.loading}`}>
        <Button variant="secondary" size="md" onClick={() => setWhich('default')}>
          {t.openDefault}
        </Button>
        <Button variant="destructive" size="md" onClick={() => setWhich('destructive')}>
          {t.openDestructive}
        </Button>
        <Button variant="secondary" size="md" onClick={() => setWhich('loading')}>
          {t.sending}
        </Button>
      </Specimen>
      <ConfirmDialog open={which === 'default'} onClose={close} onConfirm={close} title={t.defaultTitle} description={t.defaultBody} confirmLabel={t.defaultConfirm} cancelLabel={t.keep} />
      <ConfirmDialog open={which === 'destructive'} variant="destructive" onClose={close} onConfirm={close} title={t.destTitle} description={t.destBody} confirmLabel={t.destConfirm} cancelLabel={t.destCancel} />
      <ConfirmDialog open={which === 'loading'} variant="destructive" loading onClose={close} onConfirm={close} title={t.destTitle} description={t.destBody} confirmLabel={t.destConfirm} cancelLabel={t.destCancel} />
    </Showcase>
  );
}

function DiscardDemo() {
  const t = useT(m);
  const [value, setValue] = useState(t.fieldValue);
  const [asking, setAsking] = useState(false);
  const [result, setResult] = useState(t.none);
  const dirty = value !== t.fieldValue;
  return (
    <Box sx={{ width: 340, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h3" component="h2">
        {t.form}
      </Typography>
      <TextField label={t.field} value={value} onChange={(e) => setValue(e.target.value)} />
      <Button
        variant="secondary"
        size="md"
        onClick={() => {
          if (dirty) setAsking(true);
          else setResult(t.discarded);
        }}
      >
        {t.openDiscard}
      </Button>
      <Result text={result} />
      <DiscardChangesDialog
        open={asking}
        onClose={() => {
          setAsking(false);
          setResult(t.stayed);
        }}
        onDiscard={() => {
          setAsking(false);
          setValue(t.fieldValue);
          setResult(t.discarded);
        }}
      />
    </Box>
  );
}

const meta = {
  title: 'Componentes/Capas y menús/Diálogo de confirmación',
  component: ConfirmDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Pide una **confirmación explícita** antes de una acción importante o irreversible. Incluye el patrón **“¿Descartar los cambios?”** para salir de un formulario editado.',
          anatomy: ['**Título** en forma de pregunta', '**Descripción** de la consecuencia', '**Cancelar** (opción segura)', '**Confirmar** con el verbo del resultado', '**Velo**'],
          props: [
            '`variant="destructive"`: confirmar en rojo, rol `alertdialog` y foco inicial en la opción segura.',
            '`confirmLabel` nombra el resultado (“Cancelar reserva”), nunca “Sí” o “Aceptar”; `cancelLabel` aclara lo contrario (“Mantener reserva”).',
            '`loading`: el botón confirmar muestra progreso y el diálogo no se cierra hasta terminar.',
            '`DiscardChangesDialog`: textos y acciones listos (“Seguir editando” / “Descartar cambios”). Muéstralo solo si hay cambios sin guardar.',
          ],
          states: ['Cerrado · abierto · confirmando (cargando) · cerrado', 'Botones: reposo · hover · foco · presionado · deshabilitado durante la carga'],
          tokens: [['Fondo', 'surface.raised'], ['Radio', 'radius.xl'], ['Sombra', 'elevation.e3'], ['Velo', 'scrim'], ['Confirmar destructivo', 'action.destructive.*'], ['Margen lateral', '20 px']],
          responsive: ['En móvil los botones se apilan con la acción principal arriba; desde 600 px van lado a lado.', 'Ancho máximo 444 px; textos largos hacen salto de línea.'],
          a11y: [
            '`role="dialog"` o `alertdialog` (destructivo), nombrado por el título y descrito por el cuerpo.',
            'Foco atrapado; Esc y toque en el velo equivalen a Cancelar y nunca confirman.',
            'El foco vuelve al botón que abrió el diálogo.',
            'En destructivo el foco inicial está en la opción segura; en el resto, en confirmar.',
            'El peligro se comunica con el verbo y el texto, no solo con el color.',
          ],
          content: [['¿Cancelar esta reserva? · Cancelar reserva · Mantener reserva', 'Cancel this booking? · Cancel booking · Keep booking'], ['¿Descartar los cambios? · Seguir editando · Descartar cambios', 'Discard changes? · Keep editing · Discard changes']],
          example: '**Ejemplo de negocio**: cancelar un Detailing Completo con cargo del 20 % dentro de 24 h, confirmar una recogida en Copart Miami Norte y salir del formulario de dirección con cambios sin guardar.',
        }),
      },
    },
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { open: false, onClose: () => undefined, onConfirm: () => undefined, title: '', description: '' };

export const Interactive: Story = {
  name: 'Interactivo',
  args: { ...base, variant: 'destructive' },
  argTypes: { open: { control: false }, onClose: { control: false }, onConfirm: { control: false }, title: { control: false }, description: { control: false } },
  render: (args) => <InteractiveDemo variant={args.variant} />,
};
export const Variants: Story = { name: 'Variantes y carga', args: base, render: () => <VariantsDemo /> };
export const DiscardChanges: Story = { name: 'Ejemplo de negocio · Descartar cambios', args: base, render: () => <DiscardDemo /> };
