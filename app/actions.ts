"use server";
import { redis } from "@/lib/redis";
import { revalidatePath } from "next/cache";

export async function addItem(item: string) {
  if (item) {
    await redis.sadd("shoppingList", item);
    revalidatePath("/");
  }
}

export async function removeItem(item: string) {
  await redis.srem("shoppingList", item);
  revalidatePath("/");
}

export async function refetchItems() {
  revalidatePath("/");
}
