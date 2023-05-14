"use client";
import { useState, useTransition } from "react";
import { addItem } from "./actions";

export default function Input() {
  const [inputValue, setInputValue] = useState("");
  let [pending, startTransition] = useTransition();

  return (
    <>
      <input
        type="text"
        placeholder="Bread"
        className="bg-gray-300 text-gray-700 rounded-lg p-4 w-full text-center"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        disabled={pending}
        className="bg-rose-800 disabled:animate-pulse text-gray-100 rounded-lg p-4 w-full"
        onClick={() => {
          if (inputValue) {
            startTransition(() => {
              addItem(inputValue);
              setInputValue("");
            });
          }
        }}
      >
        Add to cart
      </button>
    </>
  );
}
