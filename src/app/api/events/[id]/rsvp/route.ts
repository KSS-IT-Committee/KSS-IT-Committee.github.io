/**
 * @fileoverview RSVP API route handler.
 * @module api/events/[id]/rsvp
 *
 * Handles RSVP operations for events.
 *
 * POST /api/events/[id]/rsvp - Create or update RSVP
 *
 * @requires server-only
 */
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sessionQueries, rsvpQueries, eventQueries } from "@/lib/db";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * POST handler for creating or updating an RSVP.
 *
 * @param {NextRequest} request - The incoming request with JSON body { status, comment }
 * @param {RouteContext} context - Route context with params
 * @returns {NextResponse} JSON response with RSVP
 *
 * Response codes:
 * - 200: RSVP created/updated successfully
 * - 400: Invalid status or event ID
 * - 401: Not authenticated
 * - 404: Event not found
 * - 500: Server error
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const session = await sessionQueries.findById(sessionId);
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { id } = await context.params;
    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json({ error: "無効なイベントIDです" }, { status: 400 });
    }

    // Check if event exists
    const event = await eventQueries.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: "イベントが見つかりません" }, { status: 404 });
    }

    const body = await request.json();
    const { status, comment } = body;

    if (!status || !["yes", "no", "maybe"].includes(status)) {
      return NextResponse.json(
        { error: "有効なステータスを選択してください (yes/no/maybe)" },
        { status: 400 }
      );
    }

    const rsvp = await rsvpQueries.upsert(
      eventId,
      session.user_id,
      status,
      comment || null
    );

    return NextResponse.json({ rsvp }, { status: 200 });
  } catch (error) {
    console.error(`Error updating RSVP: ${error}`);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
