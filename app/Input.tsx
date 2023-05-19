"use client";
import { useState, useTransition, useEffect } from "react";
import { addItem, refetchItems } from "./actions";

export default function Input() {
  const [inputValue, setInputValue] = useState("");
  let [pending, startTransition] = useTransition();

  useEffect(() => {
    const intervalId = setInterval(refetchItems, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  function submit() {
    if (inputValue) {
      startTransition(() => {
        addItem(inputValue);
        setInputValue("");
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
            submit();
          }
        }}
      />
      <button
        disabled={pending}
        className="bg-rose-800 disabled:animate-pulse text-gray-100 rounded-lg p-4 w-full"
        onClick={submit}
      >
        Add to cart
      </button>
    </>
  );
}
