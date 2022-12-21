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
                    this.schemaCheckIfArray(schema)
                    continue
                } else if (schema['@graph']) {
                    if (Array.isArray(schema['@graph'])) {
                        this.schemaCheckIfArray(schema['@graph'])
                        continue
                    }
                } else if (schema['mainEntity']) {
                    if (!Array.isArray(schema['mainEntity'])) {
                        this.init([JSON.stringify(schema['mainEntity'])])
                        continue
                    }
                } else if (schema['offers'] !== undefined) {
                    this.productSchema = JSON.parse(schemas[i]?.trim().replace(';', ''))
                    break
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

    private schemaCheckIfArray(schema: any[]) {
        const newSchemas = []
        for (let i = 0; i < schema.length; i++) {
            newSchemas[i] = JSON.stringify(schema[i])
        }
        this.init(newSchemas)
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
        this.price = StoreSchema.fetchPriceFromOffer(offer)
        // @ts-ignore
        const availability = offer?.['availability']
        // @ts-ignore
        const itemCondition = offer?.['itemCondition']
        // @ts-ignore
        if (itemCondition && itemCondition?.toLowerCase()?.includes('new')) {
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

    private static fetchPriceFromOffer(offer: object): number {
        // @ts-ignore
        if (offer?.['price']) {
            // @ts-ignore
            return offer?.['price']
        } else {
            // @ts-ignore
            if (offer?.['priceSpecification']) {
                // @ts-ignore
                const priceSpecification = offer?.['priceSpecification']
                if (Array.isArray(priceSpecification)) {
                    let listPrice = NaN
                    let salePrice = NaN
                    for (let i = 0; i < priceSpecification.length; i++) {
                        if (priceSpecification[i]?.['priceType'] !== undefined) {
                            const priceType: string = priceSpecification[i]['priceType']
                            if (priceType.toLowerCase().includes('listprice')) {
                                listPrice = parseFloat(priceSpecification[i]['price'])
                            } else if (priceType.toLowerCase().includes('saleprice')) {
                                salePrice = parseFloat(priceSpecification[i]['price'])
                            }
                        } else {
                            salePrice = parseFloat(priceSpecification[i]['price'])
                        }
                    }

                    if (salePrice) return salePrice
                    else if (listPrice) return listPrice
                } else {
                    if (priceSpecification['price']) {
                        return parseFloat(priceSpecification['price'])
                    }
                }
            } else {
                // @ts-ignore
                if (offer?.['highprice'] || offer?.['highPrice']) {
                    // @ts-ignore
                    return offer?.['highprice'] || offer?.['highPrice']
                }
            }
        }

        return NaN
    }
}
