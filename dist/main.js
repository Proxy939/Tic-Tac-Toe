"use strict";
// --- Constants ---
const WIN_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6] // Diagonals
];
// --- State ---
const state = {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    isGameActive: true,
    mode: 'pvp',
    stats: loadStats(),
    isMuted: false
};
// --- Audio Context ---
let audioCtx = null;
const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
// --- DOM Elements ---
const elements = {
    board: document.getElementById('board'),
    status: document.getElementById('status-display'),
    modeSelect: document.getElementById('game-mode'),
    muteBtn: document.getElementById('mute-btn'),
    resetBtn: document.getElementById('reset-btn'),
    clearStatsBtn: document.getElementById('clear-stats-btn'),
    scoreX: document.getElementById('score-x'),
    scoreO: document.getElementById('score-o'),
    scoreDraw: document.getElementById('score-draw'),
};
// --- Initialization ---
function init() {
    renderBoard();
    updateStatus();
    updateScoreboard();
    // Event Listeners
    elements.modeSelect.addEventListener('change', handleModeChange);
    elements.muteBtn.addEventListener('click', toggleMute);
    elements.resetBtn.addEventListener('click', resetGame);
    elements.clearStatsBtn.addEventListener('click', clearStats);
    document.addEventListener('keydown', handleKeyboard);
}
// --- Core Game Logic ---
function handleCellClick(index) {
    if (!state.isGameActive || state.board[index] !== null)
        return;
    // Player Move
    makeMove(index, state.currentPlayer);
    if (state.isGameActive && isAiTurn()) {
        // Small delay for realism
        state.isGameActive = false; // Block input while AI thinks
        elements.status.innerText = "AI THINKING...";
        setTimeout(() => {
            state.isGameActive = true;
            makeAiMove();
        }, 600);
    }
}
function makeMove(index, player) {
    state.board[index] = player;
    renderCell(index);
    playSound('move');
    if (checkWin(state.board, player)) {
        endGame(player);
    }
    else if (state.board.every(cell => cell !== null)) {
        endGame('draw');
    }
    else {
        state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
    }
}
function isAiTurn() {
    return state.mode !== 'pvp' && state.currentPlayer === 'O';
}
function makeAiMove() {
    if (!state.isGameActive)
        return;
    let moveIndex = -1;
    const difficulty = getDifficulty();
    if (difficulty === 'easy') {
        moveIndex = getRandomMove();
    }
    else if (difficulty === 'medium') {
        // 50% chance to be smart, 50% random
        if (Math.random() > 0.5) {
            moveIndex = getBestMove(state.board, 'O');
        }
        else {
            moveIndex = getRandomMove();
        }
    }
    else {
        // Hard - Minimax
        moveIndex = getBestMove(state.board, 'O');
    }
    if (moveIndex !== -1) {
        makeMove(moveIndex, 'O');
    }
}
function getDifficulty() {
    switch (state.mode) {
        case 'pvec': return 'easy';
        case 'pvcm': return 'medium';
        case 'pvch': return 'hard';
        default: return 'easy';
    }
}
function getRandomMove() {
    const available = state.board.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
    if (available.length === 0)
        return -1;
    return available[Math.floor(Math.random() * available.length)];
}
// --- Minimax AI ---
function getBestMove(board, aiPlayer) {
    let bestScore = -Infinity;
    let move = -1;
    // Optimization: If empty board, take center
    if (board.every(c => c === null))
        return 4;
    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            board[i] = aiPlayer;
            const score = minimax(board, 0, false, aiPlayer);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}
const SCORES = {
    X: -10,
    O: 10,
    TIE: 0
};
function minimax(board, depth, isMaximizing, aiPlayer) {
    // Check terminal states
    if (checkWin(board, 'O'))
        return SCORES.O - depth; // Prefer faster wins
    if (checkWin(board, 'X'))
        return SCORES.X + depth; // Prefer slower losses
    if (board.every(c => c !== null))
        return SCORES.TIE;
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                const score = minimax(board, depth + 1, false, aiPlayer);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    }
    else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                const score = minimax(board, depth + 1, true, aiPlayer);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}
