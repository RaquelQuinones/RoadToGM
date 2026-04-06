import { Link } from "react-router-dom";
import { colors } from "../../palette/color.js";

export default function ObjectivesGrid({ title, subtitle, items }) {
  return (
    <section
      style={{
        width: "100%",
        maxWidth: "1300px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            color: colors.white,
            fontSize: "2rem",
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            style={{
              marginTop: "8px",
              marginBottom: 0,
              color: colors.text,
              fontSize: "1rem",
              lineHeight: 1.6,
              maxWidth: "760px",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "24px",
        }}
      >
        {items.slice(0, 4).map((item, index) => (
          <Link
            key={index}
            to={item.href}
            style={{
              textDecoration: "none",
              background: colors.surface || "#2A2A2A",
              border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
              borderRadius: "22px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              minHeight: "100%",
              transition: "transform 0.2s ease",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "240px",
                overflow: "hidden",
                background: "#1b1b1b",
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>

            <div
              style={{
                padding: "22px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                flexGrow: 1,
              }}
            >
              {item.eyebrow && (
                <span
                  style={{
                    color: colors.text,
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontWeight: 700,
                  }}
                >
                  {item.eyebrow}
                </span>
              )}

              <h3
                style={{
                  margin: 0,
                  color: colors.white,
                  fontSize: "1.5rem",
                  lineHeight: 1.2,
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: colors.text,
                  lineHeight: 1.6,
                  fontSize: "1rem",
                }}
              >
                {item.text}
              </p>

              <span
                style={{
                  marginTop: "auto",
                  color: colors.buttonPrimary,
                  fontWeight: 700,
                  paddingTop: "10px",
                }}
              >
                Explore →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}