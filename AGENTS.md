# AGENTS.md

shuns.site：Shun 的作品集網站（翻唱、AI 專案、攝影）。和 Personal Feed（`G:\Claude\project\mywebsite`）是不同的 codebase。

## 先讀

1. `PLAN.md`：範圍、階段、已確定的決定
2. `design-system/MASTER.md`：視覺規範（A「底片暗房」），有 `pages/<頁名>.md` 時以該檔為準
3. `HANDOFF.md`：網域、Cloudflare、環境備忘

## 規則

- 一律用繁體中文回覆使用者。所有服務都要用免費方案、不綁信用卡。機密值由使用者自己貼，不要寫進檔案。
- 純靜態 Astro 網站：不加資料庫、不加 SSR adapter、不加 UI 框架。樣式用 `src/styles/tokens.css` 的 token，元件裡不要直接寫 hex 色碼。
- 不能編造翻唱、作品、照片或專案內容。範例資料要明確標示是範例。
- YouTube／IG 嵌入要點了才載入，並且尊重 `prefers-reduced-motion`。
- 改完要跑 `npm run check && npm run lint && npm test && npm run build`。

## 開發

`npm run dev`（http://localhost:4321）。如果要讓 dev server 在背景跑：`npx astro dev --background`，用 `astro dev stop` 停止。Astro 文件：https://docs.astro.build
