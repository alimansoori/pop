import connectToMongoDb from "../../utils/connectToMongoDb"
import puppeteer, {Page} from "puppeteer"
import cheerio from "cheerio";
import save2csv from "../../utils/save2csv";
import categories from "./categories";

async function pagination(page: Page, url: string, totalProducts: number, pageNumber: number) {
    await page.goto(url + '?start_item='+ pageNumber)
    const html = await page.content()
    const $ = cheerio.load(html)
    const products = $('.x-products .x-product').map((index: number, element: any) => {
        const url = 'https://www.site3.com' + $(element).find('a.x-link-name').attr('href')
        const img = $(element).find('a.x-image img').attr('src')
        const title = $(element).find('a.x-link-name').text().trim()
        const price = '$' + parseFloat($(element).find('span.x-price').text().replace(/[^\d.-]/g, ''))

        let availability = null
        return {url, img, price, title, availability}
    }).get()
    save2csv('site3.csv', products)
}

async function main() {

    await connectToMongoDb()
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: "C:\\chrome-win\\chrome.exe"
    })
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(0)
    // await page.setDefaultNavigationTimeout(0);
    await page.setViewport({ width: 1280, height: 800 });

    const urls = categories()
    for (let j = 0; j < urls.length; j++) {
        await page.goto(urls[j])
        const html = await page.content()
        const $ = cheerio.load(html)
        const totalProducts = parseInt($('span.x-item-count-value').text())

        for (let i = 1; i < totalProducts; i = i + 24) {
            await pagination(page, urls[j], totalProducts, i)
        }
    }


    await browser.close()
}

main().then(r => console.log('>>>> End Scraping rshughes'))