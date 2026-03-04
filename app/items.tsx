"use client";
import { useOptimistic, useState, useTransition } from "react";
import { addItem, removeItem } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const foodEmojis = [
  "🍎",
  "🍏",
  "🍊",
  "🍋",
  "🍌",
  "🍉",
  "🍇",
  "🍓",
  "🫐",
  "🍈",
  "🍒",
  "🍑",
  "🥭",
  "🍍",
  "🥥",
  "🥝",
  "🍅",
  "🫒",
  "🥑",
  "🍆",
  "🥔",
  "🥕",
  "🌽",
  "🌶️",
  "🫑",
  "🥒",
  "🥬",
  "🧄",
  "🧅",
  "🥦",
  "🥗",
  "🍞",
  "🥐",
  "🥖",
  "🥨",
  "🧀",
  "🥯",
  "🥞",
  "🧇",
  "🍩",
  "🍪",
  "🎂",
  "🍰",
  "🧁",
  "🍖",
  "🍗",
  "🥩",
  "🥓",
  "🍔",
  "🍟",
  "🍕",
  "🌭",
  "🥪",
  "🌮",
  "🌯",
  "🥙",
  "🧆",
  "🥚",
  "🍳",
  "🥘",
  "🍲",
  "🫕",
  "🍝",
  "🍜",
  "🍛",
  "🍚",
  "🍘",
  "🍙",
  "🍢",
  "🥫",
  "🧂",
  "🧈",
  "🍿",
  "🥟",
  "🥠",
  "🥡",
  "🍦",
  "🍧",
  "🍨",
  "🍫",
  "🍬",
  "🍭",
];

export function Items({ items }: { items: string[] }) {
  const [inputValue, setInputValue] = useState("");
  const [, startTransition] = useTransition();
  const [optimisticItems, updateOptimisticItems] = useOptimistic(
    items,
    (previous, action: { payload: string; type: "add" | "delete" }) => {
      switch (action.type) {
        case "add":
          if (previous.includes(action.payload)) {
            return previous;
          }
          return [...previous, action.payload].toSorted((a, b) =>
            a.localeCompare(b),
          );
        case "delete":
          return previous.filter((item) => item !== action.payload);
      }
    },
  );

  function handleSubmit() {
    const value = inputValue.trim();
    if (!value) return;

    setInputValue("");
    startTransition(() => {
      updateOptimisticItems({ payload: value, type: "add" });
      addItem(value);
    });
  }

  return (
    <>
      <form
        className="w-full flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Input
          type="text"
          placeholder={
            foodEmojis[Math.floor(Math.random() * foodEmojis.length)]
          }
          className="w-full text-center placeholder:text-xl focus:placeholder:text-transparent"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button type="submit" size="xl" className="w-full">
          Add to cart
        </Button>
      </form>
      <div className="flex gap-5 flex-wrap">
        {optimisticItems.map((item) => (
          <Button
            key={item}
            className="grow"
            variant="neutral"
            size="xl"
            onClick={() => {
              startTransition(() => {
                updateOptimisticItems({ payload: item, type: "delete" });
                removeItem(item);
              });
            }}
          >
            {item}
          </Button>
        ))}
      </div>
    </>
  );
}
