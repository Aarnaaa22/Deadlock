/**
 * ══════════════════════════════════════════════════
 *  Deadlock Visualizer — script.js
 *  By Aarna
 *  Handles: Graph state, RAG rendering, deadlock
 *  detection (DFS cycle), resolution, step mode,
 *  drag-and-drop, tooltip, background canvas, theme
 * ══════════════════════════════════════════════════
 */

/* ─────────────────────────────────────────────────
   STATE
───────────────────────────────────────────────── */
const state = {
  processes: [],   // { id, x, y }
  resources: [],   // { id, x, y, instances }
  edges: [],       // { from, to, type: 'alloc'|'request' }
  deadlocked: [],  // process ids
  processCount: 0,
  resourceCount: 0,
};

/* ─────────────────────────────────────────────────
   DOM REFS
───────────────────────────────────────────────── */
const svg          = document.getElementById('graphSvg');
const edgesGroup   = document.getElementById('edgesGroup');
const nodesGroup   = document.getElementById('nodesGroup');
const edgeFrom     = document.getElementById('edgeFrom');
const edgeTo       = document.getElementById('edgeTo');
const nodeListEl   = document.getElementById('nodeList');
const deadlockList = document.getElementById('deadlockList');
const simLog       = document.getElementById('simLog');
const statusBanner = document.getElementById('statusBanner');
const statusText   = document.getElementById('statusText');
const statusIcon   = document.getElementById('statusIcon');
const canvasHint   = document.getElementById('canvasHint');
const tooltip      = document.getElementById('tooltip');
const resolutionSection = document.getElementById('resolutionSection');
const resolveTarget     = document.getElementById('resolveTarget');
const stepModal    = document.getElementById('stepModal');
const stepContent  = document.getElementById('stepContent');

/* ─────────────────────────────────────────────────
   BACKGROUND CANVAS (animated grid + particles)
───────────────────────────────────────────────── */
(function initBgCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function spawnParticles() {
    particles = [];
    const count = Math.floor((W * H) / 22000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
      });
    }
  }

  function drawGrid(ctx, W, H) {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const lineColor = isDark ? 'rgba(124,92,252,0.06)' : 'rgba(91,53,213,0.05)';
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    const step = 60;
    for (let x = 0; x < W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    drawGrid(ctx, W, H);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const pCol = isDark ? 'rgba(124,92,252,0.5)' : 'rgba(91,53,213,0.35)';

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = pCol;
      ctx.fill();
    });

    requestAnimationFrame(frame);
  }

  resize(); spawnParticles(); frame();
  window.addEventListener('resize', () => { resize(); spawnParticles(); });
})();

/* ─────────────────────────────────────────────────
   THEME TOGGLE
───────────────────────────────────────────────── */
document.getElementById('themeToggle').addEventListener('click', () => {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('toggleIcon').textContent = isDark ? '☀' : '☽';
  log('Theme switched to ' + (isDark ? 'light' : 'dark') + ' mode', 'info');
});

/* ─────────────────────────────────────────────────
   LOGGING
───────────────────────────────────────────────── */
function log(msg, type = 'info') {
  const div = document.createElement('div');
  div.className = `log-entry log-${type}`;
  const ts = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  div.textContent = `[${ts}] ${msg}`;
  simLog.prepend(div);
  // keep max 60 entries
  while (simLog.children.length > 60) simLog.removeChild(simLog.lastChild);
}

/* ─────────────────────────────────────────────────
   HELPERS — geometry
───────────────────────────────────────────────── */
function getNodePos(id) {
  const n = [...state.processes, ...state.resources].find(n => n.id === id);
  return n ? { x: n.x, y: n.y } : null;
}

function isProcess(id) { return id.startsWith('P'); }
function isResource(id) { return id.startsWith('R'); }

/** Clamp a point on the border of a circle/rect toward target */
function edgeEndpoints(fromId, toId) {
  const from = getNodePos(fromId);
  const to   = getNodePos(toId);
  if (!from || !to) return null;

  const dx = to.x - from.x, dy = to.y - from.y;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist, uy = dy / dist;

  const rFrom = isProcess(fromId) ? 26 : 22;
  const rTo   = isProcess(toId)   ? 28 : 24; // slightly larger for arrow gap

  return {
    x1: from.x + ux * rFrom,
    y1: from.y + uy * rFrom,
    x2: to.x   - ux * rTo,
    y2: to.y   - uy * rTo,
  };
}

