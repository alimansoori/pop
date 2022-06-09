import Store from "../../Store";
import {Page} from "puppeteer";

export default class DesignMilk extends Store {
    constructor(page: Page, url: string) {
        super(page, url);

        this.addPriceSelector({
            selector: 'meta[property="product:price:amount"]',
            attr: 'content'
        })
        this.addPriceSelector({
            selector: 'span[itemprop="price"]',
            attr: 'content'
        })
        this.addPriceSelector({
            selector: 'span[itemprop="price"] span.money',
            attr: 'text'
        })
    }
}