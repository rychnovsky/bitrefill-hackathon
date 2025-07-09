import React from "react";

export type Group = "followers" | "members";
export type Mode = "random";

type Props = {
  channelId: string;
  group: Group;
  mode: Mode;
  setChannelId: (channelId: string) => void;
  setGroup: (group: Group) => void;
  setMode: (mode: Mode) => void;
  onComplete: (res: { channelId: string; group: Group; mode: Mode }) => void;
};

const RulesDefinition = ({
  channelId,
  group,
  mode,
  setChannelId,
  setGroup,
  setMode,
  onComplete,
}: Props) => {
  return (
    <>
      <p className="text-lg mb-8">
        Enter a Farcaster channel ID to pick a winner of gift card.
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
        <label htmlFor="group" className="text-sm text-gray-500">
          Group:
        </label>
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value as Group)}
          className="px-3 py-2 border rounded w-full text-black"
        >
          <option value="followers">Followers</option>
          <option value="members">Members</option>
        </select>
        <label htmlFor="mode" className="text-sm text-gray-500">
          Mode:
        </label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          className="px-3 py-2 border rounded w-full text-black"
        >
          <option value="random">Random</option>
        </select>
        <button
          onClick={() => onComplete({ channelId, group, mode })}
          className="mt-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
          disabled={!channelId.trim()}
        >
          Pick winner
        </button>
      </div>
    </>
  );
};

export default RulesDefinition;
