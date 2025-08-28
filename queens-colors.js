// 8 Queens with Colors - Complete Implementation
// Follows the detailed specification from the user prompt

class EightQueensWithColors {
    constructor() {
        this.boardColors = this.generateColoredBoard();
        this.queens = [];
        this.indexBase = 1;
        this.validationResult = null;
        
        // Color mappings
        this.colorNames = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'cyan', 'gray'];
        
        // Initialize UI when created
        this.initializeUI();
    }

    // Generate a standard colored board layout
    generateColoredBoard() {
        return [
            ["red","blue","green","yellow","purple","orange","cyan","gray"],
            ["blue","green","yellow","purple","orange","cyan","gray","red"],
            ["green","yellow","purple","orange","cyan","gray","red","blue"],
            ["yellow","purple","orange","cyan","gray","red","blue","green"],
            ["purple","orange","cyan","gray","red","blue","green","yellow"],
            ["orange","cyan","gray","red","blue","green","yellow","purple"],
            ["cyan","gray","red","blue","green","yellow","purple","orange"],
            ["gray","red","blue","green","yellow","purple","orange","cyan"]
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
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
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
                    meta: { indexBase: 1, boardSize: 8 },
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

        // Validate board colors (exactly 8 unique colors across 8x8 board)
        const allColors = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (boardColors[row] && boardColors[row][col]) {
                    allColors.push(boardColors[row][col]);
                }
            }
        }
        
        const uniqueBoardColors = [...new Set(allColors)];
        if (uniqueBoardColors.length !== 8 || allColors.length !== 64) {
            return this.createInvalidResult("Board must be 8x8 with exactly 8 unique colors", indexBase);
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
            
            if (rowIndex < 0 || rowIndex >= 8 || colIndex < 0 || colIndex >= 8) {
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
            meta: { indexBase, boardSize: 8 },
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
        if (row >= 0 && row < 8 && col >= 0 && col < 8) {
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
        
        if (placed === 8 && conflicts === 0) {
            return 100; // Perfect score
        }
        
        if (placed < 8 && conflicts === 0) {
            // 70-90 proportional to placement
            return 70 + Math.floor((placed / 8) * 20);
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
        if (placed === 8 && conflicts === 0) {
            return "perfect";
        }
        if (placed > 0 && conflicts === 0 && placed < 8) {
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
        for (let row = 1; row <= 8; row++) {
            for (let col = 1; col <= 8; col++) {
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
        } else if (placed === 8 && conflicts === 0) {
            messages.push("🎉 Perfect! You solved the 8 Queens with Colors puzzle!");
        } else if (conflicts === 0 && placed < 8) {
            messages.push(`Good progress! ${placed} queens placed with no conflicts. Add ${8 - placed} more queens on unused colors.`);
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
            meta: { indexBase, boardSize: 8 },
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
        document.getElementById('queensPlaced').textContent = result.summary.placed;
        document.getElementById('uniqueColors').textContent = result.summary.uniqueColorsUsed.length;
        document.getElementById('queensConflicts').textContent = result.summary.conflictCount;
        document.getElementById('currentScore').textContent = result.summary.score;
        document.getElementById('queensScore').textContent = `Score: ${result.summary.score}`;
        
        // Update status badge
        const statusElement = document.getElementById('queensStatus');
        if (statusElement) {
            statusElement.textContent = result.summary.status.charAt(0).toUpperCase() + result.summary.status.slice(1);
            statusElement.className = `status-badge status-${result.summary.status}`;
        }
        
        // Show validation results
        this.displayValidationResults(result);
    }

    // Simplified validation display - only show basic info
    displayValidationResults(result) {
        // Remove the complex validation results display
        // Keep only essential feedback through the progress stats
        return;
    }

    // Show hint functionality
    showHint() {
        const hint = this.generateHint();
        const hintSection = document.getElementById('hintsSection');
        const hintMessage = document.getElementById('hintMessage');

        if (hintSection && hintMessage && hint) {
            hintMessage.textContent = hint;
            hintSection.style.display = 'block';

            // Hide hint after 5 seconds
            setTimeout(() => {
                this.hideHint();
            }, 5000);
        }
    }

    hideHint() {
        const hintSection = document.getElementById('hintsSection');
        if (hintSection) {
            hintSection.style.display = 'none';
        }
    }

    generateHint() {
        if (this.queens.length === 0) {
            return "Start by placing a queen on any colored square. Remember, each queen must be on a unique color!";
        }

        if (this.queens.length < 4) {
            const usedColors = this.queens.map(q => this.getQueenColor(q, this.boardColors, this.indexBase));
            const availableColors = this.colorNames.filter(color => !usedColors.includes(color));
            return `Try placing a queen on a ${availableColors[0]} square while avoiding row/column conflicts.`;
        }

        // Check for conflicts and provide specific hints
        const result = this.validatePuzzle();
        if (result.conflicts.length > 0) {
            const conflict = result.conflicts[0];
            if (conflict.types.includes('sameRow')) {
                return "Two queens are on the same row! Move one to a different row.";
            } else if (conflict.types.includes('sameColumn')) {
                return "Two queens are on the same column! Move one to a different column.";
            } else if (conflict.types.includes('duplicateColor')) {
                return `Two queens are on the same color (${conflict.details.color})! Each queen needs a unique color.`;
            } else if (conflict.types.includes('adjacentDiagonal')) {
                return "Two queens are attacking each other diagonally (distance = 1)! Move them apart.";
            }
        }

        if (this.queens.length < 8) {
            const usedRows = this.queens.map(q => q.row);
            const usedCols = this.queens.map(q => q.col);
            const availableRows = [];
            for (let i = 1; i <= 8; i++) {
                if (!usedRows.includes(i)) availableRows.push(i);
            }
            if (availableRows.length > 0) {
                return `Try placing a queen on row ${availableRows[0]}. Make sure it's on an unused color!`;
            }
        }

        return "You're doing great! Keep placing queens while following the rules.";
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
        this.renderBoard();
        this.updateGameState();

        // Hide hints
        this.hideHint();
    }

    // Removed loadExample and loadTestInput methods to simplify interface

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

// Enhanced Games Manager for 8 Queens with Colors
if (typeof window !== 'undefined') {
    // Override the original EightQueensGame in games.js
    class EightQueensGameEnhanced extends EightQueensWithColors {
        constructor() {
            super();
            this.gameStartTime = null;
        }

        startGame() {
            this.gameStartTime = Date.now();
            this.resetGame();
            console.log('8 Queens with Colors game started');
        }

        completeGame(won = false) {
            if (this.gameStartTime) {
                const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
                const result = {
                    won: won,
                    score: this.validationResult ? this.validationResult.summary.score : 0,
                    elapsed: elapsed
                };

                if (window.gamesManager) {
                    window.gamesManager.onGameComplete('8queens', result);
                }
            }
        }

        // Override validateAndUpdate to check for completion
        validateAndUpdate() {
            super.validateAndUpdate();
            
            if (this.validationResult && this.validationResult.summary.status === 'perfect') {
                setTimeout(() => {
                    alert('���� Congratulations! You solved the 8 Queens with Colors puzzle!');
                    this.completeGame(true);
                }, 500);
            }
        }
    }

    // Global instance for the games system
    window.EightQueensWithColors = EightQueensWithColors;
    window.EightQueensGameEnhanced = EightQueensGameEnhanced;

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        // Override the original 8queens game in the games manager
        if (window.gamesManager && window.gamesManager.queens) {
            window.gamesManager.queens = new EightQueensGameEnhanced();
        }
    });
}

// Export for Node.js environments (testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EightQueensWithColors;
}
