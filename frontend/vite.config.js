import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  //base: '/NJ-EQUIP/',
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  //server: {
  //proxy: {
  //'/api': 'http://localhost:5000',
  //}
  //},
  optimizeDeps: {
    include: ['leaflet']
  },

})
