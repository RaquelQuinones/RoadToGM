import React from "react";
import UpperBar, {UpperBarLeft, UpperBarRight, UpperBarLogo, UpperBarTitle, UpperBarButton, DropdownBar,} from "../components/UpperBar";
import SideImageCard from "../components/SideImageCard";
import Logo from "../images/Logo.png";
import ModuleCatalog from "../components/ModuleCatalog";
import { colors } from "../palette/color.js";



//This needs navigation menu, hero photo or video, headline and subheading, action button, a way to highligh the objectives/what we are offering and footer! 
//I want a a hero photo with the Login button/signup button/start?
// I then want like a carusel of the thing we offer with action buttons, which is the module explore page, make module, make exercicses, but ofc there should be a check if the user is logged in or not for that to work. :D
// All of these things I want them to be componenets to be reused in other areas ofc.


export default function Home() {
  const moduleSections = [
    {
      title: "Tactics",
      color: colors.text,
      icon: "⚔️",
      modules: [
        { label: "test1", href: "/test" },
        { label: "test4", href: "/test" },
        { label: "test3", href: "/explore/tactics/caballo" },
        { label: "test4", href: "/explore/tactics/king" },
      ],
    },
    {
      title: "Strategies",
      icon: "♜",
      modules: [
        { label: "hello", href: "/explore/strategies/w" },
        { label: "hello squares", href: "/explore/strategies/s" },
        { label: "hello triangles", href: "/explore/strategies/d" },
        { label: "helo rectangles", href: "/explore/strategies/e" },
      ],
    },
    {
      title: "Openings",
      icon: "♞",
      modules: [
        { label: "GAME", href: "/explore/openings/a" },
        { label: "GAMEE", href: "/explore/openings/b" },
        { label: "GAMEEE", href: "/explore/openings/c" },
        { label: "GAMMEEEE", href: "/explore/openings/d" },
      ],
    },
    {
      title: "Endings",
      icon: "♚",
      modules: [
        { label: "endings1", href: "/explore/endings/one" },
        { label: "endings2", href: "/explore/endings/two" },
        { label: "endings3", href: "/explore/endings/three" },
        { label: "endings4", href: "/explore/endings/four" },
      ],
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
              { label: "Contact", href: "/contact" },
              { label: "Test", href: "/about" },
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
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "80px",

        }}
      >
        <SideImageCard
          image={Logo}
          imageAlt="Logo"
          title="Welcome to Road to GM"
          text="Train with focused modules instead of random puzzles. Build routines that match your weaknesses and come back to them anytime."
          buttonText="Learn"
          buttonStyle={{ background: colors.buttonPrimary }}
          buttonProps={{
            onClick: () => console.log("card button"),
            href: "/signup",
          }}
          titleStyle={{ fontSize: "32px" }}
          contentStyle={{ background: colors.background }}
        />

        <SideImageCard
          image={Logo}
          imageAlt="Logo"
          title="Community"
          text="Join Clubs and communities to learn..."
          buttonText="LEARN"
          buttonStyle={{ background: colors.buttonPrimary }}
          buttonProps={{
            onClick: () => console.log("card button"),
            href: "/signup",
          }}
          titleStyle={{ fontSize: "32px" }}
          contentStyle={{ background: colors.background }}
        />

        <SideImageCard
          image={Logo}
          imageAlt="Logo"
          title="Create"
          text="TEST TEST TEST"
          buttonText="CREATE"
          buttonStyle={{ background: colors.buttonPrimary }}
          buttonProps={{
            onClick: () => console.log("card button"),
            href: "/signup",
          }}
          titleStyle={{ fontSize: "32px" }}
          contentStyle={{ background: colors.background }}
        />

        <ModuleCatalog sections={moduleSections} />
      </div>
    </div>
  );
}