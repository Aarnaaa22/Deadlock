/**
 * ══════════════════════════════════════════════════════════
 *  PrinterSync — Deadlock Simulator  |  script.js
 *  By Aarna
 *
 *  Concept: Computers (💻 Processes) compete for Printers
 *  (🖨️ Resources). When a circular wait forms, printers jam.
 *
 *  CORE LOGIC UNCHANGED — only UI text, labels, tooltips,
 *  node rendering (emoji icons), and printer animation added.
 *
 *  Handles:
 *   · Graph state management
 *   · RAG rendering (SVG nodes + edges)
 *   · DFS-based cycle / deadlock detection
 *   · Step-by-step trace simulation
 *   · Deadlock resolution (terminate / preempt)
 *   · Drag-and-drop node movement
 *   · Tooltip system
 *   · Animated background canvas
 *   · Live stats strip + queue ticker
 * ══════════════════════════════════════════════════════════
 */

/* ─────────────────────────────────────────────────────────
   GRAPH STATE
   processes = Computers  |  resources = Printers
───────────────────────────────────────────────────────── */
const state = {
  processes: [],   // { id, x, y }        — Computers
  resources: [],   // { id, x, y, instances } — Printers
  edges: [],       // { from, to, type: 'alloc'|'request' }
  deadlocked: [],  // process (computer) ids in deadlock
  processCount: 0,
  resourceCount: 0,
};

/* ─────────────────────────────────────────────────────────
   DOM REFERENCES
───────────────────────────────────────────────────────── */
const svg               = document.getElementById('graphSvg');
const edgesGroup        = document.getElementById('edgesGroup');
const nodesGroup        = document.getElementById('nodesGroup');
const edgeFrom          = document.getElementById('edgeFrom');
const edgeTo            = document.getElementById('edgeTo');
const nodeListEl        = document.getElementById('nodeList');
const deadlockList      = document.getElementById('deadlockList');
const simLog            = document.getElementById('simLog');
const statusBanner      = document.getElementById('statusBanner');
const statusText        = document.getElementById('statusText');
const statusIcon        = document.getElementById('statusIcon');
const canvasHint        = document.getElementById('canvasHint');
const tooltip           = document.getElementById('tooltip');
const resolutionSection = document.getElementById('resolutionSection');
const resolveTarget     = document.getElementById('resolveTarget');
const stepModal         = document.getElementById('stepModal');
const stepContent       = document.getElementById('stepContent');
const tickerText        = document.getElementById('tickerText');
const statComputers     = document.getElementById('statComputers');
const statPrinters      = document.getElementById('statPrinters');
const statEdges         = document.getElementById('statEdges');

/* ─────────────────────────────────────────────────────────
   ANIMATED BACKGROUND CANVAS
   Drifting particles + grid lines
───────────────────────────────────────────────────────── */
(function initBgCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function spawnParticles() {
    particles = [];
    const count = Math.floor((W * H) / 20000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r:  Math.random() * 1.6 + 0.4,
        // alternate between purple and cyan tones
        hue: Math.random() < 0.5 ? 'purple' : 'cyan',
      });
    }
  }

  function drawGrid() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    ctx.strokeStyle = isDark
      ? 'rgba(139,92,246,0.055)'
      : 'rgba(109,40,217,0.045)';
    ctx.lineWidth = 1;
    const step = 55;
    for (let x = 0; x < W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      const col = p.hue === 'purple'
        ? (isDark ? 'rgba(139,92,246,0.55)' : 'rgba(109,40,217,0.3)')
        : (isDark ? 'rgba(34,211,238,0.45)'  : 'rgba(8,145,178,0.3)');

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
    });

    requestAnimationFrame(frame);
  }

  resize(); spawnParticles(); frame();
  window.addEventListener('resize', () => { resize(); spawnParticles(); });
})();

/* ─────────────────────────────────────────────────────────
   THEME TOGGLE (dark ↔ light)
───────────────────────────────────────────────────────── */
document.getElementById('themeToggle').addEventListener('click', () => {
  const html   = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('toggleIcon').textContent = isDark ? '☀' : '☽';
  log(`Display mode switched to ${isDark ? 'light' : 'dark'}`, 'info');
});

