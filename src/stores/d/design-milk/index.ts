import Store from '../../Store'

export default class DesignMilk extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}
}
