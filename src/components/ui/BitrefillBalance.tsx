"use client";

import { useCallback, useEffect, useState } from "react";
import { hasBitrefillApiKey } from "~/lib/bitrefillApiKey";
import { getBalance } from "~/lib/bitrefillApi";

export function BitrefillBalance() {
  const [status, setStatus] = useState<"idle" | "success" | "error" | "no-key">(
    "idle"
  );
  const [message, setMessage] = useState<string>("");
  const [balance, setBalance] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>("");

  const refetch = useCallback(() => {
    if (!hasBitrefillApiKey()) {
      setStatus("no-key");
      setMessage("No Bitrefill API key set.");
      setBalance(null);
      setCurrency("");
      return;
    }
    setStatus("idle");
    setMessage("");
    setBalance(null);
    setCurrency("");
    getBalance()
      .then((res) => {
        setStatus("success");
        setBalance(res.data.balance);
        setCurrency(res.data.currency);
        setMessage("");
      })
      .catch(() => {
        setStatus("error");
        setMessage("Failed to fetch Bitrefill balance.");
      });
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (status === "no-key") {
    return (
      <div className="text-yellow-600 text-sm">No Bitrefill API key set.</div>
    );
  }
  if (status === "success") {
    return (
      <div>
        <div className="text-green-600 text-sm">
          Balance: {balance} {currency}
        </div>
        <a href="https://www.bitrefill.com/account/topup" target="_blank">
          <button className="text-blue-600 text-sm underline">Top up</button>
        </a>
      </div>
    );
  }
  if (status === "error") {
    return (
      <>
        <div className="text-red-600 text-sm">{message}</div>
        <button className="text-red-600 text-sm underline" onClick={refetch}>
          Refetch
        </button>
      </>
    );
  }
  return (
    <div className="text-gray-500 text-sm">Checking Bitrefill balance...</div>
  );
}
