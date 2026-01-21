# Neon Tic Tac Toe 🎮

A modern, high-performance Tic Tac Toe game built with **TypeScript**, **HTML5**, and **CSS3**. features a stunning Neon/Cyberpunk aesthetic, advanced AI opponents, and persistent stats.

![Neon Tic Tac Toe Banner](https://via.placeholder.com/800x200/050614/00f3ff?text=NEON+TIC+TAC+TOE)

## ✨ Features

### 🕹️ Game Modes
- **Player vs Player (PvP)**: Challenge a friend on the same device.
- **Player vs CPU**:
  - **🟢 Easy**: The AI moves completely randomly. Good for kids.
  - **🟡 Medium**: A balanced challenge. The AI blocks valid wins 50% of the time but makes mistakes.
  - **🔴 Hard (Minimax)**: The **Unbeatable** mode. Uses the Minimax algorithm to calculate perfect moves. You can draw, but you cannot win.

### 🎨 Visuals & UI
- **Neon / Cyberpunk Theme**: Glowing effects, dark mode background, and vibrant colors.
- **Smooth Animations**: Pop-in effects for moves, glowing win lines, and hover previews.
- **Responsive Design**: Works perfectly on Desktops, Tablets, and Mobiles.

### 🔊 Audio & Controls
- **Synthesized Sound Effects**: No external audio files required! Uses the Web Audio API to generate sounds in real-time.
- **Mute Toggle**: Play quietly if you prefer.
- **Keyboard Support**: Use Numpad (1-9) or Number keys to play moves fast. `Esc` to reset.

### 💾 Persistence
- **Scoreboard**: Tracks Wins for X, O, and Draws.
- **LocalStorage**: Your stats are saved automatically even if you refresh the browser.

## 🛠️ Technology Stack

- **Core**: Vanilla HTML5, CSS3
- **Logic**: TypeScript (Strict typing)
- **Build Tool**: `tsc` (TypeScript Compiler)
- **No Frameworks**: Pure, lightweight code with zero runtime dependencies.

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari).
- [Node.js](https://nodejs.org/) (Only required for recompiling TypeScript).

### Installation / Setup

1. **Clone or Download** this repository.
   ```sh
   git clone <repository-url>
   cd "Tic Tac Toe"
   ```

2. **Play Immediately**:
   - Simply open `index.html` in your browser.
   - No server needed! (We've configured it to run from local files).

### Development (Re-compiling)

If you want to modify the code in `src/main.ts`:

1. Install dependencies (TypeScript):
   ```sh
   npm install
   # OR just run via npx
   ```

2. Compile TypeScript:
   ```sh
   npx tsc
   ```
   This generates the `dist/main.js` file used by `index.html`.

## 🎮 How to Play

1. **Select Mode**: Use the dropdown at the top to choose your opponent.
2. **Make a Move**: Click on any empty cell.
   - **X** always goes first.
   - If playing against AI, it will move automatically after a short "thinking" delay.
3. **Win or Draw**:
   - Get 3 of your symbols in a row (Horizontal, Vertical, or Diagonal) to win.
   - If the board fills up, it's a Draw.
4. **Controls**:
   - **Reset**: Clears the board for a new game.
   - **Clear Stats**: Resets the win/loss counters.

## 📁 Project Structure

```
Tic Tac Toe/
├── dist/               # Compiled JavaScript output
│   └── main.js
├── src/                # Source TypeScript code
│   └── main.ts         # Core logic, AI, and DOM handling
├── index.html          # Main application entry point
├── style.css           # Styling, animations, and neon effects
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## 🧠 AI Implementation Details

The **Hard Mode** AI is powered by the **Minimax Algorithm**:
- It recursively simulates every possible future move.
- It assigns a score to each outcome (+10 for AI win, -10 for Player win, 0 for Draw).
- It always chooses the move that maximizes its score while assuming the player plays perfectly.
- This makes it mathematically impossible to beat the AI in Hard mode.

---
*Created with ❤️ 
