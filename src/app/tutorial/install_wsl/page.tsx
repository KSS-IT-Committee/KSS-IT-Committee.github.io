import type { Metadata } from "next";
import { TutorialLayout } from "@/components/TutorialLayout";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata: Metadata = {
  title: "WSLをインストールする - IT委員会チュートリアル",
  description: "Windows Subsystem for Linux (WSL) のインストール方法",
};

export default function InstallWSLPage() {
  return (
    <TutorialLayout title="WSLをインストールする">
      <h2>WSLとは？</h2>
      <p>
        WSL（Windows Subsystem for Linux）は、Windows上でLinux環境を動かすことができる機能です。
        開発作業に必要なLinuxのツールやコマンドをWindowsで使えるようになります。
      </p>

      <h2>インストール手順</h2>

      <h3>1. PowerShellを管理者として開く</h3>
      <p>
        スタートメニューから「PowerShell」を検索し、右クリックして「管理者として実行」を選択します。
      </p>

      <h3>2. WSLをインストールする</h3>
      <p>
        以下のコマンドを実行してWSLをインストールします
      </p>
      <p>
        なお、今回はLinux環境ではかなり一般的なUbuntuと呼ばれるものを入れます。
      </p>
      <CodeBlock language="bash">
        <code>wsl --install -d Ubuntu</code>
      </CodeBlock>

      <h3>3. コンピューターを再起動する</h3>
      <p>
        インストールが完了したら、コンピューターを再起動します。
      </p>

      <h3>4. Ubuntuの設定</h3>
      <p>
        再起動後、Ubuntuが自動的に起動します。ユーザー名とパスワードを設定してください。
      </p>
      <p>
        <code>Enter new UNIX username:</code>
        <br />
        と出てくるため、その後ろにWSL上で使用したいユーザー名を入力します。
      </p>
      <p>
        その次に、
        <br />
        <code>New password:</code>
        <br />
        と出てくるため、パスワードを入力します。
        <br />
        続けてもう一度聞かれるため、同じ内容を入力します。また、入力したパスワードは画面上に表示されないことに注意しましょう。
      </p>
      <p>
        これでインストールは終わりです。
      </p>
    </TutorialLayout>
  );
}