/* ─────────────────────────────────────────────────────────
   LOGGING — print queue log panel
───────────────────────────────────────────────────────── */
function log(msg, type = 'info') {
  const div = document.createElement('div');
  div.className = `log-entry log-${type}`;
  const ts = new Date().toLocaleTimeString('en-US', {
    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  div.textContent = `[${ts}] ${msg}`;
  simLog.prepend(div);
  while (simLog.children.length > 60) simLog.removeChild(simLog.lastChild);
}

/* ─────────────────────────────────────────────────────────
   STATS STRIP + TICKER — live counts
───────────────────────────────────────────────────────── */
function updateStats() {
  const nP = state.processes.length;
  const nR = state.resources.length;
  const nE = state.edges.length;
  statComputers.textContent = nP;
  statPrinters.textContent  = nR;
  statEdges.textContent     = nE;

  // Update header ticker
  if (nP === 0 && nR === 0) {
    tickerText.textContent = 'System idle — no devices connected';
  } else {
    const allocCount   = state.edges.filter(e => e.type === 'alloc').length;
    const requestCount = state.edges.filter(e => e.type === 'request').length;
    tickerText.textContent =
      `${nP} computer${nP !== 1 ? 's' : ''} · ${nR} printer${nR !== 1 ? 's' : ''} · ` +
      `${allocCount} printing · ${requestCount} waiting`;
  }
}

/* ─────────────────────────────────────────────────────────
   GEOMETRY HELPERS
───────────────────────────────────────────────────────── */
function getNodePos(id) {
  const n = [...state.processes, ...state.resources].find(n => n.id === id);
  return n ? { x: n.x, y: n.y } : null;
}

function isProcess(id)  { return id.startsWith('P'); }
function isResource(id) { return id.startsWith('R'); }

/**
 * Compute edge endpoints so arrows start/end at node borders,
 * not node centres. Unchanged from original logic.
 */
function edgeEndpoints(fromId, toId) {
  const from = getNodePos(fromId);
  const to   = getNodePos(toId);
  if (!from || !to) return null;

  const dx   = to.x - from.x, dy = to.y - from.y;
  const dist = Math.hypot(dx, dy) || 1;
  const ux   = dx / dist, uy = dy / dist;

  const rFrom = isProcess(fromId) ? 28 : 24;
  const rTo   = isProcess(toId)   ? 30 : 26;

  return {
    x1: from.x + ux * rFrom,
    y1: from.y + uy * rFrom,
    x2: to.x   - ux * rTo,
    y2: to.y   - uy * rTo,
  };
}

/* ─────────────────────────────────────────────────────────
   MAIN RENDER
───────────────────────────────────────────────────────── */
function render() {
  // Toggle empty-state hint
  const hasNodes = state.processes.length + state.resources.length > 0;
  canvasHint.style.opacity       = hasNodes ? '0' : '1';
  canvasHint.style.pointerEvents = hasNodes ? 'none' : 'auto';

  renderEdges();
  renderNodes();
  updateSelects();
  updateNodeList();
  updateStats();
}

/* ── RENDER EDGES ── */
function renderEdges() {
  edgesGroup.innerHTML = '';

  state.edges.forEach((edge, idx) => {
    const pts = edgeEndpoints(edge.from, edge.to);
    if (!pts) return;

    // Is this edge part of the deadlock cycle?
    const isCycle = state.deadlocked.length > 0 &&
                    state.deadlocked.includes(isProcess(edge.from) ? edge.from : edge.to) &&
                    state.deadlocked.includes(isProcess(edge.to)   ? edge.to   : edge.from);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', pts.x1); line.setAttribute('y1', pts.y1);
    line.setAttribute('x2', pts.x2); line.setAttribute('y2', pts.y2);
    line.setAttribute('marker-end', isCycle ? 'url(#arrow-cycle)' : 'url(#arrow)');
    line.setAttribute('class',
      `edge-line ${isCycle
        ? 'edge-cycle'
        : edge.type === 'alloc' ? 'edge-alloc' : 'edge-request'}`
    );
    line.dataset.idx = idx;

    // ── Printer-themed edge tooltips ──
    const tipText = edge.type === 'alloc'
      ? `🖨️ ${edge.from} → 💻 ${edge.to}\nPrinting in progress 🖨️`
      : `💻 ${edge.from} → 🖨️ ${edge.to}\nWaiting for printer ⏳`;

    line.addEventListener('mouseenter', (e) => showTooltip(e, tipText));
    line.addEventListener('mousemove',  moveTooltip);
    line.addEventListener('mouseleave', hideTooltip);

    edgesGroup.appendChild(line);
  });
}

/* ── RENDER NODES ── */
function renderNodes() {
  nodesGroup.innerHTML = '';

  /* ── Computers (Processes) — circles ── */
  state.processes.forEach(p => {
    const isDeadlocked = state.deadlocked.includes(p.id);
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${p.x},${p.y})`);
    g.style.cursor = 'grab';

    // Circle body
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', 28);
    circle.setAttribute('class',
      `node-circle process-node${isDeadlocked ? ' node-deadlock' : ''}`);
    if (isDeadlocked) circle.setAttribute('filter', 'url(#glow-strong)');

    // Emoji icon (💻) — positioned above centre
    const emoji = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    emoji.setAttribute('class', 'node-emoji');
    emoji.setAttribute('y', '-7');
    emoji.textContent = '💻';

    // Label (P1, P2…) — below emoji
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('class', 'node-label');
    label.setAttribute('y', '11');
    label.textContent = p.id;
    if (isDeadlocked) label.setAttribute('fill', '#fb4d6d');

    g.appendChild(circle);
    g.appendChild(emoji);
    g.appendChild(label);

    makeDraggable(g, p);
    addNodeTooltip(g, p, 'computer');

    nodesGroup.appendChild(g);
  });

  /* ── Printers (Resources) — rectangles ── */
  state.resources.forEach(r => {
    const isDeadlocked  = state.deadlocked.includes(r.id);
    // Is this printer actively printing (has an allocation edge)?
    const isPrinting    = state.edges.some(e => e.from === r.id && e.type === 'alloc');

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${r.x},${r.y})`);
    g.style.cursor = 'grab';

    // Rectangle body
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', -28); rect.setAttribute('y', -24);
    rect.setAttribute('width', 56); rect.setAttribute('height', 48);
    rect.setAttribute('rx', 9);    rect.setAttribute('ry', 9);
    rect.setAttribute('class',
      `node-circle resource-node` +
      `${isDeadlocked ? ' node-deadlock' : ''}` +
      `${isPrinting && !isDeadlocked ? ' resource-printing' : ''}`
    );
    if (isDeadlocked)              rect.setAttribute('filter', 'url(#glow-strong)');
    else if (isPrinting)           rect.setAttribute('filter', 'url(#glow-print)');

    // Emoji icon (🖨️) — positioned above centre
    const emoji = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    emoji.setAttribute('class', 'node-emoji');
    emoji.setAttribute('y', '-8');
    emoji.textContent = '🖨️';

    // Label (R1, R2…)
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('class', 'node-label');
    label.setAttribute('y', '9');
    label.textContent = r.id;
    if (isDeadlocked) label.setAttribute('fill', '#fb4d6d');

    g.appendChild(rect);
    g.appendChild(emoji);
    g.appendChild(label);

    // ── Print slots (instance dots) — below rect ──
    const inst     = r.instances || 1;
    const dotR     = 3.5, spacing = 9;
    const totalW   = (inst - 1) * spacing;
    for (let i = 0; i < inst; i++) {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', -totalW / 2 + i * spacing);
      dot.setAttribute('cy', 20);
      dot.setAttribute('r', dotR);
      dot.setAttribute('class', 'instance-dot');
      g.appendChild(dot);
    }

    // ── "Paper coming out" animation when actively printing ──
    if (isPrinting && !isDeadlocked) {
      const paper = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      paper.setAttribute('x', -8);  paper.setAttribute('y', -28);
      paper.setAttribute('width', 16); paper.setAttribute('height', 10);
      paper.setAttribute('rx', 2); paper.setAttribute('ry', 2);
      paper.setAttribute('class', 'print-paper');
      g.appendChild(paper);
    }

    makeDraggable(g, r);
    addNodeTooltip(g, r, 'printer');

    nodesGroup.appendChild(g);
  });
}

