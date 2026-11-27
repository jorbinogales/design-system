import Box from '@mui/material/Box';
import { useState } from 'react';
import { useNav } from '../../../app/nav';
import { BottomActionBar } from '../../../components/actions/BottomActionBar/BottomActionBar';
import { Button } from '../../../components/actions/Button/Button';
import { TextField } from '../../../components/fields/TextField/TextField';
import { ToastProvider, useToast } from '../../../components/feedback/Toast/Toast';
import { FieldMessage } from '../../../components/feedback/FieldMessage/FieldMessage';
import { Combobox, type ComboboxOption } from '../../../components/selection/Combobox/Combobox';
import { FilterChipGroup } from '../../../components/selection/FilterChip/FilterChip';
import { Select } from '../../../components/selection/Select/Select';
import type { Vehicle } from '../../../domain/booking';
import { useLocale, useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { vehicleColors, vehicleKinds, vehicleMakes, vehicleYears } from '../data';
import { BookingTopBar, ScreenBody, ScreenRoot } from '../ui';

const messages = {
  es: {
    title: 'Agregar vehículo',
    make: 'Marca',
    makePlaceholder: 'Busca la marca',
    model: 'Modelo',
    modelHelp: 'Por ejemplo: Corolla, F-150, Model 3.',
    year: 'Año',
    yearPlaceholder: 'Elige el año',
    plate: 'Placa',
    plateHelp: 'Como aparece en tu placa de Florida.',
    color: 'Color',
    colorPlaceholder: 'Elige el color',
    kind: 'Tipo de vehículo',
    save: 'Guardar vehículo',
    saved: 'Vehículo guardado',
    errMake: 'Elige la marca del vehículo.',
    errModel: 'Escribe el modelo.',
    errYear: 'Elige el año.',
    errPlate: 'Escribe la placa.',
    errColor: 'Elige el color.',
    errKind: 'Elige el tipo de vehículo.',
    errSummary: 'Revisa los campos marcados para guardar el vehículo.',
  },
  en: {
    title: 'Add vehicle',
    make: 'Make',
    makePlaceholder: 'Search the make',
    model: 'Model',
    modelHelp: 'For example: Corolla, F-150, Model 3.',
    year: 'Year',
    yearPlaceholder: 'Choose the year',
    plate: 'License plate',
    plateHelp: 'As shown on your Florida plate.',
    color: 'Color',
    colorPlaceholder: 'Choose the color',
    kind: 'Vehicle type',
    save: 'Save vehicle',
    saved: 'Vehicle saved',
    errMake: 'Choose the vehicle make.',
    errModel: 'Enter the model.',
    errYear: 'Choose the year.',
    errPlate: 'Enter the license plate.',
    errColor: 'Choose the color.',
    errKind: 'Choose the vehicle type.',
    errSummary: 'Check the highlighted fields to save the vehicle.',
  },
};

interface VehicleForm {
  make: ComboboxOption | null;
  model: string;
  year: string;
  plate: string;
  color: string;
  kind: Vehicle['kind'] | null;
}

const empty: VehicleForm = { make: null, model: '', year: '', plate: '', color: '', kind: null };

export interface AddVehicleScreenProps {
  /** Starts with the form submitted empty, so every error shows (story "Con errores"). */
  showErrors?: boolean;
}

function Content({ showErrors = false }: AddVehicleScreenProps) {
  const t = useT(messages);
  const locale = useLocale();
  const toast = useToast();
  const nav = useNav();
  const [form, setForm] = useState<VehicleForm>(empty);
  const [submitted, setSubmitted] = useState(showErrors);
  const set = (patch: Partial<VehicleForm>) => setForm((f) => ({ ...f, ...patch }));

  const errors = {
    make: !form.make && t.errMake,
    model: !form.model.trim() && t.errModel,
    year: !form.year && t.errYear,
    plate: !form.plate.trim() && t.errPlate,
    color: !form.color && t.errColor,
    kind: !form.kind && t.errKind,
  };
  const invalid = Object.values(errors).some(Boolean);
  const shown = (key: keyof typeof errors) => (submitted && errors[key] ? (errors[key] as string) : undefined);

  const save = () => {
    setSubmitted(true);
    if (!invalid) {
      toast.show({ message: t.saved, severity: 'success' });
      nav.back();
    }
  };

  return (
    <ScreenRoot>
      <BookingTopBar title={t.title} step={0} />
      <ScreenBody gap={5} sx={{ flex: 1 }}>
        <Combobox
          label={t.make}
          required
          placeholder={t.makePlaceholder}
          options={vehicleMakes.map((m) => ({ value: m, label: m }))}
          value={form.make}
          onChange={(make) => set({ make })}
          error={Boolean(shown('make'))}
          helperText={shown('make')}
        />
        <TextField label={t.model} required value={form.model} onChange={(e) => set({ model: e.target.value })} helperText={t.modelHelp} error={shown('model')} autoComplete="off" />
        <Select<string>
          label={t.year}
          required
          placeholder={t.yearPlaceholder}
          value={form.year}
          onChange={(year) => set({ year })}
          options={vehicleYears.map((y) => ({ value: y, label: y }))}
          error={shown('year')}
        />
        <TextField
          label={t.plate}
          required
          value={form.plate}
          onChange={(e) => set({ plate: e.target.value.toUpperCase().slice(0, 8) })}
          helperText={t.plateHelp}
          error={shown('plate')}
          autoComplete="off"
          slotProps={{ htmlInput: { autoCapitalize: 'characters', spellCheck: false } }}
        />
        <Select<string>
          label={t.color}
          required
          placeholder={t.colorPlaceholder}
          value={form.color}
          onChange={(color) => set({ color })}
          options={vehicleColors.map((c) => ({ value: c.value, label: c.label[locale] }))}
          error={shown('color')}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box component="p" sx={{ m: 0, font: 'inherit', fontWeight: 600, color: bs.text.primary }}>
            {t.kind}
          </Box>
          <FilterChipGroup<Vehicle['kind']>
            selectionMode="single"
            overflow="wrap"
            label={t.kind}
            value={form.kind}
            onChange={(kind) => set({ kind })}
            options={vehicleKinds.map((k) => ({ value: k.value, label: k.label[locale] }))}
          />
          {shown('kind') && <FieldMessage tone="error">{shown('kind')}</FieldMessage>}
        </Box>
      </ScreenBody>
      <BottomActionBar>
        <Button fullWidth onClick={save}>
          {t.save}
        </Button>
      </BottomActionBar>
    </ScreenRoot>
  );
}

/** Agregar vehículo (s30): marca (Combobox), modelo, año, placa, color y tipo. Errors appear after the first save attempt. */
export function AddVehicleScreen(props: AddVehicleScreenProps) {
  return (
    <ToastProvider offsetBottom={96}>
      <Content {...props} />
    </ToastProvider>
  );
}
