// const puppeteer = require('puppeteer');
import puppeteer from "puppeteer"
const cheerio = require('cheerio');
const mongoose = require('mongoose')
const Listing = require("./model/Listing")
const fs = require('fs')
const compare = require('./utils/compare')
const ObjectsToCsv = require('objects-to-csv');
// https://justmarkup.com/articles/2019-01-04-using-puppeteer-to-crawl-pages-and-save-them-as-markdown-files/
// https://www.googleapis.com/customsearch/v1?q=fff&cx=014985329734297033869:af5zo9cuukk&key=AIzaSyD7TlwMkWxIgDerqRbbKgBSY14DwA4fJy4

const rule = {
    website: "https://www.acehardware.com",
    block: "div.mz-l-paginatedlist-list li.mz-productlist-item",
    url: "div.mz-productlisting-info a.mz-productlisting-title:first",
    title: "div.mz-productlisting-info a.mz-productlisting-title:first",
    price: "div.price-value, span.custom-price:first, span.mz-price:first",
    pagination: ""
}

/*async function connectToMongoDb() {
    await mongoose.connect("mongodb://127.0.0.1:27017/scrape", {
        useNewUrlParser: true
    })

    console.log('Connect to MongoDb')
}*/

/*async function getTotalProducts(page: any, url: any) {
    await page.goto(url)

    const html = await page.content()
    const $ = cheerio.load(html)

    return parseInt($("h1.mz-pagetitle:contains('items found')").text().replace(/[^0-9]/g, ''))
}*/

/*async function fetchCategory(page: any, url: any) {
    const totalProducts = await getTotalProducts(page, url)
    let sourceData: any[] = []
    for (let i = 0; i < totalProducts; i = i + 30) {
        await page.goto(url + '&pageSize=30&startIndex=' + i)

        const html = await page.content()
        const $ = cheerio.load(html)

        const products = $(rule.block).map((index: number, element: any) => {
            const today = new Date()
            const date = today.toLocaleDateString("en-US")
            const url = $(element).find(rule.url).attr('href')
            const title = $(element).find(rule.title).text().replace(/[^a-zA-Z0-9\/. ]+/g, '').trim()
            const price = parseInt($(element).find(rule.price).text().replace(/[^\d.-]/g, ''))

            return {title, date, url, price}
        }).get()

        const sourcingDataWithDetails = await scrapeSourceSiteDetails(page, products)

        sourceData = sourceData.concat(sourcingDataWithDetails)
    }


    return sourceData
}*/

async function scrapeSourceSite(page: any, url: any) {
    // return await fetchCategory(page, url)

    /*for (let res of sourceData) {
        try {
            // await page.goto("https://google.com");
            await page.goto("https://bing.com");

            await page.type('input', `site:amazon.com ${res.title}`)
            await page.keyboard.press('Enter')

            // await page.waitForSelector('div.g a')
            await page.waitForSelector('li.b_algo h2 a', {timeout: 2000})

            // const link = await page.$('div.g a');
            const link = await page.$('li.b_algo h2 a');
            if (link) {
                await link.click();
            } else {
                throw new Error("Link not exist")
            }

            const bingHtml = await page.content()
            const $$ = cheerio.load(bingHtml)

            await page.waitForSelector('span.a-price')

            await page.waitFor(2000)
            // await page.goBack()
            // await page.goBack()
        } catch (error) {
            console.log(error);
            console.log('failed to open the page');
        }
    }*/
}

/*async function scrapeSourceSiteDetails(page: any, listing: any) {
    for (let i = 0; i < listing.length; i++) {
        await page.goto(listing[i].url)
        const html = await page.content()
        const $ = cheerio.load(html)
        const brandName = $("li:contains('Brand Name:'):first").text().replace('Brand Name: ', '')
        const subBrand = $("li:contains('Sub Brand:'):first").text().replace('Sub Brand: ', '')
        const modelNumber = $("li:contains('Model Number:'):first").text().replace('Model Number: ', '')
        const productType = $("li:contains('Product Type:'):first").text().replace('Product Type: ', '')
        const mfr = $("span[itemprop='mpn']:first").text()
        listing[i].brandName = brandName
        listing[i].subBrand = subBrand
        listing[i].productType = productType
        listing[i].modelNumber = modelNumber
        listing[i].mfr = mfr

        /!*let searchText = listing[i].title
        if (mfr) {
            searchText = searchText + ' ' + mfr
        }
        console.log('Search Text: ', searchText)
        const amzDetails1 = await bingSearch(page, listing[i], searchText)
        console.log({
            ...listing[i],
            ...amzDetails1
        })
        if (brandName && productType && mfr) {
            searchText = brandName + ' ' + productType + ' ' + mfr + ' ' + modelNumber

            console.log('Search Text: ', searchText)

            const amzDetails2 = await bingSearch(page, listing[i], searchText)

            console.log({
                ...listing[i],
                ...amzDetails2
            })
        }*!/
        let amzDetails = await googleSearch(page, listing[i], searchText(listing[i]))
        if (amzDetails === 1) {
            amzDetails = await googleSearch(page, listing[i], searchText(listing[i]))
            if (amzDetails === 2) {
                amzDetails = await googleSearch(page, listing[i], searchText(listing[i]))
            }
        }

        if (amzDetails === 2) {
            amzDetails = await googleSearch(page, listing[i], searchText(listing[i], 2))
            if (amzDetails === 1) {
                amzDetails = await googleSearch(page, listing[i], searchText(listing[i], 2))
            }

            if (amzDetails === 2) {
                amzDetails = await googleSearch(page, listing[i], searchText(listing[i], 3))
                if (amzDetails === 1) {
                    amzDetails = await googleSearch(page, listing[i], searchText(listing[i], 3))
                }
            }
        }

        /!*listing[i] = {
            ...listing[i],
            ...amzDetails
        }*!/

        console.log(listing[i])
        await sleep(1000)
    }

    return listing
}*/

