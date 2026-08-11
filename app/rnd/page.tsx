"use client";

import { useEffect, useState } from "react";

// 改成部署完成的 Google Apps Script Web App /exec 網址。
const GAS_URL = "請在這裡貼上你的GAS網址";

type Person = {
  chineseLastName: string;
  chineseFirstName: string;
  englishLastName: string;
  englishFirstName: string;
  id: string;
  birthday: string;
};

const chineseLastNames = [
  "陳", "林", "黃", "張", "李", "王", "吳", "劉", "蔡", "楊",
  "許", "鄭", "謝", "郭", "洪", "曾", "邱", "廖", "賴", "徐",
  "周", "葉", "蘇", "江", "何", "羅", "高", "潘", "簡", "朱",
  "鍾", "彭", "游", "詹", "胡", "施", "沈", "余", "趙", "盧",
  "梁", "顏", "柯",
];

const chineseFirstNames = [
  "怡君", "雅婷", "欣怡", "佩君", "佳穎", "子涵", "語涵", "詩涵",
  "品妤", "宜婷", "如婷", "恩婷", "庭婷", "文婷", "安婷", "美婷",
  "雅雯", "佩雯", "佳婷", "子瑜", "語晴", "詩婷", "品涵", "思婷",
  "家婷", "心婷", "可婷", "佳雯", "怡婷", "欣妤", "雅君", "美君",
  "淑芬", "淑惠", "美玲", "麗華", "玉婷", "秀英", "秀美", "慧君",
  "佳慧", "雅惠", "惠君", "心怡", "佳怡", "思涵", "雨晴", "子晴",
  "冠宇", "家豪", "俊傑", "志明", "建宏", "明哲", "文傑", "宗翰",
  "宇翔", "柏翰", "承恩", "彥廷", "威廷", "家瑋", "志豪", "俊宏",
  "建志", "文豪", "世傑", "明軒", "冠廷", "志偉", "家銘", "俊豪",
  "雅琪", "雅慧", "雅玲", "雅芳", "雅萍", "怡萱", "怡婷", "怡芳",
  "怡安", "怡如", "佳玲", "佳蓉", "佳琪", "佳欣", "佳恩", "佳芸",
  "欣妍", "欣慧", "欣蓉", "欣芳", "欣雅", "欣宜", "欣如", "欣安",
  "佩珊", "佩玲", "佩琪", "佩芳", "佩蓉", "佩宜", "佩欣", "佩如",
  "美慧", "美芳", "美華", "美惠", "美珠", "美雪", "美玉", "美如",
  "淑娟", "淑華", "淑玲", "淑芳", "淑貞", "淑美", "淑敏", "淑蘭",
  "秀玲", "秀娟", "秀華", "秀芬", "秀惠", "秀蘭", "秀珍", "秀琴",
  "慧玲", "慧婷", "慧芳", "慧珍", "慧如", "慧萍", "慧雯", "慧心",
  "心如", "心雅", "心惠", "心瑜", "心雯", "心安", "心晴", "心柔",
  "雨婷", "雨涵", "雨欣", "雨萱", "雨潔", "雨柔", "雨薇", "雨安",
  "子怡", "子安", "子萱", "子瑜", "子晴", "子欣", "子芸", "子柔",
  "思怡", "思婷", "思妤", "思慧", "思晴", "思安", "思雅", "思潔",
  "文婷", "文君", "文慧", "文玲", "文欣", "文雅", "文芳", "文琪",
  "家明", "家俊", "家宏", "家維", "家安", "家榮", "家偉", "家祥",
  "俊明", "俊宇", "俊廷", "俊安", "俊賢", "俊維", "俊翔", "俊銘",
  "志宏", "志偉", "志豪", "志傑", "志成", "志文", "志強", "志遠",
  "建明", "建成", "建豪", "建宇", "建廷", "建安", "建文", "建榮",
  "冠廷", "冠宇", "冠豪", "冠霖", "冠宏", "冠傑", "冠翔", "冠維",
  "宇豪", "宇傑", "宇廷", "宇宏", "宇成", "宇安", "宇軒", "宇辰",
  "承翰", "承宇", "承恩", "承志", "承廷", "承宏", "承安", "承傑",
  "柏宇", "柏廷", "柏豪", "柏宏", "柏安", "柏成", "柏維", "柏霖",
  "明志", "明宏", "明傑", "明德", "明輝", "明成", "明安", "明賢",
];

const englishLastNames = [
  "Chen", "Lin", "Huang", "Chang", "Lee", "Wang", "Wu", "Liu",
  "Tsai", "Yang", "Hsu", "Cheng", "Hsieh", "Kuo", "Hung", "Chou",
  "Yeh", "Su", "Chiang", "Ho", "Lo", "Kao", "Pan", "Chien",
  "Chu", "Chung", "Peng", "Yu", "Chan", "Hu", "Shih", "Shen",
  "Chao", "Lu", "Liang", "Yen", "Ko", "Sun",
];