/* ─────────────────────────────────────────────────────────
   DRAG AND DROP — same logic, unchanged
───────────────────────────────────────────────────────── */
function makeDraggable(g, nodeData) {
  let dragging = false, startX, startY, origX, origY;

  g.addEventListener('mousedown', (e) => {
    dragging = true;
    startX = e.clientX; startY = e.clientY;
    origX  = nodeData.x; origY = nodeData.y;
    g.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const svgRect = svg.getBoundingClientRect();
    const scaleX  = (svg.viewBox.baseVal.width  || svgRect.width)  / svgRect.width;
    const scaleY  = (svg.viewBox.baseVal.height || svgRect.height) / svgRect.height;
    nodeData.x = origX + (e.clientX - startX) * scaleX;
    nodeData.y = origY + (e.clientY - startY) * scaleY;
    renderEdges();
    g.setAttribute('transform', `translate(${nodeData.x},${nodeData.y})`);
  });

  window.addEventListener('mouseup', () => {
    if (dragging) { dragging = false; g.style.cursor = 'grab'; }
  });
}

/* ─────────────────────────────────────────────────────────
   TOOLTIP SYSTEM
───────────────────────────────────────────────────────── */
function addNodeTooltip(g, nodeData, type) {
  g.addEventListener('mouseenter', (e) => {
    let info = '';
    if (type === 'computer') {
      const allocatedFrom = state.edges
        .filter(ed => ed.to === nodeData.id && ed.type === 'alloc')
        .map(ed => ed.from).join(', ') || 'none';
      const waitingFor = state.edges
        .filter(ed => ed.from === nodeData.id && ed.type === 'request')
        .map(ed => ed.to).join(', ') || 'none';
      info =
        `💻 Computer: ${nodeData.id}\n` +
        `🖨️ Printing on: ${allocatedFrom}\n` +
        `⏳ Waiting for: ${waitingFor}`;
    } else {
      const assignedTo = state.edges
        .filter(ed => ed.from === nodeData.id && ed.type === 'alloc')
        .map(ed => ed.to).join(', ') || 'idle';
      const requestedBy = state.edges
        .filter(ed => ed.to === nodeData.id && ed.type === 'request')
        .map(ed => ed.from).join(', ') || 'none';
      const status = assignedTo !== 'idle' ? '🖨️ Printing...' : '💤 Idle';
      info =
        `🖨️ Printer: ${nodeData.id}\n` +
        `📋 Slots: ${nodeData.instances}\n` +
        `✅ Assigned to: ${assignedTo}\n` +
        `⏳ Queued: ${requestedBy}\n` +
        `Status: ${status}`;
    }
    showTooltip(e, info);
  });
  g.addEventListener('mousemove',  moveTooltip);
  g.addEventListener('mouseleave', hideTooltip);
}

