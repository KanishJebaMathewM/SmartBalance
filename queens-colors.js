// 5 Queens with Colors - Complete Implementation
// Implements a 5x5 board with 5 different colored queens

class FiveQueensWithColors {
    constructor() {
        this.boardColors = this.generateColoredBoard();
        this.queens = [];
        this.indexBase = 1;
        this.validationResult = null;
        
        // Color mappings for 5x5 board
        this.colorNames = ['red', 'blue', 'green', 'yellow', 'purple'];
        
        // Initialize UI when created
        this.initializeUI();
    }

    // Generate a 5x5 colored board layout
    generateColoredBoard() {
        return [
            ["red", "blue", "green", "yellow", "purple"],
            ["blue", "green", "yellow", "purple", "red"],
            ["green", "yellow", "purple", "red", "blue"],
            ["yellow", "purple", "red", "blue", "green"],
            ["purple", "red", "blue", "green", "yellow"]
        ];
    }

    // Initialize the UI components
    initializeUI() {
        this.renderBoard();
        this.renderColorLegend();
        this.setupEventListeners();
        this.updateGameState();
    }

    // Render the colored chess board
    renderBoard() {
        const boardElement = document.getElementById('queensBoard');
        if (!boardElement) return;

        boardElement.innerHTML = '';
        
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const square = document.createElement('div');
                square.className = `queens-colored-square color-${this.boardColors[row][col]}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                // Check if there's a queen on this square
                const queen = this.queens.find(q => 
                    (q.row - this.indexBase) === row && (q.col - this.indexBase) === col
                );
                
                if (queen) {
                    square.classList.add('has-queen');
                    
                    // Apply state styling based on validation results
                    if (this.validationResult && this.validationResult.perQueen) {
                        const queenData = this.validationResult.perQueen.find(pq => 
                            (pq.row - this.indexBase) === row && (pq.col - this.indexBase) === col
                        );
                        if (queenData) {
                            square.classList.add(`cell-${queenData.state}`);
                        }
                    }
                }
                
                square.addEventListener('click', () => this.handleSquareClick(row, col));
                boardElement.appendChild(square);
            }
        }
    }

    // Render the color legend
    renderColorLegend() {
        const legendElement = document.getElementById('colorLegend');
        if (!legendElement) return;

        legendElement.innerHTML = this.colorNames.map(color => `
            <div class="color-legend-item">
                <div class="color-swatch color-${color}"></div>
                <span>${color.charAt(0).toUpperCase() + color.slice(1)}</span>
            </div>
        `).join('');
    }

    // Handle square click to place/remove queens
    handleSquareClick(row, col) {
        const adjustedRow = row + this.indexBase;
        const adjustedCol = col + this.indexBase;
        
        // Check if there's already a queen on this square
        const existingQueenIndex = this.queens.findIndex(q => 
            q.row === adjustedRow && q.col === adjustedCol
        );
        
        if (existingQueenIndex !== -1) {
            // Remove queen
            this.queens.splice(existingQueenIndex, 1);
        } else {
            // Add queen
            this.queens.push({ row: adjustedRow, col: adjustedCol });
        }
        
        this.validateAndUpdate();
    }

    // Main validation function - implements the complete specification
    validatePuzzle(input = null) {
        let boardColors, queens, indexBase;
        
        if (input) {
            // Validate input format
            if (!input.boardColors || !input.queens || input.indexBase === undefined) {
                return {
                    meta: { indexBase: 1, boardSize: 5 },
                    summary: {
                        placed: 0,
                        uniqueColorsUsed: [],
                        duplicateColors: [],
                        conflictCount: 0,
                        score: 0,
                        status: "invalid"
                    },
                    perQueen: [],
                    conflicts: [],
                    suggestions: [],
                    messages: ["Invalid input format. Required: boardColors, queens, indexBase"],
                    legend: { safe: "cell-safe", conflict: "cell-conflict", warning: "cell-warning" }
                };
            }
            
            boardColors = input.boardColors;
            queens = input.queens;
            indexBase = input.indexBase;
        } else {
            boardColors = this.boardColors;
            queens = this.queens;
            indexBase = this.indexBase;
        }

        // Validate board colors (exactly 5 unique colors across 5x5 board)
        const allColors = [];
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (boardColors[row] && boardColors[row][col]) {
                    allColors.push(boardColors[row][col]);
                }
            }
        }
        
        const uniqueBoardColors = [...new Set(allColors)];
        if (uniqueBoardColors.length !== 5 || allColors.length !== 25) {
            return this.createInvalidResult("Board must be 5x5 with exactly 5 unique colors", indexBase);
        }

        // Start validation
        const perQueen = [];
        const conflicts = [];
        const queenColors = [];
        let conflictCount = 0;

        // Validate each queen
        for (let i = 0; i < queens.length; i++) {
            const queen = queens[i];
            const queenResult = {
                row: queen.row,
                col: queen.col,
                color: this.getQueenColor(queen, boardColors, indexBase),
                state: "safe",
                reasons: []
            };

            // Validate queen position is within bounds
            const rowIndex = queen.row - indexBase;
            const colIndex = queen.col - indexBase;
            
            if (rowIndex < 0 || rowIndex >= 5 || colIndex < 0 || colIndex >= 5) {
                queenResult.state = "conflict";
                queenResult.reasons.push("outOfBounds");
                conflictCount++;
                perQueen.push(queenResult);
                continue;
            }

            queenColors.push(queenResult.color);

            // Check conflicts with other queens
            for (let j = i + 1; j < queens.length; j++) {
                const otherQueen = queens[j];
                const conflictTypes = this.checkQueenConflicts(queen, otherQueen, boardColors, indexBase);
                
                if (conflictTypes.length > 0) {
                    // Mark both queens as conflicted
                    queenResult.state = "conflict";
                    queenResult.reasons.push(...conflictTypes.map(type => `${type}:Q${j + 1}`));
                    
                    // Add to conflicts list
                    conflicts.push({
                        qA: i + 1,
                        qB: j + 1,
                        types: conflictTypes,
                        details: this.getConflictDetails(conflictTypes, queen, otherQueen, boardColors, indexBase)
                    });
                    
                    conflictCount++;
                }
            }

            perQueen.push(queenResult);
        }

        // Update conflict states for all queens involved in conflicts
        conflicts.forEach(conflict => {
            const qA = perQueen[conflict.qA - 1];
            const qB = perQueen[conflict.qB - 1];
            if (qA) qA.state = "conflict";
            if (qB) qB.state = "conflict";
        });

        // Analyze colors
        const uniqueColorsUsed = [...new Set(queenColors)];
        const duplicateColors = this.findDuplicateColors(queenColors);

        // Calculate score
        const score = this.calculateScore(queens.length, conflictCount, duplicateColors.length);
        
        // Determine status
        const status = this.determineStatus(queens.length, conflictCount, uniqueColorsUsed.length);

        // Generate suggestions
        const suggestions = this.generateSuggestions(perQueen, conflicts, boardColors, indexBase);

        // Generate messages
        const messages = this.generateMessages(queens.length, conflictCount, uniqueColorsUsed, duplicateColors);

        return {
            meta: { indexBase, boardSize: 5 },
            summary: {
                placed: queens.length,
                uniqueColorsUsed,
                duplicateColors,
                conflictCount,
                score,
                status
            },
            perQueen,
            conflicts,
            suggestions,
            messages,
            legend: { safe: "cell-safe", conflict: "cell-conflict", warning: "cell-warning" }
        };
    }

    // Get the color of a queen's square
    getQueenColor(queen, boardColors, indexBase) {
        const row = queen.row - indexBase;
        const col = queen.col - indexBase;
        if (row >= 0 && row < 5 && col >= 0 && col < 5) {
            return boardColors[row][col];
        }
        return "unknown";
    }

    // Check conflicts between two queens according to the rules
    checkQueenConflicts(queen1, queen2, boardColors, indexBase) {
        const conflicts = [];
        
        // Rule 1: Row/Column conflicts
        if (queen1.row === queen2.row) {
            conflicts.push("sameRow");
        }
        if (queen1.col === queen2.col) {
            conflicts.push("sameColumn");
        }
        
        // Rule 2: Color conflicts
        const color1 = this.getQueenColor(queen1, boardColors, indexBase);
        const color2 = this.getQueenColor(queen2, boardColors, indexBase);
        if (color1 === color2) {
            conflicts.push("duplicateColor");
        }
        
        // Rule 3: Adjacent diagonal conflicts only (distance = 1)
        const dr = Math.abs(queen1.row - queen2.row);
        const dc = Math.abs(queen1.col - queen2.col);
        if (dr === 1 && dc === 1) {
            conflicts.push("adjacentDiagonal");
        }
        
        return conflicts;
    }

    // Get details for conflicts
    getConflictDetails(conflictTypes, queen1, queen2, boardColors, indexBase) {
        const details = {};
        
        if (conflictTypes.includes("duplicateColor")) {
            details.color = this.getQueenColor(queen1, boardColors, indexBase);
        }
        
        return details;
    }

    // Find duplicate colors in the queens array
    findDuplicateColors(colors) {
        const colorCounts = {};
        colors.forEach(color => {
            colorCounts[color] = (colorCounts[color] || 0) + 1;
        });
        
        return Object.keys(colorCounts).filter(color => colorCounts[color] > 1);
    }

    // Calculate score according to specification
    calculateScore(placed, conflicts, duplicateColors) {
        let score = 100;
        
        if (placed === 5 && conflicts === 0) {
            return 100; // Perfect score
        }
        
        if (placed < 5 && conflicts === 0) {
            // 70-90 proportional to placement
            return 70 + Math.floor((placed / 5) * 20);
        }
        
        // Subtract 15 for each conflict
        score -= conflicts * 15;
        
        // Additional penalties for systematic rule breaking
        if (duplicateColors > 0) {
            score = Math.min(score, 40); // Cap at 40 if there are color duplicates
        }
        
        return Math.max(score, 0); // Floor at 0
    }

    // Determine overall status
    determineStatus(placed, conflicts, uniqueColors) {
        if (placed === 5 && conflicts === 0) {
            return "perfect";
        }
        if (placed > 0 && conflicts === 0 && placed < 5) {
            return "partial";
        }
        if (conflicts > 0) {
            return "conflict";
        }
        if (placed === 0) {
            return "ready";
        }
        return "invalid";
    }

    // Generate suggestions for improvement
    generateSuggestions(perQueen, conflicts, boardColors, indexBase) {
        const suggestions = [];
        
        // Limit to 3 suggestions as per spec
        const conflictedQueens = perQueen.filter(q => q.state === "conflict").slice(0, 3);
        
        conflictedQueens.forEach((queen, index) => {
            // Find a safe position for this queen
            const safePosition = this.findSafePosition(queen, perQueen, boardColors, indexBase);
            if (safePosition) {
                suggestions.push({
                    forQueenIndex: perQueen.indexOf(queen),
                    moveTo: safePosition,
                    reason: this.getSuggestionReason(queen.reasons)
                });
            }
        });
        
        return suggestions;
    }

    // Find a safe position for a conflicted queen
    findSafePosition(conflictedQueen, allQueens, boardColors, indexBase) {
        const usedColors = allQueens
            .filter(q => q !== conflictedQueen)
            .map(q => q.color);
        
        // Try all positions
        for (let row = 1; row <= 5; row++) {
            for (let col = 1; col <= 5; col++) {
                const testQueen = { row, col };
                const testColor = this.getQueenColor(testQueen, boardColors, indexBase);
                
                // Skip if color is already used
                if (usedColors.includes(testColor)) continue;
                
                // Check if this position conflicts with existing queens
                const hasConflict = allQueens
                    .filter(q => q !== conflictedQueen)
                    .some(q => this.checkQueenConflicts(testQueen, { row: q.row, col: q.col }, boardColors, indexBase).length > 0);
                
                if (!hasConflict) {
                    return { row, col };
                }
            }
        }
        
        return null;
    }

    // Get reason for suggestion
    getSuggestionReason(reasons) {
        if (reasons.includes("duplicateColor")) return "resolves color conflict";
        if (reasons.includes("adjacentDiagonal")) return "resolves adjacent diagonal";
        if (reasons.includes("sameRow")) return "resolves row conflict";
        if (reasons.includes("sameColumn")) return "resolves column conflict";
        return "resolves conflicts";
    }

    // Generate human-readable messages
    generateMessages(placed, conflicts, uniqueColors, duplicateColors) {
        const messages = [];
        
        if (placed === 0) {
            messages.push("Click on colored squares to place queens. Each queen must be on a different color.");
        } else if (placed === 5 && conflicts === 0) {
            messages.push("🎉 Perfect! You solved the 5 Queens with Colors puzzle!");
        } else if (conflicts === 0 && placed < 5) {
            messages.push(`Good progress! ${placed} queens placed with no conflicts. Add ${5 - placed} more queens on unused colors.`);
        } else {
            messages.push(`${placed} queens placed with ${conflicts} conflicts detected.`);
            
            if (duplicateColors.length > 0) {
                messages.push(`Color conflicts: ${duplicateColors.join(', ')}. Each queen must be on a unique color.`);
            }
        }
        
        if (placed > 0 && conflicts > 0) {
            messages.push("Click on conflicted queens (red outline) to remove them and try different positions.");
        }
        
        return messages;
    }

    // Create invalid result
    createInvalidResult(message, indexBase = 1) {
        return {
            meta: { indexBase, boardSize: 5 },
            summary: {
                placed: 0,
                uniqueColorsUsed: [],
                duplicateColors: [],
                conflictCount: 0,
                score: 0,
                status: "invalid"
            },
            perQueen: [],
            conflicts: [],
            suggestions: [],
            messages: [message],
            legend: { safe: "cell-safe", conflict: "cell-conflict", warning: "cell-warning" }
        };
    }

    // Validate and update the game state
    validateAndUpdate() {
        this.validationResult = this.validatePuzzle();
        this.renderBoard();
        this.updateUI();
    }

    // Update UI elements
    updateUI() {
        if (!this.validationResult) return;

        const result = this.validationResult;
        
        // Update stats
        const queensPlacedElement = document.getElementById('queensPlaced');
        const uniqueColorsElement = document.getElementById('uniqueColors');
        const queensConflictsElement = document.getElementById('queensConflicts');
        const currentScoreElement = document.getElementById('currentScore');
        const queensScoreElement = document.getElementById('queensScore');
        
        if (queensPlacedElement) queensPlacedElement.textContent = result.summary.placed;
        if (uniqueColorsElement) uniqueColorsElement.textContent = result.summary.uniqueColorsUsed.length;
        if (queensConflictsElement) queensConflictsElement.textContent = result.summary.conflictCount;
        if (currentScoreElement) currentScoreElement.textContent = result.summary.score;
        if (queensScoreElement) queensScoreElement.textContent = `Score: ${result.summary.score}`;
        
        // Update status badge
        const statusElement = document.getElementById('queensStatus');
        if (statusElement) {
            statusElement.textContent = result.summary.status.charAt(0).toUpperCase() + result.summary.status.slice(1);
            statusElement.className = `status-badge status-${result.summary.status}`;
        }
    }

    // Show hint functionality
    showHint() {
        const hint = this.generateHint();
        const hintSection = document.getElementById('hintsSection');
        const hintMessage = document.getElementById('hintMessage');

        if (hintSection && hintMessage && hint) {
            hintMessage.innerHTML = hint; // Use innerHTML to support HTML formatting
            hintSection.style.display = 'block';

            // Highlight the suggested position if available
            this.highlightHintPosition();

            // Hide hint after 8 seconds for better readability
            setTimeout(() => {
                this.hideHint();
            }, 8000);
        }
    }

    hideHint() {
        const hintSection = document.getElementById('hintsSection');
        if (hintSection) {
            hintSection.style.display = 'none';
        }
        // Clear highlights when hiding hint
        this.clearHintHighlights();
    }

    generateHint() {
        // Clear any previous highlights
        this.clearHintHighlights();

        if (this.queens.length === 0) {
            // Suggest a random safe starting position
            const suggestions = [
                {row: 1, col: 1, color: 'red'},
                {row: 2, col: 3, color: 'yellow'},
                {row: 3, col: 5, color: 'blue'}
            ];
            const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
            this.hintPosition = suggestion;
            return `💡 <strong>Start here:</strong> Place your first queen at <strong>Row ${suggestion.row}, Column ${suggestion.col}</strong> (${suggestion.color} square). Click on that square to begin!`;
        }

        // Check for conflicts first and highlight mistakes
        const result = this.validatePuzzle();
        if (result.conflicts.length > 0) {
            const conflict = result.conflicts[0];
            const conflictedQueens = result.perQueen.filter(q => q.state === 'conflict');

            if (conflictedQueens.length > 0) {
                const wrongQueen = conflictedQueens[0];
                this.highlightMistake = {row: wrongQueen.row, col: wrongQueen.col};

                if (conflict.types.includes('sameRow')) {
                    return `❌ <strong>Mistake found:</strong> The queen at <strong>Row ${wrongQueen.row}, Column ${wrongQueen.col}</strong> is in the same row as another queen. Move one of them to a different row.`;
                } else if (conflict.types.includes('sameColumn')) {
                    return `❌ <strong>Mistake found:</strong> The queen at <strong>Row ${wrongQueen.row}, Column ${wrongQueen.col}</strong> is in the same column as another queen. Move one of them to a different column.`;
                } else if (conflict.types.includes('duplicateColor')) {
                    return `❌ <strong>Color conflict:</strong> The queen at <strong>Row ${wrongQueen.row}, Column ${wrongQueen.col}</strong> is on the same color (${wrongQueen.color}) as another queen. Each queen needs a unique color!`;
                } else if (conflict.types.includes('adjacentDiagonal')) {
                    return `❌ <strong>Adjacent diagonal attack:</strong> The queen at <strong>Row ${wrongQueen.row}, Column ${wrongQueen.col}</strong> is attacking another queen diagonally (distance = 1). Move one of them!`;
                }
            }
        }

        // If no conflicts, suggest next safe position
        if (this.queens.length < 5) {
            const nextPosition = this.findBestNextPosition();
            if (nextPosition) {
                this.hintPosition = nextPosition;
                const colorName = this.boardColors[nextPosition.row-1][nextPosition.col-1];
                return `✅ <strong>Next position:</strong> Place a queen at <strong>Row ${nextPosition.row}, Column ${nextPosition.col}</strong> (${colorName} square). This position follows all rules!`;
            }
        }

        return "🎉 You're doing great! Keep placing queens while following the rules.";
    }

    // Find best next position for queen placement
    findBestNextPosition() {
        const usedColors = this.queens.map(q => this.getQueenColor(q, this.boardColors, this.indexBase));
        const usedRows = this.queens.map(q => q.row);
        const usedCols = this.queens.map(q => q.col);

        // Try to find a safe position
        for (let row = 1; row <= 5; row++) {
            if (usedRows.includes(row)) continue;

            for (let col = 1; col <= 5; col++) {
                if (usedCols.includes(col)) continue;

                const testQueen = { row, col };
                const testColor = this.getQueenColor(testQueen, this.boardColors, this.indexBase);

                // Skip if color is already used
                if (usedColors.includes(testColor)) continue;

                // Check if this position conflicts with existing queens
                const hasConflict = this.queens.some(q =>
                    this.checkQueenConflicts(testQueen, q, this.boardColors, this.indexBase).length > 0
                );

                if (!hasConflict) {
                    return { row, col };
                }
            }
        }

        return null;
    }

    // Highlight hint position on the board
    highlightHintPosition() {
        if (this.hintPosition) {
            const row = this.hintPosition.row - this.indexBase;
            const col = this.hintPosition.col - this.indexBase;
            const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (square) {
                square.classList.add('hint-suggestion');
            }
        }

        if (this.highlightMistake) {
            const row = this.highlightMistake.row - this.indexBase;
            const col = this.highlightMistake.col - this.indexBase;
            const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (square) {
                square.classList.add('hint-mistake');
            }
        }
    }

    // Clear hint highlights from the board
    clearHintHighlights() {
        document.querySelectorAll('.hint-suggestion').forEach(el => {
            el.classList.remove('hint-suggestion');
        });
        document.querySelectorAll('.hint-mistake').forEach(el => {
            el.classList.remove('hint-mistake');
        });
        this.hintPosition = null;
        this.highlightMistake = null;
    }

    // Generate random board layout for variety
    generateRandomBoard() {
        const patterns = [
            // Standard pattern
            [
                ["red", "blue", "green", "yellow", "purple"],
                ["blue", "green", "yellow", "purple", "red"],
                ["green", "yellow", "purple", "red", "blue"],
                ["yellow", "purple", "red", "blue", "green"],
                ["purple", "red", "blue", "green", "yellow"]
            ],
            // Rotated pattern
            [
                ["purple", "red", "blue", "green", "yellow"],
                ["red", "blue", "green", "yellow", "purple"],
                ["blue", "green", "yellow", "purple", "red"],
                ["green", "yellow", "purple", "red", "blue"],
                ["yellow", "purple", "red", "blue", "green"]
            ],
            // Shifted pattern
            [
                ["green", "yellow", "purple", "red", "blue"],
                ["yellow", "purple", "red", "blue", "green"],
                ["purple", "red", "blue", "green", "yellow"],
                ["red", "blue", "green", "yellow", "purple"],
                ["blue", "green", "yellow", "purple", "red"]
            ],
            // Diagonal pattern
            [
                ["yellow", "red", "purple", "blue", "green"],
                ["purple", "green", "red", "yellow", "blue"],
                ["blue", "yellow", "green", "purple", "red"],
                ["red", "blue", "yellow", "green", "purple"],
                ["green", "purple", "blue", "red", "yellow"]
            ]
        ];

        this.boardColors = patterns[Math.floor(Math.random() * patterns.length)];
    }

    // Setup event listeners
    setupEventListeners() {
        // Reset button
        const resetBtn = document.getElementById('queensResetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetGame());
        }

        // Hint button
        const hintBtn = document.getElementById('queensHintBtn');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }
    }

    // Reset the game
    resetGame() {
        this.queens = [];
        this.validationResult = null;
        this.hintPosition = null;
        this.highlightMistake = null;

        // Generate new random board layout for variety
        this.generateRandomBoard();

        this.renderBoard();
        this.updateGameState();

        // Hide hints
        this.hideHint();
    }

    // Apply a suggestion
    applySuggestion(suggestionIndex) {
        if (!this.validationResult || !this.validationResult.suggestions[suggestionIndex]) return;
        
        const suggestion = this.validationResult.suggestions[suggestionIndex];
        const queen = this.queens[suggestion.forQueenIndex];
        
        if (queen) {
            queen.row = suggestion.moveTo.row;
            queen.col = suggestion.moveTo.col;
            this.validateAndUpdate();
        }
    }

    // Update game state display
    updateGameState() {
        this.updateUI();
    }

    // Export current state as JSON
    exportCurrentState() {
        return {
            boardColors: this.boardColors,
            queens: this.queens,
            indexBase: this.indexBase
        };
    }

    // Get validation result for external use
    getValidationResult() {
        return this.validationResult || this.validatePuzzle();
    }
}

// Enhanced Games Manager for 5 Queens with Colors
if (typeof window !== 'undefined') {
    // Enhanced wrapper class that integrates with the games manager
    class FiveQueensGameEnhanced extends FiveQueensWithColors {
        constructor() {
            super();
            this.gameStartTime = null;
            this.gameTimer = null;
            this.elapsedTime = 0;
        }

        startGame() {
            this.gameStartTime = Date.now();
            this.elapsedTime = 0;
            this.resetGame();
            this.startTimer();
            console.log('5 Queens with Colors game started');
        }

        startTimer() {
            if (this.gameTimer) {
                clearInterval(this.gameTimer);
            }

            this.gameTimer = setInterval(() => {
                this.elapsedTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
                this.updateTimerDisplay();
            }, 1000);
        }

        stopTimer() {
            if (this.gameTimer) {
                clearInterval(this.gameTimer);
                this.gameTimer = null;
            }
        }

        updateTimerDisplay() {
            const timerElement = document.getElementById('queensTimer');
            if (timerElement) {
                const minutes = Math.floor(this.elapsedTime / 60);
                const seconds = this.elapsedTime % 60;
                timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }

        resetGame() {
            super.resetGame();
            this.gameStartTime = Date.now();
            this.elapsedTime = 0;
            this.updateTimerDisplay();
        }

        completeGame(won = false) {
            this.stopTimer();
            if (this.gameStartTime) {
                const result = {
                    won: won,
                    score: this.validationResult ? this.validationResult.summary.score : 0,
                    elapsed: this.elapsedTime
                };

                if (window.gamesManager) {
                    window.gamesManager.onGameComplete('8queens', result);
                }
            }
        }

        formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        // Override validateAndUpdate to check for completion
        validateAndUpdate() {
            super.validateAndUpdate();
            
            if (this.validationResult && this.validationResult.summary.status === 'perfect') {
                setTimeout(() => {
                    alert('🎉 Congratulations! You solved the 5 Queens with Colors puzzle!');
                    this.completeGame(true);
                }, 500);
            }
        }
    }

    // Global instance for the games system
    window.FiveQueensWithColors = FiveQueensWithColors;
    window.FiveQueensGameEnhanced = FiveQueensGameEnhanced;

    // Keep backward compatibility for games.js
    window.EightQueensWithColors = FiveQueensWithColors;
    window.EightQueensGameEnhanced = FiveQueensGameEnhanced;

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        // Override the original 8queens game in the games manager
        if (window.gamesManager && window.gamesManager.queens) {
            window.gamesManager.queens = new FiveQueensGameEnhanced();
        }
    });
}

// Export for Node.js environments (testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FiveQueensWithColors;
}
