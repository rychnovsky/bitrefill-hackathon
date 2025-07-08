"use client";

import { useCallback, useEffect, useState } from "react";
import { hasBitrefillApiKey } from "~/lib/bitrefillApiKey";
import { pingBitrefill } from "~/lib/bitrefillApi";

export function BitrefillApiCheck() {
  const [status, setStatus] = useState<"idle" | "success" | "error" | "no-key">(
    "idle"
  );
  const [message, setMessage] = useState<string>("");

  const refetch = useCallback(() => {
    if (!hasBitrefillApiKey()) {
      setStatus("no-key");
      setMessage("No Bitrefill API key set.");
      return;
    }
    setStatus("idle");
    setMessage("");
    pingBitrefill()
      .then(() => {
        setStatus("success");
        setMessage("Bitrefill API key is valid.");
      })
      .catch(() => {
        setStatus("error");
        setMessage("Bitrefill API key is invalid or network error.");
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
    return <div className="text-green-600 text-sm">{message}</div>;
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
    <div className="text-gray-500 text-sm">Checking Bitrefill API key...</div>
  );
}
