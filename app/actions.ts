"use server"
import { revalidatePath } from "next/cache";

let items = ["Oranges", "Minced Meat", "Milk", "Kiwis"];

export async function addItem(data: FormData) {

  const item = data.get("item") as string;
  items.push(item);

//   revalidatePath("/");
    console.log(items)
}

export async function removeItem(itemToDelete: string) {
    
  items = items.filter((item) => item !== itemToDelete);

//   revalidatePath("/");
    console.log(items);
}
