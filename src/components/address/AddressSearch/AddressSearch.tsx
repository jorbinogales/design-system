import EditLocationAltRounded from '@mui/icons-material/EditLocationAltRounded';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import NearMeRounded from '@mui/icons-material/NearMeRounded';
import SearchOffRounded from '@mui/icons-material/SearchOffRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useId, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useT } from '../../../i18n/locale';
import { visuallyHidden } from '../../../theme/a11y';
import { bs } from '../../../theme/theme';
import { transition } from '../../../theme/tokens';
import { Button } from '../../actions/Button/Button';
import { TextField } from '../../fields/TextField/TextField';

export interface AddressSuggestion {
  id: string;
  /** Street line or place name: "8502 Preston Rd". */
  primary: string;
  /** The rest of the address, complete and never truncated: "Doral, FL 33172". */
  secondary: string;
}

export interface AddressSearchProps {
  /** Text typed in the field (controlled). */
  value: string;
  onChange: (query: string) => void;
  /** Results for `value`. Empty with a long enough query and not `loading` means "no results". */
  suggestions: AddressSuggestion[];
  onSelect: (suggestion: AddressSuggestion) => void;
  /** Adds the "Usar mi ubicación actual" row. */
  onUseCurrentLocation?: () => void;
  /** The device is resolving the current location. */
  locating?: boolean;
  /** Adds "Ingresar dirección manualmente" to the no-results and results states. */
  onManualEntry?: () => void;
  /** Results are being fetched. */
  loading?: boolean;
  /** Characters needed before results are expected. Default 3. */
  minChars?: number;
  autoFocus?: boolean;
}

const messages = {
  es: {
    label: 'Buscar dirección',
    placeholder: 'Calle, número o lugar',
    current: 'Usar mi ubicación actual',
    currentHint: 'Con el permiso de ubicación de tu dispositivo',
    locating: 'Buscando tu ubicación…',
    results: 'Resultados',
    hint: (n: number) => `Escribe al menos ${n} caracteres para ver direcciones.`,
    count: (n: number) => (n === 1 ? '1 resultado' : `${n} resultados`),
    loading: 'Buscando direcciones',
    emptyTitle: 'No encontramos esa dirección',
    emptyBody: 'Revisa la ortografía o ingrésala a mano: calle, número, ciudad y ZIP.',
    manual: 'Ingresar dirección manualmente',
    notListed: '¿No aparece? Ingrésala manualmente',
    list: 'Direcciones sugeridas',
  },
  en: {
    label: 'Search address',
    placeholder: 'Street, number or place',
    current: 'Use my current location',
    currentHint: "Uses your device's location permission",
    locating: 'Finding your location…',
    results: 'Results',
    hint: (n: number) => `Type at least ${n} characters to see addresses.`,
    count: (n: number) => (n === 1 ? '1 result' : `${n} results`),
    loading: 'Searching addresses',
    emptyTitle: "We couldn't find that address",
    emptyBody: 'Check the spelling or enter it by hand: street, number, city and ZIP.',
    manual: 'Enter address manually',
    notListed: "Can't find it? Enter it manually",
    list: 'Suggested addresses',
  },
};

/** Bold the part of `text` that matches `query` (case-insensitive). */
function highlight(text: string, query: string): ReactNode {
  const q = query.trim();
  const i = q ? text.toLocaleLowerCase().indexOf(q.toLocaleLowerCase()) : -1;
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <Box component="mark" sx={{ backgroundColor: 'transparent', color: 'inherit', fontWeight: 750 }}>
        {text.slice(i, i + q.length)}
      </Box>
      {text.slice(i + q.length)}
    </>
  );
}

interface Row {
  id: string;
  kind: 'current' | 'suggestion';
  suggestion?: AddressSuggestion;
}

/**
 * Address autocomplete. A search field with a list that is always visible beneath it (no popup):
 * "Usar mi ubicación actual" first, then results. Handles loading, found and no-results (offering manual entry).
 * ARIA combobox pattern: focus stays in the field, arrows move the active option, Enter chooses it.
 */
