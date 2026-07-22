document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('galleryTrack');
  const prevBtn = document.querySelector('.gallery-prev');
  const nextBtn = document.querySelector('.gallery-next');
  if (!track) return;

  const cards = track.querySelectorAll('.gallery-card');
  const total = cards.length;
  let index = 0;
  let autoScroll = true;
  let autoInterval;

  function getCardWidth() {
    return cards[0]?.offsetWidth + 16 || 280; // gap 1rem
  }

  function updateTrack(animate = true) {
    const width = getCardWidth();
    track.style.transition = animate ? 'transform 0.4s ease' : 'none';
    track.style.transform = `translateX(-${index * width}px)`;
  }

  function next() {
    if (index < total - 1) index++;
    else index = 0;
    updateTrack(true);
  }

  function prev() {
    if (index > 0) index--;
    else index = total - 1;
    updateTrack(true);
  }

  function startAuto() {
    if (autoInterval) clearInterval(autoInterval);
    if (autoScroll) {
      autoInterval = setInterval(next, 4000);
    }
  }

  function stopAuto() {
    if (autoInterval) {
      clearInterval(autoInterval);
      autoInterval = null;
    }
  }

  // Buttons
  nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
  prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });

  // Touch swipe support
  let touchStartX = 0, touchEndX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAuto();
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    startAuto();
  }, { passive: true });

  // Resize observer
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => updateTrack(false), 200);
  });

  // Initial setup
  updateTrack(false);
  startAuto();

  // Pause on hover (desktop)
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);
});