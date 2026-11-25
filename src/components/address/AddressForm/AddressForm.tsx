import BusinessOutlined from '@mui/icons-material/BusinessOutlined';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useRef, useState, type FormEvent } from 'react';
import { useLocale, useT, type Locale } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { Button } from '../../actions/Button/Button';
import { TextArea } from '../../fields/TextArea/TextArea';
import { TextField } from '../../fields/TextField/TextField';
import { FilterChipGroup } from '../../selection/FilterChip/FilterChip';
import { Select, type SelectOption } from '../../selection/Select/Select';

export type AddressLabel = 'home' | 'office' | 'other';

export interface AddressFormValue {
  /** Chip: Casa / Oficina / Otro. */
  label: AddressLabel;
  /** Name when `label` is `other` ("Casa de mamá", "Bodega"). */
  customLabel: string;
  street: string;
  /** Apartment, suite or floor. Optional. */
  unit: string;
  city: string;
  /** Two-letter code. */
  state: string;
  /** Plain string: ZIP keeps leading zeros (02134). */
  zip: string;
  /** Landmark or access instructions. Optional. */
  reference: string;
}

export type AddressFormField = keyof AddressFormValue;
export type AddressFormErrors = Partial<Record<AddressFormField, string>>;

export const emptyAddressForm: AddressFormValue = { label: 'home', customLabel: '', street: '', unit: '', city: '', state: '', zip: '', reference: '' };

export interface AddressFormProps {
  value: AddressFormValue;
  onChange: (next: AddressFormValue) => void;
  /** Called with the value when every required field is valid. Without it the form renders no submit button. */
  onSubmit?: (value: AddressFormValue) => void;
  /** Server-side errors, merged over the built-in validation (for example "ZIP no corresponde a la ciudad"). */
  errors?: AddressFormErrors;
  submitLabel?: string;
  /** Submit in progress. */
  loading?: boolean;
  /** Defaults to a short list of states served in the US market. */
  stateOptions?: SelectOption[];
  /** Hide the Casa / Oficina / Otro chips (for pickup or delivery points that do not need a label). */
  hideLabelChips?: boolean;
}

const messages = {
  es: {
    saveAs: 'Guardar dirección como',
    chips: { home: 'Casa', office: 'Oficina', other: 'Otro' },
    customLabel: 'Nombre de la dirección',
    customPlaceholder: 'Casa de mamá, bodega…',
    street: 'Calle y número',
    streetPlaceholder: '2150 NW 87th Ave',
    unit: 'Apartamento, suite o piso',
    unitPlaceholder: 'Apt 4B',
    city: 'Ciudad',
    state: 'Estado',
    statePlaceholder: 'Elige',
    zip: 'ZIP',
    reference: 'Referencia o instrucciones de acceso',
    referencePlaceholder: 'Portón negro, junto a la farmacia',
    submit: 'Guardar dirección',
    required: 'Este dato es obligatorio.',
    zipInvalid: 'El ZIP debe tener 5 dígitos (por ejemplo 33172).',
  },
  en: {
    saveAs: 'Save address as',
    chips: { home: 'Home', office: 'Office', other: 'Other' },
    customLabel: 'Address name',
    customPlaceholder: "Mom's house, warehouse…",
    street: 'Street and number',
    streetPlaceholder: '2150 NW 87th Ave',
    unit: 'Apartment, suite or floor',
    unitPlaceholder: 'Apt 4B',
    city: 'City',
    state: 'State',
    statePlaceholder: 'Choose',
    zip: 'ZIP',
    reference: 'Landmark or access instructions',
    referencePlaceholder: 'Black gate next to the pharmacy',
    submit: 'Save address',
    required: 'This field is required.',
    zipInvalid: 'ZIP must have 5 digits (for example 33172).',
  },
};

const defaultStates: SelectOption[] = [
  { value: 'FL', label: 'Florida (FL)' },
  { value: 'GA', label: 'Georgia (GA)' },
  { value: 'TX', label: 'Texas (TX)' },
  { value: 'CA', label: 'California (CA)' },
  { value: 'NY', label: 'New York (NY)' },
  { value: 'NJ', label: 'New Jersey (NJ)' },
  { value: 'NC', label: 'North Carolina (NC)' },
  { value: 'SC', label: 'South Carolina (SC)' },
  { value: 'AL', label: 'Alabama (AL)' },
  { value: 'TN', label: 'Tennessee (TN)' },
];

