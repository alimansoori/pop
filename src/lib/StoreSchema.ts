import { Product } from 'schema-dts'

export default class StoreSchema {
    private readonly productSchema: Product | undefined

    constructor(schemas: string[]) {
        for (let i = 0; i < schemas.length; i++) {
            const schema = JSON.parse(schemas[i])
            if (schema['@type'] === 'Product') {
                this.productSchema = JSON.parse(schemas[i])
            }
        }
    }
}
