import { addItem } from "./actions";

export default function Input() {
  return (
    <form className="flex flex-col gap-4 w-full" action={addItem}>
      <input
        name="item"
        type="text"
        placeholder="Bread"
        className="bg-gray-300 text-gray-700 rounded-lg p-4 text-center"
      />
      <button
        className="bg-rose-800 disabled:animate-pulse text-gray-100 rounded-lg p-4"
        type="submit"
      >
        Add to cart
      </button>
    </form>
  );
}
