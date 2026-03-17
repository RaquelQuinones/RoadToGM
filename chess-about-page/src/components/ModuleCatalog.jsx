import React, { useState } from "react";
import { colors } from "../palette/color";

function ModuleCard({ title, icon, modules = [] }) {
  const [open, setOpen] = useState(true);

  return (
    <div
      style={{
        borderBottom: colors.white,
        padding: "24px 0"
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          background: colors.section,
          border: "none",
          cursor: "pointer",
          color: colors.textPrimary
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: colors.section,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px"
            }}
          >
            {icon}
          </div>

          <h2 style={{ margin: 0, color: colors.white}}>{title}</h2>
        </div>

        <span style={{ fontSize: "20px" }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div
          style={{
            marginTop: "20px",
            marginLeft: "64px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px 40px"
          }}
        >
          {modules.map((module, index) => (
            <a
              key={index}
              href={module.href}
              style={{
                textDecoration: "none",
                color: colors.text,
                fontSize: "16px"
              }}
            >
              {module.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ModuleCatalog({ sections }) {
  return (
    <section
      style={{
        background: colors.section,
        borderRadius: "12px",
        padding: "40px",
        maxWidth: "1200px",
        margin: "40px auto"
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px"
        }}
      >
        {sections.map((section, index) => (
          <ModuleCard
            key={index}
            title={section.title}
            icon={section.icon}
            modules={section.modules}
          />
        ))}
      </div>
    </section>
  );
}