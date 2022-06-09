import {click, getNumber, getText, initPage, shouldNotExist, textToNumber, typeText} from "../../lib/helper";
import {Page} from "puppeteer";
import sleep from "../../utils/sleep";

async function main() {
    /*const page = await initPage()

    await page.goto('https://www.amazon.com/dp/B01B2J07GY/', {waitUntil: "domcontentloaded"})

    await sleep(15000)
    await authAzInsight(page)
    const azData = await fetchDataAzInsight(page, 5)

    console.log(azData)*/
}


export async function fetchDataAzInsight(page: Page, amzUrl: string, sourcePrice: number): Promise<{
    sellPrice: number,
    top: number,
    net: number,
    roi: number,
    ip: boolean,
    category: string,
    offers: number,
    sales: number,
    bsr: number,
    bsr90: number,
    pkq: number,
    asin: string,
    size: string,
    badge30: boolean,
    badge90: boolean,
    amz: boolean,
    variations: number
}> {
    await page.goto(amzUrl, {waitUntil: "domcontentloaded"})

    try {
        await  page.waitForSelector("h1#title")
    } catch (e: any) {
        return {
            sellPrice: NaN,
            top: NaN,
            net: NaN,
            roi: NaN,
            ip: false,
            category: 'NAN',
            offers: NaN,
            sales: NaN,
            bsr: NaN,
            bsr90: NaN,
            pkq: NaN,
            asin: '',
            size: '',
            badge30: false,
            badge90: false,
            amz: false,
            variations: NaN
        }
    }

    await authAzInsight(page)

    await shouldNotExist(page, "div#az-app-container svg.MuiCircularProgress-svg")
    console.log('>>> Start Scrap azInsight')

    await calculate(page, sourcePrice)
    const sellPrice = await getSellPrice(page)
    const net = await getNetProfit(page)
    const roi = await getROI(page)

    await calculateBadge(page, await getAvg30(page))
    const netAvg30 = await getNetProfit(page)
    const roiAvg30 = await getROI(page)

    await calculateBadge(page, await getAvg90(page))
    const netAvg90 = await getNetProfit(page)
    const roiAvg90 = await getROI(page)

    return {
        sellPrice,
        top: await getTopRank(page),
        net,
        roi,
        ip: await isIP(page),
        category: await getCategory(page),
        offers: await getOffers(page),
        sales: await getMonthlySales(page),
        bsr: await getBSR(page),
        bsr90: await getBSR90(page),
        pkq: await getPKQ(page),
        asin: await getASIN(page),
        size: await getSize(page),
        badge30: (netAvg30 >= 4 && roiAvg30 >= 30),
        badge90: (netAvg90 >= 4 && roiAvg90 >= 30),
        amz: !!(await getAmzPrice30(page)),
        variations: await hasVariations(page)
    }
}

async function calculate(page: Page, sourcePrice: number) {
    try {
        await sleep(200)
        const costSelector = "div#az-app-container input#BuyCost-FBA"
        await click(page, costSelector)
        await typeText(page, costSelector, sourcePrice.toString())
        await sleep(500)
        await page.keyboard.press('Enter')
        await sleep(2000)
    } catch (e: any) {
        console.log('>>> Error in calculate net and roi by cost => ' + e.message)
    }
}

async function calculateBadge(page: Page, sellPrice: number) {
    try {
        await sleep(500)
        const sellPriceSelector = "div#az-app-container #home-page input#Sellprice-FBA"
        await click(page, sellPriceSelector)
        const inputValue = await page.$eval(sellPriceSelector, el => el.getAttribute('value'));
        if (inputValue) {
            for (let i = 0; i < inputValue.length; i++) {
                await page.keyboard.press('Delete');
            }
        }

        await typeText(page, sellPriceSelector, sellPrice.toString())
        await sleep(500)
        await page.keyboard.press('Enter')
        await sleep(2000)
    } catch (e: any) {
        console.log('>>> Error in calculate badge => ' + e.message)
    }
}

async function getSellPrice(page: Page): Promise<number> {
    try {
        await sleep(200)
        await page.waitForSelector('div#az-app-container div#home-page input#Sellprice-FBA')
        const value = await page.$eval('div#az-app-container div#home-page input#Sellprice-FBA', input => input.getAttribute('value'))

        if (!value) return NaN
        return parseFloat(value)
    } catch (e: any) {
        console.log('>>> Error in get sellPrice => ' + e.message)
        return NaN
    }
}

async function getTopRank(page: Page): Promise<number> {
    try {
        await sleep(200)
        const selector = 'div#az-app-container #home-page > div:not(.hidden) div.accordion div.collapse.show > div > div:nth-child(1) >div:nth-child(3) > strong'
        await page.waitForSelector(selector, {timeout: 1000})
        const value = await getText(page, selector)

        if (!value) return NaN
        return textToNumber(value)
    } catch (e: any) {
        console.log('>>> Error in get Top Rank => ' + e.message)
        return NaN
    }
}

