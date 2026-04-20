import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // .env ���Ͽ��� ȯ�溯���� �о�ɴϴ�.
  const env = loadEnv(mode, process.cwd(), '')
  // ���� ���� ���Ͻ� ���: ���� ���� �� -> API �⺻�� -> ���� �⺻�� ������ ���
  const devProxyTarget = env.VITE_DEV_PROXY_TARGET || env.VITE_API_BASE_URL || 'http://localhost:8080'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // ���̺귯������ ûũ�� �и��� �ʱ� �ε� ȿ���� ���Դϴ�.
            if (id.includes('node_modules')) {
              // React ���� ���̺귯��
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'react-vendor'
              }
              // UI ���̺귯��
              if (id.includes('@radix-ui')) {
                return 'ui-vendor'
              }
              // �ִϸ��̼� ���̺귯��
              if (id.includes('motion')) {
                return 'animation-vendor'
              }
              // ������ ���̺귯��
              if (id.includes('lucide-react')) {
                return 'icon-vendor'
              }
            }
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: devProxyTarget,
          changeOrigin: true,
          secure: false,
          timeout: 60000,
          proxyTimeout: 60000,
          cookieDomainRewrite: 'localhost',
          configure: (proxy) => {
            proxy.on('error', (err) => {
              console.log('proxy error', err)
            })
            proxy.on('proxyReq', (proxyReq, req) => {
              console.log('Sending Request to the Target:', req.method, req.url)
              // ���� Content-Type ����� �����մϴ�.
              if (req.headers['content-type']) {
                proxyReq.setHeader('Content-Type', req.headers['content-type'])
              }
            })
            proxy.on('proxyRes', (proxyRes, req) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url)
            })
          },
        },
      },
    },
  }
})