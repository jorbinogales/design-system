import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { Popover } from './Popover';

const m = {
  es: {
    trigger: 'Qué es el código de recogida',
    title: 'Código de recogida',
    body: 'Son 4 dígitos que la subasta te da al pagar el vehículo. El conductor lo muestra en la entrada para retirar el auto.',
    action: 'Ver dónde encontrarlo',
    textTrigger: '¿Qué es el lote?',
    lotTitle: 'Número de lote',
    lotBody: 'Identifica el vehículo dentro de Copart o IAA. Mantén los ceros iniciales: 04217753.',
    fee: 'Tarifa de recogida',
    feeTrigger: 'Cómo se calcula la tarifa',
    feeTitle: 'Tarifa de recogida',
    feeBody: 'Incluye hasta 25 millas desde la subasta. Cada milla adicional cuesta $2.50.',
  },
  en: {
    trigger: 'What is the pickup code',
    title: 'Pickup code',
    body: 'A 4-digit code the auction gives you when you pay for the vehicle. The driver shows it at the gate to release the car.',
    action: 'See where to find it',
    textTrigger: 'What is a lot?',
    lotTitle: 'Lot number',
    lotBody: 'Identifies the vehicle inside Copart or IAA. Keep the leading zeros: 04217753.',
    fee: 'Pickup fee',
    feeTrigger: 'How the fee is calculated',
    feeTitle: 'Pickup fee',
    feeBody: 'Covers up to 25 miles from the auction. Each extra mile is $2.50.',
  },
};

function InteractiveDemo({ placement }: { placement?: 'bottom' | 'top' }) {
  const t = useT(m);
  return (
    <Box sx={{ py: 10, px: 4 }}>
      <Popover triggerLabel={t.trigger} title={t.title} actionLabel={t.action} placement={placement}>
        {t.body}
      </Popover>
    </Box>
  );
}

function VariantsDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase maxWidth={390}>
      <Specimen label={l.iconOnly}>
        <Popover triggerLabel={t.trigger} title={t.title}>
          {t.body}
        </Popover>
      </Specimen>
      <Specimen label={`${l.withIcon} · ${l.primary}`}>
        <Popover triggerLabel={t.textTrigger} triggerText={t.textTrigger} title={t.lotTitle} actionLabel={t.action}>
          {t.lotBody}
        </Popover>
      </Specimen>
    </Showcase>
  );
}

function BusinessDemo() {
  const t = useT(m);
  return (
    <Box sx={{ width: 320, maxWidth: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, py: 3, borderBottom: `1px solid ${bs.border.subtle}` }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body1">{t.fee}</Typography>
        <Popover triggerLabel={t.feeTrigger} title={t.feeTitle}>
          {t.feeBody}
        </Popover>
      </Box>
      <Typography variant="price">$85.00</Typography>
    </Box>
  );
}

const meta = {
  title: 'Componentes/Capas y menús/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Explica **un concepto junto a donde aparece** (código de recogida, tarifa) sin sacar a la persona de la pantalla. Es informativo: no contiene formularios ni decisiones críticas.',
          anatomy: ['**Disparador**: icono de información o botón discreto con texto', '**Título**', '**Cuerpo** breve (una o dos frases)', '**Acción** única (opcional)', '**Cerrar** (táctil)'],
          props: ['`triggerLabel` es siempre obligatorio: nombra el disparador aunque sea solo un icono.', '`placement`: `bottom` (por defecto) o `top` cerca del borde inferior.', 'Con `actionLabel` se cierra al ejecutar la acción.'],
          states: ['Disparador: reposo · hover · foco visible · presionado · expandido', 'Popover abierto: foco dentro, resto de la pantalla inerte'],
          tokens: [['Fondo', 'surface.raised'], ['Borde', 'border.subtle'], ['Sombra', 'elevation.e2'], ['Radio', 'radius.md'], ['Texto', 'text.primary · text.secondary']],
          responsive: ['Ancho máximo 320 px y nunca más ancho que la pantalla menos 32 px.', 'En móvil el contenido que necesite más de un párrafo debe ir en un **Panel inferior**.'],
          a11y: ['`aria-haspopup="dialog"`, `aria-expanded` y diálogo con nombre = título.', 'Esc o clic fuera cierra y devuelve el foco al disparador; el foco queda atrapado mientras está abierto.', 'El contenido esencial no puede vivir solo aquí: es ayuda complementaria.'],
          content: [['Código de recogida · Son 4 dígitos que la subasta te da al pagar…', 'Pickup code · A 4-digit code the auction gives you when you pay…'], ['Ver dónde encontrarlo', 'See where to find it']],
          example: '**Ejemplo de negocio**: ayuda sobre la tarifa de recogida ($85.00) en el resumen de Towing, y ayuda del código de recogida y del número de lote.',
        }),
      },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: 'Interactivo',
  args: { triggerLabel: '', title: '', children: '', placement: 'bottom' },
  argTypes: { placement: { control: 'inline-radio', options: ['bottom', 'top'] }, triggerLabel: { control: false }, title: { control: false }, children: { control: false } },
  render: (args) => <InteractiveDemo placement={args.placement} />,
};
export const Variants: Story = { name: 'Disparadores', args: { triggerLabel: '', title: '', children: '' }, render: () => <VariantsDemo /> };
export const BusinessExample: Story = { name: 'Ejemplo de negocio', args: { triggerLabel: '', title: '', children: '' }, render: () => <BusinessDemo /> };
