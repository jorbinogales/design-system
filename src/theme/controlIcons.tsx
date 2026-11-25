import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon';

/**
 * Checkbox and radio glyphs. Drawn at 24px with a 20px control so the 44px hit area
 * comes from the IconButton padding. Colors come from the theme overrides (currentColor
 * for the outline, CSS variables for the filled state).
 */

const box = { x: 3, y: 3, width: 18, height: 18, rx: 5.5 } as const;

export function CheckboxIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <rect {...box} x={3.75} y={3.75} width={16.5} height={16.5} fill="none" stroke="currentColor" strokeWidth={1.75} />
    </SvgIcon>
  );
}

export function CheckboxCheckedIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <rect {...box} className="bs-control-fill" />
      <path d="M7.5 12.2l3 3 6-6.4" fill="none" className="bs-control-mark" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </SvgIcon>
  );
}

export function CheckboxIndeterminateIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <rect {...box} className="bs-control-fill" />
      <path d="M7.5 12h9" fill="none" className="bs-control-mark" strokeWidth={2.2} strokeLinecap="round" />
    </SvgIcon>
  );
}

export function RadioIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx={12} cy={12} r={8.25} fill="none" stroke="currentColor" strokeWidth={1.75} />
    </SvgIcon>
  );
}

export function RadioCheckedIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx={12} cy={12} r={8.25} fill="none" stroke="currentColor" strokeWidth={2} />
      <circle cx={12} cy={12} r={4.5} fill="currentColor" />
    </SvgIcon>
  );
}
