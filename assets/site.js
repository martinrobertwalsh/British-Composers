document.querySelectorAll('[data-href]').forEach(button => button.addEventListener('click', () => location.href = button.dataset.href));
const archiveButton = document.getElementById('archive-tab-button');
archiveButton?.addEventListener('click', () => document.getElementById('archive-tab-dialog')?.showModal());
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
});
if (!document.body.classList.contains('item-view')) {
  document.querySelectorAll('.Blog .post-outer-container').forEach(card => {
    const link = card.querySelector('.post-title a');
    if (!link) return;
    card.tabIndex = 0; card.setAttribute('role', 'link'); card.setAttribute('aria-label', link.textContent.trim());
    card.addEventListener('click', event => { if (!event.target.closest('a,button,input,audio') && !getSelection().toString()) location.href = link.href; });
    card.addEventListener('keydown', event => { if (event.target === card && event.key === 'Enter') location.href = link.href; });
  });
}
const carousel = document.getElementById('composer-carousel');
if (carousel) {
  const viewport = carousel.querySelector('.portrait-window');
  const track = carousel.querySelector('.portrait-track');
  const originalWidth = track.scrollWidth;
  Array.from(track.children).forEach(figure => { const copy = figure.cloneNode(true); copy.setAttribute('aria-hidden', 'true'); track.append(copy); });
  const [previous, toggle, next] = carousel.querySelectorAll('button');
  let paused = matchMedia('(prefers-reduced-motion: reduce)').matches, hover = false, last = 0, resume = 0;
  const sync = () => { toggle.textContent = paused ? 'Play' : 'Pause'; toggle.setAttribute('aria-label', (paused ? 'Play' : 'Pause') + ' portrait scrolling'); };
  sync(); toggle.addEventListener('click', () => { paused = !paused; sync(); });
  previous.addEventListener('click', () => { viewport.scrollLeft -= 125; resume = performance.now()+2000; });
  next.addEventListener('click', () => { viewport.scrollLeft += 125; resume = performance.now()+2000; });
  carousel.addEventListener('pointerenter', () => hover = true);
  carousel.addEventListener('pointerleave', () => hover = false);
  function tick(now) {
    const delta = last ? Math.min(now-last, 60) : 0; last = now;
    if (!paused && !hover && now > resume && !document.hidden) { viewport.scrollLeft += delta*0.024; if(viewport.scrollLeft >= originalWidth) viewport.scrollLeft -= originalWidth; }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
