export type KeepaOutputType = {
    timestamp: number
    tokensLeft: number
    refillIn: number
    refillRate: number
    tokenFlowReduction: number
    tokensConsumed: number
    processingTimeInMs: number
    products: any[]
    error: {
        type: string
        message: string
    }
}
