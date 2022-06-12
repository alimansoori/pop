import puppeteer, {Page} from "puppeteer";
import Jimp from "jimp";
import sleep from "../utils/sleep";
import fs from "fs"

export async function initPage(): Promise<Page> {
    const revseller = "C:\\Users\\Lion\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\gobliffocflfaekfcaccndlffkhcafhb\\2.5.3_0\\"
    const sellerAssistantApp = "C:\\Users\\Lion\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\ngddmlfbgokkcfbmnniahfbffdohlhgf\\0.25.1_0\\"
    const sellerAssistantAppWarning = "C:\\Users\\Lion\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\bccpegbeakkofioonldfbhgdcdjmkfnk\\0.0.10_0\\"
    const azInsight = "C:\\Users\\Lion\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\gefiflkplklbfkcjjcbobokclopbigfg\\3.2.2_0\\"

    const browser = await puppeteer.launch({
        headless: false,
        // slowMo: 20,
        ignoreHTTPSErrors: true,
        executablePath: "C:\\chrome-win\\chrome.exe",
        args: [
            `--disable-extensions-except=${azInsight}`,
            `--load-extension=${azInsight}`,
            `--window-size=1440,600`,
        ]
    })
    const page = await browser.newPage()
    await page.setDefaultTimeout(50000)
    await page.setDefaultNavigationTimeout(50000);
    await page.setViewport({width: 1440, height: 900})

    // await loginSellerAssistantAppWarn(page)
    // await loginRevseller(page)

    return page
}

export async function click(page: Page, selector: string) {
    try {
        await page.waitForSelector(selector, {timeout: 1000})
        await page.click(selector)
    } catch (e) {
        throw new Error(`Could not click on selector: ${selector}`)
    }
}

export async function getText(page: Page, selector: string) {
    try {
        await page.waitForSelector(selector)
        return await page.$eval(selector, element => element.innerHTML)
    } catch (e) {
        throw new Error(`Cannot get text from selector: ${selector}`)
    }
}

export async function getNumber(page: Page, selector: string) {
    try {
        await page.waitForSelector(selector)
        return parseFloat(await page.$eval(selector, element => element.innerHTML))
    } catch (e) {
        throw new Error(`Cannot get text from selector: ${selector}`)
    }
}

export async function getValue(page: Page, selector: string) {
    try {
        await page.waitForSelector(selector)
        return await page.$eval(selector, element => element.getAttribute('value'))
    } catch (e) {
        throw new Error(`Cannot get text from selector: ${selector}`)
    }
}

export async function getCount(page: Page, selector: string) {
    try {
        await page.waitForSelector(selector)
        return await page.$$eval(selector, elements => elements.length)
    } catch (e) {
        throw new Error(`Cannot get count of selector: ${selector}`)
    }
}

export async function typeText(page: Page, selector: string, text: string) {
    try {
        await page.waitForSelector(selector)
        await page.type(selector, text.toString(), {delay: 20})
    } catch (e) {
        throw new Error(`Could not type into selector: ${selector}`)
    }
}

export async function waitForText(page: Page, selector: string, text: string) {
    try {
        await page.waitForSelector(selector)
        await page.waitForFunction((selector: string, text: string) => {
            document.querySelector(selector)?.textContent?.includes(text),
                {},
                selector,
                text
        })
    } catch (e) {
        throw new Error(`text ${text} not found for selector: ${selector}`)
    }
}

export async function shouldNotExist(page: Page, selector: string) {
    try {
        await page.waitForSelector(selector, {hidden: true})
    } catch (e) {
        throw new Error(`Selector: ${selector} is visible, but should not be.`)
    }
}

export async function loginRevseller(page: Page) {
    await page.goto('https://revseller.com/login')

    // await typeText(page, 'input#email', 'oablueridge@gmail.com')
    await typeText(page, 'input#email', 'raniotec@gmail.com')
    // await typeText(page, 'input#password', '31@Tir@1359')
    await typeText(page, 'input#password', 'Sophie@1395')
    // await click(page, 'input[name="remember"]')
    await click(page, 'button[type="submit"]')
    await shouldNotExist(page, 'button[type="submit"]')
}

export async function loginSellerAssistantAppWarn(page: Page) {
    await page.goto('https://app.sellerassistant.app/login')

    await typeText(page, 'input[name="email"]', 'aliheshmati@yahoo.com')
    await typeText(page, 'input[name="password"]', 'ali123!@#')
    // await click(page, 'input[name="remember"]')
    await click(page, 'button[type="submit"]')
    await shouldNotExist(page, 'button[type="submit"]')
}

