import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { Button } from '../../actions/Button/Button';
import { FilterChipGroup } from '../../selection/FilterChip/FilterChip';
import { FieldMessage, type FieldMessageTone } from './FieldMessage';

const m = {
  es: {
    hint: 'Llegamos 15 minutos antes de la hora elegida.',
    error: 'Elige una hora disponible para continuar.',
    success: 'Horario reservado por 10 minutos.',
    warning: 'Quedan pocos horarios para este día.',
    info: 'Los horarios están en hora del Este (Miami).',
    slots: 'Horarios disponibles',
    s1: '9:00 a. m.',
    s2: '11:30 a. m.',
    s3: '2:00 p. m.',
    s4: '4:30 p. m.',
    pickedOk: 'Horario reservado por 10 minutos.',
    next: 'Continuar',
  },
  en: {
    hint: 'We arrive 15 minutes before the chosen time.',
    error: 'Choose an available time to continue.',
    success: 'Time held for 10 minutes.',
    warning: 'Few time slots left for this day.',
    info: 'Times are in Eastern time (Miami).',
    slots: 'Available times',
    s1: '9:00 AM',
    s2: '11:30 AM',
    s3: '2:00 PM',
    s4: '4:30 PM',
    pickedOk: 'Time held for 10 minutes.',
    next: 'Continue',
  },
};

function InteractiveDemo({ tone, live }: { tone?: FieldMessageTone; live?: boolean }) {
  const t = useT(m);
  return (
    <Box sx={{ width: 340, maxWidth: '100%' }}>
      <FieldMessage tone={tone} live={live}>
        {t[tone ?? 'hint']}
      </FieldMessage>
    </Box>
  );
}

function VariantsDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase maxWidth={340}>
      <Specimen label={l.variants} direction="column" align="stretch" gap={4}>
        {(['hint', 'error', 'success', 'warning', 'info'] as const).map((tone) => (
          <FieldMessage key={tone} tone={tone} live={false}>
            {t[tone]}
          </FieldMessage>
        ))}
      </Specimen>
    </Showcase>
  );
}

function BusinessDemo() {
  const t = useT(m);
  const [slot, setSlot] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const options = [
    { value: 's1', label: t.s1 },
    { value: 's2', label: t.s2 },
    { value: 's3', label: t.s3 },
    { value: 's4', label: t.s4 },
  ];
  return (
    <Box sx={{ width: 340, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <FilterChipGroup selectionMode="single" label={t.slots} options={options} value={slot} onChange={setSlot} overflow="wrap" />
      {slot ? <FieldMessage tone="success">{t.pickedOk}</FieldMessage> : touched ? <FieldMessage tone="error">{t.error}</FieldMessage> : <FieldMessage tone="hint" live={false}>{t.hint}</FieldMessage>}
      <Button size="md" onClick={() => setTouched(true)} sx={{ alignSelf: 'flex-start' }}>
        {t.next}
      </Button>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Feedback/Mensaje de campo',
  component: FieldMessage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Mensaje **suelto** bajo un grupo de controles (franjas horarias, un par fecha + hora, un grupo de opciones) donde el texto de ayuda de un solo campo no alcanza.',
          anatomy: ['**Icono** pequeño (salvo en la ayuda neutra)', '**Texto** de una o dos líneas'],
          props: ['`tone`: `hint` (ayuda neutra), `error`, `success`, `warning`, `info`.', '`live`: por defecto solo los errores se anuncian (`role="alert"`). Pon `false` si ya estaba en pantalla al cargar.', '`id` para enlazarlo con `aria-describedby` del grupo.'],
          states: ['Visible · oculto (se monta al aparecer, no se reserva espacio)', 'Cambio de tono al validar'],
          tokens: [['Texto y icono', 'status.{tono}.fg · text.secondary (ayuda)'], ['Tipografía', 'typeScale.body2'], ['Separación', 'space 6 px icono–texto']],
          responsive: ['Ocupa el ancho del grupo; el texto hace salto de línea completo, sin truncar.'],
          a11y: ['Siempre icono + texto: el significado no depende del color.', 'El error usa `role="alert"` y se anuncia al aparecer; éxito, aviso e información usan `role="status"` cuando `live` está activo.', 'Enlázalo con `aria-describedby` desde el grupo para que se lea con él.', 'Contraste de `status.*.fg` sobre el lienzo verificado en ambos temas.'],
          content: [['Elige una hora disponible para continuar.', 'Choose an available time to continue.'], ['Llegamos 15 minutos antes de la hora elegida.', 'We arrive 15 minutes before the chosen time.']],
          example: '**Ejemplo de negocio**: selector de horario de un Detailing: ayuda neutra, error si se intenta seguir sin elegir y confirmación “Horario reservado por 10 minutos”.',
        }),
      },
    },
  },
} satisfies Meta<typeof FieldMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: 'Interactivo',
  args: { children: '', tone: 'error', live: true },
  argTypes: { tone: { control: 'inline-radio', options: ['hint', 'error', 'success', 'warning', 'info'] }, children: { control: false } },
  render: (args) => <InteractiveDemo tone={args.tone} live={args.live} />,
};
export const Tones: Story = { name: 'Tonos', args: { children: '' }, render: () => <VariantsDemo /> };
export const BusinessExample: Story = { name: 'Ejemplo de negocio', args: { children: '' }, render: () => <BusinessDemo /> };
