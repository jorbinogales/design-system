import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';

export interface BreadcrumbItem {
  label: string;
  /** Link or button for every item except the last (the current page). */
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  /** From the root to the current page. The last item is the current page and is not a link. */
  items: BreadcrumbItem[];
  /** Accessible name of the navigation. Defaults to "Migas de pan" / "Breadcrumb". */
  label?: string;
  /** Collapse the middle items behind "…" above this count (default 4). */
  maxItems?: number;
}

const messages = { es: { label: 'Migas de pan', expand: 'Mostrar ruta completa' }, en: { label: 'Breadcrumb', expand: 'Show full path' } };

/** Location trail for desktop pages: Trabajos › Orden BK-20418. */
export function Breadcrumbs({ items, label, maxItems = 4 }: BreadcrumbsProps) {
  const t = useT(messages);
  return (
    <MuiBreadcrumbs aria-label={label ?? t.label} maxItems={maxItems} itemsBeforeCollapse={1} itemsAfterCollapse={2} expandText={t.expand} separator={<ChevronRightRounded aria-hidden sx={{ fontSize: 16 }} />}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        if (last) {
          return (
            <Typography key={`${item.label}-${i}`} variant="body2" component="span" aria-current="page" sx={{ color: bs.text.primary, fontWeight: 600, overflowWrap: 'anywhere' }}>
              {item.label}
            </Typography>
          );
        }
        return (
          <MuiLink key={`${item.label}-${i}`} href={item.href} component={item.href ? 'a' : 'button'} onClick={item.onClick} underline="hover" sx={{ font: 'inherit', border: 0, background: 'none', p: 0, cursor: 'pointer', borderRadius: '4px', '&:focus-visible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: '2px' } }}>
            {item.label}
          </MuiLink>
        );
      })}
    </MuiBreadcrumbs>
  );
}
