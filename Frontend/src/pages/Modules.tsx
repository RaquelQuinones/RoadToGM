import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
import AuthStatus from "../components/AuthStatus";

export type Module = {
  module_id: number;
  title: string;
  description: string;
  category: string;
  difficulty?: string;
  is_default?: boolean;
  is_published?: boolean;
  user_id?: number;
};

export default function Modules() {
  const [search, setSearch] = useState("");
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadModules() {
      try {
        const response = await fetch("http://localhost:3000/modules");

        if (!response.ok) {
          throw new Error("Failed to fetch modules");
        }

        const data = await response.json();
        console.log("Modules from backend:", data);
        setModules(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load modules");
      } finally {
        setLoading(false);
      }
    }

    loadModules();
  }, []);

  const filteredModules = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return modules;

    return modules.filter((module) =>
      module.title.toLowerCase().includes(query) ||
      module.category.toLowerCase().includes(query) ||
      module.description.toLowerCase().includes(query)
    );
  }, [search, modules]);

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
          <AuthStatus />

          <DropdownBar
            title="Menu"
            links={[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Explore", href: "/modules" },
              { label: "Create", href: "/create" },
              { label: "My Modules", href: "/my-modules" },
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

        {loading && (
          <p
            style={{
              color: colors.white,
              fontSize: "18px",
            }}
          >
            Loading modules...
          </p>
        )}

        {error && (
          <p
            style={{
              color: "red",
              fontSize: "18px",
            }}
          >
            Error: {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "20px",
              }}
            >
              {filteredModules.map((module) => (
                <Link
                  key={module.module_id}
                  to={`/modules/${module.module_id}`}
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

                  <span
                    style={{
                      fontSize: "15px",
                      color: colors.text,
                    }}
                  >
                    {module.description}
                  </span>
                </Link>
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
          </>
        )}
      </main>
    </div>
  );
}