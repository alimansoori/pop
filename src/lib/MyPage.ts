import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import {Page} from "puppeteer";

export async function myPage(): Promise<Page> {
    // const azInsight = "C:\\Users\\Lion\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\gefiflkplklbfkcjjcbobokclopbigfg\\3.4.2_0\\"

    puppeteer.use(StealthPlugin())

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        // executablePath: "C:\\chrome-win\\chrome.exe",
        ignoreHTTPSErrors: true,
        args: [
            // `--disable-extensions-except=${azInsight}`,
            // `--load-extension=${azInsight}`,
            `--window-size=1440,800`,
            // '--disable-background-networking',
            // '--enable-features=NetworkService,NetworkServiceInProcess',
            // '--disable-background-timer-throttling',
            // '--disable-backgrounding-occluded-windows',
            // '--disable-breakpad',
            // '--disable-client-side-phishing-detection',
            // '--disable-component-extensions-with-background-pages',
            // '--disable-default-apps',
            // '--disable-dev-shm-usage',
            // '--disable-extensions',
            // '--disable-features=Translate',
            // '--disable-hang-monitor',
            // '--disable-ipc-flooding-protection',
            // '--disable-popup-blocking',
            // '--disable-prompt-on-repost',
            // '--disable-renderer-backgrounding',
            // '--disable-sync',
            // '--force-color-profile=srgb',
            // '--metrics-recording-only',
            // '--no-first-run',
            // '--enable-automation',
            // '--password-store=basic',
            // '--use-mock-keychain',
            // '--enable-blink-features=IdleDetection',
        ]
    })

    // const page = await browser.newPage()
    const page = (await browser.pages())[0]

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36')

    return page
}