function showTooltip(e, text) {
  tooltip.innerHTML = text.replace(/\n/g, '<br/>');
  tooltip.classList.add('visible');
  moveTooltip(e);
}
function moveTooltip(e) {
  const wrapper = document.querySelector('.canvas-wrapper').getBoundingClientRect();
  let tx = e.clientX - wrapper.left + 14;
  let ty = e.clientY - wrapper.top  + 14;
  // Keep inside wrapper bounds
  if (tx + 220 > wrapper.width)  tx = e.clientX - wrapper.left - 230;
  if (ty + 100 > wrapper.height) ty = e.clientY - wrapper.top  - 110;
  tooltip.style.left = tx + 'px';
  tooltip.style.top  = ty + 'px';
}
function hideTooltip() { tooltip.classList.remove('visible'); }

/* ─────────────────────────────────────────────────────────
   SVG VIEWBOX — auto-resize with canvas
───────────────────────────────────────────────────────── */
function updateViewBox() {
  const wrapper = document.querySelector('.canvas-wrapper');
  const { width, height } = wrapper.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
}
window.addEventListener('resize', () => { updateViewBox(); render(); });
updateViewBox();

/* ─────────────────────────────────────────────────────────
   NODE SPAWN POSITIONS — circular spread
───────────────────────────────────────────────────────── */
function getSpawnPosition(index, total) {
  const wrapper = document.querySelector('.canvas-wrapper');
  const { width, height } = wrapper.getBoundingClientRect();
  const cx = width / 2, cy = height / 2;
  const radius = Math.min(width, height) * 0.34;
  if (total <= 1) return { x: cx, y: cy };
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

/* ─────────────────────────────────────────────────────────
   ADD NODES — Computers + Printers
───────────────────────────────────────────────────────── */
document.getElementById('addProcessBtn').addEventListener('click', () => {
  state.processCount++;
  const id  = `P${state.processCount}`;
  const pos = getSpawnPosition(state.processes.length, state.processes.length + 1);
  state.processes.push({ id, x: pos.x, y: pos.y });
  log(`💻 Computer ${id} connected to network`, 'accent');
  clearDeadlock();
  render();
});

document.getElementById('addResourceBtn').addEventListener('click', () => {
  state.resourceCount++;
  const id        = `R${state.resourceCount}`;
  const instances = parseInt(document.getElementById('resourceInstances').value) || 1;
  const pos       = getSpawnPosition(state.resources.length, state.resources.length + 1);
  state.resources.push({ id, x: pos.x, y: pos.y, instances });
  log(`🖨️ Printer ${id} added (${instances} print slot${instances > 1 ? 's' : ''})`, 'accent');
  clearDeadlock();
  render();
});

function removeNode(id) {
  if (isProcess(id)) {
    state.processes = state.processes.filter(p => p.id !== id);
  } else {
    state.resources = state.resources.filter(r => r.id !== id);
  }
  state.edges = state.edges.filter(e => e.from !== id && e.to !== id);
  const label = isProcess(id) ? `💻 Computer ${id}` : `🖨️ Printer ${id}`;
  log(`${label} removed — related connections cleared`, 'warn');
  clearDeadlock();
  render();
}

/* ─────────────────────────────────────────────────────────
   ADD EDGE — link computer ↔ printer
───────────────────────────────────────────────────────── */
document.getElementById('addEdgeBtn').addEventListener('click', () => {
  const from = edgeFrom.value;
  const to   = edgeTo.value;

  if (!from || !to || from === to)
    return alert('Please select two different devices to connect.');

  if (isProcess(from) && isProcess(to))
    return alert('You cannot link two computers directly.\nA computer must connect to a printer.');

  if (isResource(from) && isResource(to))
    return alert('You cannot link two printers directly.\nA printer must connect to a computer.');

  const type = isResource(from) ? 'alloc' : 'request';

  if (state.edges.find(e => e.from === from && e.to === to))
    return alert('This connection already exists.');

  // Check allocation limit for printers
  if (type === 'alloc') {
    const res       = state.resources.find(r => r.id === from);
    const allocated = state.edges.filter(e => e.from === from && e.type === 'alloc').length;
    if (allocated >= res.instances) {
      return alert(
        `Printer ${from} has ${res.instances} slot(s) — all currently in use.\n` +
        `Free a slot or increase the printer's capacity.`
      );
    }
  }

  state.edges.push({ from, to, type });
  const msg = type === 'alloc'
    ? `🖨️ ${from} is now printing for 💻 ${to}`
    : `💻 ${from} is waiting for 🖨️ ${to}`;
  log(msg, 'info');
  clearDeadlock();
  render();
});

/* ─────────────────────────────────────────────────────────
   SELECT DROPDOWNS — keep in sync with node list
───────────────────────────────────────────────────────── */
function updateSelects() {
  const allNodes = [
    ...state.processes.map(p => p.id),
    ...state.resources.map(r => r.id),
  ];
  [edgeFrom, edgeTo].forEach(sel => {
    const prev = sel.value;
    sel.innerHTML = allNodes
      .map(id => {
        const label = isProcess(id) ? `💻 ${id}` : `🖨️ ${id}`;
        return `<option value="${id}">${label}</option>`;
      })
      .join('');
    if (allNodes.includes(prev)) sel.value = prev;
  });
}

/* ── Device list (sidebar) ── */
function updateNodeList() {
  nodeListEl.innerHTML = '';
  [...state.processes, ...state.resources].forEach(n => {
    const type = isProcess(n.id) ? 'process' : 'resource';
    const icon = isProcess(n.id) ? '💻' : '🖨️';
    const div  = document.createElement('div');
    div.className = `node-item ${type}-item`;
    div.innerHTML = `
      <span>${icon} ${n.id}${isResource(n.id) ? ` <small>(×${n.instances})</small>` : ''}</span>
      <button class="node-del" data-id="${n.id}" title="Remove device">✕</button>
    `;
    nodeListEl.appendChild(div);
  });

  nodeListEl.querySelectorAll('.node-del').forEach(btn => {
    btn.addEventListener('click', () => removeNode(btn.dataset.id));
  });
}

/* ─────────────────────────────────────────────────────────
   DEADLOCK DETECTION — DFS cycle detection (UNCHANGED)
   Processes = Computers | Resources = Printers
───────────────────────────────────────────────────────── */

/** Build adjacency list from current edge set */
function buildAdjacency() {
  const adj = {};
  [...state.processes, ...state.resources].forEach(n => (adj[n.id] = []));
  state.edges.forEach(e => { adj[e.from].push(e.to); });
  return adj;
}

/**
 * Find all directed cycles using DFS.
 * Returns array of cycles (each = array of node IDs).
 * Logic unchanged from original.
 */
function findCycles() {
  const adj      = buildAdjacency();
  const all      = [
    ...state.processes.map(p => p.id),
    ...state.resources.map(r => r.id),
  ];
  const visited  = new Set();
  const recStack = new Set();
  const cycles   = [];

  function dfs(node, path) {
    visited.add(node);
    recStack.add(node);
    path.push(node);

    for (const neighbor of (adj[node] || [])) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, path);
      } else if (recStack.has(neighbor)) {
        cycles.push(path.slice(path.indexOf(neighbor)));
      }
    }

    path.pop();
    recStack.delete(node);
  }

  all.forEach(node => { if (!visited.has(node)) dfs(node, []); });
  return cycles;
}

