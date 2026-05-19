import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function AnimatedChessBoard() {
  const gameRef = useRef(new Chess());
  const moveIndexRef = useRef(0);

  const [fen, setFen] = useState(gameRef.current.fen());

  const openingMoves = [
    "e4",
    "e5",
    "Nf3",
    "Nc6",
    "Bb5",
    "a6",
    "Ba4",
    "Nf6",
    "O-O",
    "Be7",
  ];

  useEffect(() => {
    const interval = window.setInterval(() => {
      try {
        if (moveIndexRef.current >= openingMoves.length) {
          gameRef.current = new Chess();
          moveIndexRef.current = 0;
          setFen(gameRef.current.fen());
          return;
        }

        const nextMove = openingMoves[moveIndexRef.current];
        const result = gameRef.current.move(nextMove);

        if (!result) {
          gameRef.current = new Chess();
          moveIndexRef.current = 0;
          setFen(gameRef.current.fen());
          return;
        }

        setFen(gameRef.current.fen());
        moveIndexRef.current++;
      } catch (error) {
        console.error("Chess animation error:", error);

        gameRef.current = new Chess();
        moveIndexRef.current = 0;
        setFen(gameRef.current.fen());
      }
    }, 1300);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "430px",
        padding: "18px",
        background: "rgba(255, 255, 255, 0.08)",
        borderRadius: "24px",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Chessboard
        options={{
          position: fen,
          boardWidth: 390,
          allowDragging: false,
          animationDurationInMs: 700,
          boardStyle: {
            borderRadius: "18px",
            boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
          },
          lightSquareStyle: {
            backgroundColor: "#eee6d8",
          },
          darkSquareStyle: {
            backgroundColor: "#7b5f46",
          },
        }}
      />
    </div>
  );
}