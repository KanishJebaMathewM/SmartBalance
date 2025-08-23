// Enhanced Charts and visualization utilities using Canvas API

class Charts {
    constructor() {
        this.colors = {
            primary: '#3b82f6',
            secondary: '#6366f1',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#06b6d4',
            purple: '#8b5cf6',
            pink: '#ec4899',
            gray: '#6b7280',
            slate: '#64748b',
            emerald: '#059669',
            orange: '#ea580c',
            teal: '#0d9488',
            cyan: '#0891b2',
            indigo: '#4f46e5',
            violet: '#7c3aed'
        };

        this.categoryColors = {
            food: '#ef4444',
            bills: '#3b82f6',
            shopping: '#8b5cf6',
            travel: '#06b6d4',
            entertainment: '#ec4899',
            healthcare: '#10b981',
            education: '#f59e0b',
            other: '#6b7280'
        };

        this.gradients = {};
    }

    // Create gradient for canvas
    createGradient(ctx, color1, color2, direction = 'vertical') {
        const gradient = direction === 'vertical'
            ? ctx.createLinearGradient(0, 0, 0, ctx.canvas.height)
            : ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);

        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        return gradient;
    }

    // Utility to get category color
    getCategoryColor(category) {
        return this.categoryColors[category] || this.colors.gray;
    }

    // Expense pie chart
    createExpensePieChart(canvasId, expenses) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Group expenses by category
        const categoryTotals = {};
        expenses.forEach(expense => {
            const category = expense.category;
            categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(expense.amount);
        });

        const categories = Object.keys(categoryTotals);
        if (categories.length === 0) {
            // Draw placeholder
            ctx.fillStyle = '#e5e7eb';
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = '#6b7280';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No expenses yet', centerX, centerY);
            return;
        }

        const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
        const colors = [
            this.colors.primary,
            this.colors.success,
            this.colors.warning,
            this.colors.error,
            this.colors.info,
            this.colors.purple,
            this.colors.pink
        ];

        let currentAngle = 0;
        
        categories.forEach((category, index) => {
            const value = categoryTotals[category];
            const sliceAngle = (value / total) * 2 * Math.PI;
            
            // Draw slice
            ctx.fillStyle = colors[index % colors.length];
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();

            // Draw slice border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(category, labelX, labelY);
            
            const percentage = ((value / total) * 100).toFixed(1);
            ctx.font = '10px Arial';
            ctx.fillText(`${percentage}%`, labelX, labelY + 15);

            currentAngle += sliceAngle;
        });

        // Draw legend
        this.drawLegend(ctx, categories, colors, canvas.width - 120, 20);
    }

    // Mood trend chart
    createMoodChart(canvasId, moods) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        if (moods.length === 0) {
            ctx.fillStyle = '#6b7280';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No mood data yet', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Sort moods by date
        const sortedMoods = moods.sort((a, b) => new Date(a.date) - new Date(b.date));
        const last7Days = sortedMoods.slice(-7);

        const moodValues = {
            'very-stressed': 1,
            'stressed': 2,
            'neutral': 3,
            'happy': 4,
            'very-happy': 5
        };

        // Draw axes
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.stroke();
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();

        // Y-axis labels
        const moodLabels = ['😭', '😓', '😐', '🙂', '😃'];
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        
        for (let i = 0; i < 5; i++) {
            const y = padding + chartHeight - (i * chartHeight / 4);
            ctx.fillText(moodLabels[i], padding - 10, y + 5);
            
            // Grid lines
            ctx.strokeStyle = '#f3f4f6';
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }

        if (last7Days.length === 0) return;

        // Draw mood line
        ctx.strokeStyle = this.colors.primary;
        ctx.lineWidth = 3;
        ctx.beginPath();

        const xStep = chartWidth / Math.max(last7Days.length - 1, 1);
        
        last7Days.forEach((mood, index) => {
            const x = padding + (index * xStep);
            const value = moodValues[mood.mood] || 3;
            const y = padding + chartHeight - ((value - 1) * chartHeight / 4);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();

        // Draw mood points
        last7Days.forEach((mood, index) => {
            const x = padding + (index * xStep);
            const value = moodValues[mood.mood] || 3;
            const y = padding + chartHeight - ((value - 1) * chartHeight / 4);
            
            ctx.fillStyle = Utils.getMoodColor(mood.mood);
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();
            
            // Date labels
            ctx.fillStyle = '#6b7280';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            const date = new Date(mood.date);
            const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
            ctx.fillText(dayLabel, x, padding + chartHeight + 20);
        });
    }

    // Weekly trends chart for report
    createTrendsChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 60;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        // Prepare weekly data
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            last7Days.push(date);
        }

        const weeklyData = last7Days.map(date => {
            const dateStr = date.toDateString();
            
            const dayTasks = data.tasks.filter(task => 
                new Date(task.createdAt).toDateString() === dateStr
            ).length;
            
            const dayExpenses = data.expenses.filter(expense =>
                new Date(expense.createdAt).toDateString() === dateStr
            ).reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
            
            const dayWorkouts = data.workouts.filter(workout =>
                new Date(workout.createdAt).toDateString() === dateStr
            ).length;

            return {
                date,
                tasks: dayTasks,
                expenses: dayExpenses / 100, // Scale down for chart
                workouts: dayWorkouts * 2 // Scale up for visibility
            };
        });

        // Draw axes
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.stroke();
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();

        // Find max values for scaling
        const maxTasks = Math.max(...weeklyData.map(d => d.tasks), 5);
        const maxExpenses = Math.max(...weeklyData.map(d => d.expenses), 5);
        const maxWorkouts = Math.max(...weeklyData.map(d => d.workouts), 5);
        const maxValue = Math.max(maxTasks, maxExpenses, maxWorkouts);

        // Draw lines for each metric
        const metrics = [
            { key: 'tasks', color: this.colors.primary, label: 'Tasks' },
            { key: 'expenses', color: this.colors.error, label: 'Expenses (₹100s)' },
            { key: 'workouts', color: this.colors.success, label: 'Workouts (x2)' }
        ];

        const xStep = chartWidth / (weeklyData.length - 1);

        metrics.forEach(metric => {
            ctx.strokeStyle = metric.color;
            ctx.lineWidth = 2;
            ctx.beginPath();

            weeklyData.forEach((day, index) => {
                const x = padding + (index * xStep);
                const value = day[metric.key];
                const y = padding + chartHeight - (value / maxValue * chartHeight);

                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });

            ctx.stroke();

            // Draw points
            weeklyData.forEach((day, index) => {
                const x = padding + (index * xStep);
                const value = day[metric.key];
                const y = padding + chartHeight - (value / maxValue * chartHeight);

                ctx.fillStyle = metric.color;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fill();
            });
        });

        // Draw X-axis labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        
        weeklyData.forEach((day, index) => {
            const x = padding + (index * xStep);
            const dayLabel = day.date.toLocaleDateString('en-US', { weekday: 'short' });
            ctx.fillText(dayLabel, x, padding + chartHeight + 20);
        });

        // Draw legend
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        
        metrics.forEach((metric, index) => {
            const legendY = 20 + (index * 20);
            ctx.fillStyle = metric.color;
            ctx.fillRect(20, legendY - 10, 15, 15);
            ctx.fillStyle = '#374151';
            ctx.fillText(metric.label, 45, legendY);
        });
    }

    // Helper method to draw legend
    drawLegend(ctx, labels, colors, x, y) {
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        
        labels.forEach((label, index) => {
            const legendY = y + (index * 20);
            
            // Color box
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(x, legendY - 10, 15, 15);
            
            // Label text
            ctx.fillStyle = '#374151';
            ctx.fillText(label, x + 25, legendY);
        });
    }

    // Simple bar chart for expenses by category
    createExpenseBarChart(canvasId, expenses) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 60;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        // Group expenses by category
        const categoryTotals = {};
        expenses.forEach(expense => {
            const category = expense.category;
            categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(expense.amount);
        });

        const categories = Object.keys(categoryTotals);
        if (categories.length === 0) return;

        const maxValue = Math.max(...Object.values(categoryTotals));
        const barWidth = chartWidth / categories.length * 0.8;
        const barSpacing = chartWidth / categories.length * 0.2;

        // Draw axes
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.stroke();
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();

        // Draw bars
        categories.forEach((category, index) => {
            const value = categoryTotals[category];
            const barHeight = (value / maxValue) * chartHeight;
            const x = padding + (index * (barWidth + barSpacing)) + barSpacing / 2;
            const y = padding + chartHeight - barHeight;

            ctx.fillStyle = this.colors.primary;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Category label
            ctx.fillStyle = '#374151';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.save();
            ctx.translate(x + barWidth / 2, padding + chartHeight + 15);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(category, 0, 0);
            ctx.restore();

            // Value label
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            if (barHeight > 20) {
                ctx.fillText(`₹${value}`, x + barWidth / 2, y + 15);
            }
        });
    }

    // Enhanced Weekly Trend Chart
    createWeeklyTrendChart(canvasId, expenses) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        // Get last 7 days data
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            last7Days.push(date);
        }

        const dailyData = last7Days.map(date => {
            const dateStr = date.toDateString();
            const dayExpenses = expenses.filter(expense =>
                new Date(expense.createdAt).toDateString() === dateStr
            ).reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

            return {
                date,
                amount: dayExpenses,
                day: date.toLocaleDateString('en-US', { weekday: 'short' })
            };
        });

        const maxAmount = Math.max(...dailyData.map(d => d.amount), 100);

        // Draw axes
        this.drawAxes(ctx, padding, chartWidth, chartHeight);

        // Draw trend line with gradient
        const gradient = this.createGradient(ctx, this.colors.primary + '40', this.colors.primary + '10');

        ctx.strokeStyle = this.colors.primary;
        ctx.lineWidth = 3;
        ctx.beginPath();

        const xStep = chartWidth / (dailyData.length - 1);

        // Draw line
        dailyData.forEach((day, index) => {
            const x = padding + (index * xStep);
            const y = padding + chartHeight - (day.amount / maxAmount * chartHeight);

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Fill area under curve
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw points
        dailyData.forEach((day, index) => {
            const x = padding + (index * xStep);
            const y = padding + chartHeight - (day.amount / maxAmount * chartHeight);

            ctx.fillStyle = this.colors.primary;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();

            // Amount labels
            if (day.amount > 0) {
                ctx.fillStyle = '#374151';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`₹${Math.round(day.amount)}`, x, y - 10);
            }
        });

        // X-axis labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';

        dailyData.forEach((day, index) => {
            const x = padding + (index * xStep);
            ctx.fillText(day.day, x, padding + chartHeight + 20);
        });
    }

    // Spending Trend Chart with multiple periods
    createSpendingTrendChart(canvasId, expenses, period = 'month') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 60;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        let periodData = [];

        switch (period) {
            case 'week':
                periodData = this.getWeeklyData(expenses, 7);
                break;
            case 'month':
                periodData = this.getDailyData(expenses, 30);
                break;
            case '3months':
                periodData = this.getWeeklyData(expenses, 12);
                break;
            case 'year':
                periodData = this.getMonthlyData(expenses, 12);
                break;
        }

        if (periodData.length === 0) {
            this.drawEmptyChart(ctx, canvas, 'No data available');
            return;
        }

        const maxAmount = Math.max(...periodData.map(d => d.amount), 100);

        // Draw axes
        this.drawAxes(ctx, padding, chartWidth, chartHeight);

        // Draw grid lines
        this.drawGridLines(ctx, padding, chartWidth, chartHeight, 5);

        // Draw area chart
        const gradient = this.createGradient(ctx, this.colors.primary + '40', this.colors.primary + '10');

        ctx.beginPath();
        periodData.forEach((data, index) => {
            const x = padding + (index / (periodData.length - 1)) * chartWidth;
            const y = padding + chartHeight - (data.amount / maxAmount * chartHeight);

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        // Complete the area
        const lastX = padding + chartWidth;
        ctx.lineTo(lastX, padding + chartHeight);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw line
        ctx.strokeStyle = this.colors.primary;
        ctx.lineWidth = 2;
        ctx.beginPath();
        periodData.forEach((data, index) => {
            const x = padding + (index / (periodData.length - 1)) * chartWidth;
            const y = padding + chartHeight - (data.amount / maxAmount * chartHeight);

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw labels
        this.drawPeriodLabels(ctx, periodData, padding, chartWidth, chartHeight, period);
    }

    // Category Analysis Charts (Pie, Bar, Doughnut)
    createCategoryAnalysisChart(canvasId, expenses, chartType = 'pie') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        switch (chartType) {
            case 'pie':
                this.createExpensePieChart(canvasId, expenses);
                break;
            case 'bar':
                this.createExpenseBarChart(canvasId, expenses);
                break;
            case 'doughnut':
                this.createDoughnutChart(canvasId, expenses);
                break;
        }
    }

    // Doughnut Chart
    createDoughnutChart(canvasId, expenses) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const outerRadius = Math.min(centerX, centerY) - 40;
        const innerRadius = outerRadius * 0.6;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Group expenses by category
        const categoryTotals = {};
        expenses.forEach(expense => {
            const category = expense.category;
            categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(expense.amount);
        });

        const categories = Object.keys(categoryTotals);
        if (categories.length === 0) {
            this.drawEmptyChart(ctx, canvas, 'No expense data');
            return;
        }

        const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
        let currentAngle = -Math.PI / 2;

        categories.forEach((category, index) => {
            const value = categoryTotals[category];
            const sliceAngle = (value / total) * 2 * Math.PI;

            // Draw doughnut slice
            ctx.fillStyle = this.getCategoryColor(category);
            ctx.beginPath();
            ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
            ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
            ctx.closePath();
            ctx.fill();

            // Draw slice border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            currentAngle += sliceAngle;
        });

        // Draw center text
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Total', centerX, centerY - 10);
        ctx.font = 'bold 20px Arial';
        ctx.fillText(Utils.formatCurrency(total), centerX, centerY + 15);

        // Draw legend
        this.drawLegend(ctx, categories, categories.map(cat => this.getCategoryColor(cat)), canvas.width - 150, 40);
    }

    // Payment Method Analysis Chart
    createPaymentMethodChart(canvasId, expenses) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 60;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        // Get payment method data
        const paymentData = this.getPaymentMethodData(expenses);

        if (paymentData.length === 0) {
            this.drawEmptyChart(ctx, canvas, 'No payment method data available');
            return;
        }

        const maxValue = Math.max(...paymentData.map(d => d.amount));

        // Draw axes
        this.drawAxes(ctx, padding, chartWidth, chartHeight);

        // Draw bars
        const barWidth = chartWidth / paymentData.length * 0.7;
        const barSpacing = chartWidth / paymentData.length * 0.3;

        const methodColors = {
            cash: '#10b981',     // Green
            card: '#3b82f6',     // Blue
            upi: '#f59e0b',      // Orange
            bank: '#8b5cf6',     // Purple
            wallet: '#ec4899'    // Pink
        };

        paymentData.forEach((data, index) => {
            const x = padding + (index * (barWidth + barSpacing)) + barSpacing / 2;
            const barHeight = (data.amount / maxValue) * chartHeight;
            const y = padding + chartHeight - barHeight;

            const color = methodColors[data.method] || '#6b7280';
            ctx.fillStyle = color;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Method label
            ctx.fillStyle = '#374151';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(data.displayName, x + barWidth / 2, padding + chartHeight + 20);

            // Amount and percentage
            ctx.fillStyle = color;
            ctx.font = 'bold 10px Arial';
            ctx.fillText(`₹${data.amount.toLocaleString()}`, x + barWidth / 2, y - 15);
            ctx.fillText(`${data.percentage}%`, x + barWidth / 2, y - 5);

            // Transaction count
            ctx.fillStyle = '#6b7280';
            ctx.font = '9px Arial';
            ctx.fillText(`${data.count} txns`, x + barWidth / 2, padding + chartHeight + 35);
        });
    }

    // Comparison Chart (Month-over-month, Week-over-week, etc.)
    createComparisonChart(canvasId, expenses, comparisonType = 'month-over-month') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 60;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        let comparisonData = [];

        switch (comparisonType) {
            case 'month-over-month':
                comparisonData = this.getMonthOverMonthData(expenses);
                break;
            case 'week-over-week':
                comparisonData = this.getWeekOverWeekData(expenses);
                break;
            case 'year-over-year':
                comparisonData = this.getYearOverYearData(expenses);
                break;
        }

        if (comparisonData.length === 0) {
            this.drawEmptyChart(ctx, canvas, 'No comparison data available');
            return;
        }

        const maxValue = Math.max(...comparisonData.flatMap(d => [d.current, d.previous]), 100);

        // Draw axes
        this.drawAxes(ctx, padding, chartWidth, chartHeight);

        // Draw grouped bars
        const groupWidth = chartWidth / comparisonData.length;
        const barWidth = groupWidth * 0.35;
        const barSpacing = groupWidth * 0.1;

        comparisonData.forEach((data, index) => {
            const groupX = padding + (index * groupWidth);

            // Current period bar
            const currentHeight = (data.current / maxValue) * chartHeight;
            const currentY = padding + chartHeight - currentHeight;
            ctx.fillStyle = this.colors.primary;
            ctx.fillRect(groupX + barSpacing, currentY, barWidth, currentHeight);

            // Previous period bar
            const previousHeight = (data.previous / maxValue) * chartHeight;
            const previousY = padding + chartHeight - previousHeight;
            ctx.fillStyle = this.colors.gray;
            ctx.fillRect(groupX + barSpacing + barWidth + 5, previousY, barWidth, previousHeight);

            // Labels
            ctx.fillStyle = '#374151';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(data.label, groupX + groupWidth / 2, padding + chartHeight + 20);
        });

        // Legend
        this.drawSimpleLegend(ctx, ['Current', 'Previous'], [this.colors.primary, this.colors.gray], 20, 20);
    }

    // Habit Impact Chart
    createHabitImpactChart(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 60;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        // Generate sample data for the last 30 days
        const last30Days = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            last30Days.push(date);
        }

        // Sample data for different life areas
        const habitData = last30Days.map((date, index) => ({
            date,
            fitness: Math.random() * 100,
            nutrition: Math.random() * 100,
            productivity: Math.random() * 100,
            wellness: Math.random() * 100,
            overall: Math.random() * 100
        }));

        // Draw axes
        this.drawAxes(ctx, padding, chartWidth, chartHeight);

        // Draw multiple lines for different habit categories
        const metrics = [
            { key: 'fitness', color: this.colors.success, label: 'Fitness' },
            { key: 'nutrition', color: this.colors.warning, label: 'Nutrition' },
            { key: 'productivity', color: this.colors.primary, label: 'Productivity' },
            { key: 'wellness', color: this.colors.purple, label: 'Wellness' },
            { key: 'overall', color: this.colors.error, label: 'Overall' }
        ];

        const xStep = chartWidth / (habitData.length - 1);

        metrics.forEach(metric => {
            ctx.strokeStyle = metric.color;
            ctx.lineWidth = 2;
            ctx.beginPath();

            habitData.forEach((day, index) => {
                const x = padding + (index * xStep);
                const y = padding + chartHeight - (day[metric.key] / 100 * chartHeight);

                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });

            ctx.stroke();

            // Draw points
            habitData.forEach((day, index) => {
                const x = padding + (index * xStep);
                const y = padding + chartHeight - (day[metric.key] / 100 * chartHeight);

                ctx.fillStyle = metric.color;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fill();
            });
        });

        // Draw legend
        this.drawHabitLegend(ctx, metrics, canvas.width - 150, 20);

        // Draw X-axis labels (dates)
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';

        for (let i = 0; i < habitData.length; i += 5) {
            const x = padding + (i * xStep);
            const dayLabel = habitData[i].date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            ctx.fillText(dayLabel, x, padding + chartHeight + 20);
        }

        // Draw Y-axis labels
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const y = padding + (i * chartHeight / 5);
            const value = 100 - (i * 20);
            ctx.fillText(`${value}%`, padding - 10, y + 5);
        }
    }

    // Habit Trends Chart
    createHabitTrendsChart(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 50;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        // Generate weekly trend data
        const weeklyData = [];
        for (let i = 11; i >= 0; i--) {
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - (i * 7));

            weeklyData.push({
                week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                completion: 60 + Math.random() * 30, // 60-90% completion rate
                streakAvg: Math.random() * 10,
                newHabits: Math.floor(Math.random() * 3)
            });
        }

        // Draw axes
        this.drawAxes(ctx, padding, chartWidth, chartHeight);

        // Draw completion rate line
        ctx.strokeStyle = this.colors.primary;
        ctx.lineWidth = 3;
        ctx.beginPath();

        const xStep = chartWidth / (weeklyData.length - 1);

        weeklyData.forEach((week, index) => {
            const x = padding + (index * xStep);
            const y = padding + chartHeight - (week.completion / 100 * chartHeight);

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw completion rate points
        weeklyData.forEach((week, index) => {
            const x = padding + (index * xStep);
            const y = padding + chartHeight - (week.completion / 100 * chartHeight);

            ctx.fillStyle = this.colors.primary;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();

            // Add value labels
            ctx.fillStyle = '#374151';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${Math.round(week.completion)}%`, x, y - 10);
        });

        // Draw X-axis labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';

        weeklyData.forEach((week, index) => {
            if (index % 2 === 0) { // Show every other label to avoid crowding
                const x = padding + (index * xStep);
                ctx.fillText(week.week, x, padding + chartHeight + 20);
            }
        });

        // Draw Y-axis labels
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const y = padding + (i * chartHeight / 5);
            const value = 100 - (i * 20);
            ctx.fillText(`${value}%`, padding - 10, y + 5);
        }

        // Add chart title
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Weekly Habit Completion Trends', canvas.width / 2, 25);
    }

    // Helper method for habit legend
    drawHabitLegend(ctx, metrics, x, y) {
        ctx.font = '11px Arial';
        ctx.textAlign = 'left';

        metrics.forEach((metric, index) => {
            const legendY = y + (index * 18);

            // Color line
            ctx.strokeStyle = metric.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x, legendY - 5);
            ctx.lineTo(x + 20, legendY - 5);
            ctx.stroke();

            // Label text
            ctx.fillStyle = '#374151';
            ctx.fillText(metric.label, x + 25, legendY);
        });
    }

    // Correlation Heatmap for habits
    createHabitCorrelationHeatmap(canvasId, correlationData) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const categories = ['Fitness', 'Nutrition', 'Productivity', 'Wellness'];
        const cellSize = 60;
        const padding = 80;

        // Draw heatmap grid
        categories.forEach((category1, i) => {
            categories.forEach((category2, j) => {
                const x = padding + (j * cellSize);
                const y = padding + (i * cellSize);

                // Calculate correlation strength (mock data)
                const correlation = Math.random();
                const intensity = Math.floor(correlation * 255);

                ctx.fillStyle = `rgba(59, 130, 246, ${correlation})`;
                ctx.fillRect(x, y, cellSize, cellSize);

                // Add correlation value
                ctx.fillStyle = correlation > 0.5 ? '#ffffff' : '#000000';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(
                    (correlation * 100).toFixed(0) + '%',
                    x + cellSize / 2,
                    y + cellSize / 2 + 5
                );
            });
        });

        // Draw labels
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';

        // Top labels
        categories.forEach((category, i) => {
            const x = padding + (i * cellSize) + cellSize / 2;
            ctx.fillText(category, x, padding - 10);
        });

        // Left labels
        ctx.textAlign = 'right';
        categories.forEach((category, i) => {
            const y = padding + (i * cellSize) + cellSize / 2 + 5;
            ctx.fillText(category, padding - 10, y);
        });
    }

    // Helper methods for data processing
    getWeeklyData(expenses, weeks) {
        const data = [];
        for (let i = weeks - 1; i >= 0; i--) {
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - (i * 7));
            weekStart.setHours(0, 0, 0, 0);

            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            weekEnd.setHours(23, 59, 59, 999);

            const weekExpenses = expenses.filter(expense => {
                const expenseDate = new Date(expense.createdAt);
                return expenseDate >= weekStart && expenseDate <= weekEnd;
            });

            const amount = weekExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
            data.push({
                period: `Week ${i + 1}`,
                amount,
                date: weekStart
            });
        }
        return data;
    }

    getDailyData(expenses, days) {
        const data = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);

            const dayExpenses = expenses.filter(expense => {
                const expenseDate = new Date(expense.createdAt);
                return expenseDate >= date && expenseDate <= dayEnd;
            });

            const amount = dayExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
            data.push({
                period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                amount,
                date
            });
        }
        return data;
    }

    getMonthlyData(expenses, months) {
        const data = [];
        for (let i = months - 1; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            date.setDate(1);
            date.setHours(0, 0, 0, 0);

            const monthEnd = new Date(date);
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            monthEnd.setDate(0);
            monthEnd.setHours(23, 59, 59, 999);

            const monthExpenses = expenses.filter(expense => {
                const expenseDate = new Date(expense.createdAt);
                return expenseDate >= date && expenseDate <= monthEnd;
            });

            const amount = monthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
            data.push({
                period: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                amount,
                date
            });
        }
        return data;
    }

    getPaymentMethodData(expenses) {
        const methodTotals = {};
        const methodCounts = {};
        const methodNames = {
            cash: '💵 Cash',
            card: '💳 Card',
            upi: '📱 UPI',
            bank: '🏦 Bank Transfer',
            wallet: '📱 Wallet'
        };

        let totalAmount = 0;

        // Group expenses by payment method
        expenses.forEach(expense => {
            const method = expense.paymentMethod || 'cash';
            const amount = parseFloat(expense.amount) || 0;

            methodTotals[method] = (methodTotals[method] || 0) + amount;
            methodCounts[method] = (methodCounts[method] || 0) + 1;
            totalAmount += amount;
        });

        // Convert to array and calculate percentages
        const paymentData = Object.keys(methodTotals).map(method => {
            const amount = methodTotals[method];
            const percentage = totalAmount > 0 ? ((amount / totalAmount) * 100).toFixed(1) : 0;

            return {
                method,
                displayName: methodNames[method] || method,
                amount,
                count: methodCounts[method],
                percentage: parseFloat(percentage)
            };
        });

        // Sort by amount (highest first)
        return paymentData.sort((a, b) => b.amount - a.amount);
    }

    getMonthOverMonthData(expenses) {
        const thisMonth = new Date();
        thisMonth.setDate(1);

        const lastMonth = new Date(thisMonth);
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const thisMonthEnd = new Date(thisMonth);
        thisMonthEnd.setMonth(thisMonthEnd.getMonth() + 1);
        thisMonthEnd.setDate(0);

        const lastMonthEnd = new Date(lastMonth);
        lastMonthEnd.setMonth(lastMonthEnd.getMonth() + 1);
        lastMonthEnd.setDate(0);

        const thisMonthExpenses = expenses.filter(expense => {
            const date = new Date(expense.createdAt);
            return date >= thisMonth && date <= thisMonthEnd;
        }).reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

        const lastMonthExpenses = expenses.filter(expense => {
            const date = new Date(expense.createdAt);
            return date >= lastMonth && date <= lastMonthEnd;
        }).reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

        return [{
            label: 'This vs Last Month',
            current: thisMonthExpenses,
            previous: lastMonthExpenses
        }];
    }

    getWeekOverWeekData(expenses) {
        const thisWeek = new Date();
        thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());

        const lastWeek = new Date(thisWeek);
        lastWeek.setDate(lastWeek.getDate() - 7);

        const thisWeekEnd = new Date(thisWeek);
        thisWeekEnd.setDate(thisWeekEnd.getDate() + 6);

        const lastWeekEnd = new Date(lastWeek);
        lastWeekEnd.setDate(lastWeekEnd.getDate() + 6);

        const thisWeekExpenses = expenses.filter(expense => {
            const date = new Date(expense.createdAt);
            return date >= thisWeek && date <= thisWeekEnd;
        }).reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

        const lastWeekExpenses = expenses.filter(expense => {
            const date = new Date(expense.createdAt);
            return date >= lastWeek && date <= lastWeekEnd;
        }).reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

        return [{
            label: 'This vs Last Week',
            current: thisWeekExpenses,
            previous: lastWeekExpenses
        }];
    }

    getYearOverYearData(expenses) {
        const thisYear = new Date().getFullYear();
        const lastYear = thisYear - 1;

        const thisYearExpenses = expenses.filter(expense => {
            return new Date(expense.createdAt).getFullYear() === thisYear;
        }).reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

        const lastYearExpenses = expenses.filter(expense => {
            return new Date(expense.createdAt).getFullYear() === lastYear;
        }).reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

        return [{
            label: `${thisYear} vs ${lastYear}`,
            current: thisYearExpenses,
            previous: lastYearExpenses
        }];
    }

    // Helper drawing methods
    drawAxes(ctx, padding, chartWidth, chartHeight) {
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;

        // Y-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.stroke();

        // X-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();
    }

    drawGridLines(ctx, padding, chartWidth, chartHeight, lineCount) {
        ctx.strokeStyle = '#f3f4f6';
        ctx.lineWidth = 1;

        for (let i = 1; i <= lineCount; i++) {
            const y = padding + (i * chartHeight / (lineCount + 1));
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }
    }

    drawEmptyChart(ctx, canvas, message) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    }

    drawPeriodLabels(ctx, data, padding, chartWidth, chartHeight, period) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';

        const labelCount = Math.min(data.length, 8); // Limit labels to avoid crowding
        const step = Math.floor(data.length / labelCount);

        for (let i = 0; i < data.length; i += step) {
            const x = padding + (i / (data.length - 1)) * chartWidth;
            ctx.fillText(data[i].period, x, padding + chartHeight + 20);
        }
    }

    drawSimpleLegend(ctx, labels, colors, x, y) {
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';

        labels.forEach((label, index) => {
            const legendY = y + (index * 20);

            // Color box
            ctx.fillStyle = colors[index];
            ctx.fillRect(x, legendY - 10, 15, 15);

            // Label text
            ctx.fillStyle = '#374151';
            ctx.fillText(label, x + 25, legendY);
        });
    }
}

// Make Charts available globally
window.Charts = new Charts();
