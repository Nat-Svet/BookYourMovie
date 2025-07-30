import React from "react";
import "../styles/Button.css";

export default function Button({ children, size = "medium", className = "", ...props }) {
  
  return (
    <button
      className={`custom-button custom-button--${size} ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