export async function amazonData(page: Page, cost: string, amzUrl: string) {
    let error
    let sellerCost = 0
    let sellerCostt
    let net
    let roi
    let size
    let ip = false
    let seller
    let top
    let category
    let url
    let image

    try {
        await page.goto(amzUrl)
        await page.waitForSelector('h1#title', {timeout: 100000})
        await page.waitForSelector('a#aic-ext-scinfo > span.aic-ext-sc-can_i_sell')
    } catch (e: any) {
        error = 'E1 >>> ' + e.message
    }

    try {
        await page.waitForSelector('input#aic-ext-input-fba-sell', {timeout: 1000})
        sellerCostt = await getValue(page, 'input#aic-ext-input-fba-sell')
        if (sellerCostt) {
            sellerCost = parseFloat(sellerCostt)
        }
    } catch (e: any) {
        error = 'E2 >>> ' + "sellerCost Error: " + e.message
    }

    try {
        await page.waitForSelector('input#aic-ext-input-fba-buy-cost', {timeout: 5000})
        await click(page, 'input#aic-ext-input-fba-buy-cost')
        await typeText(page, 'input#aic-ext-input-fba-buy-cost', cost)
        await sleep(1000)
        await page.keyboard.press('Enter')
        await sleep(500)
    } catch (e: any) {
        error = 'E3 >>> ' + "typing cost in revseller Error: " + e.message
    }

    try {
        await page.waitForSelector('span#aic-ext-fba-result', {timeout: 5000})
        await page.waitForSelector('span#aic-ext-fba-roi', {timeout: 5000})
        net = parseFloat((await getText(page, 'span#aic-ext-fba-result')).replace(/[^\d.-]/g, '').trim())
        roi = parseFloat((await getText(page, 'span#aic-ext-fba-roi')).replace(/[^\d.-]/g, '').trim())
        console.log(`net is: ${net}`)
        console.log(`roi is: ${roi}`)
    } catch (e: any) {
        error = 'E4 >>> ' + "net roi Error: " + e.message
    }

    try {
        await page.waitForSelector('a.aic-ext-sizeTier', {timeout: 5000})
        size = (await getText(page, 'a.aic-ext-sizeTier')).trim().replace(/(<([^>]+)>)/gi, "")
        console.log(`size is: ${size}`)
    } catch (e: any) {
        error = 'E5 >>> ' + "size Error: " + e.message
    }

    try {
        await page.waitForSelector('div.alert-dagner[data-v-61b7bbeb]', {timeout: 1000})
        ip = true
        console.log(`IP is: ${ip}`)
    } catch (e: any) {
        ip = false
    }

    try {
        await page.waitForSelector('span.saa-seller-info > a', {timeout: 5000})
        seller = await getText(page, 'span.saa-seller-info > a')
        console.log(`seller is: ${seller}`)
    } catch (e: any) {
        // error = "seller Error: " + e.message
    }

    try {
        await page.waitForSelector('span.aic-ext-rank-label', {timeout: 1000})
        top = parseFloat((await getText(page, 'span.aic-ext-rank-label')).replace(/[^\d.-]/g, ''))
        console.log(`Top is: ${top}`)
    } catch (e: any) {
        error = 'E6 >>> ' + "top Error: " + e.message
    }

    try {
        await page.waitForSelector('li.saa-category-li > span.nowrap > a', {timeout: 1000})
        category = (await getText(page, 'li.saa-category-li > span.nowrap > a')).trim()
        console.log(`Category is: ${category}`)
        url = amzUrl
    } catch (e: any) {
        error = 'E7 >>> ' + "Category Error: " + e.message
    }

    try {
        await page.waitForSelector('div#imgTagWrapperId > img', {timeout: 1000})
        image = await page.$eval('div#imgTagWrapperId > img', img => img.getAttribute('src'))
        console.log(`image is: ${image}`)
    } catch (e: any) {
        error = 'E8 >>> ' + "Image Error: " + e.message
    }

    return {
        error,
        sellerCost,
        net,
        roi,
        size,
        ip,
        seller,
        top,
        category,
        url,
        image
    }


}


export async function bingSearch(page: Page, search: string): Promise<boolean | string | null> {
    const url = "https://bing.com/search?q=site:amazon.com " + stringToUrl(search)
    console.log("Bing => " + url)
    await page.goto(url);

    try {
        await page.waitForSelector("li.b_algo h2 a[href*='/dp/']", {timeout: 1000})
        const amzUrl = await page.$eval("li.b_algo h2 a[href*='/dp/']", elem => elem.getAttribute('href'))
        await page.click("li.b_algo h2 a[href*='/dp/']")
        return amzUrl
    } catch (e) {
        return false
    }
}

export function stringToUrl(title: string) {
    return (title.replace(/[^a-zA-Z0-9\-,/. ]+/g, '').trim())
}

export async function compareProductToAmz(page: Page, product: any): Promise<any> {
    const bingRes = await bingSearch(page, product.title)
    if (bingRes) {
        // return await amazonData(page, product?.price?.replace("$", "").trim(), bingRes)
    } else {
        console.log('Bing can not find search to amazon page for text: ' + product.title)
        return {
            error: 'Bing can not find search to amazon page for text: ' + product.title
        }
    }
}


export function csvToArray(csvPath: string) {
    let data = fs.readFileSync(csvPath)
        .toString() // convert Buffer to string
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => (e.trim()))); // split each line to array

    return data
}

export function textToNumber(text: string|null|undefined): number {
    if (!text) return NaN

    return parseFloat(
        text.replace(/[^\d.-]/g, '')
            .replace(/<[^>]*>?/gm, '')
            .trim()
    )
}

export function removeParamsUrl(url: string) {
    return url.substring(0, url.indexOf('?'))
}

export function askQuestion(query:any) {
    const readline = require('readline')
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, (ans: any) => {
        rl.close();
        resolve(ans);
    }))
}