/** Run full deadlock detection and update UI */
function detectDeadlock() {
  const cycles = findCycles();
  clearDeadlock();

  if (cycles.length === 0) {
    // ── No jam ──
    setStatus('safe', '💚', '💚 All print jobs completed successfully!');
    log('✅ No circular wait found — print queue is clear!', 'ok');
    deadlockList.innerHTML = '<span class="muted">✅ No jams — all printers running smoothly</span>';
    resolutionSection.style.display = 'none';
    return;
  }

  // ── Collect jammed computers (processes) ──
  const deadlockedSet = new Set();
  cycles.forEach(cycle => {
    cycle.forEach(id => { if (isProcess(id)) deadlockedSet.add(id); });
  });

  // ── Single-instance vs multi-instance check ──
  const cycleNodes        = new Set(cycles.flat());
  const hasMultiInstance  = state.resources.some(
    r => cycleNodes.has(r.id) && r.instances > 1
  );

  if (hasMultiInstance) {
    setStatus('warn', '🟡', '🟡 Printer queue congestion detected...');
    log('⚠️ Cycle with multi-slot printer — possible jam (not guaranteed)', 'warn');
    log(`Computers involved: ${[...deadlockedSet].join(', ')}`, 'warn');
  } else {
    setStatus('deadlock', '🔴', '🔴 Printers are jammed! Jobs are stuck in a loop!');
    log('🚨 PRINTER JAM! Circular wait confirmed — system halted', 'danger');
    log(`Jammed computers: ${[...deadlockedSet].join(', ')}`, 'danger');
  }

  state.deadlocked = [...deadlockedSet];

  // ── Jammed computers list ──
  deadlockList.innerHTML = '';
  state.deadlocked.forEach(id => {
    const tag = document.createElement('div');
    tag.className = 'deadlock-tag';
    tag.textContent = `${id} — stuck in print loop`;
    deadlockList.appendChild(tag);
  });

  // ── Show resolution panel ──
  resolutionSection.style.display = 'block';
  resolveTarget.innerHTML = state.deadlocked
    .map(id => `<option value="${id}">💻 ${id}</option>`)
    .join('');

  render(); // re-render to show red highlights + print animations
}

