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
            // Basic ingredients
            'oats': 150,
            'rice': 200,
            'brown rice': 180,
            'dal': 120,
            'chapati': 100,
            'roti': 100,
            'vegetables': 50,
            'fruits': 60,
            'coconut': 160,
            'ghee': 120,
            'oil': 100,

            // South Indian staples
            'dosa': 150,
            'idli': 40,
            'vada': 180,
            'appam': 120,
            'puttu': 180,
            'upma': 200,
            'uttapam': 170,
            'pongal': 250,
            'adai': 160,
            'pesarattu': 140,
            'paniyaram': 80,
            'kozhukattai': 130,
            'pathiri': 110,
            'idiappam': 190,

            // Rice varieties
            'lemon rice': 280,
            'tomato rice': 270,
            'curd rice': 220,
            'coconut rice': 320,
            'tamarind rice': 290,
            'puliyodarai': 290,
            'vangi bath': 310,
            'chitranna': 260,
            'bisi bele bath': 350,
            'biryani': 400,

            // Curries and sides
            'sambar': 80,
            'rasam': 60,
            'avial': 90,
            'thoran': 70,
            'olan': 85,
            'koottu': 100,
            'mor kuzhambu': 75,
            'coconut chutney': 90,
            'tomato chutney': 60,
            'mint chutney': 50,
            'pickle': 40,
            'papad': 30,
            'curry': 120,
            'stew': 110,
            'korma': 180,
            'kurma': 180,
            'sagu': 140,

            // Healthy alternatives
            'quinoa': 170,
            'millet': 160,
            'ragi': 140,
            'jowar': 150,
            'bajra': 155
        };

        // Enhanced calorie calculation based on meal components
        let totalCalories = 0;
        const mealLower = meal.toLowerCase();

        // Count occurrences and calculate calories
        Object.entries(calorieData).forEach(([food, calories]) => {
            if (mealLower.includes(food)) {
                totalCalories += calories;
            }
        });

        // Special combinations and portions
        if (mealLower.includes('with')) {
            // If it's a combination meal, add base calories for accompaniments
            if (mealLower.includes('rice with')) {
                totalCalories += 50; // Extra for variety
            }
            if (mealLower.includes('coconut') && mealLower.includes('chutney')) {
                totalCalories += 30; // Additional coconut content
            }
        }

        // Portion adjustments
        if (mealLower.includes('large') || mealLower.includes('full')) {
            totalCalories *= 1.3;
        } else if (mealLower.includes('small') || mealLower.includes('light')) {
            totalCalories *= 0.7;
        }

        // Default calories based on meal type if nothing matched
        if (totalCalories === 0) {
            if (mealLower.includes('breakfast')) {
                totalCalories = 280;
            } else if (mealLower.includes('lunch')) {
                totalCalories = 400;
            } else if (mealLower.includes('dinner')) {
                totalCalories = 320;
            } else {
                totalCalories = 250; // General default
            }
        }

        return Math.round(totalCalories);
    }

    static getMealSuggestions(availableItems = []) {
        const suggestions = {
            breakfast: [
                // Traditional South Indian breakfast
                'Crispy Dosa with Coconut Chutney and Sambar',
                'Soft Idli with Sambar and Tomato Chutney',
                'Fluffy Appam with Coconut Milk Curry',
                'Steamed Puttu with Banana and Jaggery',
                'Rava Upma with Curry Leaves and Mustard Seeds',
                'Masala Dosa with Potato Filling',
                'Medu Vada with Coconut Chutney',
                'Uttapam with Onions and Tomatoes',
                'Pongal with Ghee and Black Pepper',
                'Adai with Avial',
                'Pesarattu with Upma',
                'Set Dosa with Kurma',

                // Modern healthy options
                'Oats Upma with South Indian Tempering',
                'Ragi Dosa with Vegetable Sambar',
                'Quinoa Pongal with Cashews',
                'Millet Idli with Mint Chutney',
                'Poha with Curry Leaves and Peanuts',
                'Smoothie Bowl with Coconut and Mango'
            ],
            lunch: [
                // Traditional South Indian lunch
                'Steamed Rice with Sambar and Rasam',
                'Curd Rice with Pickle and Papad',
                'Bisi Bele Bath with Raita',
                'Tomato Rice with Yogurt',
                'Lemon Rice with Cashews and Curry Leaves',
                'Tamarind Rice with Roasted Peanuts',
                'Coconut Rice with Fried Gram',
                'Vegetable Biryani with Raita',
                'Puliyodarai with Pickle',
                'Vangi Bath (Brinjal Rice)',
                'Chitranna with Vegetables',
                'Ghee Rice with Kurma',

                // Curry combinations
                'Rice with Avial and Thoran',
                'Rice with Koottu and Olan',
                'Rice with Mor Kuzhambu',
                'Rice with Vegetable Korma',
                'Rice with Dal Curry and Poriyal',
                'Rice with Coconut Curry',

                // Modern options
                'Quinoa Bowl with South Indian Vegetables',
                'Millet Rice with Sambar',
                'Brown Rice with Rasam and Vegetables'
            ],
            dinner: [
                // Light South Indian dinner
                'Chapati with Vegetable Kurma',
                'Appam with Coconut Stew',
                'Pathiri with Vegetable Curry',
                'Idiappam with Coconut Milk',
                'Dosa with Vegetable Sagu',
                'Uttapam with Coconut Chutney',
                'Adai with Jaggery',
                'Paniyaram with Sambar',
                'Kozhukattai with Coconut',
                'Puttu with Kadala Curry',

                // Soup and light meals
                'Rasam with Steamed Rice',
                'Mor Kuzhambu with Rice',
                'Vegetable Sambar with Idli',
                'Coconut Milk Curry with Appam',
                'Drumstick Leaves Soup with Ragi Roti',
                'Tomato Rasam with Brown Rice',

                // Healthy options
                'Millet Dosa with Vegetable Curry',
                'Ragi Puttu with Coconut',
                'Oats Idli with Mint Chutney',
                'Quinoa Upma with Vegetables',
                'Brown Rice with Light Dal',
                'Vegetable Soup with Ragi Roti'
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

        // Fitness Badges
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

        // Exercise Explorer badge (try 8 different exercises)
        if (!badges.exerciseExplorer && data.workouts) {
            const uniqueExercises = new Set(data.workouts.map(w => w.type));
            if (uniqueExercises.size >= 8) {
                newBadges.exerciseExplorer = true;
                badgesEarned.push('🧭 Exercise Explorer');
            }
        }

        // Timer Master badge (complete 10 timed exercises)
        if (!badges.timerMaster && data.workouts) {
            const timedWorkouts = data.workouts.filter(w =>
                w.type !== 'breathing' && w.type !== 'general'
            );
            if (timedWorkouts.length >= 10) {
                newBadges.timerMaster = true;
                badgesEarned.push('⏰ Timer Master');
            }
        }

        // Food & Nutrition Badges
        const foodItems = window.storage.getFoodItems();
        const expenses = data.expenses || [];

        // South Indian Foodie badge
        if (!badges.southIndianFoodie && foodItems) {
            const southIndianItems = foodItems.filter(item =>
                this.isSouthIndianFood(item.name)
            );
            if (southIndianItems.length >= 10) {
                newBadges.southIndianFoodie = true;
                badgesEarned.push('🥥 South Indian Foodie');
            }
        }

        // Home Cook Champion badge (cook at home 15 days)
        if (!badges.homeCookChampion) {
            const homeCookingDays = this.getHomeCookingDays(expenses);
            if (homeCookingDays >= 15) {
                newBadges.homeCookChampion = true;
                badgesEarned.push('👨‍🍳 Home Cook Champion');
            }
        }

        // Calorie Tracker badge (track calories for 7 days)
        if (!badges.calorieTracker) {
            const calorieTrackingDays = this.getCalorieTrackingDays();
            if (calorieTrackingDays >= 7) {
                newBadges.calorieTracker = true;
                badgesEarned.push('📊 Calorie Tracker');
            }
        }

        // Meal Plan Master badge (plan meals for 14 days)
        if (!badges.mealPlanMaster) {
            const mealPlanDays = this.getMealPlanDays();
            if (mealPlanDays >= 14) {
                newBadges.mealPlanMaster = true;
                badgesEarned.push('📋 Meal Plan Master');
            }
        }

        // Financial Badges
        // Budget Boss badge (stay within budget for a month)
        if (!badges.budgetBoss) {
            const budgetStatus = window.storage.getBudgetStatus();
            const withinBudget = Object.values(budgetStatus).every(status => !status.overBudget);
            if (withinBudget && Object.keys(budgetStatus).length > 0) {
                newBadges.budgetBoss = true;
                badgesEarned.push('��� Budget Boss');
            }
        }

        // Expense Tracker badge (track expenses for 30 days)
        if (!badges.expenseTracker && expenses.length > 0) {
            const recentExpenses = expenses.filter(e =>
                Utils.getDaysDifference(new Date(), new Date(e.createdAt)) <= 30
            );
            const uniqueDays = new Set(recentExpenses.map(e =>
                new Date(e.createdAt).toDateString()
            ));
            if (uniqueDays.size >= 30) {
                newBadges.expenseTracker = true;
                badgesEarned.push('📈 Expense Tracker');
            }
        }

        // Savings Champion badge (save 20% of income)
        if (!badges.savingsChampion) {
            const analysis = window.storage.getSavingsAnalysis();
            if (analysis.savingsRate >= 20) {
                newBadges.savingsChampion = true;
                badgesEarned.push('🏦 Savings Champion');
            }
        }

        // Productivity Badges
        const tasks = data.tasks || [];

        // Task Master badge (complete 50 tasks)
        if (!badges.taskMaster && tasks) {
            const completedTasks = tasks.filter(t => t.completed);
            if (completedTasks.length >= 50) {
                newBadges.taskMaster = true;
                badgesEarned.push('✅ Task Master');
            }
        }

        // Weekly Champion badge (100% task completion for a week)
        if (!badges.weeklyChampion && tasks) {
            const weeklyCompletion = this.getWeeklyTaskCompletion(tasks);
            if (weeklyCompletion >= 100) {
                newBadges.weeklyChampion = true;
                badgesEarned.push('🗓️ Weekly Champion');
            }
        }

        // Organizer badge (use all sections of the app)
        if (!badges.organizer) {
            const sectionsUsed = this.getSectionsUsed();
            if (sectionsUsed >= 6) { // Assuming 6 main sections
                newBadges.organizer = true;
                badgesEarned.push('📊 Organizer');
            }
        }

        // Wellness Warrior badge (complete stress relief 10 times)
        if (!badges.wellnessWarrior && data.workouts) {
            const stressReliefWorkouts = data.workouts.filter(w =>
                ['breathing', 'yoga', 'meditation'].includes(w.type)
            );
            if (stressReliefWorkouts.length >= 10) {
                newBadges.wellnessWarrior = true;
                badgesEarned.push('🧘‍♀️ Wellness Warrior');
            }
        }

        // TOUGHER ACHIEVEMENT BADGES

        // Iron Will badge (30-day workout streak)
        if (!badges.ironWill && workoutStreak >= 30) {
            newBadges.ironWill = true;
            badgesEarned.push('🛡️ Iron Will');
        }

        // Marathon Warrior badge (complete 100 workouts total)
        if (!badges.marathonWarrior && data.workouts && data.workouts.length >= 100) {
            newBadges.marathonWarrior = true;
            badgesEarned.push('🏃‍♂️ Marathon Warrior');
        }

        // Fitness Zealot badge (work out every day for 60 days)
        if (!badges.zealot && workoutStreak >= 60) {
            newBadges.zealot = true;
            badgesEarned.push('⚡ Fitness Zealot');
        }

        // Master Chef badge (cook at home 90% of meals for 30 days)
        if (!badges.masterChef) {
            const homeCookingRate = this.getHomeCookingRate(expenses, 30);
            if (homeCookingRate >= 90) {
                newBadges.masterChef = true;
                badgesEarned.push('👑 Master Chef');
            }
        }

        // Frugality King badge (save 50% of income for 3 months)
        if (!badges.frugalityKing) {
            const savingsRate = this.getLongTermSavingsRate(expenses, 90);
            if (savingsRate >= 50) {
                newBadges.frugalityKing = true;
                badgesEarned.push('💎 Frugality King');
            }
        }

        // Budget Ninja badge (stay under budget in ALL categories for 6 months)
        if (!badges.budgetNinja) {
            const budgetCompliance = this.getBudgetCompliance(expenses, 180);
            if (budgetCompliance >= 100) {
                newBadges.budgetNinja = true;
                badgesEarned.push('🥷 Budget Ninja');
            }
        }

        // Task Terminator badge (complete 500 tasks total)
        if (!badges.taskTerminator && tasks) {
            const completedTasks = tasks.filter(t => t.completed);
            if (completedTasks.length >= 500) {
                newBadges.taskTerminator = true;
                badgesEarned.push('🤖 Task Terminator');
            }
        }

        // Perfectionist badge (100% task completion for 30 days straight)
        if (!badges.perfectionist && tasks) {
            const perfectStreak = this.getPerfectTaskStreak(tasks);
            if (perfectStreak >= 30) {
                newBadges.perfectionist = true;
                badgesEarned.push('💯 Perfectionist');
            }
        }

        // Zen Master badge (log mood daily for 100 days straight)
        if (!badges.zenMaster && data.moods) {
            const moodStreak = this.getMoodStreak(data.moods);
            if (moodStreak >= 100) {
                newBadges.zenMaster = true;
                badgesEarned.push('☯️ Zen Master');
            }
        }

        // Stress Slayer badge (complete 50 stress relief sessions)
        if (!badges.stressSlayer && data.workouts) {
            const stressReliefWorkouts = data.workouts.filter(w =>
                ['breathing', 'yoga', 'meditation'].includes(w.type)
            );
            if (stressReliefWorkouts.length >= 50) {
                newBadges.stressSlayer = true;
                badgesEarned.push('🗡️ Stress Slayer');
            }
        }

        // Ultra Consistent badge (use app daily for 6 months straight)
        if (!badges.ultraConsistent) {
            const appUsageStreak = this.getAppUsageStreak();
            if (appUsageStreak >= 180) {
                newBadges.ultraConsistent = true;
                badgesEarned.push('⭐ Ultra Consistent');
            }
        }

        // Lifestyle Master badge (maintain all habits for 365 days)
        if (!badges.lifestyleMaster) {
            const allHabitsStreak = this.getAllHabitsStreak(data);
            if (allHabitsStreak >= 365) {
                newBadges.lifestyleMaster = true;
                badgesEarned.push('🌟 Lifestyle Master');
            }
        }

        // Data Genius badge (track every meal, expense, and workout for 90 days)
        if (!badges.dataGenius) {
            const dataTrackingStreak = this.getDataTrackingStreak(data);
            if (dataTrackingStreak >= 90) {
                newBadges.dataGenius = true;
                badgesEarned.push('🧠 Data Genius');
            }
        }

        // Financial Guru badge (achieve positive cash flow for 12 months)
        if (!badges.financialGuru) {
            const positiveCashFlowMonths = this.getPositiveCashFlowMonths(expenses);
            if (positiveCashFlowMonths >= 12) {
                newBadges.financialGuru = true;
                badgesEarned.push('💰 Financial Guru');
            }
        }

        // Epic Transformation badge (complete all other achievements)
        if (!badges.epicTransformation) {
            const totalBadges = Object.keys(newBadges).length;
            const earnedBadges = Object.values(newBadges).filter(Boolean).length;
            // Check if all badges except this one are earned (subtract 1 for epicTransformation itself)
            if (earnedBadges >= totalBadges - 1) {
                newBadges.epicTransformation = true;
                badgesEarned.push('🦋 Epic Transformation');
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

    // Helper methods for badge checking
    static isSouthIndianFood(foodName) {
        const southIndianFoods = [
            'dosa', 'idli', 'sambar', 'rasam', 'vada', 'upma', 'pongal', 'uttapam',
            'coconut chutney', 'tomato rice', 'lemon rice', 'curd rice', 'tamarind rice',
            'appam', 'pathiri', 'puttu', 'kozhukattai', 'adhirasam', 'payasam',
            'avial', 'olan', 'thoran', 'pachadi', 'koottu', 'mor kuzhambu',
            'biryani', 'puliyodarai', 'bisi bele bath', 'chitranna'
        ];
        return southIndianFoods.some(food =>
            foodName.toLowerCase().includes(food.toLowerCase())
        );
    }

    static getHomeCookingDays(expenses) {
        // Count days without food delivery expenses
        const last30Days = expenses.filter(e =>
            Utils.getDaysDifference(new Date(), new Date(e.createdAt)) <= 30
        );

        const deliveryExpenses = last30Days.filter(e =>
            e.category === 'food' &&
            (e.notes?.toLowerCase().includes('delivery') ||
             e.notes?.toLowerCase().includes('order') ||
             e.notes?.toLowerCase().includes('zomato') ||
             e.notes?.toLowerCase().includes('swiggy'))
        );

        const deliveryDays = new Set(deliveryExpenses.map(e =>
            new Date(e.createdAt).toDateString()
        ));

        return Math.max(0, 30 - deliveryDays.size);
    }

    static getCalorieTrackingDays() {
        // This would need to be tracked separately - for now return mock value
        return Math.floor(Math.random() * 10);
    }

    static getMealPlanDays() {
        // This would need to be tracked separately - for now return mock value
        return Math.floor(Math.random() * 20);
    }

    static getWeeklyTaskCompletion(tasks) {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const weeklyTasks = tasks.filter(t => new Date(t.createdAt) >= weekAgo);
        const completedTasks = weeklyTasks.filter(t => t.completed);

        if (weeklyTasks.length === 0) return 0;
        return Math.round((completedTasks.length / weeklyTasks.length) * 100);
    }

    static getSectionsUsed() {
        // Check localStorage for usage of different sections
        const usageKeys = ['wlb_tasks', 'wlb_expenses', 'wlb_workouts', 'wlb_moods', 'wlb_food_items'];
        let sectionsUsed = 0;

        usageKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data && JSON.parse(data).length > 0) {
                sectionsUsed++;
            }
        });

        return sectionsUsed;
    }

    // Helper methods for tougher achievements
    static getHomeCookingRate(expenses, days) {
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const recentExpenses = expenses.filter(e => new Date(e.createdAt) >= cutoffDate);

        const foodExpenses = recentExpenses.filter(e => e.category === 'food');
        const deliveryExpenses = foodExpenses.filter(e =>
            e.notes?.toLowerCase().includes('delivery') ||
            e.notes?.toLowerCase().includes('order') ||
            e.notes?.toLowerCase().includes('zomato') ||
            e.notes?.toLowerCase().includes('swiggy')
        );

        if (foodExpenses.length === 0) return 0;
        return ((foodExpenses.length - deliveryExpenses.length) / foodExpenses.length) * 100;
    }

    static getLongTermSavingsRate(expenses, days) {
        const settings = window.storage.getSettings();
        const monthlyIncome = settings.monthlyIncome || 0;

        if (monthlyIncome === 0) return 0;

        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const recentExpenses = expenses.filter(e => new Date(e.createdAt) >= cutoffDate);
        const totalExpenses = recentExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

        const monthsInPeriod = days / 30;
        const totalIncome = monthlyIncome * monthsInPeriod;
        const totalSavings = totalIncome - totalExpenses;

        return totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
    }

    static getBudgetCompliance(expenses, days) {
        // This would need actual budget data - for now return a mock value based on expense patterns
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const recentExpenses = expenses.filter(e => new Date(e.createdAt) >= cutoffDate);

        // Simplified calculation - assume compliance is good if expenses are consistent
        const monthlyExpenses = recentExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) / (days / 30);
        return monthlyExpenses < 25000 ? 100 : Math.max(0, 100 - ((monthlyExpenses - 25000) / 1000));
    }

    static getPerfectTaskStreak(tasks) {
        // Calculate consecutive days with 100% task completion
        let streak = 0;
        let currentDate = new Date();

        for (let i = 0; i < 365; i++) { // Check up to 365 days back
            const checkDate = new Date(currentDate);
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = checkDate.toDateString();

            const dayTasks = tasks.filter(t =>
                new Date(t.createdAt).toDateString() === dateStr
            );

            if (dayTasks.length === 0) continue; // Skip days with no tasks

            const completedTasks = dayTasks.filter(t => t.completed);
            const completionRate = completedTasks.length / dayTasks.length;

            if (completionRate === 1.0) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    static getMoodStreak(moods) {
        // Calculate consecutive days with mood entries
        let streak = 0;
        let currentDate = new Date();

        for (let i = 0; i < 365; i++) { // Check up to 365 days back
            const checkDate = new Date(currentDate);
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = checkDate.toDateString();

            const dayMoods = moods.filter(m =>
                new Date(m.date).toDateString() === dateStr
            );

            if (dayMoods.length > 0) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    static getAppUsageStreak() {
        // This would need to track app usage - for now return mock based on localStorage activity
        const keys = ['wlb_tasks', 'wlb_expenses', 'wlb_workouts', 'wlb_moods'];
        let maxStreak = 0;

        keys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data) {
                try {
                    const items = JSON.parse(data);
                    const recentItems = items.filter(item =>
                        Utils.getDaysDifference(new Date(), new Date(item.createdAt || item.date)) <= 180
                    );
                    if (recentItems.length > 100) { // Active usage indicator
                        maxStreak = Math.max(maxStreak, 180);
                    }
                } catch (e) {
                    // Skip invalid data
                }
            }
        });

        return maxStreak;
    }

    static getAllHabitsStreak(data) {
        // Calculate streak where user maintains activity in all areas
        let minStreak = 365;

        // Check workout streak
        const workoutStreak = window.storage.getWorkoutStreak();
        minStreak = Math.min(minStreak, workoutStreak);

        // Check mood tracking streak
        const moodStreak = this.getMoodStreak(data.moods || []);
        minStreak = Math.min(minStreak, moodStreak);

        // Check task completion consistency
        const taskStreak = this.getPerfectTaskStreak(data.tasks || []);
        minStreak = Math.min(minStreak, taskStreak);

        return Math.max(0, minStreak);
    }

    static getDataTrackingStreak(data) {
        // Calculate consecutive days with entries in all categories
        let streak = 0;
        let currentDate = new Date();

        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(currentDate);
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = checkDate.toDateString();

            // Check if all data types have entries for this day
            const hasMeal = (data.meals || []).some(m =>
                new Date(m.date).toDateString() === dateStr
            );
            const hasExpense = (data.expenses || []).some(e =>
                new Date(e.createdAt).toDateString() === dateStr
            );
            const hasWorkout = (data.workouts || []).some(w =>
                new Date(w.createdAt).toDateString() === dateStr
            );

            if (hasMeal && hasExpense && hasWorkout) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    static getPositiveCashFlowMonths(expenses) {
        const settings = window.storage.getSettings();
        const monthlyIncome = settings.monthlyIncome || 0;

        if (monthlyIncome === 0) return 0;

        let positiveMonths = 0;
        const currentDate = new Date();

        for (let i = 0; i < 12; i++) {
            const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);

            const monthExpenses = expenses.filter(e => {
                const expenseDate = new Date(e.createdAt);
                return expenseDate >= monthStart && expenseDate <= monthEnd;
            }).reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

            if (monthlyIncome > monthExpenses) {
                positiveMonths++;
            } else {
                break; // Streak broken
            }
        }

        return positiveMonths;
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
        let csvContent = '';

        // Handle different data types based on what's available in the data
        if (data.tasks && !data.meals && !data.workouts) {
            // Pure tasks export
            csvContent = "Date,Title,Category,Status,Expense Related,Amount\n";
            data.tasks.forEach(task => {
                csvContent += `${Utils.formatDate(task.createdAt)},"${(task.title || '').replace(/"/g, '""')}",${task.category},${task.completed ? 'Completed' : 'Pending'},${task.expenseRelated ? 'Yes' : 'No'},${task.amount || ''}\n`;
            });
        } else if (data.meals && data.foodItems) {
            // Food & Nutrition export with multiple sheets
            csvContent = "Section,Date,Name,Type,Source,Calories,Cost,Notes\n";
            // Add meals
            data.meals.forEach(meal => {
                const cost = meal.source === 'home' ? (meal.ingredientCost || 0) : (meal.mealCost || 0);
                csvContent += `Meals,${Utils.formatDate(meal.date)},"${(meal.name || '').replace(/"/g, '""')}",${meal.type},${meal.source},${meal.calories},${cost},"${(meal.notes || '').replace(/"/g, '""')}"\n`;
            });
            // Add food items
            data.foodItems.forEach(item => {
                csvContent += `Pantry,${Utils.formatDate(item.createdAt || new Date())},"${(item.name || '').replace(/"/g, '""')}",Food Item,Pantry,${item.caloriesPer100g || 0},0,"${item.quantity} ${item.unit}"\n`;
            });
            // Add analytics if available
            if (data.analytics) {
                csvContent += `Analytics,${new Date().toISOString().split('T')[0]},Weekly Stats,Summary,Analytics,${data.analytics.averageCaloriesPerDay || 0},${data.analytics.totalMoneySaved || 0},"Home Cooking: ${data.analytics.homeCookingPercentage}%"\n`;
            }
        } else if (data.workouts && data.analytics) {
            // Fitness export
            csvContent = "Date,Exercise Type,Duration (minutes),Calories Burned,Notes\n";
            data.workouts.forEach(workout => {
                csvContent += `${Utils.formatDate(workout.createdAt)},${workout.type || 'General'},${workout.duration || 0},${workout.calories || 0},"${(workout.notes || '').replace(/"/g, '""')}"\n`;
            });
            // Add summary row
            csvContent += `Summary,Total Workouts: ${data.workouts.length},Total Duration: ${data.analytics.averageWorkoutDuration * data.workouts.length},Total Calories: ${data.analytics.caloriesBurned},"Streak: ${data.analytics.currentStreak} days"\n`;
        } else if (data.moods && data.analytics) {
            // Stress & Mood export
            csvContent = "Date,Mood,Stress Level (1-5),Notes,Patterns\n";
            data.moods.forEach(mood => {
                const stressLevel = { 'very-happy': 1, 'happy': 2, 'neutral': 3, 'stressed': 4, 'very-stressed': 5 }[mood.mood] || 3;
                csvContent += `${Utils.formatDate(mood.date)},${mood.mood},${stressLevel},"${(mood.notes || '').replace(/"/g, '""')}","${mood.tags ? mood.tags.join(', ') : ''}"\n`;
            });
            // Add analytics summary
            csvContent += `Summary,Weekly Average: ${data.analytics.weeklyMoodAverage},Trend: ${data.analytics.stressTrends || 'Stable'},,"Total Entries: ${data.analytics.totalMoodEntries}"\n`;
        } else if (data.totalGamesPlayed !== undefined || data.gameStats) {
            // Games export
            csvContent = "Game,Attempts,Completed,Success Rate %,Best Score,Best Time,Recent Activity\n";

            if (data.gameStats && typeof data.gameStats === 'object') {
                Object.entries(data.gameStats).forEach(([game, stats]) => {
                    const successRate = stats.attempts > 0 ? Math.round((stats.completed / stats.attempts) * 100) : 0;
                    const bestTime = stats.bestTime ? `${Math.floor(stats.bestTime / 60)}:${(stats.bestTime % 60).toString().padStart(2, '0')}` : 'N/A';
                    csvContent += `${game},${stats.attempts || 0},${stats.completed || 0},${successRate},${stats.bestScore || stats.highScore || 0},${bestTime},${stats.lastPlayed || 'N/A'}\n`;
                });
            }

            // Add recent games if available
            if (data.recentGames && data.recentGames.length > 0) {
                csvContent += "\nRecent Games\n";
                csvContent += "Date,Game,Result,Score,Duration\n";
                data.recentGames.forEach(game => {
                    const duration = game.elapsed ? `${Math.floor(game.elapsed / 60)}:${(game.elapsed % 60).toString().padStart(2, '0')}` : 'N/A';
                    csvContent += `${Utils.formatDate(game.timestamp)},${game.type},${game.result.won ? 'Won' : 'Lost'},${game.result.score || 0},${duration}\n`;
                });
            }

            // Add summary
            csvContent += `\nSummary\n`;
            csvContent += `Total Games Played,${data.totalGamesPlayed || 0}\n`;
            csvContent += `Total Score,${data.totalScore || 0}\n`;
            csvContent += `Game Streak,${data.gameStreak || 0}\n`;
            if (data.analytics) {
                csvContent += `Most Played Game,${data.analytics.mostPlayedGame || 'None'}\n`;
                csvContent += `Average Score,${data.analytics.averageScorePerGame || 0}\n`;
                csvContent += `Improvement Trend,${data.analytics.improvementTrend || 'Stable'}\n`;
            }
        } else if (data.expenses) {
            // Expenses export
            csvContent = "Date,Category,Amount,Notes,Payment Method\n";
            data.expenses.forEach(expense => {
                csvContent += `${Utils.formatDate(expense.createdAt)},${expense.category},${expense.amount},"${(expense.notes || '').replace(/"/g, '""')}",${expense.paymentMethod || 'cash'}\n`;
            });
        } else if (data.generatedAt && data.analytics) {
            // Comprehensive report export
            csvContent = "Section,Metric,Value,Details\n";
            csvContent += `Report Info,Generated At,${Utils.formatDate(data.generatedAt)},Comprehensive Life Balance Report\n`;
            csvContent += `Tasks,Completion Rate,${data.analytics.taskCompletionRate}%,${data.tasks ? data.tasks.length : 0} total tasks\n`;
            csvContent += `Expenses,Total Amount,${data.analytics.totalExpenses},Weekly: ${data.analytics.weeklyExpenses}\n`;
            csvContent += `Expenses,Daily Average,${data.analytics.dailyAverageExpense},Monthly: ${data.analytics.monthlyExpenses}\n`;
            csvContent += `Food,Home Cooking Rate,${data.analytics.homeCookingPercentage}%,Money Saved: ${data.analytics.moneySavedCooking}\n`;
            csvContent += `Food,Average Calories,${data.analytics.averageCaloriesPerDay},Per day\n`;
            csvContent += `Fitness,Workout Streak,${data.analytics.workoutStreak} days,Weekly Count: ${data.analytics.weeklyWorkoutCount}\n`;
            csvContent += `Fitness,Calories Burned,${data.analytics.totalCaloriesBurned},Total across all workouts\n`;
            csvContent += `Mood,Average Mood,${data.analytics.averageMood},Stress Trend: ${data.analytics.stressTrend}\n`;
            csvContent += `Games,Total Played,${data.games?.totalGamesPlayed || 0},Total Score: ${data.games?.totalScore || 0}\n`;
            csvContent += `Overall,Health Score,${data.analytics.overallHealthScore}/100,Comprehensive wellness metric\n`;
        } else {
            // Generic CSV for unknown data structure
            csvContent = "Type,Value,Description\n";
            Object.entries(data).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    csvContent += `${key},${value.length},"${key} records"\n`;
                } else if (typeof value === 'object' && value !== null) {
                    csvContent += `${key},"${JSON.stringify(value).replace(/"/g, '""')}","${key} data"\n`;
                } else {
                    csvContent += `${key},${value},"${key} value"\n`;
                }
            });
        }

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
