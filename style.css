/* ═══════════════════════════════════════════════════════════
   PrinterSync — Deadlock Simulator  |  style.css
   By Aarna  ·  Space Mono + Syne  ·  Vibrant Neon-Dark Theme
   Concept: Computers (💻) compete for Printers (🖨️)
═══════════════════════════════════════════════════════════ */

/* ── GOOGLE FONTS ── */
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');

/* ════════════════════════════════════════════════════
   CSS CUSTOM PROPERTIES
════════════════════════════════════════════════════ */
:root {
  /* ── DARK THEME (default) ── */
  --bg:            #080812;        /* deep void */
  --bg2:           #0d0d1f;
  --bg3:           #11112a;
  --surface:       rgba(255,255,255,0.035);
  --surface2:      rgba(255,255,255,0.065);
  --surface3:      rgba(255,255,255,0.10);
  --border:        rgba(255,255,255,0.07);
  --border-bright: rgba(255,255,255,0.14);
  --text:          #eceaf8;
  --text-muted:    #5e5c80;
  --text-soft:     #a09dbf;

  /* ── BRAND PALETTE ── */
  --purple:        #8b5cf6;        /* primary — computers */
  --purple-light:  #c4b5fd;
  --purple-dark:   #6d28d9;
  --cyan:          #22d3ee;        /* secondary — printers */
  --cyan-light:    #67e8f9;
  --cyan-dark:     #0891b2;
  --pink:          #f472b6;        /* accent */
  --pink-dark:     #db2777;
  --danger:        #fb4d6d;        /* deadlock red */
  --danger-glow:   rgba(251,77,109,0.5);
  --warn:          #f97316;        /* warning orange */
  --ok:            #10b981;        /* safe green */
  --ok-glow:       rgba(16,185,129,0.4);

  /* ── SEMANTIC ALIASES ── */
  --process-col:   var(--purple);
  --resource-col:  var(--cyan);

  /* ── GLOW SHADOWS ── */
  --glow-p:        0 0 20px rgba(139,92,246,0.55), 0 0 40px rgba(139,92,246,0.2);
  --glow-r:        0 0 20px rgba(34,211,238,0.5),  0 0 40px rgba(34,211,238,0.18);
  --glow-bad:      0 0 24px rgba(251,77,109,0.65), 0 0 48px rgba(251,77,109,0.25);
  --glow-ok:       0 0 20px rgba(16,185,129,0.5);
  --glow-pink:     0 0 20px rgba(244,114,182,0.5);

  /* ── LAYOUT ── */
  --panel-w:      270px;
  --header-h:      68px;
  --banner-h:      40px;
  --radius:        16px;
  --radius-sm:     10px;
  --radius-xs:      6px;

  /* ── TRANSITIONS ── */
  --transition:    0.35s cubic-bezier(0.4, 0, 0.2, 1);
  --spring:        0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ── LIGHT THEME OVERRIDES ── */
[data-theme="light"] {
  --bg:            #f5f3ff;
  --bg2:           #ede9fe;
  --bg3:           #ddd6fe;
  --surface:       rgba(255,255,255,0.72);
  --surface2:      rgba(255,255,255,0.88);
  --surface3:      rgba(255,255,255,0.96);
  --border:        rgba(109,40,217,0.12);
  --border-bright: rgba(109,40,217,0.22);
  --text:          #1e1b3a;
  --text-muted:    #7c72a0;
  --text-soft:     #5b5280;
  --purple:        #7c3aed;
  --purple-light:  #8b5cf6;
  --cyan:          #0891b2;
  --cyan-light:    #06b6d4;
  --glow-p:        0 0 14px rgba(124,58,237,0.3);
  --glow-r:        0 0 14px rgba(8,145,178,0.35);
  --glow-bad:      0 0 18px rgba(251,77,109,0.4);
}

/* ════════════════════════════════════════════════════
   RESET + BASE
════════════════════════════════════════════════════ */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0; padding: 0;
}

