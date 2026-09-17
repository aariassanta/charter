import { NextRequest, NextResponse } from "next/server";
import { getDb, getSessionUser } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const rows = db.prepare(
    "SELECT * FROM extractions WHERE user_id = ? ORDER BY created_at DESC"
  ).all(user.id);

  return NextResponse.json(rows);
}
