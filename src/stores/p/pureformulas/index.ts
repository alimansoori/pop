import Store from "../../Store";
import {Page} from "puppeteer";
import {EnumLoadType} from "../../../@types/EnumLoadType";
import {textToNumber} from "../../../lib/helper";

export default class Pureformulas extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button[aria-label="Add to Cart"]', {timeout: 10000})
            this.setAvailability(true)
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('*[itemprop="price"]', {timeout: 3000})
            const price = textToNumber(
                await this.page.$eval('*[itemprop="price"]', elem => elem.getAttribute('content'))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}