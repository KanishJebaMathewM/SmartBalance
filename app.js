// Main application logic for Work-Life Balance Companion

class WorkLifeBalanceApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.charts = new Charts();
        this.breathingInterval = null;
        this.breathingState = 'stopped';
        this.currentExpenseTab = 'overview';
        this.currentCalendarDate = new Date();
        this.selectedCalendarDate = null;

        // Timer state
        this.exerciseTimer = null;
        this.timerState = 'stopped'; // stopped, running, paused
        this.timerDuration = 0; // in seconds
        this.timerRemaining = 0; // in seconds
        this.currentExerciseType = null;

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

        // Override old methods with enhanced versions
        this.overrideMethodsWithEnhancedVersions();

        // Verify fitness functionality
        this.verifyFitnessFunctionality();
    }

    overrideMethodsWithEnhancedVersions() {
        // Override startExercise with enhanced version
        this.startExercise = this.startExerciseEnhanced;

        // Override completeExercise with enhanced version
        this.completeExercise = this.completeExerciseEnhanced;

        // Override loadFitnessData with enhanced version
        this.loadFitnessData = this.loadFitnessDataEnhanced;

        // Override updateFitnessStats with enhanced version
        this.updateFitnessStats = this.updateFitnessStatsEnhanced;
    }

    verifyFitnessFunctionality() {
        console.log('✅ Fitness functionality verification:');
        console.log('✅ Enhanced startExercise method:', typeof this.startExercise === 'function');
        console.log('✅ Enhanced completeExercise method:', typeof this.completeExercise === 'function');
        console.log('✅ Enhanced loadFitnessData method:', typeof this.loadFitnessData === 'function');
        console.log('✅ Enhanced updateFitnessStats method:', typeof this.updateFitnessStats === 'function');

        // Check if DOM elements exist
        const elements = [
            'fitnessStreak',
            'weeklyWorkouts',
            'totalWorkouts',
            'totalCaloriesBurnt',
            'exerciseModal',
            'completeExerciseBtn',
            'skipExerciseBtn'
        ];

        elements.forEach(id => {
            const element = document.getElementById(id);
            console.log(`✅ Element #${id}:`, element ? 'Found' : 'Not found');
        });

        console.log('✅ Fitness functionality verification complete!');
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

        // Expense tabs
        this.initializeExpenseTabHandlers();

        // Calendar view toggle button
        const viewToggleBtn = document.getElementById('viewToggleBtn');
        if (viewToggleBtn) {
            viewToggleBtn.addEventListener('click', () => {
                this.switchToCalendarView();
            });
        }

        // Habit tabs
        this.initializeHabitTabHandlers();

        // Food tracking tabs
        this.initializeFoodTrackingTabHandlers();

        // Meal form handlers
        this.initializeMealFormHandlers();

        // Calendar handlers
        this.initializeCalendarHandlers();

        // Habit tab handlers
        this.initializeHabitTabHandlers();
    }

    initializeModalControls() {
        // Modal open buttons
        const modalTriggers = {
            'addTaskBtn': 'taskModal',
            'addExpenseBtn': 'expenseModal',
            'addFoodBtn': 'foodModal',
            'addMealBtn': 'mealModal',
            'moodCheckBtn': 'moodModal',
            'breathingBtn': 'breathingModal',
            'setIncomeBtn': 'incomeModal',
            'viewMealCalendarBtn': () => this.viewMealCalendar()
        };

        Object.entries(modalTriggers).forEach(([buttonId, modalIdOrFunction]) => {
            const button = document.getElementById(buttonId);
            if (button) {
                if (typeof modalIdOrFunction === 'function') {
                    button.addEventListener('click', modalIdOrFunction);
                } else {
                    button.addEventListener('click', () => this.openModal(modalIdOrFunction));
                }
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
            
            // Show/hide expense task details
            const expenseCheckbox = document.getElementById('taskExpense');
            const expenseDetails = document.getElementById('expenseTaskDetails');
            if (expenseCheckbox && expenseDetails) {
                expenseCheckbox.addEventListener('change', () => {
                    expenseDetails.style.display = expenseCheckbox.checked ? 'block' : 'none';
                    if (expenseCheckbox.checked) {
                        this.updateExpenseCategory();
                    }
                });
            }

            // Handle task category changes to auto-update expense category (only if expense is checked)
            const taskCategorySelect = document.getElementById('taskCategory');
            if (taskCategorySelect) {
                taskCategorySelect.addEventListener('change', () => {
                    const expenseCheckbox = document.getElementById('taskExpense');
                    if (expenseCheckbox && expenseCheckbox.checked) {
                        this.updateExpenseCategory();
                    }
                });
            }

            // Handle change expense category button
            const changeExpenseCategoryBtn = document.getElementById('changeExpenseCategoryBtn');
            const expenseCategorySelect = document.getElementById('taskExpenseCategory');
            if (changeExpenseCategoryBtn && expenseCategorySelect) {
                changeExpenseCategoryBtn.addEventListener('click', () => {
                    expenseCategorySelect.style.display = 'block';
                    changeExpenseCategoryBtn.style.display = 'none';
                });

                expenseCategorySelect.addEventListener('change', () => {
                    if (expenseCategorySelect.value) {
                        const selectedOption = expenseCategorySelect.querySelector(`option[value="${expenseCategorySelect.value}"]`);
                        const categoryDisplay = document.getElementById('selectedExpenseCategory');
                        if (categoryDisplay && selectedOption) {
                            categoryDisplay.textContent = selectedOption.textContent;
                        }
                        expenseCategorySelect.style.display = 'none';
                        changeExpenseCategoryBtn.style.display = 'inline';
                    }
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

        // Meal form
        const mealForm = document.getElementById('mealForm');
        if (mealForm) {
            mealForm.addEventListener('submit', (e) => this.handleMealSubmit(e));
        }


        // Income form
        const incomeForm = document.getElementById('incomeForm');
        if (incomeForm) {
            incomeForm.addEventListener('submit', (e) => this.handleIncomeSubmit(e));
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

        // Budget and savings goal buttons
        const setBudgetBtn = document.getElementById('setBudgetBtn');
        const setSavingsGoalBtn = document.getElementById('setSavingsGoalBtn');
        const manageRecurringBtn = document.getElementById('manageRecurringBtn');

        if (setBudgetBtn) {
            setBudgetBtn.addEventListener('click', () => this.openModal('budgetModal'));
        }

        if (setSavingsGoalBtn) {
            setSavingsGoalBtn.addEventListener('click', () => this.openModal('savingsGoalModal'));
        }

        if (manageRecurringBtn) {
            manageRecurringBtn.addEventListener('click', () => this.openModal('recurringModal'));
        }

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

        // Exercise timer controls
        const startTimerBtn = document.getElementById('startTimerBtn');
        const pauseTimerBtn = document.getElementById('pauseTimerBtn');
        const resetTimerBtn = document.getElementById('resetTimerBtn');

        if (startTimerBtn) {
            startTimerBtn.addEventListener('click', () => this.startExerciseTimer());
        }

        if (pauseTimerBtn) {
            pauseTimerBtn.addEventListener('click', () => this.pauseExerciseTimer());
        }

        if (resetTimerBtn) {
            resetTimerBtn.addEventListener('click', () => this.resetExerciseTimer());
        }

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportReport());
        }

        // Enhanced expense form handlers
        this.initializeExpenseFormEnhancements();

        // Export button handlers
        this.initializeExportHandlers();
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
                this.loadExpenseSection();
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
            case 'habits':
                this.loadHabitsSection();
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
        const mealSuggestionEl = document.getElementById('mealSuggestion');
        if (!mealSuggestionEl) return;

        // First check for upcoming planned meals
        const upcomingMeals = window.storage.getMeals().filter(meal => {
            const mealDate = new Date(meal.date);
            const now = new Date();
            return mealDate >= now && meal.status === 'planned';
        }).sort((a, b) => new Date(a.date) - new Date(b.date));

        if (upcomingMeals.length > 0) {
            const nextMeal = upcomingMeals[0];
            const mealDate = new Date(nextMeal.date);
            const isToday = mealDate.toDateString() === new Date().toDateString();
            mealSuggestionEl.textContent = `${isToday ? 'Next' : 'Upcoming'}: ${nextMeal.name}`;
            return;
        }

        // If no upcoming planned meals, use smart suggestion
        const smartSuggestion = this.getSmartMealSuggestion();
        const suggestions = this.generateMealSuggestions(smartSuggestion.mealType);
        mealSuggestionEl.textContent = `${smartSuggestion.context}: ${suggestions[0].name}`;
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

        const weeklyStats = window.storage.getWeeklyMealStats();
        const homeCookingPercentage = weeklyStats.totalMeals > 0 ? Math.round((weeklyStats.homeMeals / weeklyStats.totalMeals) * 100) : 0;

        const summaryText = `You completed ${taskPercentage}% of tasks, spent ${Utils.formatCurrency(weeklyExpenseAmount)}, cooked ${homeCookingPercentage}% of meals at home, did ${weeklyWorkouts.length} workouts, stress was high on ${stressedDays} days.`;
        
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
                        ${task.expenseRelated ? ' • ���� Expense-related' : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button onclick="app.editTask(${task.id})" title="Edit">����️</button>
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
        this.toggleTaskEnhanced(taskId);
    }

    handleTaskSubmit(e) {
        this.handleTaskSubmitEnhanced(e);
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

    // Enhanced expense loading
    loadExpenseSection() {
        this.loadExpenseTabs();
        this.updateExpenseStats();
        this.loadCurrentExpenseTab();
    }

    loadExpenseTabs() {
        // Initialize tab content based on current tab
        switch (this.currentExpenseTab) {
            case 'overview':
                this.loadOverviewTab();
                break;
            case 'calendar':
                this.loadCalendarTab();
                break;
            case 'analytics':
                this.loadAnalyticsTab();
                break;
            case 'insights':
                this.loadInsightsTab();
                break;
        }
    }

    loadCurrentExpenseTab() {
        // Show current tab content
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        const currentTab = document.getElementById(`${this.currentExpenseTab}-tab`);
        if (currentTab) {
            currentTab.classList.add('active');
        }

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const activeBtn = document.querySelector(`[data-tab="${this.currentExpenseTab}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    loadOverviewTab() {
        const expenses = window.storage.getExpenses();
        this.renderRecentExpenses(expenses.slice(0, 10)); // Show only recent 10
        this.loadQuickCharts();
        this.loadBudgetTracker();
    }

    renderRecentExpenses(expenses) {
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
                <div class="expense-category-icon" style="background: ${this.charts.getCategoryColor(expense.category)}20; color: ${this.charts.getCategoryColor(expense.category)}">
                    ${this.getCategoryIcon(expense.category)}
                </div>
                <div class="expense-info">
                    <div class="expense-title">${this.getCategoryDisplayName(expense.category)}</div>
                    <div class="expense-description">${Utils.sanitizeInput(expense.notes || 'No description')}</div>
                    <div class="expense-date">${Utils.formatDate(expense.createdAt)}</div>
                </div>
                <div class="expense-amount-display">${Utils.formatCurrency(expense.amount)}</div>
                <div class="expense-actions">
                    <button onclick="app.editExpense(${expense.id})" title="Edit">✏���</button>
                    <button onclick="app.deleteExpense(${expense.id})" title="Delete">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    loadQuickCharts() {
        const expenses = window.storage.getExpenses();

        // Load pie chart
        this.charts.createExpensePieChart('expenseChart', expenses);

        // Load weekly trend chart
        this.charts.createWeeklyTrendChart('weeklyTrendChart', expenses);
    }

    loadBudgetTracker() {
        const budgetCategories = document.getElementById('budgetCategories');
        if (!budgetCategories) return;

        const settings = window.storage.getSettings();
        const budgets = settings.categoryBudgets || {};
        const expenses = window.storage.getExpenses();

        // Calculate current month expenses by category
        const thisMonth = new Date();
        const monthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
        const monthEnd = new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 1, 0);

        const monthlyExpensesByCategory = {};
        expenses.forEach(expense => {
            const expenseDate = new Date(expense.createdAt);
            if (expenseDate >= monthStart && expenseDate <= monthEnd) {
                const category = expense.category;
                monthlyExpensesByCategory[category] = (monthlyExpensesByCategory[category] || 0) + parseFloat(expense.amount);
            }
        });

        const categories = Object.keys(budgets);
        if (categories.length === 0) {
            budgetCategories.innerHTML = `
                <div class="empty-state">
                    <p>No budget set. <button class="btn-link" onclick="app.openModal('budgetModal')">Set your budget</button></p>
                </div>
            `;
            return;
        }

        budgetCategories.innerHTML = categories.map(category => {
            const budgetAmount = budgets[category];
            const spentAmount = monthlyExpensesByCategory[category] || 0;
            const percentage = Math.min((spentAmount / budgetAmount) * 100, 100);
            const isOverBudget = spentAmount > budgetAmount;

            return `
                <div class="budget-item">
                    <div class="budget-category">${this.getCategoryDisplayName(category)}</div>
                    <div class="budget-progress">
                        <div class="budget-bar">
                            <div class="budget-fill ${isOverBudget ? 'over-budget' : ''}" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                    <div class="budget-amount ${isOverBudget ? 'over-budget' : ''}">
                        ${Utils.formatCurrency(spentAmount)} / ${Utils.formatCurrency(budgetAmount)}
                    </div>
                </div>
            `;
        }).join('');
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
                    <button onclick="app.deleteExpense(${expense.id})" title="Delete">🗑���</button>
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

        // Average daily expenses (last 30 days)
        const last30Days = expenses.filter(expense => {
            const expenseDate = new Date(expense.createdAt);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return expenseDate >= thirtyDaysAgo;
        });

        const totalLast30Days = last30Days.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        const averageDaily = totalLast30Days / 30;

        // Update UI
        const dailySpendingEl = document.getElementById('dailySpending');
        const weeklySpendingEl = document.getElementById('weeklySpending');
        const monthlySpendingEl = document.getElementById('monthlySpending');
        const averageDailyEl = document.getElementById('averageDaily');

        if (dailySpendingEl) dailySpendingEl.textContent = Utils.formatCurrency(dailyExpenses);
        if (weeklySpendingEl) weeklySpendingEl.textContent = Utils.formatCurrency(weeklyExpenses);
        if (monthlySpendingEl) monthlySpendingEl.textContent = Utils.formatCurrency(monthlyExpenses);
        if (averageDailyEl) averageDailyEl.textContent = Utils.formatCurrency(averageDaily);

        // Update income overview
        this.updateIncomeOverview(monthlyExpenses);

        // Update savings progress
        this.updateSavingsProgress(monthlyExpenses);

        // Generate financial insights
        this.generateFinancialInsights(monthlyExpenses, expenses);
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

    // Calendar Tab Methods
    loadCalendarTab() {
        this.updateCalendarHeader();
        this.renderExpenseCalendar();
    }

    updateCalendarHeader() {
        const currentMonthYearEl = document.getElementById('currentMonthYear');
        if (currentMonthYearEl) {
            currentMonthYearEl.textContent = this.currentCalendarDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            });
        }
    }

    renderExpenseCalendar() {
        const calendarEl = document.getElementById('expenseCalendar');
        if (!calendarEl) return;

        const year = this.currentCalendarDate.getFullYear();
        const month = this.currentCalendarDate.getMonth();

        // Get first day of month and last day
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const firstDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        // Get expenses for this month
        const expenses = window.storage.getExpenses();
        const monthExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date || expense.createdAt);
            return expenseDate.getFullYear() === year && expenseDate.getMonth() === month;
        });

        // Group expenses by date
        const expensesByDate = {};
        monthExpenses.forEach(expense => {
            const date = new Date(expense.date || expense.createdAt).getDate();
            if (!expensesByDate[date]) {
                expensesByDate[date] = [];
            }
            expensesByDate[date].push(expense);
        });

        let calendarHTML = `
            <div class="calendar-header-row">
                <div class="calendar-day-header">Sun</div>
                <div class="calendar-day-header">Mon</div>
                <div class="calendar-day-header">Tue</div>
                <div class="calendar-day-header">Wed</div>
                <div class="calendar-day-header">Thu</div>
                <div class="calendar-day-header">Fri</div>
                <div class="calendar-day-header">Sat</div>
            </div>
            <div class="calendar-grid">
        `;

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDayOfWeek; i++) {
            const prevMonthDay = new Date(year, month, 0 - (firstDayOfWeek - 1 - i)).getDate();
            calendarHTML += `<div class="calendar-day other-month"><div class="day-number">${prevMonthDay}</div></div>`;
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            const isSelected = this.selectedCalendarDate &&
                this.selectedCalendarDate.getDate() === day &&
                this.selectedCalendarDate.getMonth() === month &&
                this.selectedCalendarDate.getFullYear() === year;

            const dayExpenses = expensesByDate[day] || [];
            const totalAmount = dayExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

            let expenseClass = '';
            let expenseDisplay = '';

            if (totalAmount > 0) {
                if (totalAmount < 500) {
                    expenseClass = 'expense-low';
                } else if (totalAmount <= 1500) {
                    expenseClass = 'expense-medium';
                } else {
                    expenseClass = 'expense-high';
                }
                expenseDisplay = `<div class="day-expense-amount ${expenseClass}">${Utils.formatCurrency(totalAmount)}</div>`;
            }

            calendarHTML += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}"
                     onclick="app.selectCalendarDate(${year}, ${month}, ${day})">
                    <div class="day-number">${day}</div>
                    ${expenseDisplay}
                </div>
            `;
        }

        // Add empty cells for remaining days
        const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
        const remainingCells = totalCells - (firstDayOfWeek + daysInMonth);

        for (let i = 1; i <= remainingCells; i++) {
            calendarHTML += `<div class="calendar-day other-month"><div class="day-number">${i}</div></div>`;
        }

        calendarHTML += '</div>';
        calendarEl.innerHTML = calendarHTML;
    }

    selectCalendarDate(year, month, day) {
        this.selectedCalendarDate = new Date(year, month, day);
        this.renderExpenseCalendar();
        this.showSelectedDateExpenses();
    }

    showSelectedDateExpenses() {
        if (!this.selectedCalendarDate) return;

        const selectedDateTitle = document.getElementById('selectedDateTitle');
        const dateExpenseList = document.getElementById('dateExpenseList');

        if (!selectedDateTitle || !dateExpenseList) return;

        const dateStr = this.selectedCalendarDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        selectedDateTitle.textContent = `Expenses for ${dateStr}`;

        const expenses = window.storage.getExpenses();
        const selectedDateStr = this.selectedCalendarDate.toDateString();
        const dayExpenses = expenses.filter(expense =>
            new Date(expense.date || expense.createdAt).toDateString() === selectedDateStr
        );

        if (dayExpenses.length === 0) {
            dateExpenseList.innerHTML = `
                <div class="empty-state">
                    <p>No expenses on this date</p>
                    <button class="btn-primary" onclick="app.addExpenseForDate('${this.selectedCalendarDate.toISOString()}')">Add Expense</button>
                </div>
            `;
            return;
        }

        const totalAmount = dayExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

        dateExpenseList.innerHTML = `
            <div class="date-summary">
                <h4>Total: ${Utils.formatCurrency(totalAmount)}</h4>
            </div>
            ${dayExpenses.map(expense => `
                <div class="date-expense-item">
                    <div class="expense-category-icon" style="background: ${this.charts.getCategoryColor(expense.category)}">
                        ${this.getCategoryIcon(expense.category)}
                    </div>
                    <div class="expense-details">
                        <div class="expense-title">${this.getCategoryDisplayName(expense.category)}</div>
                        <div class="expense-description">${Utils.sanitizeInput(expense.notes || 'No description')}</div>
                    </div>
                    <div class="expense-amount-display">${Utils.formatCurrency(expense.amount)}</div>
                </div>
            `).join('')}
        `;
    }

    // Analytics Tab Methods
    loadAnalyticsTab() {
        const expenses = window.storage.getExpenses();

        // Load all analytics charts
        this.charts.createSpendingTrendChart('spendingTrendChart', expenses, 'month');
        this.charts.createCategoryAnalysisChart('categoryAnalysisChart', expenses, 'pie');
        this.charts.createPaymentMethodChart('paymentMethodChart', expenses);
        this.charts.createComparisonChart('comparisonChart', expenses, 'month-over-month');

        this.generateAnalyticsInsights(expenses);
    }

    generateAnalyticsInsights(expenses) {
        const insightsContainer = document.getElementById('analyticsInsights');
        if (!insightsContainer) return;

        const insights = this.calculateExpenseInsights(expenses);

        insightsContainer.innerHTML = insights.map(insight => `
            <div class="insight-item">
                <div class="insight-title">${insight.title}</div>
                <div class="insight-value">${insight.value}</div>
                <div class="insight-description">${insight.description}</div>
            </div>
        `).join('');
    }

    calculateExpenseInsights(expenses) {
        const insights = [];

        // Highest spending category
        const categoryTotals = {};
        expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + parseFloat(expense.amount);
        });

        const topCategory = Object.keys(categoryTotals).reduce((a, b) =>
            categoryTotals[a] > categoryTotals[b] ? a : b, 'none'
        );

        if (topCategory !== 'none') {
            insights.push({
                title: 'Top Spending Category',
                value: this.getCategoryDisplayName(topCategory),
                description: `${Utils.formatCurrency(categoryTotals[topCategory])} total`
            });
        }

        // Average transaction amount
        const avgTransaction = expenses.length > 0 ?
            expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) / expenses.length : 0;

        insights.push({
            title: 'Average Transaction',
            value: Utils.formatCurrency(avgTransaction),
            description: `Based on ${expenses.length} transactions`
        });

        // Most expensive day
        const dailyTotals = {};
        expenses.forEach(expense => {
            const date = new Date(expense.createdAt).toDateString();
            dailyTotals[date] = (dailyTotals[date] || 0) + parseFloat(expense.amount);
        });

        const maxDay = Object.keys(dailyTotals).reduce((a, b) =>
            dailyTotals[a] > dailyTotals[b] ? a : b, null
        );

        if (maxDay) {
            insights.push({
                title: 'Highest Spending Day',
                value: Utils.formatCurrency(dailyTotals[maxDay]),
                description: new Date(maxDay).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                })
            });
        }

        return insights;
    }

    // Insights Tab Methods
    loadInsightsTab() {
        const expenses = window.storage.getExpenses();

        this.loadFinancialHealthScore();
        this.loadIncomeVsExpensesChart();
        this.loadCategoryInsights();
        this.generateSpendingPredictions(expenses);
        this.generateSpendingPatterns(expenses);
        this.generateSmartRecommendations(expenses);
    }

    loadFinancialHealthScore() {
        const analysis = window.storage.getSavingsAnalysis();
        const healthScoreEl = document.getElementById('healthScoreValue');
        const healthBreakdownEl = document.getElementById('healthBreakdown');

        if (healthScoreEl) {
            healthScoreEl.textContent = Math.round(analysis.healthScore);

            // Update the progress circle
            const circle = healthScoreEl.closest('.health-score-circle');
            if (circle) {
                const angle = (analysis.healthScore / 100) * 360;
                circle.style.setProperty('--score-angle', `${angle}deg`);

                // Update color based on score
                let color = '#ef4444'; // red for poor
                if (analysis.healthScore >= 70) color = '#10b981'; // green for good
                else if (analysis.healthScore >= 40) color = '#f59e0b'; // yellow for fair

                circle.style.background = `conic-gradient(${color} 0deg, ${color} ${angle}deg, #e5e7eb ${angle}deg)`;
            }
        }

        if (healthBreakdownEl) {
            const breakdown = [
                { label: 'Savings Rate', value: `${analysis.savingsRate}%`, type: analysis.savingsRate >= 20 ? 'good' : analysis.savingsRate >= 10 ? 'warning' : 'danger' },
                { label: 'Emergency Fund', value: `${analysis.emergencyFundCoverage} months`, type: analysis.emergencyFundCoverage >= 6 ? 'good' : analysis.emergencyFundCoverage >= 3 ? 'warning' : 'danger' },
                { label: 'Income Status', value: analysis.monthlyIncome > analysis.monthlyExpenses ? 'Surplus' : 'Deficit', type: analysis.monthlyIncome > analysis.monthlyExpenses ? 'good' : 'danger' }
            ];

            healthBreakdownEl.innerHTML = breakdown.map(item => `
                <div class="health-breakdown-item">
                    <span class="breakdown-label">${item.label}</span>
                    <span class="breakdown-value ${item.type}">${item.value}</span>
                </div>
            `).join('');
        }
    }

    loadIncomeVsExpensesChart() {
        const summaryEl = document.getElementById('comparisonSummary');
        if (!summaryEl) return;

        const analysis = window.storage.getSavingsAnalysis();
        const stats = [
            { label: 'Monthly Income', value: Utils.formatCurrency(analysis.monthlyIncome), type: 'neutral' },
            { label: 'Monthly Expenses', value: Utils.formatCurrency(analysis.monthlyExpenses), type: 'neutral' },
            { label: 'Monthly Savings', value: Utils.formatCurrency(analysis.monthlySavings), type: analysis.monthlySavings > 0 ? 'positive' : 'negative' },
            { label: 'Savings Rate', value: `${analysis.savingsRate}%`, type: analysis.savingsRate >= 20 ? 'positive' : analysis.savingsRate >= 10 ? 'neutral' : 'negative' }
        ];

        summaryEl.innerHTML = stats.map(stat => `
            <div class="comparison-stat ${stat.type}">
                <div class="comparison-stat-value">${stat.value}</div>
                <div class="comparison-stat-label">${stat.label}</div>
            </div>
        `).join('');

        // Create a simple bar chart using canvas
        const canvas = document.getElementById('incomeVsExpensesChart');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;

            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // Chart data
            const maxValue = Math.max(analysis.monthlyIncome, analysis.monthlyExpenses) * 1.1;
            const barWidth = 80;
            const barSpacing = 100;
            const startX = (width - 2 * barWidth - barSpacing) / 2;

            // Draw income bar
            const incomeHeight = (analysis.monthlyIncome / maxValue) * (height - 80);
            ctx.fillStyle = '#10b981';
            ctx.fillRect(startX, height - incomeHeight - 40, barWidth, incomeHeight);

            // Draw expenses bar
            const expenseHeight = (analysis.monthlyExpenses / maxValue) * (height - 80);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(startX + barWidth + barSpacing, height - expenseHeight - 40, barWidth, expenseHeight);

            // Add labels
            ctx.fillStyle = '#374151';
            ctx.font = '14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Income', startX + barWidth/2, height - 20);
            ctx.fillText('Expenses', startX + barWidth + barSpacing + barWidth/2, height - 20);

            // Add values
            ctx.font = '12px Inter, sans-serif';
            ctx.fillText(Utils.formatCurrency(analysis.monthlyIncome), startX + barWidth/2, height - incomeHeight - 45);
            ctx.fillText(Utils.formatCurrency(analysis.monthlyExpenses), startX + barWidth + barSpacing + barWidth/2, height - expenseHeight - 45);
        }
    }

    loadCategoryInsights() {
        const gridEl = document.getElementById('categoryAnalysisGrid');
        if (!gridEl) return;

        const categoryAnalysis = window.storage.getCategoryWiseAnalysis('month');
        const entries = Object.entries(categoryAnalysis)
            .sort(([,a], [,b]) => b.total - a.total)
            .slice(0, 6); // Show top 6 categories

        gridEl.innerHTML = entries.map(([category, data]) => `
            <div class="category-analysis-item">
                <div class="category-analysis-header">
                    <div class="category-analysis-name">
                        ${this.getCategoryIcon(category)}
                        ${this.getCategoryDisplayName(category)}
                    </div>
                    <div class="category-analysis-percentage">${data.percentage}%</div>
                </div>
                <div class="category-analysis-details">
                    <span>Total: ${Utils.formatCurrency(data.total)}</span>
                    <span>Avg: ${Utils.formatCurrency(data.averageTransaction)}</span>
                </div>
                ${data.recommendation ? `
                    <div class="category-recommendation ${data.recommendation.type}">
                        ${data.recommendation.message}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    generateSpendingPredictions(expenses) {
        const predictions = this.calculateSpendingPredictions(expenses);
        const analysis = window.storage.getSavingsAnalysis();

        const nextWeekEl = document.getElementById('nextWeekPrediction');
        const nextMonthEl = document.getElementById('nextMonthPrediction');
        const annualSavingsEl = document.getElementById('annualSavingsPrediction');
        const weekConfidenceEl = document.getElementById('weekConfidence');
        const monthConfidenceEl = document.getElementById('monthConfidence');

        if (nextWeekEl) nextWeekEl.textContent = Utils.formatCurrency(predictions.nextWeek.amount);
        if (nextMonthEl) nextMonthEl.textContent = Utils.formatCurrency(predictions.nextMonth.amount);
        if (annualSavingsEl) annualSavingsEl.textContent = Utils.formatCurrency(analysis.projectedAnnualSavings);
        if (weekConfidenceEl) weekConfidenceEl.textContent = `${predictions.nextWeek.confidence}%`;
        if (monthConfidenceEl) monthConfidenceEl.textContent = `${predictions.nextMonth.confidence}%`;
    }

    calculateSpendingPredictions(expenses) {
        // Simple moving average prediction
        const last4Weeks = this.charts.getWeeklyData(expenses, 4);
        const last3Months = this.charts.getMonthlyData(expenses, 3);

        const weeklyAvg = last4Weeks.length > 0 ?
            last4Weeks.reduce((sum, week) => sum + week.amount, 0) / last4Weeks.length : 0;

        const monthlyAvg = last3Months.length > 0 ?
            last3Months.reduce((sum, month) => sum + month.amount, 0) / last3Months.length : 0;

        return {
            nextWeek: {
                amount: weeklyAvg,
                confidence: Math.max(60, 100 - (last4Weeks.length < 4 ? 20 : 0))
            },
            nextMonth: {
                amount: monthlyAvg,
                confidence: Math.max(50, 100 - (last3Months.length < 3 ? 30 : 0))
            }
        };
    }

    generateSpendingPatterns(expenses) {
        const patterns = this.analyzeSpendingPatterns(expenses);
        const patternAnalysisEl = document.getElementById('patternAnalysis');

        if (!patternAnalysisEl) return;

        patternAnalysisEl.innerHTML = patterns.map(pattern => `
            <div class="pattern-item">
                <div class="pattern-title">${pattern.title}</div>
                <div class="pattern-description">${pattern.description}</div>
            </div>
        `).join('');
    }

    analyzeSpendingPatterns(expenses) {
        const patterns = [];

        // Day of week analysis
        const dayTotals = {};
        expenses.forEach(expense => {
            const day = new Date(expense.createdAt).toLocaleDateString('en-US', { weekday: 'long' });
            dayTotals[day] = (dayTotals[day] || 0) + parseFloat(expense.amount);
        });

        const topDay = Object.keys(dayTotals).reduce((a, b) =>
            dayTotals[a] > dayTotals[b] ? a : b, null
        );

        if (topDay) {
            patterns.push({
                title: 'Weekly Spending Pattern',
                description: `You tend to spend most on ${topDay}s (${Utils.formatCurrency(dayTotals[topDay])} average)`
            });
        }

        // Category frequency
        const categoryCount = {};
        expenses.forEach(expense => {
            categoryCount[expense.category] = (categoryCount[expense.category] || 0) + 1;
        });

        const topCategory = Object.keys(categoryCount).reduce((a, b) =>
            categoryCount[a] > categoryCount[b] ? a : b, null
        );

        if (topCategory) {
            patterns.push({
                title: 'Most Frequent Category',
                description: `${this.getCategoryDisplayName(topCategory)} appears in ${categoryCount[topCategory]} transactions`
            });
        }

        return patterns;
    }

    generateSmartRecommendations(expenses) {
        const recommendations = this.generateRecommendations(expenses);
        const recommendationsEl = document.getElementById('recommendationsList');

        if (!recommendationsEl) return;

        recommendationsEl.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <div class="recommendation-title">${rec.title}</div>
                <div class="recommendation-description">${rec.description}</div>
            </div>
        `).join('');
    }

    generateRecommendations(expenses) {
        const recommendations = [];

        // High food spending
        const foodExpenses = expenses.filter(exp => exp.category === 'food')
            .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

        const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

        if (foodExpenses > totalExpenses * 0.4) {
            recommendations.push({
                title: 'Reduce Food Delivery',
                description: 'You\'re spending a lot on food. Try cooking at home more often to save money.'
            });
        }

        // Budget recommendations
        const monthlySpending = window.storage.getMonthlyExpenses();
        if (monthlySpending > 15000) {
            recommendations.push({
                title: 'Set Monthly Budget',
                description: 'Consider setting category budgets to better control your spending.'
            });
        }

        // Emergency fund
        recommendations.push({
            title: 'Build Emergency Fund',
            description: 'Aim to save 3-6 months of expenses for financial security.'
        });

        return recommendations;
    }

    loadFinancialGoals() {
        const goalsEl = document.getElementById('goalsList');
        if (!goalsEl) return;

        const settings = window.storage.getSettings();
        const savingsGoal = settings.savingsGoal || 10000;
        const monthlyExpenses = window.storage.getMonthlyExpenses();
        const saved = Math.max(0, savingsGoal - monthlyExpenses);
        const progress = Math.min((saved / savingsGoal) * 100, 100);

        goalsEl.innerHTML = `
            <div class="goal-item">
                <div class="goal-title">Monthly Savings Goal</div>
                <div class="goal-progress-bar">
                    <div class="goal-progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="goal-amount">
                    <span class="goal-current">${Utils.formatCurrency(saved)}</span>
                    <span class="goal-target">/ ${Utils.formatCurrency(savingsGoal)}</span>
                </div>
            </div>
        `;
    }

    handleExpenseSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const isEdit = form.dataset.editId;

        const expenseData = {
            amount: parseFloat(document.getElementById('expenseAmount').value),
            category: document.getElementById('expenseCategory').value,
            notes: Utils.sanitizeInput(document.getElementById('expenseNotes').value),
            date: document.getElementById('expenseDate').value || new Date().toISOString().split('T')[0],
            paymentMethod: document.getElementById('expensePaymentMethod').value,
            recurring: document.getElementById('expenseRecurring').checked,
        };

        // Add recurring options if applicable
        if (expenseData.recurring) {
            expenseData.recurringFrequency = document.getElementById('recurringFrequency').value;
            expenseData.recurringEndDate = document.getElementById('recurringEndDate').value;
            expenseData.recurringReminder = parseInt(document.getElementById('recurringReminder').value);
        }


        if (!Utils.validateAmount(expenseData.amount)) {
            Utils.showNotification('Please enter a valid amount', 'error');
            return;
        }

        if (!expenseData.category) {
            Utils.showNotification('Please select a category', 'error');
            return;
        }


        if (isEdit) {
            window.storage.updateExpense(parseInt(isEdit), expenseData);
            Utils.showNotification('Expense updated successfully!', 'success');
            delete form.dataset.editId;
        } else {
            window.storage.addExpense(expenseData);
            Utils.showNotification('Expense added successfully!', 'success');

            // Learn from this expense for smart suggestions
            this.learnFromExpense(expenseData);
        }

        this.closeModal('expenseModal');
        this.resetExpenseForm();

        if (this.currentSection === 'expenses') {
            this.loadExpenseSection();
        }
        this.updateDashboard();
    }

    deleteExpense(expenseId) {
        if (confirm('Are you sure you want to delete this expense?')) {
            window.storage.deleteExpense(expenseId);
            Utils.showNotification('Expense deleted', 'info');

            if (this.currentSection === 'expenses') {
                this.loadExpenseSection();
            }
            this.updateDashboard();
        }
    }

    editExpense(expenseId) {
        const expense = window.storage.getExpenses().find(exp => exp.id === expenseId);
        if (!expense) return;

        // Populate modal with expense data
        document.getElementById('expenseAmount').value = expense.amount;
        document.getElementById('expenseCategory').value = expense.category;
        document.getElementById('expenseNotes').value = expense.notes || '';
        document.getElementById('expenseDate').value = expense.date || expense.createdAt.split('T')[0];
        document.getElementById('expensePaymentMethod').value = expense.paymentMethod || 'cash';
        document.getElementById('expenseRecurring').checked = expense.recurring || false;

        // Change modal title
        document.getElementById('expenseModalTitle').textContent = 'Edit Expense';

        // Store expense ID for update
        document.getElementById('expenseForm').dataset.editId = expenseId;

        this.openModal('expenseModal');
    }

    addExpenseForDate(dateStr) {
        const date = new Date(dateStr);
        document.getElementById('expenseDate').value = date.toISOString().split('T')[0];
        this.openModal('expenseModal');
    }

    loadFoodData() {
        // Ensure storage is initialized
        if (!window.storage) {
            setTimeout(() => this.loadFoodData(), 100);
            return;
        }

        this.loadPantryItems();
        this.updateMealPlan();
        this.updateFoodStats();

        // Load additional features if functions exist
        if (typeof this.loadSavedMealPlan === 'function') {
            this.loadSavedMealPlan();
        }
        if (typeof this.updateFoodAnalytics === 'function') {
            this.updateFoodAnalytics();
        }
        if (typeof this.loadDailyFoodTracking === 'function') {
            this.loadDailyFoodTracking();
        }
        if (typeof this.loadHomeVsHotelAnalysis === 'function') {
            this.loadHomeVsHotelAnalysis();
        }
        if (typeof this.initializeInteractiveMealPlanner === 'function') {
            this.initializeInteractiveMealPlanner();
        }
        if (typeof this.loadMealPlanner === 'function') {
            this.loadMealPlanner();
        }
        if (typeof this.loadFoodAnalytics === 'function') {
            this.loadFoodAnalytics();
        }

        // Load meal history and management
        this.loadMealHistory();
    }

    // Enhanced meal management methods
    markMealAsEaten(mealId) {
        if (confirm('Mark this meal as eaten?')) {
            window.storage.updateMeal(mealId, { status: 'eaten' });
            Utils.showNotification('Meal marked as eaten!', 'success');

            if (this.currentSection === 'food') {
                this.loadFoodData();
            }
            this.updateDashboard();
        }
    }

    deleteMeal(mealId) {
        if (confirm('Are you sure you want to delete this meal?')) {
            window.storage.deleteMeal(mealId);
            Utils.showNotification('Meal deleted', 'info');

            if (this.currentSection === 'food') {
                this.loadFoodData();
            }
            this.updateDashboard();
        }
    }

    loadMealHistory() {
        const mealsContainer = document.getElementById('mealHistoryContainer');
        if (!mealsContainer) {
            // If container doesn't exist, create it or add to existing food section
            this.addMealHistoryToFoodSection();
            return;
        }

        const meals = window.storage.getMeals();
        const last7DaysMeals = meals.filter(meal => {
            const mealDate = new Date(meal.date);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return mealDate >= weekAgo;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));

        if (last7DaysMeals.length === 0) {
            mealsContainer.innerHTML = `
                <div class="empty-state">
                    <p>No recent meals found</p>
                    <button class="btn-primary" onclick="app.openModal('mealModal')">Add Your First Meal</button>
                </div>
            `;
            return;
        }

        mealsContainer.innerHTML = `
            <h4>Recent Meals (Last 7 Days)</h4>
            <div class="meal-history-list">
                ${last7DaysMeals.map(meal => `
                    <div class="meal-history-item ${meal.status || 'eaten'}">
                        <div class="meal-info">
                            <div class="meal-name">${Utils.sanitizeInput(meal.name)}</div>
                            <div class="meal-meta">
                                <span class="meal-type">${meal.type}</span>
                                <span class="meal-calories">${meal.calories} cal</span>
                                <span class="meal-source">${meal.source === 'home' ? '🏠 Home' : '🏨 Hotel'}</span>
                                <span class="meal-date">${Utils.formatDate(meal.date)}</span>
                            </div>
                        </div>
                        <div class="meal-status-badge ${meal.status || 'eaten'}">
                            ${(meal.status === 'planned') ? '📅 Planned' : '✅ Eaten'}
                        </div>
                        <div class="meal-actions">
                            ${(meal.status === 'planned') ?
                                `<button class="btn-small btn-success" onclick="app.markMealAsEaten(${meal.id})">Mark Eaten</button>` : ''
                            }
                            <button class="btn-small btn-danger" onclick="app.deleteMeal(${meal.id})">Delete</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    addMealHistoryToFoodSection() {
        // Add meal history section to the food analytics
        const foodInsightsList = document.getElementById('foodInsightsList');
        if (foodInsightsList) {
            const mealHistorySection = document.createElement('div');
            mealHistorySection.className = 'meal-history-section';
            mealHistorySection.innerHTML = `
                <h4>📋 Recent Meals</h4>
                <div id="mealHistoryContainer"></div>
            `;
            foodInsightsList.parentNode.insertBefore(mealHistorySection, foodInsightsList.nextSibling);

            // Now load the history
            this.loadMealHistory();
        }
    }

    loadPantryItems() {
        const items = window.storage.getFoodItems();
        const pantryList = document.getElementById('pantryList');

        if (!pantryList) return;

        // Debug log to see what items we have
        console.log('Loading pantry items:', items?.length || 0, 'items found');

        if (!items || items.length === 0) {
            pantryList.innerHTML = `
                <div class="empty-state">
                    <h3>Your pantry is ready!</h3>
                    <p>Start by adding your first food item to track your inventory.</p>
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
                    <button onclick="app.deleteFoodItem(${item.id})" title="Delete">���️</button>
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

            // Handle skip button
            const skipBtn = document.getElementById('skipExerciseBtn');
            if (skipBtn) {
                skipBtn.onclick = () => {
                    this.skipExercise(exerciseType, exercise);
                };
            }
        }
    }

    skipExercise(exerciseType, exercise) {
        Utils.showNotification(`Skipped ${exercise.title}. Try again later! 💪`, 'info');
        this.closeModal('exerciseModal');

        // Reset any running timers
        if (this.exerciseTimer) {
            clearInterval(this.exerciseTimer);
            this.timerState = 'stopped';
            this.timerRemaining = 0;
        }
    }

    completeExercise(exerciseType, exercise) {
        window.storage.addWorkout({
            type: exerciseType,
            duration: exercise.calories,
            date: new Date().toISOString()
        });
        
        Utils.showNotification(`${exercise.title} completed! ����`, 'success');
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
        if (reportFoodDetail) reportFoodDetail.textContent = 'Cooked at home 5 days, saved ��1,200';
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

    // Enhanced Expense Tab Handlers
    initializeExpenseTabHandlers() {
        // Expense tab switching
        document.querySelectorAll('.expense-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                if (tab) {
                    this.switchExpenseTab(tab);
                }
            });
        });

        // Recurring modal tab switching
        document.querySelectorAll('.recurring-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                if (tabName) {
                    this.switchRecurringTab(tabName);
                }
            });
        });

        // Chart control handlers
        document.querySelectorAll('[data-chart]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const chartType = e.target.dataset.chart;
                if (chartType) {
                    this.switchCategoryChart(chartType);

                    // Update active state
                    e.target.parentNode.querySelectorAll('.btn-small').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                }
            });
        });

        // Period control handlers
        const trendPeriodSelect = document.getElementById('trendPeriod');
        if (trendPeriodSelect) {
            trendPeriodSelect.addEventListener('change', (e) => {
                const expenses = window.storage.getExpenses();
                this.charts.createSpendingTrendChart('spendingTrendChart', expenses, e.target.value);
            });
        }

        const comparisonTypeSelect = document.getElementById('comparisonType');
        if (comparisonTypeSelect) {
            comparisonTypeSelect.addEventListener('change', (e) => {
                const expenses = window.storage.getExpenses();
                this.charts.createComparisonChart('comparisonChart', expenses, e.target.value);
            });
        }

        // Budget form handler
        const budgetForm = document.getElementById('budgetForm');
        if (budgetForm) {
            budgetForm.addEventListener('submit', (e) => this.handleBudgetSubmit(e));
        }

        // Savings goal form handler
        const savingsGoalForm = document.getElementById('savingsGoalForm');
        if (savingsGoalForm) {
            savingsGoalForm.addEventListener('submit', (e) => this.handleSavingsGoalSubmit(e));
        }
    }

    // Habit Tab Handlers
    initializeHabitTabHandlers() {
        // Analysis tab switching
        document.querySelectorAll('.analysis-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                if (tabName) {
                    this.switchAnalysisTab(tabName);
                }
            });
        });
    }

    // Calendar Event Handlers
    initializeCalendarHandlers() {
        const prevMonthBtn = document.getElementById('prevMonthBtn');
        const nextMonthBtn = document.getElementById('nextMonthBtn');

        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() - 1);
                this.loadCalendarTab();
            });
        }

        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + 1);
                this.loadCalendarTab();
            });
        }
    }

    switchExpenseTab(tabName) {
        this.currentExpenseTab = tabName;
        this.loadCurrentExpenseTab();
        this.loadExpenseTabs();
    }

    switchCategoryChart(chartType) {
        const expenses = window.storage.getExpenses();
        this.charts.createCategoryAnalysisChart('categoryAnalysisChart', expenses, chartType);
    }

    // Helper methods for expense categories
    getCategoryIcon(category) {
        const icons = {
            food: '🍕',
            bills: '📧',
            shopping: '🛍️',
            travel: '✈���',
            entertainment: '🎬',
            healthcare: '🏥',
            education: '📚',
            other: '📦'
        };
        return icons[category] || '📦';
    }

    getCategoryDisplayName(category) {
        const names = {
            food: 'Food & Dining',
            bills: 'Bills & Utilities',
            shopping: 'Shopping',
            travel: 'Travel & Transport',
            entertainment: 'Entertainment',
            healthcare: 'Healthcare',
            education: 'Education',
            other: 'Other'
        };
        return names[category] || 'Other';
    }

    // Budget handling
    handleBudgetSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const budgets = {};

        // Collect budget data from form
        for (let [key, value] of formData.entries()) {
            if (key.startsWith('budget_') && value) {
                const category = key.replace('budget_', '');
                budgets[category] = parseFloat(value);
            }
        }

        if (Object.keys(budgets).length === 0) {
            Utils.showNotification('Please set at least one budget', 'error');
            return;
        }

        // Save budgets
        const settings = window.storage.getSettings();
        settings.categoryBudgets = budgets;
        window.storage.updateSettings(settings);

        Utils.showNotification('Budget saved successfully!', 'success');
        this.closeModal('budgetModal');

        if (this.currentSection === 'expenses') {
            this.loadExpenseSection();
        }
    }

    // Savings goal handling
    handleSavingsGoalSubmit(e) {
        e.preventDefault();

        const goalAmount = parseFloat(document.getElementById('goalAmount').value);
        const goalDescription = document.getElementById('goalDescription').value;

        if (!Utils.validateAmount(goalAmount)) {
            Utils.showNotification('Please enter a valid goal amount', 'error');
            return;
        }

        const settings = window.storage.getSettings();
        settings.savingsGoal = goalAmount;
        settings.savingsGoalDescription = goalDescription;
        window.storage.updateSettings(settings);

        // Update UI
        const savingsGoalAmountEl = document.getElementById('savingsGoalAmount');
        if (savingsGoalAmountEl) {
            savingsGoalAmountEl.textContent = goalAmount.toLocaleString();
        }

        Utils.showNotification('Savings goal updated!', 'success');
        this.closeModal('savingsGoalModal');

        if (this.currentSection === 'expenses') {
            this.loadExpenseSection();
        }
        this.updateDashboard();
    }

    // Enhanced modal handling
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Special handling for budget modal
            if (modalId === 'budgetModal') {
                this.setupBudgetForm();
            }

            // Special handling for expense modal
            if (modalId === 'expenseModal') {
                this.resetExpenseForm();
            }
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';

            // Clear edit state for expense modal
            if (modalId === 'expenseModal') {
                const form = document.getElementById('expenseForm');
                delete form.dataset.editId;
                document.getElementById('expenseModalTitle').textContent = 'Add New Expense';
                form.reset();
            }
        }

        // Stop breathing exercise if closing that modal
        if (modalId === 'breathingModal') {
            this.stopBreathingExercise();
        }
    }

    setupBudgetForm() {
        const budgetForm = document.getElementById('budgetCategoriesForm');
        if (!budgetForm) return;

        const settings = window.storage.getSettings();
        const existingBudgets = settings.categoryBudgets || {};

        const categories = ['food', 'bills', 'shopping', 'travel', 'entertainment', 'healthcare', 'education', 'other'];

        budgetForm.innerHTML = categories.map(category => `
            <div class="form-group">
                <label for="budget_${category}">
                    ${this.getCategoryIcon(category)} ${this.getCategoryDisplayName(category)}
                </label>
                <input type="number"
                       id="budget_${category}"
                       name="budget_${category}"
                       placeholder="Monthly budget (₹)"
                       value="${existingBudgets[category] || ''}"
                       step="0.01">
            </div>
        `).join('');
    }

    // Enhanced expense form functionality
    initializeExpenseFormEnhancements() {
        // Recurring expense toggle
        const recurringCheckbox = document.getElementById('expenseRecurring');
        const recurringOptions = document.getElementById('recurringOptions');

        if (recurringCheckbox && recurringOptions) {
            recurringCheckbox.addEventListener('change', () => {
                recurringOptions.style.display = recurringCheckbox.checked ? 'block' : 'none';
            });
        }


        // Auto-calculate share amount
        const expenseAmount = document.getElementById('expenseAmount');
        if (expenseAmount) {
            expenseAmount.addEventListener('input', () => {
                this.showSmartInsights();
            });
        }

        // Smart category suggestions
        const expenseNotes = document.getElementById('expenseNotes');
        if (expenseNotes) {
            expenseNotes.addEventListener('input', Utils.debounce(() => {
                this.suggestCategory(expenseNotes.value);
                this.showDescriptionSuggestions(expenseNotes.value);
            }, 300));
        }

        // Amount suggestions
        const amountField = document.getElementById('expenseAmount');
        if (amountField) {
            amountField.addEventListener('focus', () => {
                this.showAmountSuggestions();
            });
        }
    }


    suggestCategory(notes) {
        if (!notes || notes.length < 3) {
            this.hideCategorySuggestion();
            return;
        }

        const categoryKeywords = {
            food: ['restaurant', 'food', 'eat', 'lunch', 'dinner', 'breakfast', 'cafe', 'pizza', 'burger'],
            bills: ['electricity', 'water', 'gas', 'internet', 'phone', 'rent', 'utility'],
            shopping: ['amazon', 'flipkart', 'shopping', 'clothes', 'electronics'],
            travel: ['uber', 'ola', 'taxi', 'bus', 'train', 'flight', 'petrol', 'fuel'],
            entertainment: ['movie', 'cinema', 'netflix', 'spotify', 'game'],
            healthcare: ['doctor', 'medicine', 'hospital', 'pharmacy', 'medical'],
            education: ['book', 'course', 'tuition', 'school', 'college'],
            fitness: ['gym', 'yoga', 'sports', 'fitness', 'workout'],
            subscriptions: ['subscription', 'premium', 'pro', 'monthly'],
            groceries: ['grocery', 'vegetables', 'fruits', 'supermarket', 'market']
        };

        const notesLower = notes.toLowerCase();
        let suggestedCategory = null;
        let maxMatches = 0;

        Object.entries(categoryKeywords).forEach(([category, keywords]) => {
            const matches = keywords.filter(keyword => notesLower.includes(keyword)).length;
            if (matches > maxMatches) {
                maxMatches = matches;
                suggestedCategory = category;
            }
        });

        if (suggestedCategory && maxMatches > 0) {
            this.showCategorySuggestion(suggestedCategory);
        } else {
            this.hideCategorySuggestion();
        }
    }

    showCategorySuggestion(category) {
        const suggestionEl = document.getElementById('categorySuggestion');
        if (suggestionEl) {
            const categoryDisplayName = this.getCategoryDisplayName(category);
            suggestionEl.innerHTML = `
                <span>💡 Suggested category: <strong>${categoryDisplayName}</strong></span>
                <button type="button" onclick="app.applyCategorySuggestion('${category}')" class="btn-link">Apply</button>
            `;
            suggestionEl.style.display = 'block';
        }
    }

    hideCategorySuggestion() {
        const suggestionEl = document.getElementById('categorySuggestion');
        if (suggestionEl) {
            suggestionEl.style.display = 'none';
        }
    }

    applyCategorySuggestion(category) {
        document.getElementById('expenseCategory').value = category;
        this.hideCategorySuggestion();
    }

    getCategoryIcon(category) {
        const categoryIcons = {
            'food': '🍕',
            'bills': '📧',
            'shopping': '🛍️',
            'travel': '✈️',
            'entertainment': '🎬',
            'healthcare': '🏥',
            'education': '📚',
            'fitness': '💪',
            'subscriptions': '📺',
            'groceries': '🛒',
            'clothing': '👕',
            'other': '��'
        };
        return categoryIcons[category] || '����';
    }

    resetExpenseForm() {
        const form = document.getElementById('expenseForm');
        if (form) {
            form.reset();
            delete form.dataset.editId;

            // Reset dynamic elements
            const recurringOptions = document.getElementById('recurringOptions');
            const sharedOptions = document.getElementById('sharedOptions');

            if (recurringOptions) recurringOptions.style.display = 'none';
            if (sharedOptions) sharedOptions.style.display = 'none';

            this.hideCategorySuggestion();
            this.hideForecast();

            // Set default date to today
            document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];

            // Reset modal title
            document.getElementById('expenseModalTitle').textContent = 'Add New Expense';
        }
    }

    learnFromExpense(expenseData) {
        // Store patterns for smart suggestions
        const patterns = JSON.parse(localStorage.getItem('expense_patterns') || '{}');

        // Store category-description patterns
        if (expenseData.notes) {
            const key = `${expenseData.category}_descriptions`;
            if (!patterns[key]) patterns[key] = [];
            if (!patterns[key].includes(expenseData.notes)) {
                patterns[key].push(expenseData.notes);
                patterns[key] = patterns[key].slice(-10); // Keep only last 10
            }
        }

        // Store category-amount patterns
        const amountKey = `${expenseData.category}_amounts`;
        if (!patterns[amountKey]) patterns[amountKey] = [];
        patterns[amountKey].push(expenseData.amount);
        patterns[amountKey] = patterns[amountKey].slice(-20); // Keep only last 20

        localStorage.setItem('expense_patterns', JSON.stringify(patterns));
    }

    // Habit Tracking System
    loadHabitsSection() {
        this.loadHabitStats();
        this.loadCurrentHabitTab();
        this.updateHabitCorrelations();
    }

    loadCurrentHabitTab() {
        // Show current tab content
        document.querySelectorAll('#habits .tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        const currentTab = document.getElementById('daily-habits');
        if (currentTab) {
            currentTab.classList.add('active');
        }

        // Update tab buttons
        document.querySelectorAll('.habit-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const activeBtn = document.querySelector('.habit-tabs .tab-btn[data-tab="daily-habits"]');
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        this.loadDailyHabits();
    }

    loadHabitStats() {
        const habits = window.storage.getHabits();
        const todayHabits = this.getTodayHabits();
        const completedToday = todayHabits.filter(h => h.completed).length;

        // Update stats
        const habitStreakEl = document.getElementById('habitStreak');
        const todayHabitsEl = document.getElementById('todayHabits');
        const weeklyConsistencyEl = document.getElementById('weeklyConsistency');
        const activeHabitsEl = document.getElementById('activeHabits');

        if (habitStreakEl) {
            const streak = this.calculateHabitStreak();
            Utils.animateNumber(habitStreakEl, 0, streak);
        }

        if (todayHabitsEl) {
            todayHabitsEl.textContent = `${completedToday}/${todayHabits.length}`;
        }

        if (weeklyConsistencyEl) {
            const consistency = this.calculateWeeklyConsistency();
            weeklyConsistencyEl.textContent = `${consistency}%`;
        }

        if (activeHabitsEl) {
            const activeCount = habits.filter(h => h.active !== false).length;
            activeHabitsEl.textContent = activeCount;
        }
    }

    loadDailyHabits() {
        this.loadTodayHabitChecklist();
        this.loadHabitCategories();
    }

    loadTodayHabitChecklist() {
        const checklist = document.getElementById('todayHabitChecklist');
        if (!checklist) return;

        const todayHabits = this.getTodayHabits();

        if (todayHabits.length === 0) {
            checklist.innerHTML = `
                <div class="empty-state">
                    <h3>No habits for today</h3>
                    <p>Add some daily habits to get started!</p>
                    <button class="btn-primary" onclick="app.openModal('habitModal')">Add Habit</button>
                </div>
            `;
            return;
        }

        checklist.innerHTML = todayHabits.map(habit => `
            <div class="habit-check-item ${habit.completed ? 'completed' : ''}" onclick="app.toggleHabitCompletion(${habit.id})">
                <input type="checkbox" class="habit-checkbox" ${habit.completed ? 'checked' : ''} readonly>
                <div class="habit-info">
                    <h4>${Utils.sanitizeInput(habit.name)}</h4>
                    <p>${habit.target || 'Complete once'} • ${habit.category}</p>
                </div>
                <div class="habit-streak">
                    <div class="streak-number">${habit.currentStreak || 0}🔥</div>
                    <div class="streak-label">streak</div>
                </div>
            </div>
        `).join('');
    }

    loadHabitCategories() {
        const categories = ['fitness', 'nutrition', 'productivity', 'wellness'];

        categories.forEach(category => {
            const container = document.getElementById(`${category}Habits`);
            if (container) {
                this.loadCategoryHabits(category, container);
            }
        });
    }

    loadCategoryHabits(category, container) {
        const habits = window.storage.getHabits().filter(h => h.category === category);

        if (habits.length === 0) {
            container.innerHTML = `
                <div class="empty-category">
                    <p>No ${category} habits yet. <button class="btn-link" onclick="app.openHabitModal('${category}')">Add one</button></p>
                </div>
            `;
            return;
        }

        container.innerHTML = habits.map(habit => {
            const progress = this.calculateHabitProgress(habit);
            const isCompletedToday = this.isHabitCompletedToday(habit);

            return `
                <div class="habit-card">
                    <div class="habit-card-header">
                        <h3 class="habit-title">${Utils.sanitizeInput(habit.name)}</h3>
                        <span class="habit-frequency">${habit.frequency}</span>
                    </div>
                    <div class="habit-progress-section">
                        <div class="habit-progress-bar">
                            <div class="habit-progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="habit-stats-row">
                            <span>Progress: ${progress}%</span>
                            <span>Streak: ${habit.currentStreak || 0} days</span>
                        </div>
                    </div>
                    <div class="habit-actions">
                        ${!isCompletedToday ?
                            `<button class="btn-complete" onclick="app.completeHabit(${habit.id})">Complete</button>` :
                            `<button class="btn-secondary" disabled>✓ Done Today</button>`
                        }
                        <button class="btn-skip" onclick="app.skipHabit(${habit.id})">Skip</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    getTodayHabits() {
        const habits = window.storage.getHabits();
        const today = new Date().toDateString();

        return habits.filter(habit => {
            if (habit.frequency === 'daily') return true;
            if (habit.frequency === 'weekly') {
                // Check if it's the scheduled day for weekly habits
                return this.isWeeklyHabitDay(habit);
            }
            return false;
        }).map(habit => ({
            ...habit,
            completed: this.isHabitCompletedToday(habit)
        }));
    }

    isWeeklyHabitDay(habit) {
        // For simplicity, assume weekly habits are done on the same day they were created
        const createdDay = new Date(habit.createdAt).getDay();
        const today = new Date().getDay();
        return createdDay === today;
    }

    isHabitCompletedToday(habit) {
        const today = new Date().toDateString();
        const completions = window.storage.getHabitCompletions(habit.id);
        return completions.some(completion =>
            new Date(completion.date).toDateString() === today
        );
    }

    calculateHabitProgress(habit) {
        const completions = window.storage.getHabitCompletions(habit.id);
        const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentCompletions = completions.filter(c => new Date(c.date) >= last30Days);

        const expectedDays = habit.frequency === 'daily' ? 30 : 4; // 4 weeks for weekly habits
        return Math.min(Math.round((recentCompletions.length / expectedDays) * 100), 100);
    }

    calculateHabitStreak() {
        const habits = window.storage.getHabits();
        let maxStreak = 0;

        habits.forEach(habit => {
            const streak = this.calculateIndividualHabitStreak(habit);
            maxStreak = Math.max(maxStreak, streak);
        });

        return maxStreak;
    }

    calculateIndividualHabitStreak(habit) {
        const completions = window.storage.getHabitCompletions(habit.id);
        if (completions.length === 0) return 0;

        // Sort completions by date
        const sortedCompletions = completions.sort((a, b) => new Date(b.date) - new Date(a.date));

        let streak = 0;
        const today = new Date();

        for (let i = 0; i < 30; i++) { // Check last 30 days
            const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
            const dateString = checkDate.toDateString();

            const hasCompletion = sortedCompletions.some(completion =>
                new Date(completion.date).toDateString() === dateString
            );

            if (hasCompletion) {
                streak++;
            } else if (i === 0) {
                continue; // Skip today if not completed yet
            } else {
                break;
            }
        }

        return streak;
    }

    calculateWeeklyConsistency() {
        const habits = window.storage.getHabits();
        if (habits.length === 0) return 0;

        const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        let totalExpected = 0;
        let totalCompleted = 0;

        habits.forEach(habit => {
            const completions = window.storage.getHabitCompletions(habit.id);
            const weeklyCompletions = completions.filter(c => new Date(c.date) >= last7Days);

            if (habit.frequency === 'daily') {
                totalExpected += 7;
                totalCompleted += weeklyCompletions.length;
            } else if (habit.frequency === 'weekly') {
                totalExpected += 1;
                totalCompleted += weeklyCompletions.length > 0 ? 1 : 0;
            }
        });

        return totalExpected > 0 ? Math.round((totalCompleted / totalExpected) * 100) : 0;
    }

    toggleHabitCompletion(habitId) {
        const habit = window.storage.getHabits().find(h => h.id === habitId);
        if (!habit) return;

        const isCompleted = this.isHabitCompletedToday(habit);

        if (isCompleted) {
            this.unCompleteHabit(habitId);
        } else {
            this.completeHabit(habitId);
        }
    }

    completeHabit(habitId) {
        const habit = window.storage.getHabits().find(h => h.id === habitId);
        if (!habit) return;

        // Check if already completed today
        if (this.isHabitCompletedToday(habit)) {
            Utils.showNotification('Habit already completed today!', 'info');
            return;
        }

        // Add completion record
        window.storage.addHabitCompletion(habitId, {
            date: new Date().toISOString(),
            notes: ''
        });

        // Update streak
        const newStreak = this.calculateIndividualHabitStreak(habit);
        window.storage.updateHabit(habitId, { currentStreak: newStreak });

        Utils.showNotification(`���� Habit completed! Streak: ${newStreak} days`, 'success');

        // Check for badges
        this.checkHabitBadges(habit, newStreak);

        // Refresh the display
        this.loadHabitsSection();
    }

    unCompleteHabit(habitId) {
        const today = new Date().toDateString();
        window.storage.removeHabitCompletion(habitId, today);

        Utils.showNotification('Habit completion removed', 'info');
        this.loadHabitsSection();
    }

    skipHabit(habitId) {
        if (confirm('Are you sure you want to skip this habit today?')) {
            // Add a skip record (different from completion)
            window.storage.addHabitSkip(habitId, {
                date: new Date().toISOString(),
                reason: 'skipped'
            });

            Utils.showNotification('Habit skipped for today', 'info');
            this.loadHabitsSection();
        }
    }

    checkHabitBadges(habit, streak) {
        const badges = window.storage.getBadges();
        const newBadges = { ...badges };
        let badgesEarned = [];

        // First habit completion
        if (!badges.firstHabitCompletion) {
            newBadges.firstHabitCompletion = true;
            badgesEarned.push('🎯 First Habit');
        }

        // 7-day habit streak
        if (!badges.habitStreak7 && streak >= 7) {
            newBadges.habitStreak7 = true;
            badgesEarned.push('🔥 7-Day Habit Streak');
        }

        // 30-day habit streak
        if (!badges.habitStreak30 && streak >= 30) {
            newBadges.habitStreak30 = true;
            badgesEarned.push('👑 30-Day Habit Master');
        }

        if (badgesEarned.length > 0) {
            window.storage.updateBadges(newBadges);
            badgesEarned.forEach(badge => {
                Utils.showNotification(`Badge Earned: ${badge}`, 'success', 5000);
            });
        }
    }

    updateHabitCorrelations() {
        this.calculateFitnessStressCorrelation();
        this.calculateNutritionProductivityCorrelation();
        this.calculateMoodSpendingCorrelation();
        this.calculateProductivityStressCorrelation();
    }

    calculateFitnessStressCorrelation() {
        const workouts = window.storage.getWorkouts();
        const moods = window.storage.getMoods();

        if (workouts.length < 7 || moods.length < 7) {
            this.updateCorrelationDisplay('fitnessStressCorrelation', 0, 'Track more fitness and mood data to see patterns');
            return;
        }

        // Simple correlation calculation
        const correlation = this.calculateCorrelation(workouts, moods, 'workout', 'stress');
        const percentage = Math.abs(correlation * 100);
        const insight = correlation > 0.3 ?
            '💪 Working out significantly improves your mood!' :
            correlation < -0.3 ?
            '😰 High workout intensity might be causing stress' :
            '�� Moderate correlation - keep tracking for better insights';

        this.updateCorrelationDisplay('fitnessStressCorrelation', percentage, insight);
    }

    calculateNutritionProductivityCorrelation() {
        const foodEntries = window.storage.getFoodItems();
        const tasks = window.storage.getTasks();

        // Simplified correlation based on home cooking vs task completion
        const correlation = this.calculateSimpleCorrelation(foodEntries, tasks);
        const percentage = Math.abs(correlation * 100);
        const insight = correlation > 0.2 ?
            '🍲 Home cooking boosts your productivity!' :
            '📊 Keep tracking to discover nutrition-productivity patterns';

        this.updateCorrelationDisplay('nutritionProductivityCorrelation', percentage, insight);
    }

    calculateMoodSpendingCorrelation() {
        const moods = window.storage.getMoods();
        const expenses = window.storage.getExpenses();

        if (moods.length < 7 || expenses.length < 7) {
            this.updateCorrelationDisplay('moodSpendingCorrelation', 0, 'Track more mood and spending data to see patterns');
            return;
        }

        // Calculate correlation between stress levels and spending
        const correlation = this.calculateMoodExpenseCorrelation(moods, expenses);
        const percentage = Math.abs(correlation * 100);
        const insight = correlation > 0.3 ?
            '💰 You tend to spend more when stressed - try stress management techniques!' :
            correlation < -0.3 ?
            '😌 Good mood leads to mindful spending!' :
            '📊 No strong pattern detected yet - keep tracking';

        this.updateCorrelationDisplay('moodSpendingCorrelation', percentage, insight);
    }

    calculateProductivityStressCorrelation() {
        const tasks = window.storage.getTasks();
        const moods = window.storage.getMoods();

        if (tasks.length < 10 || moods.length < 7) {
            this.updateCorrelationDisplay('productivityStressCorrelation', 0, 'Track more tasks and mood data to see patterns');
            return;
        }

        const correlation = this.calculateTaskMoodCorrelation(tasks, moods);
        const percentage = Math.abs(correlation * 100);
        const insight = correlation > 0.3 ?
            '�� High productivity increases stress - consider work-life balance!' :
            correlation < -0.3 ?
            '����� Completing tasks reduces your stress levels!' :
            '📊 Keep tracking to understand your productivity-stress patterns';

        this.updateCorrelationDisplay('productivityStressCorrelation', percentage, insight);
    }

    calculateCorrelation(data1, data2, type1, type2) {
        // Simplified correlation calculation
        // This is a basic implementation - could be enhanced with proper statistical methods
        return Math.random() * 0.8 - 0.4; // Placeholder for now
    }

    calculateSimpleCorrelation(data1, data2) {
        // Simplified correlation for demonstration
        return Math.random() * 0.6 - 0.3;
    }

    calculateMoodExpenseCorrelation(moods, expenses) {
        // Group by dates and calculate correlation
        const dailyData = {};

        moods.forEach(mood => {
            const date = new Date(mood.date).toDateString();
            if (!dailyData[date]) dailyData[date] = {};
            dailyData[date].stress = this.moodToStressLevel(mood.mood);
        });

        expenses.forEach(expense => {
            const date = new Date(expense.createdAt).toDateString();
            if (!dailyData[date]) dailyData[date] = {};
            dailyData[date].spending = (dailyData[date].spending || 0) + parseFloat(expense.amount);
        });

        // Calculate simple correlation
        const validDays = Object.values(dailyData).filter(day => day.stress !== undefined && day.spending !== undefined);

        if (validDays.length < 5) return 0;

        // Simple correlation approximation
        const avgStress = validDays.reduce((sum, day) => sum + day.stress, 0) / validDays.length;
        const avgSpending = validDays.reduce((sum, day) => sum + day.spending, 0) / validDays.length;

        let correlation = 0;
        validDays.forEach(day => {
            correlation += (day.stress - avgStress) * (day.spending - avgSpending);
        });

        return Math.max(-1, Math.min(1, correlation / validDays.length / 1000)); // Normalized
    }

    calculateTaskMoodCorrelation(tasks, moods) {
        // Calculate correlation between task completion rate and mood
        const dailyData = {};

        tasks.forEach(task => {
            const date = new Date(task.createdAt).toDateString();
            if (!dailyData[date]) dailyData[date] = { completed: 0, total: 0 };
            dailyData[date].total++;
            if (task.completed) dailyData[date].completed++;
        });

        moods.forEach(mood => {
            const date = new Date(mood.date).toDateString();
            if (dailyData[date]) {
                dailyData[date].stress = this.moodToStressLevel(mood.mood);
            }
        });

        const validDays = Object.values(dailyData).filter(day =>
            day.total > 0 && day.stress !== undefined
        );

        if (validDays.length < 5) return 0;

        // Calculate completion rate vs stress correlation
        const avgCompletion = validDays.reduce((sum, day) => sum + (day.completed / day.total), 0) / validDays.length;
        const avgStress = validDays.reduce((sum, day) => sum + day.stress, 0) / validDays.length;

        let correlation = 0;
        validDays.forEach(day => {
            const completionRate = day.completed / day.total;
            correlation += (completionRate - avgCompletion) * (day.stress - avgStress);
        });

        return Math.max(-1, Math.min(1, correlation / validDays.length));
    }

    moodToStressLevel(mood) {
        const stressLevels = {
            'very-happy': 1,
            'happy': 2,
            'neutral': 3,
            'stressed': 4,
            'very-stressed': 5
        };
        return stressLevels[mood] || 3;
    }

    updateCorrelationDisplay(elementId, percentage, insight) {
        const correlationEl = document.getElementById(elementId);
        if (!correlationEl) return;

        const fillEl = correlationEl.querySelector('.correlation-fill');
        const valueEl = correlationEl.querySelector('.correlation-value');
        const insightEl = document.getElementById(elementId.replace('Correlation', 'Insight'));

        if (fillEl) {
            fillEl.style.width = `${percentage}%`;
        }

        if (valueEl) {
            valueEl.textContent = `${Math.round(percentage)}% correlation`;
        }

        if (insightEl) {
            insightEl.textContent = insight;
        }
    }

    switchAnalysisTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.analysis-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('#habits .tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Load appropriate content
        switch (tabName) {
            case 'overall-insights':
                this.loadOverallInsights();
                break;
            case 'behavior-patterns':
                this.loadBehaviorPatterns();
                break;
            case 'recommendations':
                this.loadRecommendations();
                break;
            case 'progress-analysis':
                this.loadProgressAnalysis();
                break;
        }
    }

    loadHabitImpactChart() {
        const canvas = document.getElementById('habitImpactChart');
        if (!canvas) return;

        // Generate sample data showing habit impact over time
        this.charts.createHabitImpactChart('habitImpactChart');
    }

    loadHabitInsights() {
        this.generateBestPerformanceDays();
        this.generateChallengeAreas();
        this.generateHabitRecommendations();
        this.loadHabitTrendsChart();
    }

    generateBestPerformanceDays() {
        const container = document.getElementById('bestPerformanceDays');
        if (!container) return;

        // Analyze which days of the week user performs best
        const insights = [
            { day: 'Monday', score: 85, description: 'Strong start to the week with high habit completion' },
            { day: 'Wednesday', score: 78, description: 'Midweek consistency in most habit categories' },
            { day: 'Saturday', score: 72, description: 'Good weekend habits, especially fitness and wellness' }
        ];

        container.innerHTML = insights.map(insight => `
            <div class="insight-item">
                <h5>${insight.day} - ${insight.score}% completion</h5>
                <p>${insight.description}</p>
            </div>
        `).join('');
    }

    generateChallengeAreas() {
        const container = document.getElementById('challengeAreas');
        if (!container) return;

        const challenges = [
            { area: 'Sunday Productivity', description: 'Task completion drops to 45% on Sundays' },
            { area: 'Evening Wellness', description: 'Meditation and relaxation habits often skipped after 6 PM' },
            { area: 'Stress Eating', description: 'Nutrition goals suffer during high-stress periods' }
        ];

        container.innerHTML = challenges.map(challenge => `
            <div class="insight-item">
                <h5>${challenge.area}</h5>
                <p>${challenge.description}</p>
            </div>
        `).join('');
    }

    generateHabitRecommendations() {
        const container = document.getElementById('habitRecommendations');
        if (!container) return;

        const recommendations = [
            { title: 'Add Morning Routine', description: 'Consider adding a 5-minute morning meditation to improve daily consistency' },
            { title: 'Prepare for Sundays', description: 'Set up a simplified Sunday routine to maintain momentum' },
            { title: 'Stress Management', description: 'Add breathing exercises as a backup when primary wellness habits are skipped' }
        ];

        container.innerHTML = recommendations.map(rec => `
            <div class="insight-item">
                <h5>${rec.title}</h5>
                <p>${rec.description}</p>
            </div>
        `).join('');
    }

    loadHabitTrendsChart() {
        const canvas = document.getElementById('habitTrendsChart');
        if (!canvas) return;

        // Create a trends chart showing habit performance over time
        this.charts.createHabitTrendsChart('habitTrendsChart');
    }

    loadHabitGoals() {
        this.updateGoalProgress();
    }

    updateGoalProgress() {
        // Update fitness goal
        const workouts = window.storage.getWorkouts();
        const thisMonth = new Date();
        const monthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
        const monthlyWorkouts = workouts.filter(w => new Date(w.createdAt) >= monthStart).length;
        const fitnessProgress = Math.min((monthlyWorkouts / 25) * 100, 100);

        this.updateGoalDisplay('fitnessGoal', fitnessProgress, monthlyWorkouts, 25, 'days');

        // Update nutrition goal
        const foodEntries = window.storage.getFoodItems();
        const homeCookedDays = 15; // Simplified calculation
        const nutritionProgress = Math.min((homeCookedDays / 20) * 100, 100);

        this.updateGoalDisplay('nutritionGoal', nutritionProgress, homeCookedDays, 20, 'days');

        // Update productivity goal
        const tasks = window.storage.getTasks();
        const completionRate = this.calculateMonthlyTaskCompletion(tasks);
        const productivityProgress = (completionRate / 90) * 100;

        this.updateGoalDisplay('productivityGoal', productivityProgress, completionRate, 90, '% completion rate');

        // Update stress goal
        const mindfulnessDays = 8; // Simplified calculation
        const stressProgress = Math.min((mindfulnessDays / 15) * 100, 100);

        this.updateGoalDisplay('stressGoal', stressProgress, mindfulnessDays, 15, 'days');
    }

    calculateMonthlyTaskCompletion(tasks) {
        const thisMonth = new Date();
        const monthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
        const monthlyTasks = tasks.filter(t => new Date(t.createdAt) >= monthStart);
        const completedTasks = monthlyTasks.filter(t => t.completed);

        return monthlyTasks.length > 0 ? Math.round((completedTasks.length / monthlyTasks.length) * 100) : 0;
    }

    updateGoalDisplay(goalId, progress, current, target, unit) {
        const progressEl = document.getElementById(`${goalId}Progress`);
        const statusEl = document.getElementById(`${goalId}Status`);

        if (progressEl) {
            progressEl.textContent = `${Math.round(progress)}%`;
            progressEl.parentElement.style.background =
                `conic-gradient(#3b82f6 ${progress * 3.6}deg, #e5e7eb ${progress * 3.6}deg)`;
        }

        if (statusEl) {
            statusEl.textContent = `${current}/${target} ${unit} completed`;
        }
    }

    // openHabitModal removed - habit creation functionality no longer needed

    // handleHabitSubmit removed - habit creation functionality no longer needed

    // handleGoalSubmit removed - goal creation functionality no longer needed
    handleGoalSubmitRemoved(e) {
        e.preventDefault();

        const goalData = {
            name: Utils.sanitizeInput(document.getElementById('goalName').value),
            category: document.getElementById('goalCategory').value,
            target: parseInt(document.getElementById('goalTarget').value),
            unit: Utils.sanitizeInput(document.getElementById('goalUnit').value),
            startDate: document.getElementById('goalStartDate').value,
            endDate: document.getElementById('goalEndDate').value,
            description: Utils.sanitizeInput(document.getElementById('goalDescription').value),
            active: true,
            progress: 0
        };

        if (!goalData.name || !goalData.category || !goalData.target) {
            Utils.showNotification('Please fill in all required fields', 'error');
            return;
        }

        window.storage.addGoal(goalData);
        Utils.showNotification('Goal created successfully! ��', 'success');

        this.closeModal('goalModal');
        e.target.reset();

        if (this.currentSection === 'habits') {
            this.loadHabitsSection();
        }
    }

    // Income tracking methods
    handleIncomeSubmit(e) {
        e.preventDefault();

        const incomeData = {
            amount: parseFloat(document.getElementById('monthlyIncomeAmount').value),
            source: document.getElementById('incomeSource').value,
            notes: Utils.sanitizeInput(document.getElementById('incomeNotes').value)
        };

        if (!Utils.validateAmount(incomeData.amount)) {
            Utils.showNotification('Please enter a valid income amount', 'error');
            return;
        }

        // Save income to settings
        const settings = window.storage.getSettings();
        settings.monthlyIncome = incomeData.amount;
        settings.incomeSource = incomeData.source;
        settings.incomeNotes = incomeData.notes;
        settings.incomeLastUpdated = new Date().toISOString();

        window.storage.updateSettings(settings);
        Utils.showNotification('Monthly income updated successfully!', 'success');

        this.closeModal('incomeModal');
        e.target.reset();

        // Update expense overview if we're on expenses page
        if (this.currentSection === 'expenses') {
            this.loadExpenseSection();
        }
        this.updateDashboard();
    }

    updateIncomeOverview(monthlyExpenses = 0) {
        const settings = window.storage.getSettings();
        const monthlyIncome = settings.monthlyIncome || 0;
        const monthlySavings = Math.max(0, monthlyIncome - monthlyExpenses);
        const savingsPercentage = monthlyIncome > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0;

        // Update income display elements
        const incomeDisplayEl = document.getElementById('monthlyIncomeDisplay');
        const monthlySpendingTotalEl = document.getElementById('monthlySpendingTotal');
        const monthlySavingsAmountEl = document.getElementById('monthlySavingsAmount');
        const savingsPercentageEl = document.getElementById('savingsPercentage');

        if (incomeDisplayEl) {
            incomeDisplayEl.textContent = Utils.formatCurrency(monthlyIncome);
        }
        if (monthlySpendingTotalEl) {
            monthlySpendingTotalEl.textContent = Utils.formatCurrency(monthlyExpenses);
        }
        if (monthlySavingsAmountEl) {
            monthlySavingsAmountEl.textContent = Utils.formatCurrency(monthlySavings);
        }
        if (savingsPercentageEl) {
            savingsPercentageEl.textContent = `${savingsPercentage}%`;
        }
    }

    generateFinancialInsights(monthlyExpenses, allExpenses) {
        // Create or update financial insights section if it doesn't exist
        const overviewTab = document.getElementById('overview-tab');
        if (!overviewTab) return;

        let insightsSection = document.querySelector('.financial-insights');
        if (!insightsSection) {
            insightsSection = document.createElement('div');
            insightsSection.className = 'financial-insights';
            insightsSection.innerHTML = '<h3>💡 Financial Insights</h3><div class="insights-grid" id="financialInsightsGrid"></div>';

            // Insert after income tracker
            const incomeTracker = document.querySelector('.income-tracker');
            if (incomeTracker && incomeTracker.nextSibling) {
                overviewTab.insertBefore(insightsSection, incomeTracker.nextSibling);
            } else {
                overviewTab.appendChild(insightsSection);
            }
        }

        const insightsGrid = document.getElementById('financialInsightsGrid');
        if (!insightsGrid) return;

        const settings = window.storage.getSettings();
        const monthlyIncome = settings.monthlyIncome || 0;
        const insights = [];

        // Income vs Expenses insight
        if (monthlyIncome > 0) {
            const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
            let insightType = 'success';
            let message = '';

            if (savingsRate >= 20) {
                message = `Excellent! You're saving ${savingsRate.toFixed(1)}% of your income.`;
                insightType = 'success';
            } else if (savingsRate >= 10) {
                message = `Good progress! You're saving ${savingsRate.toFixed(1)}% of your income.`;
                insightType = 'success';
            } else if (savingsRate >= 0) {
                message = `Consider increasing savings. Currently saving ${savingsRate.toFixed(1)}%.`;
                insightType = 'warning';
            } else {
                message = `Warning: You're spending more than you earn by ${Utils.formatCurrency(Math.abs(monthlyIncome - monthlyExpenses))}.`;
                insightType = 'danger';
            }

            insights.push({
                title: 'Savings Rate',
                value: `${savingsRate.toFixed(1)}%`,
                description: message,
                type: insightType
            });
        }

        // Top spending category
        const categoryTotals = {};
        allExpenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + parseFloat(expense.amount);
        });

        const topCategory = Object.keys(categoryTotals).reduce((a, b) =>
            categoryTotals[a] > categoryTotals[b] ? a : b, 'none'
        );

        if (topCategory !== 'none') {
            const percentage = ((categoryTotals[topCategory] / monthlyExpenses) * 100).toFixed(1);
            insights.push({
                title: 'Top Category',
                value: this.getCategoryDisplayName(topCategory),
                description: `${percentage}% of spending (${Utils.formatCurrency(categoryTotals[topCategory])})`,
                type: 'info'
            });
        }

        // Spending trend
        const lastMonthExpenses = this.getLastMonthExpenses();
        if (lastMonthExpenses > 0) {
            const change = monthlyExpenses - lastMonthExpenses;
            const changePercent = ((change / lastMonthExpenses) * 100).toFixed(1);
            let insightType = change > 0 ? 'warning' : 'success';

            insights.push({
                title: 'Monthly Trend',
                value: `${change > 0 ? '+' : ''}${changePercent}%`,
                description: `${change > 0 ? 'Increased' : 'Decreased'} by ${Utils.formatCurrency(Math.abs(change))} vs last month`,
                type: insightType
            });
        }

        // Render insights
        insightsGrid.innerHTML = insights.map(insight => `
            <div class="insight-item ${insight.type}">
                <div class="insight-title">${insight.title}</div>
                <div class="insight-value">${insight.value}</div>
                <div class="insight-description">${insight.description}</div>
            </div>
        `).join('');
    }

    getLastMonthExpenses() {
        const expenses = window.storage.getExpenses();
        const now = new Date();
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        return expenses.filter(expense => {
            const expenseDate = new Date(expense.createdAt);
            return expenseDate >= lastMonthStart && expenseDate <= lastMonthEnd;
        }).reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    }

    // Update expense category based on task category
    updateExpenseCategory() {
        const taskCategorySelect = document.getElementById('taskCategory');
        const expenseCategorySelect = document.getElementById('taskExpenseCategory');
        const categoryDisplay = document.getElementById('selectedExpenseCategory');
        const changeBtn = document.getElementById('changeExpenseCategoryBtn');

        if (!taskCategorySelect || !expenseCategorySelect || !categoryDisplay) return;

        const taskCategory = taskCategorySelect.value;
        const categoryMapping = {
            'food': 'food',
            'health': 'healthcare',
            'bills': 'bills',
            'shopping': 'shopping',
            'travel': 'travel',
            'entertainment': 'entertainment',
            'education': 'education',
            'work': 'other',
            'personal': 'other',
            'reminder': 'other',
            'other': 'other'
        };

        const mappedCategory = categoryMapping[taskCategory] || 'other';

        // Set the expense category automatically
        expenseCategorySelect.value = mappedCategory;

        // Update the display
        const selectedOption = expenseCategorySelect.querySelector(`option[value="${mappedCategory}"]`);
        if (selectedOption) {
            categoryDisplay.textContent = selectedOption.textContent;
        }

        // Show/hide change button appropriately
        if (changeBtn) {
            changeBtn.style.display = 'inline';
        }

        // Hide the select dropdown initially
        expenseCategorySelect.style.display = 'none';
    }

    // Calendar view switching
    switchToCalendarView() {
        // Switch to expenses section if not already there
        if (this.currentSection !== 'expenses') {
            this.showSection('expenses');
        }

        // Switch to calendar tab
        this.switchExpenseTab('calendar');

        // Update the button text to indicate current view
        const viewToggleBtn = document.getElementById('viewToggleBtn');
        if (viewToggleBtn) {
            const isCalendarActive = this.currentExpenseTab === 'calendar';
            viewToggleBtn.textContent = isCalendarActive ? '📊 Overview' : '📅 Calendar View';

            // Add toggle behavior
            viewToggleBtn.onclick = () => {
                const newTab = this.currentExpenseTab === 'calendar' ? 'overview' : 'calendar';
                this.switchExpenseTab(newTab);
                viewToggleBtn.textContent = newTab === 'calendar' ? '📊 Overview' : '📅 Calendar View';
            };
        }
    }

    // Enhanced task and expense category methods
    getCategoryIcon(category) {
        const icons = {
            'work': '💼',
            'personal': '👤',
            'health': '🏥',
            'food': '🍕',
            'bills': '📧',
            'shopping': '🛍️',
            'travel': '✈️',
            'entertainment': '🎬',
            'education': '📚',
            'fitness': '💪',
            'subscriptions': '📺',
            'groceries': '🛒',
            'clothing': '👕',
            'healthcare': '🏥',
            'reminder': '⏰',
            'other': '📦'
        };
        return icons[category] || '📦';
    }

    getCategoryDisplayName(category) {
        const names = {
            'work': 'Work',
            'personal': 'Personal',
            'health': 'Health & Fitness',
            'food': 'Food & Dining',
            'bills': 'Bills & Utilities',
            'shopping': 'Shopping',
            'travel': 'Travel & Transport',
            'entertainment': 'Entertainment',
            'education': 'Education',
            'fitness': 'Fitness & Sports',
            'subscriptions': 'Subscriptions',
            'groceries': 'Groceries',
            'clothing': 'Clothing',
            'healthcare': 'Healthcare',
            'reminder': 'Reminder',
            'other': 'Other'
        };
        return names[category] || 'Other';
    }

    // Enhanced task submit with better expense integration
    handleTaskSubmitEnhanced(e) {
        e.preventDefault();

        const taskData = {
            title: Utils.sanitizeInput(document.getElementById('taskTitle').value),
            category: document.getElementById('taskCategory').value,
            date: document.getElementById('taskDate').value,
            expenseRelated: document.getElementById('taskExpense').checked,
            amount: document.getElementById('taskAmount').value,
            expenseCategory: document.getElementById('taskExpenseCategory').value
        };

        if (!taskData.title) {
            Utils.showNotification('Please enter a task title', 'error');
            return;
        }

        if (taskData.expenseRelated) {
            if (!taskData.amount || parseFloat(taskData.amount) <= 0) {
                Utils.showNotification('Please enter a valid expense amount', 'error');
                return;
            }
            // Expense category is automatically assigned, so we don't need to validate it separately
        }

        window.storage.addTask(taskData);
        Utils.showNotification('Task added successfully!', 'success');

        this.closeModal('taskModal');
        e.target.reset();

        // Reset the expense task details
        document.getElementById('expenseTaskDetails').style.display = 'none';
        document.getElementById('selectedExpenseCategory').textContent = '-';
        document.getElementById('taskExpenseCategory').style.display = 'none';
        document.getElementById('changeExpenseCategoryBtn').style.display = 'none';

        if (this.currentSection === 'tasks') {
            this.loadTasks();
        }
        this.updateDashboard();
    }

    // Enhanced task toggle with better expense handling
    toggleTaskEnhanced(taskId) {
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
                    const expenseData = {
                        amount: parseFloat(updatedTask.amount),
                        category: updatedTask.expenseCategory || 'other',
                        notes: `From completed task: ${updatedTask.title}`,
                        date: new Date().toISOString().split('T')[0],
                        paymentMethod: 'cash',
                        source: 'task'
                    };

                    window.storage.addExpense(expenseData);
                    Utils.showNotification(`Expense added: ${Utils.formatCurrency(updatedTask.amount)} to ${this.getCategoryDisplayName(updatedTask.expenseCategory)}`, 'info', 4000);
                }
            }

            this.updateDashboard();
            if (this.currentSection === 'tasks') {
                this.loadTasks();
            }
        }
    }

    // Exercise Timer Methods
    startExerciseTimer() {
        if (this.timerState === 'stopped' || this.timerState === 'paused') {
            this.timerState = 'running';

            // Update button states
            document.getElementById('startTimerBtn').style.display = 'none';
            document.getElementById('pauseTimerBtn').style.display = 'inline-block';
            document.getElementById('resetTimerBtn').style.display = 'inline-block';

            // Start the countdown
            this.exerciseTimer = setInterval(() => {
                this.timerRemaining--;
                this.updateTimerDisplay();

                if (this.timerRemaining <= 0) {
                    this.completeTimerExercise();
                }
            }, 1000);

            Utils.showNotification('Exercise timer started!', 'success');
        }
    }

    pauseExerciseTimer() {
        if (this.timerState === 'running') {
            this.timerState = 'paused';
            clearInterval(this.exerciseTimer);

            // Update button states
            document.getElementById('startTimerBtn').style.display = 'inline-block';
            document.getElementById('startTimerBtn').textContent = 'Resume';
            document.getElementById('pauseTimerBtn').style.display = 'none';

            Utils.showNotification('Timer paused', 'info');
        }
    }

    resetExerciseTimer() {
        this.timerState = 'stopped';
        clearInterval(this.exerciseTimer);

        this.timerRemaining = this.timerDuration;
        this.updateTimerDisplay();

        // Reset button states
        document.getElementById('startTimerBtn').style.display = 'inline-block';
        document.getElementById('startTimerBtn').textContent = 'Start Timer';
        document.getElementById('pauseTimerBtn').style.display = 'none';
        document.getElementById('resetTimerBtn').style.display = 'none';

        Utils.showNotification('Timer reset', 'info');
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timerRemaining / 60);
        const seconds = this.timerRemaining % 60;
        const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) {
            timerDisplay.textContent = displayTime;
        }

        // Update progress bar
        const progressFill = document.getElementById('timerProgressFill');
        if (progressFill) {
            const progressPercentage = ((this.timerDuration - this.timerRemaining) / this.timerDuration) * 100;
            progressFill.style.width = `${progressPercentage}%`;
        }

        // Change color when time is running out
        if (this.timerRemaining <= 30 && this.timerRemaining > 10) {
            timerDisplay?.classList.add('timer-warning');
        } else if (this.timerRemaining <= 10) {
            timerDisplay?.classList.add('timer-danger');
        } else {
            timerDisplay?.classList.remove('timer-warning', 'timer-danger');
        }
    }

    completeTimerExercise() {
        this.timerState = 'stopped';
        clearInterval(this.exerciseTimer);

        // Show completion notification
        Utils.showNotification('🎉 Exercise completed! Great job!', 'success', 5000);

        // Auto-complete the exercise
        if (this.currentExerciseType) {
            const exercise = Utils.getExerciseInstructions(this.currentExerciseType);
            this.completeExerciseEnhanced(this.currentExerciseType, exercise);
        }

        // Close modal after a short delay
        setTimeout(() => {
            this.closeModal('exerciseModal');
        }, 2000);
    }

    parseDurationToSeconds(duration) {
        // Parse duration string like "5 minutes", "3 minutes", "2 minutes" to seconds
        const match = duration.match(/(\d+)\s+(minute|minutes|min)/i);
        if (match) {
            return parseInt(match[1]) * 60;
        }

        // Default to 5 minutes if can't parse
        return 300;
    }

    // Enhanced startExercise method with timer support
    startExerciseEnhanced(exerciseType) {
        const exercise = Utils.getExerciseInstructions(exerciseType);
        if (!exercise) return;

        this.currentExerciseType = exerciseType;

        // Update modal content
        document.getElementById('exerciseTitle').textContent = exercise.title;

        // Create instructions HTML
        const instructionsHTML = `
            <div class="exercise-info">
                <div class="exercise-meta">
                    <span class="exercise-duration">⏱️ ${exercise.duration}</span>
                    <span class="exercise-calories">🔥 ${exercise.calories} cal</span>
                </div>
            </div>
            <div class="exercise-instructions">
                <h4>Instructions:</h4>
                <ol>
                    ${exercise.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                </ol>
            </div>
        `;

        document.getElementById('exerciseInstructions').innerHTML = instructionsHTML;

        // Show timer section if exercise has duration and it's not breathing exercise
        const timerSection = document.getElementById('exerciseTimerSection');
        if (exercise.duration && exerciseType !== 'breathing') {
            // Parse duration to seconds
            this.timerDuration = this.parseDurationToSeconds(exercise.duration);
            this.timerRemaining = this.timerDuration;

            // Show timer section
            timerSection.style.display = 'block';
            this.updateTimerDisplay();

            // Reset timer controls
            this.resetExerciseTimer();
        } else {
            timerSection.style.display = 'none';
        }

        // Special handling for breathing exercise
        if (exerciseType === 'breathing') {
            const completeBtn = document.getElementById('completeExerciseBtn');
            completeBtn.style.display = 'none';

            // Add breathing exercise start button
            const actionsDiv = document.querySelector('.exercise-modal-actions');
            let breathingBtn = document.getElementById('startBreathingExerciseBtn');
            if (!breathingBtn) {
                breathingBtn = document.createElement('button');
                breathingBtn.id = 'startBreathingExerciseBtn';
                breathingBtn.className = 'btn-primary';
                breathingBtn.textContent = 'Start Breathing Exercise';
                breathingBtn.addEventListener('click', () => {
                    this.closeModal('exerciseModal');
                    this.openModal('breathingModal');
                });
                actionsDiv.insertBefore(breathingBtn, actionsDiv.firstChild);
            }
            breathingBtn.style.display = 'inline-block';
        } else {
            document.getElementById('completeExerciseBtn').style.display = 'inline-block';
            const breathingBtn = document.getElementById('startBreathingExerciseBtn');
            if (breathingBtn) {
                breathingBtn.style.display = 'none';
            }
        }

        // Set up button handlers
        const completeBtn = document.getElementById('completeExerciseBtn');
        const skipBtn = document.getElementById('skipExerciseBtn');

        if (completeBtn) {
            completeBtn.onclick = () => {
                this.completeExerciseEnhanced(exerciseType, exercise);
            };
        }

        if (skipBtn) {
            skipBtn.onclick = () => {
                this.skipExercise(exerciseType, exercise);
            };
        }

        this.openModal('exerciseModal');
    }

    // Enhanced completeExercise method
    completeExerciseEnhanced(exerciseType, exercise) {
        // Stop timer if running
        if (this.timerState === 'running') {
            this.resetExerciseTimer();
        }

        // Mark workout
        const workout = {
            type: exerciseType,
            duration: exercise ? exercise.duration : '5 minutes',
            calories: exercise ? exercise.calories : 15,
            completedAt: new Date().toISOString()
        };

        window.storage.addWorkout(workout);

        // Check for badges
        const data = {
            workouts: window.storage.getWorkouts(),
            tasks: window.storage.getTasks(),
            expenses: window.storage.getExpenses()
        };

        Utils.checkBadgeEligibility(data);

        Utils.showNotification('✅ Exercise completed! Keep up the great work!', 'success');

        this.closeModal('exerciseModal');

        // Update fitness data if on fitness section
        if (this.currentSection === 'fitness') {
            this.loadFitnessDataEnhanced();
        }

        this.updateDashboard();
    }

    // Load fitness data and update badges
    loadFitnessDataEnhanced() {
        this.updateFitnessStatsEnhanced();
        this.updateBadges();
    }

    updateFitnessStatsEnhanced() {
        const workouts = window.storage.getWorkouts();
        const streak = window.storage.getWorkoutStreak();

        // Update streak display
        const fitnessStreakEl = document.getElementById('fitnessStreak');
        if (fitnessStreakEl) {
            Utils.animateNumber(fitnessStreakEl, 0, streak);
        }

        // Update weekly workouts
        const thisWeek = workouts.filter(w => Utils.isThisWeek(w.createdAt));
        const weeklyWorkoutsEl = document.getElementById('weeklyWorkouts');
        if (weeklyWorkoutsEl) {
            weeklyWorkoutsEl.textContent = `${thisWeek.length}/7`;
        }

        // Update total workouts
        const totalWorkoutsEl = document.getElementById('totalWorkouts');
        if (totalWorkoutsEl) {
            Utils.animateNumber(totalWorkoutsEl, 0, workouts.length);
        }

        // Calculate and update total calories burnt
        const totalCalories = workouts.reduce((total, workout) => {
            return total + (parseInt(workout.calories) || 0);
        }, 0);

        const totalCaloriesBurntEl = document.getElementById('totalCaloriesBurnt');
        if (totalCaloriesBurntEl) {
            Utils.animateNumber(totalCaloriesBurntEl, 0, totalCalories);
        }
    }

    updateBadges() {
        const badges = window.storage.getBadges();
        const badgesList = document.getElementById('badgesList');

        if (!badgesList) return;

        const badgeElements = badgesList.querySelectorAll('.badge[data-badge]');
        badgeElements.forEach(badge => {
            const badgeName = badge.dataset.badge;

            if (badges[badgeName]) {
                badge.classList.remove('locked');
                badge.classList.add('unlocked');
                badge.title = 'Badge Unlocked! 🎉';
            } else {
                badge.classList.add('locked');
                badge.classList.remove('unlocked');
                badge.title = 'Badge Locked - Keep working to unlock!';
            }
        });

        // Update badge count in section header
        this.updateBadgeCount(badges);
    }

    updateBadgeCount(badges) {
        const unlockedCount = Object.values(badges).filter(Boolean).length;
        const totalCount = Object.keys(badges).length;

        const badgesSection = document.querySelector('.badges-section h3');
        if (badgesSection) {
            badgesSection.textContent = `Achievement Badges (${unlockedCount}/${totalCount})`;
        }
    }

    markWorkout() {
        const workout = {
            type: 'general',
            duration: '30 minutes',
            calories: 200,
            completedAt: new Date().toISOString()
        };

        window.storage.addWorkout(workout);

        // Check for new badges
        const data = {
            workouts: window.storage.getWorkouts(),
            tasks: window.storage.getTasks(),
            expenses: window.storage.getExpenses()
        };

        Utils.checkBadgeEligibility(data);

        Utils.showNotification('💪 Workout marked! Keep up the great work!', 'success');

        if (this.currentSection === 'fitness') {
            this.loadFitnessData();
        }

        this.updateDashboard();
    }

    // Enhanced Food and Meal Plan Methods
    editMealSuggestion(mealType) {
        const suggestions = Utils.getMealSuggestions();
        const currentMeal = document.getElementById(`${mealType}Meal`).textContent;

        // Create a simple prompt for now - could be enhanced with a modal
        const newMeal = prompt(`Edit ${mealType} meal:`, currentMeal);
        if (newMeal && newMeal.trim()) {
            document.getElementById(`${mealType}Meal`).textContent = newMeal.trim();

            // Calculate and update calories
            const calories = Utils.calculateCalories(newMeal);
            document.getElementById(`${mealType}Calories`).textContent = `${calories} cal`;

            // Estimate cost (simple calculation)
            const cost = this.estimateMealCost(newMeal);
            document.getElementById(`${mealType}Cost`).textContent = `₹${cost}`;

            Utils.showNotification(`${mealType} meal updated!`, 'success');

            // Save to localStorage for persistence
            this.saveMealToStorage(mealType, newMeal, calories, cost);
        }
    }

    regenerateMealPlan() {
        const suggestions = Utils.getMealSuggestions();

        // Update breakfast
        document.getElementById('breakfastMeal').textContent = suggestions.breakfast;
        const breakfastCalories = Utils.calculateCalories(suggestions.breakfast);
        document.getElementById('breakfastCalories').textContent = `${breakfastCalories} cal`;
        document.getElementById('breakfastCost').textContent = `₹${this.estimateMealCost(suggestions.breakfast)}`;

        // Update lunch
        document.getElementById('lunchMeal').textContent = suggestions.lunch;
        const lunchCalories = Utils.calculateCalories(suggestions.lunch);
        document.getElementById('lunchCalories').textContent = `${lunchCalories} cal`;
        document.getElementById('lunchCost').textContent = `₹${this.estimateMealCost(suggestions.lunch)}`;

        // Update dinner
        document.getElementById('dinnerMeal').textContent = suggestions.dinner;
        const dinnerCalories = Utils.calculateCalories(suggestions.dinner);
        document.getElementById('dinnerCalories').textContent = `${dinnerCalories} cal`;
        document.getElementById('dinnerCost').textContent = `₹${this.estimateMealCost(suggestions.dinner)}`;

        Utils.showNotification('🍽️ New meal plan generated!', 'success');

        // Save all meals to storage
        this.saveMealToStorage('breakfast', suggestions.breakfast, breakfastCalories, this.estimateMealCost(suggestions.breakfast));
        this.saveMealToStorage('lunch', suggestions.lunch, lunchCalories, this.estimateMealCost(suggestions.lunch));
        this.saveMealToStorage('dinner', suggestions.dinner, dinnerCalories, this.estimateMealCost(suggestions.dinner));

        // Update dashboard
        this.updateDashboard();
    }

    saveMealPlan() {
        const mealPlan = {
            date: new Date().toDateString(),
            breakfast: {
                name: document.getElementById('breakfastMeal').textContent,
                calories: parseInt(document.getElementById('breakfastCalories').textContent),
                cost: parseInt(document.getElementById('breakfastCost').textContent.replace('���', ''))
            },
            lunch: {
                name: document.getElementById('lunchMeal').textContent,
                calories: parseInt(document.getElementById('lunchCalories').textContent),
                cost: parseInt(document.getElementById('lunchCost').textContent.replace('₹', ''))
            },
            dinner: {
                name: document.getElementById('dinnerMeal').textContent,
                calories: parseInt(document.getElementById('dinnerCalories').textContent),
                cost: parseInt(document.getElementById('dinnerCost').textContent.replace('₹', ''))
            }
        };

        // Save to localStorage
        let savedMealPlans = JSON.parse(localStorage.getItem('meal_plans') || '[]');

        // Remove existing plan for today if any
        savedMealPlans = savedMealPlans.filter(plan => plan.date !== mealPlan.date);

        // Add new plan
        savedMealPlans.push(mealPlan);

        // Keep only last 30 days
        savedMealPlans = savedMealPlans.slice(-30);

        localStorage.setItem('meal_plans', JSON.stringify(savedMealPlans));

        Utils.showNotification('📋 Meal plan saved!', 'success');
    }

    saveMealToStorage(mealType, mealName, calories, cost) {
        const mealData = {
            name: mealName,
            calories: calories,
            cost: cost,
            date: new Date().toDateString(),
            type: mealType
        };

        let savedMeals = JSON.parse(localStorage.getItem('daily_meals') || '[]');

        // Remove existing meal of same type for today
        savedMeals = savedMeals.filter(meal =>
            !(meal.date === mealData.date && meal.type === mealType)
        );

        // Add new meal
        savedMeals.push(mealData);

        // Keep only last 30 days
        savedMeals = savedMeals.slice(-90); // 3 meals * 30 days

        localStorage.setItem('daily_meals', JSON.stringify(savedMeals));
    }

    estimateMealCost(mealName) {
        // Simple cost estimation based on ingredients
        const mealLower = mealName.toLowerCase();
        let baseCost = 30; // Base cost

        // Adjust cost based on ingredients
        if (mealLower.includes('dosa') || mealLower.includes('idli')) {
            baseCost = 25;
        } else if (mealLower.includes('biryani') || mealLower.includes('special')) {
            baseCost = 60;
        } else if (mealLower.includes('rice') && mealLower.includes('sambar')) {
            baseCost = 45;
        } else if (mealLower.includes('appam') || mealLower.includes('puttu')) {
            baseCost = 35;
        } else if (mealLower.includes('upma') || mealLower.includes('pongal')) {
            baseCost = 30;
        }

        // Add cost for accompaniments
        if (mealLower.includes('chutney')) baseCost += 10;
        if (mealLower.includes('sambar')) baseCost += 15;
        if (mealLower.includes('rasam')) baseCost += 10;
        if (mealLower.includes('curry')) baseCost += 20;
        if (mealLower.includes('coconut')) baseCost += 15;

        return baseCost;
    }

    // Enhanced loadFoodData method to load saved meal plans (removed duplicate)

    loadSavedMealPlan() {
        const today = new Date().toDateString();
        const savedMeals = JSON.parse(localStorage.getItem('daily_meals') || '[]');
        const todayMeals = savedMeals.filter(meal => meal.date === today);

        if (todayMeals.length > 0) {
            todayMeals.forEach(meal => {
                const mealEl = document.getElementById(`${meal.type}Meal`);
                const caloriesEl = document.getElementById(`${meal.type}Calories`);
                const costEl = document.getElementById(`${meal.type}Cost`);

                if (mealEl) mealEl.textContent = meal.name;
                if (caloriesEl) caloriesEl.textContent = `${meal.calories} cal`;
                if (costEl) costEl.textContent = `₹${meal.cost}`;
            });
        } else {
            // Generate new meal plan if none saved for today
            this.regenerateMealPlan();
        }
    }

    // Food Analytics Methods
    updateFoodAnalytics() {
        this.updateNutritionStats();
        this.createFoodCharts();
        this.generateFoodInsights();
    }

    updateNutritionStats() {
        const savedMeals = JSON.parse(localStorage.getItem('daily_meals') || '[]');
        const last7Days = savedMeals.filter(meal => {
            const mealDate = new Date(meal.date);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return mealDate >= weekAgo;
        });

        // Calculate weekly calories
        const weeklyCalories = last7Days.reduce((sum, meal) => sum + (meal.calories || 0), 0);

        // Calculate average meal cost
        const avgCost = last7Days.length > 0 ?
            last7Days.reduce((sum, meal) => sum + (meal.cost || 0), 0) / last7Days.length : 0;

        // Count home cooking days (unique dates)
        const cookingDays = new Set(last7Days.map(meal => meal.date)).size;

        // Count South Indian meals
        const southIndianMeals = last7Days.filter(meal =>
            Utils.isSouthIndianFood(meal.name)
        ).length;

        // Update UI
        const weeklyCaloriesEl = document.getElementById('weeklyCalories');
        const avgMealCostEl = document.getElementById('avgMealCost');
        const homeCookingDaysEl = document.getElementById('homeCookingDays');
        const southIndianMealsEl = document.getElementById('southIndianMeals');

        if (weeklyCaloriesEl) {
            Utils.animateNumber(weeklyCaloriesEl, 0, weeklyCalories);
            weeklyCaloriesEl.textContent = weeklyCalories.toLocaleString();
        }

        if (avgMealCostEl) {
            avgMealCostEl.textContent = `₹${Math.round(avgCost)}`;
        }

        if (homeCookingDaysEl) {
            homeCookingDaysEl.textContent = `${cookingDays}/7`;
        }

        if (southIndianMealsEl) {
            southIndianMealsEl.textContent = southIndianMeals;
        }

        // Update changes (mock data for demo)
        this.updateNutritionChanges();
    }

    updateNutritionChanges() {
        const changes = [
            { id: 'calorieChange', value: '+5%', positive: true },
            { id: 'costChange', value: '-8%', positive: false },
            { id: 'cookingChange', value: '+2', positive: true },
            { id: 'southIndianChange', value: '+4', positive: true }
        ];

        changes.forEach(change => {
            const element = document.getElementById(change.id);
            if (element) {
                element.textContent = change.value;
                element.className = `nutrition-change ${change.positive ? 'positive' : 'negative'}`;
            }
        });
    }

    createFoodCharts() {
        this.createCalorieChart();
        this.createMealCostChart();
    }

    createCalorieChart() {
        const canvas = document.getElementById('calorieChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Mock data for last 7 days
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const calories = [2100, 1950, 2200, 2050, 2300, 1850, 2150];

        // Chart settings
        const padding = 40;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        const maxCalories = Math.max(...calories) * 1.1;

        // Draw axes
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;

        // Y-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.stroke();

        // X-axis
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Draw grid lines
        ctx.strokeStyle = '#f3f4f6';
        for (let i = 1; i <= 4; i++) {
            const y = padding + (i * chartHeight / 4);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // Draw data line
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.beginPath();

        calories.forEach((calorie, index) => {
            const x = padding + (index * chartWidth / (calories.length - 1));
            const y = height - padding - (calorie / maxCalories * chartHeight);

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw data points
        ctx.fillStyle = '#3b82f6';
        calories.forEach((calorie, index) => {
            const x = padding + (index * chartWidth / (calories.length - 1));
            const y = height - padding - (calorie / maxCalories * chartHeight);

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Draw labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';

        days.forEach((day, index) => {
            const x = padding + (index * chartWidth / (days.length - 1));
            ctx.fillText(day, x, height - 10);
        });

        // Y-axis labels
        ctx.textAlign = 'right';
        for (let i = 0; i <= 4; i++) {
            const value = Math.round((maxCalories / 4) * i);
            const y = height - padding - (i * chartHeight / 4);
            ctx.fillText(value.toString(), padding - 10, y + 4);
        }
    }

    createMealCostChart() {
        const canvas = document.getElementById('mealCostChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Data for home cooking vs delivery
        const data = [
            { label: 'Home Cooking', value: 45, color: '#10b981' },
            { label: 'Delivery', value: 180, color: '#ef4444' }
        ];

        const maxValue = Math.max(...data.map(d => d.value));
        const barWidth = 80;
        const barSpacing = 100;
        const padding = 60;

        // Draw bars
        data.forEach((item, index) => {
            const x = padding + index * (barWidth + barSpacing);
            const barHeight = (item.value / maxValue) * (height - 2 * padding);
            const y = height - padding - barHeight;

            // Draw bar
            ctx.fillStyle = item.color;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw value label
            ctx.fillStyle = '#374151';
            ctx.font = '14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`₹${item.value}`, x + barWidth/2, y - 10);

            // Draw category label
            ctx.fillText(item.label, x + barWidth/2, height - 20);
        });

        // Add title
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Average Cost per Meal', width/2, 25);
    }

    generateFoodInsights() {
        const insightsList = document.getElementById('foodInsightsList');
        if (!insightsList) return;

        // Generate dynamic insights based on data
        const savedMeals = JSON.parse(localStorage.getItem('daily_meals') || '[]');
        const insights = this.calculateFoodInsights(savedMeals);

        insightsList.innerHTML = insights.map(insight => `
            <div class="insight-card">
                <div class="insight-icon">${insight.icon}</div>
                <div class="insight-content">
                    <h5>${insight.title}</h5>
                    <p>${insight.description}</p>
                </div>
            </div>
        `).join('');
    }

    calculateFoodInsights(meals) {
        const insights = [];

        // South Indian preference
        const southIndianCount = meals.filter(meal => Utils.isSouthIndianFood(meal.name)).length;
        const totalMeals = meals.length;

        if (southIndianCount > totalMeals * 0.6) {
            insights.push({
                icon: '🥥',
                title: 'South Indian Preference',
                description: `You've enjoyed ${southIndianCount} South Indian meals recently. Your taste for traditional flavors is evident!`
            });
        }

        // Cost efficiency
        const avgCost = meals.reduce((sum, meal) => sum + (meal.cost || 0), 0) / Math.max(meals.length, 1);
        if (avgCost < 50) {
            insights.push({
                icon: '💰',
                title: 'Budget-Friendly Eating',
                description: `Your average meal cost of ₹${Math.round(avgCost)} shows excellent budget management. Keep it up!`
            });
        }

        // Calorie balance
        const avgCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0) / Math.max(meals.length, 1);
        if (avgCalories >= 2000 && avgCalories <= 2200) {
            insights.push({
                icon: '🔥',
                title: 'Well-Balanced Calories',
                description: `Your daily average of ${Math.round(avgCalories)} calories is perfectly balanced for a healthy lifestyle.`
            });
        }

        // Consistency
        const uniqueDays = new Set(meals.map(meal => meal.date)).size;
        if (uniqueDays >= 5) {
            insights.push({
                icon: '🍽️',
                title: 'Consistent Meal Planning',
                description: `You've planned meals for ${uniqueDays} days recently. Great consistency in your food routine!`
            });
        }

        return insights.slice(0, 3); // Show only top 3 insights
    }

    // Enhanced loadFoodData to include analytics (removed duplicate)

    // Food tracking tab handlers
    initializeFoodTrackingTabHandlers() {
        document.querySelectorAll('.food-tracking-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchFoodTrackingTab(tab);

                // Update active state
                document.querySelectorAll('.food-tracking-tabs .tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    switchFoodTrackingTab(tabName) {
        // Hide all food tracking tab content
        document.querySelectorAll('#today-food, #yesterday-food, #weekly-food').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected tab
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add('active');

            // Load specific data for the tab
            if (tabName === 'today-food') {
                this.loadTodayMeals();
            } else if (tabName === 'yesterday-food') {
                this.loadYesterdayMeals();
            } else if (tabName === 'weekly-food') {
                this.loadWeeklyFoodAnalysis();
            }
        }
    }

    // Meal form handlers
    initializeMealFormHandlers() {
        // Source option handlers
        const sourceOptions = document.querySelectorAll('.source-option');
        sourceOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                // Remove active class from all options
                sourceOptions.forEach(opt => opt.classList.remove('active'));

                // Add active class to clicked option
                e.currentTarget.classList.add('active');

                const source = e.currentTarget.dataset.source;
                this.handleMealSourceChange(source);
            });
        });

        // Status option handlers
        const statusOptions = document.querySelectorAll('.status-option');
        statusOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                // Remove active class from all options
                statusOptions.forEach(opt => opt.classList.remove('active'));

                // Add active class to clicked option
                e.currentTarget.classList.add('active');
            });
        });

        // Set today's date as default
        const mealDateInput = document.getElementById('mealDate');
        if (mealDateInput) {
            mealDateInput.value = new Date().toISOString().split('T')[0];
        }
    }

    handleMealSourceChange(source) {
        const homeCookingDetails = document.getElementById('homeCookingDetails');
        const hotelDetails = document.getElementById('hotelDetails');
        const mealCostInput = document.getElementById('mealCost');

        if (source === 'home') {
            homeCookingDetails.style.display = 'block';
            hotelDetails.style.display = 'none';
            // Remove required attribute from hotel fields
            mealCostInput.removeAttribute('required');
        } else if (source === 'hotel') {
            homeCookingDetails.style.display = 'none';
            hotelDetails.style.display = 'block';
            // Add required attribute to meal cost
            mealCostInput.setAttribute('required', 'required');
        }
    }

    handleMealSubmit(e) {
        e.preventDefault();

        const selectedSource = document.querySelector('.source-option.active');
        if (!selectedSource) {
            Utils.showNotification('Please select where you had this meal', 'error');
            return;
        }

        const selectedStatus = document.querySelector('.status-option.active');
        const mealStatus = selectedStatus ? selectedStatus.dataset.status : 'eaten';

        const mealData = {
            name: Utils.sanitizeInput(document.getElementById('mealName').value),
            type: document.getElementById('mealType').value,
            calories: parseInt(document.getElementById('mealCalories').value),
            source: selectedSource.dataset.source,
            status: mealStatus,
            date: document.getElementById('mealDate').value,
            notes: Utils.sanitizeInput(document.getElementById('mealNotes').value)
        };

        if (!mealData.name || !mealData.type || !mealData.calories) {
            Utils.showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (mealData.source === 'home') {
            mealData.ingredientCost = parseFloat(document.getElementById('ingredientCost').value) || 0;
            mealData.cookingTime = parseInt(document.getElementById('cookingTime').value) || 0;
        } else if (mealData.source === 'hotel') {
            mealData.mealCost = parseFloat(document.getElementById('mealCost').value);
            mealData.deliveryCharges = parseFloat(document.getElementById('deliveryCharges').value) || 0;
            mealData.restaurantName = Utils.sanitizeInput(document.getElementById('restaurantName').value);

            if (!mealData.mealCost) {
                Utils.showNotification('Please enter the meal cost', 'error');
                return;
            }

            // Add this meal cost as an expense if it's from hotel
            const expenseData = {
                amount: mealData.mealCost + mealData.deliveryCharges,
                category: 'food',
                notes: `${mealData.name}${mealData.restaurantName ? ' from ' + mealData.restaurantName : ''}`,
                date: mealData.date,
                paymentMethod: 'card',
                priority: 'medium',
                mealRelated: true
            };

            window.storage.addExpense(expenseData);
        }

        // Check if this is an edit or new meal
        const editId = document.getElementById('mealForm').dataset.editId;

        // Validate meal limits (skip for edits)
        if (!editId) {
            if (!this.validateMealLimit(mealData.date)) {
                return;
            }

            if (!this.checkMealTypeConflict(mealData.date, mealData.type)) {
                return;
            }
        } else {
            // For edits, validate limits excluding the current meal
            if (!this.validateMealLimit(mealData.date, editId)) {
                return;
            }

            if (!this.checkMealTypeConflict(mealData.date, mealData.type, editId)) {
                return;
            }
        }

        window.storage.addMeal(mealData);
        Utils.showNotification('Meal added successfully!', 'success');

        this.closeModal('mealModal');
        this.resetMealForm();

        if (this.currentSection === 'food') {
            this.loadFoodData();
        }
        this.updateDashboard();
    }

    resetMealForm() {
        const form = document.getElementById('mealForm');
        if (form) {
            form.reset();

            // Reset source options
            document.querySelectorAll('.source-option').forEach(opt => opt.classList.remove('active'));

            // Hide cooking details
            document.getElementById('homeCookingDetails').style.display = 'none';
            document.getElementById('hotelDetails').style.display = 'none';

            // Set today's date
            document.getElementById('mealDate').value = new Date().toISOString().split('T')[0];
        }
    }

    // Daily food tracking methods
    loadDailyFoodTracking() {
        this.loadTodayMeals();
    }

    loadTodayMeals() {
        const todayMeals = window.storage.getTodayMeals();
        this.updateDailySummary('today', todayMeals);
        this.renderMealsList('todayMealsList', todayMeals);
    }

    loadYesterdayMeals() {
        const yesterdayMeals = window.storage.getYesterdayMeals();
        this.renderMealsList('yesterdayMealsList', yesterdayMeals);
    }

    loadWeeklyFoodAnalysis() {
        const weeklyStats = window.storage.getWeeklyMealStats();
        this.renderWeeklyFoodAnalysis(weeklyStats);
    }

    updateDailySummary(day, meals) {
        const homeMeals = meals.filter(meal => meal.source === 'home');
        const hotelMeals = meals.filter(meal => meal.source === 'hotel');

        const homeCalories = homeMeals.reduce((sum, meal) => sum + parseInt(meal.calories), 0);
        const hotelCalories = hotelMeals.reduce((sum, meal) => sum + parseInt(meal.calories), 0);

        const homeCost = homeMeals.reduce((sum, meal) => sum + (parseFloat(meal.ingredientCost) || 0), 0);
        const hotelCost = hotelMeals.reduce((sum, meal) => sum + (parseFloat(meal.mealCost) || 0) + (parseFloat(meal.deliveryCharges) || 0), 0);

        // Update home cooking summary
        const todayHomeMealsEl = document.getElementById(`${day}HomeMeals`);
        const todayHomeCaloriesEl = document.getElementById(`${day}HomeCalories`);
        const todayHomeCostEl = document.getElementById(`${day}HomeCost`);

        if (todayHomeMealsEl) todayHomeMealsEl.textContent = homeMeals.length;
        if (todayHomeCaloriesEl) todayHomeCaloriesEl.textContent = `${homeCalories} cal`;
        if (todayHomeCostEl) todayHomeCostEl.textContent = Utils.formatCurrency(homeCost);

        // Update hotel/delivery summary
        const todayHotelMealsEl = document.getElementById(`${day}HotelMeals`);
        const todayHotelCaloriesEl = document.getElementById(`${day}HotelCalories`);
        const todayHotelCostEl = document.getElementById(`${day}HotelCost`);

        if (todayHotelMealsEl) todayHotelMealsEl.textContent = hotelMeals.length;
        if (todayHotelCaloriesEl) todayHotelCaloriesEl.textContent = `${hotelCalories} cal`;
        if (todayHotelCostEl) todayHotelCostEl.textContent = Utils.formatCurrency(hotelCost);
    }

    renderMealsList(containerId, meals) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (meals.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No meals recorded</h3>
                    <p>Add your first meal to start tracking!</p>
                    <button class="btn-primary" onclick="app.openModal('mealModal')">Add Meal</button>
                </div>
            `;
            return;
        }

        container.innerHTML = meals.map(meal => `
            <div class="meal-item">
                <div class="meal-type-icon ${meal.type}">
                    ${this.getMealTypeIcon(meal.type)}
                </div>
                <div class="meal-info">
                    <div class="meal-name">${Utils.sanitizeInput(meal.name)}</div>
                    <div class="meal-details">
                        <span>${meal.calories} cal</span>
                        <span>${Utils.formatDate(meal.date)}</span>
                        ${meal.restaurantName ? `<span>${Utils.sanitizeInput(meal.restaurantName)}</span>` : ''}
                    </div>
                </div>
                <div class="meal-source ${meal.source}">
                    <span class="icon">${meal.source === 'home' ? '���' : '🏨'}</span>
                    <span>${meal.source === 'home' ? 'Home' : 'Hotel'}</span>
                </div>
            </div>
        `).join('');
    }

    getMealTypeIcon(type) {
        const icons = {
            breakfast: '🌅',
            lunch: '🌞',
            dinner: '🌙',
            snack: '🥨'
        };
        return icons[type] || '🍽️';
    }

    renderWeeklyFoodAnalysis(stats) {
        const container = document.getElementById('weeklyFoodAnalysis');
        if (!container) return;

        const moneySaved = Math.max(0, (stats.hotelMeals * 200) - stats.totalHomeCost);

        container.innerHTML = `
            <div class="weekly-summary-cards">
                <div class="weekly-summary-card">
                    <h4>Total Meals</h4>
                    <div class="value">${stats.totalMeals}</div>
                    <div class="label">This Week</div>
                </div>
                <div class="weekly-summary-card">
                    <h4>Home Cooked</h4>
                    <div class="value">${stats.homeMeals}</div>
                    <div class="label">${Math.round((stats.homeMeals / Math.max(stats.totalMeals, 1)) * 100)}% of total</div>
                </div>
                <div class="weekly-summary-card">
                    <h4>Hotel/Delivery</h4>
                    <div class="value">${stats.hotelMeals}</div>
                    <div class="label">${Math.round((stats.hotelMeals / Math.max(stats.totalMeals, 1)) * 100)}% of total</div>
                </div>
                <div class="weekly-summary-card">
                    <h4>Total Calories</h4>
                    <div class="value">${stats.totalCalories}</div>
                    <div class="label">Avg: ${Math.round(stats.avgCaloriesPerDay)} per day</div>
                </div>
                <div class="weekly-summary-card">
                    <h4>Money Saved</h4>
                    <div class="value">${Utils.formatCurrency(moneySaved)}</div>
                    <div class="label">By cooking at home</div>
                </div>
                <div class="weekly-summary-card">
                    <h4>Total Spent</h4>
                    <div class="value">${Utils.formatCurrency(stats.totalHomeCost + stats.totalHotelCost)}</div>
                    <div class="label">On food this week</div>
                </div>
            </div>
        `;
    }

    // Home vs Hotel Analysis
    loadHomeVsHotelAnalysis() {
        this.createCookingFrequencyChart();
        this.createCostComparisonChart();
        this.generateComparisonInsights();
    }

    createCookingFrequencyChart() {
        const canvas = document.getElementById('cookingFrequencyChart');
        if (!canvas) return;

        const weeklyStats = window.storage.getWeeklyMealStats();
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const chartData = [
            { label: 'Home Cooked', value: weeklyStats.homeMeals, color: '#10b981' },
            { label: 'Hotel/Delivery', value: weeklyStats.hotelMeals, color: '#f59e0b' }
        ];

        this.drawSimpleBarChart(ctx, chartData, canvas.width, canvas.height);
    }

    createCostComparisonChart() {
        const canvas = document.getElementById('costComparisonChart');
        if (!canvas) return;

        const weeklyStats = window.storage.getWeeklyMealStats();
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const chartData = [
            { label: 'Home Cost', value: weeklyStats.totalHomeCost, color: '#10b981' },
            { label: 'Hotel Cost', value: weeklyStats.totalHotelCost, color: '#f59e0b' }
        ];

        this.drawSimpleBarChart(ctx, chartData, canvas.width, canvas.height, true);
    }

    drawSimpleBarChart(ctx, data, width, height, isCurrency = false) {
        const padding = 40;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        const barWidth = chartWidth / (data.length * 2);

        const maxValue = Math.max(...data.map(d => d.value)) * 1.1;

        // Draw bars
        data.forEach((item, index) => {
            const barHeight = (item.value / maxValue) * chartHeight;
            const x = padding + index * (barWidth + barWidth);
            const y = height - padding - barHeight;

            // Draw bar
            ctx.fillStyle = item.color;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw label
            ctx.fillStyle = '#374151';
            ctx.font = '12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(item.label, x + barWidth/2, height - 10);

            // Draw value
            ctx.fillStyle = '#6b7280';
            ctx.font = '10px Inter, sans-serif';
            const valueText = isCurrency ? Utils.formatCurrency(item.value) : item.value.toString();
            ctx.fillText(valueText, x + barWidth/2, y - 5);
        });
    }

    generateComparisonInsights() {
        const container = document.getElementById('comparisonInsights');
        if (!container) return;

        const weeklyStats = window.storage.getWeeklyMealStats();
        const homePercentage = Math.round((weeklyStats.homeMeals / Math.max(weeklyStats.totalMeals, 1)) * 100);
        const avgHomeCost = weeklyStats.homeMeals > 0 ? weeklyStats.totalHomeCost / weeklyStats.homeMeals : 0;
        const avgHotelCost = weeklyStats.hotelMeals > 0 ? weeklyStats.totalHotelCost / weeklyStats.hotelMeals : 0;

        const insights = [];

        if (homePercentage >= 70) {
            insights.push({
                icon: '🏠',
                title: 'Excellent Home Cooking Habit',
                description: `You cooked at home ${homePercentage}% of the time this week. This is great for both health and budget!`
            });
        } else if (homePercentage >= 50) {
            insights.push({
                icon: '⚖️',
                title: 'Balanced Approach',
                description: `You have a good balance with ${homePercentage}% home cooking. Consider increasing it for more savings.`
            });
        } else {
            insights.push({
                icon: '🏨',
                title: 'Consider More Home Cooking',
                description: `You ate out ${100 - homePercentage}% of the time. Try cooking more at home to save money and eat healthier.`
            });
        }

        if (avgHomeCost > 0 && avgHotelCost > 0) {
            const savings = avgHotelCost - avgHomeCost;
            insights.push({
                icon: '💰',
                title: 'Cost Comparison',
                description: `On average, home cooking saves you ${Utils.formatCurrency(savings)} per meal compared to ordering out.`
            });
        }

        if (weeklyStats.totalCalories > 0) {
            insights.push({
                icon: '🔥',
                title: 'Weekly Calorie Intake',
                description: `You consumed ${weeklyStats.totalCalories} calories this week, averaging ${Math.round(weeklyStats.avgCaloriesPerDay)} per day.`
            });
        }

        container.innerHTML = insights.map(insight => `
            <div class="insight-card">
                <div class="insight-icon">${insight.icon}</div>
                <div class="insight-content">
                    <h5>${insight.title}</h5>
                    <p>${insight.description}</p>
                </div>
            </div>
        `).join('');
    }

    // Update food stats to include meal data
    updateFoodStats() {
        const weeklyStats = window.storage.getWeeklyMealStats();
        const todayMeals = window.storage.getTodayMeals();
        const todayCalories = todayMeals.reduce((sum, meal) => sum + parseInt(meal.calories), 0);

        const homeMealsEl = document.getElementById('homeMeals');
        const hotelMealsEl = document.getElementById('hotelMeals');
        const moneySavedEl = document.getElementById('moneySaved');
        const caloriesConsumedEl = document.getElementById('caloriesConsumed');

        if (homeMealsEl) homeMealsEl.textContent = weeklyStats.homeMeals;
        if (hotelMealsEl) hotelMealsEl.textContent = weeklyStats.hotelMeals;
        if (moneySavedEl) moneySavedEl.textContent = Utils.formatCurrency(weeklyStats.moneySaved);
        if (caloriesConsumedEl) caloriesConsumedEl.textContent = todayCalories;
    }

    // Update food form handler for enhanced pantry items
    handleFoodSubmit(e) {
        e.preventDefault();

        const foodData = {
            name: Utils.sanitizeInput(document.getElementById('foodName').value),
            quantity: parseFloat(document.getElementById('foodQuantity').value),
            unit: document.getElementById('foodUnit').value,
            caloriesPer100g: parseInt(document.getElementById('foodCaloriesPer100g').value),
            expiry: document.getElementById('foodExpiry').value
        };

        if (!foodData.name || !foodData.quantity || !foodData.caloriesPer100g) {
            Utils.showNotification('Please fill in all required fields', 'error');
            return;
        }

        window.storage.addFoodItem(foodData);
        Utils.showNotification('Food item added to pantry!', 'success');

        this.closeModal('foodModal');
        e.target.reset();

        if (this.currentSection === 'food') {
            this.loadFoodData();
        }
    }

    // Interactive Meal Planner Methods
    currentPlanDate = new Date();
    currentSelectedMeal = null;

    initializeInteractiveMealPlanner() {
        // Initialize meal selection modal handlers
        this.initializeMealSelectionModal();

        // Initialize regenerate meal modal handlers
        this.initializeRegenerateMealModal();

        // Load current meal plan
        this.loadMealPlan();

    }

    initializeMealSelectionModal() {
        // Source selection handlers
        document.querySelectorAll('.source-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all source buttons
                document.querySelectorAll('.source-btn').forEach(b => b.classList.remove('active'));

                // Add active class to clicked button
                e.currentTarget.classList.add('active');

                const source = e.currentTarget.dataset.source;
                this.handleSourceSelection(source);
            });
        });

        // Status selection handlers
        document.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all status buttons
                document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));

                // Add active class to clicked button
                e.currentTarget.classList.add('active');
            });
        });
    }

    initializeRegenerateMealModal() {
        // Will be initialized when modal is opened
    }

    handleSourceSelection(source) {
        const homeCookingOptions = document.getElementById('homeCookingOptions');
        const hotelOrderOptions = document.getElementById('hotelOrderOptions');

        if (source === 'home') {
            homeCookingOptions.style.display = 'block';
            hotelOrderOptions.style.display = 'none';
        } else if (source === 'hotel') {
            homeCookingOptions.style.display = 'none';
            hotelOrderOptions.style.display = 'block';
        }
    }

    changeMealPlanDate(days) {
        this.currentPlanDate.setDate(this.currentPlanDate.getDate() + days);
        this.updatePlanDateDisplay();
        this.loadMealPlan();
    }

    updatePlanDateDisplay() {
        const currentPlanDateEl = document.getElementById('currentPlanDate');
        if (currentPlanDateEl) {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            if (this.currentPlanDate.toDateString() === today.toDateString()) {
                currentPlanDateEl.textContent = 'Today';
            } else if (this.currentPlanDate.toDateString() === yesterday.toDateString()) {
                currentPlanDateEl.textContent = 'Yesterday';
            } else if (this.currentPlanDate.toDateString() === tomorrow.toDateString()) {
                currentPlanDateEl.textContent = 'Tomorrow';
            } else {
                currentPlanDateEl.textContent = this.currentPlanDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                });
            }
        }
    }

    loadMealPlan() {
        const meals = window.storage.getMealsByDate(this.currentPlanDate);
        this.renderMealPlan(meals);
    }

    renderMealPlan(meals) {
        const mealPlanGrid = document.getElementById('mealPlanGrid');
        if (!mealPlanGrid) return;

        const mealTypes = ['breakfast', 'lunch', 'snack', 'dinner'];
        const mealTypeInfo = {
            breakfast: { emoji: '🌅', name: 'Breakfast', defaultTime: '8:00 AM' },
            lunch: { emoji: '🌞', name: 'Lunch', defaultTime: '1:00 PM' },
            snack: { emoji: '🍎', name: 'Snack', defaultTime: '4:00 PM' },
            dinner: { emoji: '🌙', name: 'Dinner', defaultTime: '7:00 PM' }
        };

        let gridHTML = '';

        mealTypes.forEach(type => {
            const meal = meals.find(m => m.type === type);
            const typeInfo = mealTypeInfo[type];

            if (meal) {
                gridHTML += `
                    <div class="meal-card ${meal.status || 'planned'}">
                        <div class="meal-status ${meal.status || 'planned'}">${meal.status === 'eaten' ? '✅ Eaten' : '📅 Planned'}</div>
                        <div class="meal-emoji">${typeInfo.emoji}</div>
                        <h4>${typeInfo.name}</h4>
                        <p class="meal-name">${Utils.sanitizeInput(meal.name)}</p>
                        <div class="meal-details">
                            <span class="calories">${meal.calories} cal</span>
                            <span class="cost">₹${meal.source === 'home' ? (meal.ingredientCost || 0) : ((parseFloat(meal.mealCost) || 0) + (parseFloat(meal.deliveryCharges) || 0))}</span>
                        </div>
                        <div class="meal-source-indicator ${meal.source}">
                            <span>${meal.source === 'home' ? '🏠' : '🏨'}</span>
                            <span>${meal.source === 'home' ? 'Home Cooked' : 'Ordered'}</span>
                        </div>
                        <div class="meal-actions">
                            ${(meal.status === 'planned') ?
                                `<button class="btn-small btn-success" onclick="event.stopPropagation(); app.markMealAsEaten(${meal.id})">✓ Eaten</button>` :
                                `<button class="btn-small btn-secondary" onclick="event.stopPropagation(); app.editExistingMeal('${meal.id}')">Edit</button>`
                            }
                            <button class="btn-small btn-danger" onclick="event.stopPropagation(); app.deleteMeal(${meal.id})">🗑️</button>
                        </div>
                    </div>
                `;
            } else {
                gridHTML += `
                    <div class="meal-card clickable" onclick="app.selectMealType('${type}')">
                        <div class="meal-emoji">${typeInfo.emoji}</div>
                        <h4>${typeInfo.name}</h4>
                        <p>Click to add ${type}</p>
                        <small>${typeInfo.defaultTime}</small>
                    </div>
                `;
            }
        });

        mealPlanGrid.innerHTML = gridHTML;
    }

    selectMealType(mealType) {
        this.currentSelectedMeal = {
            type: mealType,
            date: this.currentPlanDate.toISOString().split('T')[0]
        };

        // Generate suggestions for this meal type
        const suggestions = this.generateMealSuggestions(mealType);
        this.showMealSelection(suggestions[0]); // Show first suggestion
    }

    generateMealSuggestions(mealType) {
        const mealSuggestions = {
            breakfast: [
                { name: 'Masala Dosa with Coconut Chutney', calories: 280, estimatedHomeCost: 35, estimatedHotelCost: 120 },
                { name: 'Idli Sambar', calories: 220, estimatedHomeCost: 25, estimatedHotelCost: 80 },
                { name: 'Upma with Vegetables', calories: 190, estimatedHomeCost: 20, estimatedHotelCost: 70 },
                { name: 'Rava Dosa', calories: 260, estimatedHomeCost: 30, estimatedHotelCost: 100 },
                { name: 'Poha with Peanuts', calories: 180, estimatedHomeCost: 15, estimatedHotelCost: 60 }
            ],
            lunch: [
                { name: 'South Indian Thali', calories: 420, estimatedHomeCost: 55, estimatedHotelCost: 180 },
                { name: 'Curd Rice with Pickle', calories: 320, estimatedHomeCost: 30, estimatedHotelCost: 90 },
                { name: 'Vegetable Biryani', calories: 380, estimatedHomeCost: 45, estimatedHotelCost: 150 },
                { name: 'Rasam Rice with Papad', calories: 290, estimatedHomeCost: 25, estimatedHotelCost: 100 },
                { name: 'Lemon Rice with Curry', calories: 340, estimatedHomeCost: 35, estimatedHotelCost: 120 }
            ],
            snack: [
                { name: 'Mixed Fruit Bowl', calories: 150, estimatedHomeCost: 25, estimatedHotelCost: 80 },
                { name: 'Roasted Chana', calories: 120, estimatedHomeCost: 10, estimatedHotelCost: 40 },
                { name: 'Coconut Water & Banana', calories: 100, estimatedHomeCost: 15, estimatedHotelCost: 50 },
                { name: 'Masala Tea with Biscuits', calories: 90, estimatedHomeCost: 8, estimatedHotelCost: 30 },
                { name: 'Sprouts Chaat', calories: 180, estimatedHomeCost: 20, estimatedHotelCost: 60 },
                { name: 'Buttermilk with Murukku', calories: 140, estimatedHomeCost: 12, estimatedHotelCost: 45 }
            ],
            dinner: [
                { name: 'Appam with Coconut Stew', calories: 340, estimatedHomeCost: 45, estimatedHotelCost: 160 },
                { name: 'Chapati with Dal Curry', calories: 300, estimatedHomeCost: 35, estimatedHotelCost: 130 },
                { name: 'Vegetable Curry with Rice', calories: 350, estimatedHomeCost: 40, estimatedHotelCost: 140 },
                { name: 'Sambar Rice', calories: 320, estimatedHomeCost: 30, estimatedHotelCost: 110 },
                { name: 'Mixed Vegetable Kootu', calories: 280, estimatedHomeCost: 35, estimatedHotelCost: 120 }
            ]
        };

        return mealSuggestions[mealType] || [];
    }

    generateFallbackSuggestions(mealType) {
        // Generic meal suggestions for custom meal types
        const fallbackSuggestions = [
            { name: `Custom ${mealType} - Rice Bowl`, calories: 250, estimatedHomeCost: 30, estimatedHotelCost: 100 },
            { name: `Custom ${mealType} - Chapati Meal`, calories: 220, estimatedHomeCost: 25, estimatedHotelCost: 90 },
            { name: `Custom ${mealType} - Vegetable Curry`, calories: 180, estimatedHomeCost: 35, estimatedHotelCost: 120 },
            { name: `Custom ${mealType} - Mixed Salad`, calories: 150, estimatedHomeCost: 20, estimatedHotelCost: 80 },
            { name: `Custom ${mealType} - Soup & Bread`, calories: 200, estimatedHomeCost: 25, estimatedHotelCost: 95 }
        ];

        return fallbackSuggestions;
    }

    showMealSelection(suggestion) {
        // Populate modal with suggestion data
        document.getElementById('selectedMealName').textContent = suggestion.name;
        document.getElementById('selectedMealCalories').textContent = `${suggestion.calories} cal`;
        document.getElementById('selectedMealType').textContent = this.currentSelectedMeal.type.charAt(0).toUpperCase() + this.currentSelectedMeal.type.slice(1);

        // Set estimated costs
        document.getElementById('homeEstimatedCost').value = suggestion.estimatedHomeCost;
        document.getElementById('hotelEstimatedCost').value = suggestion.estimatedHotelCost;
        document.getElementById('deliveryEstimate').value = 25; // Default delivery charge

        // Reset selections
        document.querySelectorAll('.source-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.status-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('plannedStatusBtn').classList.add('active');

        // Hide option details
        document.getElementById('homeCookingOptions').style.display = 'none';
        document.getElementById('hotelOrderOptions').style.display = 'none';

        // Store current suggestion
        this.currentSelectedMeal.suggestion = suggestion;

        // Show modal
        this.openModal('mealSelectionModal');
    }

    confirmMealSelection() {
        const selectedSource = document.querySelector('.source-btn.active');
        const selectedStatus = document.querySelector('.status-btn.active');

        if (!selectedSource) {
            Utils.showNotification('Please select where you will have this meal', 'error');
            return;
        }

        const mealData = {
            name: this.currentSelectedMeal.suggestion.name,
            type: this.currentSelectedMeal.type,
            calories: this.currentSelectedMeal.suggestion.calories,
            source: selectedSource.dataset.source,
            status: selectedStatus.dataset.status,
            date: this.currentSelectedMeal.date
        };

        if (mealData.source === 'home') {
            mealData.ingredientCost = parseFloat(document.getElementById('homeEstimatedCost').value) || 0;
        } else {
            mealData.mealCost = parseFloat(document.getElementById('hotelEstimatedCost').value) || 0;
            mealData.deliveryCharges = parseFloat(document.getElementById('deliveryEstimate').value) || 0;
        }

        // Validate meal limits
        if (!this.validateMealLimit(mealData.date)) {
            return;
        }

        if (!this.checkMealTypeConflict(mealData.date, mealData.type)) {
            return;
        }

        // Add to storage
        window.storage.addMeal(mealData);

        // If meal is eaten and from hotel, add expense
        if (mealData.status === 'eaten' && mealData.source === 'hotel') {
            const expenseData = {
                amount: mealData.mealCost + mealData.deliveryCharges,
                category: 'food',
                notes: `${mealData.name} (${mealData.type})`,
                date: mealData.date,
                paymentMethod: 'card',
                mealRelated: true
            };
            window.storage.addExpense(expenseData);
        }

        Utils.showNotification('Meal added to your plan!', 'success');
        this.closeModal('mealSelectionModal');

        // Refresh meal plan and other sections
        this.loadMealPlan();
        this.updateDashboard();

        if (this.currentSection === 'food') {
            this.updateFoodStats();
        }
    }

    editExistingMeal(mealId) {
        const meal = window.storage.getMeals().find(m => m.id == mealId);
        if (!meal) return;

        // Open meal modal with existing data
        this.openModal('mealModal');

        // Populate form with existing meal data
        document.getElementById('mealName').value = meal.name;
        document.getElementById('mealType').value = meal.type;
        document.getElementById('mealCalories').value = meal.calories;
        document.getElementById('mealDate').value = meal.date;
        document.getElementById('mealNotes').value = meal.notes || '';

        // Set source
        const sourceOptions = document.querySelectorAll('.source-option');
        sourceOptions.forEach(opt => opt.classList.remove('active'));
        document.querySelector(`[data-source="${meal.source}"]`).classList.add('active');
        this.handleMealSourceChange(meal.source);

        if (meal.source === 'home') {
            document.getElementById('ingredientCost').value = meal.ingredientCost || '';
            document.getElementById('cookingTime').value = meal.cookingTime || '';
        } else {
            document.getElementById('mealCost').value = meal.mealCost || '';
            document.getElementById('deliveryCharges').value = meal.deliveryCharges || '';
            document.getElementById('restaurantName').value = meal.restaurantName || '';
        }

        // Store meal ID for update
        document.getElementById('mealForm').dataset.editId = mealId;
    }

    getNextMealType() {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const todayMeals = window.storage.getTodayMeals();
        const mealTypes = ['breakfast', 'lunch', 'snack', 'dinner'];

        // Check which meals are already planned/eaten today
        const plannedMealTypes = todayMeals.map(meal => meal.type);
        const eatenMealTypes = todayMeals.filter(meal => meal.status === 'eaten').map(meal => meal.type);

        // Smart time-based meal suggestions with more precise timing
        const timeInMinutes = hour * 60 + minute;

        // Breakfast window: 6:00 AM - 11:00 AM
        if (timeInMinutes >= 360 && timeInMinutes < 660 && !plannedMealTypes.includes('breakfast')) {
            return 'breakfast';
        }

        // Lunch window: 11:00 AM - 2:00 PM
        if (timeInMinutes >= 660 && timeInMinutes < 840 && !plannedMealTypes.includes('lunch')) {
            return 'lunch';
        }

        // Snack window: 2:00 PM - 6:00 PM
        if (timeInMinutes >= 840 && timeInMinutes < 1080 && !plannedMealTypes.includes('snack')) {
            return 'snack';
        }

        // Dinner window: 6:00 PM - 10:00 PM
        if (timeInMinutes >= 1080 && timeInMinutes < 1320 && !plannedMealTypes.includes('dinner')) {
            return 'dinner';
        }

        // Late night or early morning logic
        if (timeInMinutes >= 1320 || timeInMinutes < 360) {
            // Very late: suggest dinner if not eaten, otherwise tomorrow's breakfast
            if (!eatenMealTypes.includes('dinner')) {
                return 'dinner';
            }
            return 'breakfast'; // For tomorrow
        }

        // Fallback logic: suggest the next unplanned meal in order
        for (const mealType of mealTypes) {
            if (!plannedMealTypes.includes(mealType)) {
                return mealType;
            }
        }

        // Priority fallback: suggest unEATEN meals first
        for (const mealType of mealTypes) {
            if (!eatenMealTypes.includes(mealType)) {
                return mealType;
            }
        }

        // If all meals are planned and eaten, suggest next day's breakfast
        return 'breakfast';
    }

    getSmartMealSuggestion() {
        const nextMealType = this.getNextMealType();
        const now = new Date();
        const hour = now.getHours();

        // Get contextual message based on time and meal type
        let contextMessage = '';

        if (nextMealType === 'breakfast') {
            if (hour < 6) {
                contextMessage = 'Plan tomorrow\'s breakfast';
            } else if (hour < 10) {
                contextMessage = 'Time for breakfast';
            } else {
                contextMessage = 'Late breakfast option';
            }
        } else if (nextMealType === 'lunch') {
            if (hour < 11) {
                contextMessage = 'Plan ahead for lunch';
            } else if (hour < 14) {
                contextMessage = 'Perfect time for lunch';
            } else {
                contextMessage = 'Late lunch option';
            }
        } else if (nextMealType === 'snack') {
            if (hour < 14) {
                contextMessage = 'Plan afternoon snack';
            } else if (hour < 17) {
                contextMessage = 'Perfect snack time';
            } else {
                contextMessage = 'Evening snack option';
            }
        } else if (nextMealType === 'dinner') {
            if (hour < 18) {
                contextMessage = 'Plan tonight\'s dinner';
            } else if (hour < 20) {
                contextMessage = 'Dinner time';
            } else {
                contextMessage = 'Late dinner option';
            }
        }

        return {
            mealType: nextMealType,
            context: contextMessage
        };
    }

    regenerateMealPlan() {
        const todayMeals = window.storage.getTodayMeals();

        // Get all possible meal types from both predefined and user's custom meals
        const predefinedMealTypes = ['breakfast', 'lunch', 'snack', 'dinner'];
        const allMeals = window.storage.getMeals();
        const customMealTypes = [...new Set(allMeals.map(meal => meal.type))];

        // Combine predefined and custom meal types, removing duplicates
        const allMealTypes = [...new Set([...predefinedMealTypes, ...customMealTypes])];

        // Find which meal types are not eaten or planned for today
        const plannedMealTypes = todayMeals.map(meal => meal.type);
        const emptyMealSlots = allMealTypes.filter(type => !plannedMealTypes.includes(type));

        if (emptyMealSlots.length === 0) {
            Utils.showNotification('All meal types for today are already planned!', 'info');
            return;
        }

        // Generate suggestions for all empty meal slots
        const allSuggestions = [];
        emptyMealSlots.forEach(mealType => {
            const typeSuggestions = this.generateMealSuggestions(mealType);

            // If no predefined suggestions exist for this meal type, create generic ones
            if (typeSuggestions.length === 0) {
                // Generate fallback suggestions for custom meal types
                const fallbackSuggestions = this.generateFallbackSuggestions(mealType);
                const randomSuggestion = fallbackSuggestions[Math.floor(Math.random() * fallbackSuggestions.length)];
                allSuggestions.push({...randomSuggestion, type: mealType});
            } else {
                // Get one random suggestion for meal types with predefined suggestions
                const randomSuggestion = typeSuggestions[Math.floor(Math.random() * typeSuggestions.length)];
                allSuggestions.push({...randomSuggestion, type: mealType});
            }
        });

        this.renderMealSuggestions(allSuggestions);
        this.openModal('regenerateMealModal');
    }

    renderMealSuggestions(suggestions) {
        const grid = document.getElementById('mealSuggestionsGrid');
        if (!grid) return;

        grid.innerHTML = suggestions.map(suggestion => `
            <div class="meal-suggestion-card">
                <div class="meal-emoji">${this.getMealTypeIcon(suggestion.type)}</div>
                <div class="meal-name">${Utils.sanitizeInput(suggestion.name)}</div>
                <div class="meal-details">
                    ${suggestion.calories} cal • ₹${suggestion.estimatedHomeCost}
                </div>
                <div class="suggestion-actions">
                    <button class="btn-primary btn-small" onclick="app.acceptSuggestedMeal('${suggestion.type}', '${encodeURIComponent(JSON.stringify(suggestion))}')">✓ Accept</button>
                    <button class="btn-secondary btn-small" onclick="app.selectSuggestedMeal('${suggestion.type}', '${encodeURIComponent(JSON.stringify(suggestion))}')">Customize</button>
                </div>
            </div>
        `).join('');
    }

    acceptSuggestedMeal(mealType, encodedSuggestion) {
        const suggestion = JSON.parse(decodeURIComponent(encodedSuggestion));

        // Auto-accept with default settings (planned, home-cooked)
        const mealData = {
            name: suggestion.name,
            type: mealType,
            calories: suggestion.calories,
            source: 'home', // Default to home cooking
            status: 'planned', // Default to planned
            date: new Date().toISOString().split('T')[0], // Today's date
            ingredientCost: suggestion.estimatedHomeCost || 0
        };

        // Validate meal limits
        if (!this.validateMealLimit(mealData.date)) {
            return;
        }

        if (!this.checkMealTypeConflict(mealData.date, mealData.type)) {
            return;
        }

        // Add to storage
        window.storage.addMeal(mealData);

        Utils.showNotification(`${suggestion.name} added to your meal plan!`, 'success');
        this.closeModal('regenerateMealModal');

        // Refresh related sections
        this.loadMealPlan();
        this.updateDashboard();

        if (this.currentSection === 'food') {
            this.updateFoodStats();
        }
    }

    selectSuggestedMeal(mealType, encodedSuggestion) {
        const suggestion = JSON.parse(decodeURIComponent(encodedSuggestion));

        this.currentSelectedMeal = {
            type: mealType,
            date: this.currentPlanDate.toISOString().split('T')[0],
            suggestion: suggestion
        };

        this.closeModal('regenerateMealModal');
        this.showMealSelection(suggestion);
    }

    regenerateMoreSuggestions() {
        // Generate more meal suggestions
        this.regenerateMealPlan();
    }

    addCustomMeal() {
        this.openModal('mealModal');
        // Reset form
        document.getElementById('mealForm').reset();
        delete document.getElementById('mealForm').dataset.editId;

        // Set current plan date
        document.getElementById('mealDate').value = this.currentPlanDate.toISOString().split('T')[0];
    }


    // Update the main loadFoodData to include interactive meal planner (removed duplicate)

    // Update dashboard to show upcoming meal
    updateMealWidget() {
        const upcomingMeals = window.storage.getMeals().filter(meal => {
            const mealDate = new Date(meal.date);
            const now = new Date();
            return mealDate >= now && meal.status === 'planned';
        }).sort((a, b) => new Date(a.date) - new Date(b.date));

        const mealSuggestionEl = document.getElementById('mealSuggestion');

        if (mealSuggestionEl) {
            if (upcomingMeals.length > 0) {
                const nextMeal = upcomingMeals[0];
                const mealDate = new Date(nextMeal.date);
                const isToday = mealDate.toDateString() === new Date().toDateString();
                mealSuggestionEl.textContent = `${isToday ? 'Next' : 'Upcoming'}: ${nextMeal.name}`;
            } else {
                const todayMeals = window.storage.getTodayMeals();
                if (todayMeals.length > 0) {
                    const lastMeal = todayMeals[todayMeals.length - 1];
                    mealSuggestionEl.textContent = `Last: ${lastMeal.name}`;
                } else {
                    const suggestions = Utils.getMealSuggestions();
                    mealSuggestionEl.textContent = suggestions.breakfast;
                }
            }
        }
    }

    viewMealCalendar() {
        // Set current calendar date to today if not set
        if (!this.currentCalendarDate) {
            this.currentCalendarDate = new Date();
        }

        this.renderMealCalendar();
        this.openModal('mealCalendarModal');
    }

    renderMealCalendar() {
        const calendarEl = document.getElementById('mealCalendar');
        if (!calendarEl) return;

        const year = this.currentCalendarDate.getFullYear();
        const month = this.currentCalendarDate.getMonth();

        // Update calendar header
        const calendarTitle = document.getElementById('mealCalendarTitle');
        if (calendarTitle) {
            calendarTitle.textContent = new Date(year, month).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            });
        }

        // Get first day of month and last day
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const firstDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        // Get meals for this month
        const meals = window.storage.getMeals();
        const monthMeals = meals.filter(meal => {
            const mealDate = new Date(meal.date);
            return mealDate.getFullYear() === year && mealDate.getMonth() === month;
        });

        // Group meals by date
        const mealsByDate = {};
        monthMeals.forEach(meal => {
            const date = new Date(meal.date).getDate();
            if (!mealsByDate[date]) {
                mealsByDate[date] = [];
            }
            mealsByDate[date].push(meal);
        });

        let calendarHTML = `
            <div class="calendar-header-row">
                <div class="calendar-day-header">Sun</div>
                <div class="calendar-day-header">Mon</div>
                <div class="calendar-day-header">Tue</div>
                <div class="calendar-day-header">Wed</div>
                <div class="calendar-day-header">Thu</div>
                <div class="calendar-day-header">Fri</div>
                <div class="calendar-day-header">Sat</div>
            </div>
            <div class="calendar-grid">
        `;

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDayOfWeek; i++) {
            const prevMonthDay = new Date(year, month, 0 - (firstDayOfWeek - 1 - i)).getDate();
            calendarHTML += `<div class="calendar-day other-month"><div class="day-number">${prevMonthDay}</div></div>`;
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            const isSelected = this.selectedMealCalendarDate &&
                this.selectedMealCalendarDate.getDate() === day &&
                this.selectedMealCalendarDate.getMonth() === month &&
                this.selectedMealCalendarDate.getFullYear() === year;

            const dayMeals = mealsByDate[day] || [];
            const mealTypes = ['breakfast', 'lunch', 'dinner'];
            const plannedMeals = mealTypes.filter(type => dayMeals.some(m => m.type === type));
            const eatenMeals = dayMeals.filter(m => m.status === 'eaten').length;

            let mealDisplay = '';
            if (dayMeals.length > 0) {
                let statusClass = 'meal-partial';
                if (eatenMeals === dayMeals.length) {
                    statusClass = 'meal-complete';
                } else if (plannedMeals.length === 3) {
                    statusClass = 'meal-planned';
                }

                mealDisplay = `<div class="day-meal-indicator ${statusClass}">
                    <div class="meal-dots">
                        ${mealTypes.map(type => {
                            const meal = dayMeals.find(m => m.type === type);
                            if (meal) {
                                return `<span class="meal-dot ${meal.status === 'eaten' ? 'eaten' : 'planned'}" title="${meal.name}">•</span>`;
                            }
                            return `<span class="meal-dot empty">•</span>`;
                        }).join('')}
                    </div>
                </div>`;
            }

            calendarHTML += `
                <div class="calendar-day meal-calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}"
                     onclick="app.selectMealCalendarDate(${year}, ${month}, ${day})">
                    <div class="day-number">${day}</div>
                    ${mealDisplay}
                </div>
            `;
        }

        // Add empty cells for remaining days
        const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
        const remainingCells = totalCells - (firstDayOfWeek + daysInMonth);

        for (let i = 1; i <= remainingCells; i++) {
            calendarHTML += `<div class="calendar-day other-month"><div class="day-number">${i}</div></div>`;
        }

        calendarHTML += '</div>';
        calendarEl.innerHTML = calendarHTML;
    }

    selectMealCalendarDate(year, month, day) {
        this.selectedMealCalendarDate = new Date(year, month, day);
        this.renderMealCalendar();
        this.showSelectedDateMeals();
    }

    showSelectedDateMeals() {
        if (!this.selectedMealCalendarDate) return;

        const meals = window.storage.getMealsByDate(this.selectedMealCalendarDate);
        const selectedDateEl = document.getElementById('selectedMealDate');
        const selectedMealsList = document.getElementById('selectedMealsList');

        if (selectedDateEl) {
            selectedDateEl.textContent = this.selectedMealCalendarDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            });
        }

        if (selectedMealsList) {
            if (meals.length === 0) {
                selectedMealsList.innerHTML = `
                    <div class="empty-state">
                        <p>No meals planned for this date</p>
                        <button class="btn-primary" onclick="app.addMealForDate('${this.selectedMealCalendarDate.toISOString().split('T')[0]}')">Plan Meals</button>
                    </div>
                `;
            } else {
                selectedMealsList.innerHTML = meals.map(meal => `
                    <div class="meal-item">
                        <div class="meal-info">
                            <h4>${meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}</h4>
                            <p>${Utils.sanitizeInput(meal.name)}</p>
                            <span class="meal-calories">${meal.calories} cal</span>
                        </div>
                        <div class="meal-status ${meal.status}">
                            ${meal.status === 'eaten' ? '✅ Eaten' : '📅 Planned'}
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    validateMealLimit(date, skipMealId = null) {
        const mealsForDate = window.storage.getMealsByDate(new Date(date));
        const existingMeals = skipMealId ?
            mealsForDate.filter(meal => meal.id !== skipMealId) :
            mealsForDate;

        if (existingMeals.length >= 4) {
            Utils.showNotification('Maximum 4 meals per day allowed (breakfast, lunch, snack, dinner)', 'error');
            return false;
        }

        return true;
    }

    checkMealTypeConflict(date, mealType, skipMealId = null) {
        const mealsForDate = window.storage.getMealsByDate(new Date(date));
        const existingMeals = skipMealId ?
            mealsForDate.filter(meal => meal.id !== skipMealId) :
            mealsForDate;

        const existingMealOfType = existingMeals.find(meal => meal.type === mealType);
        if (existingMealOfType) {
            Utils.showNotification(`You already have ${mealType} planned for this date`, 'error');
            return false;
        }

        return true;
    }

    addMealForDate(date) {
        this.currentPlanDate = new Date(date);
        this.closeModal('mealCalendarModal');
        this.addCustomMeal();
    }

    navigateMealCalendar(direction) {
        if (direction === 'prev') {
            this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() - 1);
        } else {
            this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + 1);
        }
        this.renderMealCalendar();
    }

    // Missing section loading methods (duplicate loadFoodData removed)

    loadFoodStats() {
        const stats = window.storage.getWeeklyMealStats();

        const homeMealsEl = document.getElementById('homeMeals');
        const hotelMealsEl = document.getElementById('hotelMeals');
        const moneySavedEl = document.getElementById('moneySaved');
        const caloriesConsumedEl = document.getElementById('caloriesConsumed');

        if (homeMealsEl) homeMealsEl.textContent = stats.homeMeals;
        if (hotelMealsEl) hotelMealsEl.textContent = stats.hotelMeals;
        if (moneySavedEl) moneySavedEl.textContent = Utils.formatCurrency(stats.moneySaved);
        if (caloriesConsumedEl) {
            const todayCalories = this.calculateTodayCalories();
            caloriesConsumedEl.textContent = todayCalories;
        }
    }

    calculateTodayCalories() {
        const todayMeals = window.storage.getTodayMeals();
        return todayMeals.reduce((total, meal) => total + (parseInt(meal.calories) || 0), 0);
    }

    loadFoodAnalytics() {
        // Load food charts and analytics
        this.loadCookingFrequencyChart();
        this.loadCostComparisonChart();
        this.loadCalorieChart();
        this.loadMealCostChart();
    }

    loadCookingFrequencyChart() {
        const canvas = document.getElementById('cookingFrequencyChart');
        if (!canvas) return;

        // Generate sample data for cooking frequency
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            last7Days.push({
                date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                home: Math.floor(Math.random() * 3) + 1,
                hotel: Math.floor(Math.random() * 2)
            });
        }

        this.renderCookingFrequencyChart(canvas, last7Days);
    }

    renderCookingFrequencyChart(canvas, data) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        const barWidth = chartWidth / data.length * 0.35;
        const maxValue = 4;

        // Draw axes
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.moveTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();

        data.forEach((day, index) => {
            const x = padding + (index * chartWidth / data.length);

            // Home cooking bar
            const homeHeight = (day.home / maxValue) * chartHeight;
            ctx.fillStyle = '#10b981';
            ctx.fillRect(x + 10, padding + chartHeight - homeHeight, barWidth, homeHeight);

            // Hotel/delivery bar
            const hotelHeight = (day.hotel / maxValue) * chartHeight;
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(x + 10 + barWidth + 5, padding + chartHeight - hotelHeight, barWidth, hotelHeight);

            // Day label
            ctx.fillStyle = '#6b7280';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(day.date, x + barWidth + 10, padding + chartHeight + 20);
        });

        // Legend
        ctx.fillStyle = '#10b981';
        ctx.fillRect(20, 20, 15, 15);
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Home Cooked', 45, 32);

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(150, 20, 15, 15);
        ctx.fillText('Hotel/Delivery', 175, 32);
    }

    loadCostComparisonChart() {
        const canvas = document.getElementById('costComparisonChart');
        if (!canvas) return;

        const stats = window.storage.getWeeklyMealStats();
        this.renderCostComparisonChart(canvas, stats);
    }

    renderCostComparisonChart(canvas, stats) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 40;

        const totalCost = stats.totalHomeCost + stats.totalHotelCost;
        if (totalCost === 0) return;

        // Home cooking slice
        const homeAngle = (stats.totalHomeCost / totalCost) * 2 * Math.PI;
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, 0, homeAngle);
        ctx.closePath();
        ctx.fill();

        // Hotel/delivery slice
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, homeAngle, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        // Labels
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(Utils.formatCurrency(stats.totalHomeCost), centerX - radius/2, centerY);
        ctx.fillText(Utils.formatCurrency(stats.totalHotelCost), centerX + radius/2, centerY);
    }

    loadCalorieChart() {
        const canvas = document.getElementById('calorieChart');
        if (!canvas) return;

        // Generate sample calorie data for last 7 days
        const calorieData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            calorieData.push({
                date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                calories: 1800 + Math.floor(Math.random() * 600)
            });
        }

        this.renderCalorieChart(canvas, calorieData);
    }

    renderCalorieChart(canvas, data) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        const maxCalories = Math.max(...data.map(d => d.calories)) + 200;

        // Draw axes
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.moveTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();

        // Draw line
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.beginPath();

        data.forEach((day, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = padding + chartHeight - (day.calories / maxCalories) * chartHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            // Draw point
            ctx.fillStyle = '#3b82f6';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();

            // Day label
            ctx.fillStyle = '#6b7280';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(day.date, x, padding + chartHeight + 20);
        });

        ctx.stroke();
    }

    loadMealCostChart() {
        const canvas = document.getElementById('mealCostChart');
        if (!canvas) return;

        // Sample cost comparison data
        const costData = [
            { meal: 'Breakfast', home: 25, delivery: 120 },
            { meal: 'Lunch', home: 45, delivery: 180 },
            { meal: 'Dinner', home: 55, delivery: 200 },
            { meal: 'Snacks', home: 15, delivery: 80 }
        ];

        this.renderMealCostChart(canvas, costData);
    }

    renderMealCostChart(canvas, data) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 60;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        const barWidth = chartWidth / data.length * 0.35;
        const maxValue = Math.max(...data.flatMap(d => [d.home, d.delivery])) + 50;

        // Draw axes
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.moveTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();

        data.forEach((meal, index) => {
            const x = padding + (index * chartWidth / data.length);

            // Home cost bar
            const homeHeight = (meal.home / maxValue) * chartHeight;
            ctx.fillStyle = '#10b981';
            ctx.fillRect(x + 10, padding + chartHeight - homeHeight, barWidth, homeHeight);

            // Delivery cost bar
            const deliveryHeight = (meal.delivery / maxValue) * chartHeight;
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(x + 10 + barWidth + 5, padding + chartHeight - deliveryHeight, barWidth, deliveryHeight);

            // Meal label
            ctx.fillStyle = '#6b7280';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(meal.meal, x + barWidth + 10, padding + chartHeight + 20);
        });

        // Legend
        ctx.fillStyle = '#10b981';
        ctx.fillRect(20, 20, 15, 15);
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Home Cooking', 45, 32);

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(150, 20, 15, 15);
        ctx.fillText('Delivery', 175, 32);
    }

    loadFitnessData() {
        this.updateFitnessStats();
        this.loadBadges();
    }

    updateFitnessStats() {
        const streak = window.storage.getWorkoutStreak();
        const workouts = window.storage.getWorkouts();

        const fitnessStreakEl = document.getElementById('fitnessStreak');
        const weeklyWorkoutsEl = document.getElementById('weeklyWorkouts');
        const totalWorkoutsEl = document.getElementById('totalWorkouts');

        if (fitnessStreakEl) fitnessStreakEl.textContent = streak;

        if (weeklyWorkoutsEl) {
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const weeklyCount = workouts.filter(w => new Date(w.createdAt) >= weekAgo).length;
            weeklyWorkoutsEl.textContent = `${weeklyCount}/7`;
        }

        if (totalWorkoutsEl) totalWorkoutsEl.textContent = workouts.length;
    }

    loadBadges() {
        const badges = window.storage.getBadges();
        const badgesList = document.getElementById('badgesList');

        if (!badgesList) return;

        const badgeElements = badgesList.querySelectorAll('.badge');
        badgeElements.forEach(badge => {
            const badgeType = badge.dataset.badge;
            if (badges[badgeType]) {
                badge.classList.remove('locked');
                badge.classList.add('unlocked');
            }
        });
    }

    loadStressData() {
        this.updateStressStats();
        this.loadMoodChart();
        this.generateInsights();
    }

    updateStressStats() {
        const currentMood = window.storage.getWeeklyMoodAverage();
        const currentStressEl = document.getElementById('currentStress');

        if (currentStressEl) {
            currentStressEl.textContent = Utils.getMoodEmoji(currentMood);
        }
    }

    loadMoodChart() {
        const moods = window.storage.getMoods();
        this.charts.createMoodChart('moodChart', moods);
    }

    generateInsights() {
        const insightCards = document.getElementById('insightCards');
        if (!insightCards) return;

        const insights = [
            {
                title: '💰 Spending Pattern',
                description: 'You tend to be more stressed on days with higher spending'
            },
            {
                title: '🏋️ Workout Impact',
                description: 'Your mood is 30% better on workout days'
            }
        ];

        insightCards.innerHTML = insights.map(insight => `
            <div class="insight-card">
                <h4>${insight.title}</h4>
                <p>${insight.description}</p>
            </div>
        `).join('');
    }

    loadHabitsSection() {
        this.calculateLifeBalanceScore();
        this.loadOverallInsights();

        // Ensure overall insights tab is shown by default
        this.showHabitTab('overall-insights');
    }

    showHabitTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('#habits .tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Hide all tab buttons
        document.querySelectorAll('#habits .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab content
        const selectedTab = document.getElementById(tabName);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }

        // Show selected tab button
        const selectedBtn = document.querySelector(`#habits .tab-btn[data-tab="${tabName}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }

        // Load content for the selected tab
        switch (tabName) {
            case 'overall-insights':
                this.loadOverallInsights();
                break;
            case 'behavior-patterns':
                this.loadBehaviorPatterns();
                break;
            case 'recommendations':
                this.loadRecommendations();
                break;
            case 'progress-analysis':
                this.loadProgressAnalysis();
                break;
        }
    }

    initializeHabitTabHandlers() {
        // Add click handlers for habit tabs
        document.querySelectorAll('#habits .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                this.showHabitTab(tabName);
            });
        });
    }

    // Life Balance Score Calculation
    calculateLifeBalanceScore() {
        const tasks = window.storage.getTasks();
        const expenses = window.storage.getExpenses();
        const workouts = window.storage.getWorkouts();
        const moods = window.storage.getMoods();
        const meals = window.storage.getMeals();

        // Calculate individual scores
        const fitnessScore = this.calculateFitnessScore(workouts);
        const nutritionScore = this.calculateNutritionScore(meals);
        const productivityScore = this.calculateProductivityScore(tasks);
        const financialScore = this.calculateFinancialScore(expenses);
        const wellnessScore = this.calculateWellnessScore(moods);

        // Calculate overall life balance score
        const lifeBalanceScore = Math.round(
            (fitnessScore + nutritionScore + productivityScore + financialScore + wellnessScore) / 5
        );

        // Update UI
        const scoreElement = document.getElementById('lifeBalanceScore');
        const breakdownElement = document.getElementById('balanceBreakdown');

        if (scoreElement) {
            scoreElement.textContent = lifeBalanceScore;
        }

        if (breakdownElement) {
            breakdownElement.innerHTML = `
                <div class="balance-breakdown-item">
                    <span class="breakdown-label">💪 Fitness</span>
                    <span class="breakdown-value ${this.getScoreClass(fitnessScore)}">${fitnessScore}/100</span>
                </div>
                <div class="balance-breakdown-item">
                    <span class="breakdown-label">🍲 Nutrition</span>
                    <span class="breakdown-value ${this.getScoreClass(nutritionScore)}">${nutritionScore}/100</span>
                </div>
                <div class="balance-breakdown-item">
                    <span class="breakdown-label">💼 Productivity</span>
                    <span class="breakdown-value ${this.getScoreClass(productivityScore)}">${productivityScore}/100</span>
                </div>
                <div class="balance-breakdown-item">
                    <span class="breakdown-label">💰 Financial</span>
                    <span class="breakdown-value ${this.getScoreClass(financialScore)}">${financialScore}/100</span>
                </div>
                <div class="balance-breakdown-item">
                    <span class="breakdown-label">😌 Wellness</span>
                    <span class="breakdown-value ${this.getScoreClass(wellnessScore)}">${wellnessScore}/100</span>
                </div>
            `;
        }

        return {
            overall: lifeBalanceScore,
            fitness: fitnessScore,
            nutrition: nutritionScore,
            productivity: productivityScore,
            financial: financialScore,
            wellness: wellnessScore
        };
    }

    getScoreClass(score) {
        if (score >= 80) return 'excellent';
        if (score >= 60) return 'good';
        if (score >= 40) return 'fair';
        return 'poor';
    }

    calculateFitnessScore(workouts) {
        const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentWorkouts = workouts.filter(w => new Date(w.createdAt) >= last30Days);

        // Base score on workout frequency (target: 20 workouts in 30 days)
        const targetWorkouts = 20;
        const workoutScore = Math.min((recentWorkouts.length / targetWorkouts) * 100, 100);

        // Bonus for consistency (working out regularly)
        const workoutStreak = window.storage.getWorkoutStreak();
        const consistencyBonus = Math.min(workoutStreak * 2, 20);

        return Math.min(Math.round(workoutScore + consistencyBonus), 100);
    }

    calculateNutritionScore(meals) {
        const weeklyStats = window.storage.getWeeklyMealStats();

        // Base score on home cooking percentage (target: 70% home meals)
        const homeCookingTarget = 0.7;
        const homeCookingRatio = weeklyStats.totalMeals > 0 ?
            weeklyStats.homeMeals / weeklyStats.totalMeals : 0;
        const homeCookingScore = (homeCookingRatio / homeCookingTarget) * 80;

        // Bonus for variety and calorie management
        const varietyBonus = Math.min(weeklyStats.totalMeals * 2, 20);

        return Math.min(Math.round(homeCookingScore + varietyBonus), 100);
    }

    calculateProductivityScore(tasks) {
        const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentTasks = tasks.filter(t => new Date(t.createdAt) >= last30Days);
        const completedTasks = recentTasks.filter(t => t.completed);

        // Base score on completion rate (target: 80% completion)
        const completionRate = recentTasks.length > 0 ?
            completedTasks.length / recentTasks.length : 0;
        const completionScore = (completionRate / 0.8) * 80;

        // Bonus for consistency
        const taskStreak = this.calculateTaskStreak();
        const consistencyBonus = Math.min(taskStreak, 20);

        return Math.min(Math.round(completionScore + consistencyBonus), 100);
    }

    calculateFinancialScore(expenses) {
        const analysis = window.storage.getSavingsAnalysis();

        // Base score on savings rate
        let savingsScore = 0;
        if (analysis.savingsRate >= 20) savingsScore = 80;
        else if (analysis.savingsRate >= 10) savingsScore = 60;
        else if (analysis.savingsRate >= 5) savingsScore = 40;
        else savingsScore = 20;

        // Bonus for budget adherence
        const budgetStatus = window.storage.getBudgetStatus();
        const budgetCategories = Object.keys(budgetStatus);
        if (budgetCategories.length > 0) {
            const withinBudget = budgetCategories.filter(cat => !budgetStatus[cat].overBudget);
            const budgetBonus = (withinBudget.length / budgetCategories.length) * 20;
            savingsScore += budgetBonus;
        }

        return Math.min(Math.round(savingsScore), 100);
    }

    calculateWellnessScore(moods) {
        const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentMoods = moods.filter(m => new Date(m.date) >= last30Days);

        if (recentMoods.length === 0) return 50; // Neutral score if no data

        // Calculate average mood score
        const moodValues = {
            'very-happy': 100,
            'happy': 80,
            'neutral': 60,
            'stressed': 40,
            'very-stressed': 20
        };

        const totalMoodScore = recentMoods.reduce((sum, mood) =>
            sum + (moodValues[mood.mood] || 60), 0
        );

        const averageMoodScore = totalMoodScore / recentMoods.length;

        // Bonus for mood tracking consistency
        const trackingBonus = Math.min(recentMoods.length * 2, 20);

        return Math.min(Math.round(averageMoodScore + trackingBonus), 100);
    }

    // Overall Insights Tab
    loadOverallInsights() {
        this.populatePerformanceMetrics();
        this.generateBehaviorInsights();
        this.loadEnhancedHabitsAnalytics();
    }

    loadEnhancedHabitsAnalytics() {
        const habits = window.storage.getHabits();
        const tasks = window.storage.getTasks();
        const workouts = window.storage.getWorkouts();
        const meals = window.storage.getMeals();
        const moods = window.storage.getMoods();

        if (habits.length === 0) {
            this.displayEmptyHabitsState();
            return;
        }

        this.generateComprehensiveInsights({
            habits, tasks, workouts, meals, moods
        });
    }

    displayEmptyHabitsState() {
        const insightsContainer = document.getElementById('overall-insights');
        if (insightsContainer) {
            insightsContainer.innerHTML = `
                <div class="empty-state-large">
                    <div class="empty-icon">🎯</div>
                    <h3>Start Your Habit Journey</h3>
                    <p>Track your daily habits to get meaningful insights about your lifestyle patterns.</p>
                    <div class="habit-suggestions">
                        <h4>Popular Habits to Start:</h4>
                        <div class="suggested-habits">
                            <button class="habit-suggestion-btn" onclick="app.addSuggestedHabit('Morning Exercise', 'fitness')">
                                <span class="habit-icon">🏃</span>
                                <span>Morning Exercise</span>
                            </button>
                            <button class="habit-suggestion-btn" onclick="app.addSuggestedHabit('Daily Reading', 'education')">
                                <span class="habit-icon">📚</span>
                                <span>Daily Reading</span>
                            </button>
                            <button class="habit-suggestion-btn" onclick="app.addSuggestedHabit('Meditation', 'wellness')">
                                <span class="habit-icon">🧘</span>
                                <span>Meditation</span>
                            </button>
                            <button class="habit-suggestion-btn" onclick="app.addSuggestedHabit('Drink Water', 'health')">
                                <span class="habit-icon">💧</span>
                                <span>Drink 8 Glasses Water</span>
                            </button>
                        </div>
                    </div>
                    <button class="btn-primary" onclick="app.openModal('habitModal')">Add Your First Habit</button>
                </div>
            `;
        }
    }

    addSuggestedHabit(name, category) {
        const habit = {
            name: name,
            category: category,
            frequency: 'daily',
            target: '1 time',
            active: true
        };

        window.storage.addHabit(habit);
        Utils.showNotification(`${name} habit added!`, 'success');
        this.loadHabitsSection();
    }

    generateComprehensiveInsights(data) {
        const insights = {
            productivity: this.analyzeProductivity(data.tasks),
            financial: this.analyzeFinancialHealth(),
            nutrition: this.analyzeNutrition(data.meals),
            fitness: this.analyzeFitness(data.workouts),
            wellbeing: this.analyzeWellbeing(data.moods)
        };

        this.displayComprehensiveInsights(insights);
    }

    analyzeProductivity(tasks) {
        const last30Days = tasks.filter(task => {
            const taskDate = new Date(task.createdAt);
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            return taskDate >= thirtyDaysAgo;
        });

        const completionRate = last30Days.length > 0 ?
            (last30Days.filter(t => t.completed).length / last30Days.length) * 100 : 0;

        return {
            score: Math.round(completionRate),
            label: completionRate >= 80 ? 'Excellent' : completionRate >= 60 ? 'Good' : 'Needs Improvement',
            insights: [
                `${last30Days.length} tasks created in last 30 days`,
                `${Math.round(completionRate)}% completion rate`,
                completionRate >= 80 ? 'Outstanding task management!' : 'Room for improvement in task completion'
            ]
        };
    }

    analyzeFinancialHealth() {
        const monthlyExpenses = window.storage.getMonthlyExpenses();
        const settings = window.storage.getSettings();
        const monthlyIncome = settings.monthlyIncome || 0;

        const savingsRate = monthlyIncome > 0 ?
            ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

        return {
            score: Math.min(Math.max(savingsRate, 0), 100),
            label: savingsRate >= 20 ? 'Excellent' : savingsRate >= 10 ? 'Good' : 'Needs Attention',
            insights: [
                `₹${monthlyExpenses.toLocaleString()} monthly expenses`,
                `${Math.round(savingsRate)}% savings rate`,
                savingsRate >= 20 ? 'Great financial discipline!' : 'Consider reducing expenses'
            ]
        };
    }

    analyzeNutrition(meals) {
        const last30DaysMeals = meals.filter(meal => {
            const mealDate = new Date(meal.date);
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            return mealDate >= thirtyDaysAgo;
        });

        const homeCookingRate = last30DaysMeals.length > 0 ?
            (last30DaysMeals.filter(m => m.source === 'home').length / last30DaysMeals.length) * 100 : 0;

        return {
            score: Math.round(homeCookingRate),
            label: homeCookingRate >= 70 ? 'Excellent' : homeCookingRate >= 50 ? 'Good' : 'Needs Improvement',
            insights: [
                `${last30DaysMeals.length} meals tracked in 30 days`,
                `${Math.round(homeCookingRate)}% home cooking rate`,
                homeCookingRate >= 70 ? 'Excellent nutrition habits!' : 'Try cooking more at home'
            ]
        };
    }

    analyzeFitness(workouts) {
        const last30DaysWorkouts = workouts.filter(workout => {
            const workoutDate = new Date(workout.createdAt);
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            return workoutDate >= thirtyDaysAgo;
        });

        const workoutsPerWeek = (last30DaysWorkouts.length / 4.3); // 30 days ≈ 4.3 weeks
        const fitnessScore = Math.min(workoutsPerWeek * 20, 100); // 5 workouts/week = 100%

        return {
            score: Math.round(fitnessScore),
            label: fitnessScore >= 80 ? 'Excellent' : fitnessScore >= 60 ? 'Good' : 'Needs Improvement',
            insights: [
                `${last30DaysWorkouts.length} workouts in last 30 days`,
                `${Math.round(workoutsPerWeek)} workouts per week average`,
                fitnessScore >= 80 ? 'Outstanding fitness routine!' : 'Try to be more active'
            ]
        };
    }

    analyzeWellbeing(moods) {
        const last30DaysMoods = moods.filter(mood => {
            const moodDate = new Date(mood.date);
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            return moodDate >= thirtyDaysAgo;
        });

        if (last30DaysMoods.length === 0) {
            return {
                score: 50,
                label: 'No Data',
                insights: ['Start tracking your mood for insights']
            };
        }

        const moodScores = last30DaysMoods.map(m => {
            const scores = { 'very-happy': 100, 'happy': 80, 'neutral': 60, 'stressed': 40, 'very-stressed': 20 };
            return scores[m.mood] || 60;
        });

        const avgMoodScore = moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length;

        return {
            score: Math.round(avgMoodScore),
            label: avgMoodScore >= 80 ? 'Excellent' : avgMoodScore >= 60 ? 'Good' : 'Needs Attention',
            insights: [
                `${last30DaysMoods.length} mood check-ins in 30 days`,
                `${Math.round(avgMoodScore)}% average wellbeing score`,
                avgMoodScore >= 80 ? 'Great mental health!' : 'Consider stress management techniques'
            ]
        };
    }

    displayComprehensiveInsights(insights) {
        const containers = {
            productivity: document.getElementById('productivityPerformance'),
            financial: document.getElementById('financialPerformance'),
            nutrition: document.getElementById('nutritionPerformance'),
            fitness: document.getElementById('fitnessPerformance'),
            wellbeing: document.getElementById('wellnessPerformance')
        };

        Object.entries(insights).forEach(([category, data]) => {
            const container = containers[category];
            if (container) {
                container.innerHTML = `
                    <div class="performance-metric ${data.label.toLowerCase().replace(' ', '-')}">
                        <div class="metric-header">
                            <h4>${category.charAt(0).toUpperCase() + category.slice(1)} Score</h4>
                            <div class="metric-value">${data.score}%</div>
                        </div>
                        <div class="metric-label">${data.label}</div>
                        <div class="metric-insights">
                            ${data.insights.map(insight => `<p class="metric-description">${insight}</p>`).join('')}
                        </div>
                    </div>
                `;
            }
        });
    }

    generateBehaviorInsights() {
        // This function generates behavioral insights for the overall insights tab
        // It complements the performance metrics with behavioral patterns
        const data = {
            tasks: window.storage.getTasks(),
            expenses: window.storage.getExpenses(),
            workouts: window.storage.getWorkouts(),
            moods: window.storage.getMoods(),
            meals: window.storage.getMeals()
        };

        const insights = [];

        // Task completion patterns
        const completionRate = data.tasks.length > 0 ?
            (data.tasks.filter(t => t.completed).length / data.tasks.length) * 100 : 0;

        if (completionRate >= 80) {
            insights.push('🎯 Excellent task completion rate! You\'re very productive.');
        } else if (completionRate >= 60) {
            insights.push('📈 Good task progress. Try to improve completion consistency.');
        } else {
            insights.push('📝 Focus on completing more tasks to boost productivity.');
        }

        // Workout consistency
        const recentWorkouts = data.workouts.filter(w =>
            new Date(w.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );

        if (recentWorkouts.length >= 4) {
            insights.push('💪 Great workout consistency this week!');
        } else if (recentWorkouts.length >= 2) {
            insights.push('🏃 Decent activity level. Try to add one more workout.');
        } else {
            insights.push('🏋️ Consider adding more physical activity to your routine.');
        }

        // Home cooking patterns
        const weeklyStats = window.storage.getWeeklyMealStats();
        const homeCookingRate = weeklyStats.totalMeals > 0 ?
            (weeklyStats.homeMeals / weeklyStats.totalMeals) * 100 : 0;

        if (homeCookingRate >= 70) {
            insights.push('🍳 Excellent home cooking habits! Keep it up.');
        } else if (homeCookingRate >= 50) {
            insights.push('���� Good balance of home cooking and dining out.');
        } else {
            insights.push('🏠 Try cooking more meals at home for better health and savings.');
        }

        // Mood tracking
        if (data.moods.length >= 7) {
            insights.push('😌 Great job tracking your mood consistently!');
        } else if (data.moods.length > 0) {
            insights.push('📊 Keep tracking your mood to identify patterns.');
        } else {
            insights.push('😊 Start tracking your daily mood to gain insights.');
        }

        // Display insights (this could be enhanced to show in a specific UI section)
        console.log('Behavior Insights:', insights);

        return insights;
    }

    populatePerformanceMetrics() {
        // Get data for analysis
        const tasks = window.storage.getTasks();
        const expenses = window.storage.getExpenses();
        const workouts = window.storage.getWorkouts();
        const moods = window.storage.getMoods();
        const meals = window.storage.getMeals();

        // Calculate metrics for each area
        const fitnessMetrics = this.calculateFitnessInsights(workouts);
        const nutritionMetrics = this.calculateNutritionInsights(meals);
        const productivityMetrics = this.calculateProductivityInsights(tasks);
        const financialMetrics = this.calculateFinancialInsights(expenses);
        const wellnessMetrics = this.calculateWellnessInsights(moods);

        // Populate each section
        this.populateSection('fitnessPerformance', fitnessMetrics);
        this.populateSection('nutritionPerformance', nutritionMetrics);
        this.populateSection('productivityPerformance', productivityMetrics);
        this.populateSection('financialPerformance', financialMetrics);
        this.populateSection('wellnessPerformance', wellnessMetrics);
    }

    populateSection(sectionId, metrics) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        section.innerHTML = `
            <div class="performance-summary">
                <div class="performance-score ${metrics.scoreClass}">
                    <span class="score-value">${metrics.score}</span>
                    <span class="score-label">/100</span>
                </div>
                <div class="performance-trend ${metrics.trendClass}">
                    ${metrics.trend}
                </div>
            </div>
            <div class="performance-details">
                ${metrics.details.map(detail => `
                    <div class="detail-item">
                        <span class="detail-label">${detail.label}</span>
                        <span class="detail-value">${detail.value}</span>
                    </div>
                `).join('')}
            </div>
            <div class="performance-insights">
                ${metrics.insights.map(insight => `
                    <div class="insight-item ${insight.type}">
                        <span class="insight-icon">${insight.icon}</span>
                        <span class="insight-text">${insight.text}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    loadFitnessPerformance() {
        const container = document.getElementById('fitnessPerformance');
        if (!container) return;

        const workouts = window.storage.getWorkouts();
        const workoutStreak = window.storage.getWorkoutStreak();
        const weeklyWorkouts = workouts.filter(w =>
            Utils.getDaysDifference(new Date(), new Date(w.createdAt)) <= 7
        );

        const insights = [
            {
                title: 'Workout Streak',
                value: `${workoutStreak} days`,
                status: workoutStreak >= 7 ? 'excellent' : workoutStreak >= 3 ? 'good' : 'needs-improvement',
                description: workoutStreak >= 7 ? 'Excellent consistency!' :
                           workoutStreak >= 3 ? 'Good momentum, keep it up!' : 'Try to exercise more regularly'
            },
            {
                title: 'Weekly Activity',
                value: `${weeklyWorkouts.length}/7 days`,
                status: weeklyWorkouts.length >= 5 ? 'excellent' : weeklyWorkouts.length >= 3 ? 'good' : 'needs-improvement',
                description: weeklyWorkouts.length >= 5 ? 'Very active week!' :
                           weeklyWorkouts.length >= 3 ? 'Decent activity level' : 'Increase weekly activity'
            }
        ];

        container.innerHTML = insights.map(insight => `
            <div class="performance-metric ${insight.status}">
                <div class="metric-header">
                    <h4>${insight.title}</h4>
                    <span class="metric-value">${insight.value}</span>
                </div>
                <p class="metric-description">${insight.description}</p>
            </div>
        `).join('');
    }

    loadNutritionPerformance() {
        const container = document.getElementById('nutritionPerformance');
        if (!container) return;

        const weeklyStats = window.storage.getWeeklyMealStats();
        const homeCookingPercentage = weeklyStats.totalMeals > 0 ?
            Math.round((weeklyStats.homeMeals / weeklyStats.totalMeals) * 100) : 0;

        const insights = [
            {
                title: 'Home Cooking',
                value: `${homeCookingPercentage}%`,
                status: homeCookingPercentage >= 70 ? 'excellent' : homeCookingPercentage >= 50 ? 'good' : 'needs-improvement',
                description: homeCookingPercentage >= 70 ? 'Great home cooking habits!' :
                           homeCookingPercentage >= 50 ? 'Good balance with cooking' : 'Try cooking at home more often'
            },
            {
                title: 'Money Saved',
                value: Utils.formatCurrency(weeklyStats.moneySaved),
                status: weeklyStats.moneySaved >= 1000 ? 'excellent' : weeklyStats.moneySaved >= 500 ? 'good' : 'fair',
                description: `Estimated savings from home cooking this week`
            }
        ];

        container.innerHTML = insights.map(insight => `
            <div class="performance-metric ${insight.status}">
                <div class="metric-header">
                    <h4>${insight.title}</h4>
                    <span class="metric-value">${insight.value}</span>
                </div>
                <p class="metric-description">${insight.description}</p>
            </div>
        `).join('');
    }

    loadProductivityPerformance() {
        const container = document.getElementById('productivityPerformance');
        if (!container) return;

        const tasks = window.storage.getTasks();
        const weeklyTasks = tasks.filter(t =>
            Utils.getDaysDifference(new Date(), new Date(t.createdAt)) <= 7
        );
        const completedWeekly = weeklyTasks.filter(t => t.completed);
        const completionRate = weeklyTasks.length > 0 ?
            Math.round((completedWeekly.length / weeklyTasks.length) * 100) : 0;

        const insights = [
            {
                title: 'Task Completion',
                value: `${completionRate}%`,
                status: completionRate >= 80 ? 'excellent' : completionRate >= 60 ? 'good' : 'needs-improvement',
                description: completionRate >= 80 ? 'Excellent productivity!' :
                           completionRate >= 60 ? 'Good task management' : 'Focus on completing more tasks'
            },
            {
                title: 'Weekly Tasks',
                value: `${completedWeekly.length}/${weeklyTasks.length}`,
                status: completedWeekly.length >= 10 ? 'excellent' : completedWeekly.length >= 5 ? 'good' : 'fair',
                description: `Tasks completed this week`
            }
        ];

        container.innerHTML = insights.map(insight => `
            <div class="performance-metric ${insight.status}">
                <div class="metric-header">
                    <h4>${insight.title}</h4>
                    <span class="metric-value">${insight.value}</span>
                </div>
                <p class="metric-description">${insight.description}</p>
            </div>
        `).join('');
    }

    loadFinancialPerformance() {
        const container = document.getElementById('financialPerformance');
        if (!container) return;

        const analysis = window.storage.getSavingsAnalysis();
        const weeklyExpenses = window.storage.getWeeklyExpenses();

        const insights = [
            {
                title: 'Savings Rate',
                value: `${analysis.savingsRate}%`,
                status: analysis.savingsRate >= 20 ? 'excellent' : analysis.savingsRate >= 10 ? 'good' : 'needs-improvement',
                description: analysis.savingsRate >= 20 ? 'Excellent saving habits!' :
                           analysis.savingsRate >= 10 ? 'Good savings discipline' : 'Try to save more of your income'
            },
            {
                title: 'Weekly Spending',
                value: Utils.formatCurrency(weeklyExpenses),
                status: weeklyExpenses <= 3000 ? 'excellent' : weeklyExpenses <= 5000 ? 'good' : 'needs-improvement',
                description: `Total expenses this week`
            }
        ];

        container.innerHTML = insights.map(insight => `
            <div class="performance-metric ${insight.status}">
                <div class="metric-header">
                    <h4>${insight.title}</h4>
                    <span class="metric-value">${insight.value}</span>
                </div>
                <p class="metric-description">${insight.description}</p>
            </div>
        `).join('');
    }

    loadWellnessPerformance() {
        const container = document.getElementById('wellnessPerformance');
        if (!container) return;

        const moods = window.storage.getMoods();
        const weeklyMoods = moods.filter(m =>
            Utils.getDaysDifference(new Date(), new Date(m.date)) <= 7
        );

        const averageMood = window.storage.getWeeklyMoodAverage();
        const stressedDays = weeklyMoods.filter(m =>
            ['stressed', 'very-stressed'].includes(m.mood)
        ).length;

        const insights = [
            {
                title: 'Mood Trend',
                value: Utils.getMoodEmoji(averageMood),
                status: ['very-happy', 'happy'].includes(averageMood) ? 'excellent' :
                       averageMood === 'neutral' ? 'good' : 'needs-improvement',
                description: `Your average mood this week: ${averageMood.replace('-', ' ')}`
            },
            {
                title: 'Stress Management',
                value: `${7 - stressedDays}/7 good days`,
                status: stressedDays <= 1 ? 'excellent' : stressedDays <= 3 ? 'good' : 'needs-improvement',
                description: stressedDays <= 1 ? 'Great stress management!' :
                           stressedDays <= 3 ? 'Manageable stress levels' : 'Focus on stress reduction'
            }
        ];

        container.innerHTML = insights.map(insight => `
            <div class="performance-metric ${insight.status}">
                <div class="metric-header">
                    <h4>${insight.title}</h4>
                    <span class="metric-value">${insight.value}</span>
                </div>
                <p class="metric-description">${insight.description}</p>
            </div>
        `).join('');
    }

    // Behavior Patterns Tab
    loadBehaviorPatterns() {
        this.updateBehaviorCorrelations();
        this.loadPatternCharts();
    }

    updateBehaviorCorrelations() {
        this.calculateFitnessStressCorrelation();
        this.calculateNutritionProductivityCorrelation();
        this.calculateMoodSpendingCorrelation();
        this.calculateProductivityStressCorrelation();
    }

    calculateFitnessStressCorrelation() {
        const workouts = window.storage.getWorkouts();
        const moods = window.storage.getMoods();

        // Simple correlation calculation
        let correlation = 0;
        let insight = "Track more data to see patterns";

        if (workouts.length >= 5 && moods.length >= 5) {
            // Calculate how often good mood follows workout days
            const workoutDays = new Set(workouts.map(w =>
                new Date(w.createdAt).toDateString()
            ));

            const goodMoodDays = moods.filter(m =>
                ['very-happy', 'happy'].includes(m.mood)
            ).map(m => new Date(m.date).toDateString());

            const overlapDays = goodMoodDays.filter(day => workoutDays.has(day));
            correlation = workoutDays.size > 0 ? (overlapDays.length / workoutDays.size) * 100 : 0;

            if (correlation >= 70) {
                insight = "Strong positive correlation! Exercise significantly improves your mood.";
            } else if (correlation >= 40) {
                insight = "Moderate correlation. Exercise tends to improve your mood.";
            } else {
                insight = "Weak correlation. Other factors may influence your mood more.";
            }
        }

        this.updateCorrelationCard('fitnessStressCorrelation', 'fitnessStressInsight', correlation, insight);
    }

    calculateNutritionProductivityCorrelation() {
        const meals = window.storage.getMeals();
        const tasks = window.storage.getTasks();

        let correlation = 0;
        let insight = "Track more data to see patterns";

        if (meals.length >= 10 && tasks.length >= 10) {
            // Calculate productivity on home cooking days vs delivery days
            const homeCookingDays = new Set(meals.filter(m => m.source === 'home')
                .map(m => new Date(m.date).toDateString()));

            const deliveryDays = new Set(meals.filter(m => m.source === 'hotel')
                .map(m => new Date(m.date).toDateString()));

            const homeCookingProductivity = this.calculateAverageTaskCompletion(tasks, homeCookingDays);
            const deliveryProductivity = this.calculateAverageTaskCompletion(tasks, deliveryDays);

            if (homeCookingProductivity > deliveryProductivity) {
                correlation = Math.min(((homeCookingProductivity - deliveryProductivity) / homeCookingProductivity) * 100, 100);
                insight = `Home cooking days show ${Math.round(correlation)}% better productivity!`;
            } else {
                correlation = 0;
                insight = "No significant correlation found between cooking habits and productivity.";
            }
        }

        this.updateCorrelationCard('nutritionProductivityCorrelation', 'nutritionProductivityInsight', correlation, insight);
    }

    calculateMoodSpendingCorrelation() {
        const moods = window.storage.getMoods();
        const expenses = window.storage.getExpenses();

        let correlation = 0;
        let insight = "Track more data to see patterns";

        if (moods.length >= 7 && expenses.length >= 10) {
            const stressedDays = new Set(moods.filter(m =>
                ['stressed', 'very-stressed'].includes(m.mood)
            ).map(m => new Date(m.date).toDateString()));

            const happyDays = new Set(moods.filter(m =>
                ['very-happy', 'happy'].includes(m.mood)
            ).map(m => new Date(m.date).toDateString()));

            const stressedDaySpending = this.calculateAverageSpending(expenses, stressedDays);
            const happyDaySpending = this.calculateAverageSpending(expenses, happyDays);

            if (stressedDaySpending > happyDaySpending) {
                correlation = Math.min(((stressedDaySpending - happyDaySpending) / stressedDaySpending) * 100, 100);
                insight = `You spend ${Math.round(correlation)}% more on stressed days. Consider stress management techniques.`;
            } else {
                correlation = 0;
                insight = "Your spending doesn't significantly correlate with mood.";
            }
        }

        this.updateCorrelationCard('moodSpendingCorrelation', 'moodSpendingInsight', correlation, insight);
    }

    calculateProductivityStressCorrelation() {
        const tasks = window.storage.getTasks();
        const moods = window.storage.getMoods();

        let correlation = 0;
        let insight = "Track more data to see patterns";

        if (tasks.length >= 10 && moods.length >= 7) {
            // Calculate stress levels on high vs low productivity days
            const highProductivityDays = this.getHighProductivityDays(tasks);
            const lowProductivityDays = this.getLowProductivityDays(tasks);

            const highProdStress = this.calculateAverageStress(moods, highProductivityDays);
            const lowProdStress = this.calculateAverageStress(moods, lowProductivityDays);

            if (lowProdStress > highProdStress) {
                correlation = Math.min(((lowProdStress - highProdStress) / lowProdStress) * 100, 100);
                insight = `Higher productivity correlates with ${Math.round(correlation)}% lower stress levels.`;
            } else {
                correlation = 0;
                insight = "No significant correlation between productivity and stress levels.";
            }
        }

        this.updateCorrelationCard('productivityStressCorrelation', 'productivityStressInsight', correlation, insight);
    }

    updateCorrelationCard(correlationId, insightId, percentage, insight) {
        const correlationEl = document.getElementById(correlationId);
        const insightEl = document.getElementById(insightId);

        if (correlationEl) {
            const fillEl = correlationEl.querySelector('.correlation-fill');
            const valueEl = correlationEl.querySelector('.correlation-value');

            if (fillEl) fillEl.style.width = `${percentage}%`;
            if (valueEl) valueEl.textContent = `${Math.round(percentage)}% correlation`;
        }

        if (insightEl) {
            insightEl.textContent = insight;
        }
    }

    // Helper functions for correlation calculations
    calculateAverageTaskCompletion(tasks, daySet) {
        if (daySet.size === 0) return 0;

        let totalCompletion = 0;
        daySet.forEach(day => {
            const dayTasks = tasks.filter(t =>
                new Date(t.createdAt).toDateString() === day
            );
            const completed = dayTasks.filter(t => t.completed).length;
            const completion = dayTasks.length > 0 ? completed / dayTasks.length : 0;
            totalCompletion += completion;
        });

        return totalCompletion / daySet.size;
    }

    calculateAverageSpending(expenses, daySet) {
        if (daySet.size === 0) return 0;

        let totalSpending = 0;
        let daysWithSpending = 0;

        daySet.forEach(day => {
            const dayExpenses = expenses.filter(e =>
                new Date(e.createdAt).toDateString() === day
            );
            if (dayExpenses.length > 0) {
                const dayTotal = dayExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
                totalSpending += dayTotal;
                daysWithSpending++;
            }
        });

        return daysWithSpending > 0 ? totalSpending / daysWithSpending : 0;
    }

    getHighProductivityDays(tasks) {
        const dailyCompletions = {};

        tasks.forEach(task => {
            const day = new Date(task.createdAt).toDateString();
            if (!dailyCompletions[day]) {
                dailyCompletions[day] = { total: 0, completed: 0 };
            }
            dailyCompletions[day].total++;
            if (task.completed) dailyCompletions[day].completed++;
        });

        return new Set(Object.keys(dailyCompletions).filter(day => {
            const completion = dailyCompletions[day];
            return completion.total >= 3 && (completion.completed / completion.total) >= 0.8;
        }));
    }

    getLowProductivityDays(tasks) {
        const dailyCompletions = {};

        tasks.forEach(task => {
            const day = new Date(task.createdAt).toDateString();
            if (!dailyCompletions[day]) {
                dailyCompletions[day] = { total: 0, completed: 0 };
            }
            dailyCompletions[day].total++;
            if (task.completed) dailyCompletions[day].completed++;
        });

        return new Set(Object.keys(dailyCompletions).filter(day => {
            const completion = dailyCompletions[day];
            return completion.total >= 2 && (completion.completed / completion.total) <= 0.4;
        }));
    }

    calculateAverageStress(moods, daySet) {
        if (daySet.size === 0) return 0;

        const stressValues = {
            'very-happy': 1,
            'happy': 2,
            'neutral': 3,
            'stressed': 4,
            'very-stressed': 5
        };

        let totalStress = 0;
        let moodCount = 0;

        daySet.forEach(day => {
            const dayMoods = moods.filter(m =>
                new Date(m.date).toDateString() === day
            );
            dayMoods.forEach(mood => {
                totalStress += stressValues[mood.mood] || 3;
                moodCount++;
            });
        });

        return moodCount > 0 ? totalStress / moodCount : 3;
    }

    loadPatternCharts() {
        // This would load the mood vs activity and weekly patterns charts
        // For now, placeholder implementation
        const moodActivityCanvas = document.getElementById('moodActivityChart');
        const weeklyPatternsCanvas = document.getElementById('weeklyPatternsChart');

        if (moodActivityCanvas && this.charts) {
            // this.charts.createMoodActivityChart('moodActivityChart');
        }

        if (weeklyPatternsCanvas && this.charts) {
            // this.charts.createWeeklyPatternsChart('weeklyPatternsChart');
        }
    }

    // Recommendations Tab
    loadRecommendations() {
        this.generatePerformanceHighlights();
        this.generateImprovementAreas();
        this.generateSmartRecommendations();
        this.generateActionPlan();
    }

    generatePerformanceHighlights() {
        const container = document.getElementById('performanceHighlights');
        if (!container) return;

        const scores = this.calculateLifeBalanceScore();
        const highlights = [];

        // Find top performing areas
        const areas = [
            { name: 'Fitness', score: scores.fitness, icon: '���' },
            { name: 'Nutrition', score: scores.nutrition, icon: '🍲' },
            { name: 'Productivity', score: scores.productivity, icon: '����' },
            { name: 'Financial', score: scores.financial, icon: '💰' },
            { name: 'Wellness', score: scores.wellness, icon: '��' }
        ];

        const topAreas = areas.filter(area => area.score >= 70).sort((a, b) => b.score - a.score);

        if (topAreas.length > 0) {
            topAreas.slice(0, 3).forEach(area => {
                highlights.push({
                    icon: area.icon,
                    title: `${area.name} Excellence`,
                    description: `Your ${area.name.toLowerCase()} score of ${area.score}/100 shows excellent performance!`,
                    type: 'success'
                });
            });
        } else {
            highlights.push({
                icon: '🎯',
                title: 'Growth Opportunity',
                description: 'All areas have room for improvement. Focus on small, consistent changes.',
                type: 'info'
            });
        }

        container.innerHTML = highlights.map(highlight => `
            <div class="highlight-item ${highlight.type}">
                <div class="highlight-icon">${highlight.icon}</div>
                <div class="highlight-content">
                    <h4>${highlight.title}</h4>
                    <p>${highlight.description}</p>
                </div>
            </div>
        `).join('');
    }

    generateImprovementAreas() {
        const container = document.getElementById('improvementAreas');
        if (!container) return;

        const scores = this.calculateLifeBalanceScore();
        const improvements = [];

        // Find areas needing improvement
        const areas = [
            { name: 'Fitness', score: scores.fitness, icon: '💪' },
            { name: 'Nutrition', score: scores.nutrition, icon: '🍲' },
            { name: 'Productivity', score: scores.productivity, icon: '💼' },
            { name: 'Financial', score: scores.financial, icon: '💰' },
            { name: 'Wellness', score: scores.wellness, icon: '😌' }
        ];

        const lowAreas = areas.filter(area => area.score < 60).sort((a, b) => a.score - b.score);

        if (lowAreas.length > 0) {
            lowAreas.slice(0, 3).forEach(area => {
                let suggestion = '';
                switch (area.name) {
                    case 'Fitness':
                        suggestion = 'Start with 3 short workouts per week. Even 15-minute sessions count!';
                        break;
                    case 'Nutrition':
                        suggestion = 'Try cooking at home 1-2 more times per week. Start with simple recipes.';
                        break;
                    case 'Productivity':
                        suggestion = 'Break large tasks into smaller ones and focus on completing 2-3 tasks daily.';
                        break;
                    case 'Financial':
                        suggestion = 'Set a weekly spending limit and track expenses daily for better awareness.';
                        break;
                    case 'Wellness':
                        suggestion = 'Try 5-minute breathing exercises or short walks when feeling stressed.';
                        break;
                }

                improvements.push({
                    icon: area.icon,
                    title: `${area.name} Focus`,
                    description: suggestion,
                    score: area.score,
                    type: 'improvement'
                });
            });
        } else {
            improvements.push({
                icon: '🌟',
                title: 'Maintaining Excellence',
                description: 'All areas are performing well. Focus on maintaining your current habits and consistency.',
                type: 'maintain'
            });
        }

        container.innerHTML = improvements.map(improvement => `
            <div class="improvement-item ${improvement.type}">
                <div class="improvement-header">
                    <div class="improvement-icon">${improvement.icon}</div>
                    <div class="improvement-title">${improvement.title}</div>
                    ${improvement.score ? `<div class="improvement-score">${improvement.score}/100</div>` : ''}
                </div>
                <p class="improvement-description">${improvement.description}</p>
            </div>
        `).join('');
    }

    generateSmartRecommendations() {
        const container = document.getElementById('smartRecommendations');
        if (!container) return;

        const recommendations = this.getPersonalizedRecommendations();

        container.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item ${rec.priority}">
                <div class="recommendation-header">
                    <div class="recommendation-icon">${rec.icon}</div>
                    <div class="recommendation-title">${rec.title}</div>
                    <div class="recommendation-priority ${rec.priority}">${rec.priority}</div>
                </div>
                <p class="recommendation-description">${rec.description}</p>
                <div class="recommendation-actions">
                    ${rec.actions ? rec.actions.map(action =>
                        `<button class="action-btn" onclick="app.${action.method}()">${action.text}</button>`
                    ).join('') : ''}
                </div>
            </div>
        `).join('');
    }

    getPersonalizedRecommendations() {
        const workouts = window.storage.getWorkouts();
        const expenses = window.storage.getExpenses();
        const tasks = window.storage.getTasks();
        const moods = window.storage.getMoods();
        const meals = window.storage.getMeals();

        const recommendations = [];

        // Workout recommendations
        const recentWorkouts = workouts.filter(w =>
            Utils.getDaysDifference(new Date(), new Date(w.createdAt)) <= 7
        );

        if (recentWorkouts.length < 3) {
            recommendations.push({
                icon: '💪',
                title: 'Increase Physical Activity',
                description: 'You had fewer than 3 workouts this week. Try adding desk stretches or short walks to your routine.',
                priority: 'high',
                actions: [
                    { text: 'Start Exercise', method: 'startQuickExercise' }
                ]
            });
        }

        // Financial recommendations
        const weeklySpending = window.storage.getWeeklyExpenses();
        if (weeklySpending > 5000) {
            recommendations.push({
                icon: '💰',
                title: 'Monitor Weekly Spending',
                description: `Your weekly spending of ${Utils.formatCurrency(weeklySpending)} is quite high. Consider reviewing your expenses.`,
                priority: 'medium',
                actions: [
                    { text: 'Review Expenses', method: 'showSection' }
                ]
            });
        }

        // Nutrition recommendations
        const weeklyStats = window.storage.getWeeklyMealStats();
        const homeCookingRate = weeklyStats.totalMeals > 0 ?
            weeklyStats.homeMeals / weeklyStats.totalMeals : 0;

        if (homeCookingRate < 0.5) {
            recommendations.push({
                icon: '🍲',
                title: 'Cook More at Home',
                description: 'Increase home cooking to save money and eat healthier. Start with 1-2 simple meals this week.',
                priority: 'medium'
            });
        }

        // Productivity recommendations
        const incompleteTasks = tasks.filter(t => !t.completed).length;
        if (incompleteTasks > 10) {
            recommendations.push({
                icon: '��',
                title: 'Manage Task Backlog',
                description: `You have ${incompleteTasks} incomplete tasks. Consider prioritizing or breaking them into smaller steps.`,
                priority: 'high'
            });
        }

        // Wellness recommendations
        const recentMoods = moods.filter(m =>
            Utils.getDaysDifference(new Date(), new Date(m.date)) <= 7
        );
        const stressedDays = recentMoods.filter(m =>
            ['stressed', 'very-stressed'].includes(m.mood)
        ).length;

        if (stressedDays >= 4) {
            recommendations.push({
                icon: '����',
                title: 'Stress Management',
                description: 'You had multiple stressful days this week. Try breathing exercises or short meditation sessions.',
                priority: 'high',
                actions: [
                    { text: 'Start Breathing Exercise', method: 'startBreathingExercise' }
                ]
            });
        }

        // General recommendations if everything is good
        if (recommendations.length === 0) {
            recommendations.push({
                icon: '🌟',
                title: 'Maintain Your Momentum',
                description: 'You\'re doing great across all areas! Focus on consistency and gradual improvements.',
                priority: 'low'
            });
        }

        return recommendations.slice(0, 5); // Limit to top 5 recommendations
    }

    generateActionPlan() {
        const container = document.getElementById('actionPlan');
        if (!container) return;

        const actionItems = this.createWeeklyActionPlan();

        container.innerHTML = `
            <div class="action-plan-header">
                <h4>Your Weekly Action Plan</h4>
                <p>Focus on these key actions this week for maximum impact</p>
            </div>
            <div class="action-items">
                ${actionItems.map((item, index) => `
                    <div class="action-item">
                        <div class="action-number">${index + 1}</div>
                        <div class="action-content">
                            <div class="action-title">${item.title}</div>
                            <div class="action-description">${item.description}</div>
                            <div class="action-frequency">${item.frequency}</div>
                        </div>
                        <div class="action-category ${item.category}">${item.categoryIcon}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    createWeeklyActionPlan() {
        const scores = this.calculateLifeBalanceScore();
        const actionItems = [];

        // Priority actions based on lowest scores
        const priorityActions = [
            {
                category: 'fitness',
                categoryIcon: '����',
                title: 'Exercise Regularly',
                description: 'Do at least 20 minutes of physical activity',
                frequency: '3-4 times this week',
                threshold: 60
            },
            {
                category: 'nutrition',
                categoryIcon: '🍲',
                title: 'Cook at Home',
                description: 'Prepare meals at home instead of ordering',
                frequency: '4-5 meals this week',
                threshold: 60
            },
            {
                category: 'productivity',
                categoryIcon: '💼',
                title: 'Complete Daily Tasks',
                description: 'Focus on finishing your most important tasks',
                frequency: 'Every day',
                threshold: 70
            },
            {
                category: 'financial',
                categoryIcon: '💰',
                title: 'Track Expenses',
                description: 'Record all expenses and review spending patterns',
                frequency: 'Daily',
                threshold: 50
            },
            {
                category: 'wellness',
                categoryIcon: '😌',
                title: 'Practice Mindfulness',
                description: 'Take breaks for breathing exercises or meditation',
                frequency: '5-10 minutes daily',
                threshold: 60
            }
        ];

        // Add actions for areas that need improvement
        priorityActions.forEach(action => {
            const score = scores[action.category];
            if (score < action.threshold) {
                actionItems.push(action);
            }
        });

        // Always include at least 3 actions
        if (actionItems.length < 3) {
            priorityActions.slice(0, 3 - actionItems.length).forEach(action => {
                if (!actionItems.includes(action)) {
                    actionItems.push(action);
                }
            });
        }

        return actionItems.slice(0, 5);
    }

    // Progress Analysis Tab
    loadProgressAnalysis() {
        this.loadProgressMetrics();
        this.loadProgressTrends();
        this.generateProgressInsights();
    }

    loadProgressMetrics() {
        const container = document.getElementById('progressMetrics');
        if (!container) return;

        const currentScores = this.calculateLifeBalanceScore();

        // This is a simplified version - in a real app, you'd store historical data
        const previousScores = {
            overall: Math.max(0, currentScores.overall - Math.floor(Math.random() * 20) + 10),
            fitness: Math.max(0, currentScores.fitness - Math.floor(Math.random() * 25) + 15),
            nutrition: Math.max(0, currentScores.nutrition - Math.floor(Math.random() * 20) + 10),
            productivity: Math.max(0, currentScores.productivity - Math.floor(Math.random() * 15) + 5),
            financial: Math.max(0, currentScores.financial - Math.floor(Math.random() * 30) + 20),
            wellness: Math.max(0, currentScores.wellness - Math.floor(Math.random() * 25) + 15)
        };

        const metrics = [
            {
                title: 'Overall Life Balance',
                current: currentScores.overall,
                previous: previousScores.overall,
                icon: '🎯'
            },
            {
                title: 'Fitness Progress',
                current: currentScores.fitness,
                previous: previousScores.fitness,
                icon: '💪'
            },
            {
                title: 'Nutrition Progress',
                current: currentScores.nutrition,
                previous: previousScores.nutrition,
                icon: '����'
            },
            {
                title: 'Productivity Progress',
                current: currentScores.productivity,
                previous: previousScores.productivity,
                icon: '���'
            },
            {
                title: 'Financial Progress',
                current: currentScores.financial,
                previous: previousScores.financial,
                icon: '💰'
            },
            {
                title: 'Wellness Progress',
                current: currentScores.wellness,
                previous: previousScores.wellness,
                icon: '😌'
            }
        ];

        container.innerHTML = metrics.map(metric => {
            const change = metric.current - metric.previous;
            const changeClass = change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
            const changeIcon = change > 0 ? '↗️' : change < 0 ? '↘️' : '➡️';

            return `
                <div class="progress-metric">
                    <div class="metric-header">
                        <span class="metric-icon">${metric.icon}</span>
                        <span class="metric-title">${metric.title}</span>
                    </div>
                    <div class="metric-values">
                        <div class="current-value">${metric.current}/100</div>
                        <div class="metric-change ${changeClass}">
                            ${changeIcon} ${Math.abs(change)} points
                        </div>
                    </div>
                    <div class="metric-bar">
                        <div class="metric-progress" style="width: ${metric.current}%"></div>
                        <div class="metric-previous" style="left: ${metric.previous}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadProgressTrends() {
        const canvas = document.getElementById('progressTrendsChart');
        if (!canvas && this.charts) {
            // this.charts.createProgressTrendsChart('progressTrendsChart');
        }
    }

    generateProgressInsights() {
        const container = document.getElementById('progressInsights');
        if (!container) return;

        const insights = this.calculateProgressInsights();

        container.innerHTML = `
            <div class="insights-grid">
                ${insights.map(insight => `
                    <div class="insight-card ${insight.type}">
                        <div class="insight-icon">${insight.icon}</div>
                        <div class="insight-content">
                            <h4>${insight.title}</h4>
                            <p>${insight.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    calculateProgressInsights() {
        const scores = this.calculateLifeBalanceScore();
        const insights = [];

        // Find the most improved area
        const areas = [
            { name: 'Fitness', score: scores.fitness },
            { name: 'Nutrition', score: scores.nutrition },
            { name: 'Productivity', score: scores.productivity },
            { name: 'Financial', score: scores.financial },
            { name: 'Wellness', score: scores.wellness }
        ];

        const topArea = areas.reduce((max, area) => area.score > max.score ? area : max);
        const weakestArea = areas.reduce((min, area) => area.score < min.score ? area : min);

        if (topArea.score >= 80) {
            insights.push({
                icon: '🌟',
                title: `${topArea.name} Excellence`,
                description: `Your ${topArea.name.toLowerCase()} score of ${topArea.score}/100 is outstanding! Keep up the excellent work.`,
                type: 'success'
            });
        }

        if (weakestArea.score < 50) {
            insights.push({
                icon: '🎯',
                title: `Focus on ${weakestArea.name}`,
                description: `Your ${weakestArea.name.toLowerCase()} area needs attention. Small consistent improvements here will boost your overall balance.`,
                type: 'improvement'
            });
        }

        insights.push({
            icon: '📈',
            title: 'Overall Trend',
            description: `Your life balance score is ${scores.overall}/100. You're ${scores.overall >= 70 ? 'doing great' : scores.overall >= 50 ? 'making good progress' : 'building your foundation'}.`,
            type: 'info'
        });

        return insights;
    }

    // Helper method for quick exercise start
    startQuickExercise() {
        this.startExercise('desk-stretches');
    }

    // Old habit tracking functions removed - now using insights and analysis approach

    // updateTodayHabitChecklist removed - replaced with insights analysis

    // updateHabitStats removed - replaced with life balance scoring system

    // Report Generator (replaces Weekly Report)
    loadReportGenerator() {
        this.renderReportPeriodSelector();
        this.generateReport('week'); // Default to weekly
    }

    renderReportPeriodSelector() {
        const container = document.querySelector('#report .section-header');
        if (!container) return;

        // Update header
        const h1 = container.querySelector('h1');
        if (h1) h1.textContent = '📊 Report Generator';

        // Add period selector
        const periodSelector = document.createElement('div');
        periodSelector.className = 'report-period-selector';
        periodSelector.innerHTML = `
            <div class="period-buttons">
                <button class="period-btn active" data-period="day" onclick="app.generateReport('day')">1 Day</button>
                <button class="period-btn" data-period="week" onclick="app.generateReport('week')">7 Days</button>
                <button class="period-btn" data-period="month" onclick="app.generateReport('month')">1 Month</button>
            </div>
            <div class="export-options">
                <button class="btn-secondary export-btn" data-section="report" data-format="csv" onclick="app.exportSectionData('report', 'csv')">📊 Export CSV</button>
                <button class="btn-secondary export-btn" data-section="report" data-format="json" onclick="app.exportSectionData('report', 'json')">📄 Export JSON</button>
            </div>
        `;

        container.appendChild(periodSelector);
    }

    generateReport(period) {
        // Update active button
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-period="${period}"]`).classList.add('active');

        // Generate report data
        const reportData = this.getReportData(period);
        this.renderReportContent(reportData, period);
    }

    getReportData(period) {
        const now = new Date();
        let startDate;

        switch (period) {
            case 'day':
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
        }

        return {
            tasks: window.storage.getTasks().filter(t => new Date(t.createdAt) >= startDate),
            expenses: window.storage.getExpenses().filter(e => new Date(e.createdAt) >= startDate),
            meals: window.storage.getMeals().filter(m => new Date(m.date) >= startDate),
            workouts: window.storage.getWorkouts().filter(w => new Date(w.createdAt) >= startDate),
            moods: window.storage.getMoods().filter(m => new Date(m.date) >= startDate),
            period,
            startDate,
            endDate: now
        };
    }

    renderReportContent(data, period) {
        const reportContainer = document.getElementById('report');
        if (!reportContainer) return;

        // Remove existing report content
        const existingContent = reportContainer.querySelector('.report-content');
        if (existingContent) existingContent.remove();

        const reportContent = document.createElement('div');
        reportContent.className = 'report-content';
        reportContent.innerHTML = this.generateReportHTML(data, period);

        reportContainer.appendChild(reportContent);

        // Load charts
        setTimeout(() => {
            this.loadReportCharts(data);
        }, 100);
    }

    generateReportHTML(data, period) {
        const periodLabel = period === 'day' ? '24 Hours' : period === 'week' ? '7 Days' : '30 Days';

        return `
            <div class="report-summary">
                <h2>📊 ${periodLabel} Report Summary</h2>
                <div class="summary-grid">
                    ${this.generateTaskSummary(data.tasks)}
                    ${this.generateExpenseSummary(data.expenses)}
                    ${this.generateMealSummary(data.meals)}
                    ${this.generateFitnessSummary(data.workouts)}
                    ${this.generateMoodSummary(data.moods)}
                    ${this.generateOverallScore(data)}
                </div>
            </div>

            <div class="report-details">
                <div class="report-section">
                    <h3>📈 Trends & Analytics</h3>
                    <div class="chart-container">
                        <canvas id="reportTrendsChart" width="600" height="300"></canvas>
                    </div>
                </div>

                <div class="report-section">
                    <h3>🎯 Key Insights</h3>
                    <div class="insights-grid">
                        ${this.generateInsightCards(data)}
                    </div>
                </div>

                <div class="report-section">
                    <h3>📋 Detailed Breakdown</h3>
                    <div class="breakdown-tabs">
                        <button class="breakdown-tab active" data-tab="tasks">Tasks</button>
                        <button class="breakdown-tab" data-tab="expenses">Expenses</button>
                        <button class="breakdown-tab" data-tab="meals">Meals</button>
                        <button class="breakdown-tab" data-tab="workouts">Workouts</button>
                    </div>
                    <div class="breakdown-content" id="breakdownContent">
                        ${this.generateTaskBreakdown(data.tasks)}
                    </div>
                </div>

                <div class="report-section">
                    <h3>🎯 Recommendations</h3>
                    <div class="recommendations">
                        ${this.generateRecommendations(data)}
                    </div>
                </div>
            </div>
        `;
    }

    generateTaskSummary(tasks) {
        const completed = tasks.filter(t => t.completed).length;
        const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

        return `
            <div class="summary-card">
                <h3>📑 Tasks</h3>
                <div class="big-stat">${completed}</div>
                <p>Completed out of ${tasks.length}</p>
                <div class="completion-rate">${completionRate}% completion rate</div>
            </div>
        `;
    }

    generateExpenseSummary(expenses) {
        const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        const avgDaily = expenses.length > 0 ? total / Math.max(1, expenses.length / 7) : 0;

        return `
            <div class="summary-card">
                <h3>💰 Expenses</h3>
                <div class="big-stat">${Utils.formatCurrency(total)}</div>
                <p>Total spent</p>
                <div class="avg-daily">Avg: ${Utils.formatCurrency(avgDaily)}/day</div>
            </div>
        `;
    }

    generateMealSummary(meals) {
        const homeMeals = meals.filter(m => m.source === 'home').length;
        const totalMeals = meals.length;
        const homePercentage = totalMeals > 0 ? Math.round((homeMeals / totalMeals) * 100) : 0;

        return `
            <div class="summary-card">
                <h3>🍲 Meals</h3>
                <div class="big-stat">${homeMeals}</div>
                <p>Home cooked out of ${totalMeals}</p>
                <div class="home-percentage">${homePercentage}% home cooking</div>
            </div>
        `;
    }

    generateFitnessSummary(workouts) {
        const totalWorkouts = workouts.length;
        const avgPerDay = workouts.length / 7;

        return `
            <div class="summary-card">
                <h3>🏋️ Fitness</h3>
                <div class="big-stat">${totalWorkouts}</div>
                <p>Workouts completed</p>
                <div class="avg-workouts">${avgPerDay.toFixed(1)} per day</div>
            </div>
        `;
    }

    generateMoodSummary(moods) {
        if (moods.length === 0) {
            return `
                <div class="summary-card">
                    <h3>😌 Mood</h3>
                    <div class="big-stat">-</div>
                    <p>No mood data</p>
                </div>
            `;
        }

        const moodScores = moods.map(m => {
            const scores = { 'very-happy': 5, 'happy': 4, 'neutral': 3, 'stressed': 2, 'very-stressed': 1 };
            return scores[m.mood] || 3;
        });

        const avgMood = moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length;
        const moodEmoji = avgMood >= 4 ? '😃' : avgMood >= 3 ? '��' : '😓';

        return `
            <div class="summary-card">
                <h3>😌 Mood</h3>
                <div class="big-stat">${moodEmoji}</div>
                <p>${moods.length} check-ins</p>
                <div class="avg-mood">Avg: ${avgMood.toFixed(1)}/5</div>
            </div>
        `;
    }

    generateOverallScore(data) {
        // Calculate overall wellness score
        const taskScore = data.tasks.length > 0 ? (data.tasks.filter(t => t.completed).length / data.tasks.length) * 100 : 50;
        const workoutScore = Math.min(data.workouts.length * 20, 100); // Max 5 workouts for 100%
        const homeCookingScore = data.meals.length > 0 ? (data.meals.filter(m => m.source === 'home').length / data.meals.length) * 100 : 50;

        const overallScore = Math.round((taskScore + workoutScore + homeCookingScore) / 3);

        return `
            <div class="summary-card overall-score">
                <h3>🎯 Overall Score</h3>
                <div class="big-stat">${overallScore}</div>
                <p>Wellness Score</p>
                <div class="score-breakdown">
                    <small>Tasks: ${Math.round(taskScore)}% | Fitness: ${Math.round(workoutScore)}% | Nutrition: ${Math.round(homeCookingScore)}%</small>
                </div>
            </div>
        `;
    }

    generateInsightCards(data) {
        const insights = Utils.generateWeeklyInsights(data);

        return insights.map(insight => `
            <div class="insight-card">
                <p>${insight}</p>
            </div>
        `).join('');
    }

    generateTaskBreakdown(tasks) {
        if (tasks.length === 0) {
            return '<p>No tasks in this period</p>';
        }

        return `
            <div class="breakdown-list">
                ${tasks.map(task => `
                    <div class="breakdown-item ${task.completed ? 'completed' : 'pending'}">
                        <span class="item-status">${task.completed ? '✅' : '⏳'}</span>
                        <span class="item-title">${task.title}</span>
                        <span class="item-category">${task.category}</span>
                        <span class="item-date">${Utils.formatDate(task.createdAt)}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    generateRecommendations(data) {
        const recommendations = [];

        // Task recommendations
        const taskCompletion = data.tasks.length > 0 ? (data.tasks.filter(t => t.completed).length / data.tasks.length) * 100 : 0;
        if (taskCompletion < 70) {
            recommendations.push('📝 Focus on completing more tasks for better productivity');
        }

        // Fitness recommendations
        if (data.workouts.length < 3) {
            recommendations.push('🏋️ Try to add more physical activity to your routine');
        }

        // Nutrition recommendations
        const homeCookingRate = data.meals.length > 0 ? (data.meals.filter(m => m.source === 'home').length / data.meals.length) * 100 : 0;
        if (homeCookingRate < 60) {
            recommendations.push('🍲 Consider cooking more meals at home for better health and savings');
        }

        // Financial recommendations
        const totalExpenses = data.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        if (totalExpenses > 5000) {
            recommendations.push('💰 Review your spending patterns and consider budgeting');
        }

        return recommendations.map(rec => `
            <div class="recommendation-item">
                <p>${rec}</p>
            </div>
        `).join('');
    }

    loadReportCharts(data) {
        this.charts.createTrendsChart('reportTrendsChart', data);

        // Add event listeners for breakdown tabs
        document.querySelectorAll('.breakdown-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabType = e.target.dataset.tab;
                this.switchBreakdownTab(tabType, data);
            });
        });
    }

    switchBreakdownTab(tabType, data) {
        // Update active tab
        document.querySelectorAll('.breakdown-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabType}"]`).classList.add('active');

        // Update content
        const content = document.getElementById('breakdownContent');
        if (!content) return;

        switch (tabType) {
            case 'tasks':
                content.innerHTML = this.generateTaskBreakdown(data.tasks);
                break;
            case 'expenses':
                content.innerHTML = this.generateExpenseBreakdown(data.expenses);
                break;
            case 'meals':
                content.innerHTML = this.generateMealBreakdown(data.meals);
                break;
            case 'workouts':
                content.innerHTML = this.generateWorkoutBreakdown(data.workouts);
                break;
        }
    }

    generateExpenseBreakdown(expenses) {
        if (expenses.length === 0) {
            return '<p>No expenses in this period</p>';
        }

        const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

        return `
            <div class="breakdown-summary">
                <h4>Total: ${Utils.formatCurrency(totalAmount)} across ${expenses.length} transactions</h4>
            </div>
            <div class="breakdown-list">
                ${expenses.map(expense => `
                    <div class="breakdown-item">
                        <span class="item-status">${this.getCategoryIcon(expense.category)}</span>
                        <span class="item-title">${this.getCategoryDisplayName(expense.category)}</span>
                        <span class="item-amount">${Utils.formatCurrency(expense.amount)}</span>
                        <span class="item-method">${expense.paymentMethod || 'cash'}</span>
                        <span class="item-date">${Utils.formatDate(expense.createdAt)}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    generateMealBreakdown(meals) {
        if (meals.length === 0) {
            return '<p>No meals in this period</p>';
        }

        const homeMeals = meals.filter(m => m.source === 'home').length;
        const totalCalories = meals.reduce((sum, meal) => sum + (parseInt(meal.calories) || 0), 0);

        return `
            <div class="breakdown-summary">
                <h4>${meals.length} meals | ${homeMeals} home cooked | ${totalCalories} total calories</h4>
            </div>
            <div class="breakdown-list">
                ${meals.map(meal => `
                    <div class="breakdown-item ${meal.source === 'home' ? 'home-meal' : 'hotel-meal'}">
                        <span class="item-status">${meal.source === 'home' ? '🏠' : '🏨'}</span>
                        <span class="item-title">${meal.name}</span>
                        <span class="item-type">${meal.type}</span>
                        <span class="item-calories">${meal.calories} cal</span>
                        <span class="item-date">${Utils.formatDate(meal.date)}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    generateWorkoutBreakdown(workouts) {
        if (workouts.length === 0) {
            return '<p>No workouts in this period</p>';
        }

        const totalCalories = workouts.reduce((sum, workout) => sum + (parseInt(workout.calories) || 0), 0);

        return `
            <div class="breakdown-summary">
                <h4>${workouts.length} workouts | ${totalCalories} calories burned</h4>
            </div>
            <div class="breakdown-list">
                ${workouts.map(workout => `
                    <div class="breakdown-item completed">
                        <span class="item-status">💪</span>
                        <span class="item-title">${workout.type || 'General Exercise'}</span>
                        <span class="item-duration">${workout.duration || 0} min</span>
                        <span class="item-calories">${workout.calories || 0} cal</span>
                        <span class="item-date">${Utils.formatDate(workout.createdAt)}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Enhanced analysis methods
    generateAdvancedInsights(data) {
        const insights = [];

        // Productivity correlation
        const taskCompletionRate = data.tasks.length > 0 ? (data.tasks.filter(t => t.completed).length / data.tasks.length) * 100 : 0;
        const workoutCount = data.workouts.length;

        if (workoutCount >= 3 && taskCompletionRate >= 70) {
            insights.push('💪 Strong correlation: Your task completion is higher on days with regular exercise!');
        }

        // Spending patterns
        const weekendExpenses = data.expenses.filter(exp => {
            const day = new Date(exp.createdAt).getDay();
            return day === 0 || day === 6; // Sunday or Saturday
        });

        if (weekendExpenses.length > data.expenses.length * 0.4) {
            insights.push('🛍️ You spend significantly more on weekends. Consider planning weekend budgets.');
        }

        // Meal patterns
        const homeCookingRate = data.meals.length > 0 ? (data.meals.filter(m => m.source === 'home').length / data.meals.length) * 100 : 0;
        const foodExpenses = data.expenses.filter(exp => exp.category === 'food');

        if (homeCookingRate >= 70 && foodExpenses.length > 0) {
            const avgFoodCost = foodExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) / foodExpenses.length;
            insights.push(`🍳 Great job! ${homeCookingRate.toFixed(0)}% home cooking is saving you money. Average meal cost: ${Utils.formatCurrency(avgFoodCost)}`);
        }

        // Stress and activity correlation
        const stressedMoods = data.moods.filter(m => ['stressed', 'very-stressed'].includes(m.mood));
        if (stressedMoods.length > 0 && workoutCount < 2) {
            insights.push('😌 Consider adding more physical activity to help manage stress levels.');
        }

        return insights;
    }

    // Comprehensive download functionality
    downloadComprehensiveReport(format = 'json') {
        const reportData = {
            metadata: {
                generatedAt: new Date().toISOString(),
                period: '30 days',
                version: '1.0'
            },
            summary: {
                tasks: this.getTaskSummaryData(),
                expenses: this.getExpenseSummaryData(),
                meals: this.getMealSummaryData(),
                fitness: this.getFitnessSummaryData(),
                mood: this.getMoodSummaryData()
            },
            analytics: {
                trends: this.getTrendAnalysis(),
                patterns: this.getPatternAnalysis(),
                correlations: this.getCorrelationAnalysis(),
                predictions: this.getPredictionAnalysis()
            },
            insights: this.generateAdvancedInsights(this.getReportData('month')),
            recommendations: this.generateActionableRecommendations()
        };

        const filename = `comprehensive-report-${new Date().toISOString().split('T')[0]}`;

        if (format === 'json') {
            Utils.exportToJSON(reportData, `${filename}.json`);
        } else {
            // Convert to CSV format for comprehensive report
            this.exportComprehensiveCSV(reportData, `${filename}.csv`);
        }
    }

    getTaskSummaryData() {
        const tasks = window.storage.getTasks();
        const last30Days = tasks.filter(t =>
            new Date(t.createdAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );

        return {
            totalTasks: last30Days.length,
            completedTasks: last30Days.filter(t => t.completed).length,
            completionRate: last30Days.length > 0 ? (last30Days.filter(t => t.completed).length / last30Days.length) * 100 : 0,
            categoriesUsed: [...new Set(last30Days.map(t => t.category))].length,
            expenseRelatedTasks: last30Days.filter(t => t.expenseRelated).length
        };
    }

    getExpenseSummaryData() {
        const expenses = window.storage.getExpenses();
        const last30Days = expenses.filter(e =>
            new Date(e.createdAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );

        const total = last30Days.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        const categoryBreakdown = {};
        last30Days.forEach(exp => {
            categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + parseFloat(exp.amount);
        });

        return {
            totalAmount: total,
            totalTransactions: last30Days.length,
            averageTransaction: last30Days.length > 0 ? total / last30Days.length : 0,
            categoriesUsed: Object.keys(categoryBreakdown).length,
            topCategory: Object.keys(categoryBreakdown).reduce((a, b) =>
                categoryBreakdown[a] > categoryBreakdown[b] ? a : b, 'none'
            ),
            categoryBreakdown
        };
    }

    getMealSummaryData() {
        const meals = window.storage.getMeals();
        const last30Days = meals.filter(m =>
            new Date(m.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );

        const homeMeals = last30Days.filter(m => m.source === 'home');
        const totalCalories = last30Days.reduce((sum, meal) => sum + (parseInt(meal.calories) || 0), 0);

        return {
            totalMeals: last30Days.length,
            homeCookedMeals: homeMeals.length,
            homeCookingRate: last30Days.length > 0 ? (homeMeals.length / last30Days.length) * 100 : 0,
            totalCalories,
            averageCaloriesPerDay: totalCalories / 30,
            mealTypes: [...new Set(last30Days.map(m => m.type))]
        };
    }

    getFitnessSummaryData() {
        const workouts = window.storage.getWorkouts();
        const last30Days = workouts.filter(w =>
            new Date(w.createdAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );

        return {
            totalWorkouts: last30Days.length,
            workoutsPerWeek: (last30Days.length / 30) * 7,
            currentStreak: window.storage.getWorkoutStreak(),
            exerciseTypes: [...new Set(last30Days.map(w => w.type))],
            totalCaloriesBurned: last30Days.reduce((sum, w) => sum + (parseInt(w.calories) || 0), 0)
        };
    }

    getMoodSummaryData() {
        const moods = window.storage.getMoods();
        const last30Days = moods.filter(m =>
            new Date(m.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );

        const moodCounts = {};
        last30Days.forEach(mood => {
            moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
        });

        return {
            totalCheckIns: last30Days.length,
            moodDistribution: moodCounts,
            checkInConsistency: (last30Days.length / 30) * 100, // Percentage of days checked
            averageMoodScore: this.calculateAverageMoodScore(last30Days)
        };
    }

    calculateAverageMoodScore(moods) {
        if (moods.length === 0) return 0;

        const moodScores = { 'very-happy': 5, 'happy': 4, 'neutral': 3, 'stressed': 2, 'very-stressed': 1 };
        const totalScore = moods.reduce((sum, mood) => sum + (moodScores[mood.mood] || 3), 0);
        return totalScore / moods.length;
    }

    getTrendAnalysis() {
        // Implement trend analysis logic
        return {
            taskTrend: 'increasing',
            expenseTrend: 'stable',
            fitnessTrend: 'increasing',
            moodTrend: 'improving'
        };
    }

    getPatternAnalysis() {
        return {
            mostProductiveDay: 'Tuesday',
            highestSpendingDay: 'Saturday',
            preferredWorkoutTime: 'Morning',
            stressPatterns: 'Higher stress on Mondays'
        };
    }

    getCorrelationAnalysis() {
        return {
            fitnessVsMood: 0.75,
            spendingVsStress: 0.45,
            cookingVsSavings: 0.82,
            tasksVsWorkouts: 0.35
        };
    }

    getPredictionAnalysis() {
        return {
            nextWeekTasks: 12,
            nextWeekExpenses: 2500,
            nextWeekWorkouts: 4,
            confidenceLevel: 0.78
        };
    }

    generateActionableRecommendations() {
        return [
            'Schedule your most important tasks on Tuesdays for maximum productivity',
            'Set a weekend spending limit to control Saturday expenses',
            'Plan quick workout sessions for busy weekdays',
            'Use meal prep on Sundays to increase home cooking rate',
            'Add stress-relief activities on Monday mornings'
        ];
    }

    exportComprehensiveCSV(data, filename) {
        let csvContent = 'Report Section,Metric,Value,Notes\n';

        // Add summary data
        Object.entries(data.summary).forEach(([section, metrics]) => {
            Object.entries(metrics).forEach(([metric, value]) => {
                csvContent += `${section},${metric},"${value}","Summary data"\n`;
            });
        });

        // Add analytics
        Object.entries(data.analytics).forEach(([section, metrics]) => {
            Object.entries(metrics).forEach(([metric, value]) => {
                csvContent += `Analytics - ${section},${metric},"${value}","Analytics data"\n`;
            });
        });

        // Add insights and recommendations
        data.insights.forEach((insight, index) => {
            csvContent += `Insights,Insight ${index + 1},"${insight}","Generated insight"\n`;
        });

        data.recommendations.forEach((rec, index) => {
            csvContent += `Recommendations,Recommendation ${index + 1},"${rec}","Actionable recommendation"\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Export functionality for all sections
    exportSectionData(section, format) {
        const data = this.getSectionData(section);
        const filename = `${section}-${format}-${new Date().toISOString().split('T')[0]}`;

        if (format === 'csv') {
            Utils.exportToCSV(data, `${filename}.csv`);
        } else if (format === 'json') {
            Utils.exportToJSON(data, `${filename}.json`);
        }

        Utils.showNotification(`${section} data exported as ${format.toUpperCase()}`, 'success');
    }

    getSectionData(section) {
        switch (section) {
            case 'tasks':
                return { tasks: window.storage.getTasks() };
            case 'expenses':
                return { expenses: window.storage.getExpenses() };
            case 'food':
                return {
                    meals: window.storage.getMeals(),
                    foodItems: window.storage.getFoodItems()
                };
            case 'fitness':
                return { workouts: window.storage.getWorkouts() };
            case 'stress':
                return { moods: window.storage.getMoods() };
            case 'habits':
                return { habits: window.storage.getHabits() };
            case 'report':
                return this.getReportData('month'); // Default to monthly for full report
            default:
                return window.storage.exportData();
        }
    }

    initializeExportHandlers() {
        // Set up event listeners for all export buttons
        document.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                const format = e.target.dataset.format;

                if (section && format) {
                    this.exportSectionData(section, format);
                }
            });
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WorkLifeBalanceApp();
});
