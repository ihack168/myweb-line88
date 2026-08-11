"use client";

import { useEffect, useState } from "react";

type Person = {
  chineseLastName: string;
  chineseFirstName: string;
  englishLastName: string;
  englishFirstName: string;
  birthday: string;
};

const chineseLastNames = [
  "陳", "林", "黃", "張", "李", "王", "吳", "劉", "蔡", "楊",
  "許", "鄭", "謝", "郭", "洪", "曾", "邱", "廖", "賴", "徐",
  "周", "葉", "蘇", "江", "何", "羅", "高",
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
];

const englishLastNames = [
  "Chen", "Lin", "Huang", "Chang", "Lee", "Wang", "Wu", "Liu",
  "Tsai", "Yang", "Hsu", "Cheng", "Hsieh", "Kuo", "Hung", "Chou",
  "Yeh", "Su", "Chiang", "Ho", "Lo", "Kao",
];

const englishFirstNames = [
  "Alex", "Alice", "Amy", "Andy", "Anna", "Brian", "Chloe", "Daniel",
  "Emily", "Emma", "Eric", "Eva", "Grace", "Helen", "Ivy", "Jason",
  "Jessica", "Julia", "Kevin", "Laura", "Leo", "Linda", "Lisa", "Maria",
  "Mia", "Michelle", "Nina", "Nicole", "Olivia", "Rachel", "Ryan", "Sarah",
  "Sophia", "Sophie", "Tina", "Wendy", "Zoe",
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
  return {
    chineseLastName: pick(chineseLastNames),
    chineseFirstName: pick(chineseFirstNames),
    englishLastName: pick(englishLastNames),
    englishFirstName: pick(englishFirstNames),
    birthday: randomBirthday(),
  };
}

export default function Page() {
  const [person, setPerson] = useState<Person | null>(null);
  const [copied, setCopied] = useState<keyof Person | null>(null);

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

  const fields: Array<{ key: keyof Person; label: string }> = [
    { key: "chineseLastName", label: "中文姓" },
    { key: "chineseFirstName", label: "中文名" },
    { key: "englishLastName", label: "英文姓" },
    { key: "englishFirstName", label: "英文名" },
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

        <button
          className="refresh"
          type="button"
          disabled={!person}
          onClick={() => {
            setPerson(generatePerson());
            setCopied(null);
          }}
        >
          <span aria-hidden="true">↻</span>
          重新隨機產生
        </button>
      </section>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html), :global(body) { margin: 0; min-height: 100%; }
        :global(body) {
          color: #17201d;
          background: #edf3ef;
          font-family: Inter, "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif;
        }
        button { font: inherit; -webkit-tap-highlight-color: transparent; }
        .page {
          min-height: 100svh;
          display: grid;
          place-items: center;
          padding: clamp(12px, 3vw, 28px);
          background:
            radial-gradient(circle at 12% 5%, rgba(255,255,255,.95), transparent 35%),
            linear-gradient(145deg, #eef5f0 0%, #dce9e1 100%);
        }
        .card {
          width: min(100%, 560px);
          max-height: calc(100svh - 24px);
          overflow: auto;
          padding: clamp(18px, 4vh, 34px);
          border: 1px solid rgba(36, 86, 65, .13);
          border-radius: 26px;
          background: rgba(255, 255, 255, .92);
          box-shadow: 0 24px 70px rgba(35, 71, 56, .14);
        }
        header { margin-bottom: clamp(14px, 2.7vh, 24px); }
        .eyebrow {
          margin: 0 0 5px;
          color: #267251;
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
        .hint { margin: 6px 0 0; color: #708079; font-size: 12px; }
        .fields { display: grid; gap: clamp(7px, 1.2vh, 10px); }
        .field {
          min-height: clamp(58px, 9.2vh, 72px);
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 9px 9px 15px;
          border: 1px solid #dce7e1;
          border-radius: 16px;
          background: #f8fbf9;
        }
        .content { min-width: 0; flex: 1; display: grid; gap: 1px; }
        .label { color: #708079; font-size: 12px; font-weight: 700; }
        .value {
          overflow: hidden;
          color: #17201d;
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
          border-radius: 12px;
          color: #17603f;
          background: #dff1e7;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
        }
        .copy:active { transform: scale(.96); }
        .copy.copied { color: white; background: #247652; }
        .copy:disabled, .refresh:disabled { cursor: wait; opacity: .55; }
        .refresh {
          width: 100%;
          min-height: clamp(52px, 8vh, 60px);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-top: clamp(12px, 2.2vh, 20px);
          border: 0;
          border-radius: 16px;
          color: white;
          background: #1f6b49;
          box-shadow: 0 10px 24px rgba(31, 107, 73, .22);
          font-size: clamp(17px, 4.6vw, 20px);
          font-weight: 900;
          cursor: pointer;
        }
        .refresh span { font-size: 26px; line-height: 1; }
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
          .refresh { min-height: 48px; margin-top: 9px; }
        }
      `}</style>
    </main>
  );
}
