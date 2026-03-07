"use client";
import { useEffect, useOptimistic, useRef, useState, useTransition } from "react";
import { addItem, removeItem } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWebHaptics } from "web-haptics/react";
import { foodEmojis, getRandomFoodEmoji } from "./foodEmojis";
import { isValidNormalizedItem, normalizeItemInput } from "@/lib/itemValidation";
import {
  useEmojiParticles,
  type EmojiOption,
} from "@/components/emoji-particles";

const successEmojis: EmojiOption[] = [
  { emoji: "✅", canFlip: false },
  { emoji: "✅", canFlip: false },
  { emoji: "✅", canFlip: false },
  { emoji: "🎉", canFlip: true },
  { emoji: "🎉", canFlip: true },
  { emoji: "🤝", canFlip: false },
  { emoji: "💚", canFlip: false },
  { emoji: "💚", canFlip: false },
  { emoji: "👍", canFlip: true },
  { emoji: "👍", canFlip: true },
  { emoji: "👍", canFlip: true },
];

export function Items({ items }: { items: string[] }) {
  const [inputValue, setInputValue] = useState("");
  const [placeholderEmoji, setPlaceholderEmoji] = useState(foodEmojis[0]);
  const { trigger } = useWebHaptics();
  const { create } = useEmojiParticles();
  const [, startTransition] = useTransition();
  const itemListRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPlaceholderEmoji(getRandomFoodEmoji());
    }, 900);

    return () => clearInterval(intervalId);
  }, []);

  function getBurstPosition(button: HTMLElement | null) {
    if (!button) return null;

    const rect = button.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  function createBurstFromButton(button: HTMLElement | null) {
    const burstPosition = getBurstPosition(button);
    if (!burstPosition) return;

    create(burstPosition.x, burstPosition.y, successEmojis);
  }

  function getItemButton(item: string) {
    if (!itemListRef.current) return null;

    return itemListRef.current.querySelector<HTMLElement>(
      `[data-item-value=${JSON.stringify(item)}]`,
    );
  }

  function handleSubmit() {
    const value = normalizeItemInput(inputValue);
    if (!isValidNormalizedItem(value)) return;

    trigger("success");

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setInputValue("");
    startTransition(() => {
      updateOptimisticItems({ payload: value, type: "add" });
      addItem(value);
    });

    requestAnimationFrame(() => {
      createBurstFromButton(getItemButton(value));
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
          placeholder={placeholderEmoji}
          className="w-full text-center placeholder:text-xl focus:placeholder:text-transparent"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button
          type="submit"
          size="xl"
          className="w-full"
        >
          Add to cart
        </Button>
      </form>
      <div ref={itemListRef} className="flex gap-5 flex-wrap">
        {optimisticItems.map((item) => (
          <Button
            key={item}
            className="grow"
            variant="neutral"
            size="xl"
            data-item-value={item}
            onClick={(e) => {
              trigger("success");
              createBurstFromButton(e.currentTarget);
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