/* ─────────────────────────────────────────────────
   RENDER
───────────────────────────────────────────────── */
function render() {
  // hide/show empty hint
  const hasNodes = state.processes.length + state.resources.length > 0;
  canvasHint.style.opacity = hasNodes ? '0' : '1';
  canvasHint.style.pointerEvents = hasNodes ? 'none' : 'auto';

  renderEdges();
  renderNodes();
  updateSelects();
  updateNodeList();
}

function renderEdges() {
  edgesGroup.innerHTML = '';

  state.edges.forEach((edge, idx) => {
    const pts = edgeEndpoints(edge.from, edge.to);
    if (!pts) return;

    const isCycle = state.deadlocked.length > 0 &&
                    state.deadlocked.includes(edge.from) &&
                    state.deadlocked.includes(edge.to);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', pts.x1); line.setAttribute('y1', pts.y1);
    line.setAttribute('x2', pts.x2); line.setAttribute('y2', pts.y2);
    line.setAttribute('marker-end', isCycle ? 'url(#arrow-cycle)' : 'url(#arrow)');
    line.setAttribute('class', `edge-line ${isCycle ? 'edge-cycle' : (edge.type === 'alloc' ? 'edge-alloc' : 'edge-request')}`);
    line.dataset.idx = idx;

    // tooltip
    line.addEventListener('mouseenter', (e) => {
      showTooltip(e, `${edge.from} → ${edge.to}\n${edge.type === 'alloc' ? '📦 Allocation' : '📋 Request'}`);
    });
    line.addEventListener('mousemove', moveTooltip);
    line.addEventListener('mouseleave', hideTooltip);

    edgesGroup.appendChild(line);
  });
}

function renderNodes() {
  nodesGroup.innerHTML = '';

  // Processes — circles
  state.processes.forEach(p => {
    const isDeadlocked = state.deadlocked.includes(p.id);
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${p.x},${p.y})`);
    g.style.cursor = 'grab';

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', 26);
    circle.setAttribute('class', `node-circle process-node${isDeadlocked ? ' node-deadlock' : ''}`);
    if (isDeadlocked) circle.setAttribute('filter', 'url(#glow-strong)');

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('class', 'node-label');
    label.textContent = p.id;
    if (isDeadlocked) label.setAttribute('fill', '#ff4d6d');

    g.appendChild(circle);
    g.appendChild(label);
    makeDraggable(g, p);
    addNodeTooltip(g, p, 'process');

    nodesGroup.appendChild(g);
  });

  // Resources — rectangles with instance dots
  state.resources.forEach(r => {
    const isDeadlocked = state.deadlocked.includes(r.id);
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${r.x},${r.y})`);
    g.style.cursor = 'grab';

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', -26); rect.setAttribute('y', -22);
    rect.setAttribute('width', 52); rect.setAttribute('height', 44);
    rect.setAttribute('rx', 8); rect.setAttribute('ry', 8);
    rect.setAttribute('class', `node-circle resource-node${isDeadlocked ? ' node-deadlock' : ''}`);
    if (isDeadlocked) rect.setAttribute('filter', 'url(#glow-strong)');

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('class', 'node-label');
    label.setAttribute('y', -6);
    label.textContent = r.id;
    if (isDeadlocked) label.setAttribute('fill', '#ff4d6d');

    g.appendChild(rect);
    g.appendChild(label);

    // Instance dots
    const inst = r.instances || 1;
    const dotR = 4, spacing = 10;
    const totalW = (inst - 1) * spacing;
    for (let i = 0; i < inst; i++) {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', -totalW / 2 + i * spacing);
      dot.setAttribute('cy', 10);
      dot.setAttribute('r', dotR);
      dot.setAttribute('class', 'instance-dot');
      g.appendChild(dot);
    }

    makeDraggable(g, r);
    addNodeTooltip(g, r, 'resource');

    nodesGroup.appendChild(g);
  });
}

