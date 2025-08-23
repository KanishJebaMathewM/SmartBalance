// Timer enhancement methods for WorkLifeBalanceApp

// Add these methods to the WorkLifeBalanceApp class

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
        this.completeExercise(this.currentExerciseType, exercise);
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