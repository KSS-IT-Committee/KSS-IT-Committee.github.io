/**
 * @fileoverview Events API route handler.
 * @module api/events
 *
 * Handles event listing and creation.
 *
 * GET /api/events - List all events with RSVP counts
 * POST /api/events - Create a new event
 *
 * @requires server-only
 */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { eventQueries } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

/**
 * GET handler for listing all events.
 *
 * @returns {NextResponse} JSON response with events array
 *
 * Response codes:
 * - 200: Success with events array
 * - 401: Not authenticated
 * - 500: Server error
 */
export async function GET() {
  const auth = await requireAuth();
  if (!auth.authenticated) {
    return auth.errorResponse;
  }

  try {
    const events = await eventQueries.findAll(auth.session!.user_id);
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

/**
 * POST handler for creating a new event.
 *
 * @param {NextRequest} request - The incoming request with JSON body
 * @returns {NextResponse} JSON response with created event
 *
 * Response codes:
 * - 201: Event created successfully
 * - 400: Missing required fields
 * - 401: Not authenticated
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth.authenticated) {
    return auth.errorResponse;
  }

  try {
    const body = await request.json();
    const { title, description, event_date, event_time, location } = body;

    if (!title || !event_date || !event_time || !location) {
      return NextResponse.json(
        { error: 'タイトル、日付、時間、場所は必須です' },
        { status: 400 }
      );
    }

    // Validate description length if provided
    if (description && description.length > 2000) {
      return NextResponse.json(
        { error: '説明は2000文字以内で入力してください' },
        { status: 400 }
      );
    }

    // Sanitize description (basic XSS prevention)
    const sanitizedDescription = description ? description.replace(/[<>]/g, '') : null;

    // Validate field lengths
    if (title.length > 200) {
      return NextResponse.json(
        { error: 'タイトルは200文字以内にしてください' },
        { status: 400 }
      );
    }

    if (description && description.length > 5000) {
      return NextResponse.json(
        { error: '説明は5000文字以内にしてください' },
        { status: 400 }
      );
    }

    if (location.length > 200) {
      return NextResponse.json(
        { error: '場所は200文字以内にしてください' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(event_date)) {
      return NextResponse.json(
        { error: '日付の形式が正しくありません (YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    // Validate time format (HH:MM)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(event_time)) {
      return NextResponse.json(
        { error: '時間の形式が正しくありません (HH:MM)' },
        { status: 400 }
      );
    }

    const event = await eventQueries.create(
      title,
      description || null,
      event_date,
      event_time,
      location,
      auth.session!.user_id
    );

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
