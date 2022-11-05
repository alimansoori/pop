import { Product, WithContext } from 'schema-dts'

export default class StoreSchema {
    private productSchema: WithContext<Product> | undefined
    name: string | undefined
    price = NaN
    availability = false

    constructor(schemas: string[]) {
        this.init(schemas)
        this.fetchName()
        this.fetchOffer()
    }

    private init(schemas: string[]) {
        for (let i = 0; i < schemas.length; i++) {
            const schema = JSON.parse(schemas[i]?.trim().replace(';', ''))
            if (schema['@type'] === 'Product') {
                this.productSchema = JSON.parse(schemas[i]?.trim().replace(';', ''))
            }
        }

        // console.log(this.productSchema)
    }

    private fetchName() {
        if (this.productSchema?.name) {
            this.name = String(this.productSchema?.name)
        }
    }

    private fetchOffer() {
        if (!this.productSchema?.offers) return
        if (typeof this.productSchema?.offers === 'object') {
            // @ts-ignore
            this.price = this.productSchema?.offers?.['price']
            // @ts-ignore
            const availability = this.productSchema?.offers?.['availability']
            // @ts-ignore
            const itemCondition = this.productSchema?.offers?.['itemCondition']
            // @ts-ignore
            if (itemCondition && itemCondition?.toLowerCase()?.includes('newcondition')) {
                if (availability?.toLowerCase().includes('instock')) {
                    this.availability = true
                }
            }
            if (!itemCondition) {
                this.availability = availability
            }
        }
    }
}
