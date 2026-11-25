import BookmarkBorderRounded from '@mui/icons-material/BookmarkBorderRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';
import { ActionGroup } from '../../actions/ActionGroup/ActionGroup';
import { Button } from '../../actions/Button/Button';
import { Tag } from '../../data-display/Tag/Tag';
import { Media } from '../../layout/Media/Media';
import { ListGroup, ListRow } from '../../layout/ListRow/ListRow';
import { Price } from '../../data-display/Price/Price';
import { TopBar } from '../../navigation/TopBar/TopBar';
import { BottomSheet } from './BottomSheet';

const m = {
  es: {
    screen: 'Guardados',
    reopenRemove: 'Quitar de guardados',
    reopenLogout: 'Cerrar sesión',
    removeTitle: '¿Quitar de guardados?',
    cancel: 'Cancelar',
    remove: 'Sí, quitar',
    shop: 'Detailing Completo',
    shopAlt: 'Auto sedán con acabado brillante en el taller',
    shopMeta: 'Coral Gables · 8 min',
    unit: 'Detailing',
    from: 'Desde',
    logoutTitle: 'Cerrar sesión',
    logoutBody: '¿Seguro que quieres cerrar sesión? Tus reservas se conservan.',
    logout: 'Sí, cerrar sesión',
    optionsTitle: 'Tipo de vehículo',
    optionsClose: 'Cerrar tipo de vehículo',
    apply: 'Aplicar',
    sedan: 'Sedán',
    suv: 'SUV o camioneta',
    pickup: 'Pickup',
    coupe: 'Coupé',
    van: 'Van',
    bike: 'Moto',
    selected: 'Seleccionado',
    pendingTitle: 'Confirma tu recogida',
    pendingBody: 'No puedes cerrar esta hoja con Esc ni tocando fuera. Elige una opción.',
    confirm: 'Confirmar',
    open: 'Abrir panel',
    rowA: 'Lavado exterior',
    rowB: 'Lavado en domicilio',
    rowC: 'Recogida en Copart',
  },
  en: {
    screen: 'Saved',
    reopenRemove: 'Remove from saved',
    reopenLogout: 'Log out',
    removeTitle: 'Remove from saved?',
    cancel: 'Cancel',
    remove: 'Yes, remove',
    shop: 'Full Detailing',
    shopAlt: 'Sedan with a glossy finish in the shop',
    shopMeta: 'Coral Gables · 8 min',
    unit: 'Detailing',
    from: 'From',
    logoutTitle: 'Log out',
    logoutBody: 'Are you sure you want to log out? Your bookings are kept.',
    logout: 'Yes, log out',
    optionsTitle: 'Vehicle type',
    optionsClose: 'Close vehicle type',
    apply: 'Apply',
    sedan: 'Sedan',
    suv: 'SUV or truck',
    pickup: 'Pickup',
    coupe: 'Coupe',
    van: 'Van',
    bike: 'Motorcycle',
    selected: 'Selected',
    pendingTitle: 'Confirm your pickup',
    pendingBody: 'You cannot close this sheet with Esc or by tapping outside. Choose an option.',
    confirm: 'Confirm',
    open: 'Open panel',
    rowA: 'Exterior wash',
    rowB: 'Home wash',
    rowC: 'Copart pickup',
  },
};

function ConfirmButtons({ cancel, ok, onCancel, onOk, destructive }: { cancel: string; ok: string; onCancel: () => void; onOk: () => void; destructive?: boolean }) {
  return (
    <ActionGroup>
      <Button variant="secondary" onClick={onCancel}>
        {cancel}
      </Button>
      <Button variant={destructive ? 'destructive' : 'primary'} onClick={onOk}>
        {ok}
      </Button>
    </ActionGroup>
  );
}

