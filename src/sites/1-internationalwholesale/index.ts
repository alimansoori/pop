import connectToMongoDb from "../../utils/connectToMongoDb"
import puppeteer, {Page} from "puppeteer"
import cheerio from "cheerio";
import save2csv from "../../utils/save2csv";
import sleep from "../../utils/sleep";

async function main() {

    await connectToMongoDb()
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: "C:\\chrome-win\\chrome.exe"
    })
    const page = await browser.newPage()
    // await page.setDefaultNavigationTimeout(0);
    await page.setViewport({ width: 1280, height: 800 });

    await login(page)

    const url = "https://www.internationalwholesale.com/103m7.html";
    await page.goto(url)
    await page.waitForSelector("div.PagerPanel")
    const productsTotalHandle = await page.$("div.PagerPanel div span")
    const productsTotalString = await page.evaluate((string) => string.innerHTML, productsTotalHandle);
    const productsTotal = productsTotalString.replace(/(^\d+)(.+$)/i,'$1')

    let pages: number = 1
    if (parseInt(productsTotal) > 50) {
        pages = Math.ceil((productsTotal)/50)
    }

    for (let i = 1; i <= pages; i++){
        await page.goto(url + "?i3367806:page=" + i)

        // await page.waitForSelector('tr.wf-item-cell')

        const html = await page.content()
        const $ = cheerio.load(html)

        const products = $('tr.wf-item-cell').map((index: number, element: any) => {
            const url = 'https://www.shopinternationalwholesale.com/' + $(element).find('a').attr('href')
            const img = "https:" + $(element).find('img[itemprop="image"]').attr('src')
            const title = ($(element).find('a meta[itemprop="name"]')).attr("content")
            const price = $(element).find('span:contains("Unit Price")').siblings("span").text()

            let availability = null
            return {url, img, price, title, availability}
        }).get()

        save2csv('internationalwholesale.csv', products)
        // await page.close()
    }
}

async function login(page: Page) {
    await page.goto("https://www.internationalwholesale.com/accounts")
    await page.waitForSelector("input#email_1887200")
    await page.waitForSelector("input#password_1887200")
    await page.type("input#email_1887200", "alimanssouri221@gmail.com")
    await sleep(2000)
    await page.waitForSelector("input#password_1887200")
    await page.type("input#password_1887200", "Ali.87654321")
    await page.click("input#login_3837729")
    await sleep(2000)
}

main().then(r => console.log('>>>> End Scraping rshughes'))