function clearDeadlock() {
  state.deadlocked = [];
  setStatus('idle', '💤', 'Press "Detect Printer Jam" to analyse the print queue');
  deadlockList.innerHTML = '<span class="muted">✅ No jams detected yet</span>';
  resolutionSection.style.display = 'none';
}

function setStatus(type, icon, text) {
  statusBanner.setAttribute('data-status', type);
  statusIcon.textContent = icon;
  statusText.textContent = text;
}

document.getElementById('detectBtn').addEventListener('click', detectDeadlock);

/* ─────────────────────────────────────────────────────────
   DEADLOCK RESOLUTION
───────────────────────────────────────────────────────── */

/** Kill Job: remove the computer entirely */
document.getElementById('terminateBtn').addEventListener('click', () => {
  const target = resolveTarget.value;
  if (!target) return;
  log(`✕ Job killed — 💻 ${target} forcibly shut down and removed`, 'warn');
  removeNode(target);
  detectDeadlock();
});

/** Preempt: reclaim all printers assigned to this computer */
document.getElementById('preemptBtn').addEventListener('click', () => {
  const target  = resolveTarget.value;
  if (!target) return;
  const removed = state.edges.filter(e => e.to === target && e.type === 'alloc');
  state.edges   = state.edges.filter(e => !(e.to === target && e.type === 'alloc'));
  log(`⇥ Preempted: ${removed.length} printer(s) reclaimed from 💻 ${target}`, 'warn');
  removed.forEach(e => log(`  ↳ 🖨️ ${e.from} returned to pool`, 'info'));
  detectDeadlock();
  render();
});

