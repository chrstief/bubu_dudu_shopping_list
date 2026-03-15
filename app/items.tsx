"use client";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import { addItem, removeItem } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { defaultPatterns } from "web-haptics";
import { useWebHaptics } from "web-haptics/react";
import { foodEmojis, getRandomFoodEmoji } from "./foodEmojis";
import { isValidNormalizedItem, normalizeItemInput } from "@/lib/itemValidation";
import { useEmojiParticles } from "@/components/emoji-particles/emoji-particles";

export function Items({ items }: { items: string[] }) {
  const [inputValue, setInputValue] = useState("");
  const [placeholderEmoji, setPlaceholderEmoji] = useState(foodEmojis[0]);
  const { trigger } = useWebHaptics();
  const { confetti } = useEmojiParticles();
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPlaceholderEmoji(getRandomFoodEmoji());
    }, 900);

    return () => clearInterval(intervalId);
  }, []);

  function handleSubmit() {
    confetti(foodEmojis)
    trigger(defaultPatterns.success);
    const value = normalizeItemInput(inputValue);
    if (!isValidNormalizedItem(value)) return;

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

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
          placeholder={placeholderEmoji}
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
              const isLastItem = optimisticItems.length === 1;

              trigger(isLastItem ? defaultPatterns.buzz : defaultPatterns.success);
              confetti(["✅", "🎉", "🤝", "💚", "👍"]);
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
