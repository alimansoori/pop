import puppeteer from "puppeteer";
import {Page} from "puppeteer";
import fs from "fs";
import {loadSetting, pidIsRunning, tomorrowDate, writeSetting} from "./helper";

export async function myPage(): Promise<Page> {
    /*var WS_Page = "gggg"
    await fs.readFile("setting.json", async function(err, buf) {
        let jsonSetting = JSON.parse(buf.toString())
        WS_Page = jsonSetting.WS_Page
        /!*jsonSetting.WS_Page = "AAAAAAAA"

        fs.writeFile("setting.json", JSON.stringify(jsonSetting), (err) => {
            if (err) console.log(err);
            console.log("Successfully Written to File.");
        });*!/
    });*/
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

    let browser
    let jsonSetting = await loadSetting()
    pidIsRunning(jsonSetting["pid"])
    /*try {
        browser = await puppeteer.connect({browserWSEndpoint: jsonSetting["WS_Page"]})
    } catch (e) {

    }*/

    browser = await puppeteer.launch({
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

    jsonSetting["WS_Page"] = browser.wsEndpoint()
    jsonSetting["pid"] = process.pid
    await writeSetting(jsonSetting)

    // const page = await browser.newPage()
    const page = (await browser.pages())[0]
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36')

    return page
}