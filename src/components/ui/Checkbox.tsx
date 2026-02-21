import styles from "./Checkbox.module.css";
import { type InputHTMLAttributes, forwardRef } from "react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: React.ReactNode;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <label className={`${styles.label} ${className}`}>
        <input ref={ref} type="checkbox" className={styles.input} {...props} />
        <span className={styles.checkmark}></span>
        {label}
      </label>
    );
  },
);

export default Checkbox;
