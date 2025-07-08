import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "~/auth";
import { getFollowers } from "~/lib/neynar";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.fid) {
    // return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const limit = req.nextUrl.searchParams.get("limit");
  const cursor = req.nextUrl.searchParams.get("cursor");

  try {
    const data = await getFollowers(
      //session.user.fid,
      1115209,
      limit ? Number(limit) : 25,
      cursor || undefined
    );
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch followers" },
      { status: 500 }
    );
  }
}
