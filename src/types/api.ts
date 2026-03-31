/**
 * API Response Types
 *
 * Type definitions for API request and response payloads.
 */

import { EventWithCreator } from "./events";

// Event API Types
export interface EventFormRequest {
  title: string;
  description: string | null;
  event_date: string;
  event_time: string;
  location: string;
}

export type CreateEventRequest = EventFormRequest;
export type UpdateEventRequest = EventFormRequest;

export interface EventResponse {
  event: EventWithCreator;
  is_creator?: boolean;
}

export interface EventsListResponse {
  events: EventWithCreator[];
}

export interface ApiErrorResponse {
  error: string;
}

export interface ApiSuccessResponse {
  message?: string;
}

// RSVP API Types
export interface RsvpRequest {
  status: "yes" | "no" | "maybe";
  comment?: string | null;
}

export interface RsvpResponse {
  message: string;
}

// Auth API Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  email: string;
}

export interface AuthResponse {
  message: string;
}
