import MuiButton, { type ButtonProps as MuiButtonProps } from '@mui/material/Button';

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size' | 'color'> {
  /**
   * `primary`: the one orange action of a view (Reservar, Confirmar recogida, Asignar).
   * `secondary`: alternatives next to it. `quiet`: low-emphasis (Cancelar, Ver más).
   * `destructive`: irreversible actions (Cancelar reserva).
   */
  variant?: ButtonVariant;
  /** `lg` 52px (mobile CTAs), `md` 44px (desktop, dialogs), `sm` 36px (dense toolbars). */
  size?: ButtonSize;
}

const muiSize = { sm: 'small', md: 'medium', lg: 'large' } as const;

/**
 * Black Six button. Orange buttons always carry charcoal text (#111111, 5.75:1).
 * Inherits every MUI Button prop: `startIcon`, `endIcon`, `fullWidth`, `loading`, `href`, `disabled`.
 */
export function Button({ variant = 'primary', size = 'lg', ...rest }: ButtonProps) {
  return <MuiButton variant={variant} size={muiSize[size]} {...rest} />;
}
