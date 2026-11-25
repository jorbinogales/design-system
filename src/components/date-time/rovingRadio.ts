import type { KeyboardEvent } from 'react';

/**
 * Arrow-key navigation for a group of `role="radio"` elements (day strip, time slots).
 * Attach to the `role="radiogroup"` container's `onKeyDown`. Selection follows focus, as in a native radio group;
 * radios marked `aria-disabled="true"` are skipped. Pair with a roving `tabIndex` (0 on the active radio, -1 on the rest).
 */
export function rovingRadioKeyDown(e: KeyboardEvent<HTMLElement>) {
  if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
  const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]:not([aria-disabled="true"])'));
  if (!items.length) return;
  const current = items.indexOf(document.activeElement as HTMLElement);
  let next: number;
  if (e.key === 'Home') next = 0;
  else if (e.key === 'End') next = items.length - 1;
  else {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    next = current < 0 ? 0 : (current + step + items.length) % items.length;
  }
  e.preventDefault();
  items[next].focus();
  items[next].click();
}
