import { NextRequest, NextResponse } from "next/server";

const BITREFILL_BASE = "https://api.bitrefill.com/v2/";

export async function GET(
  req: NextRequest,
  context: { params: { path: string[] } }
) {
  const { params } = await context;
  return proxyToBitrefill(req, params.path);
}

export async function POST(
  req: NextRequest,
  context: { params: { path: string[] } }
) {
  const { params } = await context;
  return proxyToBitrefill(req, params.path);
}

export async function PUT(
  req: NextRequest,
  context: { params: { path: string[] } }
) {
  const { params } = await context;
  return proxyToBitrefill(req, params.path);
}

export async function DELETE(
  req: NextRequest,
  context: { params: { path: string[] } }
) {
  const { params } = await context;
  return proxyToBitrefill(req, params.path);
}

async function proxyToBitrefill(req: NextRequest, path: string[]) {
  const apiKey = req.headers.get("x-bitrefill-api-key");
  if (!apiKey) {
    return NextResponse.json(
      { error: "Bitrefill API key not provided in x-bitrefill-api-key header" },
      { status: 401 }
    );
  }
  const url = BITREFILL_BASE + path.join("/");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  // Forward query params
  const search = req.nextUrl.search;
  const fullUrl = url + (search || "");
  // Forward body for non-GET
  let body: BodyInit | undefined = undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await req.text();
  }
  const resp = await fetch(fullUrl, {
    method: req.method,
    headers,
    body,
  });
  const data = await resp.text();
  return new NextResponse(data, {
    status: resp.status,
    headers: {
      "Content-Type": resp.headers.get("Content-Type") || "application/json",
    },
  });
}
