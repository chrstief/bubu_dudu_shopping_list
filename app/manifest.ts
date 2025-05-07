import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    theme_color: "oklch(93.37% 0.0339 12.05)",
    background_color: "oklch(93.37% 0.0339 12.05)",
    display: "standalone",
    start_url: "/",
    name: "Bubu Dudu Shopping List",
    short_name: "Bubu Dudu Shopping List",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
