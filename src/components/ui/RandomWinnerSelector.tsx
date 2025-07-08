"use client";

import { useCallback, useEffect, useState } from "react";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDisplayName(item: unknown): string {
  if (typeof item === "object" && item !== null) {
    const obj = item as { [key: string]: unknown };
    if (typeof obj.username === "string") return `@${obj.username}`;
    if (typeof obj.display_name === "string") return obj.display_name;
    if (typeof obj.fid === "number" || typeof obj.fid === "string")
      return `FID: ${obj.fid}`;
    if (typeof obj.user === "object" && obj.user !== null) {
      const user = obj.user as { [key: string]: unknown };
      if (typeof user.username === "string") return `@${user.username}`;
      if (typeof user.fid === "number" || typeof user.fid === "string")
        return `FID: ${user.fid}`;
    }
    return JSON.stringify(obj);
  }
  return typeof item === "string" ? item : JSON.stringify(item);
}

export function RandomWinnerSelector({
  channelId,
  mode,
  fetchTrigger,
  onReset,
}: {
  channelId?: string;
  mode: "followers" | "members";
  fetchTrigger: number;
  onReset: () => void;
}) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<unknown[]>([]);
  const [winner, setWinner] = useState<unknown | null>(null);

  useEffect(() => {
    if (!channelId) return;
    let cancelled = false;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      setCount(null);
      setItems([]);
      setWinner(null);
      let total = 0;
      let cursor: string | undefined = undefined;
      let allItems: unknown[] = [];
      const baseUrl =
        mode === "members"
          ? `https://api.farcaster.xyz/fc/channel-members?channel_id=${encodeURIComponent(
              channelId!
            )}`
          : `https://api.farcaster.xyz/v1/channel-followers?channel_id=${encodeURIComponent(
              channelId!
            )}`;
      try {
        do {
          const url = new URL(baseUrl);
          url.searchParams.set("limit", "1000");
          // Only set cursor if it is a non-empty string
          if (typeof cursor === "string" && cursor.length > 0) {
            url.searchParams.set("cursor", cursor);
          }
          const res = await fetch(url.toString());
          if (!res.ok) throw new Error(`Error fetching channel ${mode}`);
          const data = await res.json();
          const pageItems = Array.isArray(data.result?.users)
            ? data.result.users
            : Array.isArray(data.result?.followers)
            ? data.result.followers
            : Array.isArray(data.result?.members)
            ? data.result.members
            : [];
          allItems = allItems.concat(pageItems);
          total += pageItems.length;
          cursor = data.next?.cursor;
          if (cursor) await sleep(100);
        } while (cursor && !cancelled);
        if (!cancelled) {
          setCount(total);
          setItems(allItems);
        }
      } catch (err: unknown) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [fetchTrigger]);

  const pickWinner = useCallback(() => {
    if (items.length > 0) {
      const idx = Math.floor(Math.random() * items.length);
      setWinner(items[idx]);
    } else {
      setWinner(null);
    }
  }, [items]);

  useEffect(() => {
    pickWinner();
  }, [pickWinner]);

  if (!channelId) return null;

  if (loading)
    return (
      <div className="mb-4 mt-4">
        Loading {mode}
        <br />
        this may take a while...
      </div>
    );

  if (error)
    return (
      <div className="mb-4 mt-4 text-red-500">
        Error: {error}
        <br />
        Please try again.
      </div>
    );

  return (
    <div className="mt-4 mb-4 text-xl font-semibold border-2 border-gray-300 rounded-lg p-4">
      Channel {mode.charAt(0).toUpperCase() + mode.slice(1)}: {count}
      {winner ? (
        <div className="mt-4 text-lg text-blue-700">
          Winner: {String(getDisplayName(winner))}
        </div>
      ) : null}
      <button className="mt-4 px-4 py-2 text-red-600 text-sm" onClick={onReset}>
        X Reset
      </button>
    </div>
  );
}
