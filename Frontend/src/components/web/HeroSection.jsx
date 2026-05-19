import { Link } from "react-router-dom";
import { colors } from "../../palette/color.js";

export default function HeroSection({
  title,
  subtitle,
  buttonText,
  buttonHref,
  image,
  imageComponent,
}) {
  return (
    <section
      style={{
        width: "100%",
        maxWidth: "1300px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr",
        gap: "32px",
        alignItems: "center",
        padding: "24px 0 8px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <span
          style={{
            color: colors.text,
            fontSize: "14px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: 700,
          }}
        >
          Chess learning, built around you
        </span>

        <h1
          style={{
            margin: 0,
            color: colors.white,
            fontSize: "clamp(2.6rem, 5vw, 4.7rem)",
            lineHeight: 1.05,
            maxWidth: "700px",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            margin: 0,
            color: colors.text,
            fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
            lineHeight: 1.7,
            maxWidth: "650px",
          }}
        >
          {subtitle}
        </p>

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            marginTop: "8px",
          }}
        >
          <Link
            to={buttonHref}
            style={{
              background: colors.buttonPrimary,
              color: colors.white,
              padding: "14px 22px",
              borderRadius: "14px",
              textDecoration: "none",
              fontWeight: 700,
              display: "inline-block",
            }}
          >
            {buttonText}
          </Link>

          <Link
            to="/modules"
            style={{
              background: "transparent",
              color: colors.white,
              padding: "14px 22px",
              borderRadius: "14px",
              textDecoration: "none",
              fontWeight: 700,
              border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
            }}
          >
            Explore Modules
          </Link>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          minHeight: "420px",
          borderRadius: "24px",
          overflow: "hidden",
          border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: imageComponent ? "24px" : "0",
        }}
      >
        {imageComponent ? (
          imageComponent
        ) : image ? (
          <img
            src={image}
            alt="Hero visual"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              padding: "32px",
              color: colors.white,
              fontSize: "2rem",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            Your training, your modules, your progress.
          </div>
        )}
      </div>
    </section>
  );
}