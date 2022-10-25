import Store from '../../Store'

export default class Netrition extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}
}
