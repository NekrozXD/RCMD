import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'csv-parse/lib/sync': 'csv-parse/lib/sync',
    },
  },
})
