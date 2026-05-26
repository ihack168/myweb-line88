import {defineField, defineType, set} from 'sanity'

function CommaSeparatedTagsInput(props: any) {
  const {renderDefault, value = [], onChange} = props

  const addTags = (text: string) => {
    if (!text) return

    const newTags = text
      .split(/,|，/)
      .map((tag) => tag.trim())
      .filter(Boolean)

    if (newTags.length <= 1) return

    const mergedTags = Array.from(new Set([...value, ...newTags]))

    onChange(set(mergedTags))
  }

  const handlePaste = (event: React.ClipboardEvent) => {
    const text = event.clipboardData.getData('text')

    if (text.includes(',') || text.includes('，')) {
      event.preventDefault()
      addTags(text)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    const text = target.value

    if (event.key === 'Enter' && (text.includes(',') || text.includes('，'))) {
      event.preventDefault()
      addTags(text)
      target.value = ''
    }
  }

  return renderDefault({
    ...props,
    onPaste: handlePaste,
    onKeyDown: handleKeyDown,
  })
}

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
        slugify: (input) => {
          const cleanTitle = input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\u4e00-\u9fa5a-z0-9-]/g, '')
            .substring(0, 15)

          const uniqueId = Math.floor(Date.now() / 1000).toString().slice(-6)

          return encodeURIComponent(cleanTitle) + `-${uniqueId}`
        },
      },
      validation: (Rule) => Rule.required().error('Slug 是必填項目，否則前台無法點擊'),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'imageUrl',
      title: 'External Image URL (外部圖片網址)',
      type: 'url',
      description: '直接貼上外部網站的圖片連結 (例如 https://...)，這將作為列表頁的封面圖。',
    }),
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
    defineField({
      name: 'htmlContent',
      title: 'HTML Content (Excel Auto-post)',
      type: 'text',
      description: '這裡是存放原始 HTML 代碼。如果此欄位有內容，前端將優先顯示此處。',
    }),
    defineField({
      name: 'youtubeVideoId',
      title: 'YouTube Video ID',
      type: 'string',
      description: '輸入 YouTube 影片 ID (例如: dQw4w9WgXcQ)，前端會自動顯示播放按鈕。',
    }),
    defineField({
      name: 'tags',
      title: '標籤 / 關鍵字',
      type: 'array',
      description: '可直接輸入多個標籤，用逗號分隔，例如：猛健樂,週纖達,瑞倍適，然後按 Enter。',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      components: {
        input: CommaSeparatedTagsInput,
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