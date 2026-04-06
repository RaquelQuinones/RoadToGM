import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../palette/color.js";
import { UpperBarButton } from "./UpperBar";

export default function AuthStatus() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();

    function handleStorageChange() {
      loadUser();
    }

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-changed", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-changed", handleStorageChange);
    };
  }, []);

  function loadUser() {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/");
  }

  if (!user) {
    return (
      <>
        <UpperBarButton onClick={() => navigate("/login")}>
          Login
        </UpperBarButton>

        <UpperBarButton
          variant="filled"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </UpperBarButton>
      </>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          lineHeight: 1.1,
        }}
      >
        <span
          style={{
            color: colors.white,
            fontWeight: 700,
            fontSize: "0.95rem",
          }}
        >
          {user.username}
        </span>

        <span
          style={{
            color: colors.text,
            fontSize: "0.78rem",
            textTransform: "capitalize",
          }}
        >
          {user.role}
        </span>
      </div>

      <UpperBarButton onClick={handleLogout}>
        Logout
      </UpperBarButton>
    </div>
  );
}