/* ─────────────────────────────────────────────────
   DRAG AND DROP
───────────────────────────────────────────────── */
function makeDraggable(g, nodeData) {
  let dragging = false, startX, startY, origX, origY;

  g.addEventListener('mousedown', (e) => {
    dragging = true;
    startX = e.clientX; startY = e.clientY;
    origX = nodeData.x; origY = nodeData.y;
    g.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const svgRect = svg.getBoundingClientRect();
    const scaleX = svg.viewBox.baseVal.width  / svgRect.width  || 1;
    const scaleY = svg.viewBox.baseVal.height / svgRect.height || 1;
    nodeData.x = origX + (e.clientX - startX) * scaleX;
    nodeData.y = origY + (e.clientY - startY) * scaleY;
    renderEdges();
    g.setAttribute('transform', `translate(${nodeData.x},${nodeData.y})`);
  });

  window.addEventListener('mouseup', () => {
    if (dragging) { dragging = false; g.style.cursor = 'grab'; }
  });
}

/* ─────────────────────────────────────────────────
   TOOLTIP
───────────────────────────────────────────────── */
function addNodeTooltip(g, nodeData, type) {
  g.addEventListener('mouseenter', (e) => {
    const info = type === 'process'
      ? `Process: ${nodeData.id}\nEdges: ${state.edges.filter(e => e.from === nodeData.id || e.to === nodeData.id).length}`
      : `Resource: ${nodeData.id}\nInstances: ${nodeData.instances}\nAllocated to: ${state.edges.filter(e => e.from === nodeData.id).map(e => e.to).join(', ') || 'none'}`;
    showTooltip(e, info);
  });
  g.addEventListener('mousemove', moveTooltip);
  g.addEventListener('mouseleave', hideTooltip);
}

function showTooltip(e, text) {
  tooltip.innerHTML = text.replace(/\n/g, '<br/>');
  tooltip.classList.add('visible');
  moveTooltip(e);
}
function moveTooltip(e) {
  const wrapper = document.querySelector('.canvas-wrapper').getBoundingClientRect();
  tooltip.style.left = (e.clientX - wrapper.left + 12) + 'px';
  tooltip.style.top  = (e.clientY - wrapper.top  + 12) + 'px';
}
function hideTooltip() { tooltip.classList.remove('visible'); }

/* ─────────────────────────────────────────────────
   SVG VIEWBOX (auto-resize)
───────────────────────────────────────────────── */
function updateViewBox() {
  const wrapper = document.querySelector('.canvas-wrapper');
  const { width, height } = wrapper.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
}
window.addEventListener('resize', () => { updateViewBox(); render(); });
updateViewBox();

