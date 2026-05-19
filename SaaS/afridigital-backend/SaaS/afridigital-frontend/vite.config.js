import { defineConfig } from 'vite'
import fs from 'fs'

export default defineConfig({
  plugins: [
    {
      name: 'afri-partials',
      transformIndexHtml(html) {

        const map = {
          HERO: fs.readFileSync('./src/partials/hero.html', 'utf-8'),
          MARQUEE: fs.readFileSync('./src/partials/marquee.html', 'utf-8'),
          AUTH: fs.readFileSync('./src/partials/auth.html', 'utf-8'),
          SERVICES: fs.readFileSync('./src/partials/services.html', 'utf-8'),
          FOOTER: fs.readFileSync('./src/partials/footer.html', 'utf-8'),
          CHAT: fs.readFileSync('./src/partials/chat.html', 'utf-8')
        }

        for (const key of Object.keys(map)) {
          html = html.replaceAll(`<!-- ${key} -->`, map[key])
        }

        return html
      }
    }
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true
  }
})
