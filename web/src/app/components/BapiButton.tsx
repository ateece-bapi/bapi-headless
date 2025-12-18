import React from "react";
import clsx from "clsx";

interface BapiButtonProps {
  color?: "blue" | "yellow";
  as?: "button" | "a";
  href?: string;
  children: React.ReactNode;
  className?: string;
}

type ButtonProps = BapiButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorProps = BapiButtonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

// BAPI brand button: blue (white text, drop shadow) or yellow (black text, no shadow)
const BapiButton: React.FC<ButtonProps | AnchorProps> = ({
  color = "blue",
  as = "button",
  href,
  children,
  className = "",
  ...props
}) => {
  const base =
    "rounded-lg px-8 py-3 font-bold text-2xl tracking-tight transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const blue =
    "bg-[#0054b6] text-white shadow-[0_4px_0_#1479bc] hover:bg-[#1479bc] hover:shadow-[0_2px_0_#044976]";
  const yellow =
    "bg-gradient-to-r from-[#f89623] to-[#ffc843] text-black hover:from-[#ffc843] hover:to-[#f89623]";

  const btnClass = clsx(
    base,
    color === "blue" ? blue : yellow,
    color === "blue" ? "drop-shadow-md" : "",
    className
  );

  if (as === "a" && href) {
    // Extract only anchor-specific props
    const { as: _, ...anchorProps } = props as AnchorProps;
    return (
      <a href={href} className={btnClass} {...anchorProps}>
        {children}
      </a>
    );
  }
  
  // Extract only button-specific props
  const { as: _, href: __, ...buttonProps } = props as ButtonProps;
  return (
    <button className={btnClass} {...buttonProps}>
      {children}
    </button>
  );
};

export default BapiButton;