html, body {
  height: 100%;
  font-family: 'Space Mono', monospace;
  background: var(--bg);
  color: var(--text);
  overflow: hidden;
  transition: background var(--transition), color var(--transition);
}

/* ════════════════════════════════════════════════════
   ANIMATED BACKGROUND CANVAS
════════════════════════════════════════════════════ */
#bg-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0.28;
  pointer-events: none;
}

/* ════════════════════════════════════════════════════
   GLASSMORPHISM CARD
════════════════════════════════════════════════════ */
.glass {
  background: var(--surface);
  backdrop-filter: blur(22px) saturate(180%);
  -webkit-backdrop-filter: blur(22px) saturate(180%);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: border-color var(--transition), background var(--transition);
}
.glass:hover { border-color: var(--border-bright); }

/* ════════════════════════════════════════════════════
   HEADER
════════════════════════════════════════════════════ */
.site-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: var(--header-h);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: var(--surface);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border);
  transition: background var(--transition);
  gap: 12px;
}

/* ── Logo / brand ── */
.header-left { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }

.logo-wrap {
  position: relative;
  width: 40px; height: 44px;
  display: flex; align-items: center; justify-content: center;
}

.logo-icon {
  font-size: 26px;
  filter: drop-shadow(0 0 8px var(--cyan));
  animation: printer-wobble 4s ease-in-out infinite;
  position: relative; z-index: 1;
}

/* Paper strip that "feeds" out of the printer logo */
.logo-paper-strip {
  position: absolute;
  bottom: -2px; left: 50%;
  transform: translateX(-50%);
  width: 14px; height: 6px;
  background: var(--surface3);
  border-radius: 0 0 3px 3px;
  border: 1px solid var(--border-bright);
  animation: paper-feed 2.5s ease-in-out infinite;
}

@keyframes paper-feed {
  0%, 60%  { height: 2px; opacity: 0.4; }
  30%      { height: 10px; opacity: 1; }
  100%     { height: 2px; opacity: 0.4; }
}

@keyframes printer-wobble {
  0%,100% { transform: translateY(0); filter: drop-shadow(0 0 6px var(--cyan)); }
  50%     { transform: translateY(-2px); filter: drop-shadow(0 0 14px var(--cyan-light)); }
}

.header-titles {}
.site-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, var(--purple-light), var(--pink), var(--cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
}

.site-sub {
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  margin-top: 1px;
}

.author {
  color: var(--pink);
  font-style: italic;
  -webkit-text-fill-color: var(--pink);
}

/* ── Center ticker ── */
.header-center { flex: 1; display: flex; justify-content: center; }

.queue-ticker {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 0.65rem;
  color: var(--text-soft);
  max-width: 340px;
  transition: all var(--transition);
}

.ticker-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--ok);
  box-shadow: 0 0 6px var(--ok);
  flex-shrink: 0;
  animation: ticker-blink 2s ease-in-out infinite;
}

@keyframes ticker-blink {
  0%,100% { opacity: 1; }
  50%     { opacity: 0.3; }
}

/* ── Theme toggle ── */
.header-right { flex-shrink: 0; }

.theme-toggle {
  width: 44px; height: 44px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface2);
  cursor: pointer;
  font-size: 1.1rem;
  display: grid; place-items: center;
  transition: all var(--transition);
  color: var(--text);
}
.theme-toggle:hover {
  background: var(--purple);
  border-color: var(--purple);
  box-shadow: var(--glow-p);
  transform: rotate(25deg) scale(1.1);
}

/* ════════════════════════════════════════════════════
   STATUS BANNER
════════════════════════════════════════════════════ */
.status-banner {
  position: fixed;
  top: var(--header-h);
  left: 0; right: 0;
  z-index: 90;
  height: var(--banner-h);
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Syne', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  transition: background var(--transition), color var(--transition),
              border-color var(--transition);
  overflow: hidden;
}

