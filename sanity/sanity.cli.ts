import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 't0di9pwy',
    dataset: 'production'
  },
  deployment: {
    appId: 'xr4vdy1uremwlm9aqt4nmhvf',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  }
})