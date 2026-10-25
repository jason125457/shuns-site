# 個人網站 shuns.site — 交接說明

> 由「Personal Feed 資訊網」對話整理（2026-10-25）。新對話請先完整讀完本檔再動手。
> 使用者偏好：**一律用繁體中文回答**；所有服務必須**免費方案、不綁信用卡**。
> 全域規則（~/.claude/CLAUDE.md）：任何 UI/UX 設計工作，先用 `ui-ux-pro-max` skill 產生設計系統再實作。

## 目標

做一個作品集型個人網站，放在 `shuns.site`（apex）與 `www.shuns.site`，內容三塊：

| 區塊          | 已確定的做法                                                                                                                                                                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🎸 Cover 音樂 | 影片都在 **YouTube**。網站用嵌入播放器呈現，每首附曲名、原唱、日期、一兩句心得。資料寫在一個清單檔（不要把影音檔放進網站）。                                                                                                                  |
| 🤖 AI 專案    | **專案卡片**：截圖、一段介紹、用到的技術、連結（網站、GitHub）。已知可放的專案：Personal Feed（feed.shuns.site）、記帳工具（money.shuns.site）、資產工具（asset.shuns.site）、guitar.shuns.site。請向使用者確認要公開哪些、GitHub repo 網址。 |
| 📷 攝影集     | **先用嵌入 IG 貼文**（IG 官方 embed），並附「更多作品請看 IG」連結。之後可能改成自己上傳精選照片。                                                                                                                                            |

## 技術建議（已與使用者討論，可再確認）

- **Astro**（純靜態、免資料庫），部署到 **Cloudflare Workers 靜態資產**（免費）。
- 新開獨立資料夾 `G:\Claude\project\shuns-site`（就是本資料夾）與獨立 GitHub repo（使用者帳號 `jason125457`）。
- 設計：用 ui-ux-pro-max 產生**和資訊網不同**、更有個人特色的風格；做之前可問使用者有沒有參考網站。
- 可參考資訊網的 Cloudflare 自動部署做法：GitHub Actions `deploy.yml` + `CLOUDFLARE_API_TOKEN`（使用者已會建立 Cloudflare API token）。

## 網域規劃（使用者已同意）

| 網址                                              | 內容                                                           |
| ------------------------------------------------- | -------------------------------------------------------------- |
| `shuns.site`、`www.shuns.site`                    | 個人網站（本專案）                                             |
| `feed.shuns.site`                                 | Personal Feed 資訊網（**需從目前的 `www.shuns.site` 搬過去**） |
| `money`／`guitar`／`asset`／`asset-v2.shuns.site` | 其他既有工具，維持不動                                         |

### 資訊網搬家步驟（在 `G:\Claude\project\mywebsite` 做，順序很重要）

1. `wrangler.jsonc`：`routes` 改成 `feed.shuns.site`（custom_domain），`vars.APP_URL` 改成 `https://feed.shuns.site`。
2. `supabase/config.toml`：`site_url` 與 `additional_redirect_urls` 改成 `https://feed.shuns.site`，然後 `npx supabase config push`（先 `echo n |` 看差異，只應改這兩項）。
3. 走 PR → CI → 合併，GitHub Actions 會自動部署到 Cloudflare。
4. 確認 `https://feed.shuns.site` 正常、登入信連結回到新網址後，`www.shuns.site` 才空出來給個人網站。
   注意：Cloudflare 綁 custom domain 時，若該 hostname 已有手動 DNS 紀錄會失敗（之前 www 就遇過，由使用者手動刪除）。

## 可以「串」的點子（之後再做，非必要）

- 個人網站顯示「我在讀什麼」：從資訊網的收藏挑一部分公開顯示（需要在資訊網加「公開分享」標記與唯讀 API）。
- 每週回顧加上個人感想，轉成個人網站的週記。

## 環境備忘

- Cloudflare 帳號 ID：`43d3e4c226f1e127e68024d5ac6703e2`；`shuns.site` 的 zone 在這個帳號。wrangler 已用 OAuth 登入（若過期執行 `npx wrangler login`）。
- GitHub CLI `gh` 已登入 `jason125457`。
- 帳號目前用掉 2 個 Cloudflare Cron Trigger（myasset-v2）+ 1 個（personal-feed-scheduler），免費上限 5。
- 機密值（token、金鑰）一律讓使用者自己貼到終端機或後台，不要經手、不要寫進檔案。
