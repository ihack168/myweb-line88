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
        setContent(data.post);
        await navigator.clipboard.writeText(data.post);
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
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      fontFamily: "sans-serif",
      padding: 40,
      textAlign: "center",
      color: "#ffffff",
    }}>
      <div style={{ fontSize: 28, marginBottom: 8, fontWeight: "bold" }}>
        📋 剪貼簿助手
      </div>
      <div style={{
        fontSize: 18,
        marginBottom: 24,
        color: msg.startsWith("✅") ? "#4ade80" : msg.startsWith("❌") ? "#f87171" : "#facc15",
      }}>
        {msg}
      </div>

      {/* 按鈕區塊固定在上面 */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 32 }}>
        <button
          onClick={handleGenerate}
          disabled={generating}
          style={{
            background: generating ? "#333" : "#1d4ed8",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 32px",
            fontSize: 16,
            cursor: generating ? "not-allowed" : "pointer",
            opacity: generating ? 0.6 : 1,
            transition: "all 0.2s",
          }}
        >
          {generating ? "產生中..." : "產生測試貼文"}
        </button>
        <button
          onClick={handleCopy}
          style={{
            background: "#ff8800",
            color: "#000",
            border: "none",
            borderRadius: 8,
            padding: "12px 32px",
            fontSize: 16,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          重新複製
        </button>
      </div>

      {/* 內容框在下面 */}
      <pre style={{
        background: "#1a1a1a",
        border: "1px solid #333",
        padding: 20,
        borderRadius: 12,
        textAlign: "left",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        fontSize: 15,
        lineHeight: 1.7,
        color: "#e5e5e5",
        maxWidth: 640,
        margin: "0 auto",
      }}>{content || "（尚無內容）"}</pre>
    </div>
  );
}