/* ─────────────────────────────────────────────────────────
   RESET — clear everything
───────────────────────────────────────────────────────── */
document.getElementById('resetBtn').addEventListener('click', () => {
  state.processes     = [];
  state.resources     = [];
  state.edges         = [];
  state.deadlocked    = [];
  state.processCount  = 0;
  state.resourceCount = 0;
  clearDeadlock();
  log('⟳ Print queue cleared — all devices removed', 'info');
  render();
});

/* ─────────────────────────────────────────────────────────
   RANDOM SCENARIO GENERATOR
   Always produces a deadlock (for demo purposes)
───────────────────────────────────────────────────────── */
document.getElementById('randomBtn').addEventListener('click', () => {
  // Reset state
  state.processes = []; state.resources = [];
  state.edges = []; state.deadlocked = [];
  state.processCount = 0; state.resourceCount = 0;

  updateViewBox();
  const wrapper = document.querySelector('.canvas-wrapper');
  const { width, height } = wrapper.getBoundingClientRect();

  const numP = 3 + Math.floor(Math.random() * 2); // 3–4 computers
  const numR = 3 + Math.floor(Math.random() * 2); // 3–4 printers

  // Computers — outer ring
  for (let i = 0; i < numP; i++) {
    state.processCount++;
    const angle = (i / numP) * Math.PI * 2 - Math.PI / 2;
    state.processes.push({
      id: `P${state.processCount}`,
      x:  width  / 2 + Math.cos(angle) * width  * 0.3,
      y:  height / 2 + Math.sin(angle) * height * 0.3,
    });
  }

  // Printers — inner ring
  for (let i = 0; i < numR; i++) {
    state.resourceCount++;
    const angle = (i / numR) * Math.PI * 2;
    const inst  = Math.random() < 0.3 ? 2 : 1;
    state.resources.push({
      id: `R${state.resourceCount}`,
      x:  width  / 2 + Math.cos(angle) * width  * 0.14,
      y:  height / 2 + Math.sin(angle) * height * 0.14,
      instances: inst,
    });
  }

  const pIds = state.processes.map(p => p.id);
  const rIds = state.resources.map(r => r.id);

  // Create circular wait: P1→R1, R1→P2, P2→R2, R2→P1
  state.edges.push({ from: pIds[0], to: rIds[0], type: 'request' }); // P1 wants R1
  state.edges.push({ from: rIds[0], to: pIds[1], type: 'alloc'   }); // R1 printing for P2
  state.edges.push({ from: pIds[1], to: rIds[1], type: 'request' }); // P2 wants R2
  state.edges.push({ from: rIds[1], to: pIds[0], type: 'alloc'   }); // R2 printing for P1

  // Extra non-cycle edge (P3 with R3)
  if (numP >= 3 && numR >= 3) {
    state.edges.push({ from: pIds[2], to: rIds[2], type: 'request' });
    state.edges.push({ from: rIds[2], to: pIds[2], type: 'alloc'   });
  }

  log('🎲 Random print scenario loaded (deadlock included!)', 'accent');
  render();
  setTimeout(detectDeadlock, 420);
});

/* ─────────────────────────────────────────────────────────
   STEP-BY-STEP TRACE — DFS walk visualised in modal
   Logic unchanged; microcopy updated to printer context
───────────────────────────────────────────────────────── */
let stepState = null;

