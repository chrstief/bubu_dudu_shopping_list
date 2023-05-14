"use server";
import db from "./items";
import { revalidatePath } from "next/cache";

export async function addItem(item: string) {
  if (item) {
    db.addItem(item);
    revalidatePath("/");
  }
}

export async function removeItem(item: string) {
  db.removeItem(item);
  revalidatePath("/");
}