/** Required-field and ZIP checks. Exported so screens validate the same way before calling an API. */
export function validateAddressForm(v: AddressFormValue, locale: Locale): AddressFormErrors {
  const t = messages[locale];
  const out: AddressFormErrors = {};
  if (!v.street.trim()) out.street = t.required;
  if (!v.city.trim()) out.city = t.required;
  if (!v.state) out.state = t.required;
  if (!v.zip.trim()) out.zip = t.required;
  else if (!/^\d{5}(-\d{4})?$/.test(v.zip.trim())) out.zip = t.zipInvalid;
  if (v.label === 'other' && !v.customLabel.trim()) out.customLabel = t.required;
  return out;
}

/**
 * Manual address form following the "Agregar dirección" pattern: label chips, street, apartment, city / state / ZIP
 * and a landmark. Labels sit above each field; required fields are validated on submit and focus moves to the first error.
 */
export function AddressForm({ value, onChange, onSubmit, errors, submitLabel, loading = false, stateOptions = defaultStates, hideLabelChips = false }: AddressFormProps) {
  const t = useT(messages);
  const locale = useLocale();
  const formRef = useRef<HTMLFormElement>(null);
  const [showErrors, setShowErrors] = useState(false);
  const shown: AddressFormErrors = { ...(showErrors ? validateAddressForm(value, locale) : {}), ...errors };
  const set = <K extends AddressFormField>(key: K, v: AddressFormValue[K]) => onChange({ ...value, [key]: v });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (Object.keys(validateAddressForm(value, locale)).length) {
      setShowErrors(true);
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    onSubmit?.(value);
  };

  return (
    <Box component="form" ref={formRef} noValidate onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', gap: 5, width: '100%' }}>
      {!hideLabelChips && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography variant="label" component="p" sx={{ color: bs.text.secondary }}>
            {t.saveAs} <span aria-hidden>*</span>
          </Typography>
          <FilterChipGroup
            selectionMode="single"
            label={t.saveAs}
            value={value.label}
            onChange={(v) => set('label', v as AddressLabel)}
            options={[
              { value: 'home', label: t.chips.home, icon: <HomeOutlined /> },
              { value: 'office', label: t.chips.office, icon: <BusinessOutlined /> },
              { value: 'other', label: t.chips.other, icon: <PlaceOutlined /> },
            ]}
          />
          {value.label === 'other' && (
            <TextField label={t.customLabel} required value={value.customLabel} onChange={(e) => set('customLabel', e.target.value)} placeholder={t.customPlaceholder} error={shown.customLabel} autoComplete="off" />
          )}
        </Box>
      )}

      <TextField label={t.street} required value={value.street} onChange={(e) => set('street', e.target.value)} placeholder={t.streetPlaceholder} error={shown.street} autoComplete="address-line1" />
      <TextField label={t.unit} optional value={value.unit} onChange={(e) => set('unit', e.target.value)} placeholder={t.unitPlaceholder} error={shown.unit} autoComplete="address-line2" />
      <TextField label={t.city} required value={value.city} onChange={(e) => set('city', e.target.value)} error={shown.city} autoComplete="address-level2" />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: 4, alignItems: 'start' }}>
        <Select label={t.state} required options={stateOptions} value={value.state} onChange={(v) => set('state', v)} placeholder={t.statePlaceholder} error={shown.state} slotProps={{ htmlInput: { autoComplete: 'address-level1' } }} />
        <TextField
          label={t.zip}
          required
          value={value.zip}
          onChange={(e) => set('zip', e.target.value.replace(/[^\d-]/g, ''))}
          error={shown.zip}
          autoComplete="postal-code"
          slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 10 } }}
        />
      </Box>
      <TextArea label={t.reference} optional minRows={2} maxLength={140} value={value.reference} onChange={(e) => set('reference', e.target.value)} placeholder={t.referencePlaceholder} />

      {onSubmit && (
        <Button type="submit" fullWidth loading={loading}>
          {submitLabel ?? t.submit}
        </Button>
      )}
    </Box>
  );
}
