import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";
import {EnumLoadType} from "../../../@types/EnumLoadType";

export default class Nordstrom extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('link[itemprop="availability"]', {timeout: 10000})
            const availability = await this.page.$eval('link[itemprop="availability"]', elem => elem.getAttribute('href'))

            if (availability?.toLowerCase().includes("instock")) {
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
                await this.page.$eval('*[itemprop="price"]', elem => elem.getAttribute("content"))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}