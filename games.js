// Games Module - Handles all game functionality

class GamesManager {
    constructor() {
        this.currentGame = null;
        this.gameTimers = {};
        this.gameData = {
            stats: {
                totalGamesPlayed: 0,
                gameStreak: 0,
                totalScore: 0,
                averageTime: 0
            },
            games: {
                '8queens': { bestScore: 0, attempts: 0, completed: 0 },
                'sudoku': { completed: 0, bestTime: null },
                'colorpattern': { bestLevel: 0, bestScore: 0 },
                '2048': { highScore: 0, bestTile: 0 },
                'memory': { bestMoves: null, completed: 0 },
                'snake': { highScore: 0, longest: 0 }
            },
            recentGames: [],
            achievements: []
        };

        this.loadGameData();
        this.initializeGames();
    }

    // Initialize all games
    initializeGames() {
        // Use enhanced 8 Queens with Colors implementation if available
        if (typeof EightQueensGameEnhanced !== 'undefined') {
            this.queens = new EightQueensGameEnhanced();
        } else {
            this.queens = new EightQueensGame();
        }
        this.sudoku = new SudokuGame();
        this.colorPattern = new ColorPatternGame();
        this.game2048 = new Game2048();
        this.memory = new MemoryGame();
        this.snake = new SnakeGame();

        this.updateGameStats();
        this.loadRecentGames();
    }

    // Start a specific game
    startGame(gameType) {
        console.log('Starting game:', gameType);
        
        switch(gameType) {
            case '8queens':
                this.openModal('queensGameModal');
                this.queens.startGame();
                break;
            case 'sudoku':
                this.openModal('sudokuGameModal');
                this.sudoku.startGame();
                break;
            case 'colorpattern':
                this.openModal('colorPatternGameModal');
                this.colorPattern.startGame();
                break;
            case '2048':
                this.openModal('2048GameModal');
                this.game2048.startGame();
                break;
            case 'memory':
                this.openModal('memoryGameModal');
                this.memory.startGame();
                break;
            case 'snake':
                this.openModal('snakeGameModal');
                this.snake.startGame();
                break;
        }
        
        this.currentGame = gameType;
        this.startGameTimer(gameType);
    }

    // Game timer functionality
    startGameTimer(gameType) {
        if (this.gameTimers[gameType]) {
            clearInterval(this.gameTimers[gameType].interval);
        }

        this.gameTimers[gameType] = {
            startTime: Date.now(),
            interval: null
        };

        // Start timer display for applicable games
        if (['8queens', 'sudoku', 'memory'].includes(gameType)) {
            const timerElement = document.getElementById(`${gameType === '8queens' ? 'queens' : gameType}Timer`);
            if (timerElement) {
                this.gameTimers[gameType].interval = setInterval(() => {
                    const elapsed = Math.floor((Date.now() - this.gameTimers[gameType].startTime) / 1000);
                    timerElement.textContent = this.formatTime(elapsed);
                }, 1000);
            }
        }
    }

    // Stop game timer
    stopGameTimer(gameType) {
        if (this.gameTimers[gameType]) {
            clearInterval(this.gameTimers[gameType].interval);
            const elapsed = Math.floor((Date.now() - this.gameTimers[gameType].startTime) / 1000);
            delete this.gameTimers[gameType];
            return elapsed;
        }
        return 0;
    }

    // Format time display
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Game completion handler
    onGameComplete(gameType, result) {
        const elapsed = this.stopGameTimer(gameType);
        
        // Update game-specific stats
        this.updateGameStats(gameType, result, elapsed);
        
        // Add to recent games
        this.addRecentGame(gameType, result, elapsed);
        
        // Update UI
        this.updateGameStatsDisplay();
        
        // Save data
        this.saveGameData();
        
        console.log(`Game ${gameType} completed:`, result);
    }

