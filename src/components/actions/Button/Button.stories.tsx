import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import EventAvailableRounded from '@mui/icons-material/EventAvailableRounded';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { Button, type ButtonProps } from './Button';

const m = {
  es: {
    book: 'Reservar',
    confirmPickup: 'Confirmar recogida',
    assign: 'Asignar operador',
    changeTime: 'Cambiar horario',
    seeDetail: 'Ver detalle',
    cancelBooking: 'Cancelar reserva',
    back: 'Volver',
    continue: 'Continuar',
    saving: 'Guardando',
    confirmBooking: 'Confirmar reserva · $89.00',
    longLabel: 'Confirmar recogida en Copart Miami Norte',
  },
  en: {
    book: 'Book',
    confirmPickup: 'Confirm pickup',
    assign: 'Assign operator',
    changeTime: 'Change time',
    seeDetail: 'View details',
    cancelBooking: 'Cancel booking',
    back: 'Back',
    continue: 'Continue',
    saving: 'Saving',
    confirmBooking: 'Confirm booking · $89.00',
    longLabel: 'Confirm pickup at Copart Miami North',
  },
};

function PlaygroundDemo(args: ButtonProps) {
  const t = useT(m);
  return <Button {...args}>{args.children ?? t.book}</Button>;
}

function VariantsDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase>
      <Specimen label={l.variants}>
        <Button variant="primary">{t.book}</Button>
        <Button variant="secondary">{t.changeTime}</Button>
        <Button variant="quiet">{t.seeDetail}</Button>
        <Button variant="destructive">{t.cancelBooking}</Button>
      </Specimen>
      <Specimen label={l.sizes}>
        <Button size="lg">{t.continue}</Button>
        <Button size="md">{t.continue}</Button>
        <Button size="sm">{t.continue}</Button>
      </Specimen>
      <Specimen label={l.withIcon}>
        <Button startIcon={<EventAvailableRounded />}>{t.book}</Button>
        <Button variant="secondary" endIcon={<ArrowForwardRounded />}>
          {t.continue}
        </Button>
      </Specimen>
    </Showcase>
  );
}

function StatesDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [loading, setLoading] = useState(false);
  return (
    <Showcase maxWidth={420}>
      <Specimen label={l.loading}>
        <Button loading>{t.saving}</Button>
        <Button
          variant="secondary"
          loading={loading}
          onClick={() => {
            setLoading(true);
            window.setTimeout(() => setLoading(false), 1600);
          }}
        >
          {t.changeTime}
        </Button>
      </Specimen>
      <Specimen label={l.disabled}>
        <Button disabled>{t.book}</Button>
        <Button variant="secondary" disabled>
          {t.changeTime}
        </Button>
        <Button variant="quiet" disabled>
          {t.seeDetail}
        </Button>
      </Specimen>
      <Specimen label={l.fullWidth} direction="column" align="stretch">
        <Button fullWidth>{t.continue}</Button>
        <Button fullWidth variant="secondary">
          {t.back}
        </Button>
      </Specimen>
      <Specimen label={l.longText} direction="column" align="stretch">
        <Button fullWidth startIcon={<LocalShippingOutlined />}>
          {t.longLabel}
        </Button>
      </Specimen>
    </Showcase>
  );
}

function BusinessDemo() {
  const t = useT(m);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: 358 }}>
      <Button fullWidth>{t.confirmBooking}</Button>
      <Button fullWidth startIcon={<LocalShippingOutlined />}>
        {t.confirmPickup}
      </Button>
      <Button size="md" variant="secondary">
        {t.assign}
      </Button>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Acciones/Botón',
  component: Button,
  args: { variant: 'primary', size: 'lg', disabled: false, loading: false, fullWidth: false },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'quiet', 'destructive'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Dispara una acción. Cada vista tiene como máximo un botón primario: es donde se concentra el naranja.',
          anatomy: ['**Contenedor** en píldora', '**Etiqueta** con verbo de acción', '**Icono** inicial o final (opcional)', '**Indicador de carga** (solo en estado cargando)'],
          props: [
            '`variant`: `primary` · `secondary` · `quiet` · `destructive`. `size`: `lg` (52 px, CTA móvil, por defecto) · `md` (44 px, escritorio y diálogos) · `sm` (36 px).',
            '`fullWidth` para el CTA de una barra de acción inferior. `href` lo convierte en enlace con aspecto de botón.',
            'No combines dos primarios en la misma vista; usa `secondary` para la alternativa.',
          ],
          states: [
            'Reposo; **hover** solo con puntero (`@media (hover: hover)`), sin hover pegajoso en táctil.',
            '**Presionado**: color `pressed` y escala 0,98.',
            '**Foco visible**: anillo de 2 px `focus.ring` con separación de 2 px.',
            '**Cargando**: `loading` mantiene el ancho, oculta la etiqueta y muestra el indicador; el botón queda deshabilitado.',
            '**Deshabilitado**: `disabled.bg` y `disabled.fg`.',
          ],
          tokens: [
            ['Fondo primario / hover / presionado', 'action.primary.bg · hover · pressed'],
            ['Texto e icono sobre naranja', 'action.primary.fg (#111111)'],
            ['Secundario', 'action.secondary.*'],
            ['Destructivo', 'action.destructive.* · text.onDestructive'],
            ['Discreto (hover / presionado)', 'action.hover · action.pressed'],
            ['Radio', 'radius.pill'],
            ['Altura', 'layout.controlHeight.sm · md · lg'],
            ['Foco', 'focus.ring'],
          ],
          responsive: [
            'Móvil: CTA a ancho completo dentro de la Barra de acción inferior. Escritorio: ancho del contenido, tamaño `md`.',
            'Las etiquetas largas se parten en dos líneas en vez de desbordar; mantén los verbos cortos.',
            'Con el teclado abierto, el CTA vive en la barra inferior pegajosa y sigue visible.',
          ],
          a11y: [
            'Nombre accesible = etiqueta visible. Un botón solo con icono usa **Botón de icono**, no este componente.',
            'Elemento `<button>` nativo (o `<a>` con `href`): Enter y Espacio lo activan; orden de foco = orden del DOM.',
            'El significado no depende del color: el destructivo lleva un verbo explícito (Cancelar reserva).',
            'Contraste: carbón sobre naranja 5,75:1; blanco sobre rojo destructivo ≥ 4,5:1.',
          ],
          content: [
            ['Reservar', 'Book'],
            ['Confirmar recogida', 'Confirm pickup'],
            ['Asignar operador', 'Assign operator'],
            ['Cancelar reserva', 'Cancel booking'],
            ['Confirmar recogida en Copart Miami Norte', 'Confirm pickup at Copart Miami North'],
          ],
          example: 'La historia **Ejemplo de negocio** muestra el CTA de una reserva de Detailing con precio, la confirmación de una recogida de Towing y la asignación desde operación.',
        }),
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: 'Interactivo', render: (args) => <PlaygroundDemo {...args} /> };
export const Variants: Story = { name: 'Variantes, tamaños e iconos', render: () => <VariantsDemo /> };
export const States: Story = { name: 'Estados', render: () => <StatesDemo /> };
export const BusinessExample: Story = { name: 'Ejemplo de negocio', render: () => <BusinessDemo /> };
