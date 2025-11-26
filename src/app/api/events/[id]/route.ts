/**
 * @fileoverview Single event API route handler.
 * @module api/events/[id]
 *
 * Handles single event operations.
 *
 * GET /api/events/[id] - Get event details with attendees
 * PATCH /api/events/[id] - Update event (creator only)
 * DELETE /api/events/[id] - Delete event (creator only)
 *
 * @requires server-only
 */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sessionQueries, eventQueries, rsvpQueries } from '@/lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET handler for fetching a single event with attendees.
 *
 * @param {NextRequest} request - The incoming request
 * @param {RouteContext} context - Route context with params
 * @returns {NextResponse} JSON response with event and attendees
 *
 * Response codes:
 * - 200: Success with event and attendees
 * - 401: Not authenticated
 * - 404: Event not found
 * - 500: Server error
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if (!sessionId) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const session = await sessionQueries.findById(sessionId);
    if (!session) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const { id } = await context.params;
    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json({ error: '無効なイベントIDです' }, { status: 400 });
    }

    const event = await eventQueries.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: 'イベントが見つかりません' }, { status: 404 });
    }

    const attendees = await rsvpQueries.findByEvent(eventId);
    const counts = await rsvpQueries.countByEvent(eventId);

    // Get current user's RSVP
    const userRsvp = attendees.find((a) => a.user_id === session.user_id);

    return NextResponse.json({
      event,
      attendees,
      counts,
      user_rsvp: userRsvp?.status || null,
      is_creator: event.created_by === session.user_id,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

/**
 * PATCH handler for updating an event.
 *
 * @param {NextRequest} request - The incoming request
 * @param {RouteContext} context - Route context with params
 * @returns {NextResponse} JSON response with updated event or error
 *
 * Response codes:
 * - 200: Event updated successfully
 * - 400: Invalid request body
 * - 401: Not authenticated
 * - 403: Not the creator
 * - 500: Server error
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if (!sessionId) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const session = await sessionQueries.findById(sessionId);
    if (!session) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const { id } = await context.params;
    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json({ error: '無効なイベントIDです' }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, event_date, event_time, location } = body;

    // Validate required fields if provided
    if (title !== undefined && !title.trim()) {
      return NextResponse.json({ error: 'タイトルは必須です' }, { status: 400 });
    }
    if (event_date !== undefined && !event_date) {
      return NextResponse.json({ error: '日付は必須です' }, { status: 400 });
    }
    if (event_time !== undefined && !event_time) {
      return NextResponse.json({ error: '時間は必須です' }, { status: 400 });
    }
    if (location !== undefined && !location.trim()) {
      return NextResponse.json({ error: '場所は必須です' }, { status: 400 });
    }

    const updated = await eventQueries.update(eventId, session.user_id, {
      title: title?.trim(),
      description: description ?? undefined,
      event_date,
      event_time,
      location: location?.trim(),
    });

    if (!updated) {
      return NextResponse.json(
        { error: 'イベントが見つからないか、編集権限がありません' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, event: updated }, { status: 200 });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

/**
 * DELETE handler for deleting an event.
 *
 * @param {NextRequest} request - The incoming request
 * @param {RouteContext} context - Route context with params
 * @returns {NextResponse} JSON response with success/error
 *
 * Response codes:
 * - 200: Event deleted successfully
 * - 401: Not authenticated
 * - 403: Not the creator
 * - 404: Event not found
 * - 500: Server error
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if (!sessionId) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const session = await sessionQueries.findById(sessionId);
    if (!session) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const { id } = await context.params;
    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json({ error: '無効なイベントIDです' }, { status: 400 });
    }

    const deleted = await eventQueries.delete(eventId, session.user_id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'イベントが見つからないか、削除権限がありません' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, message: 'イベントを削除しました' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
