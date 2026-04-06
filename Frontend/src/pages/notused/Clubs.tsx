import React from "react";
import LessonCard from "../../components/LessonCards.jsx";
import { colors } from "../../palette/color.js";

export default function LessonCardTest() {
  return (
    <div
      style={{
        background: colors.background,
        minHeight: "100vh",
        padding: "60px 40px",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: "36px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "48px",
              color: colors.text,
              fontWeight: 800,
            }}
          >
            Recommended Lessons
          </h1>

          <p
            style={{
              margin: "14px auto 0 auto",
              maxWidth: "700px",
              fontSize: "18px",
              lineHeight: 1.6,
              color: colors.text,
              opacity: 0.8,
            }}
          >
            Continue improving with short lessons in tactics, openings, and endgames.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "28px",
            alignItems: "stretch",
          }}
        >
          <LessonCard
            title="Pins"
            description="Learn how pins work, why they are powerful, and how to spot them in practical games."
            category="Tactics"
            difficulty="Beginner"
            duration="10 min"
            buttonText="Start Lesson"
            style={{
              minHeight: "280px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            }}
            buttonProps={{
              href: "/lessons/pins",
            }}
          />

          <LessonCard
            title="Italian Game"
            description="Study one of the most classical openings and understand the main plans for both sides."
            category="Openings"
            difficulty="Beginner"
            duration="12 min"
            buttonText="Explore Opening"
            style={{
              minHeight: "280px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            }}
            buttonProps={{
              href: "/lessons/italian-game",
            }}
          />

          <LessonCard
            title="King and Pawn Endings"
            description="Master opposition, critical squares, and the key ideas needed to win simple endgames."
            category="Endings"
            difficulty="Intermediate"
            duration="15 min"
            buttonText="Study Endgame"
            style={{
              minHeight: "280px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            }}
            buttonProps={{
              href: "/lessons/king-pawn-endings",
            }}
          />
        </div>
      </div>
    </div>
  );
}