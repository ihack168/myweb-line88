"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Calendar, ArrowRight, BookOpen, PlayCircle, ChevronLeft, ChevronRight, Tag } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setPlayingId(null);
      try {
        const response = await fetch(`/api/blog?page=${currentPage}`);
        if (!response.ok) throw new Error("Fetch failed");
        const result = await response.json();
        
        const entry = result.feed?.entry || [];
        setTotalPages(result.pagination?.totalPages || 1);
        
        const formattedPosts = entry.map((item: any) => {
          const rawContent = item.summary?.$t || item.content?.$t || "";
          
          // 1. 提取 YouTube ID
          const youtubeMatch = rawContent.match(/youtube\.com\/embed\/([^"?\s]+)/);
          const videoId = youtubeMatch ? youtubeMatch[1] : null;

          // 2. 提取第一張圖片
          const imageMatch = rawContent.match(/<img[^>]+src="([^">]+)"/);
          const firstImgUrl = imageMatch ? imageMatch[1] : null;

          // 3. 提取標籤 (Blogger Tags)
          const categories = item.category ? item.category.map((cat: any) => cat.term) : [];
          
          // 4. 超強力內容清理
          let cleanSummary = rawContent
            .replace(/<script([\s\S]*?)<\/script>/gi, "") 
            .replace(/<style([\s\S]*?)<\/style>/gi, "")   
            .replace(/\{[\s\S]*?\}/g, "")                 
            .replace(/<[^>]*>/g, "")                      
            .replace(/&nbsp;/g, " ")                      
            .replace(/\s+/g, " ")                         
            .trim();

          // ✨ 網域邏輯修正
          const originalLink = item.link.find((l: any) => l.rel === "alternate")?.href || "";
          // 強制將文章連結導向新子網域 blog.line88.tw
          const finalLink = originalLink.replace("www.line88.tw", "blog.line88.tw");
          // 標籤連結的基礎網域
          const blogBaseUrl = "https://blog.line88.tw";

          const finalThumbnail = videoId 
            ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` 
            : firstImgUrl;

          return {
            id: item.id.$t,
            title: item.title.$t,
            link: finalLink,
            blogBaseUrl: blogBaseUrl,
            date: new Date(item.published.$t).toLocaleDateString(),
            summary: cleanSummary.substring(0, 110),
            videoId: videoId,
            thumbnailUrl: finalThumbnail,
            tags: categories.slice(0, 3) 
          };
        });
        
        setPosts(formattedPosts);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error("Error loading blog posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`w-10 h-10 rounded-full border transition-all duration-300 font-mono ${
            currentPage === i
              ? "bg-[#ff4500] border-[#ff4500] text-white shadow-lg shadow-[#ff4500]/20"
              : "bg-transparent border-white/10 text-gray-400 hover:border-[#ff4500] hover:text-[#ff4500]"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ff4500]/30">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-16 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center md:justify-start">
              <BookOpen className="mr-4 text-[#ff4500] w-10 h-10" /> 
              最新文章
            </h1>
            <div className="h-1.5 w-24 bg-[#ff4500] mx-auto md:mx-0 rounded-full"></div>
            <p className="mt-6 text-gray-400 text-lg">掌握我們最新資訊，強化數據影響力</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="w-12 h-12 border-4 border-[#ff4500]/20 border-t-[#ff4500] rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 font-mono tracking-widest uppercase text-xs">Loading Data...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-12">
                {posts.length > 0 ? (
                  posts.map((post: any) => (
                    <article key={post.id} className="group bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-[#ff4500]/40 transition-all duration-500 shadow-2xl">
                      <div className="flex flex-col md:flex-row">
                        
                        {/* 圖片/影片 區域 */}
                        {post.thumbnailUrl && (
                          <div className="relative w-full md:w-