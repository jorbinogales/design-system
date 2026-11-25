import Box, { type BoxProps } from '@mui/material/Box';
import { layout } from '../../../theme/tokens';

export type ContainerSize = 'mobile' | 'content' | 'wide' | 'full';

export interface ContainerProps extends BoxProps {
  /** Max width: `mobile` 480 · `content` 840 (forms, detail) · `wide` 1280 (operator inbox) · `full`. */
  size?: ContainerSize;
  /** Side gutters: 20px mobile, 32px from 600px, 40px from 1200px. */
  gutters?: boolean;
}

/** Centers content at a max width with responsive page gutters. */
export function Container({ size = 'content', gutters = true, sx, children, ...rest }: ContainerProps) {
  return (
    <Box
      {...rest}
      sx={[
        {
          width: '100%',
          mx: 'auto',
          maxWidth: size === 'full' ? 'none' : layout.maxWidth[size],
          ...(gutters && {
            px: `${layout.gutter.mobile}px`,
            '@media (min-width:600px)': { px: `${layout.gutter.tablet}px` },
            '@media (min-width:1200px)': { px: `${layout.gutter.desktop}px` },
          }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
