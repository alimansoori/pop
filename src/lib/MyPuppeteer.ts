// @ts-ignore
import puppeteer, { Page, Browser } from 'zyte-smartproxy-puppeteer'
import fs from 'fs'

export class MyPuppeteer {
    page!: Page
    browser!: Browser
    headless = false
    useProxy = false
    private readonly config: IPuppeteerConfig
    // defaultViewport: puppeteer.Viewport | null | undefined = null

    constructor(headless: boolean, useProxy: boolean) {
        this.useProxy = useProxy
        this.headless = headless
        this.config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))
    }

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

            let browserP = {
                headless: this.headless,
                ignoreHTTPSErrors: true,
                // executablePath: 'C:\\chrome-win\\chrome.exe',
                executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            }

            if (this.useProxy) {
                browserP = {
                    ...browserP,
                    // @ts-ignore
                    spm_apikey: this.config.zyte_api_key,
                }
            }

            this.browser = await puppeteer.launch(browserP)

            // const page = (await browser.pages())[0]
            // const page = await this.browser.newPage()

            /*await page.authenticate({
                username: 'webscrapingapi.country=us',
                password: 'Qh6v8E47BWLM7kYPR9RRDi4zJRY3KYYT',
            })*/

            /*await page.setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
            )*/

            // this.page = page
        } catch (e: any) {
            await this.afterBuild()
        }
    }
}
