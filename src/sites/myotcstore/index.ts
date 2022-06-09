import puppeteer, {Page} from "puppeteer"
import save2csv from "../../utils/save2csv";
import categories from "../5-katom/categories";
import {
    amazonData,
    bingSearch,
    click, compareProductToAmz, initPage, loginRevseller,
    loginSellerAssistantAppWarn,
    shouldNotExist,
    stringToUrl, textToNumber,
    typeText
} from "../../lib/helper";
import compare from "../../utils/compare";

async function main() {
    const options = {
        "productsPerPage": 52
    }

    const page = await initPage()

    /*const products = ["p1", "p2"]
    products?.map(async product => {
        try {
            await page.goto("https://bing.com/search?q=toys");
        } catch (e) {
            console.log('Error')
        }
    }, page)*/

    // await loginSellerAssistantAppWarn(page)
    // await loginRevseller(page)

    await login(page)
    await navigateCategories(page, options)
}

async function navigateCategories(page: Page, options: any) {
    const categoriesUrl = categories()

    for (let i = 0; i < categoriesUrl.length; i++) {
        console.log('Scrap Cat => ' + categoriesUrl[i])
        await categoryScrape(page, categoriesUrl[i], options)
    }
}

async function categoryScrape(page: Page, url: string | null, options: any) {
    if (!url) return false
    try {
        await page.goto(url)
        try {
            await page.waitForSelector('h2.panel-title > a', {timeout: 500})

            // console.log('Scrap URL => ' + url)

            const categoriesUrls = await page.$$eval('h2.panel-title > a', h2Elems => h2Elems.map(h2Elem => {
                return h2Elem?.getAttribute('href')
            }))
            for (let i = 0; i < categoriesUrls.length; i++) {
                await categoryScrape(page, categoriesUrls[i], options)
            }
        } catch (e) {
            // console.log(e)
            const pageScrapeRes = await pageScrape(page, url, options, null)

            for (let i = 1; i <= pageScrapeRes.totalPages; i++) {
                await pageScrape(page, url+ "?page="+i, options, null)
                await productsScrape(page)
            }
        }
    } catch (e: any) {
        console.log('Error is => ' + e.message)
    }
    
}

async function pageScrape(page: Page, url: string, options: any, sort: string | null) {
    // await page.goto(url + (sort ? '?sort=' + sort : null))
    await page.goto(url)

    const catTitle = await page.$eval('h1', element => element.textContent)
    // console.log(`>>>>>> Start Scraping ${catTitle} Category Page`)
    console.log(`>>>>>> Start URL => ${url}`)

    await page.waitForSelector("span.results strong")
    const totalProducts = await page.$eval('span.results strong', element => element.textContent?.replace(/[^\d.-]/g, ''))

    const pagesNumber = (totalProducts ? parseInt(totalProducts) / options.productsPerPage : 1)
    // console.log("Total products in category is " + totalProducts)
    // console.log('Pages Numbers = ' + Math.ceil(pagesNumber))

    return {
        totalPages: Math.ceil(pagesNumber)
    }
}

async function productsScrape(page: Page) {
    const products = await page.$$eval('div.products div.product', productsElements => {
        return productsElements?.map((elem) => {
            const price = elem?.querySelector('span.price strong.kPrice')?.textContent
            return {
                // url: elem?.querySelector('a')?.getAttribute('href')?.replace(/(https:|)(^|\/\/)(.*?\/)/g, 'https://motak.com/'),
                url: elem?.querySelector('a')?.getAttribute('href'),
                img: elem?.querySelector('img.img-fluid')?.getAttribute('src'),
                price,
                title: elem?.querySelector('a')?.getAttribute('title'),
                availability: null
            }
        })
    })
    // save2csv('katom.csv', products)
    if (products.length) {
        for (let i = 0; i < products.length; i++) {
            // console.log("Price: " + products[i]?.price)
            if (!products[i]?.price || products[i]?.price === undefined) continue
            // @ts-ignore
            // if (parseFloat(products[i]?.price?.replace(/[^\d.-]/g, '')) > 250) {
            //     console.log('reject by price: ' + products[i]?.price)
            //     continue
            // }

            /*const amzData = await compareProductToAmz(page, products[i])
            console.log(amzData)
            // console.log('Amazon Url: ' + amzData?.url)
            if (amzData?.error) {console.log('reject by error: ' + amzData?.error); continue}
            if (!amzData?.seller || amzData?.seller === 'Amazon') {console.log('reject by seller: ' + amzData?.seller); continue}
            if (!amzData?.size || amzData?.size?.includes("Oversize")) {console.log('reject by size: ' + amzData?.size); continue}
            if (!amzData?.sellerCost || amzData?.sellerCost == 0) {console.log('reject by seller: ' + amzData?.sellerCost); continue}
            if (amzData?.ip) {console.log('reject by IP Complains: ' + amzData?.ip); continue}
            if (!amzData?.net || amzData?.net < 4) {console.log('reject by Net: ' + amzData?.net); continue}
            if (!amzData?.roi || amzData?.roi < 30) {console.log('reject by ROI: ' + amzData?.roi); continue}
            if (!amzData?.top || amzData?.top > 1.5) {console.log('reject by Top: ' + amzData?.top); continue}*/

            // console.log(amzData)
            if (textToNumber(products[i].price) < 250) {
                save2csv('katom.csv', [{
                    url: products[i].url,
                    // amzUrl: amzData.url,
                    img: products[i].img,
                    price: products[i].price,
                    title: products[i].title,
                    availability: products[i].availability,
                }])
            }
        }
    }
}

async function login(page: Page) {
    await page.goto('https://www.katom.com/account/login')

    await typeText(page, 'input#email', 'alimanssouri221@gmail.com')
    await typeText(page, 'input#password', 'Ali.87654321')
    await click(page, 'button[type="submit"]')
    await shouldNotExist(page, 'button[type="submit"]')
}

main().then(r => console.log('>>>> End Scraping rshughes'))