/* ═══════════════════════════════════════════
   L0AD1NG SMP — script.js  (Season 3 refined)
   Sections:
     1.  Config
     2.  Skin URL Helper
     3.  Floating Blocks
     4.  Copy Value (per-box)
     5.  Toast Notification
     6.  Edition Tabs (Java / Bedrock)
     7.  Mobile Menu
     8.  Players List
     9.  Animated Counters
     10. Scroll Reveal
     11. Nav Scroll Effect
     12. Back-to-Top Button
     13. Live Server Status (mcstatus.io)
     14. Gallery Lightbox
═══════════════════════════════════════════ */


/* ─────────────────────────────────────────
   1. CONFIG
───────────────────────────────────────── */
const CONFIG = {
  serverIP:   'l0ad1ng.srein.xyz',
  discordURL: 'https://discord.gg/Aa3PdWWtFE',
};

const FALLBACK_PLAYERS = [
  { name: 'Steve_Builder', uuid: null },
  { name: 'DiamondAlex',   uuid: null },
  { name: 'NightOwl99',    uuid: null },
  { name: 'CraftyPanda',   uuid: null },
  { name: 'LavaKing',      uuid: null },
  { name: 'EmeraldElf',    uuid: null },
];


/* ─────────────────────────────────────────
   2. SKIN URL HELPER
───────────────────────────────────────── */
const FALLBACK_SKIN = 'https://mc-heads.net/avatar/MHF_Steve/32';

function getSkinUrl(name, uuid) {
  const isGeyserUUID = uuid && uuid.startsWith('00000000-0000-0000-');
  const isGeyserName = name.startsWith('.');

  if (isGeyserUUID || isGeyserName) {
    const gamertag = name.startsWith('.') ? name.slice(1) : name;
    return `https://mc-heads.net/avatar/${encodeURIComponent(gamertag)}/32`;
  }

  if (uuid) {
    return `https://crafatar.com/avatars/${uuid}?size=32&overlay=true`;
  }

  return `https://mc-heads.net/avatar/${encodeURIComponent(name)}/32`;
}

function avatarImg(name, uuid) {
  const src = getSkinUrl(name, uuid);
  return `<img
    src="${src}"
    alt="${name}"
    width="28" height="28"
    class="player-skin"
    loading="lazy"
    onerror="this.onerror=null;this.src='${FALLBACK_SKIN}'"
  >`;
}


/* ─────────────────────────────────────────
   3. FLOATING BLOCKS
───────────────────────────────────────── */
function initFloatingBlocks() {
  const colors    = ['#4ade80','#fbbf24','#38bdf8','#a78bfa','#f472b6','#f97316'];
  const container = document.getElementById('blocksBg');
  if (!container) return;

  for (let i = 0; i < 18; i++) {
    const block   = document.createElement('div');
    const color   = colors[Math.floor(Math.random() * colors.length)];
    const size    = 14 + Math.random() * 20;
    const circle  = Math.random() > 0.5;

    block.className               = 'block';
    block.style.left              = `${Math.random() * 100}%`;
    block.style.width             = `${size}px`;
    block.style.height            = `${size}px`;
    block.style.background        = color;
    block.style.animationDuration = `${9 + Math.random() * 14}s`;
    block.style.animationDelay    = `${Math.random() * 14}s`;
    block.style.borderRadius      = circle ? '50%' : '4px';

    container.appendChild(block);
  }
}


/* ─────────────────────────────────────────
   4. COPY VALUE  — works for any .ip-box
   Each button reads from its own .ip-box
   via the data-copy attribute.
───────────────────────────────────────── */
function copyValue(btn) {
  const box   = btn.closest('.ip-box');
  const value = box.dataset.copy;

  navigator.clipboard.writeText(value).catch(() => {
    const input = box.querySelector('.ip-text');
    if (input) { input.select(); document.execCommand('copy'); }
  });

  /* Visual feedback on this button only */
  const icon  = btn.querySelector('.copy-icon');
  const label = btn.querySelector('.copy-label');
  const orig  = label ? label.textContent : '';

  btn.classList.add('copied');
  if (icon)  icon.textContent  = '✓';
  if (label) label.textContent = 'Copied!';

  showToast(`✓ "${value}" copied!`);

  setTimeout(() => {
    btn.classList.remove('copied');
    if (icon)  icon.textContent  = '📋';
    if (label) label.textContent = orig;
  }, 2000);
}


