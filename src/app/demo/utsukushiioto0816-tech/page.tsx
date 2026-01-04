export default function Utsukushiioto0816Tech() {
  return (
    <>
      <head>
        <title>utsukushiioto0816-tech</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          @import url(practice/self-introduction.css);

          header {
            /* headerのスタイルは必要に応じて追加 */
          }

          #container {
            /* 必要に応じてスタイルをここに */
          }

          /* 元のCSSをここに書くか、別ファイルで管理してください */
        `}</style>
      </head>
      <body>
        <header>
          About Me!
          <h2>こんにちは！自己紹介ぺーじにようこそ！!</h2>
          <div style={{ border: '2px solid darkseagreen', width: '100%' }}></div>
        </header>
        <main>
          <div id="container">
            <br />
            <div id="profile">
              <div style={{ border: '2px solid darkseagreen' }}></div>
              <h1>プロフィール</h1>
              <img
                src="https://avatars.githubusercontent.com/u/236381715?v=4"
                alt="utsukushiioto0816"
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  marginTop: 10,
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}
              />
              <p>名前: utsukushiioto0816-tech</p>
              <p>誕生日: 8月16日</p>
              <p>部活: 女子バレー部,料理研究会,物理研究会</p>
              <div style={{ border: '2px solid darkseagreen' }}></div>
            </div>
            <div id="introduction">
              <h1>自己紹介</h1>
              <p>
                こんにちは。プログラミングできないのに委員会に入って3日で副委員長兼会計になった人です。
                特に語ることがないので、テンプレっぽいことを言って（書いて）おきます。
              </p>
              <p>
                趣味は読書とお菓子作り、好きな食べ物はミニトマト、嫌いな食べ物はキノコ全般です。　　　　　
                委員会に入ったのは、プログラミングができるようになりたかったのと、誘われたからです。
              </p>
              <p>技術も知識もほぼぜろですが、頑張るのでやさしくしてください。</p>
            </div>
            <div id="goal">
              <h1>目標</h1>
              <p>天命を待てるくらい人事を尽くすこと</p>
            </div>
            <div id="links">
              <h1>GitHub</h1>
              <a href="https://github.com/utsukushiioto0816-tech">アカウントはこちら</a>
            </div>
          </div>
        </main>
      </body>
    </>
  );
}