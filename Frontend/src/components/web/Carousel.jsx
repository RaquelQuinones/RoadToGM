import { Link } from "react-router-dom";
import { colors } from "../../palette/color.js";

export default function Carousel({ title, subtitle, items }) {
  return (
    <section
      style={{
        width: "100%",
        maxWidth: "1300px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
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
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          overflowX: "auto",
          paddingBottom: "8px",
          scrollSnapType: "x mandatory",
        }}
      >
        {items.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            style={{
              minWidth: "320px",
              maxWidth: "360px",
              flex: "0 0 auto",
              textDecoration: "none",
              background: colors.surface || "#2A2A2A",
              border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
              borderRadius: "20px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              scrollSnapAlign: "start",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "210px",
                overflow: "hidden",
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: colors.white,
                  fontSize: "1.4rem",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: colors.text,
                  lineHeight: 1.6,
                  fontSize: "0.98rem",
                }}
              >
                {item.text}
              </p>

              <span
                style={{
                  color: colors.buttonPrimary,
                  fontWeight: 700,
                  marginTop: "6px",
                }}
              >
                Learn more →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}