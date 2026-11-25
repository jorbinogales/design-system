import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import SettingsBrightnessOutlined from '@mui/icons-material/SettingsBrightnessOutlined';
import { useT } from '../../../i18n/locale';
import { SegmentedControl } from '../../navigation/SegmentedControl/SegmentedControl';

export type AppearanceMode = 'light' | 'dark' | 'system';

export interface AppearanceSelectProps {
  value: AppearanceMode;
  onChange: (value: AppearanceMode) => void;
  /** Accessible name of the group. Defaults to "Apariencia" / "Appearance". */
  label?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const messages = {
  es: { label: 'Apariencia', light: 'Claro', dark: 'Oscuro', system: 'Sistema' },
  en: { label: 'Appearance', light: 'Light', dark: 'Dark', system: 'System' },
};

/**
 * Controlled selector: Claro / Oscuro / Sistema. It only reports the choice;
 * the screen applies it to the theme (and persists it).
 */
export function AppearanceSelect({ value, onChange, label, fullWidth = false, size = 'md' }: AppearanceSelectProps) {
  const t = useT(messages);
  return (
    <SegmentedControl<AppearanceMode>
      label={label ?? t.label}
      value={value}
      onChange={onChange}
      fullWidth={fullWidth}
      size={size}
      options={[
        { value: 'light', label: t.light, icon: <LightModeOutlined /> },
        { value: 'dark', label: t.dark, icon: <DarkModeOutlined /> },
        { value: 'system', label: t.system, icon: <SettingsBrightnessOutlined /> },
      ]}
    />
  );
}
