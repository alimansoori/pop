import { Product } from 'schema-dts'

export default class StoreSchema {
    private productSchema: Product | undefined
    name: string | undefined
    price = NaN
    availability = false

    constructor(schemas: string[]) {
        this.init(schemas)
        this.fetchName()
        this.fetchOffer()
        console.log(this.name)
    }

    private init(schemas: string[]) {
        for (let i = 0; i < schemas.length; i++) {
            const schema = JSON.parse(schemas[i]?.trim().replace(';', ''))
            if (schema['@type'] === 'Product') {
                this.productSchema = JSON.parse(schemas[i]?.trim().replace(';', ''))
            }
        }
    }

    private fetchName() {
        if (this?.productSchema?.name) {
            this.name = String(this.productSchema?.name)
        }
    }

    private fetchOffer() {
        if (!this?.productSchema?.offers) return
        if (typeof this?.productSchema?.offers === 'object') {
            // @ts-ignore
            this.price = this?.productSchema?.offers?.['price']
        }
    }
}
