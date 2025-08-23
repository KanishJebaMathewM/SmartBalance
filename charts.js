// Charts and visualization utilities using Canvas API

class Charts {
    constructor() {
        this.colors = {
            primary: '#3b82f6',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#06b6d4',
            purple: '#8b5cf6',
            pink: '#ec4899',
            gray: '#6b7280'
        };
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
}

// Make Charts available globally
window.Charts = new Charts();