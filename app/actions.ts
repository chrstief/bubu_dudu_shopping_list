"use server";
import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";

export async function addItem(formData: FormData) {
  const item = formData.get("item");
  if (item) {
    await kv.sadd("shoppingList", item);
    revalidatePath("/");
  }
}

export async function removeItem(formData: FormData) {
  const item = formData.get("item");
  if (item) {
    await kv.srem("shoppingList", item);
    revalidatePath("/");
  }
}
