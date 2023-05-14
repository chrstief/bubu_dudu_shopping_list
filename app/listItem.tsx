"use client";
import { useTransition } from "react";
import { removeItem } from "./actions";

export function ListItem({ item }: { item: string }) {
  let [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      className="bg-stone-100 disabled:animate-pulse hover:bg-amber-100 rounded-lg p-4 text-center grow shadow-md"
      onClick={() => {
        startTransition(() => {
          removeItem(item);
        });
      }}
    >
      {item}
    </button>
  );
}
