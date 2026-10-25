# shuns.site

Shun 的個人網站：翻唱、AI 專案、攝影。Astro 純靜態網站，部署在 Cloudflare Workers 的靜態資產（部署設定在階段 5）。

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

## 結構

```
src/
  layouts/BaseLayout.astro   # <head>、SEO、字體、深淺色、skip link
  components/                # 導覽列、頁尾、深淺色切換、Icon
  lib/                       # 純函式（有單元測試）
  styles/tokens.css          # 設計 token（淺色／深色）
  styles/global.css          # 全站基礎樣式、底片顆粒層
  pages/index.astro          # 首頁
design-system/MASTER.md      # 視覺規範
PLAN.md                      # 實作計畫
```
