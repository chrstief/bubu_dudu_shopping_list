"use server";
import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";

export async function addItem(item: string) {
  if (item) {
    await kv.sadd("shoppingList", item);
    revalidatePath("/");
  }
}

export async function removeItem(item: string) {
  await kv.srem("shoppingList", item);
  revalidatePath("/");
}

export async function refetchItems() {
  revalidatePath("/");
}