function InteractiveDemo({ showClose, dismissible }: { showClose?: boolean; dismissible?: boolean }) {
  const t = useT(m);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('sedan');
  const options = [
    ['sedan', t.sedan],
    ['suv', t.suv],
    ['pickup', t.pickup],
    ['coupe', t.coupe],
    ['van', t.van],
    ['bike', t.bike],
  ] as const;
  return (
    <Box sx={{ p: 4 }}>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {t.open}
      </Button>
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title={dismissible === false ? t.pendingTitle : t.optionsTitle}
        description={dismissible === false ? t.pendingBody : undefined}
        showClose={showClose}
        closeLabel={t.optionsClose}
        dismissible={dismissible}
        actions={<Button fullWidth onClick={() => setOpen(false)}>{dismissible === false ? t.confirm : t.apply}</Button>}
      >
        {dismissible !== false && (
          <ListGroup label={t.optionsTitle}>
            {options.map(([value, label], i) => (
              <ListRow key={value} inset="none" title={label} divider={i < options.length - 1} onClick={() => setType(value)} trailing={type === value ? <CheckRounded aria-label={t.selected} /> : undefined} />
            ))}
          </ListGroup>
        )}
      </BottomSheet>
    </Box>
  );
}

/** Screen behind the sheet, so the scrim and the safe area read like the product. */
function SavedScreen({ children, trigger }: { children: React.ReactNode; trigger: React.ReactNode }) {
  const t = useT(m);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <TopBar title={t.screen} onBack={() => undefined} />
      <ListGroup>
        <ListRow leading={<BookmarkBorderRounded />} title={t.rowA} description={t.shopMeta} />
        <ListRow leading={<BookmarkBorderRounded />} title={t.rowB} description={t.shopMeta} />
        <ListRow leading={<BookmarkBorderRounded />} title={t.rowC} description="Copart Miami Norte" />
      </ListGroup>
      <Box sx={{ p: `${layout.gutter.mobile}px` }}>{trigger}</Box>
      {children}
    </Box>
  );
}

function RemoveDemo() {
  const t = useT(m);
  const [open, setOpen] = useState(true);
  return (
    <SavedScreen
      trigger={
        <Button variant="secondary" fullWidth onClick={() => setOpen(true)}>
          {t.reopenRemove}
        </Button>
      }
    >
      <BottomSheet
        open={open}
        disablePortal
        onClose={() => setOpen(false)}
        title={t.removeTitle}
        actions={<ConfirmButtons cancel={t.cancel} ok={t.remove} onCancel={() => setOpen(false)} onOk={() => setOpen(false)} />}
      >
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <Box sx={{ width: 104, flexShrink: 0 }}>
            <Media alt={t.shopAlt} unit="detailing" ratio="1:1" radius="md" />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Tag label={t.unit} tone="outline" size="sm" />
            <Typography variant="h4" sx={{ mt: 1.5, overflowWrap: 'anywhere' }}>
              {t.shop}
            </Typography>
            <Typography variant="body2" sx={{ color: bs.text.secondary, mb: 1 }}>
              {t.shopMeta}
            </Typography>
            <Price amount={89} from size="md" />
          </Box>
        </Box>
      </BottomSheet>
    </SavedScreen>
  );
}

function LogoutDemo() {
  const t = useT(m);
  const [open, setOpen] = useState(true);
  return (
    <SavedScreen
      trigger={
        <Button variant="secondary" fullWidth onClick={() => setOpen(true)}>
          {t.reopenLogout}
        </Button>
      }
    >
      <BottomSheet
        open={open}
        disablePortal
        onClose={() => setOpen(false)}
        title={t.logoutTitle}
        description={t.logoutBody}
        actions={<ConfirmButtons destructive cancel={t.cancel} ok={t.logout} onCancel={() => setOpen(false)} onOk={() => setOpen(false)} />}
      />
    </SavedScreen>
  );
}

