import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";
import {EnumLoadType} from "../../../@types/EnumLoadType";

export default class Nextwarehouse extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async availibilityCalculate(): Promise<void> {
        this.setAvailability(true)
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}