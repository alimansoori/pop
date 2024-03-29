import { Offer, Product, WithContext } from 'schema-dts'

export default class StoreSchema {
    private productSchema: WithContext<Product> | undefined
    name: string | undefined
    upc: string | undefined
    image: string[] = []
    price = NaN
    availability = false

    constructor(schemas: string[]) {
        this.init(schemas)
        this.fetchName()
        this.fetchUPC()
        this.fetchImage()
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
                } else if (schema['hasVariant']) {
                    if (Array.isArray(schema['hasVariant'])) {
                        this.schemaCheckIfArray(schema['hasVariant'])
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
                console.log(e.message)
                continue
            }
        }
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

    private fetchUPC() {
        if (!this.upc && this.productSchema?.gtin13) {
            this.upc = String(this.productSchema?.gtin13)
        } else if (!this.upc && this.productSchema?.mpn) {
            this.upc = String(this.productSchema?.mpn)
        } else if (!this.upc && this.productSchema?.gtin) {
            this.upc = String(this.productSchema?.gtin)
        } else if (!this.upc && this.productSchema?.gtin14) {
            this.upc = String(this.productSchema?.gtin14)
        } else if (!this.upc && this.productSchema?.gtin12) {
            this.upc = String(this.productSchema?.gtin12)
        }
    }

    private fetchImage() {
        if (this.productSchema?.image) {
            if (Array.isArray(this.productSchema?.image) && this.productSchema?.image.length) {
                for (let i = 0; i < this.productSchema?.image.length; i++) {
                    if (typeof this.productSchema?.image[i] === 'object') {
                        this.imageIsObject(this.productSchema?.image[i])
                    } else {
                        this.image.push(String(this.productSchema?.image[i]))
                    }
                }
            } else if (typeof this.productSchema?.image === 'object') {
                this.imageIsObject(this.productSchema?.image)
            } else {
                this.image.push(String(this.productSchema?.image))
            }
        }
    }

    private imageIsObject(image: any) {
        // @ts-ignore
        if (image['image']) {
            // @ts-ignore
            this.image.push(image['image'])
        }
        // @ts-ignore
        else if (image['url']) {
            // @ts-ignore
            this.image.push(image['url'])
        } else if (image['contentUrl']) {
            // @ts-ignore
            this.image.push(image['contentUrl'])
        }
    }

    private fetchOffer(off?: any) {
        if (!this.productSchema?.offers) return
        const offers: any = off ? off : this.productSchema?.offers
        if (offers instanceof Array) {
            for (let i = 0; i < offers.length; i++) {
                if (offers[i] instanceof Array) {
                    for (let j = 0; j < offers[i].length; j++) {
                        if (this.offerIsObject(offers[i][j])) break
                    }
                    break
                } else if (this.offerIsObject(offers[i])) break
            }
        } else if (offers?.offers) {
            this.fetchOffer(offers?.offers)
        } else {
            this.offerIsObject(offers)
        }
    }

    private offerIsObject(offer: Offer): boolean {
        // @ts-ignore
        this.price = StoreSchema.fetchPriceFromOffer(offer)
        StoreSchema.fetchUPCFromOffer(offer)
        this.name = !this.name ? StoreSchema.fetchNameFromOffer(offer) : this.name
        // @ts-ignore
        const availability = offer?.availability
        // @ts-ignore
        const itemCondition = offer?.['itemCondition']
        // @ts-ignore
        if (itemCondition && itemCondition?.toLowerCase()?.includes('new')) {
            // @ts-ignore
            if (availability?.toLowerCase().includes('instock')) {
                this.availability = true
            }
            return true
        }
        if (!itemCondition) {
            // @ts-ignore
            if (availability?.toLowerCase().includes('instock')) {
                this.availability = true
            }
        }
        return false
    }

    private static fetchPriceFromOffer(offer: Offer): number {
        // @ts-ignore
        if (offer?.['price']) {
            // @ts-ignore
            return offer?.['price']
        } else {
            // @ts-ignore
            if (offer?.['priceSpecification']) {
                // @ts-ignore
                const priceSpecification = offer?.priceSpecification
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
                    // @ts-ignore
                    if (priceSpecification['price']) {
                        // @ts-ignore
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

    private static fetchUPCFromOffer(offer: Offer): void {
        // @ts-ignore
        if (offer?.gtin13) {
            // @ts-ignore
            this.upc = offer?.gtin13
        } else if (offer?.gtin) {
            // @ts-ignore
            this.upc = offer?.gtin
        } else if (offer?.gtin14) {
            // @ts-ignore
            this.upc = offer?.gtin14
        } else if (offer?.gtin12) {
            // @ts-ignore
            this.upc = offer?.gtin12
        } else if (offer?.mpn) {
            // @ts-ignore
            this.upc = offer?.mpn
        }
    }

    private static fetchNameFromOffer(offer: Offer): string {
        // @ts-ignore
        if (offer?.['name']) {
            // @ts-ignore
            return offer?.['name']
        }

        return ''
    }
}
