/* ═══════════════════════════════════════════
   L0AD1NG SMP — script.js
   Sections:
     1. Config
     2. Skin URL Helper
     3. Floating Blocks (Hero BG)
     4. Copy IP
     5. Toast Notification
     6. Mobile Menu
     7. Players List
     8. Animated Counters
     9. Scroll Reveal
    10. Live Server Status (mcstatus.io API)
═══════════════════════════════════════════ */


/* ─────────────────────────────────────────
   1. CONFIG
───────────────────────────────────────── */
const CONFIG = {
  serverIP:   'l0ad1ng.srein.xyz',
  discordURL: 'https://discord.gg/Aa3PdWWtFE',
};

/* Fallback list shown while the API loads.
   uuid: null  →  skin looked up by username  */
const PLAYERS = [
  { name: 'Steve_Builder', uuid: null },
  { name: 'DiamondAlex',   uuid: null },
  { name: 'NightOwl99',    uuid: null },
  { name: 'CraftyPanda',   uuid: null },
  { name: 'LavaKing',      uuid: null },
  { name: 'EmeraldElf',    uuid: null },
];


/* ─────────────────────────────────────────
   2. SKIN URL HELPER
   Supports Java (Crafatar + UUID) and
   Bedrock/Geyser (mc-heads by gamertag).

   Geyser prefixes Bedrock names with "."
   and uses a special UUID range:
   00000000-0000-0000-xxxx-xxxxxxxxxxxx
───────────────────────────────────────── */
const FALLBACK_SKIN = 'https://mc-heads.net/avatar/MHF_Steve/32';

function getSkinUrl(name, uuid) {
  /* ── Bedrock via Geyser/Floodgate ── */
  const isGeyserUUID = uuid && uuid.startsWith('00000000-0000-0000-');
  const isGeyserName = name.startsWith('.');

  if (isGeyserUUID || isGeyserName) {
    /* Strip the leading dot Geyser adds, then look up by Xbox gamertag.
       mc-heads will show Steve if it can't find the Bedrock skin — that's
       the best we can do from a static site without a server-side XUID lookup. */
    const gamertag = name.startsWith('.') ? name.slice(1) : name;
    return `https://mc-heads.net/avatar/${encodeURIComponent(gamertag)}/32`;
  }

  /* ── Java with UUID (most accurate) ── */
  if (uuid) {
    /* Crafatar serves the face layer + hat overlay at any size */
    return `https://crafatar.com/avatars/${uuid}?size=32&overlay=true`;
  }

  /* ── Java by username only (fallback list) ── */
  return `https://mc-heads.net/avatar/${encodeURIComponent(name)}/32`;
}

/* Build the <img> tag with a Steve fallback on error */
function avatarImg(name, uuid) {
  const src = getSkinUrl(name, uuid);
  return `<img
    src="${src}"
    alt="${name}"
    width="28"
    height="28"
    class="player-skin"
    loading="lazy"
    onerror="this.onerror=null;this.src='${FALLBACK_SKIN}'"
  >`;
}


/* ─────────────────────────────────────────
   3. FLOATING BLOCKS (Hero Background)
───────────────────────────────────────── */
function initFloatingBlocks() {
  const blockColors = ['#4ade80', '#fbbf24', '#38bdf8', '#a78bfa', '#f472b6', '#f97316'];
  const container   = document.getElementById('blocksBg');
  if (!container) return;

  for (let i = 0; i < 18; i++) {
    const block    = document.createElement('div');
    const color    = blockColors[Math.floor(Math.random() * blockColors.length)];
    const size     = 16 + Math.random() * 20;
    const isCircle = Math.random() > 0.5;

    block.className               = 'block';
    block.style.left              = `${Math.random() * 100}%`;
    block.style.width             = `${size}px`;
    block.style.height            = `${size}px`;
    block.style.background        = color;
    block.style.animationDuration = `${8 + Math.random() * 14}s`;
    block.style.animationDelay    = `${Math.random() * 12}s`;
    block.style.borderRadius      = isCircle ? '50%' : '4px';

    container.appendChild(block);
  }
}


