import db from "./items";
import { revalidatePath } from "next/cache";

export function ListItem({ item }: { item: string }) {

  async function removeItem() {
    "use server"
    db.removeItem(item)
    console.log(db.getItems());
    revalidatePath("/");
  }

  return (
    <button
      formAction={removeItem}
      className="bg-stone-100 hover:bg-amber-100 rounded-lg p-4 text-center grow shadow-md"
    >
      {item}
    </button>
  );
}
