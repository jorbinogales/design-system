import { useState } from 'react';

/** A set of ids with a toggle (saved centers, saved packages). Local state only. */
export function useIdSet(initial: string[] = []) {
  const [ids, setIds] = useState<Set<string>>(() => new Set(initial));
  const toggle = (id: string) =>
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const remove = (id: string) =>
    setIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  return { ids, toggle, remove, has: (id: string) => ids.has(id) };
}
