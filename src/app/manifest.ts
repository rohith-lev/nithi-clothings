import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nithi Clothings | Pure Cotton Nighties & Ethnic Wear",
    short_name: "Nithi Clothings",
    description:
      "Explore pure cotton nighties, feeding nighties, bridal nighty sets, and everyday ethnic wear handcrafted with breathable fabrics.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F1",
    theme_color: "#064E3B",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
