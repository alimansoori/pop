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
            // executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            executablePath: 'C:\\chrome-win\\chrome.exe',
            ignoreHTTPSErrors: true,
            args: [
                // `--disable-extensions-except=${azInsight}`,
                // `--load-extension=${azInsight}`,
                // `--disable-site-isolation-trials`,
                // `--window-size=1440,800`,
                `--proxy-server=https://webscrapingapi.country=us.proxy_type=datacenter.proxy_type=datacenter.device=desktop:Qh6v8E47BWLM7kYPR9RRDi4zJRY3KYYT@proxy.webscrapingapi.com:8000`,
            ],
        })

        const page = (await browser.pages())[0]
        // const page = await browser.newPage()

        /*await page.authenticate({
            username: 'webscrapingapi.proxy_type=datacenter.device=desktop',
            password: 'Qh6v8E47BWLM7kYPR9RRDi4zJRY3KYYT',
        })*/

        /*await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
        )*/

        this.page = page
    }
}

export async function myPage(): Promise<Page> {
    try {
        return await createPage()
    } catch (e: any) {
        console.log(e.message)
        return await createPage()
    }
}

export async function createPage(): Promise<Page> {
    // const azInsight = "C:\\Users\\Lion\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\gefiflkplklbfkcjjcbobokclopbigfg\\3.4.2_0\\"
    // puppeteer.use(StealthPlugin())
    process.setMaxListeners(0)

    // let jsonSetting = await loadSetting()
    // pidIsRunning(jsonSetting["pid"])
    /*try {
  browser = await puppeteer.connect({browserWSEndpoint: jsonSetting["WS_Page"]})
} catch (e) {

}*/

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        // executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        executablePath: 'C:\\chrome-win\\chrome.exe',
        ignoreHTTPSErrors: true,
        args: [
            // `--disable-extensions-except=${azInsight}`,
            // `--load-extension=${azInsight}`,
            `--disable-site-isolation-trials`,
            `--window-size=1440,800`,
        ],
    })

    // jsonSetting["WS_Page"] = browser.wsEndpoint()
    // jsonSetting["pid"] = process.pid
    // await writeSetting(jsonSetting)

    // const page = await browser.newPage()
    const page = (await browser.pages())[0]
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
    )

    return page
}
