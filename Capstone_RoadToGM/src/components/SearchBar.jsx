import React from "react";
import { colors } from "../palette/color.js";

export default function SearchBar({
  value = "",
  onChange,
  placeholder = "Search modules...",
  className = "",
  style = {},
  inputProps = {},
  ...props
}) {
  return (
    <div
      className={className}
      style={{
        width: "100%",
        maxWidth: "700px",
        display: "flex",
        alignItems: "center",
        background: colors.surface || "#2A2A2A",
        border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
        borderRadius: "14px",
        padding: "12px 16px",
        boxSizing: "border-box",
        ...style,
      }}
      {...props}
    >
      <span
        style={{
          fontSize: "18px",
          marginRight: "10px",
          color: colors.textSecondary || "#CFCFCF",
        }}
      >
        🔍
      </span>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          outline: "none",
          color: colors.text || "#E6E6E6",
          fontSize: "16px",
        }}
        {...inputProps}
      />
    </div>
  );
}