import FlagRounded from '@mui/icons-material/FlagRounded';
import GavelRounded from '@mui/icons-material/GavelRounded';
import HomeRounded from '@mui/icons-material/HomeRounded';
import SignpostOutlined from '@mui/icons-material/SignpostOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ComponentType } from 'react';
import { useT } from '../../../i18n/locale';
import { visuallyHidden } from '../../../theme/a11y';
import { bs } from '../../../theme/theme';
import { radius, typeScale } from '../../../theme/tokens';
import { Link } from '../../actions/Link/Link';
import { IdentifierBlock } from '../../data-display/IdentifierBlock/IdentifierBlock';
import { formatAddress, type AddressData } from '../LocationCard/LocationCard';

export interface RouteStop {
  /** `auction`: yard of an auction (shows lot and code) · `address`: a customer or delivery address. */
  kind: 'auction' | 'address';
  /** Place name: "IAA Miami North", "Casa", "Bodega en Doral". */
  name: string;
  address: AddressData;
  /** Auction pickups: both identifiers are strings and keep their leading zeros. */
  auction?: { lot: string; code: string };
}

export interface RouteSummaryProps {
  origin: RouteStop;
  destination: RouteStop;
  /** Distance and time between both stops: "18.4 mi · 32 min". */
  trip?: string;
  /** Adds "Cambiar" to the origin / destination (booking summary before confirming). */
  onEditOrigin?: () => void;
  onEditDestination?: () => void;
  /** Override the role captions (default Recogida / Entrega). */
  originLabel?: string;
  destinationLabel?: string;
}

const messages = {
  es: { origin: 'Recogida', destination: 'Entrega', change: 'Cambiar', lot: 'Número de lote', code: 'Código de recogida', list: 'Recorrido del servicio', trip: 'Trayecto', changeStop: (s: string) => `Cambiar ${s.toLowerCase()}` },
  en: { origin: 'Pickup', destination: 'Delivery', change: 'Change', lot: 'Lot number', code: 'Pickup code', list: 'Service route', trip: 'Trip', changeStop: (s: string) => `Change ${s.toLowerCase()}` },
};

const kindIcon: Record<RouteStop['kind'], ComponentType<{ sx?: object }>> = { auction: GavelRounded, address: HomeRounded };

function Stop({ stop, role, last, trip, tripLabel, onEdit, changeLabel, changeName }: { stop: RouteStop; role: string; last: boolean; trip?: string; tripLabel: string; onEdit?: () => void; changeLabel: string; changeName: string }) {
  const t = useT(messages);
  const Icon = last ? FlagRounded : kindIcon[stop.kind];
  return (
    <Box component="li" sx={{ display: 'grid', gridTemplateColumns: '28px minmax(0, 1fr)', columnGap: 3.5 }}>
      <Box aria-hidden sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          className={last ? 'dark' : undefined}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: '50%',
            boxSizing: 'border-box',
            color: bs.text.primary,
            ...(last ? { backgroundColor: bs.surface.inverse } : { border: `2px solid ${bs.border.strong}`, backgroundColor: bs.surface.canvas }),
          }}
        >
          <Icon sx={{ fontSize: 15 }} />
        </Box>
        {!last && <Box sx={{ flex: 1, minHeight: 24, mt: 1, mb: 1, borderLeft: `2px dashed ${bs.border.strong}` }} />}
      </Box>
      <Box sx={{ minWidth: 0, pb: last ? 0 : 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 3 }}>
          <Typography variant="caption" sx={{ color: bs.text.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {role}
          </Typography>
          {onEdit && (
            <Link variant="standalone" size="sm" onClick={onEdit} aria-label={t.changeStop(changeName)} sx={{ py: 1 }}>
              {changeLabel}
            </Link>
          )}
        </Box>
        <Box>
          <Typography variant="h4" component="h3" sx={{ overflowWrap: 'anywhere' }}>
            {stop.name}
          </Typography>
          <Typography component="address" variant="body2" sx={{ fontStyle: 'normal', color: bs.text.secondary, mt: 0.5, overflowWrap: 'anywhere' }}>
            {formatAddress(stop.address)}
          </Typography>
          {stop.address.reference && (
            <Typography variant="body2" sx={{ mt: 1, display: 'flex', gap: 1.5, alignItems: 'flex-start', color: bs.text.secondary, overflowWrap: 'anywhere' }}>
              <SignpostOutlined aria-hidden sx={{ fontSize: 18, mt: '1px', flexShrink: 0 }} />
              {stop.address.reference}
            </Typography>
          )}
        </Box>
        {stop.auction && (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 2, backgroundColor: bs.surface.subtle, borderRadius: `${radius.md}px`, p: 3 }}>
            <IdentifierBlock variant="inline" label={t.lot} value={stop.auction.lot} />
            <IdentifierBlock variant="inline" label={t.code} value={stop.auction.code} />
          </Box>
        )}
        {trip && !last && (
          <Box sx={{ ...typeScale.caption, display: 'inline-flex', alignSelf: 'flex-start', mt: 1, color: bs.text.secondary, fontVariantNumeric: 'tabular-nums' }}>
            <Box component="span" sx={visuallyHidden}>
              {tripLabel}:{' '}
            </Box>
            {trip}
          </Box>
        )}
      </Box>
    </Box>
  );
}

/**
 * Origin → destination with a route connector. For Towing it starts at an auction yard
 * (name, lot and pickup code, each with its own label and copy action) and ends at the delivery address.
 * Full addresses wrap; nothing is truncated.
 */
export function RouteSummary({ origin, destination, trip, onEditOrigin, onEditDestination, originLabel, destinationLabel }: RouteSummaryProps) {
  const t = useT(messages);
  const o = originLabel ?? t.origin;
  const d = destinationLabel ?? t.destination;
  return (
    <Box component="ol" aria-label={t.list} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      <Stop stop={origin} role={o} last={false} trip={trip} tripLabel={t.trip} onEdit={onEditOrigin} changeLabel={t.change} changeName={o} />
      <Stop stop={destination} role={d} last trip={undefined} tripLabel={t.trip} onEdit={onEditDestination} changeLabel={t.change} changeName={d} />
    </Box>
  );
}