/* ─────────────────────────────────────────────────
   NODE POSITIONS (spread across canvas)
───────────────────────────────────────────────── */
function getSpawnPosition(index, total) {
  const wrapper = document.querySelector('.canvas-wrapper');
  const { width, height } = wrapper.getBoundingClientRect();
  const cx = width / 2, cy = height / 2;
  const radius = Math.min(width, height) * 0.35;
  if (total <= 1) return { x: cx, y: cy };
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

/* ─────────────────────────────────────────────────
   ADD / REMOVE NODES
───────────────────────────────────────────────── */
document.getElementById('addProcessBtn').addEventListener('click', () => {
  state.processCount++;
  const id = `P${state.processCount}`;
  const pos = getSpawnPosition(state.processes.length, state.processes.length + 1);
  state.processes.push({ id, x: pos.x, y: pos.y });
  log(`Added process ${id}`, 'accent');
  clearDeadlock();
  render();
});

document.getElementById('addResourceBtn').addEventListener('click', () => {
  state.resourceCount++;
  const id = `R${state.resourceCount}`;
  const instances = parseInt(document.getElementById('resourceInstances').value) || 1;
  const pos = getSpawnPosition(state.resources.length, state.resources.length + 1);
  state.resources.push({ id, x: pos.x, y: pos.y, instances });
  log(`Added resource ${id} (${instances} instance${instances > 1 ? 's' : ''})`, 'accent');
  clearDeadlock();
  render();
});

function removeNode(id) {
  if (isProcess(id)) {
    state.processes = state.processes.filter(p => p.id !== id);
  } else {
    state.resources = state.resources.filter(r => r.id !== id);
  }
  // Remove all edges involving this node
  state.edges = state.edges.filter(e => e.from !== id && e.to !== id);
  log(`Removed node ${id} and its edges`, 'warn');
  clearDeadlock();
  render();
}

/* ─────────────────────────────────────────────────
   ADD EDGE
───────────────────────────────────────────────── */
document.getElementById('addEdgeBtn').addEventListener('click', () => {
  const from = edgeFrom.value;
  const to   = edgeTo.value;
  if (!from || !to || from === to) return alert('Select two different nodes.');

  // Validate: R→P (alloc) or P→R (request)
  if (isProcess(from) && isProcess(to)) return alert('Cannot connect two processes directly.');
  if (isResource(from) && isResource(to)) return alert('Cannot connect two resources directly.');

  const type = isResource(from) ? 'alloc' : 'request';

  // Duplicate check
  if (state.edges.find(e => e.from === from && e.to === to)) {
    return alert('This edge already exists.');
  }

  // Allocation limit check
  if (type === 'alloc') {
    const res = state.resources.find(r => r.id === from);
    const allocated = state.edges.filter(e => e.from === from && e.type === 'alloc').length;
    if (allocated >= res.instances) {
      return alert(`${from} only has ${res.instances} instance(s). All allocated.`);
    }
  }

  state.edges.push({ from, to, type });
  log(`Added edge: ${from} → ${to} (${type})`, 'info');
  clearDeadlock();
  render();
});

/* ─────────────────────────────────────────────────
   SELECT UPDATES
───────────────────────────────────────────────── */
function updateSelects() {
  const allNodes = [...state.processes.map(p => p.id), ...state.resources.map(r => r.id)];
  [edgeFrom, edgeTo].forEach(sel => {
    const prev = sel.value;
    sel.innerHTML = allNodes.map(id => `<option value="${id}">${id}</option>`).join('');
    if (allNodes.includes(prev)) sel.value = prev;
  });
}

function updateNodeList() {
  nodeListEl.innerHTML = '';
  [...state.processes, ...state.resources].forEach(n => {
    const div = document.createElement('div');
    const type = isProcess(n.id) ? 'process' : 'resource';
    div.className = `node-item ${type}-item`;
    div.innerHTML = `
      <span>${n.id}${isResource(n.id) ? ` (×${n.instances})` : ''}</span>
      <button class="node-del" data-id="${n.id}" title="Remove">✕</button>
    `;
    nodeListEl.appendChild(div);
  });

  // delete buttons
  nodeListEl.querySelectorAll('.node-del').forEach(btn => {
    btn.addEventListener('click', () => removeNode(btn.dataset.id));
  });
}

/* ─────────────────────────────────────────────────
   DEADLOCK DETECTION — DFS cycle detection
───────────────────────────────────────────────── */
function buildAdjacency() {
  // Build adjacency list from edges
  // For cycle detection: traverse P→R→P chains
  const adj = {};
  [...state.processes, ...state.resources].forEach(n => adj[n.id] = []);
  state.edges.forEach(e => {
    adj[e.from].push(e.to);
  });
  return adj;
}

/**
 * Find all cycles in the directed graph using DFS.
 * Returns array of cycles (each cycle = array of node ids).
 */
function findCycles() {
  const adj = buildAdjacency();
  const all  = [...state.processes.map(p => p.id), ...state.resources.map(r => r.id)];
  const visited = new Set();
  const recStack = new Set();
  const cycles = [];

  function dfs(node, path) {
    visited.add(node);
    recStack.add(node);
    path.push(node);

    for (const neighbor of (adj[node] || [])) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, path);
      } else if (recStack.has(neighbor)) {
        // Found a cycle — extract it
        const cycleStart = path.indexOf(neighbor);
        cycles.push(path.slice(cycleStart));
      }
    }

    path.pop();
    recStack.delete(node);
  }

  all.forEach(node => {
    if (!visited.has(node)) dfs(node, []);
  });

  return cycles;
}

