import React from "react";
import Button from "./Button.jsx";
import { colors } from "../palette/color.js";

export default function CreateModuleButton({
  children = "Create Module",
  className = "",
  style = {},
  ...props
}) {
  return (
    <Button
      variant="primary"
      className={className}
      style={{
        background: colors.buttonPrimary,
        color: colors.text,
        fontWeight: 700,
        ...style,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}