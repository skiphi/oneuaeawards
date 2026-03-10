// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig(({ mode }) => ({
//   plugins: [react()],
//   base: mode === 'github' ? '/oneuaeawards/' : '/',
// }))

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
})
