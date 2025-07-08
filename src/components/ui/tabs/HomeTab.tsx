"use client";

/**
 * HomeTab component displays the main landing content for the mini app.
 *
 * This is the default tab that users see when they first open the mini app.
 * It provides a simple welcome message and placeholder content that can be
 * customized for specific use cases.
 *
 * @example
 * ```tsx
 * <HomeTab />
 * ```
 */
import { useCallback, useState } from "react";
import { RandomWinnerSelector } from "~/components/ui/RandomWinnerSelector";
export function HomeTab() {
  const [channelId, setChannelId] = useState("");
  const [mode, setMode] = useState<"followers" | "members">("followers");
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [submittedChannelId, setSubmittedChannelId] = useState<
    string | undefined
  >(undefined);
  const [submittedMode, setSubmittedMode] = useState<"followers" | "members">(
    "followers"
  );

  const handleFetch = () => {
    setSubmittedChannelId(channelId.trim() || undefined);
    setSubmittedMode(mode);
    setFetchTrigger((n) => n + 1);
  };

  const resetForm = useCallback(() => {
    setChannelId("");
    setMode("followers");
    setFetchTrigger(0);
    setSubmittedChannelId(undefined);
    setSubmittedMode("followers");
  }, []);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)] px-6">
      <div className="text-center w-full max-w-md mx-auto">
        <p className="text-lg mb-8">
          Enter a Farcaster channel ID to pick a random winner.
        </p>
        <div className="flex flex-col items-start gap-2">
          <label htmlFor="channelId" className="text-sm text-gray-500">
            Channel ID:{" "}
          </label>
          <input
            type="text"
            placeholder="Enter channel ID"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            className=" px-3 py-2 border rounded w-full text-black"
            id="channelId"
          />
          <label htmlFor="mode" className="text-sm text-gray-500">
            Mode:{" "}
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "followers" | "members")}
            className="px-3 py-2 border rounded w-full text-black"
          >
            <option value="followers">Followers</option>
            <option value="members">Members</option>
          </select>
          <button
            onClick={handleFetch}
            className="mt-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
          >
            Pick random winner
          </button>
        </div>

        <RandomWinnerSelector
          channelId={submittedChannelId}
          mode={submittedMode}
          fetchTrigger={fetchTrigger}
          onReset={resetForm}
        />

        <p className="text-sm text-gray-500 mt-4">Powered by Bitrefill</p>
      </div>
    </div>
  );
}
