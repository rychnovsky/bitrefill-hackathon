"use client";

export function HowItWorksTab() {
  return (
    <div className="mx-6">
      <h2 className="text-lg font-semibold mb-2">How it works</h2>
      <p className="text-sm text-gray-500 mb-4">
        <ol className="list-decimal flex flex-col gap-4 ml-4">
          <li>Enter a Farcaster channel ID</li>
          <li>
            The app will fetch the channel&apos;s followers or members and pick
            a random winner.
          </li>
          <li>Select the reward gift card you want to give to the winner.</li>
          <li>The winner will be notified via a DM on Farcaster.</li>
        </ol>
      </p>
      <p className="text-sm text-gray-500 mb-4 mt-4">Powered by Bitrefill</p>
    </div>
  );
}
