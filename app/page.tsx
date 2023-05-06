import { revalidatePath } from "next/cache";
import Image from "next/image";

let items = ["oranges", "minced meat", "milk", "kiwis"];

export default function Home() {
  async function addItem(data: FormData) {
    "use server";

    const item = data.get("item") as string;
    items.push(item);

    revalidatePath("/");
  }

  return (
    <form action={addItem}>
      <Image
        src="/aac829889e740dbeece2cf04649f2a46-fotor-bg-remover-20230506134539.png"
        alt=""
        width="64"
        height="64"
      />
      <input name="item" type="text" placeholder="bread" />
      <button type="submit">Add to cart</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </form>
  );
}
