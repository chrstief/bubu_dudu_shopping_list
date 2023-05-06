import { revalidatePath } from "next/cache";
import Image from "next/image";

let items = ["Oranges", "Minced Meat", "Milk", "Kiwis"];

export default function Home() {
  async function addItem(data: FormData) {
    "use server";

    const item = data.get("item") as string;
    items.push(item);

    revalidatePath("/");
  }

  return (
    <form
      action={addItem}
      className="flex flex-col gap-4 items-center max-w-sm mx-auto mt-14"
    >
      <Image
        src="/aac829889e740dbeece2cf04649f2a46-fotor-bg-remover-20230506134539.png"
        alt=""
        width="300"
        height="300"
      />
      <input
        name="item"
        type="text"
        placeholder="Bread"
        className="bg-gray-300 text-gray-700 rounded-lg p-4 w-full text-center"
      />
      <button
        type="submit"
        className="bg-rose-800 text-gray-100 rounded-lg p-4 w-full"
      >
        Add to cart
      </button>
      <ul className="flex gap-4 flex-wrap">
        {items.map((item, index) => (
          <li
            key={index}
            className="bg-stone-100 rounded-lg p-4 text-center grow shadow-md"
          >
            {item}
          </li>
        ))}
      </ul>
    </form>
  );
}
