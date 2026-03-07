"use client";

import { EmojiParticlesProvider } from "@/components/emoji-particles";

export function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EmojiParticlesProvider>{children}</EmojiParticlesProvider>;
}
