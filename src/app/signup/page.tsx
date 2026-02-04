/**
 * @fileoverview Signup page for new user registration.
 * @module app/signup/page
 *
 * A client-side form that handles new user registration:
 * - Collects username, password, and password confirmation
 * - Validates password match on client side
 * - Submits to /api/auth/signup
 * - Displays success message (admin approval required)
 * - Provides link back to login page
 *
 * Note: New accounts require admin verification before login is possible.
 *
 * This is a public page - accessible without authentication.
 */
"use client";

import { useState, FormEvent } from "react";
import { Plaintext } from "@/components/Plaintext";
import styles from "./signup.module.css";

/**
 * Signup page component.
 *
 * Renders a registration form with username, password, and
 * password confirmation fields. Handles form validation and submission.
 *
 * @returns {JSX.Element} The signup page
 */
export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("パスワードが 一致しません もう一度確認してください");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setUsername("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(data.error || "登録に 失敗しました");
      }
    } catch {
      setError("ネットワークエラーが 発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}><Plaintext>アカウントを 作成</Plaintext></h1>
        <p className={styles.description}>
          <Plaintext>委員会情報を 閲覧するための アカウントを 作成する</Plaintext>
        </p>

        {error && (
          <div className={styles.error}>
            <Plaintext>{error}</Plaintext>
          </div>
        )}

        {success && (
          <div className={styles.success}>
            <Plaintext>{success}</Plaintext>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formField}>
            <label htmlFor="username" className={styles.label}>
              ユーザー名
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              required
              autoComplete="username"
              disabled={loading || !!success}
              minLength={3}
              maxLength={50}
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="password" className={styles.label}>
              パスワード
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              autoComplete="new-password"
              disabled={loading || !!success}
              minLength={6}
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="confirmPassword" className={styles.label}>
              パスワード（確認）
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              required
              autoComplete="new-password"
              disabled={loading || !!success}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={loading || !!success}
          >
            {loading ? "アカウントを登録中..." : "サインアップ"}
          </button>
        </form>

        <hr className={styles.hr} />

        <a
          className={styles.login}
          href="/login"
        >
          ログインページへ戻る
        </a>
      </div>
    </div>
  );
}
