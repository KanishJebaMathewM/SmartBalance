// Main application logic for Work-Life Balance Companion

class WorkLifeBalanceApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.charts = new Charts();
        this.breathingInterval = null;
        this.breathingState = 'stopped';
        
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.loadSettings();
        this.showSection('dashboard');
        this.updateDashboard();
        this.setGreeting();
        
        // Update dashboard every minute
        setInterval(() => {
            if (this.currentSection === 'dashboard') {
                this.updateDashboard();
            }
        }, 60000);
    }

    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.closest('.nav-link').dataset.section;
                this.showSection(section);
            });
        });

        // Theme toggle
        document.getElementById('darkModeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Modal controls
        this.initializeModalControls();
        
        // Form submissions
        this.initializeFormHandlers();
        
        // Button actions
        this.initializeButtonHandlers();
        
        // Filter buttons
        this.initializeFilterHandlers();
    }

    initializeModalControls() {
        // Modal open buttons
        const modalTriggers = {
            'addTaskBtn': 'taskModal',
            'addExpenseBtn': 'expenseModal',
            'addFoodBtn': 'foodModal',
            'moodCheckBtn': 'moodModal',
            'breathingBtn': 'breathingModal'
        };

        Object.entries(modalTriggers).forEach(([buttonId, modalId]) => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', () => this.openModal(modalId));
            }
        });

        // Close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal.id);
            });
        });

        // Close on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    initializeFormHandlers() {
        // Task form
        const taskForm = document.getElementById('taskForm');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => this.handleTaskSubmit(e));
            
            // Show/hide expense amount field
            const expenseCheckbox = document.getElementById('taskExpense');
            const amountField = document.getElementById('taskAmount');
            if (expenseCheckbox && amountField) {
                expenseCheckbox.addEventListener('change', () => {
                    amountField.style.display = expenseCheckbox.checked ? 'block' : 'none';
                });
            }
        }

        // Expense form
        const expenseForm = document.getElementById('expenseForm');
        if (expenseForm) {
            expenseForm.addEventListener('submit', (e) => this.handleExpenseSubmit(e));
        }

        // Food form
        const foodForm = document.getElementById('foodForm');
        if (foodForm) {
            foodForm.addEventListener('submit', (e) => this.handleFoodSubmit(e));
        }
    }

    initializeButtonHandlers() {
        // Mark workout button
        const markWorkoutBtn = document.getElementById('markWorkoutBtn');
        if (markWorkoutBtn) {
            markWorkoutBtn.addEventListener('click', () => this.markWorkout());
        }

        // Exercise buttons
        document.querySelectorAll('.exercise-card').forEach(card => {
            const button = card.querySelector('.btn-secondary');
            if (button) {
                button.addEventListener('click', () => {
                    const exerciseType = card.dataset.exercise;
                    this.startExercise(exerciseType);
                });
            }
        });

        // Mood buttons
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mood = btn.dataset.mood;
                this.selectMood(mood);
            });
        });

        // Relief buttons
        const reliefButtons = {
            'breathingBtn': () => this.openModal('breathingModal'),
            'meditationBtn': () => this.startMeditation(),
            'stretchBtn': () => this.startExercise('desk-stretches')
        };

        Object.entries(reliefButtons).forEach(([buttonId, handler]) => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', handler);
            }
        });

        // Breathing exercise
        const startBreathingBtn = document.getElementById('startBreathingBtn');
        if (startBreathingBtn) {
            startBreathingBtn.addEventListener('click', () => this.startBreathingExercise());
        }

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportReport());
        }
    }

    initializeFilterHandlers() {
        // Task filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterTasks(filter);
                
                // Update active state
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Load section-specific data
        this.loadSectionData(sectionName);
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'tasks':
                this.loadTasks();
                break;
            case 'expenses':
                this.loadExpenses();
                this.loadExpenseChart();
                break;
            case 'food':
                this.loadFoodData();
                break;
            case 'fitness':
                this.loadFitnessData();
                break;
            case 'stress':
                this.loadStressData();
                break;
            case 'report':
                this.generateWeeklyReport();
                break;
        }
    }

    setGreeting() {
        const greetingElement = document.getElementById('greeting');
        if (greetingElement) {
            greetingElement.textContent = Utils.getGreeting();
        }
    }

    updateDashboard() {
        this.updateTasksWidget();
        this.updateExpensesWidget();
        this.updateMealWidget();
        this.updateWorkoutWidget();
        this.updateStressWidget();
        this.updateSummaryWidget();
    }

    updateTasksWidget() {
        const tasks = window.storage.getTasks();
        const today = new Date().toDateString();
        const todayTasks = tasks.filter(task => 
            new Date(task.createdAt).toDateString() === today
        );
        const completedToday = todayTasks.filter(task => task.completed).length;
        
        const tasksCompletedEl = document.getElementById('tasksCompleted');
        const totalTasksEl = document.getElementById('totalTasks');
        const taskProgressEl = document.getElementById('taskProgress');
        
        if (tasksCompletedEl) {
            Utils.animateNumber(tasksCompletedEl, 0, completedToday);
        }
        if (totalTasksEl) {
            totalTasksEl.textContent = todayTasks.length;
        }
        if (taskProgressEl) {
            const percentage = todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0;
            Utils.animateProgressBar(taskProgressEl, percentage);
        }
    }

    updateExpensesWidget() {
        const weeklyExpense = window.storage.getWeeklyExpenses();
        const weeklyExpenseEl = document.getElementById('weeklyExpense');
        
        if (weeklyExpenseEl) {
            weeklyExpenseEl.textContent = Utils.formatCurrency(weeklyExpense);
        }
    }

    updateMealWidget() {
        const suggestions = Utils.getMealSuggestions();
        const mealSuggestionEl = document.getElementById('mealSuggestion');
        
        if (mealSuggestionEl) {
            mealSuggestionEl.textContent = suggestions.breakfast;
        }
    }

    updateWorkoutWidget() {
        const streak = window.storage.getWorkoutStreak();
        const workoutStreakEl = document.getElementById('workoutStreak');
        
        if (workoutStreakEl) {
            Utils.animateNumber(workoutStreakEl, 0, streak);
        }
    }

    updateStressWidget() {
        const currentStress = window.storage.getWeeklyMoodAverage();
        const currentStressEl = document.getElementById('currentStress');
        
        if (currentStressEl) {
            currentStressEl.textContent = Utils.getMoodEmoji(currentStress);
        }
    }

    updateSummaryWidget() {
        const tasks = window.storage.getTasks();
        const expenses = window.storage.getExpenses();
        const workouts = window.storage.getWorkouts();
        const moods = window.storage.getMoods();
        
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        // Weekly stats
        const weeklyTasks = tasks.filter(t => new Date(t.createdAt) >= weekAgo);
        const completedWeekly = weeklyTasks.filter(t => t.completed).length;
        const taskPercentage = weeklyTasks.length > 0 ? Math.round((completedWeekly / weeklyTasks.length) * 100) : 0;
        
        const weeklyExpenseAmount = window.storage.getWeeklyExpenses();
        
        const weeklyWorkouts = workouts.filter(w => new Date(w.createdAt) >= weekAgo);
        
        const stressedDays = moods.filter(m => 
            new Date(m.date) >= weekAgo && 
            ['stressed', 'very-stressed'].includes(m.mood)
        ).length;

        const summaryText = `You completed ${taskPercentage}% of tasks, spent ${Utils.formatCurrency(weeklyExpenseAmount)}, did ${weeklyWorkouts.length} workouts, stress was high on ${stressedDays} days.`;
        
        const weeklySummaryEl = document.getElementById('weeklySummary');
        if (weeklySummaryEl) {
            weeklySummaryEl.textContent = summaryText;
        }
    }

    loadTasks() {
        const tasks = window.storage.getTasks();
        this.renderTasks(tasks);
        this.updateTaskStats();
    }

    renderTasks(tasks) {
        const taskList = document.getElementById('taskList');
        if (!taskList) return;

        if (tasks.length === 0) {
            taskList.innerHTML = `
                <div class="empty-state">
                    <h3>No tasks yet</h3>
                    <p>Add your first task to get started!</p>
                    <button class="btn-primary" onclick="app.openModal('taskModal')">Add Task</button>
                </div>
            `;
            return;
        }

        taskList.innerHTML = tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                       onchange="app.toggleTask(${task.id})">
                <div class="task-content">
                    <div class="task-title">${Utils.sanitizeInput(task.title)}</div>
                    <div class="task-meta">
                        ${task.category} • ${Utils.formatDate(task.createdAt)}
                        ${task.expenseRelated ? ' • 💰 Expense-related' : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button onclick="app.editTask(${task.id})" title="Edit">✏️</button>
                    <button onclick="app.deleteTask(${task.id})" title="Delete">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    updateTaskStats() {
        const tasks = window.storage.getTasks();
        const today = new Date().toDateString();
        const todayTasks = tasks.filter(task => 
            new Date(task.createdAt).toDateString() === today
        );
        const completedToday = todayTasks.filter(task => task.completed).length;
        
        // Update stats
        const taskStreakEl = document.getElementById('taskStreak');
        const todayProgressEl = document.getElementById('todayProgress');
        
        if (taskStreakEl) {
            // Calculate task streak (simplified)
            taskStreakEl.textContent = this.calculateTaskStreak();
        }
        
        if (todayProgressEl) {
            const percentage = todayTasks.length > 0 ? Math.round((completedToday / todayTasks.length) * 100) : 0;
            todayProgressEl.textContent = `${percentage}%`;
        }
    }

    calculateTaskStreak() {
        const tasks = window.storage.getTasks();
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
            const dateString = checkDate.toDateString();
            
            const dayTasks = tasks.filter(task => 
                new Date(task.createdAt).toDateString() === dateString
            );
            
            const allCompleted = dayTasks.length > 0 && dayTasks.every(task => task.completed);
            
            if (allCompleted) {
                streak++;
            } else if (i === 0) {
                continue; // Skip today if incomplete
            } else {
                break;
            }
        }
        
        return streak;
    }

    filterTasks(filter) {
        const tasks = window.storage.getTasks();
        let filteredTasks = [];
        
        const today = new Date();
        const todayStr = today.toDateString();
        
        switch (filter) {
            case 'today':
                filteredTasks = tasks.filter(task => 
                    new Date(task.createdAt).toDateString() === todayStr
                );
                break;
            case 'upcoming':
                filteredTasks = tasks.filter(task => 
                    new Date(task.date || task.createdAt) > today && !task.completed
                );
                break;
            case 'completed':
                filteredTasks = tasks.filter(task => task.completed);
                break;
            default:
                filteredTasks = tasks;
        }
        
        this.renderTasks(filteredTasks);
    }

    toggleTask(taskId) {
        const task = window.storage.getTasks().find(t => t.id === taskId);
        if (task) {
            const updatedTask = window.storage.updateTask(taskId, {
                completed: !task.completed,
                updatedAt: new Date().toISOString()
            });
            
            if (updatedTask.completed) {
                Utils.showNotification('Task completed! 🎉', 'success');
                
                // Add expense if task is expense-related
                if (updatedTask.expenseRelated && updatedTask.amount) {
                    window.storage.addExpense({
                        amount: updatedTask.amount,
                        category: 'other',
                        notes: `From task: ${updatedTask.title}`,
                        date: new Date().toISOString().split('T')[0]
                    });
                    Utils.showNotification('Expense added automatically!', 'info');
                }
            }
            
            this.updateDashboard();
            if (this.currentSection === 'tasks') {
                this.loadTasks();
            }
        }
    }

    handleTaskSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const taskData = {
            title: Utils.sanitizeInput(document.getElementById('taskTitle').value),
            category: document.getElementById('taskCategory').value,
            date: document.getElementById('taskDate').value,
            expenseRelated: document.getElementById('taskExpense').checked,
            amount: document.getElementById('taskAmount').value
        };
        
        if (!taskData.title) {
            Utils.showNotification('Please enter a task title', 'error');
            return;
        }
        
        window.storage.addTask(taskData);
        Utils.showNotification('Task added successfully!', 'success');
        
        this.closeModal('taskModal');
        e.target.reset();
        
        if (this.currentSection === 'tasks') {
            this.loadTasks();
        }
        this.updateDashboard();
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            window.storage.deleteTask(taskId);
            Utils.showNotification('Task deleted', 'info');
            
            if (this.currentSection === 'tasks') {
                this.loadTasks();
            }
            this.updateDashboard();
        }
    }

    loadExpenses() {
        const expenses = window.storage.getExpenses();
        this.renderExpenses(expenses);
        this.updateExpenseStats();
    }

    renderExpenses(expenses) {
        const expenseList = document.getElementById('expenseList');
        if (!expenseList) return;

        if (expenses.length === 0) {
            expenseList.innerHTML = `
                <div class="empty-state">
                    <h3>No expenses yet</h3>
                    <p>Start tracking your expenses!</p>
                    <button class="btn-primary" onclick="app.openModal('expenseModal')">Add Expense</button>
                </div>
            `;
            return;
        }

        // Sort by date (newest first)
        const sortedExpenses = expenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        expenseList.innerHTML = sortedExpenses.map(expense => `
            <div class="expense-item" data-expense-id="${expense.id}">
                <div class="expense-info">
                    <div class="expense-category">${expense.category}</div>
                    <div class="expense-notes">${Utils.sanitizeInput(expense.notes || '')}</div>
                    <div class="expense-date">${Utils.formatDate(expense.createdAt)}</div>
                </div>
                <div class="expense-amount">${Utils.formatCurrency(expense.amount)}</div>
                <div class="expense-actions">
                    <button onclick="app.deleteExpense(${expense.id})" title="Delete">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    updateExpenseStats() {
        const expenses = window.storage.getExpenses();
        const today = new Date();
        
        // Daily expenses
        const dailyExpenses = expenses.filter(expense => 
            Utils.isToday(expense.createdAt)
        ).reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        
        // Weekly expenses
        const weeklyExpenses = window.storage.getWeeklyExpenses();
        
        // Monthly expenses
        const monthlyExpenses = window.storage.getMonthlyExpenses();
        
        // Update UI
        const dailySpendingEl = document.getElementById('dailySpending');
        const weeklySpendingEl = document.getElementById('weeklySpending');
        const monthlySpendingEl = document.getElementById('monthlySpending');
        
        if (dailySpendingEl) dailySpendingEl.textContent = Utils.formatCurrency(dailyExpenses);
        if (weeklySpendingEl) weeklySpendingEl.textContent = Utils.formatCurrency(weeklyExpenses);
        if (monthlySpendingEl) monthlySpendingEl.textContent = Utils.formatCurrency(monthlyExpenses);
        
        // Update savings progress
        this.updateSavingsProgress(monthlyExpenses);
    }

    updateSavingsProgress(monthlyExpenses) {
        const settings = window.storage.getSettings();
        const savingsGoal = settings.savingsGoal || 10000;
        const saved = Math.max(0, savingsGoal - monthlyExpenses);
        const percentage = Math.min((saved / savingsGoal) * 100, 100);
        
        const savingsProgressEl = document.getElementById('savingsProgress');
        const savingsAmountEl = document.getElementById('savingsAmount');
        
        if (savingsProgressEl) {
            Utils.animateProgressBar(savingsProgressEl, percentage);
        }
        
        if (savingsAmountEl) {
            savingsAmountEl.textContent = `Progress: ${Utils.formatCurrency(saved)}`;
        }
    }

    loadExpenseChart() {
        const expenses = window.storage.getExpenses();
        this.charts.createExpensePieChart('expenseChart', expenses);
    }

    handleExpenseSubmit(e) {
        e.preventDefault();
        
        const expenseData = {
            amount: parseFloat(document.getElementById('expenseAmount').value),
            category: document.getElementById('expenseCategory').value,
            notes: Utils.sanitizeInput(document.getElementById('expenseNotes').value),
            date: document.getElementById('expenseDate').value || new Date().toISOString().split('T')[0]
        };
        
        if (!Utils.validateAmount(expenseData.amount)) {
            Utils.showNotification('Please enter a valid amount', 'error');
            return;
        }
        
        window.storage.addExpense(expenseData);
        Utils.showNotification('Expense added successfully!', 'success');
        
        this.closeModal('expenseModal');
        e.target.reset();
        
        if (this.currentSection === 'expenses') {
            this.loadExpenses();
            this.loadExpenseChart();
        }
        this.updateDashboard();
    }

    deleteExpense(expenseId) {
        if (confirm('Are you sure you want to delete this expense?')) {
            window.storage.deleteExpense(expenseId);
            Utils.showNotification('Expense deleted', 'info');
            
            if (this.currentSection === 'expenses') {
                this.loadExpenses();
                this.loadExpenseChart();
            }
            this.updateDashboard();
        }
    }

    loadFoodData() {
        this.loadPantryItems();
        this.updateMealPlan();
        this.updateFoodStats();
    }

    loadPantryItems() {
        const items = window.storage.getFoodItems();
        const pantryList = document.getElementById('pantryList');
        
        if (!pantryList) return;

        if (items.length === 0) {
            pantryList.innerHTML = `
                <div class="empty-state">
                    <h3>Empty pantry</h3>
                    <p>Add food items to get meal suggestions!</p>
                    <button class="btn-primary" onclick="app.openModal('foodModal')">Add Food Item</button>
                </div>
            `;
            return;
        }

        pantryList.innerHTML = items.map(item => `
            <div class="pantry-item" data-item-id="${item.id}">
                <div class="pantry-info">
                    <div class="pantry-name">${Utils.sanitizeInput(item.name)}</div>
                    <div class="pantry-details">${item.quantity} ${item.unit}</div>
                    <div class="pantry-expiry">Expires: ${Utils.formatDate(item.expiry)}</div>
                </div>
                <div class="pantry-actions">
                    <button onclick="app.deleteFoodItem(${item.id})" title="Delete">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    updateMealPlan() {
        const suggestions = Utils.getMealSuggestions();
        
        const breakfastMealEl = document.getElementById('breakfastMeal');
        const lunchMealEl = document.getElementById('lunchMeal');
        const dinnerMealEl = document.getElementById('dinnerMeal');
        
        if (breakfastMealEl) breakfastMealEl.textContent = suggestions.breakfast;
        if (lunchMealEl) lunchMealEl.textContent = suggestions.lunch;
        if (dinnerMealEl) dinnerMealEl.textContent = suggestions.dinner;
    }

    updateFoodStats() {
        // Mock data for food stats
        const homeMealsEl = document.getElementById('homeMeals');
        const moneySavedEl = document.getElementById('moneySaved');
        const caloriesConsumedEl = document.getElementById('caloriesConsumed');
        
        if (homeMealsEl) homeMealsEl.textContent = '3';
        if (moneySavedEl) moneySavedEl.textContent = '₹450';
        if (caloriesConsumedEl) caloriesConsumedEl.textContent = '1850';
    }

    handleFoodSubmit(e) {
        e.preventDefault();
        
        const foodData = {
            name: Utils.sanitizeInput(document.getElementById('foodName').value),
            quantity: parseFloat(document.getElementById('foodQuantity').value),
            unit: Utils.sanitizeInput(document.getElementById('foodUnit').value),
            expiry: document.getElementById('foodExpiry').value
        };
        
        if (!foodData.name || !foodData.quantity) {
            Utils.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        window.storage.addFoodItem(foodData);
        Utils.showNotification('Food item added!', 'success');
        
        this.closeModal('foodModal');
        e.target.reset();
        
        if (this.currentSection === 'food') {
            this.loadFoodData();
        }
    }

    deleteFoodItem(itemId) {
        if (confirm('Remove this item from pantry?')) {
            window.storage.deleteFoodItem(itemId);
            Utils.showNotification('Item removed', 'info');
            
            if (this.currentSection === 'food') {
                this.loadFoodData();
            }
        }
    }

    loadFitnessData() {
        this.updateFitnessStats();
        this.updateBadges();
    }

    updateFitnessStats() {
        const workouts = window.storage.getWorkouts();
        const streak = window.storage.getWorkoutStreak();
        
        const fitnessStreakEl = document.getElementById('fitnessStreak');
        const weeklyWorkoutsEl = document.getElementById('weeklyWorkouts');
        const totalWorkoutsEl = document.getElementById('totalWorkouts');
        
        if (fitnessStreakEl) {
            Utils.animateNumber(fitnessStreakEl, 0, streak);
        }
        
        // Weekly workouts count
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const weeklyCount = workouts.filter(w => new Date(w.createdAt) >= weekAgo).length;
        
        if (weeklyWorkoutsEl) {
            weeklyWorkoutsEl.textContent = `${weeklyCount}/7`;
        }
        
        if (totalWorkoutsEl) {
            totalWorkoutsEl.textContent = workouts.length;
        }
    }

    updateBadges() {
        const badges = window.storage.getBadges();
        const badgeElements = document.querySelectorAll('.badge');
        
        // Update badge states
        badgeElements.forEach((badge, index) => {
            const badgeTypes = ['firstWorkout', 'sevenDayStreak', 'consistencyKing'];
            const badgeType = badgeTypes[index];
            
            if (badges[badgeType]) {
                badge.classList.remove('locked');
                badge.classList.add('unlocked');
            } else {
                badge.classList.remove('unlocked');
                badge.classList.add('locked');
            }
        });
    }

    markWorkout() {
        const today = new Date().toDateString();
        const workouts = window.storage.getWorkouts();
        
        // Check if already worked out today
        const alreadyWorkedOut = workouts.some(w => 
            new Date(w.createdAt).toDateString() === today
        );
        
        if (alreadyWorkedOut) {
            Utils.showNotification('You already marked a workout today!', 'info');
            return;
        }
        
        window.storage.addWorkout({
            type: 'general',
            duration: 0,
            date: new Date().toISOString()
        });
        
        Utils.showNotification('Workout marked! Keep it up! 💪', 'success');
        
        // Check for new badges
        const data = {
            workouts: window.storage.getWorkouts()
        };
        Utils.checkBadgeEligibility(data);
        
        if (this.currentSection === 'fitness') {
            this.loadFitnessData();
        }
        this.updateDashboard();
    }

    startExercise(exerciseType) {
        const exercise = Utils.getExerciseInstructions(exerciseType);
        if (!exercise) return;
        
        // Update exercise modal content
        const exerciseModal = document.getElementById('exerciseModal');
        if (exerciseModal) {
            const titleEl = exerciseModal.querySelector('#exerciseTitle');
            const instructionsEl = exerciseModal.querySelector('#exerciseInstructions');
            
            if (titleEl) titleEl.textContent = exercise.title;
            if (instructionsEl) {
                instructionsEl.innerHTML = `
                    <div class="exercise-details">
                        <p><strong>Duration:</strong> ${exercise.duration}</p>
                        <p><strong>Calories burned:</strong> ~${exercise.calories}</p>
                        <h4>Instructions:</h4>
                        <ol>
                            ${exercise.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                        </ol>
                    </div>
                `;
            }
            
            this.openModal('exerciseModal');
            
            // Handle complete button
            const completeBtn = document.getElementById('completeExerciseBtn');
            if (completeBtn) {
                completeBtn.onclick = () => {
                    this.completeExercise(exerciseType, exercise);
                };
            }
        }
    }

    completeExercise(exerciseType, exercise) {
        window.storage.addWorkout({
            type: exerciseType,
            duration: exercise.calories,
            date: new Date().toISOString()
        });
        
        Utils.showNotification(`${exercise.title} completed! 🎉`, 'success');
        this.closeModal('exerciseModal');
        
        if (this.currentSection === 'fitness') {
            this.loadFitnessData();
        }
        this.updateDashboard();
    }

    loadStressData() {
        this.loadMoodChart();
        this.loadInsights();
    }

    loadMoodChart() {
        const moods = window.storage.getMoods();
        this.charts.createMoodChart('moodChart', moods);
    }

    loadInsights() {
        const data = {
            tasks: window.storage.getTasks(),
            expenses: window.storage.getExpenses(),
            workouts: window.storage.getWorkouts(),
            moods: window.storage.getMoods()
        };
        
        const insights = Utils.generateWeeklyInsights(data);
        const insightCardsEl = document.getElementById('insightCards');
        
        if (insightCardsEl && insights.length > 0) {
            insightCardsEl.innerHTML = insights.map(insight => `
                <div class="insight-card">
                    <p>${insight}</p>
                </div>
            `).join('');
        }
    }

    selectMood(mood) {
        // Update UI
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`[data-mood="${mood}"]`).classList.add('selected');
        
        // Save mood
        window.storage.addMood({ mood });
        Utils.showNotification('Mood recorded! 😊', 'success');
        
        if (this.currentSection === 'stress') {
            this.loadStressData();
        }
        this.updateDashboard();
    }

    startMeditation() {
        Utils.showNotification('🧘 Take 5 minutes to meditate. Find a quiet space and focus on your breathing.', 'info', 5000);
    }

    startBreathingExercise() {
        const circle = document.querySelector('.circle');
        const text = document.getElementById('breathingText');
        const button = document.getElementById('startBreathingBtn');
        
        if (this.breathingState === 'running') {
            // Stop exercise
            this.stopBreathingExercise();
            return;
        }
        
        this.breathingState = 'running';
        button.textContent = 'Stop Exercise';
        
        let cycle = 0;
        const maxCycles = 5;
        
        const runCycle = () => {
            if (this.breathingState !== 'running') return;
            
            // Inhale phase
            circle.classList.add('inhale');
            text.textContent = 'Breathe in...';
            
            setTimeout(() => {
                if (this.breathingState !== 'running') return;
                
                // Hold phase
                text.textContent = 'Hold...';
                
                setTimeout(() => {
                    if (this.breathingState !== 'running') return;
                    
                    // Exhale phase
                    circle.classList.remove('inhale');
                    text.textContent = 'Breathe out...';
                    
                    setTimeout(() => {
                        cycle++;
                        if (cycle < maxCycles && this.breathingState === 'running') {
                            runCycle();
                        } else {
                            this.stopBreathingExercise();
                            Utils.showNotification('Breathing exercise completed! 🧘‍♀️', 'success');
                        }
                    }, 4000);
                }, 2000);
            }, 4000);
        };
        
        runCycle();
    }

    stopBreathingExercise() {
        this.breathingState = 'stopped';
        const circle = document.querySelector('.circle');
        const text = document.getElementById('breathingText');
        const button = document.getElementById('startBreathingBtn');
        
        if (circle) circle.classList.remove('inhale');
        if (text) text.textContent = 'Click Start to begin';
        if (button) button.textContent = 'Start Exercise';
    }

    generateWeeklyReport() {
        const data = {
            tasks: window.storage.getTasks(),
            expenses: window.storage.getExpenses(),
            workouts: window.storage.getWorkouts(),
            moods: window.storage.getMoods()
        };
        
        this.updateReportStats(data);
        this.generatePersonalizedAdvice(data);
        this.loadTrendsChart(data);
    }

    updateReportStats(data) {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        // Tasks
        const weeklyTasks = data.tasks.filter(t => new Date(t.createdAt) >= weekAgo);
        const completedTasks = weeklyTasks.filter(t => t.completed).length;
        const taskPercentage = weeklyTasks.length > 0 ? Math.round((completedTasks / weeklyTasks.length) * 100) : 0;
        
        // Expenses
        const weeklyExpenses = data.expenses.filter(e => new Date(e.createdAt) >= weekAgo);
        const totalSpent = weeklyExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
        
        // Workouts
        const weeklyWorkouts = data.workouts.filter(w => new Date(w.createdAt) >= weekAgo);
        
        // Mood
        const weeklyMoods = data.moods.filter(m => new Date(m.date) >= weekAgo);
        const avgMood = window.storage.getWeeklyMoodAverage();
        
        // Update UI
        const reportTasksCompleted = document.getElementById('reportTasksCompleted');
        const reportTasksDetail = document.getElementById('reportTasksDetail');
        const reportTotalSpent = document.getElementById('reportTotalSpent');
        const reportExpenseDetail = document.getElementById('reportExpenseDetail');
        const reportHealthyMeals = document.getElementById('reportHealthyMeals');
        const reportFoodDetail = document.getElementById('reportFoodDetail');
        const reportWorkoutDays = document.getElementById('reportWorkoutDays');
        const reportFitnessDetail = document.getElementById('reportFitnessDetail');
        const reportStressLevel = document.getElementById('reportStressLevel');
        const reportStressDetail = document.getElementById('reportStressDetail');
        
        if (reportTasksCompleted) reportTasksCompleted.textContent = `${taskPercentage}%`;
        if (reportTasksDetail) reportTasksDetail.textContent = `${completedTasks}/${weeklyTasks.length} tasks completed this week`;
        if (reportTotalSpent) reportTotalSpent.textContent = Utils.formatCurrency(totalSpent);
        if (reportExpenseDetail) {
            const topCategory = this.getTopExpenseCategory(weeklyExpenses);
            reportExpenseDetail.textContent = `Top category: ${topCategory}`;
        }
        if (reportHealthyMeals) reportHealthyMeals.textContent = '5/7'; // Mock data
        if (reportFoodDetail) reportFoodDetail.textContent = 'Cooked at home 5 days, saved ₹1,200';
        if (reportWorkoutDays) reportWorkoutDays.textContent = `${weeklyWorkouts.length}/7`;
        if (reportFitnessDetail) {
            const streak = window.storage.getWorkoutStreak();
            reportFitnessDetail.textContent = `Maintained ${streak}-day streak`;
        }
        if (reportStressLevel) reportStressLevel.textContent = this.getMoodLabel(avgMood);
        if (reportStressDetail) {
            const stressedDays = weeklyMoods.filter(m => ['stressed', 'very-stressed'].includes(m.mood)).length;
            const goodDays = weeklyMoods.filter(m => ['happy', 'very-happy'].includes(m.mood)).length;
            reportStressDetail.textContent = `High stress on ${stressedDays} days, good mood on ${goodDays} days`;
        }
    }

    getTopExpenseCategory(expenses) {
        const categoryTotals = {};
        expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + parseFloat(expense.amount);
        });
        
        return Object.keys(categoryTotals).reduce((a, b) => 
            categoryTotals[a] > categoryTotals[b] ? a : b, 'None'
        );
    }

    getMoodLabel(mood) {
        const labels = {
            'very-happy': 'Very Good',
            'happy': 'Good',
            'neutral': 'Medium',
            'stressed': 'High',
            'very-stressed': 'Very High'
        };
        return labels[mood] || 'Medium';
    }

    generatePersonalizedAdvice(data) {
        const insights = Utils.generateWeeklyInsights(data);
        const advice = insights.join(' ');
        
        const personalizedAdviceEl = document.getElementById('personalizedAdvice');
        if (personalizedAdviceEl) {
            personalizedAdviceEl.innerHTML = `<p>${advice}</p>`;
        }
    }

    loadTrendsChart(data) {
        this.charts.createTrendsChart('trendsChart', data);
    }

    exportReport() {
        const data = window.storage.exportData();
        Utils.exportToJSON(data, 'work-life-balance-report.json');
        Utils.showNotification('Report exported successfully!', 'success');
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        // Stop breathing exercise if closing that modal
        if (modalId === 'breathingModal') {
            this.stopBreathingExercise();
        }
    }

    toggleTheme() {
        const settings = window.storage.getSettings();
        const isDark = !settings.darkMode;
        
        window.storage.updateSettings({ darkMode: isDark });
        Utils.applyTheme(isDark);
        
        Utils.showNotification(`${isDark ? 'Dark' : 'Light'} mode enabled`, 'info');
    }

    loadSettings() {
        const settings = window.storage.getSettings();
        Utils.applyTheme(settings.darkMode);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WorkLifeBalanceApp();
});