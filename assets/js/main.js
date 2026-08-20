/* MANI JEWEL — shared interactions */

// Legacy glass-nav scroll state (harmless if .nav absent)
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Mobile menu
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileMenu.classList.remove('open'))
  );
}

// Search popover toggle
const searchToggle = document.querySelector('.search-toggle');
const searchPop = document.querySelector('.search-pop');
if (searchToggle && searchPop) {
  searchToggle.addEventListener('click', e => {
    e.stopPropagation();
    searchPop.classList.toggle('open');
    if (searchPop.classList.contains('open')) searchPop.querySelector('input').focus();
  });
  document.addEventListener('click', e => {
    if (!searchPop.contains(e.target) && e.target !== searchToggle) searchPop.classList.remove('open');
  });
}

// Header search — route to the right page by keyword
function lpSearch(form) {
  const q = (form.querySelector('input').value || '').toLowerCase();
  const routes = [
    [/ring|earring|neckl|pendant|tanman|bangle|bracelet|maang|product|collection/, 'index.html#products'],
    [/service|custom|repair|restor|certif|bridal/, 'index.html#services'],
    [/factory|manufactur|mani world|process|cad|cast|polish|atelier/, 'maniworld.html'],
    [/office|location|address|map|surat|mumbai|delhi|chennai|where/, 'locations.html'],
    [/leader|founder|sojitra|team|director/, 'leadership.html'],
    [/news|press|award/, 'news.html'],
    [/journal|blog|story|stories/, 'journal.html'],
    [/career|job|hiring|join|work/, 'careers.html'],
    [/about|house|history|legacy|value/, 'house.html'],
  ];
  const hit = routes.find(([re]) => re.test(q));
  window.location.href = hit ? hit[1] : 'contact.html';
  return false;
}
window.lpSearch = lpSearch;

// Scroll reveal
const io = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Animated counters
const counters = document.querySelectorAll('[data-count]');
const cio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    cio.unobserve(e.target);
    const el = e.target;
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 1800;
    const t0 = performance.now();
    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.childNodes[0].nodeValue = target % 1 === 0 ? Math.round(val).toLocaleString('en-IN') : val.toFixed(1);
      if (p < 1) requestAnimationFrame(step);
    };
    el.innerHTML = '0<sup>' + suffix + '</sup>';
    requestAnimationFrame(step);
  });
}, { threshold: 0.4 });
counters.forEach(el => cio.observe(el));

// Set current year
document.querySelectorAll('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));
