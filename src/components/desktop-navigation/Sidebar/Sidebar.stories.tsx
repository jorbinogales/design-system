import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { useLocale, useT, type Locale } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { radius } from '../../../theme/tokens';
import type { AppearanceMode } from '../../preferences/AppearanceSelect/AppearanceSelect';
import { UserMenu } from '../UserMenu/UserMenu';
import { Sidebar, useSidebarItems, type StaffRole } from './Sidebar';

const m = {
  es: {
    operator: 'Operador',
    admin: 'Administrador',
    expanded: 'Expandida',
    collapsed: 'Compacta',
    content: 'Contenido de',
    luis: 'Luis Herrera',
    carla: 'Carla Méndez',
    roles: 'Por rol: lo que ve cada persona',
    only: 'Solo administradores',
  },
  en: {
    operator: 'Operator',
    admin: 'Admin',
    expanded: 'Expanded',
    collapsed: 'Compact',
    content: 'Content of',
    luis: 'Luis Herrera',
    carla: 'Carla Méndez',
    roles: 'By role: what each person sees',
    only: 'Admins only',
  },
};

function Stage({ children, width }: { children: ReactNode; width?: number | string }) {
  return (
    <Box sx={{ display: 'flex', height: 600, width: width ?? 'auto', maxWidth: '100%', border: `1px solid ${bs.border.subtle}`, borderRadius: `${radius.lg}px`, overflow: 'hidden', backgroundColor: bs.surface.canvas }}>
      {children}
    </Box>
  );
}

function Demo({ role, startCollapsed, startValue = 'today', toggle = true }: { role: StaffRole; startCollapsed?: boolean; startValue?: string; toggle?: boolean }) {
  const t = useT(m);
  const locale = useLocale();
  const [value, setValue] = useState(startValue);
  const [collapsed, setCollapsed] = useState(Boolean(startCollapsed));
  const [language, setLanguage] = useState<Locale>(locale);
  const [appearance, setAppearance] = useState<AppearanceMode>('system');
  const items = useSidebarItems({ jobs: 3 });
  const label = items.find((i) => i.value === value)?.label;
  return (
    <Stage>
      <Sidebar
        items={items}
        role={role}
        value={value}
        onChange={setValue}
        collapsed={collapsed}
        onCollapsedChange={toggle ? setCollapsed : undefined}
        footer={
          <UserMenu
            name={role === 'admin' ? t.carla : t.luis}
            role={role}
            compact={collapsed}
            language={language}
            onLanguageChange={setLanguage}
            appearance={appearance}
            onAppearanceChange={setAppearance}
            onProfile={() => undefined}
            onLogout={() => undefined}
          />
        }
      />
      <Box sx={{ flex: 1, p: 6, display: { xs: 'none', sm: 'block' } }}>
        <Typography variant="h2" component="p" sx={{ color: bs.text.secondary }}>
          {t.content} {label}
        </Typography>
      </Box>
    </Stage>
  );
}

function InteractiveDemo({ collapsed, role }: { collapsed?: boolean; role?: StaffRole }) {
  return <Demo key={`${collapsed}-${role}`} role={role ?? 'admin'} startCollapsed={collapsed} />;
}

function VariantsDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase>
      <Specimen label={`${t.expanded} · ${l.comfortable.split(' ')[0]}`}>
        <Demo role="admin" toggle={false} />
      </Specimen>
      <Specimen label={t.collapsed}>
        <Demo role="admin" startCollapsed toggle={false} startValue="jobs" />
      </Specimen>
    </Showcase>
  );
}

function RolesDemo() {
  const t = useT(m);
  return (
    <Showcase>
      <Specimen label={`${t.operator} · Hoy, Trabajos, Agenda`}>
        <Demo role="operator" toggle={false} startValue="jobs" />
      </Specimen>
      <Specimen label={`${t.admin} · ${t.only}`}>
        <Demo role="admin" toggle={false} startValue="reports" />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Navegación de escritorio/Barra lateral',
  component: Sidebar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Navegación principal del **operador y del administrador** en escritorio. Expandida (248 px, con texto) o compacta (72 px, solo iconos), con el destino activo marcado y destinos que dependen del rol.',
          anatomy: ['**Marca** (logotipo o símbolo en compacta)', '**Destinos**: Hoy, Trabajos, Agenda · Personal, Clientes, Reportes, Configuración', '**Encabezado de grupo**: Operación / Administración (separador en compacta)', '**Insignia** de pendientes (opcional)', '**Pie**: Menú de usuario', '**Botón** contraer / expandir'],
          props: [
            '`role`: `operator` ve Hoy, Trabajos y Agenda; `admin` suma Personal, Clientes, Reportes y Configuración (`roles` por destino).',
            'Ocultar destinos es comodidad de interfaz: **cada ruta y acción debe autorizarse también en el servidor**.',
            '`collapsed` + `onCollapsedChange`: sin el segundo, no hay botón de contraer (modo fijo).',
            '`items` por defecto es `useSidebarItems()`; pasa badges como `useSidebarItems({ jobs: 3 })`.',
          ],
          states: ['Destino: reposo · hover (puntero) · foco visible · presionado · **activo** (fondo `selection.bg`, indicador naranja, icono relleno, negrita)', 'Compacta: nombre en tooltip (hover y foco) y en `aria-label`'],
          tokens: [['Fondo', 'surface.subtle'], ['Borde derecho', 'border.subtle'], ['Activo', 'selection.bg · brand.primary (indicador)'], ['Hover / presionado', 'action.hover · action.pressed'], ['Foco', 'focus.ring'], ['Alto de destino', '44 px']],
          responsive: ['Solo escritorio (≥ 900 px). En tabletas conviene arrancar compacta; en móvil el operador usa **Navegación inferior**.', 'La transición de ancho dura 150 ms y se reduce con `prefers-reduced-motion`.', 'Etiquetas largas hacen salto de línea completo en expandida.'],
          a11y: ['`nav` con nombre “Navegación del operador”; lista de enlaces/botones.', 'Destino actual con `aria-current="page"`; el estado activo no depende solo del color (negrita, icono relleno, indicador).', 'Compacta: cada botón conserva su nombre accesible (y la cantidad pendiente) y muestra tooltip.', 'El botón contraer tiene nombre y `aria-expanded`; todo es alcanzable por teclado.'],
          content: [['Hoy · Trabajos · Agenda · Personal · Clientes · Reportes · Configuración', 'Today · Jobs · Schedule · Staff · Customers · Reports · Settings'], ['Contraer barra lateral', 'Collapse sidebar']],
          example: '**Ejemplo de negocio**: Luis Herrera (operador) ve tres destinos; Carla Méndez (administradora) ve siete. Trabajos muestra 3 pendientes de asignación.',
        }),
      },
    },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { value: 'today', onChange: () => undefined, role: 'admin' as StaffRole };

export const Interactive: Story = {
  name: 'Interactivo',
  args: { ...base, collapsed: false },
  argTypes: { value: { control: false }, onChange: { control: false }, items: { control: false }, footer: { control: false }, onCollapsedChange: { control: false }, role: { control: 'inline-radio', options: ['operator', 'admin'] } },
  render: (args) => <InteractiveDemo collapsed={args.collapsed} role={args.role} />,
};
export const Variants: Story = { name: 'Expandida y compacta', args: base, render: () => <VariantsDemo /> };
export const BusinessExample: Story = { name: 'Ejemplo de negocio · Por rol', args: base, render: () => <RolesDemo /> };
