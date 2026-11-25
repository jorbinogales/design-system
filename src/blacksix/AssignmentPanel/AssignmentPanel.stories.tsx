import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../../components/actions/Button/Button';
import { useT } from '../../i18n/locale';
import { getJob, todayJobs } from '../../mocks/bookings';
import { professionals } from '../../mocks/people';
import { componentDocs } from '../../storybook/docSpec';
import { useStoryLabels } from '../../storybook/labels';
import { Showcase, Specimen } from '../../storybook/Showcase';
import { AssignmentPanel } from './AssignmentPanel';

const m = {
  es: { open: 'Abrir panel de asignación', done: (n: string) => `Asignado a ${n} (simulado).` },
  en: { open: 'Open assignment panel', done: (n: string) => `Assigned to ${n} (simulated).` },
};

function Demo({ jobId, preselect = null }: { jobId: string; preselect?: string | null }) {
  const t = useT(m);
  const job = getJob(jobId)!;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(preselect);
  const [msg, setMsg] = useState('');
  return (
    <Showcase maxWidth={420}>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {t.open}
      </Button>
      {msg && <span role="status">{msg}</span>}
      <AssignmentPanel
        open={open}
        onClose={() => setOpen(false)}
        job={job}
        professionals={professionals}
        jobs={todayJobs}
        value={value}
        onChange={setValue}
        onConfirm={(id) => {
          setMsg(t.done(professionals.find((p) => p.id === id)!.name));
          setOpen(false);
        }}
      />
    </Showcase>
  );
}

const meta = {
  title: 'Black Six/Panel de asignación',
  component: AssignmentPanel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: componentDocs({
          purpose: 'Asignar o reasignar un trabajo: muestra el trabajo y su horario, el responsable actual, el personal disponible, los **conflictos** y la confirmación del cambio. Abre como panel lateral en escritorio y como página en móvil.',
          anatomy: ['**Trabajo y horario** (inicio–fin estimado, ubicación, lote en Towing)', '**Responsable actual**', '**Personal disponible** (selección única; bloqueados y su motivo)', '**Aviso de conflicto** (`InlineAlert`): solapamiento con otro trabajo', '**Confirmación del cambio** (de quién a quién)', '**Acciones**: Cancelar y Asignar / Reasignar'],
          props: ['`getAssignmentConflicts(job, pro, jobs)` es exportada: `unit` y `dayoff` **bloquean**; `overlap` **advierte** y permite “Asignar de todos modos”.', '`job` null mantiene el panel cerrado. `value` y `onChange` son la persona elegida; `onConfirm(id)` ejecuta el cambio.', 'Naranja solo en “Asignar a …” sin conflictos; con solapamiento el botón pasa a secundario.'],
          states: ['Sin elegir', 'Elegido sin conflicto', 'Elegido con solapamiento (advertencia)', 'Persona bloqueada (no trabaja la unidad o descansa)', 'Reasignación (muestra el cambio)', 'Confirmando'],
          tokens: [['Resumen del trabajo', 'surface.subtle'], ['Advertencia', 'status.warning.*'], ['Acción principal', 'action.primary.*'], ['Panel', 'surface.raised · elevation']],
          responsive: ['≥ 900 px: panel lateral de 440 px. Menos: página completa con TopBar y acciones inferiores.', 'Con 390 px los botones se apilan, “Asignar” arriba.'],
          a11y: ['Diálogo modal con foco atrapado y Esc para cerrar; el foco regresa a quien lo abrió.', 'El personal es un grupo de radios; las opciones bloqueadas están deshabilitadas y dicen por qué en texto.', 'Los avisos de conflicto se anuncian (`role="alert"`).'],
          content: [['Conflicto de horario', 'Schedule conflict'], ['Asignar de todos modos', 'Assign anyway'], ['Pendiente de asignación', 'Awaiting assignment']],
          example: '**Ejemplo de negocio**: BS-24102 (Towing 8:30, lote 04217753). Mateo Salazar se solapa con BS-24104 (9:30); Ricardo Paz está de descanso hoy; las personas de Detailing no trabajan Towing.',
        }),
      },
    },
  },
} satisfies Meta<typeof AssignmentPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { open: false, onClose: () => undefined, job: null, professionals, jobs: todayJobs, value: null, onChange: () => undefined, onConfirm: () => undefined };

export const Interactive: Story = { name: 'Interactivo', args: base, render: () => <Demo jobId="BS-24102" /> };

export const States: Story = {
  name: 'Estados',
  args: base,
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase>
        <Specimen label="Con conflicto de horario / With conflict (Mateo)" direction="column" align="stretch">
          <Demo jobId="BS-24102" preselect="pro-mateo" />
        </Specimen>
        <Specimen label={`${l.rest} · reasignación`} direction="column" align="stretch">
          <Demo jobId="BS-24110" preselect="pro-ricardo" />
        </Specimen>
      </Showcase>
    );
  },
};

export const BusinessExample: Story = {
  name: 'Ejemplo de negocio',
  args: base,
  render: function Render() {
    const l = useStoryLabels();
    return (
      <Showcase>
        <Specimen label={`${l.businessExample} · Detailing sin asignar (BS-24111)`} direction="column" align="stretch">
          <Demo jobId="BS-24111" preselect="pro-daniela" />
        </Specimen>
      </Showcase>
    );
  },
};
