import {Page} from "puppeteer";

function getAmazonImages($: any) {
    const imagesElement = $("script[type='text/javascript']:contains('colorImages')")
    const imagesText: string|null = $(imagesElement).html()
    const images = imagesText?.substring(imagesText.indexOf('{"hiRes":'), imagesText.lastIndexOf(',\n\'colorToAsin\'') + 1).match(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/ig)
    const imagesFilter = images?.map((image, index) => {
        return image.replace(/(https:\/\/m\.media-amazon\.com\/images\/I\/)(.*)(\._)(.*)(_)(.jpg)/, "$1$2$6")
    })
    const uniqueArray = imagesFilter?.filter(function(item, pos) {
        return imagesFilter.indexOf(item) == pos;
    })

    return uniqueArray
}

async function amazonPageScrap(page: Page, url: string) {

    /*await page.goto(url, {waitUntil: "domcontentloaded"})
    // await page.waitForSelector('body');

    const html = await page.content()
    // const html = await request.get(url, )
    const $ = cheerio.load(html)
    //

    const price1 = $("span.a-price span.a-offscreen").text().replace(/[^\d.-]/g, '');
    const price2 = $("span.a-color-price").text().replace(/[^\d.-]/g, '');

    // let soldBy = $("div[class='tabular-buybox-text'][tabular-attribute-name='Sold by']");
    let soldBy = $("a#sellerProfileTriggerId").text().trim();

    return {
        price: parseFloat(price1 ? price1 : price2),
        soldBy,
        images: getAmazonImages($)
    }*/


    /*return await page.evaluate(() => {

        /!* Get product title *!/
        let title: string|null = (document.body.querySelector('#productTitle') as HTMLElement).innerText

        /!* Get review count *!/
        let reviewCount = (document.body.querySelector('#acrCustomerReviewText') as HTMLElement).innerText;
        let formattedReviewCount = reviewCount.replace(/[^0-9]/g,'').trim();

        let ratingElement = (document.body.querySelector('.a-icon.a-icon-star') as HTMLElement).getAttribute('class');
        let integer = ratingElement?.replace(/[^0-9]/g,'').trim();
        let parsedRating = integer ? parseInt(integer) / 10 : null

        // /!* Get availability *!/
        /!*let availability = document.body.querySelector('#availability').innerText;
        let formattedAvailability = availability.replace(/[^0-9]/g, '').trim();*!/

        // /!* Get list price *!/
        // let listPrice = document.body.querySelector('.priceBlockStrikePriceString').innerText;

        // /!* Get price *!/
        const price1 = (document.body.querySelector('span.a-price span.a-offscreen') as HTMLElement)?.innerText?.replace(/[^\d.-]/g, '');
        const price2 = (document.body.querySelector('span.a-color-price') as HTMLElement)?.innerText?.replace(/[^\d.-]/g, '');

        const soldBy = (document.body.querySelector('div[class=\'tabular-buybox-text\'][tabular-attribute-name=\'Sold by\']') as HTMLElement)?.innerText?.trim();

        // const img = document.getElementsByTagName('script');

        // console.log(img.length)
        // /!* Get product description *!/
        // let description = document.body.querySelector('#renewedProgramDescriptionAtf').innerText;

        // /!* Get product features *!/
        // let features = document.body.querySelectorAll('#feature-bullets ul li');
        // let formattedFeatures:any[] = [];

        /!*features.forEach((feature) => {
            formattedFeatures.push(feature.innerText);
        });*!/

        // /!* Get comparable items *!/
        /!*let comparableItems = document.body.querySelectorAll('#HLCXComparisonTable .comparison_table_image_row .a-link-normal');
        const formattedComparableItems: any[] = [];*!/

        /!*comparableItems.forEach((item) => {
            formattedComparableItems.push("https://amazon.com" + item.getAttribute('href'));
        });
*!/

        return {
            "soldBy": "kkk",
            "title": title,
            "rating": parsedRating,
            "reviewCount" : formattedReviewCount,
            // "listPrice": listPrice,
            "price": parseFloat(price1 ? price1 : price2),

            // "availability": formattedAvailability,
            // "description": description,
            // "features": formattedFeatures,
            // "comparableItems": formattedComparableItems
        };
    });*/

    /*const html = await page.content()
    const $ = cheerio.load(html)

    const soldBy = $("div[class='tabular-buybox-text'][tabular-attribute-name='Sold by']:first").text().trim()
    const title = $('h1#title #productTitle').text().trim()
    const priceElem1 = $('span.a-price span.a-offscreen:first')
    const priceElem2 = $('span.a-color-price:first')
    const price1 = priceElem1.text() ? priceElem1.text().replace(/[^\d.-]/g, '') : ''
    const price2 = priceElem2.text() ? priceElem2.text().replace(/[^\d.-]/g, '') : ''

    const price = parseFloat(price1 ? price1 : price2)*/

    /*const selector = "div[class='tabular-buybox-text'][tabular-attribute-name='Sold by']"
    const soldBy: string = (await page.waitForSelector(selector)
        .then(async () => {
            return await page.$(selector)
                .then(async soldByElem => {
                    return await page.evaluate(elem => elem.innerText, soldByElem)
                        .catch(err => {
                            console.log('eval error')
                            return null
                        })
                })
                .catch(err => {
                    console.log('$ error')
                    return null
                })
        })
        .catch(err => {
            console.log('select error')
            return null
        })).trim()*/

    /*const variationSelector = "div[id*='variation_']"
    const variation: boolean = await page.waitForSelector(variationSelector, {timeout: 2000})
        .then(() => {
            return true
        })
        .catch(err => {
            return false
        })*/

    /*return {
        title,
        soldBy,
        price,
    }*/
}

export default amazonPageScrap