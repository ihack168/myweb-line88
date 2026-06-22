"use client";
import { useEffect, useState } from "react";

export default function ClipPage() {
  const [msg, setMsg] = useState("載入中...");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/api/clip")
      .then((r) => r.json())
      .then((data) => {
        const text = data.content || "";
        setContent(text);
        return navigator.clipboard.writeText(text);
      })
      .then(() => setMsg("✅ 已複製！切回去貼上"))
      .catch(() => setMsg("⚠️ 請點下方按鈕手動複製"));
  }, []);

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
      }}>{content}</pre>
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
  );
}