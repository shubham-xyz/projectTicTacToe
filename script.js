// Gameboard Module: Manages the game state
const Gameboard = (() => {
    const board = Array(9).fill(null);

    const getBoard = () => board;

    const setMove = (index, player) => {
        if (!board[index]) {
            board[index] = player;
            return true;
        }
        return false;
    };

    const resetBoard = () => board.fill(null);

    return { getBoard, setMove, resetBoard };
})();

// Player Factory Function: Creates player objects
const Player = (name, symbol) => {
    return { name, symbol };
};

// GameController Module: Manages game flow, turns, and win conditions
const GameController = (() => {
    const playerX = Player("Player X", "X");
    const playerO = Player("Player O", "O");
    let currentPlayer = playerX;
    let gameOver = false;

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        return board.includes(null) ? null : "Tie";
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === playerX ? playerO : playerX;
    };

    const makeMove = (index) => {
        if (!gameOver && Gameboard.setMove(index, currentPlayer.symbol)) {
            const result = checkWinner();
            if (result) {
                gameOver = true;
                displayController.updateStatus(
                    result === "Tie" ? "It's a Tie!" : `${currentPlayer.name} Wins!`
                );
            } else {
                switchPlayer();
                displayController.updateStatus(`${currentPlayer.name}'s Turn`);
            }
            displayController.renderBoard();
        }
    };

    const restartGame = () => {
        Gameboard.resetBoard();
        currentPlayer = playerX;
        gameOver = false;
        displayController.updateStatus("Player X's Turn");
        displayController.renderBoard();
    };

    return { makeMove, restartGame };
})();

// DisplayController Module: Manages DOM interactions and updates
const displayController = (() => {
    const cells = document.querySelectorAll(".cell");
    const statusText = document.getElementById("gameStatus");
    const restartButton = document.getElementById("restartButton");

    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => GameController.makeMove(index));
    });

    restartButton.addEventListener("click", GameController.restartGame);

    const renderBoard = () => {
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    const updateStatus = (message) => {
        statusText.textContent = message;
    };

    return { renderBoard, updateStatus };
})();

// Initial render
displayController.renderBoard();
