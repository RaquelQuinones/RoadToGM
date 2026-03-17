import React, { useMemo, useState } from "react";
import UpperBar, {
  UpperBarLeft,
  UpperBarRight,
  UpperBarLogo,
  UpperBarTitle,
  UpperBarButton,
  DropdownBar,
} from "../components/UpperBar";
import SearchBar from "../components/SearchBar";
import { colors } from "../palette/color.js";
import Logo from "../images/Logo.png";

export default function ModulePage() {
  const [search, setSearch] = useState("");

  const modules = [
    { title: "Peon", category: "Tactics", href: "/tactics/peon" },
    { title: "Alfiler", category: "Tactics", href: "/tactics/alfiler" },
    { title: "Caballo", category: "Tactics", href: "/tactics/caballo" },
    { title: "estrategia1", category: "Strategies", href: "/strategies/w" },
    { title: "estrategia2", category: "Strategies", href: "/strategies/s" },
    { title: "open1", category: "Openings", href: "/openings/a" },
    { title: "open2", category: "Openings", href: "/openings/b" },
    { title: "open3", category: "Endings", href: "/endings/four" },
  ];

  const filteredModules = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return modules;

    return modules.filter((module) =>
      module.title.toLowerCase().includes(query) ||
      module.category.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.background,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <UpperBar>
        <UpperBarLeft>
          <UpperBarLogo onClick={() => console.log("logo click")}>
            <img
              src={Logo}
              alt="Road To GM Logo"
              style={{ height: "36px", objectFit: "contain" }}
            />
          </UpperBarLogo>

          <UpperBarTitle style={{ color: colors.white }}>
            Road To GM
          </UpperBarTitle>
        </UpperBarLeft>

        <UpperBarRight>
          <UpperBarButton onClick={() => console.log("login")}>
            Login
          </UpperBarButton>

          <UpperBarButton
            variant="filled"
            onClick={() => console.log("signup")}
          >
            Sign Up
          </UpperBarButton>

          <DropdownBar
            title="Menu"
            links={[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
              { label: "Test", href: "/about" },
              { label: "Explore", href: "/modules" },
            ]}
            triggerStyle={{ background: colors.buttonPrimary }}
            itemProps={{ target: "_self" }}
          />
        </UpperBarRight>
      </UpperBar>

      <main
        style={{
          padding: "40px",
          maxWidth: "1200px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: colors.white,
              fontSize: "42px",
            }}
          >
            Modules
          </h1>

          <p
            style={{
              margin: 0,
              color: colors.text,
              fontSize: "18px",
            }}
          >
            Search through your chess learning modules.
          </p>

          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tactics, openings, strategies..."
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredModules.map((module, index) => (
            <a
              key={index}
              href={module.href}
              style={{
                textDecoration: "none",
                background: colors.surface || "#2A2A2A",
                border: `1px solid ${colors.surfaceLight || "#3A3A3A"}`,
                borderRadius: "16px",
                padding: "20px",
                color: colors.white,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  color: colors.text,
                }}
              >
                {module.category}
              </span>

              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                }}
              >
                {module.title}
              </span>
            </a>
          ))}
        </div>

        {filteredModules.length === 0 && (
          <p
            style={{
              marginTop: "32px",
              color: colors.text,
              fontSize: "16px",
            }}
          >
            No modules found.
          </p>
        )}
      </main>
    </div>
  );
}