function detectDeadlock() {
  const cycles = findCycles();
  clearDeadlock();

  if (cycles.length === 0) {
    setStatus('safe', '💚', 'No Deadlock Detected 💚 — System is safe');
    log('No cycles found. System is safe.', 'ok');
    deadlockList.innerHTML = '<span class="muted">No deadlock 💚</span>';
    resolutionSection.style.display = 'none';
    return;
  }

  // Collect all process nodes in cycles
  const deadlockedSet = new Set();
  cycles.forEach(cycle => {
    cycle.forEach(id => {
      if (isProcess(id)) deadlockedSet.add(id);
    });
  });

  // Check if multi-instance resources involved
  const cycleNodes = new Set(cycles.flat());
  const hasMultiInstance = state.resources.some(r => cycleNodes.has(r.id) && r.instances > 1);

  if (hasMultiInstance) {
    setStatus('warn', '🟡', `Possible Deadlock 🟡 — Multi-instance resources involved`);
    log(`Cycle detected with multi-instance resources — possible deadlock`, 'warn');
    log(`Involved processes: ${[...deadlockedSet].join(', ')}`, 'warn');
  } else {
    setStatus('deadlock', '🔴', `Deadlock Detected 🔴 — ${deadlockedSet.size} process(es) blocked`);
    log(`DEADLOCK DETECTED! Cycle found.`, 'danger');
    log(`Deadlocked processes: ${[...deadlockedSet].join(', ')}`, 'danger');
  }

  state.deadlocked = [...deadlockedSet];

  // Deadlock list UI
  deadlockList.innerHTML = '';
  state.deadlocked.forEach(id => {
    const tag = document.createElement('div');
    tag.className = 'deadlock-tag';
    tag.innerHTML = `🔴 ${id}`;
    deadlockList.appendChild(tag);
  });

  // Resolution dropdown
  resolutionSection.style.display = 'block';
  resolveTarget.innerHTML = state.deadlocked.map(id => `<option value="${id}">${id}</option>`).join('');

  render(); // re-render to show red highlights
}

function clearDeadlock() {
  state.deadlocked = [];
  setStatus('idle', '💤', 'Press "Detect Deadlock" to analyse the graph');
  deadlockList.innerHTML = '<span class="muted">None detected yet</span>';
  resolutionSection.style.display = 'none';
}

function setStatus(type, icon, text) {
  statusBanner.setAttribute('data-status', type);
  statusIcon.textContent = icon;
  statusText.textContent = text;
}

document.getElementById('detectBtn').addEventListener('click', detectDeadlock);

/* ─────────────────────────────────────────────────
   RESOLUTION
───────────────────────────────────────────────── */
document.getElementById('terminateBtn').addEventListener('click', () => {
  const target = resolveTarget.value;
  if (!target) return;
  log(`Terminated process ${target} — removing from graph`, 'warn');
  removeNode(target);
  detectDeadlock();
});

document.getElementById('preemptBtn').addEventListener('click', () => {
  const target = resolveTarget.value;
  if (!target) return;
  // Remove all allocation edges TO this process (resources preempted back)
  const removed = state.edges.filter(e => e.to === target && e.type === 'alloc');
  state.edges = state.edges.filter(e => !(e.to === target && e.type === 'alloc'));
  log(`Preempted ${removed.length} resource(s) from ${target}`, 'warn');
  removed.forEach(e => log(`  ↳ ${e.from} reclaimed from ${target}`, 'info'));
  detectDeadlock();
  render();
});

/* ─────────────────────────────────────────────────
   RESET
───────────────────────────────────────────────── */
document.getElementById('resetBtn').addEventListener('click', () => {
  state.processes = [];
  state.resources = [];
  state.edges = [];
  state.deadlocked = [];
  state.processCount = 0;
  state.resourceCount = 0;
  clearDeadlock();
  log('Graph reset.', 'info');
  render();
});

/* ─────────────────────────────────────────────────
   RANDOM TEST CASE
───────────────────────────────────────────────── */
document.getElementById('randomBtn').addEventListener('click', () => {
  // Reset first
  state.processes = [];
  state.resources = [];
  state.edges = [];
  state.deadlocked = [];
  state.processCount = 0;
  state.resourceCount = 0;

  updateViewBox();
  const wrapper = document.querySelector('.canvas-wrapper');
  const { width, height } = wrapper.getBoundingClientRect();

  // Random counts
  const numP = 3 + Math.floor(Math.random() * 2); // 3-4
  const numR = 3 + Math.floor(Math.random() * 2); // 3-4

  // Spawn processes in a circle
  for (let i = 0; i < numP; i++) {
    state.processCount++;
    const angle = (i / numP) * Math.PI * 2 - Math.PI / 2;
    state.processes.push({
      id: `P${state.processCount}`,
      x: width / 2 + Math.cos(angle) * width * 0.3,
      y: height / 2 + Math.sin(angle) * height * 0.3,
    });
  }

  // Spawn resources in inner circle
  for (let i = 0; i < numR; i++) {
    state.resourceCount++;
    const angle = (i / numR) * Math.PI * 2;
    const inst = Math.random() < 0.3 ? 2 : 1;
    state.resources.push({
      id: `R${state.resourceCount}`,
      x: width / 2 + Math.cos(angle) * width * 0.15,
      y: height / 2 + Math.sin(angle) * height * 0.15,
      instances: inst,
    });
  }

  // Build a deadlock scenario: P1→R1, R1→P2, P2→R2, R2→P1
  const pIds = state.processes.map(p => p.id);
  const rIds = state.resources.map(r => r.id);

  // Cycle: P1 requests R1, R1 allocated to P2, P2 requests R2, R2 allocated to P1
  state.edges.push({ from: pIds[0], to: rIds[0], type: 'request' });
  state.edges.push({ from: rIds[0], to: pIds[1], type: 'alloc' });
  state.edges.push({ from: pIds[1], to: rIds[1], type: 'request' });
  state.edges.push({ from: rIds[1], to: pIds[0], type: 'alloc' });

  // Add some extra non-cycle edges
  if (numP >= 3 && numR >= 3) {
    state.edges.push({ from: pIds[2], to: rIds[2], type: 'request' });
    state.edges.push({ from: rIds[2], to: pIds[2], type: 'alloc' });
  }

  log('Random test case generated (contains a deadlock cycle)', 'accent');
  render();
  setTimeout(detectDeadlock, 400);
});

