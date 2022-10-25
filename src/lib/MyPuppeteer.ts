// @ts-ignore
import puppeteer from 'zyte-smartproxy-puppeteer'

import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { Browser, Page } from 'puppeteer'

export class MyPuppeteer {
    page!: Page
    browser!: Browser
    headless = false
    useProxy = false
    // defaultViewport: puppeteer.Viewport | null | undefined = null

    constructor(useProxy: boolean) {
        this.useProxy = useProxy
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
            // puppeteer.use(StealthPlugin())

            let browserP = {
                headless: false,
                ignoreHTTPSErrors: true,
                executablePath: 'C:\\chrome-win\\chrome.exe',
            }

            if (this.useProxy) {
                browserP = {
                    ...browserP,
                    // @ts-ignore
                    spm_apikey: 'd8fdd1a5127c40049468dafcf932af8c',
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
