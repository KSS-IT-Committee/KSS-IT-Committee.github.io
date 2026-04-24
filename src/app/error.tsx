"use client";

import style from "./error.module.css";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  return (
    <div className={style.container}>
      <div className={style.card}>
        <h1 className={style.title}>エラーが発生しました</h1>
        <p className={style.description}>
          予期せぬエラーが発生しました。しばらくしてからもう一度お試しください。
        </p>
        <button type="button" className={style.button} onClick={reset}>
          再読み込み
        </button>
      </div>
    </div>
  );
}
