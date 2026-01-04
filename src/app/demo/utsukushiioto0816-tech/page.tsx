export default function utsukushiioto0816tech() {
    const newLocal = `
        header{color:darkseagreen;text-align:center;font-size: 50pt;font-family:sans-serif;font-weight: bold;background-color: beige;padding:2rem 0}
main{padding:1rem 0;background-color:darkseagreen;}
h1{color:darkslategray;font-size:25px;font-weight: bold;border:2px;text-decoration: underline;}
h2{color:darkslategray;font-size:25px;font-weight:normal;}
p{color:black;font-size:18px;font-family:sans-serif;font-weight: normal;}
#container {
	display: grid;
	grid-template-rows: 300px 10px 100px 50px;
	grid-template-columns: 10px 400px 10px 400px 10px 400px;

#profile {
    font-weight: bold;
    grid-row: 1 / 5;
	grid-column: 2 / 3; 
    padding: 1rem;
    background-color: white; /* プロフィール背景色を白に */
    border-radius: 10px; /* 角を丸くする */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 影をつけて立体感を出す */
    margin-bottom: 2rem; /* 下に余白 */

}
#introduction {
    background-color: white;
	grid-row: 1 / 2;
	grid-column: 4/ 7;
    padding:12px
}
#links {
    grid-row: 3 / 5;
    grid-column: 6 / 7;
    margin-bottom:2rem;
    display: block; /* リンク全体をクリックできるようにブロック要素にする */
    background-color:white; /* リンクの背景色を白に */
    color:darkseagreen; /* リンクの文字色を青に */
    text-decoration:none; /* リンクの下線をなくす */
    padding: 0.1px 12px; /* 内側の余白 */
    border-radius: 5px; /* 角を少し丸く */
    font-weight: bold;
}
#goal {
    background-color: white;
    grid-row: 3 / 5;
    grid-column: 4 / 5;
    margin-bottom: 2rem;
    border-radius: 5px;
    padding:0 12px
}       
        `;
  return (
    <>
      <head>
        <title>utsukushiioto0816tech</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="practice/self-introduction.css" />
        <style>{newLocal}</style>
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