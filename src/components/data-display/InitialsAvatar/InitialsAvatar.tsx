import PersonOutlineRounded from '@mui/icons-material/PersonOutlineRounded';
import Avatar from '@mui/material/Avatar';
import { useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface InitialsAvatarProps {
  /** Full name. Omit for the "awaiting assignment" placeholder. */
  name?: string;
  /** Photo URL (local assets only). Falls back to initials on error. */
  src?: string;
  size?: AvatarSize;
  /** Hide from assistive tech when the name is printed next to it (default). */
  decorative?: boolean;
}

const px: Record<AvatarSize, number> = { xs: 24, sm: 32, md: 40, lg: 56, xl: 80 };

const messages = { es: { unassigned: 'Pendiente de asignación' }, en: { unassigned: 'Awaiting assignment' } };

/** First letter of the first and last word: "María José Pérez" → "MP". */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '';
  return (first + last).toLocaleUpperCase();
}

/** Avatar with initials (or photo). Without `name` it renders the dashed "unassigned" placeholder. */
export function InitialsAvatar({ name, src, size = 'md', decorative = true }: InitialsAvatarProps) {
  const t = useT(messages);
  const s = px[size];
  const unassigned = !name;
  return (
    <Avatar
      src={src}
      alt={decorative ? '' : (name ?? t.unassigned)}
      aria-hidden={decorative || undefined}
      role={!decorative && !src ? 'img' : undefined}
      aria-label={!decorative && !src ? (name ?? t.unassigned) : undefined}
      sx={{
        width: s,
        height: s,
        fontSize: Math.round(s * 0.38),
        ...(unassigned && { backgroundColor: 'transparent', color: bs.text.secondary, border: `1.5px dashed ${bs.border.strong}` }),
      }}
    >
      {unassigned ? <PersonOutlineRounded sx={{ fontSize: Math.round(s * 0.55) }} /> : initialsOf(name)}
    </Avatar>
  );
}