async function getNetProfit(page: Page): Promise<number> {
    try {
        await sleep(200)
        const selector = 'div#az-app-container div.Calculator-Form > div:nth-child(4) > div:nth-child(4) > strong'
        await page.waitForSelector(selector, {timeout: 1000})
        const value = await getText(page, selector)

        if (!value) return NaN
        return textToNumber(value)
    } catch (e: any) {
        console.log('>>> Error in get Net Profit => ' + e.message)
        return NaN
    }
}

async function getROI(page: Page): Promise<number> {
    try {
        await sleep(200)
        const selector = 'div#az-app-container div.Calculator-Form > div:nth-child(5) > div:nth-child(4) > strong'
        await page.waitForSelector(selector, {timeout: 1000})
        const value = await getText(page, selector)

        if (!value) return NaN
        return textToNumber(value)
    } catch (e: any) {
        console.log('>>> Error in get ROI => ' + e.message)
        return NaN
    }
}

async function getCategory(page: Page): Promise<string> {
    try {
        await sleep(200)
        const selector = 'div#az-app-container #home-page > div:not(.hidden) div.accordion div.collapse.show > div > div:nth-child(1) >div:nth-child(1) > strong.text-primary'
        await page.waitForSelector(selector, {timeout: 10000})

        return await getText(page, selector)
    } catch (e: any) {
        console.log('>>> Error in get Category => ' + e.message)
        return ''
    }
}

async function isIP(page: Page): Promise<boolean> {
    try {
        await sleep(200)
        const selector = 'div#az-app-container svg[data-icon="tachometer-alt-slowest"]'
        await page.waitForSelector(selector, {timeout: 1000})

        return false
    } catch (e: any) {
        console.log('>>> Error in IP Complains => ' + e.message)
        return true
    }
}

async function getBSR(page: Page): Promise<number> {
    try {
        await sleep(200)
        const selector = 'div#az-app-container #home-page > div:not(.hidden) div.accordion div.collapse.show > div > div:nth-child(1) >div:nth-child(2) > strong'
        await page.waitForSelector(selector, {timeout: 10000})
        const value = await getText(page, selector)

        if (!value) return NaN
        return textToNumber(value)
    } catch (e: any) {
        console.log('>>> Error in get BSR => ' + e.message)
        return NaN
    }
}

async function getPKQ(page: Page): Promise<number> {
    try {
        await sleep(200)
        const selector = "(//div[@id='az-app-container']//strong[contains(text(),'Package Qty. ')])[1]"

        await page.waitForXPath(selector, {timeout: 500})
        let elHandle = await page.$x(selector);
        const data = await page.evaluate(el => el.parentElement.getAttribute('data'), elHandle[0])

        return textToNumber(data)
    } catch (e: any) {
        console.log('>>> Error in get Package Qty. => ' + e.message)
        return NaN
    }
}

async function hasVariations(page: Page): Promise<number> {
    try {
        await sleep(200)
        const selector = "(//div[@id='az-app-container']//span[contains(text(),'Variations')])[1]"

        await page.waitForXPath(selector, {timeout: 500})
        let elHandle = await page.$x(selector);
        await page.evaluate(el => el.parentElement.click(), elHandle[0])
        await sleep(2000)
        const vars = await getText(page, 'div#az-app-container div#home-page div.Variations-Component > div:nth-child(2) > div:nth-child(1) > strong')

        if (!textToNumber(vars)) return NaN
        return textToNumber(vars)

    } catch (e: any) {
        console.log('>>> Error in get Variations => ' + e.message)
        return NaN
    }
}

async function getASIN(page: Page): Promise<string> {
    try {
        await sleep(200)
        const xPathSelector = "(//div[@id='az-app-container']//span[contains(text(),'ASIN:')])[1]"

        await page.waitForXPath(xPathSelector, {timeout: 500})
        let elHandle = await page.$x(xPathSelector);
        return await page.evaluate(el => el.getAttribute('data'), elHandle[0])

    } catch (e: any) {
        console.log('>>> Error in get ASIN => ' + e.message)
        return ''
    }
}

async function getUPC(page: Page): Promise<string> {
    try {
        await sleep(200)
        const xPathSelector = "(//div[@id='az-app-container']//strong[contains(text(),'UPC: ')])[1]"

        await page.waitForXPath(xPathSelector, {timeout: 500})
        let elHandle = await page.$x(xPathSelector);
        return await page.evaluate(el => el.getAttribute('data'), elHandle[0])

    } catch (e: any) {
        console.log('>>> Error in get ASIN => ' + e.message)
        return ''
    }
}

