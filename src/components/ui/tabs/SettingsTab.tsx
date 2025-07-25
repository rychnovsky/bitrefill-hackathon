"use client";

import { useEffect, useState } from "react";

import { getBitrefillApiKey, setBitrefillApiKey } from "~/lib/bitrefillApiKey";
import { BitrefillApiCheck } from "../BitrefillApiCheck";
import { BitrefillBalance } from "../BitrefillBalance";
import {
  getBitrefillProduct,
  setBitrefillProduct,
} from "~/lib/bitrefillProductSelection";

export function SettingsTab() {
  const [apiKey, setApiKey] = useState("");
  const [product, setProduct] = useState("");
  const [saved, setSaved] = useState(false);
  const [savedProduct, setSavedProduct] = useState(false);

  useEffect(() => {
    const stored = getBitrefillApiKey();
    if (stored) setApiKey(stored);
  }, []);

  useEffect(() => {
    const stored = getBitrefillProduct();
    if (stored) setProduct(stored);
  }, []);

  const handleSave = () => {
    setBitrefillApiKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleSaveProduct = () => {
    setBitrefillProduct(product);
    setSavedProduct(true);
    setTimeout(() => setSavedProduct(false), 1500);
  };

  return (
    <div className="mx-6">
      <h2 className="text-lg font-semibold mb-2">Settings</h2>
      <label
        htmlFor="bitrefill-api-key"
        className="block mb-2 text-sm text-gray-500"
      >
        Bitrefill API Key
      </label>
      <input
        id="bitrefill-api-key"
        type="text"
        className="w-full px-3 py-2 border rounded mb-4 text-black"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter your Bitrefill API key"
      />
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={!apiKey.trim()}
      >
        Save
      </button>
      {saved && <div className="mt-2 text-green-600 text-sm">Saved!</div>}
      <p className="text-sm text-gray-500 mt-4">
        You can get your Bitrefill API key from{" "}
        <a
          href="https://www.bitrefill.com/account/developers"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Bitrefill developers page
        </a>
      </p>
      {!saved && (
        <div className="mt-4">
          <BitrefillApiCheck />
        </div>
      )}
      {!saved && (
        <div className="mt-4">
          <BitrefillBalance />
        </div>
      )}

      <hr className="my-8 opacity-20" />

      <h2 className="text-lg font-semibold mt-4">Product</h2>

      <label
        htmlFor="bitrefill-api-key"
        className="block mb-2 text-sm text-gray-500"
      >
        Bitrefill Product ID
      </label>
      <input
        id="bitrefill-api-key"
        type="text"
        className="w-full px-3 py-2 border rounded mb-4 text-black"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        placeholder="Enter your Bitrefill product ID"
      />
      <button
        onClick={handleSaveProduct}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={!product.trim()}
      >
        Save
      </button>
      {savedProduct && (
        <div className="mt-2 text-green-600 text-sm">Saved!</div>
      )}
    </div>
  );
}
