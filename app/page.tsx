import Image from "next/image";
import { ListItem } from "./listItem";
import heroImage from "./assets/aac829889e740dbeece2cf04649f2a46-fotor-bg-remover-20230506134539.png";
import { kv } from "@vercel/kv";
import Input from "./Input";



export default async function Home() {
  const items = await kv.smembers("shoppingList");

  return (
    <div className="flex flex-col gap-4 items-center max-w-sm mx-auto my-14 px-4">
      <Image src={heroImage} alt="" width="300" height="300" />
      <Input />
      <div className="flex gap-4 flex-wrap">
        {items.sort().map((item, index) => (
          <ListItem item={item} key={index} />
        ))}
      </div>
    </div>
  );
}
