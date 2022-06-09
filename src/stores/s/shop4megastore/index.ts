import Store from "../../Store";
import {Page} from "puppeteer";
import {EnumLoadType} from "../../../@types/EnumLoadType";

export default class Shop4megastore extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
        this.loadType = EnumLoadType.NET0
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailibilityBySchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}