// Storage utility functions for localStorage management
class Storage {
    constructor() {
        this.keys = {
            tasks: 'wlb_tasks',
            expenses: 'wlb_expenses',
            foodItems: 'wlb_food_items',
            workouts: 'wlb_workouts',
            moods: 'wlb_moods',
            settings: 'wlb_settings',
            badges: 'wlb_badges'
        };
        
        this.initializeData();
    }

    initializeData() {
        // Initialize with default data if not exists
        if (!this.get(this.keys.settings)) {
            this.set(this.keys.settings, {
                darkMode: false,
                userName: 'User',
                savingsGoal: 10000,
                dailyCalorieGoal: 2000
            });
        }

        if (!this.get(this.keys.tasks)) {
            this.set(this.keys.tasks, []);
        }

        if (!this.get(this.keys.expenses)) {
            this.set(this.keys.expenses, []);
        }

        if (!this.get(this.keys.foodItems)) {
            this.set(this.keys.foodItems, [
                { id: 1, name: 'Oats', quantity: 2, unit: 'kg', expiry: '2024-06-30' },
                { id: 2, name: 'Rice', quantity: 5, unit: 'kg', expiry: '2024-07-15' },
                { id: 3, name: 'Dal', quantity: 1, unit: 'kg', expiry: '2024-08-01' }
            ]);
        }

        if (!this.get(this.keys.workouts)) {
            this.set(this.keys.workouts, []);
        }

        if (!this.get(this.keys.moods)) {
            this.set(this.keys.moods, []);
        }

        if (!this.get(this.keys.badges)) {
            this.set(this.keys.badges, {
                firstWorkout: false,
                sevenDayStreak: false,
                consistencyKing: false
            });
        }
    }

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    // Tasks methods
    getTasks() {
        return this.get(this.keys.tasks) || [];
    }

    addTask(task) {
        const tasks = this.getTasks();
        task.id = Date.now();
        task.createdAt = new Date().toISOString();
        task.completed = false;
        tasks.push(task);
        this.set(this.keys.tasks, tasks);
        return task;
    }

