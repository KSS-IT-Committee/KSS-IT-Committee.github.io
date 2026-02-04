/**
 * @fileoverview Login page for user authentication.
 * @module app/login/page
 *
 * A client-side form that handles user login:
 * - Collects username and password
 * - Submits credentials to /api/auth/login
 * - Displays error messages for failed attempts
 * - Redirects to /committee-info on success
 * - Provides link to signup page for new users
 *
 * This is a public page - accessible without authentication.
 */
"use client";

import { useState, FormEvent } from "react";
import { Plaintext } from "@/components/Plaintext";
import styles from "./login.module.css";

/**
 * Login page component.
 *
 * Renders a login form with username/password fields,
 * handles form submission, and manages authentication state.
 *
 * @returns {JSX.Element} The login page
 */
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to committee-info page on success
        window.location.href = "/committee-info";
      } else {
        setError(data.error || "ログインに失敗しました");
      }
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}><Plaintext>委員会アカウント ログイン</Plaintext></h1>
        <p className={styles.description}>
          <Plaintext>委員会情報を 閲覧するには ログインが必要です</Plaintext>
        </p>

        {error && (
          <div className={styles.error}>
            <Plaintext>{error}</Plaintext>
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
              disabled={loading}
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
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        <hr className={styles.hr} />

        <a
          className={styles.signup}
          href="/signup"
        >
          新規登録はこちら
        </a>
      </div>
    </div>
  );
}
