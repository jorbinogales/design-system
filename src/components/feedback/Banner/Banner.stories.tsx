import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';
import { Button } from '../../actions/Button/Button';
import { KeyValue, KeyValueList } from '../../layout/KeyValue/KeyValue';
import { TopBar } from '../../navigation/TopBar/TopBar';
import { Banner, type BannerSeverity } from './Banner';

const m = {
  es: {
    success: 'Reserva confirmada',
    successBody: 'Detailing Completo · sábado 14 de diciembre, 10:00 a. m.',
    warning: 'Mantenimiento programado',
    warningBody: 'Los pagos en línea no estarán disponibles hoy de 11:00 p. m. a 12:00 a. m.',
    error: 'Sin conexión con el servidor',
    errorBody: 'Tus cambios no se están guardando.',
    info: 'Nuevo horario de Towing',
    infoBody: 'Ahora hacemos recogidas en Copart e IAA los domingos de 8:00 a. m. a 2:00 p. m.',
    view: 'Ver reserva',
    retry: 'Reintentar',
    persistent: 'Persistente',
    dismissible: 'Descartable',
    screen: 'Tu reserva',
    code: 'Referencia',
    when: 'Cuándo',
    whenValue: 'Sábado 14 de diciembre, 10:00 a. m.',
    where: 'Dónde',
    whereValue: 'Black Six Coral Gables · 1450 Ponce de León Blvd',
    towTitle: 'Recogida confirmada',
    towBody: 'Copart Miami Norte · Lote 04217753 · Código 0093',
    seeCode: 'Ver código',
  },
  en: {
    success: 'Booking confirmed',
    successBody: 'Full Detailing · Saturday, December 14, 10:00 AM',
    warning: 'Scheduled maintenance',
    warningBody: 'Online payments will be unavailable today from 11:00 PM to 12:00 AM.',
    error: 'Cannot reach the server',
    errorBody: 'Your changes are not being saved.',
    info: 'New Towing hours',
    infoBody: 'We now do Copart and IAA pickups on Sundays from 8:00 AM to 2:00 PM.',
    view: 'View booking',
    retry: 'Try again',
    persistent: 'Persistent',
    dismissible: 'Dismissible',
    screen: 'Your booking',
    code: 'Reference',
    when: 'When',
    whenValue: 'Saturday, December 14, 10:00 AM',
    where: 'Where',
    whereValue: 'Black Six Coral Gables · 1450 Ponce de León Blvd',
    towTitle: 'Pickup confirmed',
    towBody: 'Copart Miami North · Lot 04217753 · Code 0093',
    seeCode: 'View code',
  },
};

function copyFor(t: (typeof m)['es']) {
  return { success: [t.success, t.successBody], warning: [t.warning, t.warningBody], error: [t.error, t.errorBody], info: [t.info, t.infoBody] } as const;
}

function InteractiveDemo({ severity, dismissible }: { severity?: BannerSeverity; dismissible?: boolean }) {
  const t = useT(m);
  const sev = severity ?? 'info';
  const [shown, setShown] = useState(true);
  const copy = copyFor(t)[sev];
  return (
    <Box sx={{ width: 480, maxWidth: '100vw' }}>
      {shown ? (
        <Banner severity={sev} title={copy[0]} dismissible={dismissible} onDismiss={() => setShown(false)} action={<Button variant="quiet" size="sm">{t.view}</Button>}>
          {copy[1]}
        </Banner>
      ) : (
        <Button variant="secondary" size="md" onClick={() => setShown(true)} sx={{ m: 4 }}>
          {t.retry}
        </Button>
      )}
    </Box>
  );
}

function VariantsDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const copy = copyFor(t);
  return (
    <Showcase maxWidth={480}>
      <Specimen label={t.persistent} direction="column" align="stretch" gap={0}>
        {(['success', 'warning', 'error', 'info'] as const).map((s) => (
          <Banner key={s} severity={s} title={copy[s][0]}>
            {copy[s][1]}
          </Banner>
        ))}
      </Specimen>
      <Specimen label={`${t.dismissible} · ${l.withIcon}`} direction="column" align="stretch" gap={0}>
        <Banner severity="info" dismissible title={t.info} action={<Button variant="quiet" size="sm">{t.view}</Button>}>
          {t.infoBody}
        </Banner>
      </Specimen>
    </Showcase>
  );
}

function BusinessDemo() {
  const t = useT(m);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <TopBar title={t.screen} onBack={() => undefined} />
      <Banner severity="success" title={t.success} action={<Button variant="quiet" size="sm">{t.seeCode}</Button>}>
        {t.towBody}
      </Banner>
      <Box sx={{ p: `${layout.gutter.mobile}px`, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Typography variant="h3" component="h2">
          {t.towTitle}
        </Typography>
        <KeyValueList>
          <KeyValue label={t.code} value="BK-20418" />
          <KeyValue label={t.when} value={t.whenValue} layout="stacked" />
          <KeyValue label={t.where} value={t.whereValue} layout="stacked" />
        </KeyValueList>
        <Typography variant="body2" sx={{ color: bs.text.secondary }}>
          {t.successBody}
        </Typography>
      </Box>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Feedback/Banner',
  component: Banner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Mensaje **de toda la página**, de borde a borde bajo la barra superior. **Persistente** por defecto (reserva confirmada, sin conexión, mantenimiento); **descartable** para novedades y consejos.',
          anatomy: ['**Icono** de severidad', '**Título**', '**Texto** (opcional)', '**Acción** única (opcional)', '**Cerrar** (solo descartable)'],
          props: ['`dismissible` (por defecto `false`): muestra ✕ y llama a `onDismiss`. La confirmación de una reserva debe quedarse: usa la versión persistente.', 'Un solo banner por vista; si hay varios, muestra el más grave.'],
          states: ['Persistente: visible mientras la condición exista', 'Descartable: visible → descartado', 'Acción y cerrar con hover, foco y presionado'],
          tokens: [['Fondo', 'status.{tono}.bg'], ['Texto e icono', 'status.{tono}.fg'], ['Borde inferior', 'status.{tono}.border'], ['Márgenes laterales', 'layout.gutter.mobile / tablet']],
          responsive: ['Ocupa todo el ancho (sin radio) y respeta los márgenes de página 20 / 32 px.', 'Texto y acción hacen salto de línea; la acción queda bajo el texto.'],
          a11y: ['Error: `role="alert"`; resto: `role="status"`. No roba el foco.', 'Icono + título en todas las severidades.', '✕ con nombre accesible (“Cerrar mensaje”).', 'Un banner persistente no debe desaparecer solo.'],
          content: [['Reserva confirmada · Ver reserva', 'Booking confirmed · View booking'], ['Los pagos en línea no estarán disponibles hoy de 11:00 p. m. a 12:00 a. m.', 'Online payments will be unavailable today from 11:00 PM to 12:00 AM.']],
          example: '**Ejemplo de negocio**: pantalla de reserva con el banner persistente “Reserva confirmada” de una recogida de Towing (Copart Miami Norte, lote 04217753, código 0093) y su resumen debajo.',
        }),
      },
    },
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: 'Interactivo',
  args: { severity: 'info', title: '', dismissible: true },
  argTypes: { severity: { control: 'inline-radio', options: ['success', 'warning', 'error', 'info'] }, title: { control: false }, children: { control: false }, action: { control: false }, onDismiss: { control: false } },
  render: (args) => <InteractiveDemo severity={args.severity} dismissible={args.dismissible} />,
};
export const Variants: Story = { name: 'Variantes', args: { severity: 'info', title: '' }, render: () => <VariantsDemo /> };
export const BookingConfirmed: Story = {
  name: 'Ejemplo de negocio · Reserva confirmada',
  args: { severity: 'success', title: '' },
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
  render: () => <BusinessDemo />,
};
