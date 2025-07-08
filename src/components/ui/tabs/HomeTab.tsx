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
  const [step, setStep] = useState<1 | 2>(1);
  const [channelId, setChannelId] = useState("");
  const [mode, setMode] = useState<"followers" | "members">("members");
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [submittedChannelId, setSubmittedChannelId] = useState<
    string | undefined
  >(undefined);
  const [submittedMode, setSubmittedMode] = useState<"followers" | "members">(
    "members"
  );

  const handleFetch = () => {
    setSubmittedChannelId(channelId.trim() || undefined);
    setSubmittedMode(mode);
    setFetchTrigger((n) => n + 1);
    setStep(2);
  };

  const resetForm = useCallback(() => {
    setChannelId("");
    setMode("followers");
    setFetchTrigger(0);
    setSubmittedChannelId(undefined);
    setSubmittedMode("followers");
    setStep(1);
  }, []);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)] px-6">
      <div className="text-center w-full max-w-md mx-auto">
        {/* Step indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              1
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              2
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {step === 1 ? "Enter channel details" : "View winner"}
          </div>
        </div>
        {step === 1 ? (
          <>
            <p className="text-lg mb-8">
              Enter a Farcaster channel ID to pick a random winner.
            </p>
            <div className="flex flex-col items-start gap-2">
              <label htmlFor="channelId" className="text-sm text-gray-500">
                Channel ID:
              </label>
              <input
                type="text"
                placeholder="Enter channel ID"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                className="px-3 py-2 border rounded w-full text-black"
                id="channelId"
              />
              <label htmlFor="mode" className="text-sm text-gray-500">
                Mode:
              </label>
              <select
                value={mode}
                onChange={(e) =>
                  setMode(e.target.value as "followers" | "members")
                }
                className="px-3 py-2 border rounded w-full text-black"
              >
                <option value="followers">Followers</option>
                <option value="members">Members</option>
              </select>
              <button
                onClick={handleFetch}
                className="mt-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
                disabled={!channelId.trim()}
              >
                Pick random winner
              </button>
            </div>
          </>
        ) : (
          <RandomWinnerSelector
            channelId={submittedChannelId}
            mode={submittedMode}
            fetchTrigger={fetchTrigger}
            onReset={resetForm}
          />
        )}
        <p className="text-sm text-gray-500 mt-4">Powered by Bitrefill</p>
      </div>
    </div>
  );
}
