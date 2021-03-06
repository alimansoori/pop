import Store from "../../Store";
import {Page} from "puppeteer";

export default class Lakeside extends Store {
    constructor(page: Page, url: string) {
        super(page, url);

        this.addPriceSelector({
            selector: 'aside#js-productdetail__cont--id p.sku-desc__caption span.sku-desc__price',
            attr: 'text'
        })
    }
}