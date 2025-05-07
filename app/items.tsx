"use client";
import { useOptimistic, useState, useTransition } from "react";
import { addItem, removeItem } from "./actions";

export function Items({ items }: { items: string[] }) {
  const [inputValue, setInputValue] = useState("");
  const [, startTransition] = useTransition();
  const [optimisticItems, updateOptimisticItems] = useOptimistic(
    items,
    (previous, action: { payload: string; type: "add" | "delete" }) => {
      switch (action.type) {
        case "add":
          return [...previous, action.payload].toSorted((a, b) =>
            a.localeCompare(b),
          );
        case "delete":
          return previous.filter((item) => item !== action.payload);
      }
    },
  );

  function handleSubmit() {
    if (inputValue) {
      startTransition(() => {
        updateOptimisticItems({ payload: inputValue, type: "add" });
        setInputValue("");
        addItem(inputValue);
      });
    }
  }

  return (
    <>
      <input
        type="text"
        placeholder="Bread"
        className="bg-gray-300 text-gray-700 rounded-lg p-4 w-full text-center"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
      />
      <button
        className="bg-rose-800 text-gray-100 rounded-lg p-4 w-full"
        onClick={handleSubmit}
      >
        Add to cart
      </button>
      <div className="flex gap-4 flex-wrap">
        {optimisticItems.map((item, index) => (
          <button
            key={index}
            className="bg-stone-100 hover:bg-amber-100 rounded-lg p-4 text-center grow shadow-md"
            onClick={() => {
              startTransition(() => {
                updateOptimisticItems({ payload: item, type: "delete" });
                removeItem(item);
              });
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </>
  );
}
