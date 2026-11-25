import Box from '@mui/material/Box';
import MuiTab from '@mui/material/Tab';
import MuiTabs from '@mui/material/Tabs';
import type { ReactElement, ReactNode } from 'react';
import { Counter } from '../../data-display/Counter/Counter';

export interface TabItem<T extends string = string> {
  value: T;
  label: string;
  /** Item count shown after the label (e.g. 3 active bookings). */
  count?: number;
  icon?: ReactElement;
  disabled?: boolean;
}

export interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name of the tab list ("Estado de las reservas"). */
  label: string;
  /** Shared with `TabPanel` to wire `aria-controls` / `aria-labelledby`. */
  idPrefix: string;
  /** `fullWidth` (2–4 tabs on mobile, default) · `scrollable` (5+ or long labels) · `standard`. */
  variant?: 'fullWidth' | 'scrollable' | 'standard';
}

export const tabId = (prefix: string, value: string) => `${prefix}-tab-${value}`;
export const panelId = (prefix: string, value: string) => `${prefix}-panel-${value}`;

/** Underline tabs (reference kit) with a 3px orange indicator. */
export function Tabs<T extends string>({ items, value, onChange, label, idPrefix, variant = 'fullWidth' }: TabsProps<T>) {
  return (
    <MuiTabs
      value={value}
      onChange={(_, next: T) => onChange(next)}
      aria-label={label}
      variant={variant}
      scrollButtons={variant === 'scrollable' ? 'auto' : false}
      allowScrollButtonsMobile={false}
    >
      {items.map((item) => (
        <MuiTab
          key={item.value}
          value={item.value}
          id={tabId(idPrefix, item.value)}
          aria-controls={panelId(idPrefix, item.value)}
          disabled={item.disabled}
          icon={item.icon}
          iconPosition="start"
          label={
            item.count === undefined ? (
              item.label
            ) : (
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5 }}>
                {item.label}
                <Counter value={item.count} tone={item.value === value ? 'brand' : 'neutral'} size="sm" />
              </Box>
            )
          }
        />
      ))}
    </MuiTabs>
  );
}

export interface TabPanelProps {
  idPrefix: string;
  value: string;
  /** The currently selected tab value. */
  current: string;
  children: ReactNode;
}

/** Panel paired with a tab. Hidden panels stay out of the accessibility tree. */
export function TabPanel({ idPrefix, value, current, children }: TabPanelProps) {
  const active = value === current;
  return (
    <Box role="tabpanel" id={panelId(idPrefix, value)} aria-labelledby={tabId(idPrefix, value)} hidden={!active} tabIndex={0} sx={{ outlineOffset: 2 }}>
      {active && children}
    </Box>
  );
}
