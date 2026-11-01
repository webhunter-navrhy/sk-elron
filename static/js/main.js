// Formulář: demo režim neodesílá nic, ostrý režim posílá na endpoint ze site.json (data-endpoint).
(function () {
  document.querySelectorAll('form.formular').forEach(function (f) {
    var stav = f.querySelector('.formular-stav');
    f.addEventListener('submit', function (e) {
      var endpoint = f.getAttribute('data-endpoint');
      var demo = f.getAttribute('data-demo') === '1';
      if (f.querySelector('.past input').value) { e.preventDefault(); return; }   // robot
      if (demo || !endpoint) {
        e.preventDefault();
        stav.textContent = 'Ukážka formulára: nič sa neodosiela. Po spustení webu príde správa na e-mail firmy.';
        return;
      }
      e.preventDefault();
      stav.textContent = 'Odosielam…';
      fetch(endpoint, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); f.reset(); stav.textContent = 'Ďakujeme, správa bola odoslaná.'; })
        .catch(function () { stav.textContent = 'Odoslanie sa nepodarilo. Napíšte nám prosím e-mailom.'; });
    });
  });
})();

// Cesta projektu: čára a stanice se rozsvítí při scrollu.
(function () {
  var t = document.querySelector('.trasa');
  if (!t) return;
  var li = t.querySelectorAll('li');
  function upd() {
    var r = t.getBoundingClientRect(), h = window.innerHeight;
    var p = Math.min(1, Math.max(0, (h * 0.75 - r.top) / (r.height || 1)));
    t.style.setProperty('--pokrok', (p * 100).toFixed(1) + '%');
    li.forEach(function (x) { x.classList.toggle('zap', x.getBoundingClientRect().top < h * 0.75); });
  }
  window.addEventListener('scroll', upd, { passive: true });
  window.addEventListener('resize', upd);
  upd();
})();

// Menu na mobilu: bez JS zůstává navigace viditelná.
(function () {
  var b = document.querySelector('.menu-tl'), n = document.getElementById('hl-nav');
  if (!b || !n) return;
  var mq = window.matchMedia('(max-width: 47.99rem)');
  function set() { document.documentElement.classList.toggle('js-menu', mq.matches); b.hidden = !mq.matches; if (!mq.matches) n.classList.remove('otevrene'); }
  b.addEventListener('click', function () { var o = n.classList.toggle('otevrene'); b.setAttribute('aria-expanded', o); });
  n.addEventListener('click', function (e) { if (e.target.tagName === 'A') { n.classList.remove('otevrene'); b.setAttribute('aria-expanded', 'false'); } });
  mq.addEventListener('change', set); set();
})();
