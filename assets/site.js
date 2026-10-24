document.querySelectorAll('[data-href]').forEach(button => button.addEventListener('click', () => location.href = button.dataset.href));
document.querySelectorAll('[data-dialog]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.dialog)?.showModal()));
document.querySelectorAll('[data-share-url]').forEach(button => button.addEventListener('click', event => {
  event.preventDefault(); event.stopPropagation();
  const url = new URL(button.dataset.shareUrl, location.origin).href;
  if (navigator.share) navigator.share({title: button.dataset.shareTitle, url}).catch(() => {});
  else window.prompt('Copy this link to share:', url);
}));
document.addEventListener('play', event => {
  if (event.target instanceof HTMLMediaElement) {
    document.querySelectorAll('audio,video').forEach(media => { if (media !== event.target) media.pause(); });
  }
}, true);
const archiveButton = document.getElementById('archive-tab-button');
archiveButton?.addEventListener('click', () => document.getElementById('archive-tab-dialog')?.showModal());

// The exported DOM already contains the complete article and its audio players.
document.querySelectorAll('audio').forEach(audio => {
  const label = [...audio.parentElement.querySelectorAll('span,b,strong')]
    .find(el => /^(AUDIO\s*:?|FULL SYMPHONY|FULL SINFONIA)$/i.test(el.textContent.trim()));
  if (!label) return;
  label.setAttribute('role', 'button'); label.tabIndex = 0;
  const sync = () => {
    label.setAttribute('aria-label', `${audio.paused ? 'Play' : 'Pause'} ${label.textContent.includes('FULL') ? 'full symphony' : 'audio'}`);
    label.setAttribute('aria-pressed', String(!audio.paused));
  };
  const toggle = () => audio.paused ? audio.play().catch(sync) : audio.pause();
  label.addEventListener('click', toggle);
  label.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  ['play','pause','ended'].forEach(event => audio.addEventListener(event, sync)); sync();
});
document.querySelectorAll('.macfarren-movement-jumps').forEach(nav => {
  const audio = nav.parentElement.querySelector('.macfarren-full-symphony audio');
  if (!audio) return;
  nav.querySelectorAll('a').forEach((link, i) => link.addEventListener('click', e => {
    e.preventDefault(); audio.currentTime = [0,579.82,1034.54,1254.07][i]; audio.play().catch(() => {});
  }));
});
document.querySelectorAll('.morris-full-sinfonia-jumps').forEach(nav => {
  const audio = nav.closest('.morris-full-sinfonia-box')?.querySelector('audio');
  if (!audio) return;
  nav.querySelectorAll('a').forEach((link, i) => link.addEventListener('click', e => {
    e.preventDefault();
    audio.currentTime = Number(link.dataset.start ?? [0,237.579592,524.739592,759.18449][i]);
    audio.play().catch(() => {});
  }));
});
document.querySelectorAll('a[href="#macfarren-full-audio"]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.getElementById('macfarren-full-audio');
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({behavior:'instant',block:'center'});
    history.replaceState(null,'','#macfarren-full-audio');
  });
});
const contactPopup = document.getElementById('contact-popup');
document.getElementById('contact-popup-button')?.addEventListener('click', () => contactPopup?.showModal());
document.getElementById('contact-popup-close')?.addEventListener('click', () => contactPopup?.close());
document.querySelectorAll('button').forEach(button => {
  if (button.textContent.trim().toLowerCase() === 'see dates') button.addEventListener('click', () => document.getElementById('macfarren-dates-dialog')?.showModal());
});
document.querySelectorAll('button[onclick]').forEach(button => {
  const target = button.getAttribute('onclick').match(/getElementById\(['"]([^'"]+)['"]\)/)?.[1];
  if (target) button.addEventListener('click', () => document.getElementById(target)?.showModal());
});
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
  let paused = matchMedia('(prefers-reduced-motion: reduce)').matches, hover = false, last = 0, resume = 0, position = 0;
  const sync = () => { toggle.textContent = paused ? 'Play' : 'Pause'; toggle.setAttribute('aria-label', (paused ? 'Play' : 'Pause') + ' portrait scrolling'); };
  sync(); toggle.addEventListener('click', () => { paused = !paused; sync(); });
  previous.addEventListener('click', () => { viewport.scrollLeft -= 125; resume = performance.now()+2000; });
  next.addEventListener('click', () => { viewport.scrollLeft += 125; resume = performance.now()+2000; });
  carousel.addEventListener('pointerenter', () => hover = true);
  carousel.addEventListener('pointerleave', () => hover = false);
  function tick(now) {
    const delta = last ? Math.min(now-last, 60) : 0; last = now;
    if (!paused && !hover && now > resume && !document.hidden) { position += delta*0.024; if(position >= originalWidth) position -= originalWidth; viewport.scrollLeft = position; }
    else position = viewport.scrollLeft;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
