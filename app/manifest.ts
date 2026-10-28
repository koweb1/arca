import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} | Architecture & Interior Studio`,
    short_name: "ARCA",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0b1114",
    theme_color: "#0b1114",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}