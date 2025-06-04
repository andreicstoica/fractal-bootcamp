import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()],
  test: {
    include: ['src/tests/**/*.ts'], // This line tells Vitest to look in src/tests and its subdirectories
  },
})
