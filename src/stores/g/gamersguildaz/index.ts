import Store from "../../Store";
import {Page} from "puppeteer";
import {EnumLoadType} from "../../../@types/EnumLoadType";
import {textToNumber} from "../../../lib/helper";

export default class Gamersguildaz extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div.label--in-stock', {timeout: 10000})
            const availability = await this.page.$eval('div.label--in-stock', elem => elem.textContent)

            if (availability?.toLowerCase().includes("instock") || availability?.toLowerCase().includes("in stock")) {
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
            await this.page.waitForSelector('meta[property="og:price:amount"]', {timeout: 3000})
            const price = textToNumber(
                await this.page.$eval('meta[property="og:price:amount"]', elem => elem.getAttribute("content"))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}