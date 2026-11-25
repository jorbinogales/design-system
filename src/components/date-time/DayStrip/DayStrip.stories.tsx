import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import type { DayState } from '../Calendar/Calendar';
import { DayStrip } from './DayStrip';

const TODAY = dayjs('2026-11-25');

const m = {
  es: { label: 'Día de la recogida', service: 'Personal Washing · Lavado a mano', where: 'Doral, FL · te lavamos donde estés', states: 'Día disponible, completo, cerrado y sin horario', scroll: 'Catorce días con desplazamiento horizontal' },
  en: { label: 'Pickup day', service: 'Personal Washing · Hand wash', where: 'Doral, FL · we wash wherever you are', states: 'Available, full, closed and no-slots days', scroll: 'Fourteen days, horizontal scroll' },
};

/** Sunday closed, Friday the 27th full, the 30th without slots. */
const stateOf = (d: Dayjs): DayState => (d.day() === 0 ? 'closed' : d.isSame('2026-11-27', 'day') ? 'full' : d.isSame('2026-11-30', 'day') ? 'none' : 'available');

function Demo({ business = false, count = 14 }: { business?: boolean; count?: number }) {
  const t = useT(m);
  const [value, setValue] = useState<Dayjs | null>(TODAY);
  return (
    <Box sx={{ width: 390, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {business && (
        <Box>
          <Typography variant="h3">{t.service}</Typography>
          <Typography variant="body2" sx={{ color: bs.text.secondary }}>
            {t.where}
          </Typography>
        </Box>
      )}
      <DayStrip label={t.label} start={TODAY} count={count} today={TODAY} value={value} onChange={setValue} getDayState={business ? stateOf : undefined} />
    </Box>
  );
}

function StatesDemo() {
  const t = useT(m);
  return (
    <Showcase maxWidth={390}>
      <Specimen label={t.states} direction="column" align="stretch">
        <DayStrip label={t.label} start={TODAY.add(1, 'day')} count={6} today={TODAY} value={TODAY.add(2, 'day')} onChange={() => undefined} getDayState={stateOf} />
      </Specimen>
      <Specimen label={t.scroll} direction="column" align="stretch">
        <DayStrip label={t.label} start={TODAY} count={14} today={TODAY} value={null} onChange={() => undefined} />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Fecha y hora/Selector de día',
  component: DayStrip,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Franja horizontal de días para elegir una fecha cercana con un toque: **Hoy**, **Mañana**, **jue 27**… Más rápido que abrir un calendario cuando solo importan las próximas dos semanas.',
          anatomy: ['**Grupo** con nombre y desplazamiento horizontal', '**Día**: etiqueta (Hoy / Mañana / día de la semana), número y línea de estado', '**Marca de selección** (check) en el día elegido'],
          props: ['`start` + `count` definen el rango; `today` fija el “Hoy” de referencia.', '`getDayState` marca días `full`, `closed` o `none`; se ven pero no se eligen.'],
          states: ['Reposo (`surface.subtle`) · hover (puntero) · foco visible · seleccionado (fondo naranja suave, borde naranja y check) · completo (borde discontinuo, número tachado y texto “Completo”) · cerrado · sin horario.'],
          tokens: [
            ['Reposo', 'surface.subtle · border.subtle'],
            ['Seleccionado', 'selection.bg · selection.border'],
            ['No disponible', 'text.secondary · text.disabled'],
            ['Radio', 'radius.md'],
            ['Alto mínimo', '80 px (objetivo táctil ≥ 44 px)'],
          ],
          responsive: ['Móvil: una fila con desplazamiento táctil y alineación por día; se ve parte del siguiente día para sugerir que se puede deslizar.', 'Escritorio: se mantiene en una fila; las flechas del teclado recorren los días.'],
          a11y: [
            '`role="radiogroup"` con un solo tab stop; flechas, Inicio y Fin mueven la selección, como un grupo de radios nativo.',
            'Nombre accesible completo: “Hoy, miércoles 25 de noviembre, disponible”.',
            'Los días no disponibles usan `aria-disabled` y se saltan con el teclado.',
            'Completo, cerrado y sin horario se dicen con texto, forma y borde discontinuo, no solo con color.',
          ],
          content: [
            ['Hoy · Mañana · jue 27 · Completo · Cerrado · Sin horario', 'Today · Tomorrow · Thu 27 · Full · Closed · No slots'],
          ],
          example: '**Ejemplo de negocio**: Personal Washing en Doral. El domingo está cerrado, el viernes 27 completo y el lunes 30 sin horario.',
        }),
      },
    },
  },
} satisfies Meta<typeof DayStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { label: '', start: TODAY, value: null, onChange: () => undefined };

export const Interactive: Story = {
  name: 'Interactivo',
  args: { ...base, count: 14 },
  render: (args) => <Demo count={args.count} />,
};

export const States: Story = { name: 'Estados', args: base, render: () => <StatesDemo /> };

export const BusinessExample: Story = { name: 'Ejemplo de negocio', args: base, render: () => <Demo business /> };
