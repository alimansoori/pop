export type KeepaProductType = {
    csv: any[]
    categories: number[] | null
    imagesCSV: string | null
    manufacturer: string | null
    title: string
    asin: string
    brand: string | null
    packageHeight: number
    packageLength: number
    packageWidth: number
    packageWeight: number
    packageQuantity: number
    buyBoxIsAmazon: boolean
    upcList: [string]
    categoryTree: any[] | null
    stats: {
        buyBoxPrice: number
        buyBoxIsFBA: boolean
        buyBoxIsAmazon: boolean
        buyBoxIsUsed: boolean
        salesRankDrops30: number
    }
}
