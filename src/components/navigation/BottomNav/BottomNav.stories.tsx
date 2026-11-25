import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';
import { BottomNav, type NavSide } from './BottomNav';

const m = {
  es: { client: 'Inicio del cliente', operator: 'Agenda de hoy · 6 trabajos' },
  en: { client: 'Customer home', operator: "Today's schedule · 6 jobs" },
};

function NavDemo({ side }: { side: NavSide }) {
  const t = useT(m);
  const [value, setValue] = useState(side === 'client' ? 'home' : 'today');
  return (
    <>
      <Box sx={{ pt: `calc(${layout.safeAreaTop} + 24px)`, px: `${layout.gutter.mobile}px`, flex: 1 }}>
        <Typography variant="h1">{side === 'client' ? t.client : t.operator}</Typography>
        <Typography variant="body2" sx={{ color: bs.text.secondary, mt: 2 }}>
          {value}
        </Typography>
      </Box>
      <BottomNav side={side} value={value} onChange={setValue} badges={side === 'client' ? { chat: 2 } : { messages: true }} />
    </>
  );
}

const meta = {
  title: 'Componentes/Navegación móvil/Navegación inferior',
  component: BottomNav,
  args: { side: 'client', value: 'home' },
  argTypes: { side: { control: 'inline-radio', options: ['client', 'operator'] } },
  parameters: {
    layout: 'fullscreen',
    device: {},
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Cambia entre las secciones principales de la app móvil. Cliente y operador tienen destinos distintos.',
          anatomy: ['**Barra** elevada con borde superior', '**Destinos** (4–5): icono + etiqueta siempre visibles', '**Píldora activa** naranja suave detrás del icono', '**Insignia** de punto o contador (opcional)', '**Relleno inferior** del área segura'],
          props: [
            'Destinos decididos — **cliente** (`side="client"`): Inicio · Explorar · Reservas · Chat · Perfil. **Operador** (`side="operator"`): Hoy · Trabajos · Mensajes · Perfil.',
            'El operador no tiene Explorar ni reservas propias: su trabajo diario vive en Hoy y Trabajos.',
            '`badges` añade insignias sin redefinir los destinos: `{ chat: 2 }`. `destinations` permite una lista propia; `useNavDestinations(side)` devuelve los presets traducidos.',
          ],
          states: ['Reposo: icono de contorno y `text.secondary`.', 'Activo: icono relleno, etiqueta en `text.primary` 700 y píldora `selection.bg`.', 'Foco visible: anillo interior.', 'Presionado: sin onda (ripple desactivado en todo el sistema).'],
          tokens: [
            ['Fondo', 'surface.raised'],
            ['Borde superior', 'border.subtle'],
            ['Inactivo', 'text.secondary'],
            ['Activo', 'text.primary · selection.bg (píldora)'],
            ['Insignia', 'brand.primary · action.primary.fg'],
            ['Altura', 'layout.bottomNavHeight (64 px) + layout.safeAreaBottom'],
          ],
          responsive: ['Solo móvil y tableta; en escritorio el operador usa la barra lateral (Fase 2).', 'Etiquetas cortas por diseño; “Mensajes” y “Messages” caben a 320 px.', 'Se oculta cuando el teclado está abierto en flujos de formulario (la pantalla decide no renderizarla).'],
          a11y: ['`<nav aria-label="Navegación principal">`; el destino activo lleva `aria-current="page"`.', 'El estado activo cambia forma (icono relleno + píldora) y peso, no solo color.', 'Las insignias numéricas deben acompañarse de texto en la pantalla destino.'],
          content: [
            ['Inicio · Explorar · Reservas · Chat · Perfil', 'Home · Explore · Bookings · Chat · Profile'],
            ['Hoy · Trabajos · Mensajes · Perfil', 'Today · Jobs · Messages · Profile'],
          ],
          example: '**Cliente** con 2 mensajes sin leer en Chat; **Operador** con aviso en Mensajes sobre la agenda de hoy.',
        }),
      },
    },
  },
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Client: Story = { name: 'Cliente', render: () => <NavDemo side="client" /> };
export const Operator: Story = { name: 'Operador', render: () => <NavDemo side="operator" /> };
