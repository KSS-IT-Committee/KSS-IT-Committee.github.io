import TutorialLayout from "@/components/TutorialLayout";
import CodeBlock from "@/components/CodeBlock";
import type { Metadata } from "next";
import Style from "@/styles/tutorial-content.module.css";

export const metadata: Metadata = {
  title: "Gitコマンドを使ってみる〜Gitのコマンド〜 - IT委員会チュートリアル",
  description: "Gitの基本的なコマンドの使い方",
};

export default function GitCommandsPage() {
  return (
    <TutorialLayout title="Gitコマンドを使ってみる〜Gitのコマンド〜">
      <h2>
        はじめに
      </h2>
      <p>
        前回のチュートリアルでGitの概念を学びました。
        <br />
        このチュートリアルでは、実際にGitコマンドを使ってバージョン管理を行う方法を学びます。
      </p>

      <h2>
        Gitのセットアップ
      </h2>
      <h3>
        ユーザー情報の設定
      </h3>
      <p>
        Gitを使い始める前に、自分の名前とメールアドレスを設定する必要があります。
        <br />
        この情報は、コミットを作成するときに記録されます。
      </p>
      <CodeBlock>
        <code>git config --global user.name &quot;あなたの名前&quot;</code>
        <br />
        <code>git config --global user.email &quot;your.email@example.com&quot;</code>
      </CodeBlock>
      <p>
        <span className={Style.caution}>この情報は公開されるため、本名を使いたくない場合は、GitHubのユーザー名を使用することをおすすめします。</span>
      </p>

      <h2>
        リポジトリの作成
      </h2>
      <h3>
        新しいリポジトリを作成する
      </h3>
      <p>
        新しいプロジェクトでGitを使い始めるには、<code>git init</code>コマンドを使います。
      </p>
      <CodeBlock>
        <code>git init</code>
      </CodeBlock>
      <p>
        このコマンドを実行すると、現在のディレクトリに<code>.git</code>フォルダが作成され、Gitリポジトリとして初期化されます。
      </p>

      <h3>
        既存のリポジトリをクローンする
      </h3>
      <p>
        既存のリモートリポジトリ（例：GitHubのプロジェクト）をコピーするには、<code>git clone</code>コマンドを使います。
      </p>
      <CodeBlock>
        <code>git clone https://github.com/ユーザー名/リポジトリ名.git</code>
      </CodeBlock>

      <h2>
        基本的なワークフロー
      </h2>
      <h3>
        ファイルの状態を確認する
      </h3>
      <p>
        現在の作業ツリーの状態を確認するには、<code>git status</code>コマンドを使います。
      </p>
      <CodeBlock>
        <code>git status</code>
      </CodeBlock>
      <p>
        このコマンドは以下の情報を表示します：
      </p>
      <ul>
        <li>変更されたファイル</li>
        <li>ステージングエリアに追加されたファイル</li>
        <li>追跡されていない新しいファイル</li>
        <li>現在のブランチ</li>
      </ul>

      <h3>
        ファイルをステージングエリアに追加する
      </h3>
      <p>
        変更したファイルをコミットの準備をするには、<code>git add</code>コマンドを使います。
      </p>
      <CodeBlock>
        <code># 特定のファイルを追加</code>
        <br />
        <code>git add ファイル名</code>
        <br />
        <br />
        <code># すべての変更を追加</code>
        <br />
        <code>git add .</code>
        <br />
        <br />
        <code># 複数のファイルを追加</code>
        <br />
        <code>git add ファイル1 ファイル2 ファイル3</code>
      </CodeBlock>

      <h3>
        変更をコミットする
      </h3>
      <p>
        ステージングエリアの内容をリポジトリに記録するには、<code>git commit</code>コマンドを使います。
      </p>
      <CodeBlock>
        <code>git commit -m &quot;コミットメッセージ&quot;</code>
      </CodeBlock>
      <p>
        <span className={Style.caution}>コミットメッセージは、何を変更したのか明確にわかるように書きましょう。将来の自分や他の開発者が理解できるように、具体的な内容を記述することが重要です。</span>
      </p>

      <h2>
        変更の確認
      </h2>
      <h3>
        変更内容を確認する
      </h3>
      <p>
        ファイルの変更内容を確認するには、<code>git diff</code>コマンドを使います。
      </p>
      <CodeBlock>
        <code># 作業ツリーとステージングエリアの差分</code>
        <br />
        <code>git diff</code>
        <br />
        <br />
        <code># ステージングエリアと最新コミットの差分</code>
        <br />
        <code>git diff --staged</code>
      </CodeBlock>

      <h3>
        コミット履歴を確認する
      </h3>
      <p>
        プロジェクトの変更履歴を見るには、<code>git log</code>コマンドを使います。
      </p>
      <CodeBlock>
        <code># 基本的なログ表示</code>
        <br />
        <code>git log</code>
        <br />
        <br />
        <code># 簡潔な1行表示</code>
        <br />
        <code>git log --oneline</code>
        <br />
        <br />
        <code># グラフ表示</code>
        <br />
        <code>git log --graph --oneline --all</code>
      </CodeBlock>

      <h2>
        ブランチの操作
      </h2>
      <h3>
        ブランチを作成する
      </h3>
      <p>
        新しいブランチを作成するには、<code>git branch</code>コマンドを使います。
      </p>
      <CodeBlock>
        <code>git branch ブランチ名</code>
      </CodeBlock>

      <h3>
        ブランチを切り替える
      </h3>
      <p>
        別のブランチに移動するには、<code>git checkout</code>または<code>git switch</code>コマンドを使います。
      </p>
      <CodeBlock>
        <code># checkoutを使う方法（従来の方法）</code>
        <br />
        <code>git checkout ブランチ名</code>
        <br />
        <br />
        <code># switchを使う方法（新しい方法）</code>
        <br />
        <code>git switch ブランチ名</code>
        <br />
        <br />
        <code># ブランチを作成して同時に切り替える</code>
        <br />
        <code>git checkout -b 新しいブランチ名</code>
        <br />
        <code>git switch -c 新しいブランチ名</code>
      </CodeBlock>

      <h3>
        ブランチをマージする
      </h3>
      <p>
        別のブランチの変更を現在のブランチに統合するには、<code>git merge</code>コマンドを使います。
      </p>
      <CodeBlock>
        <code># mainブランチに切り替える</code>
        <br />
        <code>git switch main</code>
        <br />
        <br />
        <code># feature-branchをmainにマージ</code>
        <br />
        <code>git merge feature-branch</code>
      </CodeBlock>

      <h3>
        ブランチを削除する
      </h3>
      <p>
        不要になったブランチを削除するには：
      </p>
      <CodeBlock>
        <code># マージ済みのブランチを削除</code>
        <br />
        <code>git branch -d ブランチ名</code>
        <br />
        <br />
        <code># 強制的に削除（マージされていなくても）</code>
        <br />
        <code>git branch -D ブランチ名</code>
      </CodeBlock>

      <h2>
        リモートリポジトリとの連携
      </h2>
      <h3>
        リモートリポジトリを追加する
      </h3>
      <p>
        ローカルリポジトリにリモートリポジトリを追加するには：
      </p>
      <CodeBlock>
        <code>git remote add origin https://github.com/ユーザー名/リポジトリ名.git</code>
      </CodeBlock>
      <p>
        ここで<code>origin</code>はリモートリポジトリの名前（通常は origin を使います）です。
      </p>

      <h3>
        変更をリモートに送信する
      </h3>
      <p>
        ローカルのコミットをリモートリポジトリに送信するには、<code>git push</code>コマンドを使います。
      </p>
      <CodeBlock>
        <code># 初回プッシュ（ブランチの追跡設定も行う）</code>
        <br />
        <code>git push -u origin main</code>
        <br />
        <br />
        <code># 2回目以降のプッシュ</code>
        <br />
        <code>git push</code>
      </CodeBlock>

      <h3>
        リモートの変更を取得する
      </h3>
      <p>
        リモートリポジトリの変更を取得するには、<code>git pull</code>または<code>git fetch</code>コマンドを使います。
      </p>
      <CodeBlock>
        <code># fetchとmergeを同時に行う</code>
        <br />
        <code>git pull</code>
        <br />
        <br />
        <code># 変更を取得するだけ（マージしない）</code>
        <br />
        <code>git fetch</code>
      </CodeBlock>
      <p>
        <code>git fetch</code>は変更をダウンロードするだけで、作業ツリーは変更しません。
        <br />
        <code>git pull</code>は変更をダウンロードして、自動的にマージします。
      </p>

      <h2>
        変更を取り消す
      </h2>
      <h3>
        作業ツリーの変更を取り消す
      </h3>
      <p>
        まだステージングしていない変更を元に戻すには：
      </p>
      <CodeBlock>
        <code># 特定のファイルの変更を取り消す</code>
        <br />
        <code>git restore ファイル名</code>
        <br />
        <br />
        <code># すべての変更を取り消す</code>
        <br />
        <code>git restore .</code>
      </CodeBlock>

      <h3>
        ステージングを取り消す
      </h3>
      <p>
        ステージングエリアに追加したファイルを取り消すには：
      </p>
      <CodeBlock>
        <code>git restore --staged ファイル名</code>
      </CodeBlock>

      <h3>
        コミットを取り消す
      </h3>
      <p>
        最新のコミットを取り消すには：
      </p>
      <CodeBlock>
        <code># コミットを取り消すが、変更は保持</code>
        <br />
        <code>git reset --soft HEAD~1</code>
        <br />
        <br />
        <code># コミットとステージングを取り消すが、変更は保持</code>
        <br />
        <code>git reset HEAD~1</code>
        <br />
        <br />
        <code># コミット、ステージング、変更をすべて取り消す</code>
        <br />
        <code>git reset --hard HEAD~1</code>
      </CodeBlock>
      <p>
        <span className={Style.caution}>
          <code>git reset --hard</code>は変更を完全に削除するため、慎重に使用してください。取り消した変更は復元できません。
        </span>
      </p>

      <h2>
        その他の便利なコマンド
      </h2>
      <h3>
        変更を一時的に退避する
      </h3>
      <p>
        作業途中の変更を一時的に退避させるには、<code>git stash</code>コマンドを使います。
      </p>
      <CodeBlock>
        <code># 変更を退避</code>
        <br />
        <code>git stash</code>
        <br />
        <br />
        <code># 退避した変更を復元</code>
        <br />
        <code>git stash pop</code>
        <br />
        <br />
        <code># 退避リストを確認</code>
        <br />
        <code>git stash list</code>
      </CodeBlock>

      <h3>
        ファイルを履歴から削除する
      </h3>
      <p>
        ファイルを削除してコミットするには：
      </p>
      <CodeBlock>
        <code>git rm ファイル名</code>
        <br />
        <code>git commit -m &quot;ファイルを削除&quot;</code>
      </CodeBlock>

      <h3>
        ファイル名を変更する
      </h3>
      <p>
        ファイル名を変更してGitに認識させるには：
      </p>
      <CodeBlock>
        <code>git mv 古いファイル名 新しいファイル名</code>
        <br />
        <code>git commit -m &quot;ファイル名を変更&quot;</code>
      </CodeBlock>

      <h2>
        まとめ
      </h2>
      <p>
        このチュートリアルでは、Gitの基本的なコマンドを学びました。
        <br />
        最も頻繁に使用するコマンドは以下の通りです：
      </p>
      <ul>
        <li><code>git status</code> - 現在の状態を確認</li>
        <li><code>git add</code> - 変更をステージング</li>
        <li><code>git commit</code> - 変更を記録</li>
        <li><code>git push</code> - リモートに送信</li>
        <li><code>git pull</code> - リモートから取得</li>
        <li><code>git log</code> - 履歴を確認</li>
      </ul>
      <p>
        これらのコマンドを実際に使ってみて、Gitの使い方に慣れていきましょう。
        <br />
        最初は難しく感じるかもしれませんが、繰り返し使うことで自然と身についていきます。
      </p>
    </TutorialLayout>
  );
}
