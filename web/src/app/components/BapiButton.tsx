import React from "react";
import clsx from "clsx";

interface BapiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "blue" | "yellow";
  as?: "button" | "a";
  href?: string;
  children: React.ReactNode;
}

// BAPI brand button: blue (white text, drop shadow) or yellow (black text, no shadow)
const BapiButton: React.FC<BapiButtonProps> = ({
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
    return (
      <a href={href} className={btnClass} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button className={btnClass} {...props}>
      {children}
    </button>
  );
};

export default BapiButton;
