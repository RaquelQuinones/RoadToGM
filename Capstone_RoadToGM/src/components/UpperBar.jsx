import React from "react";
import DropdownBar from "./DropdownBar";
import { colors } from "../palette/color.js";

export default function UpperBar({
  logo = "P",
  title = "My Site",
  children,

  className = "",
  style = {},
  ...props
}) {
  return (
    <header
      className={className}
      style={{
        width: "100%",
        padding: "16px 24px",
        borderBottom: colors.section,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
        background: colors.section,
        //#181714
        ...style,
      }}
      {...props}
    >
      {children}
    </header>
  );
}

export function UpperBarLeft({
  children,
  className = "",
  style = {},
  ...props
}) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function UpperBarRight({
  children,
  className = "",
  style = {},
  ...props
}) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function UpperBarLogo({
  children = "P",
  className = "",
  style = {},
  ...props
}) {
  return (
    <button
      type="button"
      className={className}
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        border: "none",
        background: "#111827",
        color: colors.white,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: "18px",
        cursor: "pointer",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function UpperBarTitle({
  children = "My Site",
  className = "",
  style = {},
  ...props
}) {
  return (
    <span
      className={className}
      style={{
        fontSize: "18px",
        fontWeight: 700,
        color: colors.black,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}

export function UpperBarButton({
  children,
  variant = "outline",
  className = "",
  style = {},
  ...props
}) {
  const variants = {
    outline: {
      background: colors.white,
      color: colors.black, //El login button
      border: "1px solid #d1d5db",
    },
    filled: {
      background: "#111827",
      color: colors.white,
      border: "none",
    },
  };

  return (
    <button
      type="button"
      className={className}
      style={{
        padding: "10px 16px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: 600,
        ...variants[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export { DropdownBar };