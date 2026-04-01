import React from "react";
import { colors } from "../palette/color.js";

function TeamMemberCard({
  image,
  name,
  role,
  description,
  links = [],
}) {
  return (
    <div
      style={{
        background: colors.background,
        borderRadius: "18px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "16px",
        border: `1px solid ${colors.background}`,
      }}
    >
      <img
        src={image}
        alt={name}
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          objectFit: "cover",
          display: "block",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <h3
          style={{
            margin: 0,
            color: colors.white,
            fontSize: "24px",
          }}
        >
          {name}
        </h3>

        <p
          style={{
            margin: 0,
            color: colors.buttonPrimary,
            fontWeight: 600,
            fontSize: "16px",
          }}
        >
          {role}
        </p>

        <p
          style={{
            margin: 0,
            color: colors.text,
            fontSize: "15px",
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>

      {links.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              style={{
                color: colors.white,
                textDecoration: "none",
                border: `1px solid ${colors.background}`,
                padding: "8px 14px",
                borderRadius: "12px",
                fontSize: "14px",
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MeetOurTeam({ members = [] }) {
  return (
    <section
      style={{
        width: "100%",
        maxWidth: "1300px",
        margin: "0 auto",
        padding: "60px 40px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          marginBottom: "36px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "42px",
            color: colors.text,
          }}
        >
          Meet Our Team
        </h2>

        <p
          style={{
            marginTop: "14px",
            color: colors.text,
            fontSize: "18px",
            lineHeight: 1.6,
          }}
        >
          The people building Road To GM and helping players learn, train, and grow.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px",
        }}
      >
        {members.map((member, index) => (
          <TeamMemberCard
            key={index}
            image={member.image}
            name={member.name}
            role={member.role}
            description={member.description}
            links={member.links}
          />
        ))}
      </div>
    </section>
  );
}