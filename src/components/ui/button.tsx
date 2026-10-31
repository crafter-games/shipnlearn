import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "accent" | "grape";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-lime text-ink",
  secondary: "bg-foam text-ink",
  danger: "bg-coral text-ink",
  accent: "bg-sand text-ink",
  grape: "bg-grape text-foam",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-base rounded-xl",
  md: "h-12 px-6 text-lg rounded-2xl",
  lg: "h-16 px-8 text-2xl rounded-chunk",
};

/** Chunky game button: ink border + solid shadow; lifts on hover, sinks and squashes when pressed. */
export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex select-none items-center justify-center gap-2 border-[3px] border-ink font-display tracking-wide shadow-chunky transition-[translate,scale,box-shadow] duration-100 [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-[0_7px_0_0_var(--color-ink)] active:translate-y-1 active:scale-[0.97] active:shadow-pressed active:duration-75 disabled:translate-y-0 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-chunky ${variants[variant]} ${sizes[size]} ${className}`}
    />
  );
}
