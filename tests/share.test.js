import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreShare } from '../src/share.js';
test('share payload uses the final score and encodes social parameters', () => {
  const share = scoreShare(12, 3, 'https://example.com/Playground/?a=1&b=2');
  assert.match(share.text, /96 hours across 12 shifts with 3 perfect drops/);
  assert.match(share.text, /WorkEasy Software/);
  const x = new URL(share.x);
  assert.equal(x.searchParams.get('text'), share.text);
  assert.equal(x.searchParams.get('url'), share.url);
  assert.equal(new URL(share.facebook).searchParams.get('u'), share.url);
  assert.equal(share.copy, `${share.text}\n${share.url}`);
});
test('a zero score can also be shared accurately', () => {
  assert.match(scoreShare(0, 0, 'https://example.com/').text, /0 hours across 0 shifts with 0 perfect drops/);
});
