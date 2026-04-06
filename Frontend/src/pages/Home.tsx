import React from "react";
import UpperBar, {
  UpperBarLeft,
  UpperBarRight,
  UpperBarLogo,
  UpperBarTitle,
  UpperBarButton,
  DropdownBar,
} from "../components/UpperBar";
import ModuleCatalog from "../components/ModuleCatalog";
import HeroSection from "../components/web/HeroSection";
import ObjectivesGrid from "../components/web/Grid";
import Footer from "../components/web/Footer";

import Logo from "../images/Logo.png";
import { colors } from "../palette/color.js";

export default function Home() {
  const moduleSections = [
    {
      title: "Tactics",
      color: colors.text,
      icon: "⚔️",
      modules: [
        { label: "Pins", href: "/exercise/1" },
        { label: "Forks", href: "/exercise/2" },
        { label: "Skewers", href: "/exercise/3" },
        { label: "Discovered Attack", href: "/exercise/4" },
      ],
    },
    {
      title: "Strategies",
      icon: "♜",
      modules: [
        { label: "Planning", href: "/modules" },
        { label: "Piece Activity", href: "/modules" },
        { label: "Pawn Structure", href: "/modules" },
        { label: "Weak Squares", href: "/modules" },
      ],
    },
    {
      title: "Openings",
      icon: "♞",
      modules: [
        { label: "Italian Game", href: "/modules" },
        { label: "Sicilian Basics", href: "/modules" },
        { label: "Queen's Gambit", href: "/modules" },
        { label: "Opening Principles", href: "/modules" },
      ],
    },
    {
      title: "Endings",
      icon: "♚",
      modules: [
        { label: "King and Pawn", href: "/modules" },
        { label: "Basic Checkmates", href: "/modules" },
        { label: "Opposition", href: "/modules" },
        { label: "Rook Endings", href: "/modules" },
      ],
    },
  ];

  const objectiveItems = [
    {
      eyebrow: "Learn",
      title: "Structured Module Learning",
      text: "Train through focused modules instead of random puzzles, and build a routine around your weaknesses.",
      image: Logo,
      href: "/modules",
    },
    {
      eyebrow: "Create",
      title: "Create Your Own Training",
      text: "Design your own modules and exercises so your preparation matches the way you want to learn.",
      image: Logo,
      href: "/create-module",
    },
    {
      eyebrow: "Share",
      title: "Share With Others",
      text: "Use the platform to support clubs, classrooms, and collaborative learning experiences.",
      image: Logo,
      href: "/modules",
    },
    {
      eyebrow: "Practice",
      title: "Interactive Exercise Play",
      text: "Practice positions directly on the board with move validation and guided exercise solving.",
      image: Logo,
      href: "/exercise/1",
    },
  ];

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: colors.background,
        minHeight: "100vh",
      }}
    >
      <UpperBar>
        <UpperBarLeft>
          <UpperBarLogo onClick={() => console.log("logo click")}>
            <img
              src={Logo}
              alt="Road To GM Logo"
              style={{ height: "40px" }}
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
              { label: "Explore", href: "/modules" },
              { label: "Community", href: "/community" },
            ]}
            triggerStyle={{ background: colors.buttonPrimary }}
            itemProps={{
              target: "_self",
            }}
          />
        </UpperBarRight>
      </UpperBar>

      <div
        style={{
          padding: "32px 24px 60px",
          display: "flex",
          flexDirection: "column",
          gap: "72px",
        }}
      >
        <HeroSection
          title="Train chess with structure, not randomness."
          subtitle="Road To GM helps you learn through organized modules, interactive exercises, and personalized training routines you can build and revisit anytime."
          buttonText="Get Started"
          buttonHref="/modules"
          image={Logo}
        />

        <ObjectivesGrid
          title="What you can do here"
          subtitle="Explore the main ways Road To GM supports learning, practice, and creation."
          items={objectiveItems}
        />

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
              Explore learning areas
            </h2>
            <p
              style={{
                marginTop: "8px",
                marginBottom: 0,
                color: colors.text,
              }}
            >
              Browse modules by category and start training with focused content.
            </p>
          </div>

          <ModuleCatalog sections={moduleSections} />
        </section>
      </div>

      <Footer />
    </div>
  );
}