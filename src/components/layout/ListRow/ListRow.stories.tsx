import CreditCardRounded from '@mui/icons-material/CreditCardRounded';
import HelpOutlineRounded from '@mui/icons-material/HelpOutlineRounded';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import NotificationsNoneRounded from '@mui/icons-material/NotificationsNoneRounded';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { InitialsAvatar } from '../../data-display/InitialsAvatar/InitialsAvatar';
import { StatusBadge } from '../../data-display/StatusBadge/StatusBadge';
import { ListGroup, ListRow } from './ListRow';

const m = {
  es: {
    profileList: 'Opciones de la cuenta',
    payments: 'Métodos de pago',
    paymentsDesc: 'Visa •••• 4821',
    addresses: 'Direcciones guardadas',
    addressesDesc: 'Casa · 2150 NW 87th Ave, Doral',
    notifications: 'Avisos de llegada',
    help: 'Centro de ayuda',
    logout: 'Cerrar sesión',
    teamList: 'Personal disponible',
    member1: 'Luis Herrera',
    member1Desc: 'Grúa plataforma · 2 trabajos hoy',
    member2: 'Pendiente de asignación',
    member2Desc: 'Recogida IAA Fort Lauderdale · 1:00 p. m.',
    disabled: 'Wallet (próximamente)',
  },
  en: {
    profileList: 'Account options',
    payments: 'Payment methods',
    paymentsDesc: 'Visa •••• 4821',
    addresses: 'Saved addresses',
    addressesDesc: 'Home · 2150 NW 87th Ave, Doral',
    notifications: 'Arrival alerts',
    help: 'Help center',
    logout: 'Log out',
    teamList: 'Available staff',
    member1: 'Luis Herrera',
    member1Desc: 'Flatbed tow truck · 2 jobs today',
    member2: 'Awaiting assignment',
    member2Desc: 'IAA Fort Lauderdale pickup · 1:00 PM',
    disabled: 'Wallet (coming soon)',
  },
};

function ProfileDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [alerts, setAlerts] = useState(true);
  return (
    <Box sx={{ width: 390, maxWidth: '100%' }}>
      <Showcase>
        <Specimen label={`${l.comfortable} · navegable / estática`} direction="column" align="stretch">
          <ListGroup label={t.profileList}>
            <ListRow leading={<CreditCardRounded />} title={t.payments} description={t.paymentsDesc} href="#pagos" />
            <ListRow leading={<LocationOnOutlined />} title={t.addresses} description={t.addressesDesc} onClick={() => undefined} />
            <ListRow
              leading={<NotificationsNoneRounded />}
              title={t.notifications}
              trailing={<Switch checked={alerts} onChange={(_, v) => setAlerts(v)} slotProps={{ input: { 'aria-label': t.notifications } }} />}
            />
            <ListRow leading={<HelpOutlineRounded />} title={t.help} href="#ayuda" />
            <ListRow leading={<CreditCardRounded />} title={t.disabled} href="#wallet" disabled />
            <ListRow leading={<LogoutRounded />} title={t.logout} onClick={() => undefined} destructive divider={false} />
          </ListGroup>
        </Specimen>
        <Specimen label={`${l.compact} · ${l.businessExample}`} direction="column" align="stretch">
          <Box sx={{ border: `1px solid ${bs.border.subtle}`, borderRadius: 4, px: 4 }}>
            <ListGroup label={t.teamList}>
              <ListRow density="compact" inset="none" leading={<InitialsAvatar name={t.member1} size="sm" />} title={t.member1} description={t.member1Desc} trailing={<StatusBadge dimension="assignment" status="assigned" size="sm" />} onClick={() => undefined} />
              <ListRow density="compact" inset="none" divider={false} leading={<InitialsAvatar size="sm" />} title={t.member2} description={t.member2Desc} trailing={<StatusBadge dimension="assignment" status="unassigned" size="sm" />} />
            </ListGroup>
          </Box>
        </Specimen>
      </Showcase>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Estructura/Fila de lista',
  component: ListRow,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Una fila de una lista: puede **abrir un detalle** (navegable, con chevron) o **mostrar información** (estática).',
          anatomy: ['**Inicio**: icono, avatar o miniatura (opcional)', '**Título** y **descripción** (opcional)', '**Final**: valor, insignia, interruptor o precio (opcional)', '**Chevron** (automático si es navegable)', '**Divisor** inferior'],
          props: [
            'Navegable con `href` (enlace) u `onClick` (botón). Sin ambos es estática.',
            'Usa `<ListGroup label>` como contenedor (`<ul>`); `as="div"` para una fila suelta.',
            '`density`: `comfortable` 64 px (cliente) · `compact` 44 px (escritorio). `inset="none"` dentro de una Tarjeta.',
            'Si el final es un control (interruptor), deja la fila estática: un control no va dentro de otro.',
          ],
          states: ['Navegable: reposo · hover `action.hover` (puntero) · presionado `action.pressed` · foco interior · deshabilitado.', 'Destructiva: título e icono en `status.danger.fg`.'],
          tokens: [
            ['Título / descripción', 'text.primary · text.secondary'],
            ['Hover / presionado', 'action.hover · action.pressed'],
            ['Divisor', 'border.subtle'],
            ['Altura mínima', 'density.comfortable.rowMinHeight 64 · compact 44'],
            ['Margen lateral', 'layout.gutter.mobile'],
          ],
          responsive: ['Títulos y direcciones largas hacen salto de línea completo (el personal debe leer la dirección entera).', 'Escritorio: `compact` en paneles y tablas.'],
          a11y: ['La fila navegable es un único enlace/botón; su nombre es todo el texto de la fila.', 'Chevron decorativo (`aria-hidden`).', 'Destructiva se reconoce por el verbo (“Cerrar sesión”), no solo por el rojo.'],
          content: [
            ['Métodos de pago · Visa •••• 4821', 'Payment methods · Visa •••• 4821'],
            ['Pendiente de asignación', 'Awaiting assignment'],
            ['Cerrar sesión', 'Log out'],
          ],
          example: 'En **Perfil y personal**: el menú de perfil del cliente y la lista compacta de personal de Towing con su estado de asignación.',
        }),
      },
    },
  },
} satisfies Meta<typeof ListRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProfileAndStaff: Story = { name: 'Perfil y personal', args: { title: '' }, render: () => <ProfileDemo /> };
