import type { Meta, StoryObj } from '@storybook/react-vite';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { PasswordField } from './PasswordField';

const m = {
  es: { newLabel: 'Nueva contraseña', help: 'Mínimo 8 caracteres, con al menos un número.', error: 'La contraseña no coincide con la de tu cuenta.' },
  en: { newLabel: 'New password', help: 'At least 8 characters, including a number.', error: "That password doesn't match your account." },
};

function AllDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  return (
    <Showcase maxWidth={390}>
      <Specimen label={`${l.rest} · current`} direction="column" align="stretch">
        <PasswordField required />
      </Specimen>
      <Specimen label="new · helper" direction="column" align="stretch">
        <PasswordField label={t.newLabel} purpose="new" helperText={t.help} required />
      </Specimen>
      <Specimen label={l.error} direction="column" align="stretch">
        <PasswordField defaultValue="detailing2024" error={t.error} required />
      </Specimen>
      <Specimen label={l.disabled} direction="column" align="stretch">
        <PasswordField defaultValue="contraseña" disabled />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Campos/Contraseña',
  component: PasswordField,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Contraseña para acceso con clave (solo si el negocio habilita ese método además del código por SMS).',
          anatomy: ['**Etiqueta** “Contraseña”', '**Campo** enmascarado', '**Botón mostrar/ocultar**', '**Ayuda** con requisitos (opcional)'],
          props: ['`purpose`: `current` (inicio de sesión) o `new` (registro, restablecer) para que el gestor de contraseñas actúe bien.'],
          states: ['Los de Campo de texto + conmutador visible/oculto (`aria-pressed`).'],
          tokens: [
            ['Campo', 'tokens de Campo de texto'],
            ['Icono del conmutador', 'text.secondary'],
          ],
          responsive: ['Igual en todos los tamaños. El conmutador mantiene 44 px de área táctil.'],
          a11y: ['El conmutador se nombra por su acción (“Mostrar contraseña”) y expone su estado; el icono cambia de ojo a ojo tachado.', 'Requisitos en la ayuda, enlazados con `aria-describedby`.'],
          content: [
            ['Mostrar contraseña · Ocultar contraseña', 'Show password · Hide password'],
            ['Mínimo 8 caracteres, con al menos un número.', 'At least 8 characters, including a number.'],
            ['La contraseña no coincide con la de tu cuenta.', "That password doesn't match your account."],
          ],
          example: 'En **Todas las variantes**: inicio de sesión del cliente y creación de contraseña nueva.',
        }),
      },
    },
  },
} satisfies Meta<typeof PasswordField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = { name: 'Todas las variantes', render: () => <AllDemo /> };
