import {Page} from "puppeteer";
import {click, getText, textToNumber, typeText} from "./helper";
import sleep from "../utils/sleep";
import amazonLogin from "../utils/amazonLogin";
import Url from "./Url";
import SourceSiteFactory from "../stores/SourceSiteFactory";


export async function scrapeSites(page: Page, url: string): Promise<{ price: number | null | undefined, error: string | null | undefined }> {
    let error
    let price

    try {
        let domain = Url.getDomain(url)

        console.log('>>> Start Source Scrape: ' + url)

        if (domain === 'tacticalbucket') {
            await page.goto(url)
            url = page.url()
            domain = Url.getDomain(url)
        }

        const ScrapSite = await SourceSiteFactory.create(page, url)

        await ScrapSite.scrape()

        price = ScrapSite.getPrice()

        /*if (domain === '1sale') {
            price = (await scrapeSite(page, url, 'div.product-details span.price span.inprice')).price
        } else if (domain === '511tactical') {
            price = (await scrapeSite(page, url, 'span.price')).price
        } else if (domain === 'amazon') {
            throw new Error('Reject Amazon site')
        } else if (domain === 'acehardware') {
            price = (await scrapeSite(page, url, 'span[itemprop="price"]')).price
        } else if (domain === 'acmetools') {
            price = (await scrapeSite(page, url, 'div.prices-add-to-cart-actions div.price span.sales')).price
        } else if (domain === 'adorama') {
            price = (await scrapeSite(page, url, 'strong.your-price')).price
        } else if (domain === 'advanceautoparts') {
            price = (await scrapeSite(page, url, 'div.css-7svq7y')).price
        } else if (domain === 'academy') {
            price = (await scrapeSite(page, url, 'span[data-auid="nowPrice"]', 'span[data-auid="regPrice"] > span.css-0')).price
        } else if (domain === 'albeebaby') {
            price = (await scrapeSite(page, url, 'span.pdProductDisplayPrice')).price
        } else if (domain === 'airgas') {
            price = (await scrapeSite(page, url, 'div.price-container div.sale span.value')).price
        } else if (domain === 'artsupplywarehouse') {
            price = (await scrapeSite(page, url, 'div.card-body p.store_product_price_um')).price
        } else if (domain === 'backcountry') {
            price = (await scrapeSite(page, url, 'div[data-id="buyBox"] span.chakra-text.css-17wknbl')).price
        } else if (domain === 'bangalla') {
            price = (await scrapeSite(page, url, 'meta[property="product:price:amount"]', '', 'content')).price
        } else if (domain === 'barnesandnoble') {
            price = (await scrapeSite(page, url, 'span#pdp-cur-price')).price
        } else if (domain === 'basspro') {
            price = (await scrapeSite(page, url, 'div[itemprop="offers"] span.price > span', 'div.Price span.price > span')).price
        } else if (domain === 'beallsflorida') {
            price = (await scrapeSite(page, url, 'span[itemprop="price"]')).price
        } else if (domain === 'bedbathandbeyond') {
            price = (await scrapeSite(page, url, 'div.trackIsPrice', 'div.priceSale')).price
        } else if (domain === 'belk') {
            price = (await scrapeSite(page, url, 'span.price-sales')).price
        } else if (domain === 'bestbuy') {
            price = (await scrapeSite(page, url, 'div.priceView-hero-price.priceView-customer-price > span[aria-hidden="true"]')).price
        } else if (domain === 'bigapplecollectibles') {
            price = (await scrapeSite(page, url, 'div.product-single__meta span.product__price span.money')).price
        } else if (domain === 'bigbadtoystore') {
            price = (await scrapeSite(page, url, 'div.product-purchase-info div.price')).price
        } else if (domain === 'biglots') {
            price = (await scrapeSite(page, url, 'div.price > div.regular-price')).price
        } else if (domain === 'bloomingdales') {
            price = (await scrapeSite(page, url, 'div.lowest-sale-price')).price
        } else if (domain === 'banggood') {
            price = (await scrapeSite(page, url, 'span.main-price')).price
        } else if (domain === 'bookpal') {
            price = (await scrapeSite(page, url, 'span#unit-price')).price
        } else if (domain === 'bjs') {
            price = (await scrapeSite(page, url, 'span.price-display')).price
        } else if (domain === 'boxed') {
            price = (await scrapeSite(page, url, 'span._1M-WRA4f18pWnScZwCwb7h > span')).price
        } else if (domain === 'burkesoutlet') {
            price = (await scrapeSite(page, url, 'span#price')).price
        } else if (domain === 'buybuybaby') {
            price = (await scrapeSite(page, url, 'div.trackIsPrice')).price
        } else if (domain === 'cabelas') {
            price = (await scrapeSite(page, url, 'div[itemprop="offers"] span.price > span')).price
        } else if (domain === 'calendars') {
            price = (await scrapeSite(page, url, 'div[itemprop="offers"] span.price > span')).price
        } else if (domain === 'campmor') {
            price = (await scrapeSite(page, url, 'span#product-price')).price
        } else if (domain === 'campsaver') {
            price = (await scrapeSite(page, url, 'div._1Q0leAiE span._1dcNN-bW')).price
        } else if (domain === 'carealotpets') {
            price = (await scrapeSite(page, url, 'span[itemprop="price"]')).price
        } else if (domain === 'cardhaus') {
            price = (await scrapeSite(page, url, 'div.productView-price span.price.price--withoutTax')).price
        } else if (domain === 'cduniverse') {
            price = (await scrapeSite(page, url, 'div.cc-atc-price')).price
        } else if (domain === 'chewy') {
            price = (await scrapeSite(page, url, 'div#pricing p.price > span.ga-eec__price')).price
        } else if (domain === 'christianbook') {
            price = (await scrapeSite(page, url, 'span.CBD-ProductDetailActionPrice')).price
        } else if (domain === 'costco') {
            price = (await scrapeSite(page, url, 'span[automation-id="productPriceOutput"]')).price
        } else if (domain === 'cyclegear') {
            price = (await scrapeSite(page, url, 'div.sku-selector-pricing__price-retail > span.mny')).price
        } else if (domain === 'deepdiscount') {
            price = (await scrapeSite(page, url, 'span.aec-price div.aec-custprice')).price
        } else if (domain === 'dickssportinggoods') {
            price = (await scrapeSite(page, url, 'span.product-price')).price
        } else if (domain === 'dillards') {
            price = (await scrapeSite(page, url, 'div.price-wrapper span.price')).price
        } else if (domain === 'dollargeneral') {
            price = (await scrapeSite(page, url, 'span.product-price')).price
        } else if (domain === 'dorksidetoys') {
            price = (await scrapeSite(page, url, 'span#productPrice')).price
        } else if (domain === 'empiretoyshop') {
            price = (await scrapeSite(page, url, 'span#ProductPrice')).price
        } else if (domain === 'entertainmentearth') {
            price = (await scrapeSite(page, url, 'div.product-price')).price
        } else if (domain === 'entirelypets') {
            price = (await scrapeSite(page, url, 'div.sale-price > span.sale-price')).price
        } else if (domain === 'etundra') {
            price = (await scrapeSite(page, url, 'div.product-info div[itemprop="offers"] span[itemprop="price"]')).price
        } else if (domain === 'fpnyc') {
            price = (await scrapeSite(page, url, 'span.priceCurrent')).price
        } else if (domain === 'fye') {
            price = (await scrapeSite(page, url, 'span.price-sales')).price
        } else if (domain === 'fun') {
            price = (await scrapeSite(page, url, 'div.purchase__price span.price')).price
        } else if (domain === 'gamenerdz') {
            price = (await scrapeSite(page, url, 'div.productView-price span.price.price--withoutTax')).price
        } else if (domain === 'gearx') {
            price = (await scrapeSite(page, url, 'div#product-info div.product-info div.price-box span.regular-price span.price', 'div#product-info div.product-info div.price-box p.special-price span.price')).price
        } else if (domain === 'geekbuying') {
            price = (await scrapeSite(page, url, 'span#saleprice')).price
        } else if (domain === 'geminicollectibles') {
            price = (await scrapeSite(page, url, 'span[itemprop="price"]')).price
        } else if (domain === 'globalgolf') {
            price = (await scrapeSite(page, url, 'div#price div#divProdPiceDsply span.hg', 'div#price td.grn')).price
        } else if (domain === 'guitarcenter') {
            price = (await scrapeSite(page, url, 'section#PDPRightRailWrapper div.jsx-4072845441 div.price-condition div.price-container span.sale-price')).price
        } else if (domain === 'hardwareandtools') {
            price = (await scrapeSite(page, url, 'meta[property="product:price:amount"]', '', 'content')).price
        } else if (domain === 'healthypets') {
            price = (await scrapeSite(page, url, 'div.prices span.sale-price')).price
        } else if (domain === 'hobbylobby') {
            price = (await scrapeSite(page, url, 'span.price span.current:has(span.visuallyhidden)')).price
        } else if (domain === 'homedepot') {
            price = (await scrapeSite(page, url, 'div.price__wrapper div.price div.price-format__main-price', 'div#standard-price div.price')).price
        } else if (domain === 'hottopic') {
            price = (await scrapeSite(page, url, 'span.productdetail__info-pricing-original')).price
        } else if (domain === 'houzz') {
            throw new Error('Reject houzz site')
            // price = (await scrapeSite(page, url, 'span.pricing-info__price')).price
        } else if (domain === 'hsn') {
            price = (await scrapeSite(page, url, 'span[itemprop="price"]')).price
        } else if (domain === 'iherb') {
            price = (await scrapeSite(page, url, 'div#price')).price
        } else if (domain === 'ikea') {
            price = (await scrapeSite(page, url, 'div.range-revamp-pip-price-package__main-price span.range-revamp-price__integer')).price
        } else if (domain === 'jefferspet') {
            price = (await scrapeSite(page, url, 'div.wl-product-details div.price-group[itemprop="offers"] p.price span')).price
        } else if (domain === 'jensonusa') {
            price = (await scrapeSite(page, url, 'span#price', '', 'content')).price
        } else if (domain === 'kmart') {
            price = (await scrapeSite(page, url, 'h4 span.price-wrapper')).price
        } else if (domain === 'knifecenter') {
            price = (await scrapeSite(page, url, 'h2.price')).price
        } else if (domain === 'kohls') {
            price = (await scrapeSite(page, url, 'span.pdpprice-row2-main-text')).price
        } else if (domain === 'lakeside') {
            price = (await scrapeSite(page, url, 'article.grid-pd__desc p.sku-desc__caption span.sku-desc__price')).price
        } else if (domain === 'lowes') {
            // price = (await scrapeSite(page, url, 'span.finalPrice > div.sc-hGPBjI, span.finalPrice span.aPrice')).price
            price = (await scrapeSite(page, url, 'span.finalPrice > div.sc-hGPBjI', 'span.finalPrice span.aPrice')).price
        } else if (domain === 'lovelyskin') {
            price = (await scrapeSite(page, url, 'div.ls-product-price span.ls-price-xxlarge')).price
        } else if (domain === 'ltdcommodities') {
            price = (await scrapeSite(page, url, 'article.grid-pd__desc p.sku-desc__caption span.sku-desc__price')).price
        } else if (domain === 'lumens') {
            price = (await scrapeSite(page, url, 'div.active-price')).price
        } else if (domain === 'macys') {
            price = (await scrapeSite(page, url, 'div.lowest-sale-price')).price
        } else if (domain === 'meijer') {
            price = (await scrapeSite(page, url, 'span.product-info__sale-price > span')).price
        } else if (domain === 'michaels') {
            price = (await scrapeSite(page, url, 'div.is-desktop div.product-pricing div.product-sales-price')).price
        } else if (domain === 'midwayusa') {
            price = (await scrapeSite(page, url, 'div.priceblock div.text-l:not(.is-hidden)')).price
        } else if (domain === 'miniaturemarket') {
            price = (await scrapeSite(page, url, 'p.special-price span.price')).price
        } else if (domain === 'moosejaw') {
            price = (await scrapeSite(page, url, 'span#innerPrice span.price-set-updated')).price
        } else if (domain === 'netrition') {
            price = (await scrapeSite(page, url, 'div.price')).price
        } else if (domain === 'newegg') {
            price = (await scrapeSite(page, url, 'div.product-price ul.price li.price-current')).price
        } else if (domain === 'nothingbutsavings') {
            price = (await scrapeSite(page, url, 'div.product-dlist2-price')).price
        } else if (domain === 'officedepot') {
            price = (await scrapeSite(page, url, 'span.od-graphql-price-big-price')).price
        } else if (domain === 'overstock') {
            price = (await scrapeSite(page, url, 'span.css-1y4j0pq.e1eyx97t2')).price
        } else if (domain === 'partytoyz') {
            price = (await scrapeSite(page, url, 'em[itemprop="price"]')).price
        } else if (domain === 'petedge') {
            price = (await scrapeSite(page, url, 'meta[property="product:price:amount"]', '', 'content')).price
        } else if (domain === 'pfaltzgraff') {
            price = (await scrapeSite(page, url, 'span.pftm__price')).price
        } else if (domain === 'pharmaca') {
            price = (await scrapeSite(page, url, 'span[data-price-type="finalPrice"] span.price')).price
        } else if (domain === 'quill') {
            price = (await scrapeSite(page, url, 'span.price')).price
        } else if (domain === 'redtoolstore') {
            price = (await scrapeSite(page, url, 'div.product-form__info-item div.price-list > span.price.price--highlight')).price
        } else if (domain === 'rei') {
            price = (await scrapeSite(page, url, 'span#buy-box-product-price')).price
        } else if (domain === 'reptilesupplyco') {
            price = (await scrapeSite(page, url, 'span#our_price_display')).price
        } else if (domain === 'revzilla') {
            price = (await scrapeSite(page, url, 'div.product-show-details-pricing__price-retail > span.mny')).price
        } else if (domain === 'ringsidecollectibles') {
            price = (await scrapeSite(page, url, 'div.prod-price')).price
        } else if (domain === 'rockler') {
            price = (await scrapeSite(page, url, 'div.product-info-main span.price-final_price span[data-price-type="finalPrice"] span.price span.value')).price
        } else if (domain === 'ruralking') {
            price = (await scrapeSite(page, url, 'span.price', '', 'data-price-amount')).price
        } else if (domain === 'samys') {
            price = (await scrapeSite(page, url, 'div.product-price-container span.price')).price
        } else if (domain === 'samsclub') {
            price = (await scrapeSite(page, url, 'meta[itemprop="price"]', '', 'content')).price
        } else if (domain === 'savannahcomics') {
            price = (await scrapeSite(page, url, 'span.priceCurrent')).price
        } else if (domain === 'scheels') {
            price = (await scrapeSite(page, url, 'div#product-content div.product-price-wrapper span.price-sales span[itemprop="price"]')).price
        } else if (domain === 'scdkey') {
            price = (await scrapeSite(page, url, 'div.price-box p.special-price span.price')).price
        } else if (domain === 'sears') {
            price = (await scrapeSite(page, url, 'h4 span.price-wrapper')).price
        } else if (domain === 'shopdisney') {
            price = (await scrapeSite(page, url, 'div.prices:not(.sticky-price) div.price span.sales span.value')).price
        } else if (domain === 'shopyourway') {
            price = (await scrapeSite(page, url, 'div.regular-price span[itemprop="price"]')).price
        } else if (domain === 'shumistore') {
            price = (await scrapeSite(page, url, 'div.product-details div.price--main > span.money')).price
        } else if (domain === 'skinstore') {
            price = (await scrapeSite(page, url, 'p.productPrice_price')).price
        } else if (domain === 'solidsignal') {
            price = (await scrapeSite(page, url, 'span[itemprop="price"]')).price
        } else if (domain === 'sportsmansguide') {
            price = (await scrapeSite(page, url, 'div#stickyPricePH span.price')).price
        } else if (domain === 'slickdeals') {
            price = (await scrapeSite(page, url, 'div#detailsTop div.dealPrice')).price
        } else if (domain === 'staples') {
            price = (await scrapeSite(page, url, 'div#priceInfoContainer div.price-info__final_price_sku')).price
        } else if (domain === 'tactics') {
            price = (await scrapeSite(page, url, 'div.product-price-above-review div.product-price-container')).price
        } else if (domain === 'tacticalgear') {
            price = (await scrapeSite(page, url, 'li.price')).price
        } else if (domain === 'target') {
            price = (await scrapeSite(page, url, 'span[data-test="product-price"]')).price
        } else if (domain === 'thrivemarket') {
            price = (await scrapeSite(page, url, 'div.sc-1wimjb2-1')).price
        } else if (domain === 'theisens') {
            price = (await scrapeSite(page, url, 'strong[itemprop="price"]', '', 'content')).price
        } else if (domain === 'toyarena') {
            price = (await scrapeSite(page, url, 'span.price-money')).price
        } else if (domain === 'toys4u') {
            price = (await scrapeSite(page, url, 'div.productView-price span.price.price--withoutTax.price--main')).price
        } else if (domain === 'toywiz') {
            price = (await scrapeSite(page, url, 'div.productView-price.mobile-off span.price.price--withoutTax')).price
        } else if (domain === 'truevalue') {
            price = (await scrapeSite(page, url, 'div.product-info-main span.price')).price
        } else if (domain === 'udans') {
            price = (await scrapeSite(page, url, 'span#ProductPrice span.money')).price
        } else if (domain === 'ulta') {
            price = (await scrapeSite(page, url, 'div.ProductPricingPanel > span.Text')).price
        } else if (domain === 'villagesoffun') {
            price = (await scrapeSite(page, url, 'div.ProductMain span.ProductPrice.VariationProductPrice')).price
        } else if (domain === 'vitacost') {
            price = (await scrapeSite(page, url, 'div#blockPriceRating p[itemprop="price"]')).price
        } else if (domain === 'vipoutlet') {
            price = (await scrapeSite(page, url, 'div.product-meta-block div.walmart-price__amount > span.woocommerce-Price-amount')).price
        } else if (domain === 'walgreens') {
            // regex نیاز داره
            price = (await scrapeSite(page, url, '#sales-price > span > span:nth-child(8)', 'div.product-price span.product__price')).price
        } else if (domain === 'walmart') {
            price = (await scrapeSite(page, url, 'span[itemprop="price"]')).price
        } else if (domain === 'webstaurantstore') {
            price = (await scrapeSite(page, url, 'div#subject div.pricing p.price')).price
        } else if (domain === 'woodcraft') {
            price = (await scrapeSite(page, url, 'div.product-details__info span[itemprop="price"]')).price
        } else if (domain === 'woot') {
            price = (await scrapeSite(page, url, 'meta[property="product:price:amount"]', '', 'content')).price
        } else if (domain === 'worldmarket') {
            price = (await scrapeSite(page, url, 'meta[property="product:price:amount"]', '', 'content')).price
        } else if (domain === 'zoro') {
            price = (await scrapeSite(page, url, 'div.product-overview div.product-price span.product-price__price')).price
        } else if (domain === 'zavvi') {
            price = (await scrapeSite(page, url, 'p[data-product-price="price"]')).price
        } else if (domain === 'zulily') {
            price = (await scrapeSite(page, url, 'div#product-price span.js-pdp-main-price')).price
        } else {
            console.log(`domain ${domain} is not in list`)
        }*/

    } catch (e: any) {
        console.log("Error in scrapeSites: " + e.message)
    }

    console.log('Price is: ' + price)

    return {
        price,
        error
    }
}

