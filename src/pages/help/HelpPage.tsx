import React, { useEffect } from "react";
import Styled from "./HelpPage.module.scss";

const HelpPage = () => {
  useEffect(() => {
    document.title = "Help | ExNicoWatch";
  });
  return (
    <div className={Styled.helpPage}>
      <h1>ExNicoWatch</h1>
      <p>
        ニコニコ動画を使いやすくしようと試みた独自プレイヤー
        <br />
        軽量化と利便性に力を入れている。
      </p>
      <h2>拡張機能</h2>
      <p>
        本サイトは拡張機能
        <a href="https://github.com/exnicowatch/ex-extension" target="_blank" rel="noreferrer">
          ExNicoExtension
        </a>
        の導入が前提になっている。
        <br />
        これの理由は主にCORS回避でありそれ以外の目的はない。不安な方はソースコードを見ていただきたい。
      </p>
      <h2>対応環境</h2>
      <p>
        最新版の下記ブラウザに対応している。
        <ul>
          <li>Google Chrome</li>
          <li>Firefox</li>
          <li>Microsoft Edge</li>
        </ul>
      </p>
      <h2>不具合・要望</h2>
      <p>
        作者のTwitterまたはGithubのIssueから連絡をお願いしたい。
        <br />
        またオープンソースで開発をしているのでPRもお待ちしている。
        <br />
        Twitter:{" "}
        <a href="https://twitter.com/Negima1072" target="_blank" rel="noreferrer">
          Negima1072
        </a>
        <br />
        GitHub:{" "}
        <a href="https://github.com/exnicowatch" target="_blank" rel="noreferrer">
          ExNicoWatch
        </a>
      </p>
    </div>
  );
};

export default HelpPage;
