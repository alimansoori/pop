export type KeepaProductType = {
    csv: any[],
    categories: number[] | null,
    imagesCSV: string | null,
    manufacturer: string | null,
    title: string | null,
    asin: string,
    brand: string | null
    packageHeight: number,
    packageLength: number,
    packageWidth: number,
    packageWeight: number,
    packageQuantity: number,
    categoryTree: any[] | null,
    stats: {
        buyBoxPrice: number,
        buyBoxIsFBA: boolean,
        buyBoxIsAmazon: boolean,
        buyBoxIsUsed: boolean
    }
}