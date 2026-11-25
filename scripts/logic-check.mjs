// Runnable checks for pure logic shared by components. Run: `node scripts/logic-check.mjs`
import assert from 'node:assert/strict';
import { normalizeCode } from '../src/components/fields/CodeField/normalizeCode.ts';
import { getStatusLabel, statusMeta, bookingStatuses, assignmentStatuses, paymentStatuses } from '../src/domain/status.ts';

// Codes keep leading zeros and strip what does not belong.
assert.equal(normalizeCode('0093'), '0093');
assert.equal(normalizeCode(' 04-217 753 '), '04217753');
assert.equal(normalizeCode('a7k-29q', 'alphanumeric'), 'A7K29Q');
assert.equal(normalizeCode('0012345', 'numeric', 4), '0012');

// Every status has a tone and both locales.
for (const [dimension, list] of [['booking', bookingStatuses], ['assignment', assignmentStatuses], ['payment', paymentStatuses]]) {
  for (const s of list) {
    const meta = statusMeta[dimension][s];
    assert.ok(meta.tone, `${dimension}.${s} tone`);
    assert.ok(meta.label.es && meta.label.en, `${dimension}.${s} labels`);
  }
}
assert.equal(getStatusLabel('assignment', 'unassigned', 'es', true), 'Pendiente de asignación');
assert.equal(getStatusLabel('assignment', 'unassigned', 'en'), 'Unassigned');

console.log('logic-check: all assertions passed');
