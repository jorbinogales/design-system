import type { Meta, StoryObj } from '@storybook/react-vite';
import { getCenter } from '../../mocks/catalog';
import { getProfessional } from '../../mocks/people';
import { componentDocs } from '../../storybook/docSpec';
import { useStoryLabels } from '../../storybook/labels';
import { Showcase, Specimen } from '../../storybook/Showcase';
import { ProfessionalCard } from './ProfessionalCard';

const luis = getProfessional('pro-luis')!;

const meta = {
  title: 'Black Six/Tarjeta de profesional',
  component: ProfessionalCard,
  parameters: {
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Dice quién hará el servicio. Cuando todavía no hay nadie asignado, la variante **Pendiente de asignación** explica qué esperar para que el cliente no se quede sin información.',
          anatomy: ['**Avatar** con iniciales (o foto)', '**Nombre** y **función**', '**Insignia de asignación** (Asignada / Pendiente de asignación)', '**Calificación** (opcional)', '**Qué esperar** (solo variante pendiente)'],
          props: ['Sin `professional` se muestra la variante pendiente. `unit` ajusta el texto de “Qué esperar” a Detailing, Towing o Personal Washing.', '`awaitingNote` reemplaza el texto cuando la operación conoce la ventana exacta.', '`baseLabel` añade el centro o la base del profesional.'],
          states: ['Asignado', 'Pendiente de asignación (superficie suave, avatar sin nombre)'],
          tokens: [['Asignado', 'surface.raised · border.subtle'], ['Pendiente', 'surface.subtle'], ['Insignia', 'status.success.* / status.warning.*'], ['Texto secundario', 'text.secondary']],
          responsive: ['Ocupa el ancho del contenedor; nombre y función se envuelven sin cortarse.', 'Con textos en inglés el aviso de espera crece en altura, nunca se trunca.'],
          a11y: ['El grupo tiene nombre accesible “Profesional asignado: nombre, función”.', 'El estado va en la insignia con icono y texto, no solo en color.', 'La calificación tiene texto alternativo.'],
          content: [['Pendiente de asignación', 'Awaiting assignment'], ['Asignamos a tu detailer hasta 24 horas antes de la cita.', 'We assign your detailer up to 24 hours before the appointment.']],
          example: '**Ejemplo de negocio**: Luis Herrera (detailer senior, Black Six Doral) y la misma reserva BS-24117 antes de asignarse.',
        }),
      },
    },
  },
} satisfies Meta<typeof ProfessionalCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: 'Interactivo',
  args: { professional: luis, unit: 'detailing', baseLabel: getCenter('c-doral')?.name },
  render: (args) => (
    <Showcase maxWidth={390}>
      <ProfessionalCard {...args} />
    </Showcase>
  ),
};

export const States: Story = {
  name: 'Estados',
  args: {},
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase maxWidth={390}>
        <Specimen label="Asignado / Assigned" direction="column" align="stretch">
          <ProfessionalCard professional={luis} unit="detailing" />
        </Specimen>
        <Specimen label="Pendiente de asignación / Awaiting assignment" direction="column" align="stretch">
          <ProfessionalCard unit="detailing" />
        </Specimen>
        <Specimen label={l.longText} direction="column" align="stretch">
          <ProfessionalCard professional={getProfessional('pro-natalia')} baseLabel="Black Six Doral" />
        </Specimen>
      </Showcase>
    );
  },
};

export const BusinessExample: Story = {
  name: 'Ejemplo de negocio',
  args: {},
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase maxWidth={390}>
        <Specimen label={`${l.businessExample} · Detailing (BS-24117)`} direction="column" align="stretch">
          <ProfessionalCard unit="detailing" />
        </Specimen>
        <Specimen label={`${l.businessExample} · Towing`} direction="column" align="stretch">
          <ProfessionalCard professional={getProfessional('pro-mateo')} unit="towing" baseLabel="Black Six Doral" />
          <ProfessionalCard unit="towing" />
        </Specimen>
        <Specimen label={`${l.businessExample} · Personal Washing`} direction="column" align="stretch">
          <ProfessionalCard professional={getProfessional('pro-andres')} unit="personal-washing" />
          <ProfessionalCard unit="personal-washing" />
        </Specimen>
      </Showcase>
    );
  },
};
