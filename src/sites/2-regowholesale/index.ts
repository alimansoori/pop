import puppeteer, {Page} from "puppeteer"
import cheerio from "cheerio";
import save2csv from "../../utils/save2csv";
import sleep from "../../utils/sleep";

async function main() {
    const pageCount: number = 40

    const browser = await puppeteer.launch({
        headless: false,
        executablePath: "C:\\chrome-win\\chrome.exe"
    })
    const page = await browser.newPage()
    // await page.setDefaultNavigationTimeout(0);
    await page.setViewport({ width: 1280, height: 800 });

    await login(page)

    /*const url = "https://regowholesale.com/collections/all";
    await page.goto(url)

    for (let i = 1; i <= pageCount; i++){
        await page.goto(url + "?page=" + i)

        const html = await page.content()
        const $ = cheerio.load(html)

        const products = $('div.product-list div.product-item').map((index: number, element: any) => {
            const url = 'https://shoptwo.com/' + $(element).find('a.product-item__image-wrapper').attr('href')
            const img = "https:" + $(element).find('img.product-item__primary-image').attr('src')
            const title = ($(element).find('a.product-item__title')).text()
            const price = $(element).find('span.price span.hidePrice').text()

            let availability = null
            return {url, img, price, title, availability}
        }).get()

        console.log(products)
        save2csv('regowholesale.csv', products)
    }*/
}

async function login(page: Page) {
    try {
        await page.goto("https://regowholesale.com/account/login")

        // await page.click("a.header__action-item-link.hidden-pocket.hidden-lap")
        // await sleep(2000)
        // await page.waitForSelector('input[type="password"]')
        // await page.type("input#login-customer\[email\]", "alimanssouri221@gmail.com")
        // await sleep(2000)
        // await page.type('input[type="password"]', "Ali.87654321")
        // await page.click('button[type="submit"]')
        // await sleep(2000)
    } catch (err) {
        console.log(err)
    }
}

main().then(r => console.log('>>>> End Scraping rshughes'))