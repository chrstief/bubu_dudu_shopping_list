"use server";
import { redis } from "@/lib/redis";
import { isValidNormalizedItem, normalizeItemInput } from "@/lib/itemValidation";
import { revalidatePath } from "next/cache";

export async function addItem(item: string) {
  const normalizedItem = normalizeItemInput(item);
  if (!isValidNormalizedItem(normalizedItem)) return;

  await redis.sadd("shoppingList", normalizedItem);
  revalidatePath("/");
}

export async function removeItem(item: string) {
  const normalizedItem = normalizeItemInput(item);
  if (!isValidNormalizedItem(normalizedItem)) return;

  await redis.srem("shoppingList", normalizedItem);
  revalidatePath("/");
}

export async function refetchItems() {
  revalidatePath("/");
}
