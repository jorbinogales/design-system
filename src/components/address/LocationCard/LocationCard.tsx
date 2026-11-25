import CheckRounded from '@mui/icons-material/CheckRounded';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import EditOutlined from '@mui/icons-material/EditOutlined';
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import SignpostOutlined from '@mui/icons-material/SignpostOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { useT } from '../../../i18n/locale';
import { visuallyHidden } from '../../../theme/a11y';
import { bs } from '../../../theme/theme';
import { duration } from '../../../theme/tokens';
import { Button } from '../../actions/Button/Button';
import { Card } from '../../layout/Card/Card';
import { MapCanvas, type MapPin } from '../MapCanvas/MapCanvas';

/** A postal address as the customer or the auction provides it. Every part is a plain string (ZIP keeps leading zeros). */
export interface AddressData {
  line1: string;
  /** Apartment, suite, floor or gate. */
  line2?: string;
  city: string;
  /** Two-letter state code ("FL"). */
  state: string;
  zip: string;
  /** Landmark or instructions ("Portón negro, junto a la farmacia"). */
  reference?: string;
}

/** "2150 NW 87th Ave, Apt 4B, Doral, FL 33172": the whole address on one line, for copying and for map links. */
export function formatAddress(a: AddressData): string {
  return [a.line1, a.line2, `${a.city}, ${a.state} ${a.zip}`].filter(Boolean).join(', ');
}

/** Link that opens the address in the device's maps app or Google Maps. */
export const mapsHref = (a: AddressData) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatAddress(a))}`;

export interface LocationCardProps {
  address: AddressData;
  /** Name of the place: "Casa", "Oficina", "IAA Miami North". */
  title: string;
  /** Pin kind on the thumbnail. */
  pinKind?: MapPin['kind'];
  /** `stacked`: map above the text (mobile) · `inline`: map beside it · `auto`: stacked, inline once the card is wide. */
  layout?: 'auto' | 'stacked' | 'inline';
  /** Show the map thumbnail. On by default. */
  showMap?: boolean;
  /** Adds the Editar action. */
  onEdit?: () => void;
  /** Hide the Copiar and Abrir en mapas actions. */
  actions?: boolean;
}

const messages = {
  es: {
    copy: 'Copiar dirección',
    copied: 'Dirección copiada',
    failed: 'No se pudo copiar',
    open: 'Abrir en mapas',
    edit: 'Editar',
    newTab: '(se abre en una pestaña nueva)',
    reference: 'Referencia',
    mapOf: (title: string) => `Mapa de ${title}`,
    actions: 'Acciones de la dirección',
  },
  en: {
    copy: 'Copy address',
    copied: 'Address copied',
    failed: "Couldn't copy",
    open: 'Open in maps',
    edit: 'Edit',
    newTab: '(opens in a new tab)',
    reference: 'Landmark',
    mapOf: (title: string) => `Map of ${title}`,
    actions: 'Address actions',
  },
};

/** Stable seed from the address, so each address always draws its own street grid. */
const seedOf = (s: string) => Array.from(s).reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7);

/**
 * Map thumbnail plus the **complete** address. Staff must be able to read every part of it,
 * so nothing is truncated: long streets, suites and references wrap. Copy, open in maps and edit sit below.
 */
export function LocationCard({ address, title, pinKind = 'address', layout = 'auto', showMap = true, onEdit, actions = true }: LocationCardProps) {
  const t = useT(messages);
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const full = formatAddress(address);
  // Button's props do not list anchor attributes; they reach the <a> rendered for `href`.
  const newTab: object = { target: '_blank', rel: 'noopener noreferrer' };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(full);
      setState('copied');
    } catch {
      setState('failed');
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), duration.confirm);
  };

  const inlineAt = layout === 'inline' ? { flexDirection: 'row' as const } : layout === 'auto' ? { '@container (min-width: 520px)': { flexDirection: 'row' as const } } : {};
  const mapBox = layout === 'inline' ? { width: 200 } : layout === 'auto' ? { '@container (min-width: 520px)': { width: 220, alignSelf: 'stretch' } } : {};

  return (
    <Box sx={{ containerType: 'inline-size', width: '100%' }}>
      <Card flush component="article">
        <Box sx={{ display: 'flex', flexDirection: 'column', ...inlineAt }}>
          {showMap && (
            <Box sx={{ flexShrink: 0, '& > *': { height: '100%' }, ...mapBox }}>
              <MapCanvas
                label={t.mapOf(title)}
                ratio={layout === 'inline' ? 1.1 : 2.2}
                rounded={false}
                seed={seedOf(full)}
                pins={[{ id: 'place', kind: pinKind, x: 50, y: 78, label: title }]}
              />
            </Box>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 4, minWidth: 0, flex: 1 }}>
            <Box>
              <Typography variant="h4" component="h3" sx={{ overflowWrap: 'anywhere' }}>
                {title}
              </Typography>
              <Typography component="address" variant="body1" sx={{ fontStyle: 'normal', mt: 1, color: bs.text.primary, overflowWrap: 'anywhere' }}>
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ''}
                <br />
                {address.city}, {address.state} {address.zip}
              </Typography>
              {address.reference && (
                <Typography variant="body2" sx={{ mt: 1.5, display: 'flex', gap: 1.5, alignItems: 'flex-start', color: bs.text.secondary, overflowWrap: 'anywhere' }}>
                  <SignpostOutlined aria-hidden sx={{ fontSize: 18, mt: '1px', flexShrink: 0 }} />
                  <span>
                    <Box component="span" sx={visuallyHidden}>
                      {t.reference}:{' '}
                    </Box>
                    {address.reference}
                  </span>
                </Typography>
              )}
            </Box>
            {actions && (
              <Box role="group" aria-label={t.actions} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Button variant="secondary" size="md" onClick={copy} startIcon={state === 'copied' ? <CheckRounded /> : <ContentCopyRounded />}>
                  {state === 'copied' ? t.copied : state === 'failed' ? t.failed : t.copy}
                </Button>
                <Button variant="secondary" size="md" href={mapsHref(address)} {...newTab} startIcon={<OpenInNewRounded />} aria-label={`${t.open} ${t.newTab}`}>
                  {t.open}
                </Button>
                {onEdit && (
                  <Button variant="quiet" size="md" onClick={onEdit} startIcon={<EditOutlined />}>
                    {t.edit}
                  </Button>
                )}
              </Box>
            )}
            <Box component="span" role="status" aria-live="polite" sx={visuallyHidden}>
              {state === 'copied' ? t.copied : state === 'failed' ? t.failed : ''}
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
