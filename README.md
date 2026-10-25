# shuns.site

Shun 的個人網站：翻唱、AI 專案、攝影。Astro 純靜態網站，部署在 Cloudflare Workers 的靜態資產：https://shuns.site

## 本機開發

需要 Node.js 22.23.4 以上。

```bash
npm install
npm run dev        # http://localhost:4321
```

## 指令

| 指令              | 用途                       |
| ----------------- | -------------------------- |
| `npm run dev`     | 開發伺服器                 |
| `npm run build`   | 輸出靜態網站到 `dist/`     |
| `npm run preview` | 預覽 build 結果            |
| `npm run check`   | Astro／TypeScript 型別檢查 |
| `npm run lint`    | ESLint                     |
| `npm run format`  | Prettier 格式化            |
| `npm test`        | Vitest 單元測試            |

## 部署

- 推到 `main` 時，`.github/workflows/deploy.yml` 會先跑完整檢查（`ci.yml`），通過後才部署到 Cloudflare。
- 要讓自動部署能運作，repo 需要：secret `CLOUDFLARE_API_TOKEN`（使用者自己建立並貼上，權限只要 Workers Scripts Edit），以及 variable `CLOUDFLARE_ACCOUNT_ID`（已設定）。
- 手動部署：`npm run deploy`（需要先 `npx wrangler login`）。
- 設定在 `wrangler.jsonc`：只放靜態資產，不執行任何 Worker 程式。

## 更新內容

網站內容都放在 `src/data/` 的三個 YAML 檔，每個檔案開頭都有欄位說明和範例：

| 檔案                     | 內容                                       |
| ------------------------ | ------------------------------------------ |
| `src/data/covers.yaml`   | 翻唱：曲名、原唱、YouTube 網址、日期、心得 |
| `src/data/projects.yaml` | AI 專案：名稱、介紹、技術、網站、公開 repo |
| `src/data/photos.yaml`   | 攝影：Instagram 貼文網址、說明             |

格式由 `src/lib/schemas.ts` 檢查：YAML 寫壞、缺欄位、欄位名打錯、id 重複、網址看不懂，`npm run build` 都會失敗並顯示中文錯誤，錯誤的資料不會上線。開發模式下存檔填錯時，終端機會顯示錯誤，頁面保留上一份正確的資料。

## 結構

```
src/
  layouts/BaseLayout.astro   # <head>、SEO、字體、深淺色、skip link
  components/                # 導覽列、頁尾、深淺色切換、Icon
  content.config.ts          # 三個資料 collection
  data/                      # 網站內容（YAML）
  lib/                       # 純函式、schema、YAML loader（有單元測試）
  styles/tokens.css          # 設計 token（淺色／深色）
  styles/global.css          # 全站基礎樣式、底片顆粒層
  pages/index.astro          # 首頁
design-system/MASTER.md      # 視覺規範
PLAN.md                      # 實作計畫
```