    // Update game statistics
    updateGameStats(gameType = null, result = null, elapsed = 0) {
        if (gameType && result) {
            this.gameData.stats.totalGamesPlayed++;
            
            // Update game-specific stats
            const gameStats = this.gameData.games[gameType];
            if (result.won) {
                gameStats.completed++;
                if (elapsed > 0 && (!gameStats.bestTime || elapsed < gameStats.bestTime)) {
                    gameStats.bestTime = elapsed;
                }
            }
            
            if (result.score) {
                this.gameData.stats.totalScore += result.score;
                if (result.score > gameStats.highScore) {
                    gameStats.highScore = result.score;
                }
            }

            // Update game-specific metrics
            if (gameType === '8queens') {
                gameStats.attempts++;
                if (result.score && result.score > gameStats.bestScore) {
                    gameStats.bestScore = result.score;
                }
            } else if (gameType === '2048') {
                if (result.bestTile > gameStats.bestTile) {
                    gameStats.bestTile = result.bestTile;
                }
            } else if (gameType === 'memory') {
                if (!gameStats.bestMoves || result.moves < gameStats.bestMoves) {
                    gameStats.bestMoves = result.moves;
                }
            } else if (gameType === 'snake') {
                if (result.length > gameStats.longest) {
                    gameStats.longest = result.length;
                }
            }
        }

        // Calculate average time
        const totalCompletedGames = Object.values(this.gameData.games)
            .reduce((sum, game) => sum + game.completed, 0);
        
        if (totalCompletedGames > 0) {
            this.gameData.stats.averageTime = Math.floor(
                this.gameData.stats.totalScore / totalCompletedGames
            );
        }
    }

    // Update game stats display
    updateGameStatsDisplay() {
        const stats = this.gameData.stats;
        const games = this.gameData.games;

        // Update overview stats
        document.getElementById('totalGamesPlayed').textContent = stats.totalGamesPlayed;
        document.getElementById('gameStreak').textContent = stats.gameStreak;
        document.getElementById('totalScore').textContent = stats.totalScore;
        document.getElementById('averageTime').textContent = this.formatTime(stats.averageTime);

        // Update individual game stats
        const queensBestScoreEl = document.getElementById('queens-best-score');
        if (queensBestScoreEl) {
            queensBestScoreEl.textContent = `Best Score: ${games['8queens'].bestScore || '--'}`;
        }
        const queensAttemptsEl = document.getElementById('queens-attempts');
        if (queensAttemptsEl) {
            queensAttemptsEl.textContent = `Attempts: ${games['8queens'].attempts}`;
        }

        document.getElementById('sudoku-completed').textContent = 
            `Completed: ${games.sudoku.completed}`;
        document.getElementById('sudoku-best-time').textContent = 
            `Best: ${games.sudoku.bestTime ? this.formatTime(games.sudoku.bestTime) : '--'}`;

        document.getElementById('2048-high-score').textContent = 
            `High Score: ${games['2048'].highScore}`;
        document.getElementById('2048-best-tile').textContent = 
            `Best Tile: ${games['2048'].bestTile}`;

        document.getElementById('memory-best-moves').textContent = 
            `Best: ${games.memory.bestMoves ? games.memory.bestMoves + ' moves' : '-- moves'}`;
        document.getElementById('memory-completed').textContent = 
            `Completed: ${games.memory.completed}`;

        document.getElementById('snake-high-score').textContent = 
            `High Score: ${games.snake.highScore}`;
        document.getElementById('snake-longest').textContent = 
            `Longest: ${games.snake.longest}`;
    }

    // Add recent game
    addRecentGame(gameType, result, elapsed) {
        const recentGame = {
            type: gameType,
            result: result,
            elapsed: elapsed,
            timestamp: new Date().toISOString()
        };

        this.gameData.recentGames.unshift(recentGame);
        if (this.gameData.recentGames.length > 10) {
            this.gameData.recentGames.pop();
        }
    }

    // Load recent games display
    loadRecentGames() {
        const container = document.getElementById('recentGamesList');
        if (!container) return;

        if (this.gameData.recentGames.length === 0) {
            container.innerHTML = '<p>No recent games yet. Start playing to see your game history!</p>';
            return;
        }

        container.innerHTML = this.gameData.recentGames.map(game => `
            <div class="recent-game-item">
                <div class="game-name">${this.getGameDisplayName(game.type)}</div>
                <div class="game-result">${game.result.won ? '🏆 Won' : '❌ Lost'}</div>
                <div class="game-time">${this.formatTime(game.elapsed)}</div>
                <div class="game-date">${new Date(game.timestamp).toLocaleDateString()}</div>
            </div>
        `).join('');
    }

    // Get game display name
    getGameDisplayName(gameType) {
        const names = {
            '8queens': '8 Queens',
            'sudoku': 'Sudoku',
            '2048': '2048',
            'memory': 'Memory Cards',
            'snake': 'Snake'
        };
        return names[gameType] || gameType;
    }

