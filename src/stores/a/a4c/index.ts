import Store from '../../Store'

export default class A4c extends Store {
    constructor(url: string) {
        super(url)

        this.addPriceSelector({
            selector: 'div.price--main span.money',
            attr: 'text',
        })
    }

    async productExistCalculate(): Promise<void> {}
}
