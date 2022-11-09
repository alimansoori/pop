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
            try {
                const schema = JSON.parse(schemas[i]?.trim().replace(';', ''))
                if (Array.isArray(schema)) {
                    const newSchemas = []
                    for (let i = 0; i < schema.length; i++) {
                        newSchemas[i] = JSON.stringify(schema[i])
                    }
                    this.init(newSchemas)
                    continue
                } else if (schema['@graph']) {
                    if (Array.isArray(schema['@graph'])) {
                        const newSchemas = []
                        for (let i = 0; i < schema['@graph'].length; i++) {
                            newSchemas[i] = JSON.stringify(schema['@graph'][i])
                        }
                        this.init(newSchemas)
                    }
                    continue
                } else if (schema['@type'] === 'Product') {
                    this.productSchema = JSON.parse(schemas[i]?.trim().replace(';', ''))
                    break
                }
            } catch (e: any) {
                continue
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
        const offers: any = this.productSchema?.offers
        if (offers instanceof Array) {
            for (let i = 0; i < offers.length; i++) {
                if (this.offerIsObject(offers[i])) break
            }
        } else {
            this.offerIsObject(offers)
        }
    }

    private offerIsObject(offer: object): boolean {
        // @ts-ignore
        this.price = offer?.['price']
        // @ts-ignore
        const availability = offer?.['availability']
        // @ts-ignore
        const itemCondition = offer?.['itemCondition']
        // @ts-ignore
        if (itemCondition && itemCondition?.toLowerCase()?.includes('newcondition')) {
            if (availability?.toLowerCase().includes('instock')) {
                this.availability = true
            }
            return true
        }
        if (!itemCondition) {
            if (availability?.toLowerCase().includes('instock')) {
                this.availability = true
            }
        }
        return false
    }
}
