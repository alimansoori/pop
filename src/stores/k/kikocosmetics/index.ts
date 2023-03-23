import Store from '../../Store'

export default class Kikocosmetics extends Store {
    constructor(url: string) {
        super(url)
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h2.ProductDetails__Title')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button.Button--AddToCart > span.Label',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*[itemprop="price"]',
            render: 'content',
        })
    }
}
