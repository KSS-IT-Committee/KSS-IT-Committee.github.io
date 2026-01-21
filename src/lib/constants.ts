/**
 * Application Constants
 *
 * Centralized constants for magic strings and configuration values.
 */

// RSVP Status Constants
export const RSVP_STATUS = {
  YES: 'yes',
  NO: 'no',
  MAYBE: 'maybe',
} as const;

export type RsvpStatus = typeof RSVP_STATUS[keyof typeof RSVP_STATUS];

// Error Messages (Japanese)
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  EVENT_CREATE_FAILED: 'イベントの作成に失敗しました',
  EVENT_UPDATE_FAILED: 'イベントの更新に失敗しました',
  EVENT_DELETE_FAILED: 'イベントの削除に失敗しました',
  EVENT_FETCH_FAILED: 'イベントの取得に失敗しました',
  NO_EDIT_PERMISSION: 'このイベントを編集する権限がありません',
  RSVP_FAILED: 'RSVP操作に失敗しました',
  AUTH_FAILED: '認証に失敗しました',
  LOADING: '読み込み中...',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  EVENTS: '/api/events',
  EVENT_BY_ID: (id: string | number) => `/api/events/${id}`,
  EVENT_RSVP: (id: string | number) => `/api/events/${id}/rsvp`,
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_SIGNUP: '/api/auth/signup',
  AUTH_CHECK: '/api/auth/check',
} as const;
