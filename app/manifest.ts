import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    theme_color: "rgb(229 231 235)",
    background_color: "rgb(229 231 235)",
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

