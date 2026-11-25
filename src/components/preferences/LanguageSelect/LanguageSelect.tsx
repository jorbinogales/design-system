import { useT, type Locale } from '../../../i18n/locale';
import { SegmentedControl } from '../../navigation/SegmentedControl/SegmentedControl';

export interface LanguageSelectProps {
  value: Locale;
  onChange: (value: Locale) => void;
  /** Accessible name of the group. Defaults to "Idioma" / "Language". */
  label?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const messages = { es: { label: 'Idioma' }, en: { label: 'Language' } };

/**
 * Controlled selector: Español / English. The options are written in their own language
 * (autonyms) so they are recognizable whichever language is active. It does not change the
 * app language by itself: the screen receives `onChange` and updates the locale.
 */
export function LanguageSelect({ value, onChange, label, fullWidth = false, size = 'md' }: LanguageSelectProps) {
  const t = useT(messages);
  return (
    <SegmentedControl<Locale>
      label={label ?? t.label}
      value={value}
      onChange={onChange}
      fullWidth={fullWidth}
      size={size}
      options={[
        { value: 'es', label: 'Español' },
        { value: 'en', label: 'English' },
      ]}
    />
  );
}
