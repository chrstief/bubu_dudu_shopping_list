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
      <Input
        type="text"
        placeholder={foodEmojis[Math.floor(Math.random() * foodEmojis.length)]}
        className="w-full text-center placeholder:text-xl placeholder:text-black"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
      />
      <Button size="xl" className="w-full" onClick={handleSubmit}>
        Add to cart
      </Button>
      <div className="flex gap-5 flex-wrap">
        {optimisticItems.map((item, index) => (
          <Button
            key={index}
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
