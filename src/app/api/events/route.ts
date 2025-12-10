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
 * Query parameters:
 * - limit: Number of events to return (optional)
 * - offset: Number of events to skip (optional)
 * - upcoming: Filter to upcoming events only (true/false, optional)
 * - sortBy: Sort by 'date', 'popularity', or 'recent' (optional, default: 'date')
 * - sortOrder: 'asc' or 'desc' (optional, default: 'asc')
 *
 * @param {NextRequest} request - The incoming request
 * @returns {NextResponse} JSON response with events array
 *
 * Response codes:
 * - 200: Success with events array
 * - 401: Not authenticated
 * - 500: Server error
 */
export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (!auth.authenticated) {
    return auth.errorResponse;
  }

  try {
    // Clean up events older than 5 days automatically
    await eventQueries.deletePastEvents();

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);

    // Validate limit (must be a positive integer)
    let limit: number | undefined;
    const limitParam = searchParams.get('limit');
    if (limitParam) {
      const parsedLimit = parseInt(limitParam, 10);
      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        return NextResponse.json(
          { error: 'limit must be a positive number' },
          { status: 400 }
        );
      }
      limit = parsedLimit;
    }

    // Validate offset (must be a non-negative integer)
    let offset: number | undefined;
    const offsetParam = searchParams.get('offset');
    if (offsetParam) {
      const parsedOffset = parseInt(offsetParam, 10);
      if (isNaN(parsedOffset) || parsedOffset < 0) {
        return NextResponse.json(
          { error: 'offset must be a non-negative number' },
          { status: 400 }
        );
      }
      offset = parsedOffset;
    }

    // Validate upcoming (boolean)
    const upcoming = searchParams.get('upcoming') === 'true';

    // Validate sortBy (must be one of allowed values)
    const sortByParam = searchParams.get('sortBy') || 'date';
    const allowedSortBy = ['date', 'popularity', 'recent'] as const;
    if (!allowedSortBy.includes(sortByParam as typeof allowedSortBy[number])) {
      return NextResponse.json(
        { error: `sortBy must be one of: ${allowedSortBy.join(', ')}` },
        { status: 400 }
      );
    }
    const sortBy = sortByParam as 'date' | 'popularity' | 'recent';

    // Validate sortOrder (must be 'asc' or 'desc')
    const sortOrderParam = searchParams.get('sortOrder') || 'asc';
    const allowedSortOrder = ['asc', 'desc'] as const;
    if (!allowedSortOrder.includes(sortOrderParam as typeof allowedSortOrder[number])) {
      return NextResponse.json(
        { error: 'sortOrder must be either "asc" or "desc"' },
        { status: 400 }
      );
    }
    const sortOrder = sortOrderParam as 'asc' | 'desc';

    const events = await eventQueries.findAll(auth.session!.user_id, {
      limit,
      offset,
      upcoming,
      sortBy,
      sortOrder,
    });
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