/* Animated scanner line (idle state) */
.banner-scanner {
  position: absolute;
  top: 0; bottom: 0; left: -100%;
  width: 60%;
  background: linear-gradient(90deg, transparent, rgba(139,92,246,0.06), transparent);
  animation: scanner-sweep 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes scanner-sweep {
  0%   { left: -60%; }
  100% { left: 110%; }
}

.status-pill {
  font-size: 1rem;
  flex-shrink: 0;
}

/* Safe state */
.status-banner[data-status="safe"] {
  background: rgba(16,185,129,0.08);
  border-bottom-color: rgba(16,185,129,0.3);
  color: var(--ok);
}
.status-banner[data-status="safe"] .banner-scanner { display: none; }

/* Deadlock state */
.status-banner[data-status="deadlock"] {
  background: rgba(251,77,109,0.1);
  border-bottom-color: rgba(251,77,109,0.45);
  color: var(--danger);
  animation: banner-alarm 1.2s ease-in-out infinite;
}
.status-banner[data-status="deadlock"] .banner-scanner { display: none; }

@keyframes banner-alarm {
  0%,100% { background: rgba(251,77,109,0.07); }
  50%     { background: rgba(251,77,109,0.17); }
}

/* Warning state */
.status-banner[data-status="warn"] {
  background: rgba(249,115,22,0.08);
  border-bottom-color: rgba(249,115,22,0.35);
  color: var(--warn);
}

/* ════════════════════════════════════════════════════
   APP LAYOUT — 3-column grid
════════════════════════════════════════════════════ */
.app-layout {
  position: fixed;
  top: calc(var(--header-h) + var(--banner-h));
  left: 0; right: 0; bottom: 0;
  display: grid;
  grid-template-columns: var(--panel-w) 1fr var(--panel-w);
  gap: 10px;
  padding: 10px;
  z-index: 10;
  overflow: hidden;
}

/* ════════════════════════════════════════════════════
   SIDE PANELS (shared)
════════════════════════════════════════════════════ */
.control-panel,
.info-panel {
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

/* ── Panel section card ── */
.panel-section {
  background: var(--surface2);
  border-radius: var(--radius-sm);
  padding: 13px 12px;
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 9px;
  transition: border-color var(--transition), box-shadow var(--transition);
}
.panel-section:hover { border-color: var(--border-bright); }

/* Resolution section gets a danger tint */
.resolution-panel {
  border-color: rgba(251,77,109,0.25) !important;
  background: rgba(251,77,109,0.04) !important;
  animation: section-pulse 1.8s ease-in-out infinite;
}
@keyframes section-pulse {
  0%,100% { border-color: rgba(251,77,109,0.2); }
  50%     { border-color: rgba(251,77,109,0.4); }
}

/* ── Section title ── */
.section-title {
  font-family: 'Syne', sans-serif;
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 5px;
}

.danger-title { color: var(--danger) !important; opacity: 0.85; }

.title-icon { font-size: 0.75rem; }

/* ════════════════════════════════════════════════════
   BUTTONS
════════════════════════════════════════════════════ */
.btn {
  font-family: 'Space Mono', monospace;
  font-size: 0.69rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  padding: 10px 14px;           /* larger hit target */
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.22s ease;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

/* Ripple shimmer */
.btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}
.btn:hover::before { transform: translateX(100%); }

/* Click flash */
.btn::after {
  content: '';
  position: absolute; inset: 0;
  background: white; opacity: 0;
  transition: opacity 0.12s;
}
.btn:active::after { opacity: 0.08; }

.btn-icon { font-size: 0.85rem; line-height: 1; }

/* Computer button (Process) */
.btn-process {
  background: rgba(139,92,246,0.13);
  border-color: rgba(139,92,246,0.38);
  color: var(--purple-light);
  flex: 1;
}
.btn-process:hover {
  background: rgba(139,92,246,0.28);
  border-color: var(--purple);
  box-shadow: var(--glow-p);
  transform: translateY(-2px) scale(1.02);
}
.btn-process:active { transform: translateY(0) scale(0.98); }

/* Printer button (Resource) */
.btn-resource {
  background: rgba(34,211,238,0.09);
  border-color: rgba(34,211,238,0.32);
  color: var(--cyan-light);
  flex: 1;
}
.btn-resource:hover {
  background: rgba(34,211,238,0.22);
  border-color: var(--cyan);
  box-shadow: var(--glow-r);
  transform: translateY(-2px) scale(1.02);
}
.btn-resource:active { transform: translateY(0) scale(0.98); }

/* Edge / link button */
.btn-edge {
  background: rgba(255,255,255,0.05);
  border-color: var(--border-bright);
  color: var(--text-soft);
}
.btn-edge:hover {
  background: var(--surface3);
  color: var(--text);
  transform: translateY(-1px);
}

/* Detect jam button — gradient hero */
.btn-detect {
  background: linear-gradient(135deg,
    rgba(139,92,246,0.28) 0%,
    rgba(244,114,182,0.18) 100%);
  border-color: rgba(139,92,246,0.5);
  color: var(--purple-light);
  font-size: 0.72rem;
  padding: 12px 14px;
}
.btn-detect:hover {
  background: linear-gradient(135deg,
    rgba(139,92,246,0.45) 0%,
    rgba(244,114,182,0.32) 100%);
  border-color: var(--purple-light);
  box-shadow: var(--glow-p);
  transform: translateY(-2px);
}

/* Step trace button */
.btn-step {
  background: rgba(34,211,238,0.1);
  border-color: rgba(34,211,238,0.28);
  color: var(--cyan);
}
.btn-step:hover {
  background: rgba(34,211,238,0.22);
  box-shadow: var(--glow-r);
  transform: translateY(-1px);
}

/* Random scenario */
.btn-random {
  background: rgba(249,115,22,0.09);
  border-color: rgba(249,115,22,0.28);
  color: var(--warn);
}
.btn-random:hover {
  background: rgba(249,115,22,0.2);
  transform: translateY(-1px);
}

/* Reset / clear */
.btn-reset {
  background: rgba(255,255,255,0.03);
  border-color: var(--border);
  color: var(--text-muted);
}
.btn-reset:hover {
  color: var(--text);
  background: var(--surface2);
  transform: translateY(-1px);
}

/* Kill Job (terminate) */
.btn-terminate {
  background: rgba(251,77,109,0.12);
  border-color: rgba(251,77,109,0.35);
  color: var(--danger);
  flex: 1;
}
.btn-terminate:hover {
  background: rgba(251,77,109,0.26);
  box-shadow: var(--glow-bad);
  transform: translateY(-1px);
}

/* Preempt */
.btn-preempt {
  background: rgba(249,115,22,0.09);
  border-color: rgba(249,115,22,0.28);
  color: var(--warn);
  flex: 1;
}
.btn-preempt:hover {
  background: rgba(249,115,22,0.2);
  transform: translateY(-1px);
}

.full-btn { width: 100%; }

/* ── Button pair layout ── */
.btn-pair {
  display: flex;
  gap: 6px;
}

/* ════════════════════════════════════════════════════
   INPUTS / SELECTS
════════════════════════════════════════════════════ */
.sel,
.num-input {
  font-family: 'Space Mono', monospace;
  font-size: 0.7rem;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  color: var(--text);
  padding: 7px 9px;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  -webkit-appearance: none;
}
.sel:focus,
.num-input:focus {
  border-color: var(--purple);
  box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
}

.num-input { width: 58px; text-align: center; }
.full-sel  { width: 100%; }

.input-row {
  display: flex;
  align-items: center;
  gap: 7px;
}
.mt-sm { margin-top: 2px; }

.edge-form {
  display: flex;
  align-items: center;
  gap: 6px;
}
.edge-form .sel { flex: 1; }

.arrow-sym {
  color: var(--pink);
  font-size: 1rem;
  font-weight: 700;
  flex-shrink: 0;
}

.small-label {
  font-size: 0.62rem;
  color: var(--text-muted);
  flex: 1;
  line-height: 1.4;
}
.label-hint { color: var(--text-soft); font-style: italic; }

.hint {
  font-size: 0.6rem;
  color: var(--text-muted);
  font-style: italic;
  line-height: 1.5;
}
.resolve-hint { font-style: normal; color: var(--text-soft); }

/* ════════════════════════════════════════════════════
   NODE LIST (Device List)
════════════════════════════════════════════════════ */
.node-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-height: 150px;
  overflow-y: auto;
}

.node-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-radius: var(--radius-xs);
  font-size: 0.68rem;
  border: 1px solid transparent;
  transition: all 0.2s;
  animation: slide-in 0.25s ease;
}
.node-item.process-item {
  background: rgba(139,92,246,0.08);
  border-color: rgba(139,92,246,0.2);
  color: var(--purple-light);
}
.node-item.resource-item {
  background: rgba(34,211,238,0.07);
  border-color: rgba(34,211,238,0.2);
  color: var(--cyan-light);
}
.node-item:hover { transform: translateX(3px); }

