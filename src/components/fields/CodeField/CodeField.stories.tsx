import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useT } from '../../../i18n/locale';
import { componentDocs } from '../../../storybook/docSpec';
import { useStoryLabels } from '../../../storybook/labels';
import { Showcase, Specimen } from '../../../storybook/Showcase';
import { CodeField } from './CodeField';

const m = {
  es: {
    otp: 'Código de verificación',
    otpHelp: 'Lo enviamos por SMS al (305) •••-0142.',
    otpError: 'El código no es correcto. Revisa el SMS o pide uno nuevo.',
    lot: 'Número de lote',
    lotHelp: 'Ocho dígitos, tal como aparece en la factura de la subasta.',
    pickup: 'Código de recogida',
    pickupHelp: 'Se presenta en la ventanilla de la subasta.',
    pickupError: 'Este código ya se usó en otra recogida.',
    plate: 'Placa',
  },
  en: {
    otp: 'Verification code',
    otpHelp: 'We texted it to (305) •••-0142.',
    otpError: "That code isn't right. Check the text or request a new one.",
    lot: 'Lot number',
    lotHelp: 'Eight digits, as shown on the auction invoice.',
    pickup: 'Pickup code',
    pickupHelp: 'Shown at the auction pickup window.',
    pickupError: 'This code was already used for another pickup.',
    plate: 'License plate',
  },
};

function OtpDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [a, setA] = useState('');
  const [b, setB] = useState('7290');
  return (
    <Showcase maxWidth={360}>
      <Specimen label={`OTP · ${l.rest}`} direction="column" align="stretch">
        <CodeField variant="otp" label={t.otp} helperText={t.otpHelp} value={a} onChange={setA} required />
      </Specimen>
      <Specimen label={`OTP · ${l.error}`} direction="column" align="stretch">
        <CodeField variant="otp" label={t.otp} error={t.otpError} value={b} onChange={setB} />
      </Specimen>
      <Specimen label={`OTP · 6 · ${l.disabled}`} direction="column" align="stretch">
        <CodeField variant="otp" length={6} label={t.otp} value="048213" onChange={() => undefined} disabled />
      </Specimen>
    </Showcase>
  );
}

function IdentifierDemo() {
  const t = useT(m);
  const l = useStoryLabels();
  const [lot, setLot] = useState('04217753');
  const [code, setCode] = useState('0093');
  const [plate, setPlate] = useState('');
  return (
    <Showcase maxWidth={360}>
      <Specimen label={`${l.businessExample} · lote (ceros iniciales)`} direction="column" align="stretch">
        <CodeField label={t.lot} helperText={t.lotHelp} value={lot} onChange={setLot} maxLength={8} required />
      </Specimen>
      <Specimen label={`${l.error} · código de recogida`} direction="column" align="stretch">
        <CodeField label={t.pickup} value={code} onChange={setCode} maxLength={6} error={t.pickupError} required />
      </Specimen>
      <Specimen label={`alfanumérico · ${l.optional}`} direction="column" align="stretch">
        <CodeField label={t.plate} charset="alphanumeric" value={plate} onChange={setPlate} maxLength={8} optional placeholder="FLX4821" />
      </Specimen>
      <Specimen label={l.readOnly} direction="column" align="stretch">
        <CodeField label={t.pickup} value="0093" onChange={() => undefined} readOnly helperText={t.pickupHelp} />
      </Specimen>
    </Showcase>
  );
}

const meta = {
  title: 'Componentes/Campos/Campo de código',
  component: CodeField,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Captura códigos: el código de verificación por SMS (casillas) y los identificadores de Towing (número de lote, código de recogida), que admiten ceros iniciales.',
          anatomy: ['**Etiqueta** propia para cada identificador', '**OTP**: una casilla por dígito', '**Identificador**: un campo con cifras tabulares y espaciado amplio, Borrar', '**Ayuda** o **error** con icono'],
          props: [
            '`variant`: `identifier` (por defecto) u `otp`. `value` y `onChange` trabajan siempre con **texto**: nunca conviertas a número.',
            'Identificador: `charset` `numeric` (por defecto) o `alphanumeric` (pasa a mayúsculas), `maxLength`.',
            'OTP: `length` (4 por defecto, como el kit). Pegar el código completo o el autocompletado por SMS rellena todas las casillas.',
            '`normalizeCode()` se exporta para validar lo mismo en otros lugares.',
          ],
          states: ['Reposo · foco (borde 2 px `selection.border`) · casilla llena (borde `border.strong`) · error · deshabilitado · solo lectura (identificador).'],
          tokens: [
            ['Casilla / campo', 'surface.subtle · border.field · selection.border (foco)'],
            ['Dígitos', 'typeScale.h2 (OTP) · typeScale.code (identificador), cifras tabulares'],
            ['Error', 'status.danger.solid · status.danger.fg'],
            ['Radio', 'radius.md'],
          ],
          responsive: ['Las casillas reparten el ancho hasta 64 px cada una; con 6 dígitos caben a 320 px.', '`inputMode="numeric"` abre el teclado numérico sin usar `type="number"`, que borraría los ceros iniciales.'],
          a11y: [
            'OTP: grupo con nombre (la etiqueta) y cada casilla anunciada como “Dígito 2 de 4”. Retroceso vuelve a la anterior; flechas mueven el foco.',
            'Primera casilla con `autocomplete="one-time-code"` para el autocompletado del sistema.',
            'Errores anunciados (`role="alert"`) con texto que dice qué hacer.',
          ],
          content: [
            ['Código de verificación', 'Verification code'],
            ['Número de lote · Código de recogida', 'Lot number · Pickup code'],
            ['El código no es correcto. Revisa el SMS o pide uno nuevo.', "That code isn't right. Check the text or request a new one."],
            ['Este código ya se usó en otra recogida.', 'This code was already used for another pickup.'],
          ],
          example: '**Identificadores** muestra el lote 04217753 y el código de recogida 0093 de un vehículo comprado en Copart: los ceros iniciales se conservan.',
        }),
      },
    },
  },
} satisfies Meta<typeof CodeField>;

export default meta;
type Story = StoryObj<typeof meta>;

const noop = { label: '', value: '', onChange: () => undefined };
export const Otp: Story = { name: 'Verificación (OTP)', args: noop, render: () => <OtpDemo /> };
export const Identifiers: Story = { name: 'Identificadores', args: noop, render: () => <IdentifierDemo /> };
