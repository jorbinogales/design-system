import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { bs } from '../../../theme/theme';
import { Link, type LinkProps } from './Link';

const m = {
  es: {
    seeAll: 'Ver todo',
    seeDetail: 'Ver detalle',
    changeTime: 'Cambiar horario',
    terms: 'términos del servicio',
    sentence: 'Al reservar aceptas los',
    sentenceEnd: 'de Black Seat.',
    auction: 'Abrir ficha del lote en Copart',
    forgot: '¿Olvidaste tu contraseña?',
  },
  en: {
    seeAll: 'See all',
    seeDetail: 'View details',
    changeTime: 'Change time',
    terms: 'terms of service',
    sentence: 'By booking you accept the Black Seat',
    sentenceEnd: '.',
    auction: 'Open lot page on Copart',
    forgot: 'Forgot your password?',
  },
};

function PlaygroundDemo(args: LinkProps) {
  const t = useT(m);
  return <Link {...args}>{args.children ?? t.seeDetail}</Link>;
}

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase maxWidth={480}>
      <Specimen label="Inline">
        <Typography variant="body1" sx={{ color: bs.text.secondary }}>
          {t.sentence}{' '}
          <Link href="#terminos">{t.terms}</Link>
          {t.sentenceEnd}
        </Typography>
      </Specimen>
      <Specimen label="Standalone">
        <Link variant="standalone" href="#todo">
          {t.seeAll}
        </Link>
        <Link variant="standalone" onClick={() => undefined}>
          {t.changeTime}
        </Link>
        <Link variant="standalone" size="sm" href="#recuperar">
          {t.forgot}
        </Link>
      </Specimen>
      <Specimen label={l.businessExample}>
        <Link variant="standalone" external href="https://www.copart.com">
          {t.auction}
        </Link>
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Acciones/Enlace',
  component: Link,
  args: { variant: 'standalone', size: 'md', external: false, href: '#detalle' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['inline', 'standalone'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Navega a otra vista o abre información secundaria (Ver detalle, Cambiar horario, Ver todo). Para acciones que cambian datos usa Botón.',
          anatomy: ['**Texto** del enlace', '**Subrayado** (siempre en `inline`, al pasar el cursor en `standalone`)', '**Icono de enlace externo** + texto oculto (solo `external`)'],
          props: ['Con `href` renderiza `<a>`; solo con `onClick` renderiza `<button>`.', '`external` añade `target="_blank"`, `rel="noopener noreferrer"`, icono y aviso para lectores de pantalla.'],
          states: ['Reposo', 'Hover: subrayado de 2 px (solo puntero)', 'Foco visible: anillo `focus.ring` con radio 4 px', 'Visitado: sin cambio de color (la app no lo necesita)'],
          tokens: [
            ['Texto', 'text.link (#B33700 · #FF8A55)'],
            ['Subrayado', 'currentColor, grosor 1 → 2 px, separación 0,2 em'],
            ['Tipografía', 'typeScale.body1 · body2, peso 600'],
            ['Foco', 'focus.ring'],
          ],
          responsive: ['Igual en móvil y escritorio. `sm` para enlaces auxiliares bajo un campo.', 'Textos largos hacen salto de línea normal; el subrayado sigue al texto.'],
          a11y: [
            'El texto del enlace describe el destino; evita “aquí”.',
            'Se distingue del texto por peso 600 y subrayado, no solo por color (WCAG 1.4.1).',
            'Enlaces externos anuncian “(se abre en otra pestaña)”.',
          ],
          content: [
            ['Ver todo', 'See all'],
            ['Cambiar horario', 'Change time'],
            ['¿Olvidaste tu contraseña?', 'Forgot your password?'],
            ['Abrir ficha del lote en Copart', 'Open lot page on Copart'],
          ],
          example: 'En **Todas las variantes**, un operador de Towing abre la ficha del lote en la web de la subasta (enlace externo).',
        }),
      },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: 'Interactivo', render: (args) => <PlaygroundDemo {...args} /> };
export const AllVariants: Story = { name: 'Todas las variantes', render: () => <AllDemo /> };