.node-del {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 1px 3px;
  border-radius: 4px;
  transition: all 0.15s;
}
.node-del:hover {
  color: var(--danger);
  background: rgba(251,77,109,0.12);
}

@keyframes slide-in {
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* ════════════════════════════════════════════════════
   CANVAS WRAPPER
════════════════════════════════════════════════════ */
.canvas-wrapper {
  position: relative;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);
  overflow: hidden;
  backdrop-filter: blur(14px);
  transition: border-color var(--transition);
}
.canvas-wrapper:hover { border-color: var(--border-bright); }

.graph-svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* ── Empty state hint ── */
.canvas-empty-hint {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transition: opacity 0.35s;
  gap: 10px;
  text-align: center;
}

.hint-scene {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 2.2rem;
  animation: float 3s ease-in-out infinite;
}

.hint-arrow-anim {
  font-size: 1.2rem;
  color: var(--purple-light);
  opacity: 0.5;
  animation: arrow-ping 1.8s ease-in-out infinite;
}

@keyframes arrow-ping {
  0%,100% { opacity: 0.3; transform: scaleX(1); }
  50%     { opacity: 0.8; transform: scaleX(1.2); }
}

.hint-printer { filter: drop-shadow(0 0 8px var(--cyan)); }
.hint-computer { filter: drop-shadow(0 0 8px var(--purple)); }