    // Modal functionality
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
        
        // Stop any running game timer
        Object.keys(this.gameTimers).forEach(gameType => {
            this.stopGameTimer(gameType);
        });
    }

    // Data persistence
    saveGameData() {
        localStorage.setItem('gamesData', JSON.stringify(this.gameData));
    }

    loadGameData() {
        const saved = localStorage.getItem('gamesData');
        if (saved) {
            this.gameData = { ...this.gameData, ...JSON.parse(saved) };
        }
    }
}

// 8 Queens Game Implementation
class EightQueensGame {
    constructor() {
        this.board = Array(8).fill().map(() => Array(8).fill(false));
        this.queens = [];
        this.conflicts = 0;
    }

    startGame() {
        this.reset();
        this.renderBoard();
        this.setupEventListeners();
    }

    reset() {
        this.board = Array(8).fill().map(() => Array(8).fill(false));
        this.queens = [];
        this.conflicts = 0;
        this.updateProgress();
    }

    renderBoard() {
        const boardElement = document.getElementById('queensBoard');
        if (!boardElement) return;

        boardElement.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `queens-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                if (this.board[row][col]) {
                    square.classList.add('queen');
                    square.textContent = '♛';
                }
                
                if (this.isConflict(row, col)) {
                    square.classList.add('conflict');
                }
                
                square.addEventListener('click', () => this.handleSquareClick(row, col));
                boardElement.appendChild(square);
            }
        }
    }

    handleSquareClick(row, col) {
        if (this.board[row][col]) {
            // Remove queen
            this.board[row][col] = false;
            this.queens = this.queens.filter(q => q.row !== row || q.col !== col);
        } else {
            // Add queen
            this.board[row][col] = true;
            this.queens.push({ row, col });
        }
        
        this.calculateConflicts();
        this.renderBoard();
        this.updateProgress();
        this.checkWin();
    }

    isConflict(row, col) {
        if (!this.board[row][col]) return false;
        
        for (let queen of this.queens) {
            if (queen.row === row && queen.col === col) continue;
            
            // Check row, column, and diagonals
            if (queen.row === row || queen.col === col ||
                Math.abs(queen.row - row) === Math.abs(queen.col - col)) {
                return true;
            }
        }
        return false;
    }

    calculateConflicts() {
        this.conflicts = 0;
        for (let queen of this.queens) {
            if (this.isConflict(queen.row, queen.col)) {
                this.conflicts++;
            }
        }
        this.conflicts = Math.floor(this.conflicts / 2); // Each conflict is counted twice
    }

    updateProgress() {
        document.getElementById('queensPlaced').textContent = this.queens.length;
        document.getElementById('queensConflicts').textContent = this.conflicts;
    }

    checkWin() {
        if (this.queens.length === 8 && this.conflicts === 0) {
            window.gamesManager.onGameComplete('8queens', { won: true, score: 100 });
            alert('Congratulations! You solved the 8 Queens puzzle!');
            this.reset();
        }
    }

    setupEventListeners() {
        document.getElementById('queensResetBtn').onclick = () => {
            this.reset();
            this.renderBoard();
        };
        
        document.getElementById('queensSolveBtn').onclick = () => {
            this.autoSolve();
        };
        
        document.getElementById('queensHintBtn').onclick = () => {
            this.showHint();
        };
    }

    autoSolve() {
        this.reset();
        // Simple backtracking solution
        this.solveRecursive(0);
        this.renderBoard();
        this.updateProgress();
    }

    solveRecursive(col) {
        if (col >= 8) return true;
        
        for (let row = 0; row < 8; row++) {
            if (this.isSafe(row, col)) {
                this.board[row][col] = true;
                this.queens.push({ row, col });
                
                if (this.solveRecursive(col + 1)) return true;
                
                this.board[row][col] = false;
                this.queens.pop();
            }
        }
        return false;
    }

    isSafe(row, col) {
        for (let queen of this.queens) {
            if (queen.row === row || 
                Math.abs(queen.row - row) === Math.abs(queen.col - col)) {
                return false;
            }
        }
        return true;
    }

    showHint() {
        // Find a safe position for the next queen
        for (let col = 0; col < 8; col++) {
            if (this.queens.some(q => q.col === col)) continue;
            
            for (let row = 0; row < 8; row++) {
                if (this.isSafe(row, col)) {
                    alert(`Try placing a queen at row ${row + 1}, column ${col + 1}`);
                    return;
                }
            }
        }
        alert('No safe positions available. Try removing some queens first.');
    }
}

// Sudoku Game Implementation
class SudokuGame {
    constructor() {
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.given = Array(9).fill().map(() => Array(9).fill(false));
        this.selectedCell = null;
    }

    startGame() {
        this.generatePuzzle();
        this.renderBoard();
        this.setupEventListeners();
    }

    generatePuzzle() {
        // Generate a complete valid Sudoku board
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.fillBoard();
        this.solution = this.board.map(row => [...row]);
        
        // Remove numbers based on difficulty
        const difficulty = document.getElementById('sudokuDifficulty').value;
        const cellsToRemove = difficulty === 'easy' ? 40 : difficulty === 'medium' ? 50 : 60;
        
        this.given = Array(9).fill().map(() => Array(9).fill(true));
        
        for (let i = 0; i < cellsToRemove; i++) {
            let row, col;
            do {
                row = Math.floor(Math.random() * 9);
                col = Math.floor(Math.random() * 9);
            } while (!this.given[row][col]);
            
            this.board[row][col] = 0;
            this.given[row][col] = false;
        }
    }

    fillBoard() {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] === 0) {
                    const shuffled = [...numbers].sort(() => Math.random() - 0.5);
                    for (let num of shuffled) {
                        if (this.isValidMove(row, col, num)) {
                            this.board[row][col] = num;
                            if (this.fillBoard()) return true;
                            this.board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    renderBoard() {
        const boardElement = document.getElementById('sudokuBoard');
        if (!boardElement) return;

        boardElement.innerHTML = '';
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'sudoku-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                if (this.given[row][col]) {
                    cell.classList.add('given');
                    cell.textContent = this.board[row][col];
                } else if (this.board[row][col] !== 0) {
                    cell.textContent = this.board[row][col];
                }
                
                if (this.selectedCell && this.selectedCell.row === row && this.selectedCell.col === col) {
                    cell.classList.add('selected');
                }
                
                cell.addEventListener('click', () => this.selectCell(row, col));
                boardElement.appendChild(cell);
            }
        }
    }

    selectCell(row, col) {
        if (this.given[row][col]) return;
        
        this.selectedCell = { row, col };
        this.renderBoard();
    }

    enterNumber(num) {
        if (!this.selectedCell) return;
        
        const { row, col } = this.selectedCell;
        if (this.given[row][col]) return;
        
        this.board[row][col] = num;
        this.renderBoard();
        this.checkWin();
    }

    isValidMove(row, col, num) {
        // Check row
        for (let c = 0; c < 9; c++) {
            if (c !== col && this.board[row][c] === num) return false;
        }
        
        // Check column
        for (let r = 0; r < 9; r++) {
            if (r !== row && this.board[r][col] === num) return false;
        }
        
        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                if ((r !== row || c !== col) && this.board[r][c] === num) return false;
            }
        }
        
        return true;
    }

    checkWin() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] === 0) return false;
                if (!this.isValidMove(row, col, this.board[row][col])) return false;
            }
        }
        
        window.gamesManager.onGameComplete('sudoku', { won: true, score: 500 });
        alert('Congratulations! You completed the Sudoku puzzle!');
    }

    setupEventListeners() {
        // Number pad buttons
        document.querySelectorAll('#sudokuGameModal .number-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const num = parseInt(btn.dataset.number);
                this.enterNumber(num);
            });
        });
        
        // Game control buttons
        document.getElementById('sudokuNewBtn').onclick = () => {
            this.startGame();
        };
        
        document.getElementById('sudokuCheckBtn').onclick = () => {
            this.checkBoard();
        };
        
        document.getElementById('sudokuHintBtn').onclick = () => {
            this.showHint();
        };
        
        // Difficulty change
        document.getElementById('sudokuDifficulty').onchange = () => {
            this.startGame();
        };
    }

    checkBoard() {
        let errors = 0;
        document.querySelectorAll('.sudoku-cell').forEach(cell => {
            cell.classList.remove('error');
        });
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] !== 0 && !this.isValidMove(row, col, this.board[row][col])) {
                    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    cell.classList.add('error');
                    errors++;
                }
            }
        }
        
        if (errors === 0) {
            alert('No errors found!');
        } else {
            alert(`Found ${errors} error(s). Check the highlighted cells.`);
        }
    }

    showHint() {
        if (!this.selectedCell) {
            alert('Please select a cell first.');
            return;
        }
        
        const { row, col } = this.selectedCell;
        if (this.given[row][col]) {
            alert('This cell is already given.');
            return;
        }
        
        const correctNumber = this.solution[row][col];
        alert(`The correct number for this cell is ${correctNumber}`);
    }
}


// 2048 Game Implementation
class Game2048 {
    constructor() {
        this.board = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('2048BestScore')) || 0;
        this.previousState = null;
    }

    startGame() {
        this.board = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.addRandomTile();
        this.addRandomTile();
        this.renderBoard();
        this.setupEventListeners();
        this.updateScore();
    }

    addRandomTile() {
        const emptyCells = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (this.board[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    renderBoard() {
        const boardElement = document.getElementById('2048Board');
        if (!boardElement) return;

        boardElement.innerHTML = '';
        
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const tile = document.createElement('div');
                tile.className = 'tile-2048';
                
                const value = this.board[row][col];
                if (value !== 0) {
                    tile.classList.add(`tile-${value}`);
                    tile.textContent = value;
                }
                
                boardElement.appendChild(tile);
            }
        }
    }

    move(direction) {
        this.previousState = {
            board: this.board.map(row => [...row]),
            score: this.score
        };
        
        let moved = false;
        
        switch (direction) {
            case 'left':
                moved = this.moveLeft();
                break;
            case 'right':
                moved = this.moveRight();
                break;
            case 'up':
                moved = this.moveUp();
                break;
            case 'down':
                moved = this.moveDown();
                break;
        }
        
        if (moved) {
            this.addRandomTile();
            this.renderBoard();
            this.updateScore();
            
            if (this.checkWin()) {
                alert('Congratulations! You reached 2048!');
                window.gamesManager.onGameComplete('2048', { 
                    won: true, 
                    score: this.score,
                    bestTile: this.getHighestTile()
                });
            } else if (this.checkGameOver()) {
                alert('Game Over!');
                window.gamesManager.onGameComplete('2048', { 
                    won: false, 
                    score: this.score,
                    bestTile: this.getHighestTile()
                });
            }
        }
    }

    moveLeft() {
        let moved = false;
        for (let row = 0; row < 4; row++) {
            const newRow = this.slideAndMerge([...this.board[row]]);
            if (JSON.stringify(newRow) !== JSON.stringify(this.board[row])) {
                moved = true;
                this.board[row] = newRow;
            }
        }
        return moved;
    }

    moveRight() {
        let moved = false;
        for (let row = 0; row < 4; row++) {
            const reversed = [...this.board[row]].reverse();
            const newRow = this.slideAndMerge(reversed).reverse();
            if (JSON.stringify(newRow) !== JSON.stringify(this.board[row])) {
                moved = true;
                this.board[row] = newRow;
            }
        }
        return moved;
    }

    moveUp() {
        let moved = false;
        for (let col = 0; col < 4; col++) {
            const column = [this.board[0][col], this.board[1][col], this.board[2][col], this.board[3][col]];
            const newColumn = this.slideAndMerge(column);
            if (JSON.stringify(newColumn) !== JSON.stringify(column)) {
                moved = true;
                for (let row = 0; row < 4; row++) {
                    this.board[row][col] = newColumn[row];
                }
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let col = 0; col < 4; col++) {
            const column = [this.board[0][col], this.board[1][col], this.board[2][col], this.board[3][col]];
            const newColumn = this.slideAndMerge([...column].reverse()).reverse();
            if (JSON.stringify(newColumn) !== JSON.stringify(column)) {
                moved = true;
                for (let row = 0; row < 4; row++) {
                    this.board[row][col] = newColumn[row];
                }
            }
        }
        return moved;
    }

    slideAndMerge(arr) {
        // Remove zeros
        arr = arr.filter(val => val !== 0);
        
        // Merge adjacent equal values
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] === arr[i + 1]) {
                arr[i] *= 2;
                this.score += arr[i];
                arr.splice(i + 1, 1);
            }
        }
        
        // Add zeros to the end
        while (arr.length < 4) {
            arr.push(0);
        }
        
        return arr;
    }

    updateScore() {
        document.getElementById('2048Score').textContent = `Score: ${this.score}`;
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('2048BestScore', this.bestScore);
        }
        
        document.getElementById('2048BestScore').textContent = `Best: ${this.bestScore}`;
    }

    getHighestTile() {
        let highest = 0;
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (this.board[row][col] > highest) {
                    highest = this.board[row][col];
                }
            }
        }
        return highest;
    }

    checkWin() {
        return this.getHighestTile() >= 2048;
    }

    checkGameOver() {
        // Check for empty cells
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (this.board[row][col] === 0) return false;
            }
        }
        
        // Check for possible merges
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const current = this.board[row][col];
                if ((col < 3 && current === this.board[row][col + 1]) ||
                    (row < 3 && current === this.board[row + 1][col])) {
                    return false;
                }
            }
        }
        
        return true;
    }

    undo() {
        if (this.previousState) {
            this.board = this.previousState.board;
            this.score = this.previousState.score;
            this.renderBoard();
            this.updateScore();
            this.previousState = null;
        }
    }

    setupEventListeners() {
        document.getElementById('2048NewBtn').onclick = () => this.startGame();
        document.getElementById('2048UndoBtn').onclick = () => this.undo();
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('2048GameModal').style.display === 'block') {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.move('left');
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.move('right');
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.move('up');
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.move('down');
                        break;
                }
            }
        });
    }
}

// Memory Game Implementation
class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.pairs = 0;
        this.gameActive = false;
        
        // Card symbols
        this.symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    }

    startGame() {
        this.generateCards();
        this.moves = 0;
        this.pairs = 0;
        this.gameActive = true;
        this.flippedCards = [];
        this.renderBoard();
        this.updateStats();
    }

    generateCards() {
        this.cards = [];
        
        // Create pairs of cards
        for (let symbol of this.symbols) {
            this.cards.push({ symbol, id: Math.random(), flipped: false, matched: false });
            this.cards.push({ symbol, id: Math.random(), flipped: false, matched: false });
        }
        
        // Shuffle cards
        this.cards.sort(() => Math.random() - 0.5);
    }

    renderBoard() {
        const boardElement = document.getElementById('memoryBoard');
        if (!boardElement) return;

        boardElement.innerHTML = '';
        
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'memory-card';
            cardElement.dataset.index = index;
            
            if (card.flipped || card.matched) {
                cardElement.classList.add('flipped');
                cardElement.textContent = card.symbol;
            } else {
                cardElement.textContent = '?';
            }
            
            if (card.matched) {
                cardElement.classList.add('matched');
            }
            
            cardElement.addEventListener('click', () => this.flipCard(index));
            boardElement.appendChild(cardElement);
        });
    }

    flipCard(index) {
        if (!this.gameActive) return;
        if (this.cards[index].flipped || this.cards[index].matched) return;
        if (this.flippedCards.length >= 2) return;
        
        this.cards[index].flipped = true;
        this.flippedCards.push(index);
        this.renderBoard();
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateStats();
            
            setTimeout(() => {
                this.checkMatch();
            }, 1000);
        }
    }

    checkMatch() {
        const [first, second] = this.flippedCards;
        
        if (this.cards[first].symbol === this.cards[second].symbol) {
            // Match found
            this.cards[first].matched = true;
            this.cards[second].matched = true;
            this.pairs++;
            this.updateStats();
            
            if (this.pairs === 8) {
                this.gameActive = false;
                window.gamesManager.onGameComplete('memory', { 
                    won: true, 
                    score: Math.max(100 - this.moves, 10),
                    moves: this.moves
                });
                alert(`Congratulations! You completed the memory game in ${this.moves} moves!`);
            }
        } else {
            // No match
            this.cards[first].flipped = false;
            this.cards[second].flipped = false;
        }
        
        this.flippedCards = [];
        this.renderBoard();
    }

    updateStats() {
        document.getElementById('memoryMoves').textContent = `Moves: ${this.moves}`;
        document.getElementById('memoryPairs').textContent = `Pairs: ${this.pairs}/8`;
    }

    setupEventListeners() {
        document.getElementById('memoryNewBtn').onclick = () => this.startGame();
    }
}

// Snake Game Implementation
class SnakeGame {
    constructor() {
        this.boardSize = 20;
        this.snake = [{ x: 10, y: 10 }];
        this.food = { x: 15, y: 15 };
        this.direction = { x: 0, y: 0 };
        this.score = 0;
        this.gameActive = false;
        this.gameLoop = null;
        this.speed = 150; // milliseconds
    }

    startGame() {
        this.snake = [{ x: 10, y: 10 }];
        this.generateFood();
        this.direction = { x: 0, y: 0 };
        this.score = 0;
        this.gameActive = true;
        this.renderBoard();
        this.updateStats();
        this.startGameLoop();
        this.setupEventListeners();
    }

    generateFood() {
        do {
            this.food = {
                x: Math.floor(Math.random() * this.boardSize),
                y: Math.floor(Math.random() * this.boardSize)
            };
        } while (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y));
    }

    renderBoard() {
        const boardElement = document.getElementById('snakeBoard');
        if (!boardElement) return;

        boardElement.innerHTML = '';
        
        for (let y = 0; y < this.boardSize; y++) {
            for (let x = 0; x < this.boardSize; x++) {
                const cell = document.createElement('div');
                cell.className = 'snake-cell';
                
                if (this.snake.some(segment => segment.x === x && segment.y === y)) {
                    cell.classList.add('snake');
                } else if (this.food.x === x && this.food.y === y) {
                    cell.classList.add('food');
                }
                
                boardElement.appendChild(cell);
            }
        }
    }

    startGameLoop() {
        if (this.gameLoop) clearInterval(this.gameLoop);
        
        this.gameLoop = setInterval(() => {
            if (this.gameActive) {
                this.update();
            }
        }, this.speed);
    }

    update() {
        if (this.direction.x === 0 && this.direction.y === 0) return;
        
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.boardSize || head.y < 0 || head.y >= this.boardSize) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.generateFood();
            this.updateStats();
        } else {
            this.snake.pop();
        }
        
        this.renderBoard();
    }

    changeDirection(newDirection) {
        if (!this.gameActive) return;
        
        // Prevent reversing direction
        if (this.direction.x === -newDirection.x && this.direction.y === -newDirection.y) return;
        
        this.direction = newDirection;
    }

    gameOver() {
        this.gameActive = false;
        clearInterval(this.gameLoop);
        
        window.gamesManager.onGameComplete('snake', { 
            won: false, 
            score: this.score,
            length: this.snake.length
        });
        
        alert(`Game Over! Your score: ${this.score}, Length: ${this.snake.length}`);
    }

    pauseGame() {
        this.gameActive = !this.gameActive;
        const pauseBtn = document.getElementById('snakePauseBtn');
        if (pauseBtn) {
            pauseBtn.textContent = this.gameActive ? '⏸️ Pause' : '▶️ Resume';
        }
    }

    updateStats() {
        document.getElementById('snakeScore').textContent = `Score: ${this.score}`;
        document.getElementById('snakeLength').textContent = `Length: ${this.snake.length}`;
    }

    setSpeed(speed) {
        const speeds = { slow: 200, medium: 150, fast: 100 };
        this.speed = speeds[speed] || 150;
        if (this.gameActive) {
            this.startGameLoop();
        }
    }

    setupEventListeners() {
        document.getElementById('snakeNewBtn').onclick = () => this.startGame();
        document.getElementById('snakePauseBtn').onclick = () => this.pauseGame();
        
        document.getElementById('snakeSpeed').onchange = (e) => {
            this.setSpeed(e.target.value);
        };
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('snakeGameModal').style.display === 'block') {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.changeDirection({ x: -1, y: 0 });
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.changeDirection({ x: 1, y: 0 });
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.changeDirection({ x: 0, y: -1 });
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.changeDirection({ x: 0, y: 1 });
                        break;
                }
            }
        });
    }
}

// Initialize Games Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gamesManager = new GamesManager();
    
    // Add global functions for easy access
    window.startGame = (gameType) => window.gamesManager.startGame(gameType);
    
    // Setup modal close functionality
    document.querySelectorAll('.game-modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            window.gamesManager.closeModal(modal.id);
        });
    });
    
    // Close modal on outside click
    document.querySelectorAll('.game-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                window.gamesManager.closeModal(modal.id);
            }
        });
    });
    
    console.log('Games system initialized successfully!');
});
