import puppeteer, { Page } from 'puppeteer'

export class MyPuppeteer {
    page!: Page
    headless = false
    // defaultViewport: puppeteer.Viewport | null | undefined = null

    constructor() {}

    async build(): Promise<void> {
        try {
            await this.afterBuild()
        } catch (e) {
            await this.afterBuild()
        }
    }

    async afterBuild(): Promise<void> {
        try {
            // process.setMaxListeners(0)

            const browser = await puppeteer.launch({
                headless: false,
                ignoreHTTPSErrors: true,
                executablePath: 'C:\\chrome-win\\chrome.exe',
                // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                args: ['--proxy-server=proxy.webscrapingapi.com:80', '--ignore-certificate-errors'],
            })

            const page = (await browser.pages())[0]

            await page.authenticate({
                username: 'webscrapingapi.country=us.render_js=0',
                password: 'Qh6v8E47BWLM7kYPR9RRDi4zJRY3KYYT',
            })
            await page.setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
            )

            this.page = page
        } catch (e: any) {
            await this.afterBuild()
        }
    }
}
