import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon';
import type { ReactNode } from 'react';

/**
 * Black Seat custom icon recipe: 24px grid, 1.75 stroke, round caps and joins, `currentColor`.
 * Every custom icon goes through this so the family stays consistent.
 */
export function createStrokeIcon(paths: ReactNode, displayName: string) {
  function StrokeIcon(props: SvgIconProps) {
    return (
      <SvgIcon viewBox="0 0 24 24" {...props}>
        <g fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
          {paths}
        </g>
      </SvgIcon>
    );
  }
  StrokeIcon.displayName = displayName;
  return StrokeIcon;
}

export type StrokeIcon = ReturnType<typeof createStrokeIcon>;
