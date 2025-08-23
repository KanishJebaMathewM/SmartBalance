// Smart Notifications and Reminders System

class SmartNotificationManager {
    constructor() {
        this.notifications = [];
        this.reminders = [];
        this.patterns = {};
        this.preferences = this.loadPreferences();
        this.isEnabled = this.checkNotificationPermission();
        
        this.init();
    }

    init() {
        this.loadUserPatterns();
        this.scheduleSmartReminders();
        this.startPatternAnalysis();
        
        // Check for reminders every minute
        setInterval(() => {
            this.checkDueReminders();
        }, 60000);
        
        // Analyze patterns every hour
        setInterval(() => {
            this.analyzeUserPatterns();
        }, 3600000);
    }

    // Permission and Setup
    async checkNotificationPermission() {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        } else if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        
        return false;
    }

    loadPreferences() {
        const defaultPreferences = {
            enabled: true,
            habitReminders: true,
            taskReminders: true,
            expenseAlerts: true,
            moodCheckIns: true,
            smartSuggestions: true,
            quietHours: {
                enabled: true,
                start: '22:00',
                end: '08:00'
            },
            reminderFrequency: 'medium', // low, medium, high
            contextualReminders: true,
            patternBasedSuggestions: true
        };

        const saved = localStorage.getItem('notification_preferences');
        return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences;
    }

    savePreferences() {
        localStorage.setItem('notification_preferences', JSON.stringify(this.preferences));
    }

    // Pattern Analysis
    loadUserPatterns() {
        const saved = localStorage.getItem('user_patterns');
        this.patterns = saved ? JSON.parse(saved) : {
            activeHours: {},
            habitTimes: {},
            taskPatterns: {},
            moodPatterns: {},
            expensePatterns: {},
            bestPerformanceTimes: []
        };
    }

    saveUserPatterns() {
        localStorage.setItem('user_patterns', JSON.stringify(this.patterns));
    }

    analyzeUserPatterns() {
        this.analyzeActiveHours();
        this.analyzeHabitPatterns();
        this.analyzeTaskPatterns();
        this.analyzeMoodPatterns();
        this.analyzeExpensePatterns();
        this.identifyBestPerformanceTimes();
        this.saveUserPatterns();
    }

    analyzeActiveHours() {
        const now = new Date();
        const hour = now.getHours();
        
        if (!this.patterns.activeHours[hour]) {
            this.patterns.activeHours[hour] = 0;
        }
        this.patterns.activeHours[hour]++;
    }

    analyzeHabitPatterns() {
        const habits = window.storage.getHabits();
        const today = new Date().toDateString();
        
        habits.forEach(habit => {
            const completions = window.storage.getHabitCompletions(habit.id);
            const todayCompletions = completions.filter(c => 
                new Date(c.date).toDateString() === today
            );
            
            if (todayCompletions.length > 0) {
                const completionTime = new Date(todayCompletions[0].timestamp).getHours();
                
                if (!this.patterns.habitTimes[habit.id]) {
                    this.patterns.habitTimes[habit.id] = [];
                }
                this.patterns.habitTimes[habit.id].push(completionTime);
                
                // Keep only last 30 entries
                if (this.patterns.habitTimes[habit.id].length > 30) {
                    this.patterns.habitTimes[habit.id] = this.patterns.habitTimes[habit.id].slice(-30);
                }
            }
        });
    }

    analyzeTaskPatterns() {
        const tasks = window.storage.getTasks();
        const today = new Date().toDateString();
        
        const todayTasks = tasks.filter(task => 
            new Date(task.createdAt).toDateString() === today && task.completed
        );
        
        if (todayTasks.length > 0) {
            const completionHours = todayTasks.map(task => 
                new Date(task.updatedAt || task.createdAt).getHours()
            );
            
            const avgHour = Math.round(
                completionHours.reduce((sum, hour) => sum + hour, 0) / completionHours.length
            );
            
            if (!this.patterns.taskPatterns.completionTimes) {
                this.patterns.taskPatterns.completionTimes = [];
            }
            this.patterns.taskPatterns.completionTimes.push(avgHour);
            
            // Keep only last 30 days
            if (this.patterns.taskPatterns.completionTimes.length > 30) {
                this.patterns.taskPatterns.completionTimes = 
                    this.patterns.taskPatterns.completionTimes.slice(-30);
            }
        }
    }

    analyzeMoodPatterns() {
        const moods = window.storage.getMoods();
        const recent = moods.slice(-7); // Last 7 mood entries
        
        recent.forEach(mood => {
            const hour = new Date(mood.date).getHours();
            const stressLevel = this.moodToStressLevel(mood.mood);
            
            if (!this.patterns.moodPatterns[hour]) {
                this.patterns.moodPatterns[hour] = [];
            }
            this.patterns.moodPatterns[hour].push(stressLevel);
            
            // Keep only last 20 entries per hour
            if (this.patterns.moodPatterns[hour].length > 20) {
                this.patterns.moodPatterns[hour] = this.patterns.moodPatterns[hour].slice(-20);
            }
        });
    }

    analyzeExpensePatterns() {
        const expenses = window.storage.getExpenses();
        const recent = expenses.slice(-50); // Last 50 expenses
        
        const hourlySpending = {};
        const categoryPatterns = {};
        
        recent.forEach(expense => {
            const hour = new Date(expense.createdAt).getHours();
            const amount = parseFloat(expense.amount);
            
            if (!hourlySpending[hour]) hourlySpending[hour] = [];
            hourlySpending[hour].push(amount);
            
            if (!categoryPatterns[expense.category]) categoryPatterns[expense.category] = [];
            categoryPatterns[expense.category].push({
                hour,
                amount,
                date: expense.createdAt
            });
        });
        
        this.patterns.expensePatterns = {
            hourlySpending,
            categoryPatterns
        };
    }

    identifyBestPerformanceTimes() {
        // Analyze when user is most productive
        const habitCompletions = this.getHourlyHabitCompletions();
        const taskCompletions = this.patterns.taskPatterns.completionTimes || [];
        const moodData = this.getAverageMoodByHour();
        
        const performanceScores = {};
        
        // Score each hour based on habits, tasks, and mood
        for (let hour = 0; hour < 24; hour++) {
            let score = 0;
            
            // Habit completion score
            if (habitCompletions[hour]) {
                score += habitCompletions[hour] * 10;
            }
            
            // Task completion score
            const taskCount = taskCompletions.filter(h => h === hour).length;
            score += taskCount * 5;
            
            // Mood score (higher for better moods)
            if (moodData[hour]) {
                score += (6 - moodData[hour]) * 3; // Invert stress level
            }
            
            performanceScores[hour] = score;
        }
        
        // Find top 3 performance hours
        this.patterns.bestPerformanceTimes = Object.entries(performanceScores)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([hour]) => parseInt(hour));
    }

    getHourlyHabitCompletions() {
        const hourlyCompletions = {};
        
        Object.values(this.patterns.habitTimes).forEach(times => {
            times.forEach(hour => {
                if (!hourlyCompletions[hour]) hourlyCompletions[hour] = 0;
                hourlyCompletions[hour]++;
            });
        });
        
        return hourlyCompletions;
    }

    getAverageMoodByHour() {
        const averages = {};
        
        Object.entries(this.patterns.moodPatterns).forEach(([hour, moods]) => {
            if (moods.length > 0) {
                averages[hour] = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
            }
        });
        
        return averages;
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

    // Smart Reminder Generation
    scheduleSmartReminders() {
        this.scheduleHabitReminders();
        this.scheduleTaskReminders();
        this.scheduleMoodCheckIns();
        this.scheduleExpenseAlerts();
        this.scheduleContextualReminders();
    }

    scheduleHabitReminders() {
        if (!this.preferences.habitReminders) return;
        
        const habits = window.storage.getHabits();
        
        habits.forEach(habit => {
            if (habit.active === false) return;
            
            const optimalTime = this.getOptimalReminderTime(habit);
            const reminderData = {
                id: `habit_${habit.id}_${Date.now()}`,
                type: 'habit',
                habitId: habit.id,
                title: `Time for ${habit.name}! 💪`,
                message: `Don't break your ${habit.currentStreak || 0} day streak!`,
                scheduledTime: optimalTime,
                priority: 'medium',
                recurring: habit.frequency
            };
            
            this.addReminder(reminderData);
        });
    }

    scheduleTaskReminders() {
        if (!this.preferences.taskReminders) return;
        
        const tasks = window.storage.getTasks();
        const incompleteTasks = tasks.filter(task => !task.completed);
        
        incompleteTasks.forEach(task => {
            if (task.date) {
                const dueDate = new Date(task.date);
                const reminderTime = new Date(dueDate.getTime() - 2 * 60 * 60 * 1000); // 2 hours before
                
                if (reminderTime > new Date()) {
                    const reminderData = {
                        id: `task_${task.id}_${Date.now()}`,
                        type: 'task',
                        taskId: task.id,
                        title: `Task Reminder: ${task.title}`,
                        message: `Due at ${dueDate.toLocaleTimeString()}`,
                        scheduledTime: reminderTime,
                        priority: task.category === 'work' ? 'high' : 'medium'
                    };
                    
                    this.addReminder(reminderData);
                }
            }
        });
    }

    scheduleMoodCheckIns() {
        if (!this.preferences.moodCheckIns) return;
        
        const optimalTimes = this.getOptimalMoodCheckTimes();
        
        optimalTimes.forEach(time => {
            const reminderData = {
                id: `mood_checkin_${time}_${Date.now()}`,
                type: 'mood',
                title: '😌 How are you feeling?',
                message: 'Take a moment to check in with yourself',
                scheduledTime: time,
                priority: 'low',
                recurring: 'daily'
            };
            
            this.addReminder(reminderData);
        });
    }

    scheduleExpenseAlerts() {
        if (!this.preferences.expenseAlerts) return;
        
        // Check for budget overspending
        const budgets = window.storage.getSettings().categoryBudgets || {};
        const expenses = window.storage.getExpensesByCategory('month');
        
        Object.entries(budgets).forEach(([category, budget]) => {
            const spent = expenses[category] || 0;
            const percentage = (spent / budget) * 100;
            
            if (percentage >= 80 && percentage < 100) {
                this.showNotification({
                    title: '⚠️ Budget Alert',
                    message: `You've used ${percentage.toFixed(0)}% of your ${category} budget`,
                    type: 'warning',
                    priority: 'medium'
                });
            } else if (percentage >= 100) {
                this.showNotification({
                    title: '🚨 Budget Exceeded',
                    message: `You've exceeded your ${category} budget by ${(percentage - 100).toFixed(0)}%`,
                    type: 'error',
                    priority: 'high'
                });
            }
        });
    }

    scheduleContextualReminders() {
        if (!this.preferences.contextualReminders) return;
        
        // Schedule reminders based on detected patterns
        this.schedulePatternBasedReminders();
        this.schedulePerformanceOptimizationReminders();
        this.scheduleWellnessReminders();
    }

    schedulePatternBasedReminders() {
        // Remind to exercise if they usually do it at this time
        const currentHour = new Date().getHours();
        const workoutPatterns = this.patterns.habitTimes;
        
        Object.entries(workoutPatterns).forEach(([habitId, times]) => {
            const habit = window.storage.getHabits().find(h => h.id == habitId);
            if (habit && habit.category === 'fitness') {
                const avgTime = Math.round(times.reduce((sum, time) => sum + time, 0) / times.length);
                
                if (Math.abs(currentHour - avgTime) <= 1) {
                    this.showNotification({
                        title: `🏃 Time for ${habit.name}?`,
                        message: `You usually do this around ${avgTime}:00`,
                        type: 'suggestion',
                        priority: 'low'
                    });
                }
            }
        });
    }

    schedulePerformanceOptimizationReminders() {
        const currentHour = new Date().getHours();
        const bestTimes = this.patterns.bestPerformanceTimes;
        
        if (bestTimes.includes(currentHour)) {
            const incompleteTasks = window.storage.getTasks().filter(t => !t.completed);
            
            if (incompleteTasks.length > 0) {
                this.showNotification({
                    title: '⚡ Peak Performance Time!',
                    message: `This is usually your most productive hour. ${incompleteTasks.length} tasks waiting!`,
                    type: 'suggestion',
                    priority: 'medium'
                });
            }
        }
    }

    scheduleWellnessReminders() {
        // Remind about stress management during high-stress patterns
        const currentHour = new Date().getHours();
        const moodPatterns = this.patterns.moodPatterns[currentHour];
        
        if (moodPatterns && moodPatterns.length > 0) {
            const avgStress = moodPatterns.reduce((sum, stress) => sum + stress, 0) / moodPatterns.length;
            
            if (avgStress >= 4) { // High stress pattern
                this.showNotification({
                    title: '😌 Take a Breath',
                    message: 'This time usually brings stress. Try a 2-minute breathing exercise?',
                    type: 'wellness',
                    priority: 'medium'
                });
            }
        }
    }

    // Reminder Management
    addReminder(reminderData) {
        this.reminders.push({
            ...reminderData,
            createdAt: new Date().toISOString(),
            status: 'scheduled'
        });
        
        this.saveReminders();
    }

    checkDueReminders() {
        const now = new Date();
        
        this.reminders.forEach(reminder => {
            if (reminder.status === 'scheduled' && new Date(reminder.scheduledTime) <= now) {
                this.triggerReminder(reminder);
                reminder.status = 'triggered';
            }
        });
        
        this.saveReminders();
    }

    triggerReminder(reminder) {
        if (this.isQuietHours()) return;
        
        this.showNotification({
            title: reminder.title,
            message: reminder.message,
            type: reminder.type || 'reminder',
            priority: reminder.priority || 'medium',
            data: reminder
        });
    }

    isQuietHours() {
        if (!this.preferences.quietHours.enabled) return false;
        
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const start = this.timeStringToMinutes(this.preferences.quietHours.start);
        const end = this.timeStringToMinutes(this.preferences.quietHours.end);
        
        if (start > end) { // Crosses midnight
            return currentTime >= start || currentTime <= end;
        } else {
            return currentTime >= start && currentTime <= end;
        }
    }

    timeStringToMinutes(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    }

    saveReminders() {
        localStorage.setItem('scheduled_reminders', JSON.stringify(this.reminders));
    }

    loadReminders() {
        const saved = localStorage.getItem('scheduled_reminders');
        this.reminders = saved ? JSON.parse(saved) : [];
    }

    // Notification Display
    showNotification(notification) {
        if (!this.preferences.enabled) return;
        
        // Show browser notification if permitted
        if (this.isEnabled && !this.isQuietHours()) {
            this.showBrowserNotification(notification);
        }
        
        // Show in-app notification
        this.showInAppNotification(notification);
        
        // Store notification history
        this.addToHistory(notification);
    }

    showBrowserNotification(notification) {
        if (!this.isEnabled) return;
        
        const options = {
            body: notification.message,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: notification.type,
            requireInteraction: notification.priority === 'high'
        };
        
        const browserNotification = new Notification(notification.title, options);
        
        browserNotification.onclick = () => {
            window.focus();
            this.handleNotificationClick(notification);
            browserNotification.close();
        };
        
        // Auto close after 5 seconds for low priority
        if (notification.priority === 'low') {
            setTimeout(() => {
                browserNotification.close();
            }, 5000);
        }
    }

    showInAppNotification(notification) {
        const notificationEl = document.createElement('div');
        notificationEl.className = `in-app-notification ${notification.type} priority-${notification.priority}`;
        notificationEl.innerHTML = `
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
            </div>
            <div class="notification-actions">
                <button class="notification-action-btn primary" onclick="notificationManager.handleNotificationAction('${notification.type}', 'accept')">
                    ${this.getActionButtonText(notification.type, 'accept')}
                </button>
                <button class="notification-action-btn secondary" onclick="notificationManager.dismissNotification(this.parentElement.parentElement)">
                    Dismiss
                </button>
            </div>
        `;
        
        document.body.appendChild(notificationEl);
        
        // Auto dismiss after timeout
        const timeout = this.getNotificationTimeout(notification.priority);
        setTimeout(() => {
            this.dismissNotification(notificationEl);
        }, timeout);
    }

    getActionButtonText(type, action) {
        const actions = {
            habit: { accept: 'Mark Complete' },
            task: { accept: 'View Task' },
            mood: { accept: 'Check In' },
            expense: { accept: 'View Budget' },
            suggestion: { accept: 'Got It' },
            wellness: { accept: 'Take Break' }
        };
        
        return actions[type]?.[action] || 'OK';
    }

    getNotificationTimeout(priority) {
        const timeouts = {
            low: 5000,
            medium: 8000,
            high: 12000
        };
        return timeouts[priority] || 8000;
    }

    dismissNotification(notificationEl) {
        if (notificationEl && notificationEl.parentNode) {
            notificationEl.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notificationEl.parentNode) {
                    notificationEl.remove();
                }
            }, 300);
        }
    }

    handleNotificationClick(notification) {
        switch (notification.type) {
            case 'habit':
                if (window.app) {
                    window.app.showSection('habits');
                }
                break;
            case 'task':
                if (window.app) {
                    window.app.showSection('tasks');
                }
                break;
            case 'mood':
                if (window.app) {
                    window.app.showSection('stress');
                }
                break;
            case 'expense':
                if (window.app) {
                    window.app.showSection('expenses');
                }
                break;
        }
    }

    handleNotificationAction(type, action) {
        switch (type) {
            case 'habit':
                if (action === 'accept') {
                    window.app?.showSection('habits');
                }
                break;
            case 'task':
                if (action === 'accept') {
                    window.app?.showSection('tasks');
                }
                break;
            case 'mood':
                if (action === 'accept') {
                    window.app?.showSection('stress');
                }
                break;
            case 'wellness':
                if (action === 'accept') {
                    window.app?.openModal('breathingModal');
                }
                break;
        }
    }

    addToHistory(notification) {
        const history = JSON.parse(localStorage.getItem('notification_history') || '[]');
        history.unshift({
            ...notification,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 100 notifications
        if (history.length > 100) {
            history.splice(100);
        }
        
        localStorage.setItem('notification_history', JSON.stringify(history));
    }

    // Helper Methods
    getOptimalReminderTime(habit) {
        const patternTimes = this.patterns.habitTimes[habit.id];
        
        if (patternTimes && patternTimes.length > 0) {
            // Use average of past completion times
            const avgHour = Math.round(
                patternTimes.reduce((sum, hour) => sum + hour, 0) / patternTimes.length
            );
            
            const reminderTime = new Date();
            reminderTime.setHours(avgHour - 1, 0, 0, 0); // 1 hour before usual time
            
            return reminderTime;
        } else {
            // Use default time based on category
            return this.getDefaultReminderTime(habit.category);
        }
    }

    getDefaultReminderTime(category) {
        const defaults = {
            fitness: 7, // 7 AM
            nutrition: 8, // 8 AM
            productivity: 9, // 9 AM
            wellness: 19 // 7 PM
        };
        
        const hour = defaults[category] || 9;
        const reminderTime = new Date();
        reminderTime.setHours(hour, 0, 0, 0);
        
        return reminderTime;
    }

    getOptimalMoodCheckTimes() {
        // Default mood check-in times
        const defaultTimes = [12, 18]; // Noon and 6 PM
        
        // If we have patterns, use them to optimize timing
        if (Object.keys(this.patterns.moodPatterns).length > 5) {
            // Find times when mood typically changes
            const changePoints = this.detectMoodChangePoints();
            return changePoints.length > 0 ? changePoints : defaultTimes.map(hour => {
                const time = new Date();
                time.setHours(hour, 0, 0, 0);
                return time;
            });
        }
        
        return defaultTimes.map(hour => {
            const time = new Date();
            time.setHours(hour, 0, 0, 0);
            return time;
        });
    }

    detectMoodChangePoints() {
        // Simplified change point detection
        const hours = Object.keys(this.patterns.moodPatterns).map(Number).sort();
        const changePoints = [];
        
        for (let i = 1; i < hours.length; i++) {
            const prevHour = hours[i - 1];
            const currentHour = hours[i];
            
            const prevMood = this.patterns.moodPatterns[prevHour];
            const currentMood = this.patterns.moodPatterns[currentHour];
            
            if (prevMood && currentMood) {
                const prevAvg = prevMood.reduce((sum, m) => sum + m, 0) / prevMood.length;
                const currentAvg = currentMood.reduce((sum, m) => sum + m, 0) / currentMood.length;
                
                if (Math.abs(prevAvg - currentAvg) > 1) {
                    const time = new Date();
                    time.setHours(currentHour - 1, 0, 0, 0);
                    changePoints.push(time);
                }
            }
        }
        
        return changePoints.slice(0, 3); // Max 3 check-ins per day
    }

    startPatternAnalysis() {
        // Continuously learn from user behavior
        this.observeUserActivity();
    }

    observeUserActivity() {
        // Track app usage patterns
        let lastActivity = Date.now();
        
        document.addEventListener('click', () => {
            lastActivity = Date.now();
            this.analyzeActiveHours();
        });
        
        document.addEventListener('keypress', () => {
            lastActivity = Date.now();
            this.analyzeActiveHours();
        });
        
        // Check for inactivity
        setInterval(() => {
            const inactiveTime = Date.now() - lastActivity;
            if (inactiveTime > 30 * 60 * 1000) { // 30 minutes inactive
                this.handleInactivity(inactiveTime);
            }
        }, 60000);
    }

    handleInactivity(inactiveTime) {
        if (inactiveTime > 60 * 60 * 1000 && this.preferences.smartSuggestions) { // 1 hour
            this.showNotification({
                title: '👋 Welcome back!',
                message: 'Ready to continue with your goals?',
                type: 'suggestion',
                priority: 'low'
            });
        }
    }

    // Public API
    updatePreferences(newPreferences) {
        this.preferences = { ...this.preferences, ...newPreferences };
        this.savePreferences();
    }

    getNotificationHistory() {
        return JSON.parse(localStorage.getItem('notification_history') || '[]');
    }

    clearNotificationHistory() {
        localStorage.setItem('notification_history', '[]');
    }

    getPatternSummary() {
        return {
            mostActiveHours: this.getMostActiveHours(),
            bestPerformanceTimes: this.patterns.bestPerformanceTimes,
            habitPatterns: this.getHabitPatternSummary(),
            moodTrends: this.getMoodTrendSummary()
        };
    }

    getMostActiveHours() {
        const hours = Object.entries(this.patterns.activeHours)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([hour]) => parseInt(hour));
        
        return hours;
    }

    getHabitPatternSummary() {
        const summary = {};
        
        Object.entries(this.patterns.habitTimes).forEach(([habitId, times]) => {
            const habit = window.storage.getHabits().find(h => h.id == habitId);
            if (habit) {
                const avgTime = Math.round(times.reduce((sum, time) => sum + time, 0) / times.length);
                summary[habit.name] = `Usually completed around ${avgTime}:00`;
            }
        });
        
        return summary;
    }

    getMoodTrendSummary() {
        const hourlyAverages = this.getAverageMoodByHour();
        const trends = [];
        
        Object.entries(hourlyAverages).forEach(([hour, avg]) => {
            if (avg >= 4) {
                trends.push(`Higher stress around ${hour}:00`);
            } else if (avg <= 2) {
                trends.push(`Generally positive mood around ${hour}:00`);
            }
        });
        
        return trends;
    }
}

// Initialize notification manager
window.notificationManager = new SmartNotificationManager();