const meta = {
  title: 'Componentes/Capas y menús/Panel inferior',
  component: BottomSheet,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Hoja que sube desde el borde inferior en móvil para **confirmar algo breve** (quitar de guardados, cerrar sesión) o **elegir entre opciones** sin cambiar de pantalla.',
          anatomy: ['**Asa** de arrastre', '**Título** centrado con divisor', '**Cerrar** (opcional)', '**Descripción** (opcional)', '**Cuerpo** desplazable', '**Acciones** fijas abajo, con el área segura del dispositivo', '**Velo** (scrim) detrás'],
          props: [
            '`dismissible` (por defecto `true`): Esc, toque en el velo y arrastre hacia abajo cierran. Con `false` solo cierran las acciones de dentro: úsalo para decisiones pendientes.',
            '`showClose`: botón ✕ para hojas con contenido largo; las confirmaciones cortas ya traen Cancelar.',
            '`disablePortal` monta la hoja dentro del contenedor (marco de dispositivo, pantallas acotadas).',
            'Dos botones de igual ancho con `ActionGroup`: secundario a la izquierda, primario (o destructivo) a la derecha, como en las referencias s38 y s81.',
          ],
          states: ['Cerrado · entrando (220 ms, ease-out-expo) · abierto · arrastrando · saliendo', 'Botones y filas del cuerpo con sus propios estados'],
          tokens: [['Fondo', 'surface.raised'], ['Radio superior', 'radius.xl'], ['Velo', 'scrim'], ['Asa', 'border.strong'], ['Divisor', 'border.subtle'], ['Margen lateral', 'layout.gutter.mobile'], ['Área segura', 'layout.safeAreaBottom']],
          responsive: ['Ancho máximo 480 px centrado; altura máxima = pantalla − 48 px, el cuerpo se desplaza y las acciones quedan fijas.', 'Con el teclado abierto, el cuerpo reduce su altura y el título y las acciones se mantienen.', 'En escritorio usa **Panel lateral** o **Diálogo de confirmación**.'],
          a11y: ['`role="dialog"`, `aria-modal` y nombre = título; descripción enlazada con `aria-describedby`.', 'El foco queda atrapado, se mueve al abrir y vuelve al disparador al cerrar.', 'El arrastre es un atajo táctil: el teclado y los lectores usan Esc o el botón Cancelar/Cerrar (el asa es decorativa).', 'Lo destructivo se nombra con el verbo (“Sí, cerrar sesión”).'],
          content: [['¿Quitar de guardados? · Cancelar · Sí, quitar', 'Remove from saved? · Cancel · Yes, remove'], ['¿Seguro que quieres cerrar sesión? Tus reservas se conservan.', 'Are you sure you want to log out? Your bookings are kept.']],
          example: '**Ejemplo de negocio**: quitar un servicio de Detailing de guardados (patrón s38) y cerrar sesión (patrón s81), dentro del marco de dispositivo con el área segura.',
        }),
      },
    },
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { open: false, onClose: () => undefined, title: '' };

export const Interactive: Story = {
  name: 'Interactivo',
  args: { ...base, showClose: true, dismissible: true },
  argTypes: { open: { control: false }, onClose: { control: false }, title: { control: false }, actions: { control: false }, children: { control: false } },
  render: (args) => <InteractiveDemo showClose={args.showClose} dismissible={args.dismissible} />,
};
export const Persistent: Story = {
  name: 'Persistente (sin cierre accidental)',
  args: { ...base, showClose: false, dismissible: false },
  render: () => <InteractiveDemo showClose={false} dismissible={false} />,
};
export const RemoveFromSaved: Story = {
  name: 'Ejemplo de negocio · Quitar de guardados',
  args: base,
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
  render: () => <RemoveDemo />,
};
export const Logout: Story = {
  name: 'Ejemplo de negocio · Cerrar sesión',
  args: base,
  parameters: { layout: 'fullscreen', device: { statusBar: 'auto' } },
  render: () => <LogoutDemo />,
};
