import React from "react";
import Button from "./Button.jsx";
import { colors } from "../palette/color.js";

export default function ClubCard({
  title,
  description,
  members,
  tags = [],
  buttonText = "View Club",
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
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h3
          style={{
            margin: 0,
            color: colors.text,
            fontSize: "26px",
            fontWeight: 800,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            margin: 0,
            color: colors.text,
            opacity: 0.82,
            fontSize: "15px",
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>

      <div
        style={{
          color: colors.text,
          opacity: 0.85,
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        {members} members
      </div>

      {tags.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {tags.map((tag, index) => (
            <span
              key={index}
              style={{
                background: colors.background,
                color: colors.text,
                padding: "7px 12px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

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