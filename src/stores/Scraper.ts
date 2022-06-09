import IStore from "./IStore";
import IScraper from "./IScraper";
import {Page} from "puppeteer";
import Url from "../lib/Url";
import {click, textToNumber} from "../lib/helper";
import save2csv from "../utils/save2csv";
import sleep from "../utils/sleep";

export default class Scraper implements IScraper {
    private webSite: IStore
    private page: Page

    constructor(webSite: IStore) {
        this.webSite = webSite
        this.page = webSite.getPage()
    }

    scrapPageProductDetail(): void {
    }

    scrapPageProducts(): void {
        this.asyncScrapPageProducts()
    }

    scrap(): void {
    }

    private asyncScrapPageProducts = async () => {
        const pageUrls = this.webSite.getCategoriesUrl()

        for (let i = 0; i < pageUrls.length; i++) {
            try {
                await this.categoryScrape(pageUrls[i])
            } catch (e) {
                continue
            }
        }
    }

    private categoryScrape = async (categoryUrl: string) => {
        try {
            await this.page.goto(categoryUrl)
            if (!this.webSite.options().hasCategoryTreeNavigate()) {
                await this.productsPageScrape(categoryUrl)
            }

            await this.page.waitForSelector(this.webSite.selectors().getCategoryBlock(), {timeout: 5000})
            await this.categoryNavScrape(categoryUrl)
        } catch (e: any) {
            await this.page.waitForSelector(this.webSite.selectors().getCategoryProductBlock(), {timeout: 4000})
            await this.productsPageScrape(categoryUrl)
            console.log('Scrap products page: ' + categoryUrl)
        }
    }

    private categoryNavScrape = async (categoryUrl: string) => {
        try {
            const categories = await this.page.$$eval(this.webSite.selectors().getCategoryBlock(), (links) =>
                links.map((link) => {
                    if (link.hasAttribute('href')) return link.getAttribute('href')

                    const linkElems = link.querySelectorAll('a')
                    for (let i = 0; i < linkElems.length; i++) {
                        return linkElems[i].getAttribute('href')
                    }
                })
            );

            for (let i = 0; i < categories.length; i++) {
                let url = categories[i]
                // @ts-ignore
                if (!Url.isValidHttpUrl(categories[i])) {
                    url = this.webSite.getUrl() + categories[i]
                }
                // @ts-ignore
                await this.categoryScrape(url)
            }
        } catch (e: any) {
            console.log("Error categoryNavScrape method")
            console.log(e.message)
            // console.log(e.trace)
        }
    }

    private productsPageScrape = async (productsPageUrl: string) => {
        try {
            if (this.webSite.selectors().getSeeMore()) {
                let i = 1
                while (await this.hasSelector(this.webSite.selectors().getSeeMore())) {
                    if (await this.hasSelector(this.webSite.selectors().getSeeMore())) {
                        await this.scrollDown()
                        await this.page.click(this.webSite.selectors().getSeeMore(), {delay: 10})
                    }
                }
                await this.scrollDown()
                const products = await this.getProducts()

                this.saveCSV(products)
                console.log(products)
            } else {
                let nextPage = true
                let i = 1
                while (nextPage) {

                    if (!await this.hasNextPage()) {
                        nextPage = false
                    } else {
                        i++
                    }

                    if (i === 1) {
                        await this.page.goto(productsPageUrl)
                    } else {
                        await this.page.goto(Url.insertParam(this.page.url(), this.webSite.getPageParam(), `${i}`))
                    }

                    await this.scrollDown()

                    const products = await this.getProducts()

                    this.saveCSV(products)
                    console.log(products)

                    if (!nextPage) {
                        break
                    }
                }
            }


        } catch (e: any) {
            console.log(`Error in productsPageScrape Method With Url: ${productsPageUrl} and message => ${e.message}`)
        }
    }

