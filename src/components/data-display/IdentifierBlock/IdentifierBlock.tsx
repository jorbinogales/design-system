import CheckRounded from '@mui/icons-material/CheckRounded';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { useEffect, useRef, useState } from 'react';
import { useT } from '../../../i18n/locale';
import { visuallyHidden } from '../../../theme/a11y';
import { bs } from '../../../theme/theme';
import { duration, radius, transition, typeScale } from '../../../theme/tokens';

export interface IdentifierBlockProps {
  /** What the value is: "Código de recogida", "Número de lote", "Referencia". Each identifier gets its own label. */
  label: string;
  /** Always a string (leading zeros preserved). */
  value: string;
  /** Show the copy action. On by default. */
  copyable?: boolean;
  /** `block`: subtle panel (detail pages) · `inline`: compact row (cards, tables). */
  variant?: 'block' | 'inline';
  /** Visual grouping for long numbers ("0421 7753"). Copies the raw value. */
  groupSize?: number;
  size?: 'md' | 'lg';
  /** Dense tables: label and value on one line, icon-only copy button (still named for assistive tech). Implies `variant="inline"`. */
  compact?: boolean;
}

type CopyState = 'idle' | 'copied' | 'failed';

const messages = {
  es: { copy: 'Copiar', copied: 'Copiado', failed: 'No se pudo copiar', copyLabel: (l: string) => `Copiar ${l.toLowerCase()}`, copiedLabel: (l: string) => `${l} copiado` },
  en: { copy: 'Copy', copied: 'Copied', failed: "Couldn't copy", copyLabel: (l: string) => `Copy ${l.toLowerCase()}`, copiedLabel: (l: string) => `${l} copied` },
};

const group = (v: string, n?: number) => (n ? (v.match(new RegExp(`.{1,${n}}`, 'g')) ?? [v]).join(' ') : v);

/** Labeled identifier (pickup code, lot number, booking reference) with a copy action and brief confirmation. */
export function IdentifierBlock({ label, value, copyable = true, variant = 'block', groupSize, size = 'md', compact = false }: IdentifierBlockProps) {
  const t = useT(messages);
  const [state, setState] = useState<CopyState>('idle');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState('copied');
    } catch {
      setState('failed');
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), duration.confirm);
  };

  const block = variant === 'block' && !compact;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: compact ? 'flex-start' : 'space-between',
        gap: compact ? 1 : 3,
        ...(block && { backgroundColor: bs.surface.subtle, borderRadius: `${radius.md}px`, p: 4 }),
      }}
    >
      <Box sx={{ minWidth: 0, ...(compact && { display: 'flex', alignItems: 'baseline', gap: 1.5 }) }}>
        <Box sx={{ ...typeScale.caption, color: bs.text.secondary }}>{label}</Box>
        <Box
          sx={{
            ...typeScale.code,
            fontSize: size === 'lg' ? '1.5rem' : block ? '1.125rem' : '1rem',
            whiteSpace: compact ? 'nowrap' : undefined,
            fontVariantNumeric: 'tabular-nums slashed-zero',
            color: bs.text.primary,
            overflowWrap: 'anywhere',
            userSelect: 'all',
          }}
        >
          {group(value, groupSize)}
        </Box>
      </Box>
      {copyable && (
        <ButtonBase
          onClick={copy}
          aria-label={state === 'copied' ? t.copiedLabel(label) : t.copyLabel(label)}
          sx={{
            ...typeScale.label,
            flexShrink: 0,
            display: 'inline-flex',
            gap: 1.5,
            minHeight: compact ? 32 : 44,
            ...(compact && { width: 32, justifyContent: 'center' }),
            px: compact ? 0 : 3.5,
            borderRadius: `${radius.pill}px`,
            color: state === 'copied' ? bs.status.success.fg : state === 'failed' ? bs.status.danger.fg : bs.text.primary,
            backgroundColor: block ? bs.surface.raised : bs.surface.subtle,
            border: `1px solid ${bs.border.subtle}`,
            transition: transition('background-color', 'color'),
            '@media (hover: hover)': { '&:hover': { borderColor: bs.border.strong } },
            '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: '2px' },
            '& .MuiSvgIcon-root': { fontSize: 18 },
          }}
        >
          {state === 'copied' ? <CheckRounded aria-hidden /> : <ContentCopyRounded aria-hidden />}
          {!compact && <span aria-hidden>{state === 'copied' ? t.copied : state === 'failed' ? t.failed : t.copy}</span>}
        </ButtonBase>
      )}
      <Box component="span" role="status" aria-live="polite" sx={visuallyHidden}>
        {state === 'copied' ? t.copiedLabel(label) : state === 'failed' ? t.failed : ''}
      </Box>
    </Box>
  );
}
