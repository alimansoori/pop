import Store from "../../Store";
import {Page} from "puppeteer";
import {EnumLoadType} from "../../../@types/EnumLoadType";
import {textToNumber} from "../../../lib/helper";

export default class Woodcraft extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div.product-details__add-to-cart-action > button[value="add_to_cart"]', {timeout: 10000})
            const availability = await this.page.$eval('div.product-details__add-to-cart-action > button[value="add_to_cart"]', elem => elem.textContent)

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
            await this.page.waitForSelector('div.product-details__prices *[itemprop="price"]', {timeout: 3000})
            const price = textToNumber(
                await this.page.$eval('div.product-details__prices *[itemprop="price"]', elem => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}