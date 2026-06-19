# DOM Explorer & Task Manager 🚀

A modern, visually stunning interactive playground and task management dashboard designed to explore, understand, and demonstrate core Document Object Model (DOM) behaviors in web development. Built using native **HTML5, CSS3, and Vanilla ES6+ JavaScript** with absolutely no frameworks.

---

## 🌐 Live Demo & Preview

*   **Interactive Theme:** Premium Vercel-inspired glassmorphic design featuring seamless Light/Dark mode switching.
*   **Ambient Glow:** Custom backdrop lights and smooth micro-animations for high-fidelity aesthetics.

---

## 📸 Key Sections & Features

### 1. 📋 Task Console
A robust, real-time task manager utilizing advanced DOM manipulation for clean, fast rendering.
*   **Dynamic Card Creation:** Tasks generated using `document.createElement()` and protected from XSS injection via `document.createTextNode()`.
*   **State Management:** Interactive task status switching (Pending/Completed), editing, and deletion.
*   **Performance Optimization:** Employs `document.createDocumentFragment()` to batch DOM updates, minimizing browser reflows and repaints.
*   **Search & Filters:** Real-time search matching and category-based filtering (`Work`, `Personal`, `Study`, `Shopping`, `Urgent`).
*   **Bulk Operations:** Fast cleanup options to flush out task stores.

### 2. ⚡ Event Propagation Playground
An interactive visual sandbox demonstrating how events traverse the DOM tree.
*   **Bubbling Mode:** Visualizes event dispatch moving upwards from Child ➔ Parent ➔ Grandparent.
*   **Capturing Mode:** Visualizes events trickling down from Grandparent ➔ Parent ➔ Child.
*   **Dynamic Log:** Instantly updates a console feed when elements are clicked in either configuration.

### 3. 🧪 Attributes vs. Properties Playground
A live laboratory highlighting the fundamental differences between HTML attributes and DOM object properties.
*   **Dynamic Tracking:** Compares inputs such as `.value` and `getAttribute("value")` in real-time.
*   **Interactive Checkboxes:** Explores the behavior of attributes vs properties for Boolean values (e.g. `checked` status).

---

## 🛠 Tech Stack & DOM APIs Used

### Technologies:
*   **HTML5** (Semantic elements)
*   **CSS3** (CSS Variables, Flexbox, CSS Grid, Glassmorphism, Transition Animations)
*   **JavaScript (ES6+)** (Vanilla DOM APIs, Event Delegation)
*   **Icons:** [Bootstrap Icons](https://icons.getbootstrap.com/)

### DOM Methods Demonstrated:
*   **Creation & Placement:** `createElement()`, `createTextNode()`, `appendChild()`, `after()`, `remove()`
*   **State & Styling:** `setAttribute()`, `getAttribute()`, `classList.add()`, `classList.remove()`, `dataset`
*   **Performance:** `createDocumentFragment()`
*   **Events:** `addEventListener()`, `event.preventDefault()`, Event bubbling control.

---

## 📂 Project Structure

```bash
├── index.html       # Main application layout, DOM nodes, and styles link
├── styles.css       # Premium stylesheets (design system tokens, themes, layout)
├── script.js        # DOM interaction logic, playgrounds, and task state
└── README.md        # Project documentation
```

---

## 🚀 How to Run

1. Clone or download the repository files.
2. Open [index.html] directly in any modern web browser.
3. No build steps, bundlers, or server dependencies are required!

---

*Created as a customized, interactive developer resource for visualizing core frontend mechanics.*
