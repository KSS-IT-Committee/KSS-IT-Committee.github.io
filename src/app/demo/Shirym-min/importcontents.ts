// useMinContents.ts
import { useState, useEffect } from "react";
import localdata from "./mincontents.json";

type MinContents = typeof localdata;

function isMinContentsLike(value: Record<string, unknown>): value is MinContents {
  return (
    typeof value.name === "string" &&
    typeof value.mygithub === "string" &&
    typeof value.imagesrc === "string"
  );
}

function normalizeMinContents(json: unknown): MinContents | null {
  if (!json || typeof json !== "object") return null;
  const asRecord = json as Record<string, unknown>;

  if (isMinContentsLike(asRecord)) {
    return asRecord as MinContents;
  }
  if (asRecord.data && typeof asRecord.data === "object") {
    const nested = asRecord.data as Record<string, unknown>;
    if (isMinContentsLike(nested)) {
      return nested as MinContents;
    }
  }
  return null;
}

const MIN_CONTENTS_CACHE_KEY = "mincontents-cache";
const MIN_CONTENTS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

type MinContentsCacheEntry = {
  savedAt: number;
  data: MinContents;
};

function loadMinContentsFromCache(): MinContents | null {
  if (typeof window === "undefined" || !("localStorage" in window)) {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(MIN_CONTENTS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MinContentsCacheEntry;
    if (typeof parsed.savedAt !== "number" || !parsed.data) {
      return null;
    }
    const age = Date.now() - parsed.savedAt;
    if (age > MIN_CONTENTS_CACHE_TTL_MS) {
      return null;
    }
    // Basic structural validation before using cached data
    return normalizeMinContents(parsed.data) ?? null;
  } catch {
    return null;
  }
}

function saveMinContentsToCache(data: MinContents): void {
  if (typeof window === "undefined" || !("localStorage" in window)) {
    return;
  }
  try {
    const entry: MinContentsCacheEntry = {
      savedAt: Date.now(),
      data,
    };
    window.localStorage.setItem(MIN_CONTENTS_CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Ignore cache write errors
  }
}

// 同期的にアクセスしているように見せる
export function useMinContents() {
  const [data, setData] = useState<MinContents | null>(null);

  useEffect(() => {
    let active = true;

    // Try to use cached data immediately, if available
    const cached = loadMinContentsFromCache();
    if (cached && active) {
      setData(cached);
    }

    const load = async () => {
      try {
        const res = await fetch("https://shirym-min.vercel.app/api/getjson/itcommitinfo");
        if (!res.ok) {
          if (active) setData((prev) => prev ?? localdata);
          return;
        }
        const json = await res.json();
        const normalized = normalizeMinContents(json);
        const nextData = normalized ?? localdata;
        if (active) {
          setData(nextData);
          saveMinContentsToCache(nextData);
        }
      } catch {
        if (active) setData((prev) => prev ?? localdata); // フェッチ失敗時はlocaldata
      }
    };

    // If there was no valid cached data, fetch from the API
    if (!cached) {
      load();
    }
    return () => {
      active = false;
    };
  }, []);

  return data;
}
