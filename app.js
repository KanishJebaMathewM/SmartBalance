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

        // Expense tabs
        this.initializeExpenseTabHandlers();

        // Calendar handlers
        this.initializeCalendarHandlers();
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

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportReport());
        }

        // Enhanced expense form handlers
        this.initializeExpenseFormEnhancements();
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
                    <button onclick="app.editExpense(${expense.id})" title="Edit">✏️</button>
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
            const expenseDate = new Date(expense.createdAt);
            return expenseDate.getFullYear() === year && expenseDate.getMonth() === month;
        });

        // Group expenses by date
        const expensesByDate = {};
        monthExpenses.forEach(expense => {
            const date = new Date(expense.createdAt).getDate();
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
            new Date(expense.createdAt).toDateString() === selectedDateStr
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
        this.charts.createGrowthAnalysisChart('growthAnalysisChart', expenses);
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

        this.generateSpendingPredictions(expenses);
        this.generateSpendingPatterns(expenses);
        this.generateSmartRecommendations(expenses);
        this.loadFinancialGoals();
    }

    generateSpendingPredictions(expenses) {
        const predictions = this.calculateSpendingPredictions(expenses);

        const nextWeekEl = document.getElementById('nextWeekPrediction');
        const nextMonthEl = document.getElementById('nextMonthPrediction');
        const weekConfidenceEl = document.getElementById('weekConfidence');
        const monthConfidenceEl = document.getElementById('monthConfidence');

        if (nextWeekEl) nextWeekEl.textContent = Utils.formatCurrency(predictions.nextWeek.amount);
        if (nextMonthEl) nextMonthEl.textContent = Utils.formatCurrency(predictions.nextMonth.amount);
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
            priority: document.getElementById('expensePriority').value,
            recurring: document.getElementById('expenseRecurring').checked,
            shared: document.getElementById('expenseShared').checked
        };

        // Add recurring options if applicable
        if (expenseData.recurring) {
            expenseData.recurringFrequency = document.getElementById('recurringFrequency').value;
            expenseData.recurringEndDate = document.getElementById('recurringEndDate').value;
            expenseData.recurringReminder = parseInt(document.getElementById('recurringReminder').value);
        }

        // Add shared options if applicable
        if (expenseData.shared) {
            expenseData.sharedWith = Utils.sanitizeInput(document.getElementById('sharedWith').value);
            expenseData.shareAmount = parseFloat(document.getElementById('shareAmount').value);
        }

        if (!Utils.validateAmount(expenseData.amount)) {
            Utils.showNotification('Please enter a valid amount', 'error');
            return;
        }

        if (!expenseData.category) {
            Utils.showNotification('Please select a category', 'error');
            return;
        }

        if (expenseData.shared && !Utils.validateAmount(expenseData.shareAmount)) {
            Utils.showNotification('Please enter a valid share amount', 'error');
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
            travel: '✈️',
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

        // Shared expense toggle
        const sharedCheckbox = document.getElementById('expenseShared');
        const sharedOptions = document.getElementById('sharedOptions');

        if (sharedCheckbox && sharedOptions) {
            sharedCheckbox.addEventListener('change', () => {
                sharedOptions.style.display = sharedCheckbox.checked ? 'block' : 'none';
                if (sharedCheckbox.checked) {
                    this.calculateShareAmount();
                }
            });
        }

        // Auto-calculate share amount
        const expenseAmount = document.getElementById('expenseAmount');
        if (expenseAmount) {
            expenseAmount.addEventListener('input', () => {
                this.calculateShareAmount();
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

    calculateShareAmount() {
        const totalAmount = parseFloat(document.getElementById('expenseAmount').value) || 0;
        const sharedCheckbox = document.getElementById('expenseShared');
        const shareAmountField = document.getElementById('shareAmount');

        if (sharedCheckbox?.checked && shareAmountField && totalAmount > 0) {
            // Assume 50-50 split by default
            shareAmountField.value = (totalAmount / 2).toFixed(2);
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
            'other': '📦'
        };
        return categoryIcons[category] || '📦';
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
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WorkLifeBalanceApp();
});
