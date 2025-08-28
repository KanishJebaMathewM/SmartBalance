// Storage utility functions for localStorage management
class Storage {
    constructor() {
        this.keys = {
            tasks: 'wlb_tasks',
            expenses: 'wlb_expenses',
            foodItems: 'wlb_food_items',
            meals: 'wlb_meals',
            workouts: 'wlb_workouts',
            moods: 'wlb_moods',
            settings: 'wlb_settings',
            badges: 'wlb_badges',
            habits: 'wlb_habits',
            habitCompletions: 'wlb_habit_completions',
            habitSkips: 'wlb_habit_skips',
            goals: 'wlb_goals',
            users: 'wlb_users',
            currentUser: 'wlb_current_user'
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
                // Staples
                { id: 1, name: 'Basmati Rice', quantity: 5, unit: 'kg', expiry: '2025-08-30', caloriesPer100g: 130 },
                { id: 2, name: 'Toor Dal (Arhar)', quantity: 1, unit: 'kg', expiry: '2025-10-15', caloriesPer100g: 120 },
                { id: 3, name: 'Urad Dal', quantity: 500, unit: 'g', expiry: '2025-09-20', caloriesPer100g: 115 },

                // South Indian essentials
                { id: 4, name: 'Coconut (Fresh)', quantity: 3, unit: 'pieces', expiry: '2025-02-10', caloriesPer100g: 160 },
                { id: 5, name: 'Curry Leaves', quantity: 100, unit: 'g', expiry: '2025-02-15', caloriesPer100g: 10 },
                { id: 6, name: 'Mustard Seeds', quantity: 200, unit: 'g', expiry: '2026-01-01', caloriesPer100g: 5 },
                { id: 7, name: 'Rava (Semolina)', quantity: 1, unit: 'kg', expiry: '2025-09-30', caloriesPer100g: 150 },
                { id: 8, name: 'Idli Rice', quantity: 2, unit: 'kg', expiry: '2025-08-20', caloriesPer100g: 130 },
                { id: 9, name: 'Fenugreek Seeds', quantity: 100, unit: 'g', expiry: '2025-12-31', caloriesPer100g: 8 },
                { id: 10, name: 'Tamarind', quantity: 250, unit: 'g', expiry: '2025-11-15', caloriesPer100g: 25 },

                // Flours and grains
                { id: 11, name: 'Ragi Flour', quantity: 1, unit: 'kg', expiry: '2025-07-30', caloriesPer100g: 140 },
                { id: 12, name: 'Besan (Gram Flour)', quantity: 500, unit: 'g', expiry: '2025-08-15', caloriesPer100g: 110 },
                { id: 13, name: 'Oats', quantity: 1, unit: 'kg', expiry: '2025-09-10', caloriesPer100g: 150 },

                // Spices and seasonings
                { id: 14, name: 'Hing (Asafoetida)', quantity: 50, unit: 'g', expiry: '2026-06-01', caloriesPer100g: 2 },
                { id: 15, name: 'Turmeric Powder', quantity: 200, unit: 'g', expiry: '2025-12-31', caloriesPer100g: 3 },
                { id: 16, name: 'Red Chili Powder', quantity: 200, unit: 'g', expiry: '2025-11-30', caloriesPer100g: 5 }
            ]);
        }

        if (!this.get(this.keys.meals)) {
            this.set(this.keys.meals, []);
        }

        if (!this.get(this.keys.workouts)) {
            this.set(this.keys.workouts, []);
        }

        if (!this.get(this.keys.moods)) {
            this.set(this.keys.moods, []);
        }

        if (!this.get(this.keys.badges)) {
            this.set(this.keys.badges, {
                // Fitness badges
                firstWorkout: false,
                sevenDayStreak: false,
                consistencyKing: false,
                exerciseExplorer: false,
                timerMaster: false,

                // Food & Nutrition badges
                southIndianFoodie: false,
                calorieTracker: false,
                homeCookChampion: false,
                nutritionExpert: false,
                mealPlanMaster: false,
                healthyChoice: false,

                // Habit & Lifestyle badges
                firstHabitCompletion: false,
                habitStreak7: false,
                habitStreak30: false,
                wellnessWarrior: false,

                // Financial badges
                budgetBoss: false,
                savingsChampion: false,
                expenseTracker: false,

                // Productivity badges
                taskMaster: false,
                weeklyChampion: false,
                organizer: false
            });
        }

        if (!this.get(this.keys.habits)) {
            this.set(this.keys.habits, []);
        }

        if (!this.get(this.keys.habitCompletions)) {
            this.set(this.keys.habitCompletions, {});
        }

        if (!this.get(this.keys.habitSkips)) {
            this.set(this.keys.habitSkips, {});
        }

        if (!this.get(this.keys.goals)) {
            this.set(this.keys.goals, []);
        }
    }

    // Raw accessors (no user scoping)
    setRaw(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    getRaw(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    // User scoping helpers
    isAuthKey(key) {
        return key === this.keys.users || key === this.keys.currentUser;
    }

    scopedKey(key) {
        if (this.isAuthKey(key)) return key;
        const current = this.getRaw(this.keys.currentUser);
        const userId = current && current.id ? current.id : 'guest';
        return `${key}__${userId}`;
    }

    // Scoped accessors (default for all app data)
    set(key, value) {
        try {
            localStorage.setItem(this.scopedKey(key), JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    get(key) {
        try {
            const item = localStorage.getItem(this.scopedKey(key));
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    // Auth and user management
    getUsers() {
        return this.getRaw(this.keys.users) || [];
    }

    addUser(user) {
        const users = this.getUsers();
        user.id = user.id || Date.now().toString();
        user.createdAt = new Date().toISOString();
        users.push({
            id: user.id,
            username: user.username,
            passwordHash: user.passwordHash,
            recoveryQuestion: user.recoveryQuestion || 'Recovery question',
            recoveryAnswerHash: user.recoveryAnswerHash || '',
            createdAt: user.createdAt
        });
        this.setRaw(this.keys.users, users);
        return user;
    }

    updateUser(id, updates) {
        const users = this.getUsers();
        const idx = users.findIndex(u => u.id === id);
        if (idx === -1) return null;
        users[idx] = { ...users[idx], ...updates };
        this.setRaw(this.keys.users, users);
        return users[idx];
    }

    findUserByUsername(username) {
        const users = this.getUsers();
        return users.find(u => u.username && u.username.toLowerCase() === String(username).toLowerCase());
    }

    getCurrentUser() {
        return this.getRaw(this.keys.currentUser);
    }

    setCurrentUser(user) {
        this.setRaw(this.keys.currentUser, { id: user.id, username: user.username });
        // Initialize default scoped data for this user if not present
        this.initializeData();
        return true;
    }

    logout() {
        this.setRaw(this.keys.currentUser, null);
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

    // Meals methods
    getMeals() {
        return this.get(this.keys.meals) || [];
    }

    addMeal(meal) {
        const meals = this.getMeals();
        meal.id = Date.now();
        meal.createdAt = new Date().toISOString();
        meals.push(meal);
        this.set(this.keys.meals, meals);
        return meal;
    }

    updateMeal(id, updates) {
        const meals = this.getMeals();
        const index = meals.findIndex(meal => meal.id === id);
        if (index !== -1) {
            meals[index] = { ...meals[index], ...updates };
            this.set(this.keys.meals, meals);
            return meals[index];
        }
        return null;
    }

    deleteMeal(id) {
        const meals = this.getMeals();
        const filteredMeals = meals.filter(meal => meal.id !== id);
        this.set(this.keys.meals, filteredMeals);
        return true;
    }

    getMealsByDate(date) {
        const meals = this.getMeals();
        const targetDate = new Date(date).toDateString();
        return meals.filter(meal => new Date(meal.date).toDateString() === targetDate);
    }

    getTodayMeals() {
        return this.getMealsByDate(new Date());
    }

    getYesterdayMeals() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return this.getMealsByDate(yesterday);
    }

    getWeeklyMealStats() {
        const meals = this.getMeals();
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const weeklyMeals = meals.filter(meal => new Date(meal.date) >= weekAgo);

        const homeMeals = weeklyMeals.filter(meal => meal.source === 'home');
        const hotelMeals = weeklyMeals.filter(meal => meal.source === 'hotel');

        const totalCalories = weeklyMeals.reduce((sum, meal) => sum + parseInt(meal.calories), 0);
        const totalHomeCost = homeMeals.reduce((sum, meal) => sum + (parseFloat(meal.ingredientCost) || 0), 0);
        const totalHotelCost = hotelMeals.reduce((sum, meal) => sum + (parseFloat(meal.mealCost) || 0) + (parseFloat(meal.deliveryCharges) || 0), 0);

        return {
            totalMeals: weeklyMeals.length,
            homeMeals: homeMeals.length,
            hotelMeals: hotelMeals.length,
            totalCalories,
            totalHomeCost,
            totalHotelCost,
            avgCaloriesPerDay: totalCalories / 7,
            moneySaved: Math.max(0, (hotelMeals.length * 200) - totalHomeCost) // Assuming avg hotel meal cost is 200
        };
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

        // Use provided date or default to today
        const moodDate = mood.date ? new Date(mood.date) : new Date();
        const targetDateString = moodDate.toDateString();

        // Remove existing mood for the target date if any
        const filteredMoods = moods.filter(m => new Date(m.date).toDateString() !== targetDateString);

        mood.id = mood.id || Date.now();
        mood.date = mood.date || moodDate.toISOString();
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
            monthlyIncome: 0,
            incomeSource: 'salary',
            incomeNotes: '',
            incomeLastUpdated: null,
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
            // Use actual expense date, fallback to creation date for backward compatibility
            new Date(expense.date || expense.createdAt) >= weekAgo
        ).reduce((total, expense) => total + parseFloat(expense.amount), 0);
    }

    getMonthlyExpenses() {
        const expenses = this.getExpenses();
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        return expenses.filter(expense =>
            // Use actual expense date, fallback to creation date for backward compatibility
            new Date(expense.date || expense.createdAt) >= monthAgo
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

    // Habits methods
    getHabits() {
        return this.get(this.keys.habits) || [];
    }

    addHabit(habit) {
        const habits = this.getHabits();
        habit.id = Date.now();
        habit.createdAt = new Date().toISOString();
        habit.active = habit.active !== false; // Default to true
        habit.currentStreak = 0;
        habits.push(habit);
        this.set(this.keys.habits, habits);
        return habit;
    }

    updateHabit(id, updates) {
        const habits = this.getHabits();
        const index = habits.findIndex(habit => habit.id === id);
        if (index !== -1) {
            habits[index] = { ...habits[index], ...updates };
            this.set(this.keys.habits, habits);
            return habits[index];
        }
        return null;
    }

    deleteHabit(id) {
        const habits = this.getHabits();
        const filteredHabits = habits.filter(habit => habit.id !== id);
        this.set(this.keys.habits, filteredHabits);

        // Also clean up completion and skip records
        const completions = this.get(this.keys.habitCompletions) || {};
        delete completions[id];
        this.set(this.keys.habitCompletions, completions);

        const skips = this.get(this.keys.habitSkips) || {};
        delete skips[id];
        this.set(this.keys.habitSkips, skips);

        return true;
    }

    // Habit completion methods
    getHabitCompletions(habitId) {
        const allCompletions = this.get(this.keys.habitCompletions) || {};
        return allCompletions[habitId] || [];
    }

    addHabitCompletion(habitId, completion) {
        const allCompletions = this.get(this.keys.habitCompletions) || {};
        if (!allCompletions[habitId]) {
            allCompletions[habitId] = [];
        }

        completion.id = Date.now();
        completion.timestamp = new Date().toISOString();
        allCompletions[habitId].push(completion);

        this.set(this.keys.habitCompletions, allCompletions);
        return completion;
    }

    removeHabitCompletion(habitId, date) {
        const allCompletions = this.get(this.keys.habitCompletions) || {};
        if (allCompletions[habitId]) {
            allCompletions[habitId] = allCompletions[habitId].filter(completion =>
                new Date(completion.date).toDateString() !== date
            );
            this.set(this.keys.habitCompletions, allCompletions);
        }
        return true;
    }

    // Habit skip methods
    getHabitSkips(habitId) {
        const allSkips = this.get(this.keys.habitSkips) || {};
        return allSkips[habitId] || [];
    }

    addHabitSkip(habitId, skip) {
        const allSkips = this.get(this.keys.habitSkips) || {};
        if (!allSkips[habitId]) {
            allSkips[habitId] = [];
        }

        skip.id = Date.now();
        skip.timestamp = new Date().toISOString();
        allSkips[habitId].push(skip);

        this.set(this.keys.habitSkips, allSkips);
        return skip;
    }

    // Goals methods
    getGoals() {
        return this.get(this.keys.goals) || [];
    }

    addGoal(goal) {
        const goals = this.getGoals();
        goal.id = Date.now();
        goal.createdAt = new Date().toISOString();
        goal.active = goal.active !== false; // Default to true
        goal.progress = 0;
        goals.push(goal);
        this.set(this.keys.goals, goals);
        return goal;
    }

    updateGoal(id, updates) {
        const goals = this.getGoals();
        const index = goals.findIndex(goal => goal.id === id);
        if (index !== -1) {
            goals[index] = { ...goals[index], ...updates };
            this.set(this.keys.goals, goals);
            return goals[index];
        }
        return null;
    }

    deleteGoal(id) {
        const goals = this.getGoals();
        const filteredGoals = goals.filter(goal => goal.id !== id);
        this.set(this.keys.goals, filteredGoals);
        return true;
    }

    // Analytics methods for habits
    getHabitCompletionRate(habitId, days = 30) {
        const completions = this.getHabitCompletions(habitId);
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const recentCompletions = completions.filter(completion =>
            new Date(completion.date) >= startDate
        );

        return recentCompletions.length / days;
    }

    getOverallHabitStats() {
        const habits = this.getHabits();
        const activeHabits = habits.filter(h => h.active !== false);

        let totalCompletions = 0;
        let totalPossible = 0;

        activeHabits.forEach(habit => {
            const completions = this.getHabitCompletions(habit.id);
            const daysSinceCreated = Math.ceil((Date.now() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24));

            totalCompletions += completions.length;
            totalPossible += Math.min(daysSinceCreated, 30); // Cap at 30 days for calculation
        });

        return {
            totalHabits: activeHabits.length,
            completionRate: totalPossible > 0 ? (totalCompletions / totalPossible) * 100 : 0,
            totalCompletions,
            averageStreak: this.getAverageHabitStreak()
        };
    }

    getAverageHabitStreak() {
        const habits = this.getHabits();
        const activeHabits = habits.filter(h => h.active !== false);

        if (activeHabits.length === 0) return 0;

        const totalStreak = activeHabits.reduce((sum, habit) =>
            sum + (habit.currentStreak || 0), 0
        );

        return Math.round(totalStreak / activeHabits.length);
    }

    // Enhanced financial analysis methods
    getSavingsAnalysis() {
        const settings = this.getSettings();
        const monthlyIncome = settings.monthlyIncome || 0;
        const monthlyExpenses = this.getMonthlyExpenses();
        const monthlySavings = Math.max(0, monthlyIncome - monthlyExpenses);
        const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;

        // Calculate projected annual savings
        const projectedAnnualSavings = monthlySavings * 12;

        // Calculate emergency fund coverage (how many months of expenses saved)
        const emergencyFundCoverage = monthlyExpenses > 0 ? monthlySavings / monthlyExpenses : 0;

        // Financial health score (0-100)
        let healthScore = 0;
        if (savingsRate >= 20) healthScore += 40;
        else if (savingsRate >= 10) healthScore += 25;
        else if (savingsRate >= 5) healthScore += 15;

        if (emergencyFundCoverage >= 6) healthScore += 30;
        else if (emergencyFundCoverage >= 3) healthScore += 20;
        else if (emergencyFundCoverage >= 1) healthScore += 10;

        if (monthlyIncome > monthlyExpenses) healthScore += 20;
        else if (monthlyIncome === monthlyExpenses) healthScore += 10;

        if (monthlyExpenses > 0 && monthlyIncome > 0) healthScore += 10;

        return {
            monthlyIncome,
            monthlyExpenses,
            monthlySavings,
            savingsRate: Math.round(savingsRate * 100) / 100,
            projectedAnnualSavings,
            emergencyFundCoverage: Math.round(emergencyFundCoverage * 10) / 10,
            healthScore: Math.min(100, Math.max(0, healthScore)),
            recommendations: this.generateSavingsRecommendations(savingsRate, emergencyFundCoverage, monthlyIncome, monthlyExpenses)
        };
    }

    generateSavingsRecommendations(savingsRate, emergencyFundCoverage, income, expenses) {
        const recommendations = [];

        if (savingsRate < 10) {
            recommendations.push({
                type: 'critical',
                title: 'Increase Savings Rate',
                description: 'Aim to save at least 10-20% of your income. Consider reducing non-essential expenses.'
            });
        }

        if (emergencyFundCoverage < 3) {
            recommendations.push({
                type: 'warning',
                title: 'Build Emergency Fund',
                description: 'Build an emergency fund covering 3-6 months of expenses for financial security.'
            });
        }

        if (income > 0 && expenses > income) {
            recommendations.push({
                type: 'critical',
                title: 'Reduce Expenses',
                description: 'You\'re spending more than you earn. Review and cut unnecessary expenses immediately.'
            });
        }

        if (recommendations.length === 0) {
            recommendations.push({
                type: 'success',
                title: 'Great Financial Health!',
                description: 'You\'re doing well with your finances. Consider investing your savings for long-term growth.'
            });
        }

        return recommendations;
    }

    getCategoryWiseAnalysis(timeframe = 'month') {
        const expenses = this.getExpenses();
        const categoryTotals = this.getExpensesByCategory(timeframe);
        const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

        const analysis = {};
        Object.entries(categoryTotals).forEach(([category, amount]) => {
            const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
            const averageTransaction = expenses.filter(e => e.category === category)
                .reduce((sum, e, _, arr) => sum + parseFloat(e.amount) / arr.length, 0);

            analysis[category] = {
                total: amount,
                percentage: Math.round(percentage * 100) / 100,
                averageTransaction: Math.round(averageTransaction * 100) / 100,
                recommendation: this.getCategoryRecommendation(category, percentage)
            };
        });

        return analysis;
    }

    getCategoryRecommendation(category, percentage) {
        const thresholds = {
            food: { high: 40, medium: 25 },
            entertainment: { high: 15, medium: 10 },
            shopping: { high: 20, medium: 15 },
            bills: { high: 35, medium: 25 },
            travel: { high: 15, medium: 10 }
        };

        const threshold = thresholds[category];
        if (!threshold) return null;

        if (percentage > threshold.high) {
            return {
                type: 'warning',
                message: `High spending in ${category}. Consider reducing expenses in this category.`
            };
        } else if (percentage > threshold.medium) {
            return {
                type: 'info',
                message: `Moderate spending in ${category}. Monitor this category.`
            };
        } else {
            return {
                type: 'success',
                message: `Good control over ${category} expenses.`
            };
        }
    }

    getSpendingInsights() {
        const expenses = this.getExpenses();
        const insights = [];

        // Day of week analysis
        const daySpending = {};
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        expenses.forEach(expense => {
            const day = days[new Date(expense.createdAt).getDay()];
            daySpending[day] = (daySpending[day] || 0) + parseFloat(expense.amount);
        });

        const highestSpendingDay = Object.entries(daySpending)
            .sort(([,a], [,b]) => b - a)[0];

        if (highestSpendingDay) {
            insights.push({
                type: 'info',
                title: 'Spending Pattern',
                description: `You tend to spend most on ${highestSpendingDay[0]}s`,
                value: highestSpendingDay[1]
            });
        }

        // Payment method analysis
        const paymentMethods = this.getExpensesByPaymentMethod();
        const topPaymentMethod = Object.entries(paymentMethods)
            .sort(([,a], [,b]) => b - a)[0];

        if (topPaymentMethod) {
            insights.push({
                type: 'info',
                title: 'Preferred Payment',
                description: `Most expenses paid via ${topPaymentMethod[0]}`,
                value: topPaymentMethod[1]
            });
        }

        // Expense frequency
        const avgDailyTransactions = expenses.length / 30; // last 30 days
        if (avgDailyTransactions > 5) {
            insights.push({
                type: 'warning',
                title: 'High Transaction Frequency',
                description: 'Consider consolidating small purchases to better track spending'
            });
        }

        return insights;
    }

    // Export data
    exportData() {
        return {
            tasks: this.getTasks(),
            expenses: this.getExpenses(),
            foodItems: this.getFoodItems(),
            meals: this.getMeals(),
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
            if (data.meals) this.set(this.keys.meals, data.meals);
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
