import Image from "next/image";
import { ListItem } from "./listItem";
import heroImage from "./assets/aac829889e740dbeece2cf04649f2a46-fotor-bg-remover-20230506134539.png";
import db from "./items";
import Input from "./Input";



export default function Home() {
  let items = db.getItems();

  return (
    <div className="flex flex-col gap-4 items-center max-w-sm mx-auto mt-14">
      <Image src={heroImage} alt="" width="300" height="300" />
      <Input />
      <div className="flex gap-4 flex-wrap">
        {items.map((item, index) => (
          <ListItem item={item} key={index} />
        ))}
      </div>
    </div>
  );
}
