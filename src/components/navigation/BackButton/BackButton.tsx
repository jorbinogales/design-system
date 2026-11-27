import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import { useNav } from '../../../app/nav';
import { useT } from '../../../i18n/locale';
import { IconButton, type IconButtonProps } from '../../actions/IconButton/IconButton';

export interface BackButtonProps extends Omit<IconButtonProps, 'label' | 'icon' | 'variant'> {
  /** Defaults to "Volver" / "Back". Use a destination when it helps: "Volver a Mis reservas". */
  label?: string;
  /** `outlined` on canvas (default), `raised` over photos, `plain` in dense desktop headers. */
  variant?: 'outlined' | 'raised' | 'plain';
  /** Renders a link instead of a button (route-based back). */
  href?: string;
}

const messages = { es: { back: 'Volver' }, en: { back: 'Back' } };

/** Circular back control from the reference kit. */
export function BackButton({ label, variant = 'outlined', ...rest }: BackButtonProps) {
  const t = useT(messages);
  const nav = useNav();
  // In the app, a back button with no handler of its own pops the navigation stack.
  return <IconButton variant={variant} label={label ?? t.back} icon={<ArrowBackRounded />} onClick={rest.href ? undefined : nav.back} {...rest} />;
}
