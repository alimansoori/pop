import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";

export default class Nothingbutsavings extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async productExistCalculate(): Promise<void> {
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div[id="details-cart-button"]', {timeout: 10000})
            const availability = await this.page.$eval('div[id="details-cart-button"]', elem => elem.textContent)

            if (availability?.toLowerCase().includes("add to cart")) {
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
            await this.page.waitForSelector('div.product-container > div.product-right > div.product-details:first-child > div.product-dlist2-price', {timeout: 3000})
            const price = textToNumber(
                await this.page.$eval('div.product-container > div.product-right > div.product-details:first-child > div.product-dlist2-price', elem => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}