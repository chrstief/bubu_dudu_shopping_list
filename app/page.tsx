import Image from "next/image";
import { addItem } from "./actions";
import { ListItem } from "./listItem";
import heroImage from "./assets/aac829889e740dbeece2cf04649f2a46-fotor-bg-remover-20230506134539.png";

let items = ["Oranges", "Minced Meat", "Milk", "Kiwis"];

export default function Home() {
  return (
    <form
      action={addItem}
      className="flex flex-col gap-4 items-center max-w-sm mx-auto mt-14"
    >
      <Image src={heroImage} alt="" width="300" height="300" />
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
      <div className="flex gap-4 flex-wrap">
        {items.map((item, index) => (
          <ListItem item={item} key={index} />
        ))}
      </div>
    </form>
  );
}
