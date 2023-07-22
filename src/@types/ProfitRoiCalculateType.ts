export type ProfitRoiCalculateType = {
    sellPrice: number
    buyCost: number
    category: string
    referralFeePercent?: number
    fbaFees?: {
        pickAndPackFee: number
    }
    packageLength: number
    packageWidth: number
    packageHeight: number
    packageWeight: number
}
