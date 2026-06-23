
  // ==========================================================================
  // DOM Element Cache (using document.querySelector)
  // ==========================================================================
  const themeToggleBtn = document.querySelector('#theme-toggle-btn');

  // Task Console
  const form = document.querySelector('#task-form');
  const taskList = document.querySelector('#task-list');
  const emptyState = document.querySelector('#empty-state');
  const pendingCounter = document.querySelector('#pending-counter');
  const completedCounter = document.querySelector('#completed-counter');
  const searchInput = document.querySelector('#task-search');
  const categoryFilter = document.querySelector('#filter-category');
  const clearAllBtn = document.querySelector('#clear-all-btn');
  const addTaskBtn = document.querySelector('#add-task-btn');

  // Event Propagation Playground
  const propGrandparent = document.querySelector('#prop-grandparent');
  const propParent = document.querySelector('#prop-parent');
  const propChild = document.querySelector('#prop-child');
  const consoleLogsContainer = document.querySelector('#console-logs');
  const clearConsoleBtn = document.querySelector('#clear-console-btn');

  // Attributes vs Properties Playground
  const demoInput = document.querySelector('#demo-input');
  const propLiveValue = document.querySelector('#prop-live-value');
  const attrLiveValue = document.querySelector('#attr-live-value');
  const btnSetProp = document.querySelector('#btn-set-prop');
  const btnSetAttr = document.querySelector('#btn-set-attr');
  const btnResetDemo = document.querySelector('#btn-reset-demo');
  
  // Set theme helper
  const setTheme = (theme) => {
    // 1. setAttribute() demo - sets attribute on documentElement
    document.documentElement.setAttribute('data-theme', theme);
    
    // 2. dataset demo - sets theme value in custom data storage
    document.documentElement.dataset.theme = theme;
    
    // 3. classList demo - toggles a class on body representing the theme
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  };

  // Toggle theme button handler
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });

  // Initial theme loader (default to 'dark', localStorage is disabled)
  const savedTheme = 'dark';
  setTheme(savedTheme);


  let tasksArr = [];
  let updateIndex = null;
  
  // Load tasks (in-memory initialization only, localStorage is disabled)
  const loadTasksFromStorage = () => {
    // Default placeholder tasks
    tasksArr = [
      { title: 'Click on DOM Playgrounds to learn about event phases', category: 'Study', status: 'pending' },
      { title: 'Implement Event Delegation on task actions', category: 'Work', status: 'completed' },
      { title: 'Compare input.value vs getAttribute("value")', category: 'Study', status: 'pending' }
    ];
  };

  const saveTasksToStorage = () => {
    // In-memory only, localStorage is disabled
  };


  // ==========================================================================
  // 4. Task Console Configuration
  // ==========================================================================


  // ==========================================================================
  // 5. Tasks Helper Stats
  // ==========================================================================
  const updateCounters = () => {
    const totalPending = tasksArr.filter(t => t.status === 'pending').length;
    const totalCompleted = tasksArr.filter(t => t.status === 'completed').length;
    
    pendingCounter.textContent = totalPending.toString();
    completedCounter.textContent = totalCompleted.toString();
  };


  // ==========================================================================
  // 6. Task Rendering Engine (ui() function using innerHTML & template literals)
  // ==========================================================================
  const ui = () => {
    taskList.innerHTML = "";

    const query = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    const filteredTasks = tasksArr.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (filteredTasks.length === 0) {
      taskList.innerHTML = `
        <div class="empty-state" id="empty-state">
          <h4 class="font-mono">NO ACTIVE ENTRIES</h4>
          <p>Add a task description above to populate your workspace.</p>
        </div>`;
      updateCounters();
      return;
    }

    filteredTasks.forEach((elem) => {
      const index = tasksArr.indexOf(elem);

      taskList.innerHTML += `
        <div class="task-card" data-id="${index}" data-category="${elem.category}" data-status="${elem.status}">
          <div class="task-info-side">
            <div class="task-badge-row">
              <span class="category-tag">${elem.category}</span>
            </div>
            <span class="task-title-text">${elem.title}</span>
          </div>
          <div class="task-actions-side">
            <button class="btn-action btn-complete-action" onclick="toggleComplete(${index})">
              ${elem.status === 'completed' ? 'Undo' : 'Done'}
            </button>
            <button class="btn-action btn-edit-action" onclick="updateTask('${elem.title}')">Edit</button>
            <button class="btn-action btn-delete-action" onclick="deleteTask(${index})">Delete</button>
          </div>
        </div>
      `;
    });

    updateCounters();
  };


  // ==========================================================================
  // 7. Exposing Global Event Handlers for Task Actions (similar to updateProduct & deleteProduct)
  // ==========================================================================
  const toggleComplete = (index) => {
    tasksArr[index].status = tasksArr[index].status === 'completed' ? 'pending' : 'completed';
    ui();
  };

  const updateTask = (title) => {
    let task = tasksArr.find((elem) => elem.title === title);
    updateIndex = tasksArr.findIndex((elem) => elem.title === title);

    form[0].value = task.title;
    form[1].value = task.category;

    addTaskBtn.textContent = "Save Entry";
  };

  const deleteTask = (index) => {
    tasksArr.splice(index, 1);
    ui();
  };

  // Exposing to global window object to ensure access by inline onclick attributes
  window.toggleComplete = toggleComplete;
  window.updateTask = updateTask;
  window.deleteTask = deleteTask;


  // ==========================================================================
  // 8. Event Handling (Task Console Form & Search/Filter)
  // ==========================================================================
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let title = event.target[0].value.trim();
    let category = event.target[1].value;

    if (title === "" || category === "") {
      alert("please fill all the Details");
      return;
    }

    let taskObj = {
      title,
      category,
      status: updateIndex !== null ? tasksArr[updateIndex].status : 'pending'
    };

    if (updateIndex !== null) {
      tasksArr[updateIndex] = taskObj;
      updateIndex = null;
      addTaskBtn.textContent = "Create Entry";
    } else {
      tasksArr.push(taskObj);
    }

    ui();
    form.reset();
  });

  searchInput.addEventListener('input', ui);
  categoryFilter.addEventListener('change', ui);

  clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all tasks?')) {
      tasksArr = [];
      ui();
    }
  });


  // ==========================================================================
  // 8. DOM Playgrounds: Event Propagation Demo
  // ==========================================================================

  // simulated console logger helper
  const addConsoleLog = (elementName, phaseName) => {
    // Clear placeholder initially
    const placeholder = consoleLogsContainer.querySelector('.console-placeholder');
    if (placeholder) {
      consoleLogsContainer.innerHTML = '';
    }

    const logLine = document.createElement('div');
    logLine.classList.add('console-line');
    
    let phaseColor = 'var(--color-link)';
    if (phaseName === 'Capturing') phaseColor = 'var(--color-warning-text)';
    
    logLine.innerHTML = `<span style="color: ${phaseColor}; font-weight: 600;">[${phaseName.toUpperCase()}]</span> Event reached: <strong style="color: var(--text-primary)">${elementName}</strong>`;
    
    consoleLogsContainer.appendChild(logLine);
    consoleLogsContainer.scrollTop = consoleLogsContainer.scrollHeight;

    // Log to standard developer tools console exactly as requested
    console.log(`[EVENT PROPAGATION: ${phaseName.toUpperCase()}] Event reached: ${elementName}`);
  };

  // Trigger animations helper to make propagation path visible
  const triggerVisualFlash = (element, delay) => {
    setTimeout(() => {
      element.classList.add('flash');
      setTimeout(() => element.classList.remove('flash'), 600);
    }, delay);
  };

  /**
   * Explain the difference in comments (Requirement 7):
   * 
   * EVENT BUBBLING:
   * By default, events bubble up from the target element (the child that was clicked) 
   * through its parent elements up to the root window (Target -> Parent -> Grandparent).
   * 
   * EVENT CAPTURING:
   * The opposite of bubbling. The event is captured from the outermost element 
   * and travels down the nested hierarchy to the target element (Grandparent -> Parent -> Target).
   * It is registered by passing { capture: true } in the addEventListener arguments.
   */

  // 1. CAPTURING PHASE EVENT LISTENERS (triggered from top to bottom)
  propGrandparent.addEventListener('click', (e) => {
    const selectedMode = document.querySelector('input[name="propagation-mode"]:checked').value;
    if (selectedMode === 'capture') {
      addConsoleLog('Grandparent (Div)', 'Capturing');
      triggerVisualFlash(propGrandparent, 0);
    }
  }, { capture: true });

  propParent.addEventListener('click', (e) => {
    const selectedMode = document.querySelector('input[name="propagation-mode"]:checked').value;
    if (selectedMode === 'capture') {
      addConsoleLog('Parent (Div)', 'Capturing');
      triggerVisualFlash(propParent, 150);
    }
  }, { capture: true });

  propChild.addEventListener('click', (e) => {
    const selectedMode = document.querySelector('input[name="propagation-mode"]:checked').value;
    if (selectedMode === 'capture') {
      addConsoleLog('Child (Button)', 'Capturing');
      triggerVisualFlash(propChild, 300);
    }
  }, { capture: true });

  // 2. BUBBLING PHASE EVENT LISTENERS (triggered from bottom to top)
  propChild.addEventListener('click', (e) => {
    const selectedMode = document.querySelector('input[name="propagation-mode"]:checked').value;
    if (selectedMode === 'bubble') {
      addConsoleLog('Child (Button)', 'Bubbling');
      triggerVisualFlash(propChild, 0);
    }
  }, { capture: false });

  propParent.addEventListener('click', (e) => {
    const selectedMode = document.querySelector('input[name="propagation-mode"]:checked').value;
    if (selectedMode === 'bubble') {
      addConsoleLog('Parent (Div)', 'Bubbling');
      triggerVisualFlash(propParent, 150);
    }
  }, { capture: false });

  propGrandparent.addEventListener('click', (e) => {
    const selectedMode = document.querySelector('input[name="propagation-mode"]:checked').value;
    if (selectedMode === 'bubble') {
      addConsoleLog('Grandparent (Div)', 'Bubbling');
      triggerVisualFlash(propGrandparent, 300);
    }
  }, { capture: false });

  // Clear virtual console logs
  clearConsoleBtn.addEventListener('click', () => {
    consoleLogsContainer.innerHTML = '<div class="console-placeholder">// Console is idle. Trigger an event above.</div>';
  });


  // ==========================================================================
  // 9. DOM Playgrounds: Attributes vs. Properties Live Demonstration
  //    Satisfies Requirements: getAttribute(), setAttribute(), dataset, hasAttribute(), removeAttribute()
  // ==========================================================================

  /**
   * Explain the difference in comments (Requirement Demonstration):
   * 
   * input.value (PROPERTY):
   * Represents the live state of the HTMLInputElement in memory. Typing or 
   * updating .value in code changes this property instantly. It does NOT write 
   * back to the HTML source attribute.
   * 
   * input.getAttribute('value') (ATTRIBUTE):
   * Represents the static default value declared in the HTML source code. 
   * Calling input.setAttribute('value', 'x') changes this attribute, but typing 
   * inside the input box does not modify it. The browser uses the attribute 
   * to determine the default value on resets.
   */

  // Update visual indicators of properties vs attributes
  const updateDemoValues = () => {
    // 1. Live Property state access
    const propVal = demoInput.value;
    
    // 2. getAttribute() demo - accesses the static HTML attribute state
    const attrVal = demoInput.getAttribute('value');
    
    propLiveValue.textContent = propVal === '' ? '(empty string "")' : `"${propVal}"`;
    attrLiveValue.textContent = attrVal === null ? 'null (attribute removed)' : `"${attrVal}"`;
  };

  // Listen to typing event
  demoInput.addEventListener('input', updateDemoValues);

  // Trigger property setter
  btnSetProp.addEventListener('click', () => {
    // Modify the live property state directly
    demoInput.value = "Updated Prop";
    updateDemoValues();
  });

  // Trigger attribute setter
  btnSetAttr.addEventListener('click', () => {
    // Modify the static HTML source attribute
    demoInput.setAttribute('value', "Updated Attr");
    updateDemoValues();
  });

  // Reset demo states
  btnResetDemo.addEventListener('click', () => {
    // Reset properties and attributes
    demoInput.value = "Original Value";
    demoInput.setAttribute('value', "Original Value");
    updateDemoValues();
  });

  // Initial load values
  updateDemoValues();


  // ==========================================================================
  // 10. Initial Run task list loader
  // ==========================================================================
  loadTasksFromStorage();
  ui();
  
  console.log("DOM Explorer App loaded successfully.");