/* ─────────────────────────────────────────
   4. COPY IP
───────────────────────────────────────── */
function copyIP() {
  const btn  = document.getElementById('copyBtn');
  const icon = document.getElementById('copyIcon');
  const text = document.getElementById('copyText');

  navigator.clipboard.writeText(CONFIG.serverIP).catch(() => {
    const input = document.getElementById('ipInput');
    input.select();
    document.execCommand('copy');
  });

  btn.classList.add('copied');
  icon.textContent = '✓';
  text.textContent = 'Copied!';
  showToast();

  setTimeout(() => {
    btn.classList.remove('copied');
    icon.textContent = '📋';
    text.textContent = 'Copy IP';
  }, 2000);
}


/* ─────────────────────────────────────────
   5. TOAST NOTIFICATION
───────────────────────────────────────── */
function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}


/* ─────────────────────────────────────────
   6. MOBILE MENU
───────────────────────────────────────── */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

document.addEventListener('click', (e) => {
  const menu   = document.getElementById('mobileMenu');
  const burger = document.querySelector('.burger');
  if (
    menu.classList.contains('open') &&
    !menu.contains(e.target) &&
    !burger.contains(e.target)
  ) {
    menu.classList.remove('open');
  }
});


/* ─────────────────────────────────────────
   7. PLAYERS LIST
   Each player: { name, uuid }
   uuid can be null for the fallback list.
───────────────────────────────────────── */
function renderPlayers(list = PLAYERS) {
  const el = document.getElementById('playersList');
  if (!el) return;

  if (list.length === 0) {
    el.innerHTML = `
      <p class="no-players">
        No players online right now. Be the first to join!
      </p>`;
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
   8. ANIMATED COUNTERS
───────────────────────────────────────── */
function animateCount(el, target, duration) {
  if (!el) return;
  let start      = 0;
  const stepTime = 16;
  const step     = target / (duration / stepTime);

  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start).toLocaleString();
    if (start >= target) clearInterval(timer);
  }, stepTime);
}

function setCount(elId, value) {
  const el = document.getElementById(elId);
  if (el) el.textContent = value.toLocaleString();
}

function initCounters() { /* filled by fetchServerStatus */ }


/* ─────────────────────────────────────────
   9. SCROLL REVEAL
───────────────────────────────────────── */
function initScrollReveal() {
  const reveals  = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  reveals.forEach(el => observer.observe(el));
}


/* ─────────────────────────────────────────
   10. LIVE SERVER STATUS (mcstatus.io API)
───────────────────────────────────────── */
function setServerStatusBadge(isOnline) {
  const badge = document.querySelector('.hero-badge');
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
    if (!res.ok) throw new Error('API error ' + res.status);
    const data = await res.json();

    const isOnline    = data.online;
    const onlineCount = isOnline ? (data.players?.online ?? 0) : 0;
    const maxCount    = isOnline ? (data.players?.max    ?? 0) : 0;

    /* 1. Hero badge */
    setServerStatusBadge(isOnline);

    /* 2. Stat counters */
    animateCount(document.getElementById('onlineCount'), onlineCount, 800);
    animateCount(document.getElementById('totalCount'),  maxCount,    1000);

    /* 3. Live badge */
    const liveBadge = document.getElementById('liveBadge');
    if (liveBadge) liveBadge.textContent = `${onlineCount} / ${maxCount} online`;

    /* 4. Player list with real UUIDs → real skin faces */
    const apiList = data.players?.list ?? [];

    if (apiList.length > 0) {
      const livePlayers = apiList.map(p => ({
        name: p.name_clean ?? p.name,
        uuid: p.uuid ?? null,          /* UUID powers the Crafatar skin lookup */
      }));
      renderPlayers(livePlayers);

    } else if (onlineCount === 0) {
      renderPlayers([]);
    } else {
      /* Server online but hides the player sample — show fallback */
      renderPlayers(PLAYERS);
    }

    console.log(`[L0AD1NG SMP] ${onlineCount}/${maxCount} players online`);

  } catch (err) {
    console.warn('[L0AD1NG SMP] Could not reach mcstatus.io:', err);
    setServerStatusBadge(false);
    setCount('onlineCount', 0);
    const liveBadge = document.getElementById('liveBadge');
    if (liveBadge) liveBadge.textContent = 'Offline';
  }
}


/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initFloatingBlocks();
  initScrollReveal();
  initCounters();

  renderPlayers(PLAYERS);          /* show fallback skins instantly  */

  fetchServerStatus();             /* fetch live data immediately    */
  setInterval(fetchServerStatus, 60 * 1000); /* refresh every 60s   */
});