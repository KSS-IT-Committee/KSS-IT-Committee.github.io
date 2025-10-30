import Image from "next/image";

interface MaintainerCardProps {
  username: string;
  name: string;
}

export default function MaintainerCard({ username, name }: MaintainerCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <a
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-3 text-inherit no-underline"
      >
        <div className="relative h-20 w-20">
          <Image
            src={`https://github.com/${username}.png`}
            alt={`${name}'s profile`}
            fill
            sizes="80px"
            className="rounded-full border border-neutral-200 object-cover shadow-sm transition-shadow dark:border-neutral-700"
          />
        </div>
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {name}
        </p>
      </a>
    </div>
  );
}