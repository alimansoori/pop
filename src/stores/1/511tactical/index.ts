import Store from '../../Store'

export default class Tactical extends Store {
    constructor(url: string) {
        super(url)

        this.addPriceSelector({
            selector: 'div.product-info-price span.price',
            attr: 'text',
        })
    }

    async productExistCalculate(): Promise<void> {}
}
