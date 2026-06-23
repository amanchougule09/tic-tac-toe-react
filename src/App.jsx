import { useState } from "react";
import "./App.css";

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button
      className={`square ${isWinning ? "winning-square" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (winnerInfo || squares[i]) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);

  let status;
  if (winnerInfo) {
    status = `Winner : ${winnerInfo.winner}`;
  } else if (squares.every((sq) => sq !== null)) {
    status = "Match Draw";
  } else {
    status = `Next Player : ${xIsNext ? "X" : "O"}`;
  }

  return (
    <>
      <div className="status">{status}</div>

      <div className="board">
        {squares.map((square, i) => (
          <Square
            key={i}
            value={square}
            isWinning={winnerInfo?.line.includes(i)}
            onSquareClick={() => handleClick(i)}
          />
        ))}

        {winnerInfo && (
          <div className={`winning-line line-${winnerInfo.lineIndex}`}></div>
        )}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      nextSquares,
    ];

    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Tic Tac Toe</h1>

        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
        />

        <button className="restart-btn" onClick={restartGame}>
          Restart Game
        </button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return {
        winner: squares[a],
        line: lines[i],
        lineIndex: i,
      };
    }
  }

  return null;
}