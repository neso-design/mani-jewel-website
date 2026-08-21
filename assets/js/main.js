/* MANI JEWEL — shared interactions */

// ── Sitewide notice bar (dismissible, remembered) ──
if (!localStorage.getItem('mj-notice-closed')) {
  document.body.insertAdjacentHTML('afterbegin',
    '<div class="notice-bar" role="region" aria-label="Announcement">' +
    '<span>Looking for a jewellery manufacturing partner? <a href="partners.html">See why retailers choose Mani Jewel</a></span>' +
    '<button class="notice-close" aria-label="Dismiss announcement">&times;</button></div>');
  document.querySelector('.notice-close').addEventListener('click', () => {
    document.querySelector('.notice-bar').remove();
    localStorage.setItem('mj-notice-closed', '1');
  });
}

// ── Sitewide footer: enquiry form + certification marks ──
const footerTop = document.querySelector('.footer-top');
if (footerTop) {
  footerTop.insertAdjacentHTML('beforebegin',
    '<div class="footer-enquire">' +
      '<div><h3>Let’s do <em>business.</em></h3>' +
      '<p class="fe-sub">A collection brief, a bulk order, a single commission — write to the house from right here.</p></div>' +
      '<form class="fe-form">' +
        '<input type="text" name="name" placeholder="Your name" required aria-label="Your name" />' +
        '<input type="email" name="email" placeholder="Your email" required aria-label="Your email" />' +
        '<textarea name="message" placeholder="Tell us what you have in mind…" required aria-label="Your message"></textarea>' +
        '<button class="btn btn-blue" type="submit">Send enquiry <span class="arrow">→</span></button>' +
      '</form></div>');
  footerTop.insertAdjacentHTML('afterend',
    '<div class="footer-certs"><span class="fc-label">Standards &amp; Memberships</span>' +
      '<span class="cert-mark"><b>ISO 9001</b><span>Certified Quality</span></span>' +
      '<span class="cert-mark"><b>RJC</b><span>Responsible Jewellery Council</span></span>' +
      '<span class="cert-mark"><b>BIS</b><span>Hallmarked Gold</span></span>' +
      '<span class="cert-mark"><b>KP</b><span>Kimberley Process</span></span>' +
      '<span class="cert-mark"><b>GJEPC</b><span>Member</span></span>' +
    '</div>');
  const feForm = document.querySelector('.fe-form');
  feForm.addEventListener('submit', e => {
    e.preventDefault();
    feForm.innerHTML = '<p class="fe-thanks">Thank you — your enquiry is with the house. We reply within the same working day.</p>';
  });
}

// ── Contact page: preselect enquiry type from ?type= ──
const enquirySelect = document.getElementById('sub');
if (enquirySelect) {
  const want = new URLSearchParams(location.search).get('type');
  if (want) {
    [...enquirySelect.options].forEach(o => {
      if (o.textContent.toLowerCase().includes(want.toLowerCase())) enquirySelect.value = o.value || o.textContent;
    });
  }
}

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
    [/service|custom|repair|restor|certif|bridal|private label|logistic/, 'services.html'],
    [/partner|wholesale|why|moq|stock sheet|bulk/, 'partners.html'],
    [/faq|question|payment|credit|shipping|lead time|gst|order/, 'faq.html'],
    [/sourc|ethic|kimberley|rjc|sustain|policy/, 'sourcing.html'],
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
