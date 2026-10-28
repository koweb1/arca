import { projects } from "@/lib/projects";

export const siteConfig = {
  name: "ARCA Studio",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "ARCA is an architecture and interior design studio in Lagos. We design residential, commercial and hospitality spaces, from first concept to final drawings and 3D visualization.",
  keywords: [
    "architecture studio Lagos",
    "interior design Nigeria",
    "residential architecture",
    "3D visualization",
    "renovation",
  ] as string[],
  email: "studio@arca-studio.example",
  phone: "+234 000 000 0000",
  geo: { lat: 6.5244, lng: 3.3792 },
};

const studioId = `${siteConfig.url}/#studio`;

/** Site-wide structured data. Add telephone and email here once the real contact details exist. */
export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: "en",
      publisher: { "@id": studioId },
    },
    {
      "@type": "ProfessionalService",
      "@id": studioId,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      image: `${siteConfig.url}/opengraph-image`,
      areaServed: "Nigeria",
      knowsAbout: ["Architecture", "Interior design", "3D visualization", "Renovation"],
      address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
      geo: {
        "@type": "GeoCoordinates",
        latitude: siteConfig.geo.lat,
        longitude: siteConfig.geo.lng,
      },
    },
  ],
};

export const projectsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Selected projects",
  itemListElement: projects.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "CreativeWork",
      name: p.name,
      description: p.description,
      genre: p.category,
      dateCreated: p.year,
      locationCreated: { "@type": "Place", name: p.location },
    },
  })),
};