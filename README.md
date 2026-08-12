# 課題08: PR を出す(AWS CodeCommit 版)

**ゴール:** 「ブランチ → 変更 → push → Pull Request 作成 → レビュー対応 → マージ」の一連の流れを、実際に AWS CodeCommit 上で1回完走する。

> このブランチは GitHub 版(`main` ブランチの README)を **AWS CodeCommit で進める場合の手順**に置き換えたものです。変更する内容(フッター追加)は GitHub 版と同じです。

![Pull Request の流れ](docs/pr-flow.png)

> 図の原本は [docs/pr-flow.drawio](docs/pr-flow.drawio)([draw.io](https://app.diagrams.net) で編集可)。流れ自体は GitHub でも CodeCommit でも同じです。

> **注意:** CodeCommit は 2024年7月以降、新規の AWS アカウントでは利用開始できません。この手順書は、研修用の CodeCommit リポジトリが既に用意されている(既存アカウントで利用中の)前提で進めます。

---

## 0. リポジトリを手元に用意する

CodeCommit には GitHub のような「フォーク」はありません。**全員が同じリポジトリに自分のブランチを push する**方式で進めます(研修で IAM ユーザー/ロールの権限をもらってください)。

接続方法は2通りあります。どちらか1つでOKです。

### A. HTTPS(Git 認証情報)で clone する場合

1. AWS コンソール → **IAM → ユーザー → 自分のユーザー → セキュリティ認証情報** タブを開きます。
2. **「AWS CodeCommit の HTTPS Git 認証情報」→ 認証情報を生成** を押し、ユーザー名とパスワードを控えます(パスワードは生成時しか見られません)。
3. clone します。ユーザー名/パスワードを聞かれたら 2. で控えたものを入力します。

```bash
git clone https://git-codecommit.ap-northeast-1.amazonaws.com/v1/repos/angular-training-08-pull-request
cd angular-training-08-pull-request
npm install
```

### B. git-remote-codecommit(GRC)で clone する場合(AWS CLI を使っている人向け)

`aws configure`(または SSO)で認証済みなら、Git 認証情報の発行は不要です。

```bash
pip install git-remote-codecommit
git clone codecommit::ap-northeast-1://angular-training-08-pull-request
cd angular-training-08-pull-request
npm install
```

> URL の `ap-northeast-1` は研修用リポジトリのリージョンに合わせてください。

## 1. 課題内容を確認する

今回の変更内容(そのまま使います):

> **フッターにデータ出典(PokeAPI)の表記を追加する。** 理由: 画像・データの出典明記が推奨されているため。

`npx ng serve` でアプリを起動し、**現在はフッターが無い**ことをブラウザで確認しておきます。

## 2. ブランチを切る

```bash
git status                     # clean を確認
git switch -c feature/add-credit-footer
```

> ブランチ名は「何をするブランチか」が分かる名前にします。`fix-bug` や `work` は避けます。
> 全員が同じリポジトリに push するので、他の人とぶつかる場合は `feature/add-credit-footer-yamada` のように名前を付け足します。

## 3. 変更を実装する

1. `src/app/app.html` の**末尾**に、次をコピペして保存します。

   ```html
   <footer class="footer">
     <p>
       データ・画像:
       <a href="https://pokeapi.co" target="_blank" rel="noopener">PokeAPI</a>
     </p>
   </footer>
   ```

2. `src/app/app.css` の**末尾**に、次をコピペして保存します。

   ```css
   .footer {
     padding: 24px 20px;
     text-align: center;
     font-size: 12px;
     color: #7c828a;
   }

   .footer a {
     color: #e3350d;
   }
   ```

3. ブラウザで、ページ下部にフッターが表示されることを確認します。

## 4. セルフレビューしてからコミットする

1. **PR を出す前に、自分が最初のレビュアーになります。**

   ```bash
   git diff
   ```

   確認する観点: 関係ないファイルを触っていないか / 消し忘れの console.log やコメントがないか / インデントが揃っているか。
2. 問題なければコミットします。

   ```bash
   git add src/app/app.html src/app/app.css
   git commit -m "feat: フッターにデータ出典(PokeAPI)の表記を追加"
   ```

## 5. push する

```bash
git push -u origin feature/add-credit-footer
```

> `-u` を付けると、次回から `git push` だけで済むようになります。

## 6. Pull Request を作成する

### AWS コンソールで作る場合

1. AWS コンソール → **CodeCommit → リポジトリ → angular-training-08-pull-request** を開きます。
2. 左メニュー(またはリポジトリ画面上部)の **「プルリクエスト」→「プルリクエストの作成」** を押します。
3. **ターゲット(マージ先)に `main`、ソースに `feature/add-credit-footer`** を選び、**「比較」** を押して差分が出ることを確認します。
4. タイトルはコミットメッセージと同じでOK: `feat: フッターにデータ出典(PokeAPI)の表記を追加`
5. CodeCommit には GitHub のような PR テンプレートの自動挿入がないので、**説明欄に次の項目を自分で書きます:**
   - What: フッターに PokeAPI への出典表記とリンクを追加した
   - Why: データ・画像の出典明記が推奨されているため
   - 動作確認: `npx ng serve` でフッターの表示を確認した
6. **「プルリクエストの作成」** を押します。

### CLI で作る場合(AWS CLI がある人向け)

```bash
aws codecommit create-pull-request \
  --title "feat: フッターにデータ出典(PokeAPI)の表記を追加" \
  --description "What: フッターに PokeAPI への出典表記とリンクを追加した / Why: データ・画像の出典明記が推奨されているため" \
  --targets repositoryName=angular-training-08-pull-request,sourceReference=feature/add-credit-footer,destinationReference=main
```

## 7. レビューコメントに対応する

研修ではレビュアー(講師またはペアの受講者)が、PR の **「変更」タブ**の該当行にコメントを付けます。典型例:

> 「`target="_blank"` のリンクであることが見た目で分からないので、リンク後ろに ↗ を付けてください」

対応の手順:

1. **同じブランチのまま**修正します(`app.html` のリンク文言を `PokeAPI ↗` に変更して保存)。
2. ブラウザで確認 → コミット → push します。

   ```bash
   git add src/app/app.html
   git commit -m "fix: 外部リンクであることが分かるよう ↗ を追加"
   git push
   ```

3. **push するだけで PR に自動で反映されます。** PR 画面をリロードし、「変更」タブの差分とコミットが増えていることを確認します。
4. コメントに「修正しました」と**返信**します(CodeCommit には GitHub の Resolve ボタンに相当する機能がないので、返信で完了を伝えます)。

## 8. マージする

1. レビュアーに PR 画面右上の **「承認」** を押してもらいます(承認ルールが設定されている場合は、必要数の承認が揃うまでマージできません)。
2. 承認が付いたら **「マージ」** を押し、マージ戦略を選びます。今回は **「早送りマージ(fast-forward)」** のままでOKです(選べない場合は「3ウェイマージ」)。
3. **「ソースブランチ feature/add-credit-footer を削除しますか?」のチェックを ON** にしたままマージします(マージ済みブランチは残さない)。
4. 手元も最新にします。

   ```bash
   git switch main
   git pull
   git branch -d feature/add-credit-footer
   ```

5. `git log --oneline` で自分の変更が main に入っていることを確認します。**これで1周完走です。**

---

## GitHub との違い(まとめ)

| 項目 | GitHub | CodeCommit |
|---|---|---|
| 認証 | アカウント + トークン/SSH | IAM(HTTPS Git 認証情報 or git-remote-codecommit) |
| フォーク | あり | **なし**(同一リポジトリにブランチを push) |
| PR テンプレート | 自動挿入される | **ないので説明欄に自分で書く** |
| レビュー | Approve / Request changes / Resolve | 「承認」+ コメント返信(Resolve 機能なし) |
| マージ方式 | Merge / Squash / Rebase | 早送り / スカッシュ / 3ウェイ |

---

## チェックリスト

- [ ] PR のタイトルと説明だけで「何を・なぜ」が伝わる
- [ ] push の前に `git diff` でセルフレビューした
- [ ] レビュー指摘に「同じブランチへの追いコミット」で対応した
- [ ] マージ後にソースブランチを削除し、手元の main を最新化した

---

## 1日の流れ(7時間の目安)

| 時間 | 内容 |
|---|---|
| 午前(2〜3h) | この手順書(README)を完走する |
| 午後(3〜4h) | [練習課題(EXERCISES.md)](./EXERCISES.md) に取り組む |
| 最後(30分) | EXERCISES.md 末尾の「1日の終わりに」でふりかえる |

回答例は [ANSWERS.md](./ANSWERS.md) にあります。**練習課題はまず自力で30分粘ってから**見ること。
