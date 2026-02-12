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

// 同期的にアクセスしているように見せる
export function useMinContents() {
  const [data, setData] = useState<MinContents | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("https://shirym-min.vercel.app/api/getjson/itcommitinfo", {
          cache: "no-store",
        });
        if (!res.ok) {
          if (active) setData(localdata);
          return;
        }
        const json = await res.json();
        const normalized = normalizeMinContents(json);
        if (active) setData(normalized ?? localdata);
      } catch {
        if (active) setData(localdata); // フェッチ失敗時はlocaldata
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return data;
}
