import Store from "../../Store";
import {Page} from "puppeteer";
import {categories} from "./categories";
import {textToNumber} from "../../../lib/helper";

export default class Myotcstore extends Store {
    constructor(page: Page, url: string) {
        super(page, url);

        this.setScrollDown(true)
            .setCategoriesUrl(categories)
            .selectors()
                .setCategoryBlock('*[id="product-listing-container"] ul > li.product')
                .setCategoryProductTitle('h4.card-title')
                .setCategoryProductPrice('span.price.price--withoutTax')
                .setAddToCartBtn('div.card-figcaption--action-buttons > a.button:not(.button--secondary)')
                .setCategoryProductImg('div.card-img-container > img')
                .setCategoryProductUrl('figure.card-figure > a')
                .setCategoryPagination('page')
                .setNextPage('nav > ul > li.pagination-item.pagination-item--next')
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('meta[itemprop="availability"]', {timeout: 10000})
            const availability = await this.page.$eval('meta[itemprop="availability"]', elem => elem.getAttribute('content'))

            if (availability?.toLowerCase() === "http://schema.org/instock" || availability?.toLowerCase() === "https://schema.org/instock") {
                this.setAvailability(true)
            } else {
                this.setAvailability(false)
            }
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('meta[itemprop="price"]', {timeout: 3000})
            const price = textToNumber(
                await this.page.$eval('meta[itemprop="price"]', elem => elem.getAttribute('content'))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }

}