.hint-title {
  font-family: 'Syne', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-soft);
}
.hint-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
  line-height: 1.7;
}
.hint-challenge {
  font-size: 0.65rem;
  color: var(--pink);
  font-style: italic;
  opacity: 0.7;
}

@keyframes float {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-10px); }
}

/* ── Canvas edge legend ── */
.canvas-legend {
  position: absolute;
  bottom: 12px; right: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.58rem;
  opacity: 0.6;
  pointer-events: none;
}
.legend-item { display: flex; align-items: center; gap: 5px; color: var(--text-muted); }
.alloc-legend  { color: var(--cyan); }
.req-legend    { color: var(--purple-light); }
.cycle-legend  { color: var(--danger); }

/* ════════════════════════════════════════════════════
   SVG NODE STYLES
════════════════════════════════════════════════════ */

/* Shared node shapes */
.node-circle {
  cursor: grab;
  transition: filter 0.2s, stroke-width 0.2s;
}
.node-circle:active { cursor: grabbing; }
.node-circle:hover  { filter: url(#glow); }

/* Computer (process) — circle */
.process-node {
  fill: rgba(139,92,246,0.14);
  stroke: var(--purple);
  stroke-width: 2;
}

/* Printer (resource) — rectangle */
.resource-node {
  fill: rgba(34,211,238,0.11);
  stroke: var(--cyan);
  stroke-width: 2;
}

/* Node text label */
.node-label {
  font-family: 'Syne', sans-serif;
  font-size: 10px;
  font-weight: 700;
  fill: var(--text);
  pointer-events: none;
  user-select: none;
  text-anchor: middle;
  dominant-baseline: middle;
}

/* Emoji icon inside nodes */
.node-emoji {
  font-size: 13px;
  pointer-events: none;
  user-select: none;
  text-anchor: middle;
  dominant-baseline: middle;
}

/* Printer instance dots */
.instance-dot {
  fill: var(--cyan);
  opacity: 0.75;
}

/* ── DEADLOCK highlight ── */
.node-deadlock {
  animation: deadlock-pulse 0.9s ease-in-out infinite;
}

@keyframes deadlock-pulse {
  0%,100% {
    filter: url(#glow);
    stroke: var(--danger);
    stroke-width: 2.5;
    fill-opacity: 0.2;
  }
  50% {
    filter: url(#glow-strong);
    stroke: #ff8fa3;
    stroke-width: 3.8;
    fill-opacity: 0.35;
  }
}

/* ── PRINTING animation (resource with active alloc edge) ── */
.resource-printing {
  animation: resource-print 1.4s ease-in-out infinite;
}

@keyframes resource-print {
  0%,100% {
    filter: url(#glow-print);
    stroke: var(--cyan-light);
    stroke-width: 2;
  }
  50% {
    filter: url(#glow-print);
    stroke: var(--cyan);
    stroke-width: 3;
  }
}

/* Paper coming out of printer node */
.print-paper {
  animation: print-paper-out 1.4s ease-in-out infinite;
  fill: var(--surface3);
  stroke: var(--cyan-light);
  stroke-width: 1;
}

@keyframes print-paper-out {
  0%   { transform: translateY(0);    opacity: 0; }
  20%  { opacity: 1; }
  70%  { transform: translateY(-14px); opacity: 0.8; }
  100% { transform: translateY(-18px); opacity: 0; }
}

/* ════════════════════════════════════════════════════
   SVG EDGE STYLES
════════════════════════════════════════════════════ */
.edge-line {
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  transition: stroke 0.3s, stroke-width 0.3s;
  animation: edge-appear 0.35s ease forwards;
}

/* Allocation edge: Printer → Computer (solid, cyan) */
.edge-alloc {
  stroke: var(--cyan);
  opacity: 0.7;
}

/* Request edge: Computer → Printer (dashed, purple) */
.edge-request {
  stroke: var(--purple-light);
  opacity: 0.65;
  stroke-dasharray: 6 4;
}

/* Cycle edge: JAMMED (red, animated) */
.edge-cycle {
  stroke: var(--danger);
  opacity: 1;
  stroke-dasharray: none;
  stroke-width: 2.5;
  animation: cycle-alarm 0.75s ease-in-out infinite;
}

@keyframes edge-appear {
  from { opacity: 0; stroke-dashoffset: 180; }
  to   { opacity: 1; stroke-dashoffset: 0; }
}

@keyframes cycle-alarm {
  0%,100% { opacity: 0.65; stroke-width: 2; }
  50%     { opacity: 1;    stroke-width: 3.2; filter: drop-shadow(0 0 4px var(--danger)); }
}

/* Arrow markers */
.arrowhead       { fill: var(--text-muted); }
.arrowhead-cycle { fill: var(--danger); }

/* ════════════════════════════════════════════════════
   TOOLTIP
════════════════════════════════════════════════════ */
.tooltip {
  position: absolute;
  background: rgba(8,8,18,0.94);
  border: 1px solid var(--border-bright);
  border-radius: 10px;
  padding: 9px 13px;
  font-size: 0.67rem;
  color: var(--text);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.18s;
  z-index: 60;
  max-width: 210px;
  line-height: 1.65;
  backdrop-filter: blur(14px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
.tooltip.visible { opacity: 1; }

[data-theme="light"] .tooltip {
  background: rgba(245,243,255,0.96);
}

/* ════════════════════════════════════════════════════
   DEADLOCK / JAM LIST
════════════════════════════════════════════════════ */
.deadlock-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.deadlock-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 11px;
  border-radius: var(--radius-xs);
  font-size: 0.7rem;
  font-weight: 700;
  background: rgba(251,77,109,0.1);
  border: 1px solid rgba(251,77,109,0.3);
  color: var(--danger);
  animation: slide-in 0.22s ease;
}
.deadlock-tag::before { content: '💻'; font-size: 0.8rem; }

.muted { font-size: 0.67rem; color: var(--text-muted); font-style: italic; }

/* ════════════════════════════════════════════════════
   STATS STRIP
════════════════════════════════════════════════════ */
.stats-strip {
  flex-direction: row !important;
  align-items: center;
  justify-content: space-around;
  padding: 10px 8px !important;
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-num {
  font-family: 'Syne', sans-serif;
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--purple-light);
  line-height: 1;
  transition: color 0.3s;
}

.stat-label {
  font-size: 0.55rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  text-align: center;
}

.stat-divider {
  width: 1px; height: 28px;
  background: var(--border);
}

/* ════════════════════════════════════════════════════
   SIMULATION LOG
════════════════════════════════════════════════════ */
.log-section { flex: 1; }

.sim-log {
  max-height: 220px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 3px;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.log-entry {
  font-size: 0.6rem;
  padding: 4px 9px;
  border-radius: var(--radius-xs);
  line-height: 1.55;
  border-left: 2px solid transparent;
  animation: slide-in 0.2s ease;
  transition: background 0.2s;
}
.log-entry:hover { background: var(--surface3); }

.log-info   { color: var(--text-muted); border-left-color: var(--border); }
.log-ok     { color: var(--ok);     border-left-color: var(--ok);     background: rgba(16,185,129,0.05); }
.log-warn   { color: var(--warn);   border-left-color: var(--warn);   background: rgba(249,115,22,0.05); }
.log-danger { color: var(--danger); border-left-color: var(--danger); background: rgba(251,77,109,0.07); }
.log-accent { color: var(--purple-light); border-left-color: var(--purple); background: rgba(139,92,246,0.06); }

/* ════════════════════════════════════════════════════
   MODAL — Step-by-Step
════════════════════════════════════════════════════ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4,4,12,0.72);
  backdrop-filter: blur(8px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fade-in 0.22s ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.modal {
  width: 500px;
  max-width: 95vw;
  padding: 26px 28px;
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: modal-spring 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-color: var(--border-bright) !important;
}

@keyframes modal-spring {
  from { opacity: 0; transform: translateY(32px) scale(0.93); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.modal-printer-icon { font-size: 1.8rem; flex-shrink: 0; }

.modal-title {
  font-family: 'Syne', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  color: var(--purple-light);
  line-height: 1.2;
}

.modal-sub {
  font-size: 0.62rem;
  color: var(--text-muted);
  margin-top: 3px;
  font-style: italic;
}

.step-content {
  font-size: 0.71rem;
  line-height: 1.75;
  min-height: 90px;
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  padding: 13px 14px;
  background: var(--surface2);
  transition: background 0.3s;
}

.step-highlight { color: var(--cyan-light); font-weight: 700; }
.step-cycle     { color: var(--danger); font-weight: 700; }
.step-ok        { color: var(--ok); font-weight: 700; }

/* Step progress bar */
.step-progress-track {
  height: 3px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
}
.step-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--purple), var(--cyan));
  border-radius: 3px;
  width: 0%;
  transition: width 0.3s ease;
}

.modal-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* ════════════════════════════════════════════════════
   SCROLLBAR
════════════════════════════════════════════════════ */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-bright); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--purple); }

/* ════════════════════════════════════════════════════
   RESPONSIVE
════════════════════════════════════════════════════ */
@media (max-width: 960px) {
  :root { --panel-w: 230px; }
}

@media (max-width: 768px) {
  .header-center { display: none; }
  :root { --panel-w: 200px; }
}
