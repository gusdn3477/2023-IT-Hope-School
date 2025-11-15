import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // 0.0.0.0은 '--host'와 동일하게 모든 IP를 엽니다.
    host: '0.0.0.0', 
    proxy: {
      '/api': {
        // 로컬 백엔드 Python 서버
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