export function AddressSearch({ value, onChange, suggestions, onSelect, onUseCurrentLocation, locating = false, onManualEntry, loading = false, minChars = 3, autoFocus = false }: AddressSearchProps) {
  const t = useT(messages);
  const uid = useId();
  const listId = `${uid}-list`;
  const [active, setActive] = useState(-1);
  const query = value.trim();
  const ready = query.length >= minChars;
  const found = ready && !loading && suggestions.length > 0;
  const empty = ready && !loading && suggestions.length === 0;

  const rows: Row[] = [
    ...(onUseCurrentLocation ? [{ id: `${uid}-current`, kind: 'current' as const }] : []),
    ...(found ? suggestions.map((s) => ({ id: `${uid}-${s.id}`, kind: 'suggestion' as const, suggestion: s })) : []),
  ];
  const choose = (row: Row) => {
    if (row.kind === 'current') {
      if (!locating) onUseCurrentLocation?.();
    } else if (row.suggestion) onSelect(row.suggestion);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!rows.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % rows.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a <= 0 ? rows.length - 1 : a - 1));
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault();
      choose(rows[active]);
    } else if (e.key === 'Escape' && value) {
      onChange('');
      setActive(-1);
    }
  };

  const optionSx = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: 3,
    minHeight: 56,
    px: 2,
    py: 2.5,
    borderRadius: 2,
    cursor: 'pointer',
    listStyle: 'none',
    transition: transition('background-color'),
    backgroundColor: isActive ? bs.action.hover : 'transparent',
    outline: isActive ? `2px solid ${bs.focus.ring}` : 'none',
    outlineOffset: -2,
    '@media (hover: hover)': { '&:hover': { backgroundColor: bs.action.hover } },
    '&[aria-disabled="true"]': { cursor: 'progress' },
  });

  const status = loading ? t.loading : found ? t.count(suggestions.length) : empty ? t.emptyTitle : '';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      <TextField
        label={t.label}
        hideLabel
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setActive(-1);
        }}
        onKeyDown={onKeyDown}
        placeholder={t.placeholder}
        autoComplete="off"
        autoFocus={autoFocus}
        startIcon={<SearchRounded />}
        clearable
        onClear={() => {
          onChange('');
          setActive(-1);
        }}
        slotProps={{
          htmlInput: {
            role: 'combobox',
            'aria-autocomplete': 'list',
            'aria-expanded': rows.length > 0,
            'aria-controls': rows.length ? listId : undefined,
            'aria-activedescendant': active >= 0 && rows[active] ? rows[active].id : undefined,
            enterKeyHint: 'search',
          },
        }}
      />

      {rows.length > 0 && (
        <Box component="ul" id={listId} role="listbox" aria-label={t.list} aria-busy={loading || undefined} sx={{ m: 0, p: 0 }}>
          {rows.map((row, i) => {
            if (row.kind === 'current') {
              return (
                <Box
                  component="li"
                  key={row.id}
                  id={row.id}
                  role="option"
                  aria-selected={active === i}
                  aria-disabled={locating || undefined}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(row)}
                  sx={{ ...optionSx(active === i), alignItems: 'center' }}
                >
                  {locating ? <CircularProgress size={22} aria-hidden sx={{ flexShrink: 0 }} /> : <NearMeRounded aria-hidden sx={{ color: bs.text.primary, flexShrink: 0 }} />}
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {locating ? t.locating : t.current}
                    </Typography>
                    <Typography variant="caption" sx={{ color: bs.text.secondary }}>
                      {t.currentHint}
                    </Typography>
                  </Box>
                </Box>
              );
            }
            const s = row.suggestion!;
            return (
              <Box
                component="li"
                key={row.id}
                id={row.id}
                role="option"
                aria-selected={active === i}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(row)}
                sx={optionSx(active === i)}
              >
                <LocationOnOutlined aria-hidden sx={{ color: bs.text.secondary, flexShrink: 0, mt: '1px' }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, overflowWrap: 'anywhere' }}>
                    {highlight(s.primary, query)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: bs.text.secondary, overflowWrap: 'anywhere' }}>
                    {s.secondary}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {loading && (
        <Box aria-hidden sx={{ display: 'flex', flexDirection: 'column', gap: 3, px: 2, py: 2 }}>
          {[0, 1, 2].map((i) => (
            <Box key={i} sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width={`${60 - i * 8}%`} />
                <Skeleton variant="text" width={`${82 - i * 10}%`} />
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {!ready && !loading && (
        <Typography variant="body2" sx={{ color: bs.text.secondary, px: 2 }}>
          {t.hint(minChars)}
        </Typography>
      )}

      {found && onManualEntry && (
        <Box sx={{ px: 1 }}>
          <Button variant="quiet" size="md" startIcon={<EditLocationAltRounded />} onClick={onManualEntry}>
            {t.notListed}
          </Button>
        </Box>
      )}

      {empty && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3, px: 2, py: 3 }}>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
            <SearchOffRounded aria-hidden sx={{ color: bs.text.secondary, flexShrink: 0 }} />
            <Box>
              <Typography variant="h4" component="p">
                {t.emptyTitle}
              </Typography>
              <Typography variant="body2" sx={{ color: bs.text.secondary, mt: 0.5 }}>
                {t.emptyBody}
              </Typography>
            </Box>
          </Box>
          {onManualEntry && (
            <Button variant="secondary" size="md" startIcon={<EditLocationAltRounded />} onClick={onManualEntry}>
              {t.manual}
            </Button>
          )}
        </Box>
      )}

      <Box role="status" aria-live="polite" sx={visuallyHidden}>
        {status}
      </Box>
    </Box>
  );
}
