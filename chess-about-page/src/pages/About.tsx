import React from "react";
import UpperBar, {
  UpperBarLeft,
  UpperBarRight,
  UpperBarLogo,
  UpperBarTitle,
  UpperBarButton,
  DropdownBar,
} from "../components/UpperBar";
import MeetOurTeam from "../components/MeetOurTeam";
import { colors } from "../palette/color.js";
import Logo from "../images/Logo.png";
// import Person1 from "../images/person1.jpg";
// import Person2 from "../images/person2.jpg";
// import Person3 from "../images/person3.jpg";

export default function About() {
  const teamMembers = [
    {
      image: Logo,
      name: "Raquel",
      role: "Founder / Developer",
      description:
        "Focused on building Road To GM as a platform where players can learn chess through structured modules and personalized practice.",
      links: [
        { label: "GitHub", href: "#" },
        { label: "LinkedIn", href: "#" },
      ],
    },
    {
      image: Logo,
      name: "Jasey",
      role: "Founder / Developer ",
      description:
        "Focused on building Road To GM as a platform where players can learn chess through structured modules and personalized practice.",
        links: [
          { label: "GitHub", href: "#" },
          { label: "LinkedIn", href: "#" },
        ],
    },

  ];

  return (
    <div
      style={{
        background: colors.background,
        minHeight: "100vh",
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

          <UpperBarButton variant="filled" onClick={() => console.log("signup")}>
            Sign Up
          </UpperBarButton>

          <DropdownBar
            title="Menu"
            links={[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Community", href: "/community" },
              { label: "Test", href: "/clubs" },
              { label: "Explore", href: "/modules" },
            ]}
            triggerStyle={{ background: colors.buttonPrimary }}
            itemProps={{ target: "_self" }}
          />
        </UpperBarRight>
      </UpperBar>

      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "70px 40px 30px 40px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: colors.white,
            fontSize: "54px",
          }}
        >
          About Road To GM
        </h1>

        <p
          style={{
            margin: "20px auto 0 auto",
            maxWidth: "850px",
            color: colors.text,
            fontSize: "20px",
            lineHeight: 1.7,
          }}
        >
          Road To GM is a chess learning platform designed to help players improve
          through structured modules in tactics, strategy, openings, and endings.
          Our goal is to make chess training more organized, interactive, and
          personal.
        </p>
      </section>

      <MeetOurTeam members={teamMembers} />
    </div>
  );
}