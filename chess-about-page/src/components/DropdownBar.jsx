import React, { useEffect, useRef, useState } from "react";

export default function DropdownBar({
  title = "Menu",
  links = [],
  className = "",
  style = {},
  triggerClassName = "",
  triggerStyle = {},
  triggerProps = {},
  menuClassName = "",
  menuStyle = {},
  menuProps = {},
  itemClassName = "",
  itemStyle = {},
  itemProps = {},
  renderTrigger,
  renderItem,
  closeOnItemClick = true,
  ...props
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeMenu();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={className}
      style={{ position: "relative", display: "inline-block", ...style }}
      {...props}
    >
      {renderTrigger ? (
        renderTrigger({ open, toggleMenu, closeMenu })
      ) : (
        <button
          type="button"
          className={triggerClassName}
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            background: "white",
            cursor: "pointer",
            fontWeight: 600,
            ...triggerStyle,
          }}
          onClick={(event) => {
            triggerProps.onClick?.(event);
            toggleMenu();
          }}
          {...triggerProps}
        >
          {title} ▼
        </button>
      )}

      {open && (
        <div
          className={menuClassName}
          style={{
            position: "absolute",
            top: "110%",
            right: 0,
            minWidth: "180px",
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            overflow: "hidden",
            zIndex: 1000,
            ...menuStyle,
          }}
          {...menuProps}
        >
          {links.map((link, index) => {
            const handleItemClick = (event) => {
              link.onClick?.(event, link);
              itemProps.onClick?.(event);
              if (closeOnItemClick) closeMenu();
            };

            if (renderItem) {
              return renderItem({
                link,
                index,
                open,
                closeMenu,
                handleItemClick,
              });
            }

            return (
              <a
                key={link.id || link.href || index}
                href={link.href || "#"}
                className={itemClassName}
                style={{
                  display: "block",
                  padding: "12px 14px",
                  textDecoration: "none",
                  color: "#111827",
                  borderBottom:
                    index !== links.length - 1 ? "1px solid #f3f4f6" : "none",
                  ...itemStyle,
                }}
                onClick={handleItemClick}
                {...itemProps}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}