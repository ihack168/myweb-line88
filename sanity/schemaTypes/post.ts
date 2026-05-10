import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
    }),
    // --- 新增：外部圖片網址欄位 ---
    defineField({
      name: 'imageUrl',
      title: 'External Image URL (外部圖片網址)',
      type: 'url',
      description: '直接貼上外部網站的圖片連結 (例如 https://...)，這將作為列表頁的封面圖。',
    }),
    // 原有的 Sanity 上傳圖片欄位（保留備用）
    defineField({
      name: 'mainImage',
      title: 'Main image (Sanity Upload)',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: 'Body (Standard Editor)',
      type: 'blockContent',
    }),
    // --- HTML 專用欄位 ---
    defineField({
      name: 'htmlContent',
      title: 'HTML Content (Excel Auto-post)',
      type: 'text',
      description: '這裡是存放原始 HTML 代碼。如果此欄位有內容，前端將優先顯示此處。',
    }),
    // --- 新增：YouTube 影片 ID 欄位 ---
    defineField({
      name: 'youtubeVideoId',
      title: 'YouTube Video ID',
      type: 'string',
      description: '輸入 YouTube 影片 ID (例如: dQw4w9WgXcQ)，前端會自動顯示播放按鈕。',
    }),
    // --- 新增：標籤 / 關鍵字欄位 (用於 SEO/AEO) ---
    defineField({
      name: 'tags',
      title: '標籤 / 關鍵字',
      type: 'array',
      description: '用於文章分類與 AEO 優化，例如：LINE行銷, 自動化工具, AI客服',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})