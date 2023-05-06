"use client";
import { removeItem } from "./actions";
import { useTransition } from "react";

export function ListItem({ item }: { item: string }) {
  let [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={(e) => {
        startTransition(() => removeItem(item));
      }}
      className="bg-stone-100 hover:bg-amber-100 rounded-lg p-4 text-center grow shadow-md"
    >
      {item}
    </button>
  );
}