    updateTask(id, updates) {
        const tasks = this.getTasks();
        const index = tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updates };
            this.set(this.keys.tasks, tasks);
            return tasks[index];
        }
        return null;
    }

    deleteTask(id) {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(task => task.id !== id);
        this.set(this.keys.tasks, filteredTasks);
        return true;
    }

    // Expenses methods
    getExpenses() {
        return this.get(this.keys.expenses) || [];
    }

    addExpense(expense) {
        const expenses = this.getExpenses();
        expense.id = Date.now();
        expense.createdAt = new Date().toISOString();

        // Set default values for new fields
        expense.paymentMethod = expense.paymentMethod || 'cash';
        expense.recurring = expense.recurring || false;
        expense.tags = expense.tags || [];

        // If it's a recurring expense, we might want to create future instances
        if (expense.recurring && expense.recurringFrequency) {
            this.createRecurringExpenseInstances(expense);
        }

        expenses.push(expense);
        this.set(this.keys.expenses, expenses);
        return expense;
    }

    createRecurringExpenseInstances(baseExpense) {
        // This could be expanded to create future recurring expense instances
        // For now, we'll just mark it as recurring
        baseExpense.isRecurringTemplate = true;
    }

    updateExpense(id, updates) {
        const expenses = this.getExpenses();
        const index = expenses.findIndex(expense => expense.id === id);
        if (index !== -1) {
            expenses[index] = { ...expenses[index], ...updates };
            this.set(this.keys.expenses, expenses);
            return expenses[index];
        }
        return null;
    }

    deleteExpense(id) {
        const expenses = this.getExpenses();
        const filteredExpenses = expenses.filter(expense => expense.id !== id);
        this.set(this.keys.expenses, filteredExpenses);
        return true;
    }

    // Food items methods
    getFoodItems() {
        return this.get(this.keys.foodItems) || [];
    }

    addFoodItem(item) {
        const items = this.getFoodItems();
        item.id = Date.now();
        item.createdAt = new Date().toISOString();
        items.push(item);
        this.set(this.keys.foodItems, items);
        return item;
    }

    updateFoodItem(id, updates) {
        const items = this.getFoodItems();
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            this.set(this.keys.foodItems, items);
            return items[index];
        }
        return null;
    }

    deleteFoodItem(id) {
        const items = this.getFoodItems();
        const filteredItems = items.filter(item => item.id !== id);
        this.set(this.keys.foodItems, filteredItems);
        return true;
    }

    // Workouts methods
    getWorkouts() {
        return this.get(this.keys.workouts) || [];
    }

    addWorkout(workout) {
        const workouts = this.getWorkouts();
        workout.id = Date.now();
        workout.createdAt = new Date().toISOString();
        workouts.push(workout);
        this.set(this.keys.workouts, workouts);
        return workout;
    }

    // Moods methods
    getMoods() {
        return this.get(this.keys.moods) || [];
    }

    addMood(mood) {
        const moods = this.getMoods();
        const today = new Date().toDateString();
        
        // Remove existing mood for today if any
        const filteredMoods = moods.filter(m => new Date(m.date).toDateString() !== today);
        
        mood.id = Date.now();
        mood.date = new Date().toISOString();
        filteredMoods.push(mood);
        
        this.set(this.keys.moods, filteredMoods);
        return mood;
    }

    // Settings methods
    getSettings() {
        return this.get(this.keys.settings) || {
            darkMode: false,
            userName: 'User',
            savingsGoal: 10000,
            dailyCalorieGoal: 2000,
            categoryBudgets: {},
            savingsGoalDescription: 'Build your emergency fund',
            currency: 'INR',
            monthlyIncomeGoal: 50000,
            expenseCategories: ['food', 'bills', 'shopping', 'travel', 'entertainment', 'healthcare', 'education', 'other']
        };
    }

    updateSettings(updates) {
        const settings = this.getSettings();
        const newSettings = { ...settings, ...updates };
        this.set(this.keys.settings, newSettings);
        return newSettings;
    }

    // Badges methods
    getBadges() {
        return this.get(this.keys.badges) || {
            firstWorkout: false,
            sevenDayStreak: false,
            consistencyKing: false
        };
    }

    updateBadges(updates) {
        const badges = this.getBadges();
        const newBadges = { ...badges, ...updates };
        this.set(this.keys.badges, newBadges);
        return newBadges;
    }

    // Analytics methods
    getTasksCompletedToday() {
        const tasks = this.getTasks();
        const today = new Date().toDateString();
        return tasks.filter(task => 
            task.completed && 
            new Date(task.updatedAt || task.createdAt).toDateString() === today
        ).length;
    }

    getTotalTasksToday() {
        const tasks = this.getTasks();
        const today = new Date().toDateString();
        return tasks.filter(task => 
            new Date(task.createdAt).toDateString() === today
        ).length;
    }

    getWeeklyExpenses() {
        const expenses = this.getExpenses();
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        return expenses.filter(expense => 
            new Date(expense.createdAt) >= weekAgo
        ).reduce((total, expense) => total + parseFloat(expense.amount), 0);
    }

    getMonthlyExpenses() {
        const expenses = this.getExpenses();
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        return expenses.filter(expense => 
            new Date(expense.createdAt) >= monthAgo
        ).reduce((total, expense) => total + parseFloat(expense.amount), 0);
    }

    getWorkoutStreak() {
        const workouts = this.getWorkouts();
        if (workouts.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
            const dateString = checkDate.toDateString();
            
            const hasWorkout = workouts.some(workout => 
                new Date(workout.createdAt).toDateString() === dateString
            );
            
            if (hasWorkout) {
                streak++;
            } else if (i === 0) {
                // If no workout today, check yesterday
                continue;
            } else {
                break;
            }
        }
        
        return streak;
    }

    getWeeklyMoodAverage() {
        const moods = this.getMoods();
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        const weeklyMoods = moods.filter(mood => 
            new Date(mood.date) >= weekAgo
        );
        
        if (weeklyMoods.length === 0) return 'neutral';
        
        const moodValues = {
            'very-happy': 5,
            'happy': 4,
            'neutral': 3,
            'stressed': 2,
            'very-stressed': 1
        };
        
        const total = weeklyMoods.reduce((sum, mood) => 
            sum + (moodValues[mood.mood] || 3), 0
        );
        
        const average = total / weeklyMoods.length;
        
        if (average >= 4.5) return 'very-happy';
        if (average >= 3.5) return 'happy';
        if (average >= 2.5) return 'neutral';
        if (average >= 1.5) return 'stressed';
        return 'very-stressed';
    }

    // Enhanced expense analytics methods
    getExpensesByCategory(timeframe = 'all') {
        const expenses = this.getExpenses();
        let filteredExpenses = expenses;

        if (timeframe !== 'all') {
            const now = new Date();
            let startDate;

            switch (timeframe) {
                case 'week':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                case 'year':
                    startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    startDate = new Date(0);
            }

            filteredExpenses = expenses.filter(expense =>
                new Date(expense.createdAt) >= startDate
            );
        }

        const categoryTotals = {};
        filteredExpenses.forEach(expense => {
            const category = expense.category;
            categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(expense.amount);
        });

        return categoryTotals;
    }

    getExpensesByPaymentMethod(timeframe = 'month') {
        const expenses = this.getExpenses();
        const now = new Date();
        const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const recentExpenses = expenses.filter(expense =>
            new Date(expense.createdAt) >= startDate
        );

        const paymentMethodTotals = {};
        recentExpenses.forEach(expense => {
            const method = expense.paymentMethod || 'cash';
            paymentMethodTotals[method] = (paymentMethodTotals[method] || 0) + parseFloat(expense.amount);
        });

        return paymentMethodTotals;
    }

    getBudgetStatus() {
        const settings = this.getSettings();
        const budgets = settings.categoryBudgets || {};
        const categoryExpenses = this.getExpensesByCategory('month');

        const budgetStatus = {};
        Object.keys(budgets).forEach(category => {
            const budgetAmount = budgets[category];
            const spentAmount = categoryExpenses[category] || 0;
            const remaining = budgetAmount - spentAmount;
            const percentage = (spentAmount / budgetAmount) * 100;

            budgetStatus[category] = {
                budget: budgetAmount,
                spent: spentAmount,
                remaining: Math.max(0, remaining),
                overBudget: remaining < 0,
                percentage: Math.min(percentage, 100)
            };
        });

        return budgetStatus;
    }

    getSpendingTrends(months = 6) {
        const expenses = this.getExpenses();
        const trends = [];

        for (let i = months - 1; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const year = date.getFullYear();
            const month = date.getMonth();

            const monthStart = new Date(year, month, 1);
            const monthEnd = new Date(year, month + 1, 0);

            const monthExpenses = expenses.filter(expense => {
                const expenseDate = new Date(expense.createdAt);
                return expenseDate >= monthStart && expenseDate <= monthEnd;
            });

            const total = monthExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

            trends.push({
                month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                total,
                count: monthExpenses.length,
                average: monthExpenses.length > 0 ? total / monthExpenses.length : 0
            });
        }

        return trends;
    }

    getTopSpendingDays(limit = 10) {
        const expenses = this.getExpenses();
        const dailyTotals = {};

        expenses.forEach(expense => {
            const date = new Date(expense.createdAt).toDateString();
            dailyTotals[date] = (dailyTotals[date] || 0) + parseFloat(expense.amount);
        });

        return Object.entries(dailyTotals)
            .map(([date, total]) => ({ date, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, limit);
    }

    getExpenseForecast() {
        const trends = this.getSpendingTrends(3);
        if (trends.length < 2) {
            return { nextMonth: 0, confidence: 0 };
        }

        // Simple linear trend calculation
        const recentTotals = trends.map(t => t.total);
        const avg = recentTotals.reduce((sum, val) => sum + val, 0) / recentTotals.length;

        // Calculate trend direction
        const firstHalf = recentTotals.slice(0, Math.floor(recentTotals.length / 2));
        const secondHalf = recentTotals.slice(Math.floor(recentTotals.length / 2));

        const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

        const trendFactor = secondAvg / firstAvg;
        const forecast = avg * trendFactor;

        // Calculate confidence based on consistency
        const variance = recentTotals.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / recentTotals.length;
        const stdDev = Math.sqrt(variance);
        const confidence = Math.max(50, 100 - (stdDev / avg) * 100);

        return {
            nextMonth: Math.max(0, forecast),
            confidence: Math.min(95, Math.round(confidence))
        };
    }

    getRecurringExpenses() {
        const expenses = this.getExpenses();
        return expenses.filter(expense => expense.recurring === true);
    }

    // Export data
    exportData() {
        return {
            tasks: this.getTasks(),
            expenses: this.getExpenses(),
            foodItems: this.getFoodItems(),
            workouts: this.getWorkouts(),
            moods: this.getMoods(),
            settings: this.getSettings(),
            badges: this.getBadges(),
            exportDate: new Date().toISOString()
        };
    }

    // Import data
    importData(data) {
        try {
            if (data.tasks) this.set(this.keys.tasks, data.tasks);
            if (data.expenses) this.set(this.keys.expenses, data.expenses);
            if (data.foodItems) this.set(this.keys.foodItems, data.foodItems);
            if (data.workouts) this.set(this.keys.workouts, data.workouts);
            if (data.moods) this.set(this.keys.moods, data.moods);
            if (data.settings) this.set(this.keys.settings, data.settings);
            if (data.badges) this.set(this.keys.badges, data.badges);
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}

// Create global storage instance
window.storage = new Storage();
