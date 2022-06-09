import Store from "../../Store";
import {Page} from "puppeteer";
import {EnumLoadType} from "../../../@types/EnumLoadType";
import {textToNumber} from "../../../lib/helper";

export default class Insanetoyshop extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button[id="product-add-to-cart"]', {timeout: 10000})
            const availability = await this.page.$eval('button[id="product-add-to-cart"]', elem => elem.textContent)

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
            await this.page.waitForSelector('*[itemprop="price"]', {timeout: 3000})
            const price = textToNumber(
                await this.page.$eval('*[itemprop="price"]', elem => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}