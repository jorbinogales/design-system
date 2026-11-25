import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { Button } from '../Button/Button';
import { ActionGroup } from './ActionGroup';

const m = {
  es: {
    reset: 'Restablecer',
    apply: 'Aplicar filtros',
    keep: 'Mantener reserva',
    cancel: 'Cancelar reserva',
    later: 'Ahora no',
    allow: 'Permitir ubicación',
    discard: 'Descartar',
    save: 'Guardar cambios',
    actionsLabel: 'Acciones del filtro',
  },
  en: {
    reset: 'Reset',
    apply: 'Apply filters',
    keep: 'Keep booking',
    cancel: 'Cancel booking',
    later: 'Not now',
    allow: 'Allow location',
    discard: 'Discard',
    save: 'Save changes',
    actionsLabel: 'Filter actions',
  },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase maxWidth={560}>
      <Specimen label="inline · stretch" direction="column" align="stretch">
        <ActionGroup label={t.actionsLabel}>
          <Button variant="secondary">{t.reset}</Button>
          <Button>{t.apply}</Button>
        </ActionGroup>
      </Specimen>
      <Specimen label="stacked" direction="column" align="stretch">
        <ActionGroup layout="stacked">
          <Button>{t.allow}</Button>
          <Button variant="quiet">{t.later}</Button>
        </ActionGroup>
      </Specimen>
      <Specimen label="responsive · end" direction="column" align="stretch">
        <ActionGroup layout="responsive" align="end">
          <Button size="md" variant="quiet">
            {t.discard}
          </Button>
          <Button size="md">{t.save}</Button>
        </ActionGroup>
      </Specimen>
      <Specimen label={l.businessExample} direction="column" align="stretch">
        <ActionGroup layout="stacked">
          <Button variant="destructive">{t.cancel}</Button>
          <Button variant="secondary">{t.keep}</Button>
        </ActionGroup>
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Acciones/Grupo de acciones',
  component: ActionGroup,
  args: { layout: 'inline', align: 'stretch', children: null },
  argTypes: {
    layout: { control: 'inline-radio', options: ['inline', 'stacked', 'responsive'] },
    align: { control: 'inline-radio', options: ['start', 'end', 'center', 'stretch'] },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Agrupa acciones relacionadas con separación y orden consistentes: pies de filtros, diálogos de confirmación y formularios.',
          anatomy: ['**Contenedor** flexible', '**Acciones** (Botón; normalmente 2, máximo 3)', '`role="group"` con nombre (opcional, prop `label`)'],
          props: ['`layout`: `inline` · `stacked` · `responsive`. `align`: `stretch` reparte el ancho por igual.', 'Orden del DOM: en `inline` la secundaria va primero y la primaria al final (derecha); en `stacked` la primaria va arriba.'],
          states: ['No tiene estados propios; cada Botón conserva los suyos.'],
          tokens: [
            ['Separación', 'space.sm (12 px)'],
            ['Acciones', 'tokens de Botón'],
          ],
          responsive: ['`responsive` apila en móvil y alinea en fila desde 600 px.', 'Etiquetas largas: en `inline` con dos botones, si alguna supera ~18 caracteres usa `stacked`.'],
          a11y: ['El orden de foco sigue el orden del DOM, que coincide con el visual (sin `row-reverse`).', 'Usa `label` cuando el grupo necesite contexto (“Acciones del filtro”).'],
          content: [
            ['Restablecer · Aplicar filtros', 'Reset · Apply filters'],
            ['Cancelar reserva · Mantener reserva', 'Cancel booking · Keep booking'],
            ['Permitir ubicación · Ahora no', 'Allow location · Not now'],
          ],
          example: 'El **Ejemplo de negocio** es la confirmación de cancelación de una reserva de Personal Washing: destructiva arriba y salida segura debajo.',
        }),
      },
    },
  },
} satisfies Meta<typeof ActionGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = { name: 'Disposiciones', render: () => <AllDemo /> };
