/**
 * NoScript Component
 *
 * Displays a warning message when JavaScript is disabled in the browser.
 *
 * Purpose:
 * - Provides feedback to users who have JavaScript disabled
 * - Prevents interaction with the page when JS is required
 * - Displays a full-screen Japanese warning message
 *
 * Features:
 * - Uses <noscript> tag (only renders when JS is disabled)
 * - Locks page scroll via inline styles
 * - Japanese warning text explaining JS requirement
 *
 * @example
 * // Include in layout.tsx
 * <NoScript />
 */
export function NoScript() {
  return (
    <noscript>
      <style>{`
        html, body {
          overflow: hidden;
        }
      `}</style>
      <div className="noscript-warning">
        <div className="noscript-content">
          <h1>⚠️ JavaScriptを有効化してください。</h1>
          <p>
            このページは正常に動作するためにJavascriptを必要とします。
            <br />
            ブラウザ設定よりJavaScriptを有効化してください。
          </p>
        </div>
      </div>
    </noscript>
  );
}
