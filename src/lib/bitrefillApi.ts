import { getBitrefillApiKey } from "./bitrefillApiKey";

// --- Product Types ---
export interface ProductMeta {
  id: string;
  _endpoint: string;
}

export interface ProductPackage {
  id: string;
  value: string;
  price: number;
}

export interface ProductRange {
  min: number;
  max: number;
  step: number;
  price_rate: number;
}

export interface ProductData {
  id: string;
  name: string;
  country_code: string;
  country_name: string;
  currency: string;
  created_time: string;
  recipient_type: string;
  image: string;
  in_stock: boolean;
  packages: ProductPackage[];
  range: ProductRange;
}

export interface ProductResponse {
  meta: ProductMeta;
  data: ProductData;
}

// --- Invoice Types ---
export interface CreateInvoiceProduct {
  product_id: string;
  package_id: string;
  value: number;
  quantity: number;
}

export interface CreateInvoiceRequest {
  products: CreateInvoiceProduct[];
  auto_pay: boolean;
  payment_method: "balance" | "bitcoin";
}

export interface CreateInvoiceResponse {
  meta: {
    products: CreateInvoiceProduct[];
    payment_method: string;
    auto_pay: boolean;
    _endpoint: string;
  };
  data: {
    id: string;
    created_time: string;
    completed_time: string;
    status: string;
    user: {
      id: string;
      email: string;
    };
    payment: {
      method: string;
      address: string;
      currency: string;
      price: number;
      status: string;
      commission: number;
    };
    orders: Array<{
      id: string;
      status: string;
      product: {
        id: string;
        name: string;
        value: string;
        currency: string;
        image: string;
        _href: string;
      };
      created_time: string;
      delivered_time: string;
    }>;
  };
}

export interface BalanceMeta {
  _endpoint: string;
}

export interface BalanceData {
  balance: number;
  currency: string;
}

export interface BalanceResponse {
  meta: BalanceMeta;
  data: BalanceData;
}

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

export async function getProduct(productId: string): Promise<ProductResponse> {
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

export async function createInvoice(
  req: CreateInvoiceRequest
): Promise<CreateInvoiceResponse> {
  const apiKey = getBitrefillApiKey();
  if (!apiKey) throw new Error("Bitrefill API key not set");
  const response = await fetch("/api/bitrefill/invoices", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-bitrefill-api-key": apiKey,
    },
    body: JSON.stringify(req),
  });
  if (!response.ok) throw new Error("Bitrefill API createInvoice failed");
  return await response.json();
}

export async function getBalance(): Promise<BalanceResponse> {
  const apiKey = getBitrefillApiKey();
  if (!apiKey) throw new Error("Bitrefill API key not set");
  const response = await fetch("/api/bitrefill/accounts/balance", {
    headers: {
      "Content-Type": "application/json",
      "x-bitrefill-api-key": apiKey,
    },
  });
  if (!response.ok) throw new Error("Bitrefill API getBalance failed");
  return await response.json();
}
