import React from "react";
import { colors } from "../palette/color.js";
import Button from "./Button.jsx";

export default function LessonCard({
  title,
  description,
  difficulty,
  category,
  duration,
  buttonText = "Start Lesson",
  className = "",
  style = {},
  badgeStyle = {},
  buttonProps = {},
  ...props
}) {
  return (
    <div
      className={className}
      style={{
        background: colors.surface,
        border: `1px solid ${colors.surfaceLight}`,
        borderRadius: "18px",
        padding: "22px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxSizing: "border-box",
        ...style,
      }}
      {...props}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {category && (
          <span
            style={{
              background: colors.background,
              color: colors.text,
              padding: "6px 12px",
              borderRadius: "999px",
              fontSize: "13px",
              ...badgeStyle,
            }}
          >
            {category}
          </span>
        )}

        {difficulty && (
          <span
            style={{
              background: colors.background,
              color: colors.text,
              padding: "6px 12px",
              borderRadius: "999px",
              fontSize: "13px",
              ...badgeStyle,
            }}
          >
            {difficulty}
          </span>
        )}

        {duration && (
          <span
            style={{
              background: colors.background,
              color: colors.text,
              padding: "6px 12px",
              borderRadius: "999px",
              fontSize: "13px",
              ...badgeStyle,
            }}
          >
            {duration}
          </span>
        )}
      </div>

      <h3
        style={{
          margin: 0,
          color: colors.white,
          fontSize: "24px",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          color: colors.text,
          lineHeight: 1.6,
          fontSize: "15px",
        }}
      >
        {description}
      </p>

      <Button
        variant="primary"
        style={{ alignSelf: "flex-start" }}
        {...buttonProps}
      >
        {buttonText}
      </Button>
    </div>
  );
}