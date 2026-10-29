export const BOARD_WIDTH = 360;
export const INITIAL_WIDTH = 236;
export const PERFECT_MARGIN = 7;
export function createGame(best = 0) {
  return { phase: 'ready', layers: [{ x: 62, width: INITIAL_WIDTH, perfect: false }], moving: { x: 0, width: INITIAL_WIDTH, direction: 1 }, score: 0, perfects: 0, best, lastDrop: null };
}
export function start(game) { return { ...createGame(game.best), phase: 'playing' }; }
export function advance(game, seconds) {
  if (game.phase !== 'playing') return game;
  const moving = { ...game.moving };
  const max = BOARD_WIDTH - moving.width;
  let x = moving.x + moving.direction * (112 + game.score * 7) * Math.min(seconds, .05);
  while (x < 0 || x > max) {
    if (x > max) { x = 2 * max - x; moving.direction = -1; }
    if (x < 0) { x = -x; moving.direction = 1; }
  }
  moving.x = x;
  return { ...game, moving };
}
export function drop(game) {
  if (game.phase !== 'playing') return game;
  const previous = game.layers.at(-1), moving = game.moving;
  const perfect = Math.abs(previous.x - moving.x) <= PERFECT_MARGIN;
  const x = perfect ? previous.x : Math.max(previous.x, moving.x);
  const right = perfect ? previous.x + previous.width : Math.min(previous.x + previous.width, moving.x + moving.width);
  const width = right - x;
  if (width <= 0) return { ...game, phase: 'over', best: Math.max(game.best, game.score), lastDrop: 'miss' };
  const score = game.score + 1;
  return { ...game, score, best: Math.max(game.best, score), perfects: game.perfects + Number(perfect), lastDrop: perfect ? 'perfect' : 'good', layers: [...game.layers, { x, width, perfect }], moving: { x: score % 2 ? BOARD_WIDTH - width : 0, width, direction: score % 2 ? -1 : 1 } };
}
export function togglePause(game) {
  if (!['playing', 'paused'].includes(game.phase)) return game;
  return { ...game, phase: game.phase === 'playing' ? 'paused' : 'playing' };
}
export function formatHours(shifts) { return `${shifts * 8}h`; }
