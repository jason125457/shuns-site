# shuns.site 實作計畫

> 2026-10-25 擬定。前提請見 `HANDOFF.md`，視覺規範請見 `design-system/MASTER.md`（A「底片暗房」）。

## 已確定的決定

- **內容**：首頁單頁捲動，依序是開場 → 🎸 翻唱 → 🤖 AI 專案 → 📷 攝影 → 關於／聯絡。之後內容多了，再把翻唱、攝影拆成獨立頁。
- **AI 專案只放兩個**：記帳工具（money.shuns.site，GitHub `jason125457/old-account`）、Guitar 工具「指板靈感本」（guitar.chordy.site，GitHub `jason125457/guitar-idea-pad`）。私人 repo 不放 GitHub 連結。
- **技術**：Astro ＋ TypeScript，純靜態輸出，樣式用原生 CSS ＋ 設計 token（不另外裝 Tailwind／UI 套件，相依套件越少越好）。部署到 Cloudflare Workers 的靜態資產（免費、不綁卡），由 GitHub Actions 自動部署。
- **資料**：三個 YAML 清單檔，加上 Astro content collections 的 schema 驗證。少填欄位或網址格式錯誤時，build 會直接失敗，錯誤不會上線。

```
src/data/covers.yaml     # 曲名、原唱、YouTube 網址、日期、心得
src/data/projects.yaml   # 名稱、介紹、技術、網站、GitHub（選填）、截圖
src/data/photos.yaml     # IG 貼文網址、（選填）說明
```

## 階段

### 0. 資訊網搬家（在 `mywebsite` 做，可以和 1–3 同時進行）

照 HANDOFF 的步驟：改 `wrangler.jsonc`、`supabase/config.toml` → 開 PR → CI → 合併 → 確認 `feed.shuns.site` 能登入 → `www` 空出來。
另外要確認 `shuns.site`（apex）目前有沒有 DNS 紀錄擋著。

### 1. 專案骨架

- `npm create astro`（最小樣板）、TypeScript strict、ESLint、Prettier。
- 全站版型：`<head>` SEO 與 OG、字體載入、設計 token、深淺色切換（沒切過就跟隨系統；首屏前用一小段 inline script 套用，避免閃一下）、顆粒層、skip link、導覽列、頁尾。
- 完成標準：`npm run dev` 能在本機看到空白版型，淺色和深色都正常。

### 2. 資料檔與 schema ✅（2026-10-25）

- 結果：內建 `file()` loader 遇到壞 YAML 或缺 id 只會寫 log、build 照樣成功，所以改用自訂的嚴格 loader（`src/lib/yaml-loader.ts`）。翻唱、攝影目前是空清單；專案已填兩筆，介紹是依 README 寫的草稿。
- guitar 專案的網址：使用者決定用 `https://guitar.chordy.site`（repo 實際綁定的網域；`guitar.shuns.site` 目前連不上）。

- 三個 collection 的 zod schema；YouTube 網址解析出影片 ID 的小函式。
- 先放少量**標明是範例**的資料讓版面能跑，等你提供真資料再換掉。不會編造你的歌單或作品內容。
- 測試（Vitest）：YouTube ID 解析、schema 會擋下壞資料。

### 3. 各區塊 UI（進行中）

- ✅ 開場：三張拍立得同時當作目錄，目前用色塊加圖示，翻唱和攝影有內容後再換成真的縮圖。開場文案是草稿，請 Shun 確認。
- ✅ AI 專案：拍立得截圖（`src/assets/projects/`，用無頭 Edge 以 1280×800 截取，build 時轉成 WebP）、技術標籤、開啟網站／GitHub 按鈕。記帳儀表板截到的是 Demo 示範資料，不是真實帳目。
- 待做：翻唱、攝影、關於。

- **開場**：大標（Fraunces／思源宋體）＋一句自我介紹＋三張歪斜的拍立得縮圖，分別連到三個區塊。
- **翻唱**：卡片格狀列表；先只顯示 YouTube 預覽圖，點了才換成 `youtube-nocookie.com` 播放器。
- **AI 專案**：拍立得截圖＋介紹＋技術標籤＋連結。截圖我可以用瀏覽器幫你截，存成 WebP。
- **攝影**：IG 官方 embed，捲到附近才載入 `embed.js`；最後放「更多作品在 Instagram ↗」。
- **關於／聯絡**：一小段介紹＋IG、YouTube、GitHub 連結。
- 完成標準：375px、768px、1440px 三種寬度都正常，淺色和深色都正常。

### 4. 品質收尾

- 無障礙：對比、focus、鍵盤操作、`prefers-reduced-motion`。
- 效能：圖片 WebP 並標好寬高，第三方嵌入點了才載入。目標是 Lighthouse 四項都 ≥ 95。
- favicon、OG 分享圖、`sitemap.xml`、`robots.txt`、404 頁。

### 5. 部署

- 建立 GitHub repo `jason125457/shuns-site`（公開，可以當作品之一）。
- `wrangler.jsonc`：只放靜態資產，用 custom domain 綁 `shuns.site` 和 `www.shuns.site`。`www` 要等階段 0 完成才能綁。
- `.github/workflows/ci.yml`（PR 時跑 lint、型別檢查、測試、build）和 `deploy.yml`（推到 main 就部署）。repo secret `CLOUDFLARE_API_TOKEN` 由你自己貼。
- 完成標準：兩個網址都打得開，`www` 導到 apex（或反過來，二選一）。

## 需要你提供的內容（不急，階段 3 前給就好）

1. **翻唱清單**：YouTube 網址，每首附原唱、一兩句心得（日期我可以從 YouTube 抓）。
2. **IG**：帳號名稱，加上想嵌入的 3–9 篇貼文網址。
3. **自我介紹**：一兩句開場白，加上「關於」的一小段（也可以我先寫草稿給你改）。
4. **專案介紹**：我可以先讀兩個 repo 寫草稿，你再修改。
5. 想公開的聯絡方式（例如只放 IG／GitHub，不放 email）。

## 之後再做（不在這次範圍）

- 「我在讀什麼」：從資訊網的收藏挑一部分公開顯示。
- 週記：每週回顧轉成個人網站的文章。
- 攝影改成自己上傳精選照片（Cloudflare R2 或直接放在 repo）。
