/**
 * @fileoverview Signup API route handler.
 * @module api/auth/signup
 *
 * Handles new user registration with validation and password hashing.
 *
 * POST /api/auth/signup
 * - Validates username (3-50 characters) and password (6+ characters)
 * - Checks for existing username conflicts
 * - Creates new user with hashed password (bcrypt, 10 rounds)
 * - New users require admin verification before login
 *
 * @requires server-only
 */
import "server-only";

import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import { userQueries } from "@/lib/db";

/**
 * POST handler for user registration.
 *
 * @param {NextRequest} request - The incoming request with JSON body { username, password }
 * @returns {NextResponse} JSON response with success/error message
 *
 * Response codes:
 * - 201: User created successfully (pending admin verification)
 * - 400: Validation error (missing/invalid fields)
 * - 409: Username already exists
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "ユーザー名とパスワードを入力してください" },
        { status: 400 },
      );
    }

    // Validate username length
    if (username.length < 3 || username.length > 50) {
      return NextResponse.json(
        { error: "ユーザー名は 3文字以上50文字以下で 入力してください" },
        { status: 400 },
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "パスワードは 6文字以上で 入力してください" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const isExistingUser = await userQueries.existsByUsername(username);
    if (isExistingUser) {
      return NextResponse.json(
        { error: "このユーザー名は 既に 使用されています" },
        { status: 409 },
      );
    }

    // Hash password and create user
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await userQueries.create(username, hashedPassword);

    if (!newUser) {
      return NextResponse.json(
        { error: "ユーザーの 作成に 失敗しました" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "登録が 完了しました。 管理者の承認を お待ちください。",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(`Signup error: ${error}`);
    return NextResponse.json(
      { error: "サーバーエラーが 発生しました" },
      { status: 500 },
    );
  }
}