document.getElementById('stepBtn').addEventListener('click', () => {
  if (state.processes.length === 0)
    return alert('Add some computers and printers first!');

  const adj   = buildAdjacency();
  const all   = [
    ...state.processes.map(p => p.id),
    ...state.resources.map(r => r.id),
  ];

  const steps = [];
  steps.push({
    text: `<span class="step-highlight">🔍 Starting print-job trace (DFS)...</span><br/>` +
          `Devices in network: ${all.map(id =>
            isProcess(id) ? `💻${id}` : `🖨️${id}`
          ).join(', ')}`,
  });

  const visited    = new Set();
  const recStack   = new Set();
  const foundCycles = [];

  function dfsStep(node, path) {
    visited.add(node);
    recStack.add(node);
    path.push(node);

    const nodeLabel = isProcess(node) ? `💻 ${node}` : `🖨️ ${node}`;
    steps.push({
      text: `Tracing <span class="step-highlight">${nodeLabel}</span> ` +
            `| path: ${path.map(id => isProcess(id) ? `💻${id}` : `🖨️${id}`).join(' → ')}`,
    });

    for (const nb of (adj[node] || [])) {
      const nbLabel = isProcess(nb) ? `💻 ${nb}` : `🖨️ ${nb}`;
      if (!visited.has(nb)) {
        steps.push({
          text: `&nbsp;&nbsp;Following connection: ` +
                `<span class="step-highlight">${nodeLabel} → ${nbLabel}</span> (not yet visited)`,
        });
        dfsStep(nb, path);
      } else if (recStack.has(nb)) {
        const cycle = path.slice(path.indexOf(nb));
        foundCycles.push(cycle);
        steps.push({
          text: `&nbsp;&nbsp;🚨 Back-edge found: <span class="step-highlight">${nodeLabel} → ${nbLabel}</span><br/>` +
                `&nbsp;&nbsp;<span class="step-cycle">CIRCULAR WAIT: ` +
                `${cycle.map(id => isProcess(id) ? `💻${id}` : `🖨️${id}`).join(' → ')} → ${nbLabel}</span><br/>` +
                `&nbsp;&nbsp;Print jobs are stuck in a loop — this is a JAM!`,
        });
      } else {
        steps.push({
          text: `&nbsp;&nbsp;Skipping <span class="step-highlight">${nodeLabel} → ${nbLabel}</span> ` +
                `— already visited (no new cycle)`,
        });
      }
    }

    path.pop();
    recStack.delete(node);
    steps.push({
      text: `Backtracking from <span class="step-highlight">${nodeLabel}</span>`,
    });
  }

  all.forEach(node => { if (!visited.has(node)) dfsStep(node, []); });

  if (foundCycles.length === 0) {
    steps.push({
      text: `<span class="step-ok">✅ No circular wait found — all print jobs can complete!</span>`,
    });
  } else {
    steps.push({
      text: `<span class="step-cycle">🚨 ${foundCycles.length} circular wait(s) detected — printer jam confirmed!</span>`,
    });
  }

  // Show modal
  stepState = { steps, index: 0, total: steps.length };
  stepContent.innerHTML = steps[0].text;
  updateStepProgress();
  stepModal.style.display = 'flex';
});

/** Advance one step */
document.getElementById('nextStepBtn').addEventListener('click', () => {
  if (!stepState) return;
  stepState.index++;
  if (stepState.index >= stepState.steps.length) {
    stepState.index = stepState.steps.length - 1;
    document.getElementById('nextStepBtn').textContent = 'Done ✓';
  }
  stepContent.innerHTML = stepState.steps[stepState.index].text;
  updateStepProgress();
});

function updateStepProgress() {
  if (!stepState) return;
  const pct = ((stepState.index + 1) / stepState.total) * 100;
  document.getElementById('stepProgressBar').style.width = pct + '%';
}

document.getElementById('closeStepBtn').addEventListener('click', () => {
  stepModal.style.display = 'none';
  stepState = null;
  document.getElementById('nextStepBtn').textContent = 'Next Step ▶';
  document.getElementById('stepProgressBar').style.width = '0%';
});

/* ─────────────────────────────────────────────────────────
   INITIALISE
───────────────────────────────────────────────────────── */
render();
log('🖨️ PrinterSync ready — welcome, Aarna! Start adding devices to simulate.', 'ok');
