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
import RulesDefinition, { Group, Mode } from "~/components/ui/RulesDefinition";
import ProductPurchase from "~/components/ui/ProductPurchase";
import { RandomWinnerSelector } from "~/components/ui/RandomWinnerSelector";
import RewardDistribution from "~/components/ui/RewardDistribution";
import { CreateInvoiceResponse } from "~/lib/bitrefillApi";

export function HomeTab() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  // Rules
  const [channelId, setChannelId] = useState("");
  const [group, setGroup] = useState<Group>("members");
  const [mode, setMode] = useState<Mode>("random");
  // Winner selection
  const [winner, setWinner] = useState<{
    fid: number;
    username: string;
  } | null>(null);
  // Product purchase
  const [purchasedProduct, setPurchasedProduct] =
    useState<CreateInvoiceResponse | null>(null);

  const goToStepWinnerSelection = () => {
    setStep(2);
  };

  const resetForm = useCallback(() => {
    setChannelId("");
    setGroup("members");
    setMode("random");
    setWinner(null);
    setPurchasedProduct(null);
    setStep(1);
  }, []);

  return (
    <div className="flex items-center justify-center flex-1 px-6">
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
            <div className="w-8 h-1 bg-gray-800" />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              2
            </div>
            <div className="w-8 h-1 bg-gray-800" />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 3
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              3
            </div>
            <div className="w-8 h-1 bg-gray-800" />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 4
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              4
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {step === 1
              ? "Enter channel details"
              : step === 2
              ? "View winner"
              : step === 3
              ? "Reward selection"
              : "Reward distribution"}
          </div>
        </div>

        {step === 1 ? (
          <>
            <RulesDefinition
              channelId={channelId}
              group={group}
              mode={mode}
              setChannelId={setChannelId}
              setGroup={setGroup}
              setMode={setMode}
              onComplete={goToStepWinnerSelection}
            />
          </>
        ) : step === 2 ? (
          <>
            <RandomWinnerSelector
              channelId={channelId.trim().toLowerCase()}
              group={group}
              mode={mode}
              onComplete={(winner) => {
                setWinner(winner);
                setStep(3);
              }}
            />
          </>
        ) : step === 3 ? (
          <>
            <ProductPurchase
              onComplete={(res) => {
                setPurchasedProduct(res);
                setStep(4);
              }}
            />
          </>
        ) : (
          <>
            {purchasedProduct && winner ? (
              <RewardDistribution
                purchasedProduct={purchasedProduct}
                winner={winner}
                channelKey={channelId.trim().toLowerCase()}
              />
            ) : null}
          </>
        )}
        {step > 1 ? (
          <button
            className="mt-2 px-4 py-0 text-red-700 text-sm opacity-50"
            onClick={resetForm}
          >
            Start over
          </button>
        ) : null}
        <p className="text-sm text-gray-500 mt-4">Powered by Bitrefill</p>
      </div>
    </div>
  );
}
