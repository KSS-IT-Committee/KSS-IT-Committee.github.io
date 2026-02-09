import Image from 'next/image';
import Link from 'next/link';
import style from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={style.container}>
      <h1>404 Not Found</h1>
      <p className={style.text}>ページが見つかりませんでした。</p>
      <Image src="/images/EyeRoll.gif" alt="Eyes of the IT is rolling" width={600} height={400}></Image>
      <Link href="/" className={style.link}>Go back home</Link>
    </div>
  )
}