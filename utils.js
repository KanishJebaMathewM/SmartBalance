// Utility functions for the Work-Life Balance app

class Utils {
    // Date utilities
    static formatDate(date) {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    static formatTime(date) {
        return new Date(date).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static isToday(date) {
        const today = new Date();
        const checkDate = new Date(date);
        return today.toDateString() === checkDate.toDateString();
    }

    static isThisWeek(date) {
        const today = new Date();
        const checkDate = new Date(date);
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return checkDate >= weekAgo;
    }

    static getDaysDifference(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((date1 - date2) / oneDay));
    }

    // Currency utilities
    static formatCurrency(amount) {
        return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
    }

    static parseCurrency(amount) {
        return parseFloat(amount.toString().replace(/[₹,]/g, ''));
    }

    // Data validation
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validateAmount(amount) {
        return !isNaN(amount) && parseFloat(amount) > 0;
    }

    static sanitizeInput(input) {
        return input.toString().trim().replace(/[<>]/g, '');
    }

    // UI utilities
    static showNotification(message, type = 'info', duration = 3000) {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            color: white;
            font-weight: 600;
            z-index: 10001;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.background = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Auto remove after duration
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, duration);
    }

    // Animation utilities
    static animateNumber(element, start, end, duration = 1000) {
        const startTime = performance.now();
        const difference = end - start;

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easedProgress = progress * (2 - progress);
            const current = start + (difference * easedProgress);
            
            element.textContent = Math.floor(current);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = end;
            }
        }
        
        requestAnimationFrame(animate);
    }

    static animateProgressBar(element, percentage, duration = 1000) {
        element.style.width = '0%';
        setTimeout(() => {
            element.style.width = `${percentage}%`;
        }, 100);
    }

    // Local storage utilities with error handling
    static safeLocalStorage = {
        setItem: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('LocalStorage setItem error:', error);
                return false;
            }
        },
        
        getItem: (key) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (error) {
                console.error('LocalStorage getItem error:', error);
                return null;
            }
        }
    };

    // Calculation utilities
    static calculatePercentage(value, total) {
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    }

    static calculateAverage(values) {
        if (values.length === 0) return 0;
        const sum = values.reduce((acc, val) => acc + val, 0);
        return sum / values.length;
    }

    // Mood utilities
    static getMoodEmoji(mood) {
        const moodEmojis = {
            'very-happy': '😃',
            'happy': '🙂',
            'neutral': '😐',
            'stressed': '😓',
            'very-stressed': '😭'
        };
        return moodEmojis[mood] || '😐';
    }

    static getMoodColor(mood) {
        const moodColors = {
            'very-happy': '#10b981',
            'happy': '#3b82f6',
            'neutral': '#6b7280',
            'stressed': '#f59e0b',
            'very-stressed': '#ef4444'
        };
        return moodColors[mood] || '#6b7280';
    }

    // Food utilities
    static calculateCalories(meal) {
        const calorieData = {
            'oats': 150,
            'rice': 200,
            'dal': 120,
            'chapati': 100,
            'vegetables': 50,
            'fruits': 60
        };
        
        // Simple calorie calculation based on meal components
        let totalCalories = 0;
        const mealLower = meal.toLowerCase();
        
        Object.keys(calorieData).forEach(food => {
            if (mealLower.includes(food)) {
                totalCalories += calorieData[food];
            }
        });
        
        return totalCalories || 200; // Default calories
    }

    static getMealSuggestions(availableItems = []) {
        const suggestions = {
            breakfast: [
                'Oats with fruits and nuts',
                'Upma with vegetables',
                'Poha with peanuts',
                'Smoothie bowl with berries'
            ],
            lunch: [
                'Rice with dal and vegetables',
                'Quinoa bowl with roasted vegetables',
                'Khichdi with yogurt',
                'Roti with sabzi and salad'
            ],
            dinner: [
                'Chapati with dal and vegetables',
                'Vegetable soup with whole grain bread',
                'Grilled vegetables with quinoa',
                'Light curry with brown rice'
            ]
        };

        const result = {};
        Object.keys(suggestions).forEach(meal => {
            const options = suggestions[meal];
            result[meal] = options[Math.floor(Math.random() * options.length)];
        });

        return result;
    }

    // Exercise utilities
    static getExerciseInstructions(exerciseType) {
        const exercises = {
            'desk-stretches': {
                title: '🪑 Desk Stretches',
                instructions: [
                    'Sit up straight in your chair',
                    'Slowly turn your head left and right (10 times each)',
                    'Roll your shoulders backwards (10 times)',
                    'Stretch your arms above your head and hold for 10 seconds',
                    'Twist your torso left and right gently (5 times each)'
                ],
                duration: '5 minutes',
                calories: 15
            },
            'eye-exercises': {
                title: '👁️ Eye Exercises',
                instructions: [
                    'Look away from your screen',
                    'Focus on a distant object for 20 seconds',
                    'Blink slowly 10 times',
                    'Look up, down, left, right (5 times each)',
                    'Make circles with your eyes (5 clockwise, 5 counter-clockwise)',
                    'Close your eyes and relax for 30 seconds'
                ],
                duration: '3 minutes',
                calories: 5
            },
            'posture-fix': {
                title: '🧍 Posture Fix',
                instructions: [
                    'Stand up straight with feet shoulder-width apart',
                    'Roll your shoulders back and down',
                    'Tuck your chin slightly',
                    'Engage your core muscles',
                    'Hold this position for 30 seconds',
                    'Repeat 3 times with 10-second breaks'
                ],
                duration: '3 minutes',
                calories: 10
            },
            'yoga': {
                title: '🧘 5-min Yoga',
                instructions: [
                    'Start in mountain pose (standing straight)',
                    'Raise arms overhead and stretch (30 seconds)',
                    'Forward fold - touch your toes (30 seconds)',
                    'Downward dog pose (1 minute)',
                    'Child\'s pose for relaxation (1 minute)',
                    'Seated spinal twist (30 seconds each side)',
                    'End with deep breathing (1 minute)'
                ],
                duration: '5 minutes',
                calories: 25
            },
            'breathing': {
                title: '🫁 Deep Breathing',
                instructions: [
                    'Sit comfortably with your back straight',
                    'Place one hand on your chest, one on your belly',
                    'Breathe in slowly through your nose for 4 counts',
                    'Hold your breath for 4 counts',
                    'Exhale slowly through your mouth for 6 counts',
                    'Feel your belly rise and fall with each breath',
                    'Repeat for 10-15 cycles',
                    'Focus on releasing tension with each exhale'
                ],
                duration: '3 minutes',
                calories: 5
            },
            'wall-pushups': {
                title: '🚪 Wall Push-ups',
                instructions: [
                    'Stand arm\'s length away from a wall',
                    'Place palms flat against the wall at shoulder height',
                    'Lean forward slowly until your nose almost touches the wall',
                    'Push back to starting position',
                    'Keep your body straight throughout the movement',
                    'Start with 10-15 repetitions',
                    'Rest for 30 seconds and repeat 2-3 sets'
                ],
                duration: '5 minutes',
                calories: 15
            },
            'calf-raises': {
                title: '🦵 Calf Raises',
                instructions: [
                    'Stand with feet hip-width apart',
                    'Hold onto a chair or wall for balance if needed',
                    'Slowly rise up onto your toes',
                    'Hold the position for 2 seconds',
                    'Lower back down slowly',
                    'Repeat 15-20 times',
                    'Do 2-3 sets with 30-second rest between sets'
                ],
                duration: '3 minutes',
                calories: 10
            },
            'arm-circles': {
                title: '💪 Arm Circles',
                instructions: [
                    'Stand with feet shoulder-width apart',
                    'Extend arms out to the sides at shoulder height',
                    'Make small circles forward for 15 seconds',
                    'Make small circles backward for 15 seconds',
                    'Make larger circles forward for 15 seconds',
                    'Make larger circles backward for 15 seconds',
                    'Shake arms out and relax'
                ],
                duration: '2 minutes',
                calories: 8
            },
            'seated-twists': {
                title: '🔄 Seated Spinal Twists',
                instructions: [
                    'Sit tall in your chair with feet flat on floor',
                    'Place your right hand on the back of your chair',
                    'Place your left hand on your right knee',
                    'Gently twist your torso to the right',
                    'Hold for 15-30 seconds',
                    'Return to center and repeat on the left side',
                    'Do 5 twists on each side',
                    'Keep your shoulders relaxed'
                ],
                duration: '3 minutes',
                calories: 5
            },
            'march-in-place': {
                title: '🚶 March in Place',
                instructions: [
                    'Stand with feet hip-width apart',
                    'Lift your right knee up toward your chest',
                    'Lower it down and lift your left knee',
                    'Continue alternating for a marching motion',
                    'Swing your arms naturally as you march',
                    'Keep a steady, comfortable pace',
                    'March for 1 minute, rest 30 seconds, repeat 3 times'
                ],
                duration: '4 minutes',
                calories: 20
            },
            'ankle-pumps': {
                title: '🦶 Ankle Pumps',
                instructions: [
                    'Sit in your chair with feet flat on the floor',
                    'Lift your toes up while keeping heels down',
                    'Hold for 2 seconds',
                    'Lower toes and lift heels up',
                    'Hold for 2 seconds',
                    'Repeat this pumping motion 20 times',
                    'Then make circles with your ankles (10 each direction)',
                    'This helps improve circulation'
                ],
                duration: '2 minutes',
                calories: 3
            },
            'chair-squats': {
                title: '🪑 Chair Squats',
                instructions: [
                    'Stand in front of your chair with feet shoulder-width apart',
                    'Cross your arms over your chest',
                    'Slowly lower yourself as if sitting down',
                    'Lightly touch the chair seat with your bottom',
                    'Immediately stand back up using your leg muscles',
                    'Keep your weight on your heels',
                    'Start with 8-12 repetitions',
                    'Do 2-3 sets with 1-minute rest between sets'
                ],
                duration: '4 minutes',
                calories: 18
            }
        };

        return exercises[exerciseType] || null;
    }

    // Report utilities
    static generateWeeklyInsights(data) {
        const insights = [];
        const { tasks, expenses, workouts, moods } = data;

        // Task insights
        const completedTasks = tasks.filter(t => t.completed).length;
        const totalTasks = tasks.length;
        const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        if (taskCompletionRate >= 80) {
            insights.push('🎉 Great job! You completed most of your tasks this week.');
        } else if (taskCompletionRate >= 60) {
            insights.push('👍 Good progress on tasks. Try to improve next week.');
        } else {
            insights.push('📝 Focus on completing more tasks next week for better productivity.');
        }

        // Expense insights
        const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        const foodExpenses = expenses.filter(exp => exp.category === 'food')
                                   .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        
        if (foodExpenses > totalExpenses * 0.6) {
            insights.push('🍕 You spent a lot on food this week. Try cooking more at home to save money.');
        }

        // Workout insights
        if (workouts.length >= 5) {
            insights.push('💪 Excellent workout consistency! Keep up the great work.');
        } else if (workouts.length >= 3) {
            insights.push('🏃 Good workout routine. Try to add 1-2 more sessions next week.');
        } else {
            insights.push('🏋️ Increase your workout frequency for better health.');
        }

        // Mood insights
        const stressedDays = moods.filter(m => ['stressed', 'very-stressed'].includes(m.mood)).length;
        if (stressedDays >= 4) {
            insights.push('😌 High stress levels detected. Practice relaxation techniques more often.');
        }

        return insights;
    }

    // Badge checking utilities
    static checkBadgeEligibility(data) {
        const badges = window.storage.getBadges();
        const newBadges = { ...badges };
        let badgesEarned = [];

        // First workout badge
        if (!badges.firstWorkout && data.workouts && data.workouts.length > 0) {
            newBadges.firstWorkout = true;
            badgesEarned.push('🏆 First Workout');
        }

        // 7-day streak badge
        const workoutStreak = window.storage.getWorkoutStreak();
        if (!badges.sevenDayStreak && workoutStreak >= 7) {
            newBadges.sevenDayStreak = true;
            badgesEarned.push('🔥 7-Day Streak');
        }

        // Consistency King badge (workout 5 days a week for 4 weeks)
        if (!badges.consistencyKing && workoutStreak >= 28) {
            const workoutsLast28Days = data.workouts.filter(w => 
                Utils.getDaysDifference(new Date(), new Date(w.createdAt)) <= 28
            );
            if (workoutsLast28Days.length >= 20) { // 5 days * 4 weeks = 20 workouts
                newBadges.consistencyKing = true;
                badgesEarned.push('👑 Consistency King');
            }
        }

        // Update badges if any new ones earned
        if (badgesEarned.length > 0) {
            window.storage.updateBadges(newBadges);
            badgesEarned.forEach(badge => {
                Utils.showNotification(`Badge Earned: ${badge}`, 'success', 5000);
            });
        }

        return newBadges;
    }

    // Export utilities
    static exportToJSON(data, filename = 'wlb-data-export.json') {
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = filename;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    static exportToCSV(data, filename = 'wlb-report.csv') {
        // Create CSV content for expenses
        let csvContent = "Date,Category,Amount,Notes\n";
        data.expenses.forEach(expense => {
            csvContent += `${Utils.formatDate(expense.createdAt)},${expense.category},${expense.amount},"${expense.notes || ''}"\n`;
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

    // Debounce utility for search and input
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Theme utilities
    static applyTheme(isDark) {
        if (isDark) {
            document.body.classList.add('dark-mode');
            document.getElementById('darkModeToggle').textContent = '☀️ Light Mode';
        } else {
            document.body.classList.remove('dark-mode');
            document.getElementById('darkModeToggle').textContent = '🌙 Dark Mode';
        }
    }

    // Greeting utility
    static getGreeting() {
        const hour = new Date().getHours();
        const settings = window.storage.getSettings();
        const name = settings.userName;

        if (hour < 12) {
            return `Good morning ${name}, here's your day at a glance.`;
        } else if (hour < 17) {
            return `Good afternoon ${name}, here's your day at a glance.`;
        } else {
            return `Good evening ${name}, here's your day at a glance.`;
        }
    }
}

// Make Utils available globally
window.Utils = Utils;

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