function checkWin(board, player) {
    return WIN_COMBINATIONS.some(combo => {
        return combo.every(index => board[index] === player);
    });
}
function getWinningCombo(board, player) {
    return WIN_COMBINATIONS.find(combo => {
        return combo.every(index => board[index] === player);
    }) || null;
}
// --- Rendering & UI ---
function renderBoard() {
    elements.board.innerHTML = '';
    state.board.forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        if (cell) {
            cellDiv.classList.add(cell.toLowerCase(), 'filled');
            cellDiv.innerText = cell;
        }
        cellDiv.addEventListener('click', () => handleCellClick(index));
        // Hover hint
        cellDiv.addEventListener('mouseenter', () => {
            const currentVal = state.board[index];
            if (!currentVal && state.isGameActive && (!isAiTurn())) {
                cellDiv.style.color = 'rgba(255,255,255,0.2)';
                cellDiv.innerText = state.currentPlayer;
            }
        });
        cellDiv.addEventListener('mouseleave', () => {
            const currentVal = state.board[index];
            if (!currentVal) {
                cellDiv.style.color = '';
                cellDiv.innerText = '';
            }
        });
        elements.board.appendChild(cellDiv);
    });
}
function renderCell(index) {
    const cellDiv = elements.board.children[index];
    if (!cellDiv)
        return;
    const val = state.board[index];
    if (val) {
        cellDiv.innerText = val;
        cellDiv.classList.add(val.toLowerCase(), 'filled');
        // Reset styles from hover
        cellDiv.style.color = '';
    }
}
function updateStatus() {
    if (!state.isGameActive && !isAiTurn())
        return; // Don't overwrite game over msg unless restarting
    if (state.mode === 'pvp') {
        elements.status.innerText = `PLAYER ${state.currentPlayer} TURN`;
    }
    else {
        if (state.currentPlayer === 'X') {
            elements.status.innerText = "YOUR TURN (X)";
        }
        else {
            elements.status.innerText = "AI THINKING...";
        }
    }
    // Colorize status
    elements.status.style.color = state.currentPlayer === 'X' ? 'var(--neon-cyan)' : 'var(--neon-magenta)';
}
function endGame(winner) {
    state.isGameActive = false;
    if (winner === 'draw') {
        elements.status.innerText = "GAME DRAW!";
        elements.status.style.color = '#fff';
        state.stats.draws++;
        playSound('draw');
    }
    else {
        elements.status.innerText = `WINNER: ${winner}`;
        elements.status.style.color = winner === 'X' ? 'var(--neon-cyan)' : 'var(--neon-magenta)';
        if (winner === 'X')
            state.stats.xWins++;
        else
            state.stats.oWins++;
        playSound('win');
        highlightWin(winner);
    }
    saveStats();
    updateScoreboard();
}
function highlightWin(winner) {
    const combo = getWinningCombo(state.board, winner);
    if (combo) {
        combo.forEach(index => {
            const cell = elements.board.children[index];
            if (cell)
                cell.classList.add(`win-${winner.toLowerCase()}c`);
        });
    }
}
// --- Data Persistence ---
function saveStats() {
    localStorage.setItem('tictactoe_stats', JSON.stringify(state.stats));
}
function loadStats() {
    const stored = localStorage.getItem('tictactoe_stats');
    if (stored) {
        return JSON.parse(stored);
    }
    return { xWins: 0, oWins: 0, draws: 0 };
}
function updateScoreboard() {
    elements.scoreX.innerText = state.stats.xWins.toString();
    elements.scoreO.innerText = state.stats.oWins.toString();
    elements.scoreDraw.innerText = state.stats.draws.toString();
}
function clearStats() {
    state.stats = { xWins: 0, oWins: 0, draws: 0 };
    saveStats();
    updateScoreboard();
    resetGame();
}
// --- Controls ---
function handleModeChange(e) {
    const select = e.target;
    state.mode = select.value;
    resetGame();
}
function resetGame() {
    state.board = Array(9).fill(null);
    state.currentPlayer = 'X';
    state.isGameActive = true;
    renderBoard();
    updateStatus();
}
function handleKeyboard(e) {
    if (e.key === 'Escape') {
        resetGame();
        return;
    }
    // Numpad or digit mapping
    const key = parseInt(e.key);
    if (!isNaN(key) && key >= 1 && key <= 9) {
        // Map 1-9 to 0-8 (Board layout usually: 789 / 456 / 123 on numpad, or 123 / 456 / 789 standard)
        // Let's use 1-9 standard reading order:
        // 1 2 3
        // 4 5 6
        // 7 8 9
        const index = key - 1;
        handleCellClick(index);
    }
}
// --- Audio System (Oscillator Synth) ---
function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new AudioContextCtor();
    }
    return audioCtx;
}
function toggleMute() {
    state.isMuted = !state.isMuted;
    elements.muteBtn.innerText = state.isMuted ? '🔇' : '🔊';
}
function playSound(type) {
    if (state.isMuted)
        return;
    const ctx = getAudioContext();
    if (!ctx)
        return;
    if (ctx.state === 'suspended')
        ctx.resume();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    const now = ctx.currentTime;
    if (type === 'move') {
        // High pitched short beep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    }
    else if (type === 'win') {
        // Victory chord
        playTone(440, 'triangle', 0.2, 0); // A4
        playTone(554.37, 'triangle', 0.2, 0.1); // C#5
        playTone(659.25, 'triangle', 0.4, 0.2); // E5
    }
    else if (type === 'draw') {
        // Low unenthusiastic hum
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(150, now + 0.3);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    }
}
function playTone(freq, type, duration, delay) {
    if (state.isMuted)
        return;
    const ctx = getAudioContext();
    if (!ctx)
        return;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    const now = ctx.currentTime + delay;
    osc.type = type;
    osc.frequency.value = freq;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
    osc.start(now);
    osc.stop(now + duration);
}
// Start
document.addEventListener('DOMContentLoaded', init);
