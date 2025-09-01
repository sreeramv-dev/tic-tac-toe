class BlueyTicTacToe {
    constructor() {
        // Game state
        this.board = Array(9).fill('');
        this.currentPlayer = 'X'; // Human player
        this.gameActive = true;
        this.difficulty = 'easy'; // easy or hard
        
        // Tournament state
        this.tournamentData = {
            playerName: '',
            difficulty: 'easy',
            startTime: null,
            currentGame: 1,
            playerWins: 0,
            computerWins: 0,
            gameHistory: []
        };
        
        // Timer state
        this.sessionTimer = null;
        this.gameTimer = null;
        this.sessionStartTime = null;
        this.gameStartTime = null;
        this.sessionTimeLimit = 30 * 60 * 1000; // 30 minutes in milliseconds
        
        // DOM elements
        this.gameStatus = document.getElementById('game-status');
        this.cells = document.querySelectorAll('.cell');
        
        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.setupEventListeners();
        this.showWelcomeScreen();
        this.updateButtonTexts();
    }
    
    updateButtonTexts() {
        // Random catchphrases for start/new game buttons
        const catchphrases = [
            "Wackadoo, let's start!",
            "Off we go!",
            "Let's give it a whirl!",
            "Ready, set, Bluey!"
        ];
        
        // Random phrases for end tournament button
        const endGamePhrases = [
            "All done, let's play later!",
            "Game over, tickety-boo!",
            "Playtime's paused.",
            "That's a wrap, mate."
        ];
        
        // Update start tournament button
        const startBtn = document.getElementById('start-tournament');
        const randomPhrase = catchphrases[Math.floor(Math.random() * catchphrases.length)];
        startBtn.innerHTML = `🌟 ${randomPhrase} 🌟`;
        
        // Update new game button
        const newGameBtn = document.getElementById('reset-btn');
        const randomPhrase2 = catchphrases[Math.floor(Math.random() * catchphrases.length)];
        newGameBtn.textContent = randomPhrase2;
        
        // Update end tournament button
        const endBtn = document.getElementById('end-tournament');
        const randomEndPhrase = endGamePhrases[Math.floor(Math.random() * endGamePhrases.length)];
        endBtn.textContent = randomEndPhrase;
    }
    
    setupEventListeners() {
        // Welcome screen
        document.getElementById('start-tournament').addEventListener('click', () => {
            this.startTournament();
        });
        
        // Game controls
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.startNewGame();
        });
        
        document.getElementById('end-tournament').addEventListener('click', () => {
            this.endTournament();
        });
        
        // Celebration controls
        document.getElementById('continue-tournament').addEventListener('click', () => {
            this.hideCelebration();
            this.checkTournamentStatus();
        });
        
        // Results controls
        document.getElementById('download-results').addEventListener('click', () => {
            this.downloadResults();
        });
        
        document.getElementById('new-tournament').addEventListener('click', () => {
            this.startNewTournament();
        });
        
        // Game board
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });
        
        // Player name input validation
        document.getElementById('player-name').addEventListener('input', (e) => {
            const startBtn = document.getElementById('start-tournament');
            startBtn.disabled = !e.target.value.trim();
        });
    }
    
    showWelcomeScreen() {
        document.getElementById('welcome-screen').style.display = 'flex';
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('results-screen').style.display = 'none';
    }
    
    startTournament() {
        const playerName = document.getElementById('player-name').value.trim();
        const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
        
        if (!playerName) {
            alert('Please enter your name!');
            return;
        }
        
        // Initialize tournament data
        this.tournamentData = {
            playerName: playerName,
            difficulty: difficulty,
            startTime: new Date(),
            currentGame: 1,
            playerWins: 0,
            computerWins: 0,
            gameHistory: []
        };
        
        this.difficulty = difficulty;
        this.sessionStartTime = Date.now();
        
        // Show game screen
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        
        // Update UI
        this.updateTournamentDisplay();
        this.startSessionTimer();
        this.startNewGame();
    }
    
    updateTournamentDisplay() {
        document.getElementById('player-display').textContent = this.tournamentData.playerName;
        document.getElementById('difficulty-display').textContent = 
            this.difficulty === 'easy' ? 'Bluey Mode' : 'Dad Mode';
        document.getElementById('current-game').textContent = this.tournamentData.currentGame;
        document.getElementById('player-series-score').textContent = this.tournamentData.playerWins;
        document.getElementById('computer-series-score').textContent = this.tournamentData.computerWins;
        document.getElementById('player-name-score').textContent = this.tournamentData.playerName;
    }
    
    startSessionTimer() {
        if (this.sessionTimer) clearInterval(this.sessionTimer);
        
        this.sessionTimer = setInterval(() => {
            const elapsed = Date.now() - this.sessionStartTime;
            const remaining = Math.max(0, this.sessionTimeLimit - elapsed);
            
            if (remaining === 0) {
                this.handleSessionTimeout();
                return;
            }
            
            // Show warnings
            if (remaining <= 5 * 60 * 1000 && remaining > 4 * 60 * 1000) {
                this.showTimeWarning('5 minutes remaining!');
            } else if (remaining <= 1 * 60 * 1000 && remaining > 0) {
                this.showTimeWarning('1 minute remaining!');
            }
            
            // Update display
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            document.getElementById('session-timer').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    startGameTimer() {
        if (this.gameTimer) clearInterval(this.gameTimer);
        
        this.gameStartTime = Date.now();
        
        this.gameTimer = setInterval(() => {
            const elapsed = Date.now() - this.gameStartTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            document.getElementById('game-timer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    showTimeWarning(message) {
        // Simple alert for now - could be enhanced with custom modal
        alert(`⏰ ${message}`);
    }
    
    handleSessionTimeout() {
        clearInterval(this.sessionTimer);
        clearInterval(this.gameTimer);
        this.gameActive = false;
        this.showResults('Session timeout! Tournament ended.');
    }
    
    startNewGame() {
        // Reset game state
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        // Clear board
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        // Start game timer
        this.startGameTimer();
        
        // Update status
        const playerName = this.tournamentData.playerName || 'Player';
        this.updateStatus(`${playerName}, your turn! Click a cell to play.`);
    }
    
    handleCellClick(index) {
        if (this.board[index] !== '' || !this.gameActive || this.currentPlayer !== 'X') {
            return;
        }
        
        this.makeMove(index, 'X');
        
        if (this.gameActive) {
            setTimeout(() => {
                this.computerMove();
            }, 500);
        }
    }
    
    makeMove(index, player) {
        this.board[index] = player;
        this.updateCell(index, player);
        
        if (this.checkWin(player)) {
            this.handleGameEnd(player);
        } else if (this.checkDraw()) {
            this.handleGameEnd('draw');
        } else {
            this.switchPlayer();
        }
    }
    
    updateCell(index, player) {
        const cell = this.cells[index];
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
        cell.classList.add('disabled');
    }
    
    computerMove() {
        if (!this.gameActive) return;
        
        const bestMove = this.getBestMove();
        if (bestMove !== -1) {
            this.makeMove(bestMove, 'O');
        }
    }
    
    getBestMove() {
        if (this.difficulty === 'easy') {
            return this.getEasyMove();
        } else {
            return this.getHardMove();
        }
    }
    
    getEasyMove() {
        // Easy mode: AI plays suboptimally to let kids win more often
        
        // 30% chance to take winning move
        if (Math.random() < 0.3) {
            for (let i = 0; i < 9; i++) {
                if (this.board[i] === '') {
                    this.board[i] = 'O';
                    if (this.checkWin('O', false)) {
                        this.board[i] = '';
                        return i;
                    }
                    this.board[i] = '';
                }
            }
        }
        
        // 40% chance to block player from winning
        if (Math.random() < 0.4) {
            for (let i = 0; i < 9; i++) {
                if (this.board[i] === '') {
                    this.board[i] = 'X';
                    if (this.checkWin('X', false)) {
                        this.board[i] = '';
                        return i;
                    }
                    this.board[i] = '';
                }
            }
        }
        
        // Otherwise, make random move
        const availableMoves = [];
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                availableMoves.push(i);
            }
        }
        
        if (availableMoves.length > 0) {
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
        
        return -1;
    }
    
    getHardMove() {
        // Hard mode: Strategic AI (original algorithm)
        
        // 1. Try to win
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'O';
                if (this.checkWin('O', false)) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // 2. Block player from winning
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'X';
                if (this.checkWin('X', false)) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // 3. Take center if available
        if (this.board[4] === '') {
            return 4;
        }
        
        // 4. Take corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(corner => this.board[corner] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        
        // 5. Take any available side
        const sides = [1, 3, 5, 7];
        const availableSides = sides.filter(side => this.board[side] === '');
        if (availableSides.length > 0) {
            return availableSides[Math.floor(Math.random() * availableSides.length)];
        }
        
        return -1;
    }
    
    checkWin(player, shouldHighlight = true) {
        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            if (this.board[a] === player && this.board[b] === player && this.board[c] === player) {
                if (shouldHighlight) {
                    this.highlightWinningCells(condition);
                }
                return true;
            }
        }
        return false;
    }
    
    highlightWinningCells(winningCondition) {
        winningCondition.forEach(index => {
            this.cells[index].classList.add('winning');
        });
    }
    
    checkDraw() {
        return this.board.every(cell => cell !== '');
    }
    
    handleGameEnd(result) {
        this.gameActive = false;
        clearInterval(this.gameTimer);
        
        // Disable all cells
        this.cells.forEach(cell => {
            cell.classList.add('disabled');
        });
        
        // Record game result
        const gameTime = Date.now() - this.gameStartTime;
        const gameResult = {
            gameNumber: this.tournamentData.currentGame,
            result: result,
            duration: gameTime,
            timestamp: new Date()
        };
        
        this.tournamentData.gameHistory.push(gameResult);
        
        // Update scores and display messages
        const playerName = this.tournamentData.playerName;
        
        if (result === 'X') {
            this.tournamentData.playerWins++;
            this.updateStatus(`🎉 ${playerName} wins! Great job!`, 'status-win');
            
            // Random celebration messages for player wins
            const winTitles = ["You're the Cheeky Winner!", "Hooray! You're the Top Dog!", "Wackadoo! You Won!", "Winner, just like Bluey!"];
            const winMessages = [`${playerName} won this game!`, `Great job, ${playerName}!`, `You're brilliant, ${playerName}!`, `Well done, champ!`];
            
            const randomTitle = winTitles[Math.floor(Math.random() * winTitles.length)];
            const randomMessage = winMessages[Math.floor(Math.random() * winMessages.length)];
            
            this.showCelebration(randomTitle, randomMessage, 'win');
        } else if (result === 'O') {
            this.tournamentData.computerWins++;
            this.updateStatus("🤖 Computer wins! Try again!", 'status-lose');
            this.showCelebration('Good try!', `Computer won this time. Keep going!`, 'lose');
        } else {
            // Random draw messages
            const drawTitles = ["It's a Fair Dinkum Tie!", "No Winners, Just Fun!", "Even Stevens, Mate!", "Everyone's a Bluey Champ!"];
            const drawMessages = ["Well played by everyone!", "Great game, mate!", "What a ripper game!", "Fair dinkum effort!"];
            
            const randomDrawTitle = drawTitles[Math.floor(Math.random() * drawTitles.length)];
            const randomDrawMessage = drawMessages[Math.floor(Math.random() * drawMessages.length)];
            
            this.updateStatus("🤝 It's a draw! Good game!", 'status-draw');
            this.showCelebration(randomDrawTitle, randomDrawMessage, 'draw');
        }
        
        this.updateTournamentDisplay();
    }
    
    showCelebration(title, message, type) {
        document.getElementById('celebration-title').textContent = title;
        document.getElementById('celebration-message').textContent = message;
        
        // Update celebration styles based on type
        const overlay = document.getElementById('celebration-overlay');
        overlay.className = `celebration-overlay celebration-${type}`;
        overlay.style.display = 'flex';
        
        // Auto-hide after some time if computer wins or draw
        if (type !== 'win') {
            setTimeout(() => {
                this.hideCelebration();
                this.checkTournamentStatus();
            }, 3000);
        }
    }
    
    hideCelebration() {
        document.getElementById('celebration-overlay').style.display = 'none';
    }
    
    checkTournamentStatus() {
        // Check if tournament is complete
        if (this.tournamentData.currentGame >= 5 || 
            this.tournamentData.playerWins > 2 || 
            this.tournamentData.computerWins > 2) {
            this.endTournament();
        } else {
            // Continue to next game
            this.tournamentData.currentGame++;
            this.updateTournamentDisplay();
            this.startNewGame();
        }
    }
    
    endTournament() {
        clearInterval(this.sessionTimer);
        clearInterval(this.gameTimer);
        
        let resultMessage;
        if (this.tournamentData.playerWins > this.tournamentData.computerWins) {
            resultMessage = `🏆 ${this.tournamentData.playerName} wins the tournament!`;
        } else if (this.tournamentData.computerWins > this.tournamentData.playerWins) {
            resultMessage = `🤖 Computer wins the tournament!`;
        } else {
            resultMessage = `🤝 Tournament ended in a tie!`;
        }
        
        this.showResults(resultMessage);
    }
    
    showResults(resultMessage) {
        document.getElementById('tournament-result-title').textContent = resultMessage;
        
        const finalScore = `${this.tournamentData.playerName}: ${this.tournamentData.playerWins} - Computer: ${this.tournamentData.computerWins}`;
        document.getElementById('final-score').textContent = finalScore;
        
        // Create results summary
        let summary = `<h3>Game Summary:</h3><ul>`;
        this.tournamentData.gameHistory.forEach(game => {
            const duration = Math.floor(game.duration / 1000);
            const winner = game.result === 'X' ? this.tournamentData.playerName : 
                          game.result === 'O' ? 'Computer' : 'Draw';
            summary += `<li>Game ${game.gameNumber}: ${winner} (${duration}s)</li>`;
        });
        summary += `</ul>`;
        
        // Add session info
        const sessionDuration = Math.floor((Date.now() - this.sessionStartTime) / 1000);
        const sessionMinutes = Math.floor(sessionDuration / 60);
        const sessionSeconds = sessionDuration % 60;
        summary += `<p><strong>Total Session Time:</strong> ${sessionMinutes}m ${sessionSeconds}s</p>`;
        summary += `<p><strong>Difficulty:</strong> ${this.difficulty === 'easy' ? 'Bluey Mode' : 'Dad Mode'}</p>`;
        
        document.getElementById('results-summary').innerHTML = summary;
        
        // Show results screen
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('results-screen').style.display = 'flex';
    }
    
    downloadResults() {
        const headers = ['Timestamp', 'PlayerName', 'Difficulty', 'GameNumber', 'Result', 
                        'PlayerScore', 'ComputerScore', 'GameDuration', 'SessionDuration'];
        
        let tsvContent = headers.join('\t') + '\n';
        
        const sessionDuration = Math.floor((Date.now() - this.sessionStartTime) / 1000);
        
        this.tournamentData.gameHistory.forEach(game => {
            const row = [
                game.timestamp.toISOString(),
                this.tournamentData.playerName,
                this.tournamentData.difficulty,
                game.gameNumber,
                game.result === 'X' ? 'Win' : game.result === 'O' ? 'Loss' : 'Draw',
                this.tournamentData.playerWins,
                this.tournamentData.computerWins,
                Math.floor(game.duration / 1000),
                sessionDuration
            ];
            tsvContent += row.join('\t') + '\n';
        });
        
        // Create and download file
        const blob = new Blob([tsvContent], { type: 'text/tab-separated-values' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bluey_tictactoe_results_${this.tournamentData.playerName}_${new Date().toISOString().split('T')[0]}.tsv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    startNewTournament() {
        // Reset everything
        clearInterval(this.sessionTimer);
        clearInterval(this.gameTimer);
        
        // Clear form
        document.getElementById('player-name').value = '';
        document.querySelector('input[name="difficulty"][value="easy"]').checked = true;
        
        this.showWelcomeScreen();
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        
        const playerName = this.tournamentData.playerName || 'Player';
        if (this.currentPlayer === 'X') {
            this.updateStatus(`${playerName}, your turn! Click a cell to play.`);
        } else {
            this.updateStatus("Computer is thinking...");
        }
    }
    
    updateStatus(message, className = '') {
        this.gameStatus.textContent = message;
        this.gameStatus.className = className;
    }
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BlueyTicTacToe();
});
