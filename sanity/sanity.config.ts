import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes' // 確保這行指向包含 index.ts 的資料夾

export default defineConfig({
  name: 'default',
  title: 'line88-blog',

  // 這是你 Lockhead Hex 專案的專屬 ID
  projectId: 't0di9pwy',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    // 這裡會讀取你 index.ts 裡面的 [post, author, category, blockContent]
    types: schemaTypes,
  },
})