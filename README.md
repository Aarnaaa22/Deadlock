# ⚡ Deadlock Visualizer

### by Aarna ✨

> *“When processes fight over resources… chaos begins.”*

An interactive, aesthetic, and fully dynamic **Deadlock Detection Simulator** based on **Resource Allocation Graphs (RAG)** — built to *visualize*, *understand*, and *resolve* deadlocks like never before.

---

## 🌌 Preview

> A neon-glass UI meets Operating Systems concepts
> Smooth animations, glowing nodes, and real-time graph simulation

💡 Drag nodes. Connect edges. Create chaos. Then fix it.

---

## 🧠 What This Project Does

This simulator lets you:

✨ Create processes (P1, P2, …)
✨ Create resources (R1, R2, …) with multiple instances
✨ Build a **Resource Allocation Graph** dynamically
✨ Visualize:

* Resource → Process (Allocation 📦)
* Process → Resource (Request 📋)

✨ Detect deadlocks using **DFS cycle detection**
✨ Highlight deadlocked processes in real-time
✨ Resolve deadlocks interactively

---

## 🔥 Features

### 🎯 Core Logic

* Cycle detection using **Depth First Search (DFS)**
* Supports:

  * Single-instance resources → definite deadlock
  * Multi-instance resources → possible deadlock

---

### 🎨 UI/UX (not your average assignment 😌)

* 🌙 Dark / ☀ Light mode toggle
* ✨ Glassmorphism + neon glow theme
* 🧊 Smooth transitions & animations
* 🎯 Interactive SVG-based graph
* 🖱 Drag & drop nodes

---

### 🧪 Simulation Tools

* 🎲 Random deadlock generator
* ▶ Step-by-step DFS visualization
* 📜 Live simulation log
* 🔍 Instant deadlock detection

---

### 🛠 Deadlock Resolution

* ❌ Terminate process
* 🔄 Preempt resources
* 🔁 Real-time graph update after resolution

---

## 🕸 Resource Allocation Graph (RAG)

* **Vertices**:

  * Processes → Circles
  * Resources → Rectangles

* **Edges**:

  * `R → P` → Allocation
  * `P → R` → Request

---

## ⚠ Deadlock Detection Logic

* If graph contains a **cycle**:

  * 🟥 Single-instance → **Deadlock exists**
  * 🟡 Multi-instance → **Deadlock possible**

---

## 🧬 Tech Stack

* **HTML** → Structure
* **CSS** → Styling (Neon + Glass UI 💅)
* **JavaScript** → Logic + Simulation

---

## 🚀 How to Run

```bash
1. Download / clone the project
2. Keep all files in the same folder:
   - index.html
   - style.css
   - script.js
3. Open index.html in browser
```

---

## 🎮 How to Use

1. Add processes & resources

2. Connect them using edges

3. Click **Detect Deadlock**

4. Watch the system either:

   * 💚 Stay safe
   * 🔴 Collapse into deadlock

5. Fix it using:

   * Termination
   * Preemption

---

## 🌟 Unique Touch

This isn’t just a simulator — it’s designed to feel like:

💻 A system under stress
🎮 A mini strategy game
🎨 Aesthetic tech experience

---

## 📌 Future Enhancements

* 🔍 Zoom & pan graph
* 🤖 Smart deadlock suggestions
* 🌐 Save/load graph states
* 🎯 Challenge mode (solve deadlocks under time)

---

## 💭 Inspiration

Operating Systems concepts often feel abstract —
this project brings them to life visually and interactively.

---

## 🧑‍💻 Author

**Aarna 💜**
*Building aesthetic + meaningful tech experiences*

---

## ⭐ If you like this project…

Give it a ⭐ and flex it on your GitHub 😌🔥
