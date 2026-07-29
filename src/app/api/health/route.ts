import { sql } from "drizzle-orm";

import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return new Response("ok", { status: 200 });
  } catch {
    return new Response("db unreachable", { status: 503 });
  }
}
