
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  
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


  let tasks = [];
  
  // Load tasks (in-memory initialization only, localStorage is disabled)
  const loadTasksFromStorage = () => {
    // Default placeholder tasks
    tasks = [
      { id: '1', title: 'Click on DOM Playgrounds to learn about event phases', category: 'Study', status: 'pending', edited: false },
      { id: '2', title: 'Implement Event Delegation on task actions', category: 'Work', status: 'completed', edited: false },
      { id: '3', title: 'Compare input.value vs getAttribute("value")', category: 'Study', status: 'pending', edited: false }
    ];
  };

  const saveTasksToStorage = () => {
    // In-memory only, localStorage is disabled
  };


  // ==========================================================================
  // 4. Task Console DOM Cache
  // ==========================================================================
  const taskForm = document.getElementById('task-form');
  const taskTitleInput = document.getElementById('task-title');
  const taskCategorySelect = document.getElementById('task-category');
  const taskListContainer = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');
  
  const pendingCounter = document.getElementById('pending-counter');
  const completedCounter = document.getElementById('completed-counter');
  
  const searchInput = document.getElementById('task-search');
  const categoryFilter = document.getElementById('filter-category');
  const clearAllBtn = document.getElementById('clear-all-btn');


  // ==========================================================================
  // 5. Tasks Helper Stats
  // ==========================================================================
  const updateCounters = () => {
    const totalPending = tasks.filter(t => t.status === 'pending').length;
    const totalCompleted = tasks.filter(t => t.status === 'completed').length;
    
    pendingCounter.textContent = totalPending.toString();
    completedCounter.textContent = totalCompleted.toString();
  };


  // ==========================================================================
  // 6. Task Rendering Engine (Using DocumentFragment & Pure DOM APIs)
  // ==========================================================================
  
  // Create single task card element dynamically
  const createTaskCard = (task) => {
    // createElement() demo
    const card = document.createElement('div');
    card.classList.add('task-card');
    
    // Custom data attribute demos (dataset + setAttribute)
    card.setAttribute('data-id', task.id);
    card.setAttribute('data-category', task.category);
    card.dataset.status = task.status;

    // Info Side
    const infoSide = document.createElement('div');
    infoSide.classList.add('task-info-side');
    
    const badgeRow = document.createElement('div');
    badgeRow.classList.add('task-badge-row');
    
    const categoryTag = document.createElement('span');
    categoryTag.classList.add('category-tag');
    categoryTag.textContent = task.category;
    
    // createTextNode() demo (protects against XSS)
    const titleTextNode = document.createTextNode(task.title);
    
    const titleSpan = document.createElement('span');
    titleSpan.classList.add('task-title-text');
    titleSpan.appendChild(titleTextNode);
    
    badgeRow.appendChild(categoryTag);
    infoSide.appendChild(badgeRow);
    infoSide.appendChild(titleSpan);

    // after() method demo: Appending Edited marker next to title span
    if (task.edited) {
      const editedLabel = document.createElement('span');
      editedLabel.classList.add('edited-marker');
      editedLabel.textContent = ' (Edited)';
      titleSpan.after(editedLabel);
    }
    
    // Actions Side
    const actionsSide = document.createElement('div');
    actionsSide.classList.add('task-actions-side');
    
    // Complete Action Button
    const completeBtn = document.createElement('button');
    completeBtn.classList.add('btn-action', 'btn-complete-action');
    completeBtn.textContent = task.status === 'completed' ? 'Undo' : 'Done';
    completeBtn.dataset.action = 'complete';
    
    // Edit Action Button
    const editBtn = document.createElement('button');
    editBtn.classList.add('btn-action', 'btn-edit-action');
    editBtn.textContent = 'Edit';
    editBtn.dataset.action = 'edit';
    
    // Delete Action Button
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn-action', 'btn-delete-action');
    deleteBtn.textContent = 'Delete';
    deleteBtn.dataset.action = 'delete';
    
    // Append children elements to parent nodes
    actionsSide.appendChild(completeBtn);
    actionsSide.appendChild(editBtn);
    actionsSide.appendChild(deleteBtn);
    
    card.appendChild(infoSide);
    card.appendChild(actionsSide);
    
    return card;
  };

  // Render full list of active/filtered tasks
  const renderTaskList = () => {
    // Remove existing cards
    const cards = taskListContainer.querySelectorAll('.task-card');
    cards.forEach(card => card.remove()); // remove() API demo
    
    const query = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    
    const filteredTasks = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (filteredTasks.length === 0) {
      emptyState.style.display = 'flex';
      updateCounters();
      return;
    }
    
    emptyState.style.display = 'none';

    // DocumentFragment API demo (reduces browser rendering paint repaints)
    const fragment = document.createDocumentFragment();
    
    filteredTasks.forEach(task => {
      const card = createTaskCard(task);
      fragment.appendChild(card);
    });
    
    // append() API demo (attaches the entire fragment subtree to container)
    taskListContainer.appendChild(fragment);
    updateCounters();
  };


  // ==========================================================================
  // 7. Event Handling & Delegation (Task Console Form & Card Actions)
  // ==========================================================================

  // Submit form listener to add task
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = taskTitleInput.value.trim();
    const category = taskCategorySelect.value;
    
    if (!title) return;
    
    const newTask = {
      id: Date.now().toString(),
      title: title,
      category: category,
      status: 'pending',
      edited: false
    };
    
    tasks.push(newTask);
    saveTasksToStorage();
    
    taskForm.reset();
    
    const card = createTaskCard(newTask);
    
    if (emptyState.style.display !== 'none') {
      emptyState.style.display = 'none';
    }
    
    // prepend() API demo (inserts the new card at the top)
    taskListContainer.prepend(card);
    updateCounters();
  });

  // Event Delegation demo: Handle click actions inside task list container
  taskListContainer.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('button');
    if (!actionBtn) return;
    
    const action = actionBtn.dataset.action;
    const card = actionBtn.closest('.task-card');
    if (!card) return;
    
    const taskId = card.getAttribute('data-id');
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) return;
    const task = tasks[taskIndex];
    
    if (action === 'complete') {
      const isCompleted = task.status === 'completed';
      task.status = isCompleted ? 'pending' : 'completed';
      saveTasksToStorage();
      
      // hasAttribute() & removeAttribute() demos
      if (card.hasAttribute('data-status')) {
        card.removeAttribute('data-status');
      }
      
      card.dataset.status = task.status;
      card.setAttribute('data-status', task.status);
      actionBtn.textContent = task.status === 'completed' ? 'Undo' : 'Done';
      
      if (task.status === 'completed') {
        // append() demo: move completed item to the bottom
        taskListContainer.append(card);
      } else {
        // prepend() demo: move active item to the top
        taskListContainer.prepend(card);
      }
      updateCounters();
      
    } else if (action === 'edit') {
      // Inline edit form creation
      const editForm = document.createElement('form');
      editForm.classList.add('task-card-edit-form');
      
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = task.title;
      editInput.required = true;
      editInput.classList.add('edit-title-input');
      
      const saveBtn = document.createElement('button');
      saveBtn.type = 'submit';
      saveBtn.classList.add('btn', 'btn-primary');
      saveBtn.textContent = 'Save';
      
      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.classList.add('btn', 'btn-secondary');
      cancelBtn.textContent = 'Cancel';
      
      editForm.appendChild(editInput);
      editInput.after(saveBtn); // after() demo
      saveBtn.after(cancelBtn);
      
      // before() demo: prepend label helper
      const editLabel = document.createElement('label');
      editLabel.textContent = 'EDITING TASK:';
      editInput.before(editLabel);
      
      // replaceWith() demo: swaps task card with form
      card.replaceWith(editForm);
      editInput.focus();
      
      editForm.addEventListener('submit', (evt) => {
        evt.preventDefault();
        const updatedTitle = editInput.value.trim();
        if (updatedTitle) {
          task.title = updatedTitle;
          task.edited = true;
          saveTasksToStorage();
          
          const newCard = createTaskCard(task);
          editForm.replaceWith(newCard); // swap back
          updateCounters();
        }
      });
      
      cancelBtn.addEventListener('click', () => {
        editForm.replaceWith(card);
      });
      
    } else if (action === 'delete') {
      tasks.splice(taskIndex, 1);
      saveTasksToStorage();
      
      // remove() demo: delete element completely
      card.remove();
      
      if (taskListContainer.querySelectorAll('.task-card').length === 0) {
        emptyState.style.display = 'flex';
      }
      updateCounters();
    }
  });

  // Search & filter action event triggers
  searchInput.addEventListener('input', renderTaskList);
  categoryFilter.addEventListener('change', renderTaskList);
  
  // Clear all button handler
  clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all tasks?')) {
      tasks = [];
      saveTasksToStorage();
      renderTaskList();
    }
  });


  // ==========================================================================
  // 8. DOM Playgrounds: Event Propagation Demo
  // ==========================================================================
  const propGrandparent = document.getElementById('prop-grandparent');
  const propParent = document.getElementById('prop-parent');
  const propChild = document.getElementById('prop-child');
  const consoleLogsContainer = document.getElementById('console-logs');
  const clearConsoleBtn = document.getElementById('clear-console-btn');

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
  const demoInput = document.getElementById('demo-input');
  const propLiveValue = document.getElementById('prop-live-value');
  const attrLiveValue = document.getElementById('attr-live-value');
  
  const btnSetProp = document.getElementById('btn-set-prop');
  const btnSetAttr = document.getElementById('btn-set-attr');
  const btnResetDemo = document.getElementById('btn-reset-demo');

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
  renderTaskList();
  
  console.log("DOM Explorer App loaded successfully.");
