import Image from "next/image";
import heroImage from "./assets/aac829889e740dbeece2cf04649f2a46-fotor-bg-remover-20230506134539.png";
import { kv } from "@vercel/kv";
import { Items } from "./items";
import { Polling } from "./Polling";

export default async function Home() {
  const items = (await kv.smembers("shoppingList"))
    .map(String)
    .toSorted((a, b) => a.localeCompare(b));
  return (
    <div className="flex flex-col gap-4 items-center max-w-sm mx-auto my-14 px-4">
      <Image src={heroImage} alt="" width="300" height="300" />
      <Items items={items} />
      <Polling />
    </div>
  );
}
