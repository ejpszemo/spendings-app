import styles from "./Button.module.css";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "square-default" | "square-mini" | "long-mini";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant;
}

function Button({ variant, children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
