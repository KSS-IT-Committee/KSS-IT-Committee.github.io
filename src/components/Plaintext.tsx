import React from 'react';
import style from "@/styles/Plaintext.module.css";

interface PlaintextProps {
  children: string;
}

export default function Plaintext({ children }: PlaintextProps) {
  const parts = children.split(/(?<! )(?= {2,})| (?! )/)
  return (
    <>
      {parts.map((part, i) => (
        <span className={/ +/.test(part) ? style.space : style.plaintext} key={`${i}-${part}`}>{part}</span>
      ))}
    </>
  )
}
