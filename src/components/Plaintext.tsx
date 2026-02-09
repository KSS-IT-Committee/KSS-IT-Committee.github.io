import React from "react";
import styles from "@/styles/Plaintext.module.css";

interface Plaintext {
  children: string;
}

export function Plaintext({ children }: Plaintext) {
  const parts = children.split(/(?<! )(?= {2,})| (?! )/);
  return (
    <>
      {parts.map((part, i) => (
        <span
          className={/ +/.test(part) ? styles.space : styles.plaintext}
          key={`${i}-${part}`}
        >
          {part}
        </span>
      ))}
    </>
  );
}
