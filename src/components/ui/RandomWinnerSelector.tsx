"use client";

import { useCallback, useEffect, useState } from "react";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractFid(item: unknown): number | null {
  if (typeof item === "object" && item !== null) {
    const obj = item as { [key: string]: unknown };
    if (typeof obj.fid === "number") return obj.fid;
    if (typeof obj.fid === "string") return parseInt(obj.fid, 10);
    if (typeof obj.user === "object" && obj.user !== null) {
      const user = obj.user as { [key: string]: unknown };
      if (typeof user.fid === "number") return user.fid;
      if (typeof user.fid === "string") return parseInt(user.fid, 10);
    }
  }
  return null;
}

// Add WinnerUser type
interface WinnerUser {
  username?: string;
  display_name?: string;
  fid?: number | string;
}

export function RandomWinnerSelector({
  channelId,
  group,
  mode,
  onComplete,
}: {
  channelId?: string;
  group: "followers" | "members";
  mode: "random";
  onComplete: (winner: { fid: number; username: string }) => void;
}) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<unknown[]>([]);
  const [winner, setWinner] = useState<unknown | null>(null);
  const [winnerDetails, setWinnerDetails] = useState<unknown | null>(null);
  const [loadingWinnerDetails, setLoadingWinnerDetails] = useState(false);

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
        group === "members"
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
          if (!res.ok) throw new Error(`Error fetching channel ${group}`);
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
  }, []);

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

  // Fetch winner details when winner is selected
  useEffect(() => {
    if (!winner) return;
    const fid = extractFid(winner);
    if (!fid) return;
    setLoadingWinnerDetails(true);
    setWinnerDetails(null);
    fetch(`/api/users?fids=${fid}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user details");
        return res.json();
      })
      .then((data) => {
        if (data.users && data.users.length > 0) {
          setWinnerDetails(data.users[0]);
        }
      })
      .catch(() => {
        setWinnerDetails(null);
      })
      .finally(() => {
        setLoadingWinnerDetails(false);
      });
  }, [winner]);

  if (!channelId) return null;

  const hasWinnerData =
    winnerDetails &&
    typeof winnerDetails === "object" &&
    winnerDetails !== null;

  const renderWinnerDetails = () => {
    if (loadingWinnerDetails || loading) {
      return <div className="">Loading winner details...</div>;
    }
    if (error) {
      return <div className="text-red-500">Error: {error}</div>;
    }
    if (hasWinnerData) {
      return (
        <>
          <h2 className="text-lg font-bold mb-4">Winner Selected!</h2>
          <div className="text-sm text-gray-600 mb-2">
            Channel {group.charAt(0).toUpperCase() + group.slice(1)}: {count}
          </div>
          <div className="text-sm text-gray-600 mb-4">
            {mode.charAt(0).toUpperCase() + mode.slice(1)} winner:
          </div>
          {loadingWinnerDetails ? (
            <div className="text-blue-600">Loading winner details...</div>
          ) : winnerDetails &&
            typeof winnerDetails === "object" &&
            winnerDetails !== null ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              {(() => {
                const user = winnerDetails as WinnerUser;
                return (
                  <>
                    <div className="text-lg font-bold text-green-800 mb-2">
                      🎉 @{user.username}
                    </div>
                    <div className="text-green-700 text-sm">
                      {user.username && <div>Username: @{user.username}</div>}
                      {user.display_name && (
                        <div>Name: {user.display_name}</div>
                      )}
                      {user.fid && <div>FID: {user.fid}</div>}
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="text-gray-600">No winner details available</div>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <div className="mt-4 mb-4 border-[1px] border-gray-800 rounded-lg p-4 py-8">
      {renderWinnerDetails()}
      {!!hasWinnerData ? (
        <button
          onClick={() => onComplete({ fid: 1, username: "test" })}
          className="mt-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
          disabled={!winner}
        >
          Continue to gift card
        </button>
      ) : null}
    </div>
  );
}
