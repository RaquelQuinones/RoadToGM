import React from "react";
import { colors } from "../palette/color.js";
import Button from "./Button.jsx";

export default function SideImageCard({
  image,
  imageAlt = "Card image",
  title,
  text,
  buttonText = "Learn More",
  reverse = false,
  children,

  className = "",
  style = {},
  imageSectionClassName = "",
  imageSectionStyle = {},
  imageSectionProps = {},
  imageClassName = "",
  imageStyle = {},
  imageProps = {},
  contentClassName = "",
  contentStyle = {},
  contentProps = {},
  titleClassName = "",
  titleStyle = {},
  titleProps = {},
  textClassName = "",
  textStyle = {},
  textProps = {},
  buttonClassName = "",
  buttonStyle = {},
  buttonProps = {},
  renderContent,
  renderButton,
  ...props
}) {
  return (
    <section
      className={className}
      style={{
        display: "flex",
        flexDirection: reverse ? "row-reverse" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "80px",
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "40px 60px",
        boxSizing: "border-box",
        ...style,
      }}
      {...props}
    >
      <div
        className={imageSectionClassName}
        style={{
          flex: "1.3",
          minHeight: "520px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...imageSectionStyle,
        }}
        {...imageSectionProps}
      >
        <img
          src={image}
          alt={imageAlt}
          className={imageClassName}
          style={{
            width: "100%",
            maxWidth: "650px",
            height: "auto",
            objectFit: "contain",
            display: "block",
            ...imageStyle,
          }}
          {...imageProps}
        />
      </div>

      <div
        className={contentClassName}
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "22px",
          ...contentStyle,
        }}
        {...contentProps}
      >
        {children ? (
          children
        ) : renderContent ? (
          renderContent({
            title,
            text,
            buttonText,
            buttonProps,
          })
        ) : (
          <>
            <h2
              className={titleClassName}
              style={{
                margin: 0,
                fontSize: "64px",
                lineHeight: 1,
                fontWeight: 800,
                color: colors.text,
                ...titleStyle,
              }}
              {...titleProps}
            >
              {title}
            </h2>

            <p
              className={textClassName}
              style={{
                margin: 0,
                fontSize: "28px",
                lineHeight: 1.4,
                color: colors.text,
                ...textStyle,
              }}
              {...textProps}
            >
              {text}
            </p>

            {renderButton ? (
              renderButton({ buttonText, buttonProps })
            ) : (
              <Button
                variant="primary"
                className={buttonClassName}
                style={{
                  alignSelf: "flex-start",
                  ...buttonStyle
                }}
                {...buttonProps}
              >
                {buttonText}
              </Button>
            )}
          </>
        )}
      </div>
    </section>
  );
}