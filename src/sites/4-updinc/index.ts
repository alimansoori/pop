import connectToMongoDb from "../../utils/connectToMongoDb"
import puppeteer, {Page} from "puppeteer"
import cheerio from "cheerio";
import save2csv from "../../utils/save2csv";
import sleep from "../../utils/sleep";
import categories from ".//categories";

// const amazonScraper = require('amazon-buddy');

async function main() {

    /*const product_by_asin = await amazonScraper.asin({ asin: 'B07CSLG8ST' });

    console.log(product_by_asin.result)*/

    await connectToMongoDb()
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: "C:\\chrome-win\\chrome.exe"
    })
    const page = await browser.newPage()
    // await page.setDefaultNavigationTimeout(0);
    await page.setViewport({ width: 1280, height: 800 });

    await login(page)

    const urls = categories()
    for (let j = 0; j < urls.length; j++) {

        let pages: number = 1

        for (let i = 1; i <= 10; i++){
            await page.goto(urls[j] + "&pageNum=" + i)

            const html = await page.content()
            const $ = cheerio.load(html)

            const productsElem = $('div.prdct-box')
            if (!productsElem.length) break
            const products = productsElem.map((index: number, element: any) => {
                const url = 'https://www.up4dinc.net' + $(element).find('h2 a').attr('href')
                const title = $(element).find('h2 a').text().replace("Wholesale ", "")
                const img = "https://www.updinc.net" + $(element).find('div a img').attr('src')
                const price = '$' + parseFloat($(element).find('span.notice').text().replace(/[^\d.-]/g, ''))


                let availability = null
                return {url, img, price, title, availability}
            }).get()

            save2csv('site4.csv', products)
            // await page.close()
        }
    }
}

async function login(page: Page) {
    await page.goto("https://www.updinc.net/accounts/signin/")
    await page.waitForSelector("input#email")
    await page.waitForSelector("input#password")
    await page.type("input#email", "aliheshmati70@gmail.com")
    await sleep(2000)
    await page.type("input#password", "ali123!@#")
    await page.click("input.submit")
    await sleep(2000)
}

main().then(r => console.log('>>>> End Scraping rshughes'))