const englishFirstNames = [
  "Alex", "Alice", "Amy", "Andy", "Anna", "Brian", "Chloe", "Daniel",
  "Emily", "Emma", "Eric", "Eva", "Grace", "Helen", "Ivy", "Jason",
  "Jessica", "Julia", "Kevin", "Laura", "Leo", "Linda", "Lisa", "Maria",
  "Mia", "Michelle", "Nina", "Nicole", "Olivia", "Rachel", "Ryan", "Sarah",
  "Sophia", "Sophie", "Tina", "Wendy", "Zoe", "Aaron", "Adam", "Alan",
  "Amanda", "Amber", "Angela", "Ben", "Betty", "Bruce", "Carol", "Cindy",
  "Claire", "David", "Diana", "Edward", "Ella", "Ethan", "George", "Henry",
  "Jack", "James", "Jane", "Jenny", "John", "Justin", "Kelly", "Ken",
  "Linda", "Mark", "Mary", "Matt", "Megan", "Michael", "Nancy", "Peter",
  "Rebecca", "Robert", "Sam", "Steven", "Susan", "Thomas", "Tony", "Vicky",
  "Vincent", "William", "Wilson", "Yvonne",
];

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomBirthday(): string {
  // 直接從有效日期區間抽一天，不會產生 20058888 之類的無效日期。
  const start = Date.UTC(2001, 0, 1);
  const end = Date.UTC(2008, 7, 1);
  const day = 24 * 60 * 60 * 1000;
  const totalDays = Math.floor((end - start) / day);
  const date = new Date(start + Math.floor(Math.random() * (totalDays + 1)) * day);

  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("");
}

function generatePerson(): Person {
  const englishLastName = pick(englishLastNames);
  const englishFirstName = pick(englishFirstNames);

  return {
    chineseLastName: pick(chineseLastNames),
    chineseFirstName: pick(chineseFirstNames),
    englishLastName,
    englishFirstName,
    id: englishFirstName + englishLastName,
    birthday: randomBirthday(),
  };
}

