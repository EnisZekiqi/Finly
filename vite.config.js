import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Finly/', // Set the base path for routing
  plugins: [react()],
})
