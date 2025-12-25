import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

// Plugin to remove console logs except errors in production
// Note: Using esbuild's drop option instead for better reliability
function removeConsoleLogs(): Plugin {
  return {
    name: 'remove-console-logs',
    apply: 'build',
    transform(code, id) {
      // Only process in production builds
      if (process.env.NODE_ENV !== 'production') {
        return null
      }

      // Skip node_modules and main.tsx (has complex debug code)
      if (id.includes('node_modules') || id.includes('main.tsx')) {
        return null
      }

      // Only process source files
      if (!id.match(/\.(js|ts|jsx|tsx)$/)) {
        return null
      }

      // Use a more careful approach - only remove simple single-line console calls
      // Complex multi-line cases will be handled by esbuild's drop option
      const consoleMethods = ['log', 'warn', 'info', 'debug', 'trace']
      let transformedCode = code

      for (const method of consoleMethods) {
        // Only match single-line console calls to avoid breaking code
        const pattern = new RegExp(
          `console\\.${method}\\s*\\([^\\n]*\\)\\s*;?\\s*\\n`,
          'g'
        )
        transformedCode = transformedCode.replace(pattern, '')
      }

      if (transformedCode !== code) {
        return {
          code: transformedCode,
          map: null
        }
      }

      return null
    }
  }
}

export default defineConfig({
  plugins: [react(), removeConsoleLogs()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,
    strictPort: false
  },
  build: {
    minify: 'esbuild',
    // Drop debugger and console statements in production
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['debugger', 'console'] : []
    }
  }
})