/* ─────────────────────────────────────────
   5. TOAST NOTIFICATION
───────────────────────────────────────── */
let toastTimer = null;

function showToast(msg = '✓ Copied to clipboard!') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}


/* ─────────────────────────────────────────
   6. EDITION TABS (Java / Bedrock)
───────────────────────────────────────── */
function switchEdition(edition) {
  const javaBtn    = document.getElementById('tab-java-btn');
  const bedrockBtn = document.getElementById('tab-bedrock-btn');
  const javaPanel  = document.getElementById('panel-java');
  const bdPanel    = document.getElementById('panel-bedrock');

  if (!javaBtn || !bedrockBtn || !javaPanel || !bdPanel) return;

  if (edition === 'java') {
    javaBtn.classList.add('active');
    bedrockBtn.classList.remove('active');
    javaPanel.classList.remove('hidden');
    bdPanel.classList.add('hidden');
  } else {
    bedrockBtn.classList.add('active');
    javaBtn.classList.remove('active');
    bdPanel.classList.remove('hidden');
    javaPanel.classList.add('hidden');
  }
}


/* ─────────────────────────────────────────
   7. MOBILE MENU
───────────────────────────────────────── */
function toggleMenu() {
  const menu   = document.getElementById('mobileMenu');
  const burger = document.getElementById('burgerBtn');
  const open   = menu.classList.toggle('open');
  burger.classList.toggle('open', open);
}

document.addEventListener('click', (e) => {
  const menu   = document.getElementById('mobileMenu');
  const burger = document.getElementById('burgerBtn');
  if (
    menu && menu.classList.contains('open') &&
    !menu.contains(e.target) &&
    !burger.contains(e.target)
  ) {
    menu.classList.remove('open');
    burger.classList.remove('open');
  }
});


/* ─────────────────────────────────────────
   8. PLAYERS LIST
───────────────────────────────────────── */
function renderPlayers(list) {
  const el = document.getElementById('playersList');
  if (!el) return;

  if (!list || list.length === 0) {
    el.innerHTML = `<p class="no-players">No players online right now — be the first to join!</p>`;
    const badge = document.getElementById('liveBadge');
    if (badge) badge.textContent = '0 online';
    return;
  }

  el.innerHTML = list.map(p => `
    <div class="player-chip">
      <div class="player-avatar">
        ${avatarImg(p.name, p.uuid)}
      </div>
      <span class="player-name">${p.name.startsWith('.') ? p.name.slice(1) : p.name}</span>
    </div>
  `).join('');

  const badge = document.getElementById('liveBadge');
  if (badge) badge.textContent = `${list.length} online`;
}


/* ─────────────────────────────────────────
   9. ANIMATED COUNTERS
───────────────────────────────────────── */
function animateCount(el, target, duration = 900) {
  if (!el) return;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString();
    if (current >= target) clearInterval(timer);
  }, 16);
}


/* ─────────────────────────────────────────
   10. SCROLL REVEAL
───────────────────────────────────────── */
function initScrollReveal() {
  const reveals  = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 55);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07 });

  reveals.forEach(el => observer.observe(el));
}


/* ─────────────────────────────────────────
   11. NAV SCROLL EFFECT
───────────────────────────────────────── */
function initNavScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const update = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', update, { passive: true });
  update();
}


/* ─────────────────────────────────────────
   12. BACK-TO-TOP BUTTON
───────────────────────────────────────── */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });
}


