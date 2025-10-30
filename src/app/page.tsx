import Image from "next/image";
import MaintainerCard from "@/components/MaintainerCard";

const maintainers = [
  { username: "0517MITSU", name: "0517MITSU" },
  { username: "Aki603", name: "Aki603" },
  { username: "Apple-1124", name: "Apple-1124" },
  { username: "hatuna-827", name: "hatuna-827" },
  { username: "K10-K10", name: "K10-K10" },
  { username: "katsumata68", name: "katsumata68" },
  { username: "kinoto0103", name: "kinoto0103" },
  { username: "kotaro-0131", name: "kotaro-0131" },
  { username: "mochi-k18", name: "mochi-k18" },
  { username: "rotarymars", name: "rotarymars" },
  { username: "SakaYq4875", name: "SakaYq4875" },
  { username: "Shirym-min", name: "Shirym-min" },
  { username: "utsukushiioto0816-tech", name: "utsukushiioto0816-tech" },
];

export default function Home() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-12">
      <h1 className="text-center text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-4xl">
        都立小石川中等教育学校 IT委員会
      </h1>

      <div className="mx-auto flex flex-col items-center gap-6">
        <div className="relative h-52 w-52">
          <Image
            src="/images/IT-logo.png"
            alt="IT委員会のロゴ"
            fill
            sizes="208px"
            className="object-contain"
          />
        </div>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Maintainers
        </h2>
        <div className="grid gap-6 grid-cols-2 md:grid-cols-8">
          {maintainers.map((maintainer) => (
            <MaintainerCard
              key={maintainer.username}
              username={maintainer.username}
              name={maintainer.name}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