export default function Page() {
  const [person, setPerson] = useState<Person | null>(null);
  const [copied, setCopied] = useState<keyof Person | null>(null);
  const [recordStatus, setRecordStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    setPerson(generatePerson());
  }, []);

  async function copyValue(key: keyof Person, value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const input = document.createElement("textarea");
      input.value = value;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }

    setCopied(key);
    window.setTimeout(() => setCopied(null), 900);
  }

  async function recordPerson() {
    if (!person || recordStatus === "saving") return;

    const recordValue = (
      person.englishFirstName +
      person.englishLastName +
      person.birthday
    ).toLowerCase();

    try {
      setRecordStatus("saving");

      if (!GAS_URL.startsWith("https://script.google.com/macros/s/")) {
        throw new Error("尚未設定 GAS_URL");
      }

      const url = new URL(GAS_URL);
      url.searchParams.set("action", "recordPersonalData");
      url.searchParams.set("value", recordValue);

      // GAS Web App 是跨網域服務；no-cors 可避免瀏覽器擋下送出請求。
      await fetch(url.toString(), {
        method: "GET",
        mode: "no-cors",
        cache: "no-store",
      });

      setRecordStatus("saved");
      window.setTimeout(() => setRecordStatus("idle"), 1600);
    } catch (error) {
      console.error(error);
      setRecordStatus("error");
      window.setTimeout(() => setRecordStatus("idle"), 2200);
    }
  }

  const fields: Array<{ key: keyof Person; label: string }> = [
    { key: "chineseLastName", label: "中文姓" },
    { key: "chineseFirstName", label: "中文名" },
    { key: "englishLastName", label: "英文姓" },
    { key: "englishFirstName", label: "英文名" },
    { key: "id", label: "id" },
    { key: "birthday", label: "生日" },
  ];

  return (
    <main className="page">
      <section className="card" aria-labelledby="page-title">
        <header>
          <p className="eyebrow">RANDOM PROFILE</p>
          <h1 id="page-title">隨機個資產生器</h1>
          <p className="hint">生日範圍 2001/01/01～2008/08/01</p>
        </header>

        <div className="fields" aria-live="polite">
          {fields.map(({ key, label }) => {
            const value = person?.[key] ?? "—";
            return (
              <div className="field" key={key}>
                <div className="content">
                  <span className="label">{label}</span>
                  <strong className={key === "birthday" ? "value numeric" : "value"}>
                    {value}
                  </strong>
                </div>
                <button
                  className={copied === key ? "copy copied" : "copy"}
                  type="button"
                  disabled={!person}
                  onClick={() => copyValue(key, value)}
                >
                  {copied === key ? "已複製" : "複製"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="actions">
          <button
            className="record"
            type="button"
            disabled={!person || recordStatus === "saving"}
            onClick={recordPerson}
          >
            {recordStatus === "saving" && "記錄中…"}
            {recordStatus === "saved" && "已送出"}
            {recordStatus === "error" && "記錄失敗"}
            {recordStatus === "idle" && "幫我記錄"}
          </button>

          <button
            className="refresh"
            type="button"
            disabled={!person}
            onClick={() => {
              setPerson(generatePerson());
              setCopied(null);
              setRecordStatus("idle");
            }}
          >
            <span aria-hidden="true">↻</span>
            重新隨機產生
          </button>
        </div>
      </section>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html), :global(body) { margin: 0; min-height: 100%; }
        :global(body) {
          color: #f5f5f5;
          background: #0a0a0a;
          font-family: "Noto Sans TC", Geist, "PingFang TC", "Microsoft JhengHei", sans-serif;
        }
        button { font: inherit; -webkit-tap-highlight-color: transparent; }
        .page {
          min-height: 100svh;
          display: grid;
          place-items: center;
          padding: clamp(12px, 3vw, 28px);
          background:
            radial-gradient(circle at 15% 0%, rgba(232, 101, 10, .12), transparent 34%),
            radial-gradient(circle at 88% 100%, rgba(249, 115, 22, .07), transparent 32%),
            #0a0a0a;
        }
        .card {
          width: min(100%, 560px);
          max-height: calc(100svh - 24px);
          overflow: auto;
          padding: clamp(18px, 4vh, 34px);
          border: 1px solid #2a2a2a;
          border-radius: 1.025rem;
          background: rgba(20, 20, 20, .96);
          box-shadow: 0 24px 70px rgba(0, 0, 0, .48);
        }
        header { margin-bottom: clamp(14px, 2.7vh, 24px); }
        .eyebrow {
          margin: 0 0 5px;
          color: #e8650a;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .18em;
        }
        h1 {
          margin: 0;
          font-size: clamp(26px, 7vw, 38px);
          line-height: 1.12;
          letter-spacing: -.04em;
        }
        .hint { margin: 6px 0 0; color: #a3a3a3; font-size: 12px; }
        .fields { display: grid; gap: clamp(7px, 1.2vh, 10px); }
        .field {
          min-height: clamp(58px, 9.2vh, 72px);
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 9px 9px 15px;
          border: 1px solid #2a2a2a;
          border-radius: .625rem;
          background: #1a1a1a;
        }
        .content { min-width: 0; flex: 1; display: grid; gap: 1px; }
        .label { color: #a3a3a3; font-size: 12px; font-weight: 700; }
        .value {
          overflow: hidden;
          color: #f5f5f5;
          font-size: clamp(23px, 6.5vw, 32px);
          line-height: 1.08;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .numeric { font-variant-numeric: tabular-nums; letter-spacing: .035em; }
        .copy {
          flex: 0 0 auto;
          min-width: 66px;
          min-height: 42px;
          border: 0;
          border: 1px solid #3a3a3a;
          border-radius: .625rem;
          color: #f5f5f5;
          background: #262626;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
        }
        .copy:active { transform: scale(.96); }
        .copy:hover { border-color: #e8650a; color: #fb923c; }
        .copy.copied { border-color: #e8650a; color: white; background: #e8650a; }
        .copy:disabled, .record:disabled, .refresh:disabled { cursor: wait; opacity: .55; }
        .actions {
          display: grid;
          grid-template-columns: minmax(0, .78fr) minmax(0, 1.22fr);
          gap: 9px;
          margin-top: clamp(12px, 2.2vh, 20px);
        }
        .record, .refresh {
          width: 100%;
          min-height: clamp(52px, 8vh, 60px);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 0;
          border-radius: .625rem;
          color: white;
          font-size: clamp(17px, 4.6vw, 20px);
          font-weight: 900;
          cursor: pointer;
        }
        .record {
          border: 1px solid #e8650a;
          color: #fb923c;
          background: #1a1a1a;
        }
        .refresh {
          background: #e8650a;
          box-shadow: 0 10px 28px rgba(232, 101, 10, .25);
        }
        .refresh span { font-size: 26px; line-height: 1; }
        .record:hover { color: white; background: #c65308; }
        .refresh:hover { background: #f97316; }
        .refresh:focus-visible, .record:focus-visible, .copy:focus-visible {
          outline: 3px solid rgba(232, 101, 10, .42);
          outline-offset: 2px;
        }
        .refresh:active { transform: translateY(1px); box-shadow: none; }

        @media (max-height: 680px) {
          .card { padding: 14px; border-radius: 20px; }
          header { margin-bottom: 10px; }
          .eyebrow, .hint { display: none; }
          h1 { font-size: 25px; }
          .fields { gap: 6px; }
          .field { min-height: 51px; padding-block: 6px; }
          .value { font-size: 22px; }
          .copy { min-height: 38px; }
          .actions { margin-top: 9px; }
          .record, .refresh { min-height: 48px; font-size: 16px; }
        }

        @media (max-width: 390px) {
          .actions { grid-template-columns: 1fr 1.25fr; }
          .record, .refresh { font-size: 15px; }
          .refresh { gap: 5px; }
        }
      `}</style>
    </main>
  );
}