async function scrapeSite(page: Page, url: string, selector: string, selector2: string = '', attr1: string = '', attr2: string = ''): Promise<{ price: number | null | undefined }> {
    await page.goto(url)
    let price
    try {
        try {
            await page.waitForSelector(selector, {timeout: 10000})
            if (attr1) {
                price = textToNumber(
                    await page.$eval(selector, elem => elem.getAttribute(attr1))
                )
            } else {
                price = textToNumber(
                    await getText(page, selector)
                )
            }
        } catch (e: any) {
            console.log('Error in Scrap selector1 source site: ' + e.message)
            if (!price && selector2) {
                await page.waitForSelector(selector2, {timeout: 10000})
                if (attr2) {
                    price = textToNumber(
                        await page.$eval(selector2, elem => elem.getAttribute(attr2))
                    )
                } else {
                    price = textToNumber(
                        await getText(page, selector2)
                    )
                }
            }
        }
    } catch (e: any) {
        console.log('Error in Scrap selector2 source site: ' + e.message)
    }

    return {
        price
    }

}

export async function logins(page: Page) {
    await amazonLogin(page)
    await login(
        page,
        'https://thrivemarket.com/login',
        'input#email',
        'input#password',
        'button[data-testid="Continue_CTA"]',
        'alimanssouri221@gmail.com',
        'Ali.87654321',
        5000,
        10000
    )

    await login(
        page,
        'https://www.zulily.com/?gdprSigninModal=1',
        'input#signin_email',
        'input#signin_password',
        'button[type="submit"]',
        'alimanssouri221@gmail.com',
        'Y:L,JtY%.F,7ZjG',
        5000,
        10000
    )

    /*await login(
        page,
        'https://www.costco.com/LogonForm',
        'input#signInName',
        'input#password',
        'button#next',
        'alimanssouri221@gmail.com',
        '5XR#X@g@yqqc568',
        20000,
        40000
    )*/
}

export async function login(
    page: Page,
    loginUrl: string,
    emailSelector: string,
    passSelector: string,
    submitSelector: string,
    username: string,
    password: string,
    waitStart: number,
    waitEnd: number
) {
    await page.goto(loginUrl)
    await sleep(waitStart)
    await typeText(page, emailSelector, username)
    await sleep(1000)
    await typeText(page, passSelector, password)
    await sleep(1000)
    await click(page, submitSelector)
    await sleep(waitEnd)
}

async function loginMeiger(page: Page) {
    await page.goto('https://accounts.meijer.com/manage/Account#/form/user')
    await sleep(10000)
    await typeText(page, 'input#mperks-email-phone', 'aliheshmati70@gmail.com')
    await sleep(10000)
    await click(page, 'button.btn')
    await sleep(4000)
    await typeText(page, 'input#mperks-password', 'ali123!@#')
    await sleep(4000)
    await click(page, 'button[type="submit"]')
    await sleep(15000)
}