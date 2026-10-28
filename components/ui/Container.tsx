import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

/** Full-width wrapper whose side padding is the shared --edge, so content never exceeds the max width. */
export default function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("w-full px-[var(--edge)]", className)}>{children}</div>;
}