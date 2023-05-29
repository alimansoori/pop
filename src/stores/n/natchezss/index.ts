import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Natchezss extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.sc-hRLfyG')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'h1.sc-hRLfyG',
            render: 'text',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: '',
            render: '',
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'sc-ezzafa',
            render: 'text',
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'p.sc-gLwjMs',
            render: 'text',
        })
    }
}
