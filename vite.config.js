import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ ไม่มี tailwind(), ไม่มี autoprefixer ใน postcss
export default defineConfig({
  plugins: [react()],
})
