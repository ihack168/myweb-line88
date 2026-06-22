"use client";
import { useEffect, useState } from "react";

export default function ClipPage() {
  const [msg, setMsg] = useState("載入中...");
  const [content, setContent] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchAndCopy();
  }, []);

  const fetchAndCopy = () => {
    fetch("/api/clip")
      .then((r) => r.json())
      .then((data) => {
        const text = data.content || "";
        setContent(text);
        if (!text) {
          setMsg("⚠️ 尚無內容，請先產生");
          return;
        }
        return navigator.clipboard.writeText(text);
      })
      .then((r) => {
        if (r !== undefined) setMsg("✅ 已複製！切回去貼上");
      })
      .catch(() => setMsg("⚠️ 請點下方按鈕手動複製"));
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setMsg("產生中...");
    try {
      const res = await fetch("/api/socialmedia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: "LINE行銷",
          sourceText: "LINE是台灣最多人使用的通訊軟體，適合做社群行銷。",
          platform: "fb",
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setContent(data.fullPost);
        await navigator.clipboard.writeText(data.fullPost);
        setMsg("✅ 已產生並複製！切回去貼上");
      } else {
        setMsg("❌ 產生失敗：" + data.error);
      }
    } catch (e) {
      setMsg("❌ 錯誤：" + String(e));
    }
    setGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setMsg("✅ 已複製！切回去貼上");
    });
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 40, textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 24 }}>{msg}</div>
      <pre style={{
        background: "#f5f5f5",
        padding: 20,
        borderRadius: 8,
        textAlign: "left",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        fontSize: 16,
        marginBottom: 24,
        maxWidth: 600,
        margin: "0 auto 24px",
      }}>{content || "（尚無內容）"}</pre>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button
          onClick={handleGenerate}
          disabled={generating}
          style={{
            background: "#0066cc",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 32px",
            fontSize: 18,
            cursor: generating ? "not-allowed" : "pointer",
            opacity: generating ? 0.6 : 1,
          }}
        >
          {generating ? "產生中..." : "產生測試貼文"}
        </button>
        <button
          onClick={handleCopy}
          style={{
            background: "#ff8800",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 32px",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          重新複製
        </button>
      </div>
    </div>
  );
}