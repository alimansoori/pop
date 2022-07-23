import puppeteer from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import {Page} from "puppeteer";

export async function myPage(): Promise<Page> {
    // const azInsight = "C:\\Users\\Lion\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\gefiflkplklbfkcjjcbobokclopbigfg\\3.4.2_0\\"

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

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        // executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        executablePath: "C:\\chrome-win\\chrome.exe",
        ignoreHTTPSErrors: true,
        args: [
            // `--disable-extensions-except=${azInsight}`,
            // `--load-extension=${azInsight}`,
            `--disable-site-isolation-trials`,
            `--window-size=1440,800`,
        ]
    })

    // const page = await browser.newPage()
    const page = (await browser.pages())[0]
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36')

    return page
}