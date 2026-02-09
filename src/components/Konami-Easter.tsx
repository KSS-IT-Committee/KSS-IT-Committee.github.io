/**
 * KonamiEaster Component
 *
 * An Easter egg component that displays an image when the Konami Code is entered.
 *
 * Purpose:
 * - Adds a fun, hidden feature for users who know the classic Konami Code
 * - Displays a customizable image for 5 seconds when triggered
 *
 * Konami Code Sequence:
 * ↑ ↑ ↓ ↓ ← → ← → B A
 *
 * @param {Object} props - Component props
 * @param {string} props.imageSrc - Path to the Easter egg image
 * @param {string} [props.imageAlt="Easter egg image"] - Alt text for the image
 * @param {number} [props.width=100] - Image width in pixels
 * @param {number} [props.height=100] - Image height in pixels
 *
 * Features:
 * - Listens for keyboard input and tracks key sequence
 * - Only triggers once until animation completes
 * - Auto-hides after 5 seconds
 *
 * @example
 * <KonamiEaster
 *   imageSrc="/images/secret.png"
 *   imageAlt="Secret image"
 *   width={200}
 *   height={200}
 * />
 */
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

export function KonamiEaster({
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
    const handleKeyDown = (event: KeyboardEvent) => {
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
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isActive) return null;
  else
    return (
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
