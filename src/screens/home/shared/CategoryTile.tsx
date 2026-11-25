import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import type { ServiceCategory } from '../../../domain/booking';
import { useLocale } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { radius, transition } from '../../../theme/tokens';
import { categoryIcon } from './categoryIcons';

/** Category as a round icon with its name below. The name is always visible text. */
export function CategoryTile({ category, onOpen }: { category: ServiceCategory; onOpen?: (id: string) => void }) {
  const locale = useLocale();
  const Icon = categoryIcon[category.id];
  return (
    <ButtonBase
      onClick={() => onOpen?.(category.id)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        py: 1,
        borderRadius: `${radius.md}px`,
        minWidth: 0,
        '&.Mui-focusVisible': { outline: `2px solid ${bs.focus.ring}`, outlineOffset: 2 },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: bs.surface.subtle,
          border: `1px solid ${bs.border.subtle}`,
          color: bs.text.primary,
          transition: transition('background-color'),
          '@media (hover: hover)': { 'button:hover > &': { backgroundColor: bs.surface.muted } },
        }}
      >
        <Icon sx={{ fontSize: 30 }} />
      </Box>
      <Typography variant="caption" sx={{ textAlign: 'center', fontWeight: 600, color: bs.text.primary, lineHeight: 1.25, maxWidth: '100%', overflowWrap: 'anywhere' }}>
        {category.name[locale]}
      </Typography>
    </ButtonBase>
  );
}
