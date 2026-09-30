import { type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cx } from "./cx";

// Win95 form controls. They pass through native props, so they work like plain <button>/<input>/<select>.

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  // The default button of a dialog gets the extra black frame
  primary?: boolean;
};

export function Button({ primary, className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        "min-w-18.75 h-5.75 px-3 bg-win-face text-win-text bevel-button active:bevel-pressed",
        "focus-visible:outline-1 focus-visible:outline-dotted focus-visible:outline-win-dark focus-visible:-outline-offset-4",
        "disabled:text-win-shadow disabled:[text-shadow:1px_1px_var(--color-win-highlight)] disabled:active:bevel-button",
        primary && "outline outline-1 outline-win-dark",
        className,
      )}
      {...props}
    />
  );
}

export function TextField({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx("h-5.25 px-1 bg-white text-win-text bevel-sunken outline-none disabled:bg-win-face disabled:text-win-shadow", className)}
      {...props}
    />
  );
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cx("p-1 bg-white text-win-text bevel-sunken outline-none resize-none", className)}
      {...props}
    />
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { options: string[] };

// Native <select> dressed as a Win95 combo box: sunken field plus a raised arrow button
export function Select({ options, className, ...props }: SelectProps) {
  return (
    <span className={cx("relative inline-flex h-5.25 bg-white bevel-sunken", className)}>
      <select className="w-full appearance-none bg-transparent pl-1 pr-5 outline-none focus-visible:bg-win-select focus-visible:text-win-select-text" {...props}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <span aria-hidden className="pointer-events-none absolute right-0.5 top-0.5 bottom-0.5 w-4 flex items-center justify-center bg-win-face bevel-button">
        <svg width="7" height="4" viewBox="0 0 7 4" shapeRendering="crispEdges"><path d="M0 0h7v1H6v1H5v1H4v1H3V3H2V2H1V1H0z"/></svg>
      </span>
    </span>
  );
}

export function Slider({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input type="range" className={cx("win-slider", className)} {...props} />;
}

type ToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { children: ReactNode };

export function Radio({ children, className, ...props }: ToggleProps) {
  return (
    <label className={cx("inline-flex items-center gap-1.5", className)}>
      <input type="radio" className="win-radio" {...props} />
      <span>{children}</span>
    </label>
  );
}

export function Checkbox({ children, className, ...props }: ToggleProps) {
  return (
    <label className={cx("inline-flex items-center gap-1.5", className)}>
      <input type="checkbox" className="win-checkbox" {...props} />
      <span>{children}</span>
    </label>
  );
}

export function GroupBox({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <fieldset className={cx("border border-win-shadow shadow-[1px_1px_0_var(--color-win-highlight),inset_1px_1px_0_var(--color-win-highlight)] px-2 pt-0.5 pb-2", className)}>
      <legend className="px-0.75">{label}</legend>
      {children}
    </fieldset>
  );
}