    protected getProducts = async (): Promise<any[]> => {
        const selectors = JSON.stringify({
            categoryProductBlockSelector: this.webSite.selectors().getCategoryProductBlock(),
            categoryProductUrlSelector: this.webSite.selectors().getCategoryProductUrl(),
            categoryProductImageSelector: this.webSite.selectors().getCategoryProductImg(),
            categoryProductPriceSelector: this.webSite.selectors().getCategoryProductPrice(),
            categoryProductTitleSelector: this.webSite.selectors().getCategoryProductTitle(),
            addToCartBtnSelector: this.webSite.selectors().getAddToCartBtn(),
            addToCartBtnContent: this.webSite.getAddToCartBtnContent()
        })

        await this.page.waitForSelector(
            this.webSite.selectors().getCategoryProductBlock(),
            {timeout: 5000}
        )

        await this.page.waitForSelector(
            this.webSite.selectors().getCategoryProductBlock() + ' ' + this.webSite.selectors().getCategoryProductTitle(),
            {timeout: 5000}
        )
        await this.page.waitForSelector(
            this.webSite.selectors().getCategoryProductBlock() + ' ' + this.webSite.selectors().getCategoryProductImg(),
            {timeout: 5000}
        )
        await this.page.waitForSelector(
            this.webSite.selectors().getCategoryProductBlock() + ' ' + this.webSite.selectors().getCategoryProductPrice(),
            {timeout: 5000}
        )
        await this.page.waitForSelector(
            this.webSite.selectors().getCategoryProductBlock() + ' ' + this.webSite.selectors().getCategoryProductImg(),
            {timeout: 5000}
        )

        const products = await this.page.$$eval(this.webSite.selectors().getCategoryProductBlock(), (productsElements, _args) => {
            const selectors = JSON.parse(<string>_args)
            console.log(_args)
            let prs: any[] = []
            for (let i = 0; i < productsElements.length; i++) {
                let title
                if (productsElements[i]?.querySelector(selectors?.categoryProductTitleSelector)?.tagName === 'IMG') {
                    title = productsElements[i]?.querySelector(selectors?.categoryProductTitleSelector)?.getAttribute('alt').trim()
                } else {
                    title = productsElements[i]?.querySelector(selectors?.categoryProductTitleSelector)?.textContent.trim()
                }

                if (selectors?.addToCartBtnSelector && productsElements[i]?.querySelector(selectors?.addToCartBtnSelector)?.textContent === selectors?.addToCartBtnContent) {
                    prs.push({
                        url: productsElements[i]?.querySelector(selectors?.categoryProductUrlSelector)?.getAttribute('href'),
                        img: productsElements[i]?.querySelector(selectors?.categoryProductImageSelector)?.getAttribute('src'),
                        price: productsElements[i]?.querySelector(selectors?.categoryProductPriceSelector)?.textContent.trim(),
                        title: title,
                        availability: null
                    })
                } else {
                    prs.push({
                        url: productsElements[i]?.querySelector(selectors?.categoryProductUrlSelector)?.getAttribute('href'),
                        img: productsElements[i]?.querySelector(selectors?.categoryProductImageSelector)?.getAttribute('src'),
                        price: productsElements[i]?.querySelector(selectors?.categoryProductPriceSelector)?.textContent.trim(),
                        title: title,
                        availability: null
                    })
                }
            }
            return prs
            /*return productsElements?.map((elem) => {
                if (elem?.querySelector(selectors.addToCartBtnSelector)?.textContent === selectors.addToCartBtnContent) {
                    return {
                        url: elem?.querySelector(selectors.categoryProductUrlSelector)?.getAttribute('href'),
                        img: elem?.querySelector(selectors.categoryProductImageSelector)?.getAttribute('src'),
                        price: elem?.querySelector(selectors.categoryProductPriceSelector)?.textContent,
                        title: elem?.querySelector(selectors.categoryProductTitleSelector)?.textContent,
                        availability: null
                    }
                }
            })*/
        }, selectors)

        return products
    }

    protected saveCSV = (products: any[]) => {
        for (let i = 0; i < products.length; i++) {
            if (textToNumber(products[i]['price']) > 60) continue
            let url = products[i].url
            // @ts-ignore
            if (!Url.isValidHttpUrl(url)) {
                url = this.webSite.getUrl() + products[i].url
            }
            save2csv(`${this.webSite.getDomain()}.csv`, [{
                url: url,
                img: products[i].img,
                price: products[i].price,
                title: products[i].title,
                availability: products[i].availability,
            }])
        }
    }


    protected hasSelector = async (selector: string): Promise<boolean> => {
        try {
            await this.page.waitForSelector(selector, {timeout: 2000, visible: true})
            return true
        } catch (e: any) {
            return false
        }
    }

    protected hasNextPage = async (): Promise<boolean> => {
        if (!this.webSite.selectors().getNextPage()) return false

        try {
            await this.page.waitForSelector(this.webSite.selectors().getNextPage(), {timeout: 5000})
            return true
        } catch (e: any) {
            return false
        }
    }

    private scrollDown = async () => {
        if (!this.webSite.hasScrollDown()) return false
        const pageHeight = await this.page.evaluate(() => {
            return document.body.scrollHeight
        });
        for (let i = 0; i < pageHeight; i = i + 100) {
            await this.page.mouse.wheel({deltaY: i})
            await sleep(100)
        }
        await sleep(1000)
        return true
    }

}

















