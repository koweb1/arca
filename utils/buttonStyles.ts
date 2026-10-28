type Variant = "primary" | "ghost";
type Size = "md" | "sm";

const base =
  "inline-flex cursor-pointer items-center justify-center gap-[.8em] rounded-none border text-[.76rem] font-bold uppercase tracking-[.14em] no-underline transition-colors";

const variants: Record<Variant, string> = {
  primary: "border-blue bg-blue text-[#06161c] hover:bg-[#b4e9f6]",
  ghost: "border-line-2 bg-transparent text-fg hover:border-blue hover:text-blue",
};

const sizes: Record<Size, string> = {
  md: "px-[1.5em] py-[.95em]",
  sm: "px-[1.1em] py-[.7em]",
};

export function buttonClass(variant: Variant = "ghost", size: Size = "md", extra = "") {
  return [base, variants[variant], sizes[size], extra].filter(Boolean).join(" ");
}