/* ─────────────────────────────────────────────────
   STEP-BY-STEP SIMULATION
───────────────────────────────────────────────── */
let stepState = null;

document.getElementById('stepBtn').addEventListener('click', () => {
  if (state.processes.length === 0) return alert('Add some nodes first.');

  const adj = buildAdjacency();
  const all = [...state.processes.map(p => p.id), ...state.resources.map(r => r.id)];

  // Build step list
  const steps = [];
  steps.push({ text: `<span class="step-highlight">Starting DFS cycle detection...</span><br/>Nodes: ${all.join(', ')}` });

  const visited  = new Set();
  const recStack = new Set();
  const foundCycles = [];

  function dfsStep(node, path) {
    visited.add(node);
    recStack.add(node);
    path.push(node);

    steps.push({ text: `Visiting <span class="step-highlight">${node}</span> | path: ${path.join(' → ')}` });

    for (const nb of (adj[node] || [])) {
      if (!visited.has(nb)) {
        steps.push({ text: `  Exploring edge <span class="step-highlight">${node} → ${nb}</span> (unvisited)` });
        dfsStep(nb, path);
      } else if (recStack.has(nb)) {
        const cycle = path.slice(path.indexOf(nb));
        foundCycles.push(cycle);
        steps.push({ text: `  ⚠ Back-edge found: <span class="step-highlight">${node} → ${nb}</span><br/>  <span class="step-cycle">CYCLE: ${cycle.join(' → ')} → ${nb}</span>` });
      } else {
        steps.push({ text: `  Edge <span class="step-highlight">${node} → ${nb}</span> — already visited (no cycle here)` });
      }
    }

    path.pop();
    recStack.delete(node);
    steps.push({ text: `Backtracking from <span class="step-highlight">${node}</span>` });
  }

  all.forEach(node => {
    if (!visited.has(node)) dfsStep(node, []);
  });

  if (foundCycles.length === 0) {
    steps.push({ text: `<span class="step-ok">✓ No cycles found. System is safe!</span>` });
  } else {
    steps.push({ text: `<span class="step-cycle">✗ ${foundCycles.length} cycle(s) found. Deadlock exists!</span>` });
  }

  stepState = { steps, index: 0 };
  stepContent.innerHTML = steps[0].text;
  stepModal.style.display = 'flex';
});

document.getElementById('nextStepBtn').addEventListener('click', () => {
  if (!stepState) return;
  stepState.index++;
  if (stepState.index >= stepState.steps.length) {
    stepState.index = stepState.steps.length - 1;
    document.getElementById('nextStepBtn').textContent = 'Done ✓';
  }
  stepContent.innerHTML = stepState.steps[stepState.index].text;
});

document.getElementById('closeStepBtn').addEventListener('click', () => {
  stepModal.style.display = 'none';
  stepState = null;
  document.getElementById('nextStepBtn').textContent = 'Next ▶';
});

/* ─────────────────────────────────────────────────
   INITIAL RENDER
───────────────────────────────────────────────── */
render();
log('Deadlock Visualizer ready. Welcome, Aarna! 🎓', 'ok');