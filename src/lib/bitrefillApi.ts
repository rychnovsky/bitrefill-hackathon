import { getBitrefillApiKey } from "./bitrefillApiKey";

export async function pingBitrefill(): Promise<unknown> {
  const apiKey = getBitrefillApiKey();
  if (!apiKey) throw new Error("Bitrefill API key not set");
  const response = await fetch("/api/bitrefill/ping", {
    headers: {
      "Content-Type": "application/json",
      "x-bitrefill-api-key": apiKey,
    },
  });
  if (!response.ok) throw new Error("Bitrefill API ping failed");
  return await response.json();
}

export async function getProduct(productId: string): Promise<unknown> {
  const apiKey = getBitrefillApiKey();
  if (!apiKey) throw new Error("Bitrefill API key not set");
  const response = await fetch(
    `/api/bitrefill/products/${encodeURIComponent(productId)}`,
    {
      headers: {
        "Content-Type": "application/json",
        "x-bitrefill-api-key": apiKey,
      },
    }
  );
  if (!response.ok) throw new Error("Bitrefill API getProduct failed");
  return await response.json();
}
