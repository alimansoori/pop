import connectToMongoDb from "../../utils/connectToMongoDb"
import puppeteer from "puppeteer"
import amazonLogin from "../../utils/amazonLogin";
import compare from "../../utils/compare"
import amazonPageScrap from "../../utils/amazonPageScrap";

async function main() {
    await connectToMongoDb()
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: "C:\\chrome-win\\chrome.exe"
    })
    const page = await browser.newPage()
    // await page.setDefaultNavigationTimeout(0);
    await page.setViewport({ width: 1280, height: 800 });

    /*if (!await amazonLogin(page)) {
        console.log('Please fix amazonLogin')
    }*/

    /*const {distance, diff} = await compare(
        page,
        'https://c1.neweggimages.com/ProductImageCompressAll1280/AM89_1_201911071872904955.jpg',
        'https://m.media-amazon.com/images/I/81QYU1CU6NS._AC_SL1500_.jpg',
    )*/

    /*const data = await amazonPageScrap(
        page,
        'https://www.amazon.com/dp/B00IOZWC2M'
    )

    console.log(data)*/

}

main().then(r => console.log('>>>> End Scraping Ace Hardware'))