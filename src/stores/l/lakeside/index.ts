import Store from '../../Store'

export default class Lakeside extends Store {
    constructor(url: string) {
        super(url)

        this.addPriceSelector({
            selector: 'aside#js-productdetail__cont--id p.sku-desc__caption span.sku-desc__price',
            attr: 'text',
        })
    }

    async productExistCalculate(): Promise<void> {}
}
