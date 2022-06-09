import GoogleSheets from "./sheets/GoogleSheets";
import {myPage} from "./lib/MyPage";
import AmzLogin from "./amazon/AmzLogin";
import {askQuestion} from "./lib/helper";

async function main() {
    try {

        // amazon login
        // const amzLogin = new AmzLogin(page)
        // await amzLogin.login()
        const startFrom = await askQuestion("Start from row ? ");
        const date = await askQuestion("Date for save ? ");

        const page = await myPage()

        const client = new GoogleSheets(page, startFrom, date)
        // const amzLogin = new AzInsight(page)

        /*await page.mouse.wheel({
            deltaY: 1000
        })*/
        /*const store = await SourceSiteFactory.create(
            page,
            'https://katom.com'
        )*/

        /*try {
            await page.goto('https://www.katom.com/account/login')

            await typeText(page, 'input#email', 'alimanssouri221@gmail.com')
            await typeText(page, 'input#password', 'Ali.87654321')
            await click(page, 'button[type="submit"]')
            await shouldNotExist(page, 'button[type="submit"]')
        } catch (e: any) {
            console.log(e.message)
        }*/

        /*const crawler = new Crawler(store)
        await crawler.crawl()*/

        // await page.goto('http://api.scraperapi.com?api_key=099810671d1f06b8566e49204616a055&country_code=us&render=true&url=https://www.amazon.com/dp/B08TM6WWDC/')
        // await page.goto('https://www.wayfair.com/kitchen-tabletop/cat/kitchen-tabletop-c45667.html')
    } catch (e: any) {
        console.log(e.message)
    }


    // await page.setViewport({ width: 1420, height: 800 });


    /*const store = await SourceSiteFactory.create(
        page,
        'https://www.wayfair.com'
    )*/


    /*const crawler = new Crawler(store)
    await crawler.crawl()*/

    /*try {
        await page.goto('https://www.katom.com/account/login')

        await typeText(page, 'input#email', 'alimanssouri221@gmail.com')
        await typeText(page, 'input#password', 'Ali.87654321')
        await click(page, 'button[type="submit"]')
        await shouldNotExist(page, 'button[type="submit"]')
    } catch (e: any) {
        console.log(e.message)
    }*/

    /*try {
        await page.goto('https://www.restaurantsupply.com/customer/account/login/')

        await typeText(page, 'main#maincontent input#email', 'alimanssouri221@gmail.com')
        await typeText(page, 'main#maincontent input#pass', 'Ali.87654321')
        await click(page, 'main#maincontent button#send2')
        await shouldNotExist(page, 'main#maincontent button#send2')
    } catch (e: any) {
        console.log(e.message)
    }*/

    /*const scraper = new Scraper(store)

    scraper.scrapPageProducts()*/

    // ScrapSite.scrapeCategories()
}

main()