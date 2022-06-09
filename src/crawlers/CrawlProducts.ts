import ICrawler from "./ICrawler";
import IStore from "../stores/IStore";
import Url from "../lib/Url";
import sleep from "../utils/sleep";
import {textToNumber} from "../lib/helper";
import save2csv from "../utils/save2csv";

const randomUseragent = require('random-useragent');

export default class CrawlProducts implements ICrawler {
    private store
    private page
    private readonly url

    constructor(store: IStore, url: string) {
        this.store = store
        this.page = store.getPage()
        this.url = url
    }

    async crawl(): Promise<void> {
        try {
            // await this.page.goto(this.url)
            await this.page.setUserAgent(randomUseragent.getRandom())

            if (this.store.selectors().getSeeMore()) {
                while (await this.hasSelector(this.store.selectors().getSeeMore())) {
                    if (await this.hasSelector(this.store.selectors().getSeeMore())) {
                        await this.scrollDown()
                        await this.page.click(this.store.selectors().getSeeMore(), {delay: 10})
                    }
                }
                await this.scrollDown()
                const products = await this.getProducts()

                this.saveCSV(products)
                console.log(products)
            }
            else {
                let nextPage = true
                let i = 1
                while (nextPage) {
                    if (!await this.hasNextPage()) {
                        nextPage = false
                    } else {
                        i++
                    }

                    if (i > 1) {
                        await this.page.goto(Url.insertParam(this.page.url(), this.store.getPageParam(), `${i}`))
                        // await this.page.setUserAgent(randomUseragent.getRandom())
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
            throw new Error(e.message)
        }
    }

    protected saveCSV = (products: any[]) => {
        for (let i = 0; i < products.length; i++) {
            if (textToNumber(products[i]['price']) > 60) continue
            let url = products[i].url
            // @ts-ignore
            if (!Url.isValidHttpUrl(url)) {
                url = this.store.getUrl() + products[i].url
            }
            save2csv(`${this.store.getDomain()}.csv`, [{
                url: url,
                img: products[i].img,
                price: products[i].price,
                title: products[i].title,
                availability: products[i].availability,
            }])
        }
    }

    protected getProducts = async (): Promise<any[]> => {
        const selectors = JSON.stringify({
            categoryProductBlockSelector: this.store.selectors().getCategoryProductBlock(),
            categoryProductUrlSelector: this.store.selectors().getCategoryProductUrl(),
            categoryProductImageSelector: this.store.selectors().getCategoryProductImg(),
            categoryProductPriceSelector: this.store.selectors().getCategoryProductPrice(),
            categoryProductTitleSelector: this.store.selectors().getCategoryProductTitle(),
            addToCartBtnSelector: this.store.selectors().getAddToCartBtn(),
            addToCartBtnContent: this.store.getAddToCartBtnContent()
        })

        await this.page.waitForSelector(
            this.store.selectors().getCategoryProductBlock(),
            {timeout: 5000}
        )

        await this.page.waitForSelector(
            this.store.selectors().getCategoryProductBlock() + ' ' + this.store.selectors().getCategoryProductTitle(),
            {timeout: 5000}
        )
        await this.page.waitForSelector(
            this.store.selectors().getCategoryProductBlock() + ' ' + this.store.selectors().getCategoryProductImg(),
            {timeout: 5000}
        )
        await this.page.waitForSelector(
            this.store.selectors().getCategoryProductBlock() + ' ' + this.store.selectors().getCategoryProductPrice(),
            {timeout: 5000}
        )
        await this.page.waitForSelector(
            this.store.selectors().getCategoryProductBlock() + ' ' + this.store.selectors().getCategoryProductImg(),
            {timeout: 5000}
        )

        const products = await this.page.$$eval(this.store.selectors().getCategoryProductBlock(), (productsElements, _args) => {
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

    protected hasNextPage = async (): Promise<boolean> => {
        if (!this.store.selectors().getNextPage()) return false

        try {
            await this.page.waitForSelector(this.store.selectors().getNextPage(), {timeout: 5000})
            return true
        } catch (e: any) {
            return false
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

    private scrollDown = async () => {
        if (!this.store.hasScrollDown()) return false
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