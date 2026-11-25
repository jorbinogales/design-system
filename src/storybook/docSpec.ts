/**
 * Docs page builder for the 8 fields of brief §6. Every component story file passes the
 * result to `parameters.docs.description.component`:
 *
 *   parameters: { docs: { description: { component: componentDocs({ ... }) } } }
 *
 * Field 2 (Propiedades) is completed automatically by the Controls table on the page.
 * Write docs prose in Spanish; `content` holds real ES/EN copy pairs.
 */
export interface DocSpec {
  /** 1. Propósito: one or two sentences, the task it solves. */
  purpose: string;
  /** 1. Anatomía: parts in order. Mark optional ones with "(opcional)". */
  anatomy: string[];
  /** 2. Propiedades: notes the Controls table cannot express (defaults, combinations to avoid). */
  props?: string[];
  /** 3. Estados de interacción: one line per state that applies. */
  states: string[];
  /** 4. Tokens: [part, token] pairs. */
  tokens: [string, string][];
  /** 5. Comportamiento adaptable: mobile vs desktop, long text, keyboard open. */
  responsive: string[];
  /** 6. Accesibilidad: accessible name, focus order, keyboard, error announcement, color independence. */
  a11y: string[];
  /** 7. Contenido ES/EN: [es, en] pairs, include the long case. */
  content: [string, string][];
  /** 8. Ejemplo de negocio: which story shows it and with what data. */
  example: string;
}

const list = (items: string[]) => items.map((i) => `- ${i}`).join('\n');
const table = (head: [string, string], rows: [string, string][]) =>
  [`| ${head[0]} | ${head[1]} |`, '| --- | --- |', ...rows.map(([a, b]) => `| ${a} | ${b} |`)].join('\n');

export function componentDocs(spec: DocSpec): string {
  return [
    spec.purpose,
    '### 1. Propósito y anatomía',
    list(spec.anatomy),
    '### 2. Propiedades',
    list([...(spec.props ?? []), 'La tabla de controles de esta página lista cada propiedad, su tipo y su valor por defecto.']),
    '### 3. Estados de interacción',
    list(spec.states),
    '### 4. Tokens',
    table(['Parte', 'Token'], spec.tokens.map(([part, token]) => [part, `\`${token}\``])),
    '### 5. Comportamiento adaptable',
    list(spec.responsive),
    '### 6. Accesibilidad',
    list(spec.a11y),
    '### 7. Contenido ES/EN',
    table(['Español', 'English'], spec.content),
    '### 8. Ejemplo de negocio',
    spec.example,
  ].join('\n\n');
}
