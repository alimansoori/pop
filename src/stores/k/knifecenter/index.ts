import Store from '../../Store'

export default class Knifecenter extends Store {
    constructor(url: string) {
        super(url)
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div[id="product"] h1')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'a.instock',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'h2.price span:nth-child(2)',
            render: 'text',
        })
    }
}
