import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // 0.0.0.0은 '--host'와 동일하게 모든 IP를 엽니다.
    host: '0.0.0.0', 
    proxy: {
      // '/api'로 시작하는 모든 요청을
      '/api': {
        // 'http://localhost:8000' (파이썬 서버)로 보냅니다.
        target: 'http://localhost:8000',
        
        // Origin 헤더를 변경하여 CORS 문제를 원천 차단
        changeOrigin: true,
        
        // '/api/login' -> '/login'으로 주소를 변경
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
})