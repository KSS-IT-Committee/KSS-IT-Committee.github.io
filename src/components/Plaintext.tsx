import React from 'react';
import style from "@/styles/Plaintext.module.css";

interface Plaintext {
  children: string;
}

export default function Plaintext({ children }: Plaintext) {
  const parts = children.split(/(?<! )(?= {2,})| (?! )/)
  return (
    <>
      {parts.map((part, i) => (
        <span className={/ +/.test(part) ? style.space : style.plaintext} key={i}>{part}</span>
      ))}
    </>
  )
}
