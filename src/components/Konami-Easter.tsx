"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "@/styles/Konami-Easter.module.css";

interface KonamiEasterProps {
  imageSrc: string;
  imageAlt?: string;
  width?: number;
  height?: number;
}

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

export default function KonamiEaster({
  imageSrc,
  imageAlt = "Easter egg image",
  width = 100,
  height = 100,
}: KonamiEasterProps) {
  const [isActive, setIsActive] = useState(false);
  const keySequenceRef = useRef<string[]>([]);
  const isActiveRef = useRef(false);

  // Keep ref in sync with state
  isActiveRef.current = isActive;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const newSequence = [...keySequenceRef.current, event.code];

      // Keep only the last 10 keys
      keySequenceRef.current = newSequence.slice(-KONAMI_CODE.length);

      // Check if the sequence matches the Konami Code
      if (
        !isActiveRef.current &&
        keySequenceRef.current.length === KONAMI_CODE.length &&
        keySequenceRef.current.every((key, index) => key === KONAMI_CODE[index])
      ) {
        setIsActive(true);
        setTimeout(() => setIsActive(false), 5000);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isActive) return null;
  else return (
    <div className={styles.container}>
      <div className={styles.animatedImage}>
        <Image
          src={imageSrc}
          width={width}
          height={height}
          alt={imageAlt}
          className={styles.image}
        />
      </div>
    </div>
  );
}
