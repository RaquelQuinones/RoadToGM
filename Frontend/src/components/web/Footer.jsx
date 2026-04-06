import { Link } from "react-router-dom";
import { colors } from "../../palette/color.js";

export default function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        marginTop: "40px",
        borderTop: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
        background: colors.background,
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "28px 24px",
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              color: colors.white,
              fontSize: "1.2rem",
            }}
          >
            Road To GM
          </h3>
          <p
            style={{
              marginTop: "8px",
              marginBottom: 0,
              color: colors.text,
              maxWidth: "420px",
              lineHeight: 1.6,
            }}
          >
            A chess learning platform focused on structured modules, interactive
            exercises, and customizable training routines.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "18px",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <Link to="/" style={{ color: colors.text, textDecoration: "none" }}>
            Home
          </Link>
          <Link to="/about" style={{ color: colors.text, textDecoration: "none" }}>
            About
          </Link>
          <Link to="/modules" style={{ color: colors.text, textDecoration: "none" }}>
            Modules
          </Link>
          <Link
            to="/create-module"
            style={{ color: colors.text, textDecoration: "none" }}
          >
            Create
          </Link>
        </div>
      </div>
    </footer>
  );
}