async function getSize(page: Page): Promise<string> {
    try {
        await sleep(200)
        const xPathSelector = "(//div[@id='az-app-container']//strong[contains(text(),'Small standard')])[1]"
        await page.waitForXPath(xPathSelector, {timeout: 100})
        let elHandle = await page.$x(xPathSelector);
        return await page.evaluate(el => el.textContent, elHandle[0])
    } catch (e: any) {
        try {
            const xPathSelector = "(//div[@id='az-app-container']//strong[contains(text(),'Large standard')])[1]"
            await page.waitForXPath(xPathSelector, {timeout: 100})
            let elHandle = await page.$x(xPathSelector);
            return await page.evaluate(el => el.textContent, elHandle[0])
        } catch (e: any) {
            return 'oversize'
        }
    }
}

async function getMonthlySales(page: Page): Promise<number> {
    try {
        await sleep(200)
        const selector = 'div#az-app-container #home-page > div:not(.hidden) div.accordion div.collapse.show > div > div:nth-child(2) > div > span > strong:nth-child(1)'
        await page.waitForSelector(selector, {timeout: 10000})
        const value = await getText(page, selector)

        if (!value) return NaN
        return textToNumber(value)
    } catch (e: any) {
        console.log('>>> Error in get Monthly Sales => ' + e.message)
        return NaN
    }
}

async function getBSR90(page: Page): Promise<number> {
    try {
        const selector = 'div#az-app-container #home-page div.keepa-data-table > div:nth-child(2) > div:nth-child(3)'
        await page.waitForSelector(selector, {timeout: 10000})
        const value = await getText(page, selector)

        if (!value) return NaN
        return textToNumber(value)
    } catch (e: any) {
        console.log('>>> Error in get Monthly Sales => ' + e.message)
        return NaN
    }
}

async function getAvg30(page: Page): Promise<number> {
    try {
        const selector = 'div#az-app-container #home-page div.keepa-data-table > div:nth-child(5) > div:nth-child(2)'
        await page.waitForSelector(selector, {timeout: 1000})
        const value = await getText(page, selector)

        if (!value) return NaN
        return textToNumber(value)
    } catch (e: any) {
        console.log('>>> Error in get Avg 30 => ' + e.message)
        return NaN
    }
}

async function getAvg90(page: Page): Promise<number> {
    try {
        const selector = 'div#az-app-container #home-page div.keepa-data-table > div:nth-child(5) > div:nth-child(3)'
        await page.waitForSelector(selector, {timeout: 1000})
        const value = await getText(page, selector)

        if (!value) return NaN
        return textToNumber(value)
    } catch (e: any) {
        console.log('>>> Error in get Avg 90 => ' + e.message)
        return NaN
    }
}

async function getAmzPrice30(page: Page): Promise<number> {
    try {
        const selector = 'div#az-app-container #home-page div.keepa-data-table > div:nth-child(6) > div:nth-child(2)'
        await page.waitForSelector(selector, {timeout: 1000})
        const value = await getText(page, selector)

        if (!value) return NaN
        return textToNumber(value)
    } catch (e: any) {
        console.log('>>> Error in check is amazon => ' + e.message)
        return NaN
    }
}

async function getOffers(page: Page): Promise<number> {
    try {
        const selector = 'div#az-app-container #home-page a[data-action="show-all-offers-display"] > strong.text-primary'
        await page.waitForSelector(selector, {timeout: 10000})
        const value = await getText(page, selector)

        if (!value) return NaN
        return textToNumber(value)
    } catch (e: any) {
        console.log('>>> Error in Offers => ' + e.message)
        return NaN
    }
}

async function authAzInsight(page: Page) {
    try {
        await page.waitForSelector('div#az-app-container div#home-page', {timeout: 10000})
    } catch (e: any) {
        if (await loginAzInsight(page)) await authAzInsight(page)
    }
}

async function loginAzInsight(page: Page): Promise<boolean> {
    try {
        await page.waitForSelector('div#az-app-container div.login-form', {timeout: 10000})
        await page.waitForSelector('div#az-app-container div.login-form input[type="email"]', {timeout: 10000})
        // await typeText(page, 'div#az-app-container div.login-form input[type="email"]', 'aliheshmati@yahoo.com')
        // await typeText(page, 'div#az-app-container div.login-form input[type="email"]', 'jasimmamani@gmail.com')
        await typeText(page, 'div#az-app-container div.login-form input[type="email"]', 'aliheshmati70@gmail.com')
        await click(page, 'div#az-app-container div.login-form button')
        await sleep(1000)
        // await typeText(page, 'div#az-app-container div.login-form input[type="password"]', 'ali1234!@#$')
        // await typeText(page, 'div#az-app-container div.login-form input[type="password"]', 'jasim123!@#')
        await typeText(page, 'div#az-app-container div.login-form input[type="password"]', 'ali123!@#')
        await click(page, 'div#az-app-container div.login-form button[type="button"]')
        await sleep(1000)

        console.log('>>> Success login AzInsight')
        return true
    } catch (e: any) {
        console.log('>>> Error login AzInsight: ' + e.message)
        return false
    }
}


main().then(r => console.log('>>>> End Scraping Test'))