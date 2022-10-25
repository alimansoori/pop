import Store from '../../Store'

export default class Kmart extends Store {
    constructor(url: string) {
        super(url)

        this.addPriceSelector({
            selector: 'h4 > span.price-wrapper',
            attr: 'text',
        })
    }

    async productExistCalculate(): Promise<void> {}
}
