import { chromium } from 'playwright'
import path from 'node:path'
const HERE = import.meta.dirname
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })
const qs = process.argv[2] || ''
await p.goto('http://localhost:5199/ccr-op-onboarding/submission/thumbnail/thumb.html' + qs)
await p.waitForLoadState('networkidle')
await p.evaluate(() => document.fonts.ready).catch(() => {})
await p.waitForFunction(() => { const im = [...document.querySelectorAll('img')]; return im.length && im.every((i) => i.complete && i.naturalWidth > 0) }, null, { timeout: 20000 }).catch(() => console.log('plate did not load'))
await p.waitForTimeout(1200)
// strip the live-mode overlay: it is position:fixed, so an element
// screenshot would otherwise bake the toolbar into the deliverable
await p.evaluate(() => {
  for (const n of [...document.body.children]) if (n.id !== 'thumb') n.remove()
  for (const n of document.querySelectorAll('[id*="impeccable"],[class*="impeccable"]')) n.remove()
})
await p.waitForTimeout(300)
await p.locator('#thumb').screenshot({ path: path.join(HERE, process.argv[3] || 'thumbnail.png') })
console.log('thumbnail.png written')
await b.close()
