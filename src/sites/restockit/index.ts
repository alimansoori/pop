import connectToMongoDb from "../../utils/connectToMongoDb"
import puppeteer, {Page} from "puppeteer"
import cheerio from "cheerio";
import categories from "../restockit/categories";
import save2csv from "../../utils/save2csv";

async function pageNav(page: Page, total: number, url: string) {
    for (let i = 1; i <= total; i++){
        await page.goto(url + "?pg=" + i)

        const html = await page.content()
        const $ = cheerio.load(html)

        const productsElem = $('div.hawk-items div.hawk-item')
        if (!productsElem.length) break
        const products = productsElem.map((index: number, element: any) => {
            const url = 'https://shoprestockit.com' + $(element).find('div.hawk-item-hover a.content').attr('href')
            const title = $(element).find('span.description').text()
            const img = $(element).find('img.rsis_catalog_prod_img').attr('src')
            const price = '$' + $(element).find('span[itemprop="price"]').attr("content")

            let availability = null
            return {url, img, price, title, availability}
        }).get()

        save2csv('restockit.csv', products)
        // await page.close()
    }
}

async function main() {

    await connectToMongoDb()
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: "C:\\chrome-win\\chrome.exe"
    })
    const page = await browser.newPage()
    // await page.setDefaultNavigationTimeout(0);
    await page.setViewport({ width: 1280, height: 800 });

    // await login(page)

    const urls = categories()
    for (let i = 0; i < urls.length; i++) {

        await page.goto(urls[i])
        const html = await page.content()
        const $ = cheerio.load(html)

        const totalString = $("span.total").first().text().replace("Page 1 of ", "")

        await pageNav(page, parseInt(totalString), urls[i])
    }
}
main().then(r => console.log('>>>> End Scraping rshughes'))