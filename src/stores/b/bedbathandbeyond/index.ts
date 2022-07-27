import Store from "../../Store";
import {Page} from "puppeteer";
import {EnumLoadType} from "../../../@types/EnumLoadType";

export default class Bedbathandbeyond extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
        this.loadType = EnumLoadType.DOC_LOADED
    }

    /*async availibilityCalculate(): Promise<void> {
        await this.checkAvailibilityBySchemas('script[id="pdpSchemaGraph"]', {hidden: true})
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[id="pdpSchemaGraph"]', {hidden: true})
    }*/
}