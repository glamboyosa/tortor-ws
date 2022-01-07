import cors from 'cors'
import express from 'express'
import WebSocket from 'ws'
import puppeteer from 'puppeteer'
import ews from 'express-ws'
const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 4000
const { app: ewsApp } = ews(app)

ewsApp.ws('/api/capture', async (ws, _) => {
  ws.on('message', async (msg: string) => {
    const { url } = JSON.parse(msg)
    console.log(url)
    const browser = puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    try {
      const page = await (await browser).newPage()

      await page.goto(url.toString(), { timeout: 0 })

      const screenshotBuffer = (await page.screenshot()) as Buffer

      const screenshot = screenshotBuffer.toString('base64')

      ws.send(JSON.stringify({ img: screenshot, error: null }))
    } catch (e) {
      ws.send(JSON.stringify({ img: null, error: e.message }))
    }
  })
})

app.listen(port, () =>
  console.log(`tortor-ws is now listening on port ${port} ⚡️`),
)
