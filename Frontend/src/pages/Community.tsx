import React from "react";
import { colors } from "../palette/color.js";

export default function Community() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.background,
        color: colors.text,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      Hello Community Page
    </div>
  );
}