"use client";
import React, { ReactElement, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "@/components/CodeBlock.module.css";

interface CodeBlockProps {
  children: ReactElement<{ children: string; className?: string }> | ReactElement<{ children: string; className?: string }>[];
  language?: string; // Optional language prop
}

export default function CodeBlock({ children, language: propLanguage }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract code text and language from children
  let code = "";
  let language = propLanguage || "text"; // Use prop language as default
  const codeLines: string[] = [];

  // If no language prop provided, try to find it from children
  if (!propLanguage) {
    React.Children.forEach(children, (child) => {
      if (React.isValidElement<{ children: string; className?: string }>(child)) {
        if (child.type === 'code' && child.props.className) {
          const match = child.props.className.match(/language-(\w+)/);
          if (match && language === "text") {
            language = match[1];
          }
        }
      }
    });
  }

  // Extract code content from all code elements
  React.Children.forEach(children, (child) => {
    if (React.isValidElement<{ children: string; className?: string }>(child)) {
      // Skip <br /> elements and only process elements with children
      if (child.type === 'code' && child.props.children) {
        codeLines.push(child.props.children);
      }
    }
  });

  code = codeLines.join('\n');

  function copy() {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch((err) => console.error("コピーに失敗しました:", err));
  }

  return (
    <div className={styles.codeblock}>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: "8px",
          fontSize: "14px",
        }}
        PreTag="div"
      >
        {code}
      </SyntaxHighlighter>
      <button type="button" onClick={copy}>
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
    </div>
  );
}
