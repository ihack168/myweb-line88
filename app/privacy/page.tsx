import type { Metadata } from "next";

const SITE_URL = "https://www.line88.tw";

const PAGE_TITLE = "隱私權政策｜洛克希德黑克斯";

const PAGE_DESCRIPTION =
  "洛克希德黑克斯網站隱私權政策，說明本網站蒐集、處理及使用訪客資料的方式，以及第三方分析、Cookie 與聯絡服務的相關規範。";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,

  alternates: {
    canonical: "/privacy",
  },

  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/privacy`,
    siteName: "洛克希德黑克斯",
    locale: "zh_TW",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },

  robots: {
    index: true,
    follow: true,
  },
};

const sections = [
  {
    id: "scope",
    title: "一、適用範圍",
    content: (
      <>
        <p>
          本隱私權政策適用於洛克希德黑克斯網站（以下簡稱「本網站」）
          在您瀏覽、使用網站內容或透過網站聯絡我們時，所涉及的個人資料蒐集、
          處理及使用方式。
        </p>

        <p>
          本政策不適用於經由本網站連結前往的第三方網站、平台或服務。
          第三方服務將依其各自的隱私權政策處理資料，建議您在使用前自行閱讀相關規範。
        </p>
      </>
    ),
  },
  {
    id: "collection",
    title: "二、可能蒐集的資料",
    content: (
      <>
        <p>
          一般瀏覽本網站時，我們不會主動要求您提供姓名、身分證字號、
          金融帳戶或其他高度敏感的個人資料。
        </p>

        <p>依您的使用方式，本網站可能取得以下資料：</p>

        <ul>
          <li>
            <strong>網站瀏覽資料：</strong>
            瀏覽頁面、造訪時間、停留時間、來源網站、點擊紀錄及工作階段資訊。
          </li>

          <li>
            <strong>裝置與技術資料：</strong>
            IP 位址、瀏覽器類型、作業系統、裝置類型、螢幕尺寸、
            語言設定及概略地理位置。
          </li>

          <li>
            <strong>聯絡資料：</strong>
            當您主動透過 Email、LINE、Facebook
            或其他管道聯絡我們時，可能提供的姓名、帳號名稱、Email、
            聯絡方式及需求內容。
          </li>

          <li>
            <strong>服務需求資料：</strong>
            您主動提供的活動網址、網站資訊、社群帳號、服務需求、
            預算、執行期限或其他合作相關內容。
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "purpose",
    title: "三、資料使用目的",
    content: (
      <>
        <p>本網站可能基於下列目的處理及使用資料：</p>

        <ul>
          <li>提供網站內容與維持網站正常運作。</li>
          <li>分析網站流量、訪客來源與內容使用情況。</li>
          <li>改善網站速度、資訊架構、使用體驗與內容品質。</li>
          <li>回覆您提出的問題、服務需求或合作詢問。</li>
          <li>評估需求、提供報價、安排服務與進行必要聯繫。</li>
          <li>偵測異常流量、惡意行為、濫用及資訊安全事件。</li>
          <li>履行法律義務、處理爭議或保護合法權益。</li>
        </ul>

        <p>
          我們不會將您主動提供的個人聯絡資料出售給第三方，
          也不會在與原始蒐集目的無關的情況下任意使用。
        </p>
      </>
    ),
  },
  {
    id: "analytics",
    title: "四、網站分析與第三方服務",
    content: (
      <>
        <p>
          為了解網站使用情況、改善內容與維持服務品質，
          本網站可能使用下列第三方分析及基礎設施服務：
        </p>

        <div className="space-y-5">
          <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <h3 className="text-lg font-black text-white">
              Google Analytics
            </h3>

            <p className="mt-3">
              本網站使用 Google Analytics
              分析流量與使用行為。該服務可能蒐集使用者數量、工作階段、
              概略地理位置、瀏覽器、裝置資訊及頁面互動資料，
              並依 Google 的服務條款與隱私權政策進行處理。
            </p>

            <p className="mt-3">
              您可以調整瀏覽器的 Cookie 設定，或使用 Google 提供的
              Analytics 停用瀏覽器外掛，限制相關資料傳送。
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <h3 className="text-lg font-black text-white">Umami Analytics</h3>

            <p className="mt-3">
              本網站可能使用 Umami
              統計網站瀏覽量、來源、頁面及裝置等彙整資訊。
              Umami 為隱私導向的流量分析工具，標準設定通常不使用 Cookie，
              並以匿名或彙整方式提供網站使用分析。
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <h3 className="text-lg font-black text-white">
              Cloudflare Web Analytics
            </h3>

            <p className="mt-3">
              本網站可能使用 Cloudflare Web Analytics
              分析網頁效能、載入速度、流量與使用情況。
              Cloudflare 表示其 Web Analytics
              以隱私為核心，不使用傳統跨站追蹤方式，
              並蒐集提供效能分析所需的最低限度資料。
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <h3 className="text-lg font-black text-white">
              Vercel、Sanity 與網站基礎服務
            </h3>

            <p className="mt-3">
              本網站可能使用 Vercel 提供網站部署與內容傳輸服務，
              並使用 Sanity 作為網站內容管理與圖片儲存服務。
              在提供網站內容、處理請求與維護安全的過程中，
              相關服務可能產生必要的伺服器紀錄、請求資訊及技術資料。
            </p>
          </article>
        </div>
      </>
    ),
  },
  {
    id: "cookies",
    title: "五、Cookie 與類似技術",
    content: (
      <>
        <p>
          Cookie
          是網站儲存在使用者裝置上的小型資料檔案，可用於維持功能、
          記錄設定、分析流量或改善使用體驗。
        </p>

        <p>
          本網站或第三方服務可能使用必要性 Cookie、流量分析 Cookie
          或其他類似技術。您可以透過瀏覽器設定封鎖、限制或刪除 Cookie，
          但部分網站功能、偏好設定或統計結果可能因此受到影響。
        </p>

        <p>
          Umami 與 Cloudflare Web Analytics
          的標準分析功能通常不依賴傳統 Cookie；但實際資料處理方式，
          仍可能隨服務商的功能、設定及政策調整而改變。
        </p>
      </>
    ),
  },
  {
    id: "contact-services",
    title: "六、LINE、Email 與社群平台",
    content: (
      <>
        <p>
          當您點擊本網站的 LINE、Email、Facebook
          或其他第三方平台連結後，您將進入該平台提供的服務環境。
        </p>

        <p>
          您透過第三方平台提供的帳號資料、訊息、聯絡方式及其他內容，
          除了可能由我們為回覆需求而使用，也會受到該平台本身的隱私權政策、
          資料保存及安全措施規範。
        </p>

        <p>
          請避免透過一般訊息傳送帳號密碼、信用卡號、身分證影本、
          驗證碼或其他非必要的敏感資料。
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "七、資料提供與揭露",
    content: (
      <>
        <p>
          除下列情況外，我們不會任意出售、交換、出租或揭露您提供的個人資料：
        </p>

        <ul>
          <li>已取得您的同意或依您的要求進行。</li>
          <li>為完成您委託的服務，必須由合作服務商協助處理。</li>
          <li>為維護網站安全、偵測詐欺、濫用或技術問題所必要。</li>
          <li>依法令、法院命令或主管機關合法要求必須提供。</li>
          <li>為保護本網站、使用者或第三人的生命、財產及合法權益。</li>
        </ul>

        <p>
          如需由合作服務商協助處理資料，我們將盡可能限制其使用範圍，
          使其僅能在完成受託事項所必要的程度內處理資料。
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "八、資料保存期間",
    content: (
      <>
        <p>
          個人資料將於完成蒐集目的、履行合作事項、處理爭議、
          符合法令要求及維護合法權益所需的期間內保存。
        </p>

        <p>
          保存期限屆滿或資料已無繼續使用必要時，
          我們將視資料型態採取刪除、匿名化、停止使用或其他合理處理方式。
        </p>

        <p>
          第三方分析、主機、社群或通訊平台所保存的資料，
          將依各服務商的資料保留設定與隱私權政策處理。
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "九、資料安全",
    content: (
      <>
        <p>
          我們會採取合理的技術及管理措施，降低個人資料遭到未經授權存取、
          洩漏、竄改、遺失或破壞的風險。
        </p>

        <p>
          然而，網際網路傳輸與電子儲存方式無法保證絕對安全。
          使用者仍應妥善保管自己的裝置、帳號、密碼及驗證資訊，
          並避免在不安全的網路環境中傳送敏感資料。
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "十、您的資料權利",
    content: (
      <>
        <p>
          依適用法令，對於您主動提供且由我們持有的個人資料，
          您可以聯絡我們提出下列要求：
        </p>

        <ul>
          <li>查詢或請求閱覽個人資料。</li>
          <li>請求提供個人資料副本。</li>
          <li>請求補充或更正不完整、不正確的資料。</li>
          <li>請求停止蒐集、處理或使用個人資料。</li>
          <li>請求刪除個人資料。</li>
        </ul>

        <p>
          為避免資料遭冒用或不當刪除，我們可能在處理請求前，
          要求您提供合理資料以確認身分。若依法令、契約、爭議處理、
          資訊安全或其他合法理由需要繼續保存資料，
          部分請求可能無法立即或完整執行。
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "十一、未成年人隱私",
    content: (
      <>
        <p>
          本網站主要提供一般網路行銷、網站技術與商業服務資訊，
          並非以未成年人為主要服務對象。
        </p>

        <p>
          未成年人如需提供個人資料或委託服務，
          應先取得法定代理人或監護人的同意。
          若我們得知在未經適當同意的情況下取得未成年人資料，
          將在合理範圍內進行刪除或停止使用。
        </p>
      </>
    ),
  },
  {
    id: "external-links",
    title: "十二、第三方網站與外部連結",
    content: (
      <>
        <p>
          本網站文章或服務頁可能包含第三方網站、社群平台、
          官方文件或其他外部資源連結。
        </p>

        <p>
          第三方網站並非由我們控制，其內容、安全性、Cookie
          使用及個人資料處理方式，應以該網站自己的條款與隱私權政策為準。
          本政策不適用於第三方網站。
        </p>
      </>
    ),
  },
  {
    id: "updates",
    title: "十三、政策更新",
    content: (
      <>
        <p>
          我們可能因網站功能、使用工具、服務內容或法令變更，
          不定期修訂本隱私權政策。
        </p>

        <p>
          更新後的內容將公布於本頁，並於頁面標示最後更新日期。
          如有重大變更，我們可能視情況以網站公告或其他適當方式說明。
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "十四、聯絡方式",
    content: (
      <>
        <p>
          若您對本隱私權政策、個人資料使用方式或資料權利有任何問題，
          可以透過以下方式與我們聯絡：
        </p>

        <div className="rounded-2xl border border-[#ff8800]/30 bg-[#ff8800]/[0.07] p-5">
          <p>
            <strong className="text-white">網站名稱：</strong>
            洛克希德黑克斯
          </p>

          <p className="mt-2">
            <strong className="text-white">網站網址：</strong>
            <a
              href="https://www.line88.tw"
              className="text-[#ff8800] underline underline-offset-4"
            >
              https://www.line88.tw
            </a>
          </p>

          <p className="mt-2">
            <strong className="text-white">聯絡信箱：</strong>
            <a
              href="mailto:ihack168@gmail.com"
              className="text-[#ff8800] underline underline-offset-4"
            >
              ihack168@gmail.com
            </a>
          </p>

          <p className="mt-2">
            <strong className="text-white">LINE：</strong>
            <a
              href="https://line.me/R/ti/p/~line88.tw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff8800] underline underline-offset-4"
            >
              line88.tw
            </a>
          </p>
        </div>
      </>
    ),
  },
];

export default function PrivacyPage() {
  const privacyJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/privacy/#webpage`,
    url: `${SITE_URL}/privacy`,
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    inLanguage: "zh-Hant",
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    about: {
      "@id": `${SITE_URL}/#organization`,
    },
    dateModified: "2026-07-13",
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-5 pb-24 pt-32 text-white md:px-6 md:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(privacyJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-5xl">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#ff8800] md:text-sm">
            PRIVACY POLICY
          </p>

          <h1 className="mt-4 text-3xl font-black text-white md:text-5xl">
            隱私權政策
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-gray-300">
            洛克希德黑克斯重視使用者的隱私與個人資料安全。
            本政策說明您瀏覽本網站或主動與我們聯絡時，
            我們可能取得哪些資料、使用目的，以及您可以行使的權利。
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
            <span>生效日期：2026 年 7 月 13 日</span>
            <span>最後更新：2026 年 7 月 13 日</span>
          </div>
        </header>

        <nav
          aria-label="隱私權政策目錄"
          className="mt-10 rounded-3xl border border-white/10 bg-white/[0.045] p-6"
        >
          <h2 className="text-lg font-black text-white">政策目錄</h2>

          <ol className="mt-5 grid gap-3 text-sm md:grid-cols-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-gray-400 transition hover:text-[#ff8800]"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 space-y-6">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur md:p-8"
            >
              <h2
                id={`${section.id}-title`}
                className="text-xl font-black text-[#ff8800] md:text-2xl"
              >
                {section.title}
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-8 text-gray-300 md:text-base [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-bold">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-10 text-center text-xs leading-6 text-gray-600">
          本政策為本網站一般資料處理情況的說明，不構成針對特定個案的法律意見。
        </p>
      </div>
    </main>
  );
}
