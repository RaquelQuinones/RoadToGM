import React from "react";
import { colors } from "../palette/color.js";

export default function Button({
  variant = "primary",
  children,
  href,
  className = "",
  style = {},
  ...props
}) {
  const variants = {
    primary: {
      background: colors.primary,
      color: colors.white,
      border: "none",
    },

    navbar: {
      background: "transparent",
      color: colors.black,
      border: `1px solid ${colors.black}`,
    },
  };

  const baseStyle = {
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "14px",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
    whiteSpace: "nowrap",
    ...variants[variant],
    ...style,
  };

  if (href) {
    return (
      <a href={href} className={className} style={baseStyle} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={className} style={baseStyle} {...props}>
      {children}
    </button>
  );
}