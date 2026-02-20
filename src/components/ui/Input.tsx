import styles from "./Input.module.css";
import type { InputHTMLAttributes } from "react";

type InputVariant =
  | "short-default"
  | "short-mini"
  | "long-default"
  | "long-mini"
  | "none"; // used for checkboxes

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant: InputVariant;
}

function Input({ variant, className = "", ...props }: InputProps) {
  return (
    <input
      className={`${styles.button} ${styles[variant]} ${className}`}
      {...props}
    />
  );
}

export default Input;
