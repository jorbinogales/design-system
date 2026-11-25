import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import type { ReactNode } from 'react';
import { useT } from '../../../i18n/locale';
import { TextField, type TextFieldProps } from '../../fields/TextField/TextField';

export interface ComboboxOption {
  value: string;
  label: string;
  /** Secondary line in the list (address, city). */
  description?: string;
  /** Group heading ("Copart", "IAA"). */
  group?: string;
}

interface CommonProps extends Pick<TextFieldProps, 'label' | 'helperText' | 'error' | 'required' | 'optional' | 'disabled' | 'placeholder' | 'size'> {
  options: ComboboxOption[];
  loading?: boolean;
  /** Text when nothing matches. Defaults to "Sin resultados para…". */
  noOptionsText?: ReactNode;
}

export type ComboboxProps = CommonProps &
  ({ multiple?: false; value: ComboboxOption | null; onChange: (value: ComboboxOption | null) => void } | { multiple: true; value: ComboboxOption[]; onChange: (value: ComboboxOption[]) => void });

const messages = {
  es: { noOptions: 'Sin resultados. Revisa la escritura o prueba otro término.', loading: 'Buscando…', clear: 'Borrar selección', open: 'Abrir lista', close: 'Cerrar lista' },
  en: { noOptions: 'No results. Check the spelling or try another term.', loading: 'Searching…', clear: 'Clear selection', open: 'Open list', close: 'Close list' },
};

/** Searchable select (auction yard, operator, vehicle model). Single or multiple. Built on MUI Autocomplete. */
export function Combobox(props: ComboboxProps) {
  const t = useT(messages);
  const { options, loading, noOptionsText, label, helperText, error, required, optional, disabled, placeholder, size } = props;
  const grouped = options.some((o) => o.group);
  const sorted = grouped ? [...options].sort((a, b) => (a.group ?? '').localeCompare(b.group ?? '')) : options;
  return (
    <Autocomplete<ComboboxOption, boolean>
      multiple={props.multiple ?? false}
      value={props.value}
      onChange={(_, v) => (props.multiple ? props.onChange((v as ComboboxOption[]) ?? []) : props.onChange(v as ComboboxOption | null))}
      options={sorted}
      groupBy={grouped ? (o) => o.group ?? '' : undefined}
      getOptionLabel={(o) => o.label}
      isOptionEqualToValue={(a, b) => a.value === b.value}
      loading={loading}
      disabled={disabled}
      noOptionsText={noOptionsText ?? t.noOptions}
      loadingText={t.loading}
      clearText={t.clear}
      openText={t.open}
      closeText={t.close}
      disableCloseOnSelect={props.multiple}
      renderOption={({ key, ...liProps }, o) => (
        <li key={key} {...liProps}>
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <span>{o.label}</span>
            {o.description && <span style={{ fontSize: '0.875rem', opacity: 0.72 }}>{o.description}</span>}
          </span>
        </li>
      )}
      renderValue={
        props.multiple
          ? (selected, getItemProps) =>
              (selected as ComboboxOption[]).map((o, index) => {
                const itemProps = getItemProps({ index });
                return <Chip key={o.value} size="small" label={o.label} {...itemProps} />;
              })
          : undefined
      }
      renderInput={(params) => (
        <TextField
          id={params.id}
          disabled={params.disabled}
          fullWidth={params.fullWidth}
          label={label}
          helperText={helperText}
          error={error}
          required={required}
          optional={optional}
          placeholder={placeholder}
          size={size}
          slotProps={params.slotProps}
        />
      )}
    />
  );
}
