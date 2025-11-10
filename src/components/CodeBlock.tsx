"use client";
import React, { ReactNode, ReactElement, useState } from "react";
import styles from "@/components/CodeBlock.module.css";

interface CodeBlockProps {
  children: ReactNode;
}

export default function CodeBlock({ children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  function copy() {
    let code = "";

    if (Array.isArray(children)) {
      // children is an array of <code> elements
      children.forEach((line) => {
        // Make sure it's a valid React element before accessing props
        if (React.isValidElement(line)) {
          const text = line.props.children;
          // children might be string or array — convert to string
          if (typeof text === "string") code += text + "\n";
          else if (Array.isArray(text))
            code += text.join("") + "\n";
        }
      });
    } else if (React.isValidElement(children)) {
      // Single child case
      const text = children.props.children;
      if (typeof text === "string") code = text;
      else if (Array.isArray(text)) code = text.join("");
    }

    navigator.clipboard.writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(err => console.error("コピーに失敗しました:", err));
  }

  return (
    <pre className={styles.codeblock}>
      {children}
      <button onClick={copy}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          fill="none"
          stroke="currentColor"
        >
          <path d="M8,8v-2a3,3 0 0 1 3-3h7a3,3 0 0 1 3,3v7a3,3 0 0 1-3,3h-2v2a3,3 0 0 1-3,3h-7a3,3 0 0 1-3-3v-7a3,3 0 0 1 3-3h7a3,3 0 0 1 3,3v5" />
        </svg>
        <span>{copied ? "Copied!" : "Copy"}</span>
      </button>
    </pre>
  );
}
