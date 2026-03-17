import React from "react";
import Button from "./Button.jsx";
import { colors } from "../palette/color.js";

export default function SharedModuleCard({
  title,
  author,
  category,
  difficulty,
  description,
  saves,
  buttonText = "Open Module",
  className = "",
  style = {},
  buttonProps = {},
  ...props
}) {
  return (
    <div
      className={className}
      style={{
        background: colors.surface,
        border: `1px solid ${colors.surfaceLight}`,
        borderRadius: "20px",
        padding: "24px",
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
              padding: "7px 12px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 600,
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
              padding: "7px 12px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {difficulty}
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <h3
          style={{
            margin: 0,
            color: colors.text,
            fontSize: "24px",
            fontWeight: 800,
          }}
        >
          {title}
        </h3>

        <div
          style={{
            color: colors.text,
            opacity: 0.8,
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          By {author}
        </div>

        <p
          style={{
            margin: 0,
            color: colors.text,
            opacity: 0.82,
            lineHeight: 1.6,
            fontSize: "15px",
          }}
        >
          {description}
        </p>
      </div>

      <div
        style={{
          color: colors.text,
          opacity: 0.78,
          fontSize: "14px",
        }}
      >
        {saves} saves
      </div>

      <Button
        variant="primary"
        style={{
          alignSelf: "flex-start",
          background: colors.buttonPrimary,
          color: colors.text,
        }}
        {...buttonProps}
      >
        {buttonText}
      </Button>
    </div>
  );
}