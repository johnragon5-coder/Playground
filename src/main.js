import { createGame, start, advance, drop, togglePause, formatHours } from './game.js';
const $ = id => document.getElementById(id);
let best = 0;
try { const value = Number(localStorage.getItem('clock-stack-best')); best = Number.isFinite(value) && value > 0 ? Math.floor(value) : 0; } catch {}
let game = createGame(best), lastTime = 0;
function save() { try { localStorage.setItem('clock-stack-best', String(game.best)); } catch {} }
function begin() { game = start(game); render(); }
function place() { if (game.phase !== 'playing' || $('instructions').open) return; game = drop(game); save(); render(); }
function pause() { game = togglePause(game); render(); }
function renderTower() {
  const visible = game.layers.slice(-9);
  const blocks = visible.map((layer, i) => `<div class="block ${layer.perfect ? 'perfect' : ''}" style="left:${layer.x / 3.6}%;width:${layer.width / 3.6}%;bottom:${54 + i * 29}px"><span>◷</span>${layer.width > 100 ? `SHIFT ${String(game.layers.length - visible.length + i).padStart(2, '0')}` : ''}<span>8h</span></div>`);
  if (['playing', 'paused'].includes(game.phase)) blocks.push(`<div class="block moving" style="left:${game.moving.x / 3.6}%;width:${game.moving.width / 3.6}%;bottom:${54 + visible.length * 29}px"><span>◷</span>${game.moving.width > 100 ? 'ON THE CLOCK' : ''}<span>8h</span></div>`);
  $('tower').innerHTML = blocks.join('');
}
function render() {
  $('hours').innerHTML = `${game.score * 8}<span>h</span>`;
  $('best').textContent = formatHours(game.best);
  $('shift').textContent = `SHIFT ${String(game.score).padStart(2, '0')}`;
  $('status').textContent = { ready: 'READY WHEN YOU ARE', playing: 'ON THE CLOCK', paused: 'TAKING A BREAK', over: 'SHIFT COMPLETE' }[game.phase];
  $('pause').disabled = !['playing', 'paused'].includes(game.phase);
  $('pause').textContent = game.phase === 'paused' ? '▶' : 'Ⅱ';
  $('pause').setAttribute('aria-label', game.phase === 'paused' ? 'Resume game' : 'Pause game');
  $('drop').disabled = game.phase !== 'playing';
  $('feedback').textContent = game.lastDrop === 'perfect' ? '✦ Perfect timing! Full shift banked.' : game.lastDrop === 'good' ? 'Nice work. Keep your shifts aligned.' : game.lastDrop === 'miss' ? 'Clocked out. Ready for another shift?' : 'Your next great shift starts here.';
  const overlay = $('overlay');
  overlay.hidden = game.phase === 'playing';
  if (game.phase === 'over') overlay.innerHTML = `<div class="clock-art">✦</div><span class="overlay-kicker">THAT’S A WORKDAY</span><h2>${formatHours(game.score)} banked.<br>Time well spent.</h2><p>${game.score} shifts stacked · ${game.perfects} perfect drops<br>Personal best: ${formatHours(game.best)}</p><button class="primary" id="restart">Clock in again <span>↻</span></button><small>Every great stack starts with one shift.</small>`;
  if (game.phase === 'paused') overlay.innerHTML = '<div class="clock-art">Ⅱ</div><span class="overlay-kicker">TAKE YOUR TIME</span><h2>On a break.</h2><p>Your stack will be right here.</p><button class="primary" id="resume">Back to work <span>↗</span></button>';
  $('restart')?.addEventListener('click', begin);
  $('resume')?.addEventListener('click', pause);
  renderTower();
}
$('start').addEventListener('click', begin);
$('drop').addEventListener('click', place);
$('pause').addEventListener('click', pause);
$('playfield').addEventListener('click', event => { if (!event.target.closest('button')) place(); });
$('help').addEventListener('click', () => { if (game.phase === 'playing') pause(); $('instructions').showModal(); });
$('close-help').addEventListener('click', () => $('instructions').close());
document.addEventListener('keydown', event => {
  if ($('instructions').open || event.repeat) return;
  if (event.code === 'Space' && !event.target.closest('button, a')) { event.preventDefault(); if (game.phase === 'ready' || game.phase === 'over') begin(); else place(); }
  if (event.code === 'KeyP') pause();
});
document.addEventListener('visibilitychange', () => { if (document.hidden && game.phase === 'playing') pause(); });
function frame(time) { game = advance(game, lastTime ? (time - lastTime) / 1000 : 0); lastTime = time; if (game.phase === 'playing') renderTower(); requestAnimationFrame(frame); }
render(); requestAnimationFrame(frame);
