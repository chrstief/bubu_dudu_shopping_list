import { removeItem } from "./actions";

export function ListItem({ item }: { item: string }) {
  return (
    <form action={removeItem} className="grow">
      <input name="item" hidden defaultValue={item} />
      <button
        className="bg-stone-100 disabled:animate-pulse hover:bg-amber-100 rounded-lg p-4 text-center w-full shadow-md"
        type="submit"
      >
        {item}
      </button>
    </form>
  );
}