/*function searchText(product: any, index = 1) {
    let searchText = product.title

    if (index === 2) return searchText
    if (product.mfr) {
        searchText = searchText + ' ' + product.mfr
    }
    if (index === 3) return searchText

    let searchText2 = null
    if (product.brandName && product.productType && product.mfr) {
        searchText2 = product.brandName +
            (product.subBrand ? ' ' + product.subBrand : '') +
            ' ' +
            product.productType +
            ' ' +
            product.mfr +
            (product.modelNumber ? ' ' + product.modelNumber : '')
    }

    if (searchText2) {
        searchText = `(${searchText})|(${searchText2})`
    }

    console.log('Search Text: ', searchText)
    return searchText
}*/

/*async function sleep(miliseconds: any) {
    return new Promise(resolve => setTimeout(resolve, miliseconds))
}*/

/*async function bingSearch(page: any, sourceDetails: any, search: any) {
    await page.goto("https://bing.com/search?q=site:amazon.com " + search);

    // await page.type('input', `site:amazon.com ${search}`)
    // await page.keyboard.press('Enter')

    const html = await page.content()
    const $ = cheerio.load(html)

    const amzUrl = $("li.b_algo h2 a[href*='/dp/']:first").attr('href')
    if (!amzUrl) return {}
    return await amazonPage(page, amzUrl, sourceDetails)
}*/

async function googleSearch(page: any, sourceDetails: any, search: any) {
    await page.goto("https://google.com/search?q=site:amazon.com " + search);

    // await page.type('input', `site:amazon.com ${search}`)
    // await page.keyboard.press('Enter')

    /*const html = await page.content()
    const $ = cheerio.load(html)

    const recaptcha = $("div#recaptcha").attr('id')
    if (recaptcha) {
        await sleep(60 * 60 * 60)
        return 1
    }
    const amzUrl = $("div.g a[href*='/dp/']:first").attr('href')
    if (!amzUrl) return 2
    return await amazonPage(page, amzUrl, sourceDetails)*/
}

/*async function amazonPage(page: any, url: any, sourceDetails: any) {
    await page.goto(url)

    const html = await page.content()
    const $ = cheerio.load(html)

    const title = $('h1#title #productTitle').text().trim()
    const priceElem1 = $('span.a-price span.a-offscreen:first')
    const priceElem2 = $('span.a-color-price:first')
    const price1 = priceElem1.text() ? priceElem1.text().replace(/[^\d.-]/g, '') : null
    const price2 = priceElem2.text() ? priceElem2.text().replace(/[^\d.-]/g, '') : null

    const price = parseInt(price1 ? price1 : price2)

    let net = 0
    if (price && sourceDetails.price) {
        net = (0.85 * price) - (3.1 + parseInt(sourceDetails.price))

        if (net > 4) {
            console.log("Net profit is more 4")
            const listingModel = new Listing({
                ...sourceDetails,
                amzTitle: title,
                amzUrl: url,
                amzPrice: price,
                netProfit: net
            })
            await listingModel.save()
        }
    }


    // console.log('Price: ', $('span.a-price:first').text())
    return {
        ...sourceDetails,
        amzTitle: title,
        amzUrl: url,
        amzPrice: price,
        netProfit: net
    }
}*/

/*async function googleSearch(search) {
    // await page.goto("https://google.com");
    await page.goto("https://bing.com");

    await page.type('input', `site:amazon.com ${res.title}`)
    await page.keyboard.press('Enter')

    // await page.waitForSelector('div.g a')
    await page.waitForSelector('li.b_algo h2 a', {timeout: 2000})

    // const link = await page.$('div.g a');
    const link = await page.$('li.b_algo h2 a');
    if (link) {
        await link.click();
    } else {
        throw new Error("Link not exist")
    }

    const bingHtml = await page.content()
    const $$ = cheerio.load(bingHtml)

    await page.waitForSelector('span.a-price')
}*/

async function main() {
    // await connectToMongoDb()
    const browser = await puppeteer.launch({
        headless: false,
        // slowMo: 1000,
        executablePath: "C:\\chrome-win\\chrome.exe"
    })
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({width: 1440, height: 900});

    const url = "https://www.acehardware.com/departments?sortBy=tenant%7eweighted-rating+desc"
    // const products = await scrapeSourceSite(page, url)

    // let viewSource = await page.goto("https://cdn-tp3.mozu.com/24645-37138/cms/37138/files/faabbd37-bbda-4db1-a91d-6c913bda2888");
    let viewSource = await page.goto("https://cdn-tp3.mozu.com/24645-37138/cms/37138/files/b73974dd-44c6-40b4-b377-668e51159d7e?max=250&quality=80&_mzcb=_1618890579000");

    const imgSource = await viewSource.buffer()
    /*compare(
        'https://m.media-amazon.com/images/I/713VYm+wuGL._AC_SX679_.jpg',
        imgSource
    )*/
    /*fs.writeFile("./img.jpg", await viewSource.buffer(), function (err) {
        if (err) {
            return console.log(err);
        }
    })*/
    // const sourcingDataWithDetails = await scrapeSourceSiteDetails(page, products)

    // Save in CSV
    // const csv = new ObjectsToCsv(products)
    // await csv.toDisk('./export.csv')

    // await browser.close()
}

main()