# 課題08 練習課題 回答例・記入例

> **動くコード:** この回答例を実際に適用したソースコードが `exercises-answers` ブランチにあります。
> `git switch exercises-answers` で切り替えて動かせます(GitHub 上では branch 切り替えで閲覧)。
> **回答版デモ:** https://kadai08-answers.vercel.app
> ブランチのコミットが、そのまま PR に積むべきコミットの単位になっています。


---

## 練習1: 2本目の PR

実装(課題02 練習4と同じ):

`src/app/app.ts`:

```ts
readonly favCount = computed(() => this.favoriteIds().size);
```

`src/app/app.html` のヘッダー:

```html
<header class="header">
  <h1>ポケモン図鑑ミニ</h1>
  <span class="fav-count">★ {{ favCount() }}</span>
</header>
```

`src/app/app.css` に `.header { display: flex; justify-content: space-between; align-items: center; }` と `.fav-count { font-weight: 700; }` を追加。

コマンドの流れ:

```bash
git status
git switch -c feature/fav-count-badge
# 実装 → ブラウザ確認
git diff
git add -A
git commit -m "feat: ヘッダーにお気に入り件数バッジを追加"
git push -u origin feature/fav-count-badge
gh pr create --web   # または GitHub 画面から
```

PR 本文の記入例:

> **What:** ヘッダー右端に ★ とお気に入り件数を表示するバッジを追加した
> **Why:** いくつお気に入りしたかが一覧のどこからでも分かるようにするため
> **動作確認:** ✅ serve 起動 / ✅ ★を2件付けて「★ 2」表示を確認 / ✅ build 成功

## 練習2: レビューコメントの記入例

1. 良い点: 「件数を新しい signal にせず `computed` で導出しているのが良いです。状態の二重管理が起きません」
2. 質問: 「`favCount` を App に置きましたが、将来ヘッダーを部品化する場合はどこに移すべきだと思いますか?」
3. 提案: 「`.fav-count` にアクセシビリティ用のラベル(`aria-label="お気に入り 2件"` など)があると読み上げにも対応できそうです」

**やってはいけないコメントの例:** 「なんでこう書いたの?」(理由を聞きたいなら具体的に)/「普通こうする」(根拠のリンクや理由を添える)。

## 練習3: 指摘対応の流れ

指摘: 「console.log が残っています」「タイトルの『修正』では何の修正か分かりません」

```bash
git switch feature/xxx        # PR と同じブランチのまま
# console.log を削除、保存
git add -A
git commit -m "fix: デバッグ用の console.log を削除"
git push                      # push だけで PR に自動反映
```

- タイトルは PR 画面の **Edit** ボタンでいつでも直せる(コミットし直す必要はない)
- コメントへの返信例: 「ご指摘ありがとうございます。abc1234 で削除しました」→ 指摘した側が **Resolve conversation**

## 練習4: テンプレート改善 PR の例

`.github/PULL_REQUEST_TEMPLATE.md` に「関連 Issue」欄を追加する diff:

```markdown
## 関連 Issue

<!-- 例: #12 / なければ「なし」と書く -->
```

PR タイトル例: `docs: PRテンプレートに関連Issue欄を追加`

> ドキュメント変更の PR は動作確認欄が意味を持たないことがある。その場合は「該当なし(ドキュメントのみ)」と明記するのがマナー。空欄のまま出さない。

## 練習5: コンフリクト解消

手元での解消時、エディタに出る印の読み方と対処は課題03の ANSWERS(練習3)と同じ。PR 特有のポイント:

- GitHub 上の「Resolve conflicts」ボタンでも簡単なものは解消できるが、**手元で解消して push する方法を正とする**(ビルド・動作確認をしてから push できるため)
- `git merge origin/main` の代わりに rebase を使う現場もある。配属先の流儀に従うこと(まず聞く)

## 練習6: PR 運用ルール提案の記入例

1. PR は**1機能1本**、目安は差分300行以内。超えそうなら分割する
2. タイトルは `feat:/fix:/docs:/chore:` + 変更内容1行
3. 説明は What / Why / 動作確認 を必須(テンプレートで強制)
4. セルフレビュー(自分で Files changed を一読)してからレビュー依頼
5. レビューは24時間以内に最初の反応を返す
6. 指摘への対応は同一ブランチへの追いコミット。force push は原則しない
7. マージ条件: Approve 1件以上 + CI(lint / build / test)グリーン
8. マージ後はブランチを削除。main は常にデプロイ可能に保つ

## 1日の終わり

チェック観点: 説明を読まずにコードだけ見て理解できる PR は小さくて良い PR。逆に、説明が無いと意図が分からない変更(なぜこの値? なぜこの方式?)は、**説明欄かコードコメントのどちらに書くべきかを考える**(値の理由はコード近くに、経緯や比較検討は PR に)。
