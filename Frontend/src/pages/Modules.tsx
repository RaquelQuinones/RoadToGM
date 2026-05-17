import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UpperBar, {
  UpperBarLeft,
  UpperBarRight,
  UpperBarLogo,
  UpperBarTitle,
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
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;
  const isTeacher = user?.role === "teacher";

  useEffect(() => {
    loadModules();
  }, []);

  async function loadModules() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:3000/modules");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch modules");
      }

      console.log("Modules from backend:", data);
      setModules(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load modules");
    } finally {
      setLoading(false);
    }
  }

  const filteredModules = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return modules;

    return modules.filter((module) => {
      const title = module.title?.toLowerCase() || "";
      const category = module.category?.toLowerCase() || "";
      const description = module.description?.toLowerCase() || "";
      const difficulty = module.difficulty?.toLowerCase() || "";

      return (
        title.includes(query) ||
        category.includes(query) ||
        description.includes(query) ||
        difficulty.includes(query)
      );
    });
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
          <UpperBarLogo onClick={() => navigate("/")}>
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
              { label: "Shared Modules", href: "/shared-modules" },
              { label: "Classes", href: "/classes" },
              { label: "My Classes", href: "/my-classes" },
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
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  color: colors.white,
                  fontSize: "42px",
                }}
              >
                Explore Modules
              </h1>

              <p
                style={{
                  margin: "10px 0 0",
                  color: colors.text,
                  fontSize: "18px",
                  lineHeight: 1.6,
                }}
              >
                Search through published chess learning modules available to all
                users.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/shared-modules"
                style={{
                  background: colors.surfaceLight || "#3A3A3A",
                  color: colors.white,
                  padding: "12px 16px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Shared Modules
              </Link>

              <Link
                to="/my-modules"
                style={{
                  background: colors.surfaceLight || "#3A3A3A",
                  color: colors.white,
                  padding: "12px 16px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                My Modules
              </Link>

              {isTeacher && (
                <Link
                  to="/classes"
                  style={{
                    background: colors.buttonPrimary,
                    color: colors.white,
                    padding: "12px 16px",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  Classes
                </Link>
              )}
            </div>
          </div>

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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px",
                      alignItems: "center",
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
                        fontSize: "12px",
                        color: module.is_default ? "#7CFC98" : colors.text,
                        background: module.is_default
                          ? "rgba(124, 252, 152, 0.15)"
                          : "rgba(255,255,255,0.08)",
                        padding: "6px 10px",
                        borderRadius: "999px",
                        fontWeight: 700,
                      }}
                    >
                      {module.is_default ? "Default" : "Published"}
                    </span>
                  </div>

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
                      lineHeight: 1.5,
                    }}
                  >
                    {module.description}
                  </span>

                  <span
                    style={{
                      marginTop: "auto",
                      fontSize: "14px",
                      color: colors.text,
                    }}
                  >
                    Difficulty: {module.difficulty || "Beginner"}
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