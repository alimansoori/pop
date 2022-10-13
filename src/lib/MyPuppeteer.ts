import puppeteer from 'puppeteer'
import { Page } from 'puppeteer'

export class MyPuppeteer {
    page!: Page
    headless = false
    defaultViewport: puppeteer.Viewport | null | undefined = null

    constructor() {}

    async build(): Promise<void> {
        try {
            await this.afterBuild()
        } catch (e) {
            await this.afterBuild()
        }
    }

    async afterBuild(): Promise<void> {
        process.setMaxListeners(0)

        const browser = await puppeteer.launch({
            headless: this.headless,
            defaultViewport: this.defaultViewport,
            executablePath: 'C:\\chrome-win\\chrome.exe',
            ignoreHTTPSErrors: true,
            args: [
                `--proxy-server=https://webscrapingapi.country=us.proxy_type=datacenter.proxy_type=datacenter.device=desktop:Qh6v8E47BWLM7kYPR9RRDi4zJRY3KYYT@proxy.webscrapingapi.com:8000`,
            ],
        })

        this.page = (await browser.pages())[0]
    }
}