/* ─────────────────────────────────────────
   13. LIVE SERVER STATUS (mcstatus.io)
───────────────────────────────────────── */
function setStatusBadge(isOnline) {
  const badge = document.getElementById('statusBadge');
  if (!badge) return;

  if (isOnline) {
    badge.style.background  = 'rgba(74,222,128,0.15)';
    badge.style.borderColor = 'rgba(74,222,128,0.35)';
    badge.style.color       = '#4ade80';
    badge.innerHTML         = `<span class="status-dot"></span> Server Online • 24/7`;
  } else {
    badge.style.background  = 'rgba(248,113,113,0.15)';
    badge.style.borderColor = 'rgba(248,113,113,0.35)';
    badge.style.color       = '#f87171';
    badge.innerHTML         = `<span class="status-dot" style="background:#f87171;animation:none"></span> Server Offline`;
  }
}

async function fetchServerStatus() {
  try {
    const res = await fetch(`https://api.mcstatus.io/v2/status/java/${CONFIG.serverIP}`);
    if (!res.ok) throw new Error('API ' + res.status);
    const data = await res.json();

    const online = data.online;
    const count  = online ? (data.players?.online ?? 0) : 0;
    const max    = online ? (data.players?.max    ?? 0) : 0;

    setStatusBadge(online);

    animateCount(document.getElementById('onlineCount'), count);
    animateCount(document.getElementById('totalCount'),  max);

    const liveBadge = document.getElementById('liveBadge');
    if (liveBadge) liveBadge.textContent = `${count} / ${max} online`;

    const apiList = data.players?.list ?? [];

    if (apiList.length > 0) {
      renderPlayers(apiList.map(p => ({ name: p.name_clean ?? p.name, uuid: p.uuid ?? null })));
    } else if (count === 0) {
      renderPlayers([]);
    } else {
      /* Server hides player sample — show fallback */
      renderPlayers(FALLBACK_PLAYERS);
    }

    console.log(`[L0AD1NG SMP] ${count}/${max} players online`);

  } catch (err) {
    console.warn('[L0AD1NG SMP] mcstatus.io error:', err);
    setStatusBadge(false);
    document.getElementById('onlineCount').textContent = '–';
    document.getElementById('totalCount').textContent  = '–';
    const liveBadge = document.getElementById('liveBadge');
    if (liveBadge) liveBadge.textContent = 'Offline';
    renderPlayers([]);
  }
}


/* ─────────────────────────────────────────
   14. GALLERY LIGHTBOX
   ─────────────────────────────────────────
   openLightbox(el)
     el  — the .gallery-item div that was clicked
     Reads:  .gallery-img src/alt
             .gallery-overlay text  (used as caption)
             data-credit attribute  (shown as watermark)
───────────────────────────────────────── */
function openLightbox(el) {
  const img     = el.querySelector('.gallery-img');
  const overlay = el.querySelector('.gallery-overlay');
  const credit  = (el.dataset.credit || '').trim();

  const lb        = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lightboxCaption');
  const lbMark    = document.getElementById('lightboxWatermark');

  if (!lb || !lbImg) return;

  lbImg.src     = img ? img.src : '';
  lbImg.alt     = img ? img.alt : '';

  /* Caption: prefer the overlay text, fall back to alt */
  lbCaption.textContent = overlay
    ? overlay.textContent.trim()
    : (img ? img.alt : '');

  /* Watermark: only show when a credit is provided */
  lbMark.textContent  = credit;
  lbMark.style.display = credit ? '' : 'none';

  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  lb.classList.remove('open');
  document.body.style.overflow = '';

  /* Clear src after the fade-out so the old image doesn't flash on re-open */
  setTimeout(() => {
    const lbImg = document.getElementById('lightboxImg');
    if (lbImg) lbImg.src = '';
  }, 320);
}


/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initFloatingBlocks();
  initScrollReveal();
  initNavScroll();
  initBackToTop();

  /* ESC key closes lightbox */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* Show fallback skins immediately, then refresh with live data */
  renderPlayers(FALLBACK_PLAYERS);
  fetchServerStatus();
  setInterval(fetchServerStatus, 60_000);
});