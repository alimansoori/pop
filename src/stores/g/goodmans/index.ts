import Store from '../../Store'

export default class Goodmans extends Store {
    constructor(url: string) {
        super(url)
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.c-product-info-card__headline')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'div#itemCallToAction > div.h5',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div[id="itemPrice"]',
            render: 'data-base-price',
        })
    }
}
