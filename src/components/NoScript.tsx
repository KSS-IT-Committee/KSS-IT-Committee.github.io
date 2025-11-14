export default function NoScript() {
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
            このページは正常に動作するためにJavascriptを必要とします。<br />
            ブラウザ設定よりJavaScriptを有効化してください。
          </p>
        </div>
      </div>
    </noscript>
  );
}
