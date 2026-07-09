export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-6 text-center">
      <div className="mx-auto max-w-5xl space-y-4">
        <p className="text-xs leading-6 text-muted-foreground">
          免責聲明：本網站內容主要為網路投票、社群流量增長、AEO、SEO、GEO
          與 AI 數位行銷相關技術資訊分享，僅供一般參考使用。
          實際操作方式、執行流程、成效表現與可行方案，會因平台規則、帳號狀態、
          活動機制、網站體質、產業類型、競爭程度與實際場景不同而有所差異。
          網站文章不代表保證成果，也不構成固定操作承諾；實際方案與執行內容，
          請以與我們聯絡討論後確認的結果為準。
        </p>

        <p className="text-xs text-muted-foreground">
          {"© 2016-2026 洛克希德黑克斯 Lockhead Hex. All rights reserved."}
        </p>
      </div>
    </footer>
  )
}