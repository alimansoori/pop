import Store from '../../Store'

export default class Meijer extends Store {
    constructor(url: string) {
        super(url)

        this.addPriceSelector({
            selector: 'span.product-info__sale-price > span',
            attr: 'text',
        })
    }

    async productExistCalculate(): Promise<void> {}
}
