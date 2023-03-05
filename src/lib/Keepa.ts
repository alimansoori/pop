import { KeepaInputType } from '../@types/KeepaInputType'
import axios from 'axios'
import { sleep } from '../utils/sleep'
import { KeepaOutputType } from '../@types/KeepaOutputType'
import { KeepaProductType } from '../@types/KeepaProductType'
import ProfitRoiCalculate from './ProfitRoiCalculate'
import { EnumCategories } from '../@types/EnumCategories'

export default class Keepa {
    private input: KeepaInputType
    private key = '9lpb4evo4c87vkajmcnfft5dirt97imditg32d27kdp7pm0c861rqc44o6pv1tct'
    private key2 = '42t2rfuagph4t942ccfi5l97lkkp5dh7ak0sm2brnc4a66nh4ouj82edn0pjp0on'
    // private key = "42t2rfuagph4t942ccfi5l97lkkp5dh7ak0sm2brnc4a66nh4ouj82edn0pjp0on"
    private apiUrl = 'https://api.keepa.com/'
    private isKey = 1
    private domain = 1
    private stats: number = Math.ceil(Date.now() / 1000)
    private days = 90
    private buyBox = 1
    private keepaUrl: string
    data: KeepaOutputType | null = null
    private product: KeepaProductType | null = null
    private buyboxPrice = NaN
    amazonInStock = true
    buyBoxIsAmazon: boolean | undefined = false
    hasBadge = false
    avgBuyBox30Day = NaN
    sellPrice = NaN
    fbaPrice = NaN
    profit = NaN
    roi = NaN
    bsr = NaN
    size = NaN
    brand: string | null | undefined = ''
    top = false
    category = ''
    image = ''

    constructor(input: KeepaInputType) {
        this.input = input
        this.keepaUrl = `${this.apiUrl}product?key=${this.key}&domain=${this.domain}&days=${this.days}&asin=${this.input.asin}&stats=${this.stats}&buybox=${this.buyBox}&offers=20`
    }

    setKeepaUrl(key: string) {
        this.keepaUrl = `${this.apiUrl}product?key=${key}&domain=${this.domain}&days=${this.days}&asin=${this.input.asin}&stats=${this.stats}&buybox=${this.buyBox}&offers=20`
    }

    async fetchByKeepa() {
        try {
            await axios
                .get(this.keepaUrl)
                .then((res: any) => {
                    this.data = res.data

                    console.log(`>>> refillRate: ${res?.data?.refillRate}`)
                    console.log(`>>> refillIn: ${res.data?.refillIn}`)
                    console.log(`>>> tokensLeft: ${res?.data?.tokensLeft}`)
                    console.log(`>>> tokensConsumed: ${res?.data?.tokensConsumed}`)
                    console.log(`>>> tokenFlowReduction: ${res?.data?.tokenFlowReduction}`)
                    console.log(`>>> Keepa Error: ${res?.data?.error?.message}`)
                })
                .catch((err) => {
                    throw new Error(err.message)
                })
        } catch (err: any) {
            if (err?.response) {
                console.log(`>>> refillRate: ${err?.response?.data?.refillRate}`)
                console.log(`>>> refillIn: ${err?.response.data?.refillIn}`)
                console.log(`>>> tokensLeft: ${err?.response?.data?.tokensLeft}`)
                console.log(`>>> tokensConsumed: ${err?.response?.data?.tokensConsumed}`)
                console.log(`>>> tokenFlowReduction: ${err?.response?.data?.tokenFlowReduction}`)
                console.log(`>>> Keepa Error: ${err?.response?.data?.error?.message}`)
                await sleep(err?.response.data?.refillIn)
            } else {
                console.log('60 second wait')
                await sleep(60000)
            }

            await this.fetchByKeepa()
        }

        if (this.data?.tokensLeft && this.data?.tokensLeft < 0) {
            console.log(`Wait ${this.data?.refillIn} mm`)
            await sleep(this.data?.refillIn)
            await this.fetchByKeepa()
        }

        this.product = this.data?.products[0]

        this.brand = this.product?.brand
        // this.buyBoxIsAmazon = this.product?.stats?.buyBoxIsAmazon

        if (!this.product?.title) {
            throw new Error('Amazon Title is not exist!')
        }

        // category
        if (Array.isArray(this.product?.categoryTree)) {
            this.category = this.product?.categoryTree[0].name
        }

        // BSR
        if (
            this.product?.csv[3] !== undefined &&
            this.product?.csv[3] !== null &&
            Array.isArray(this.product?.csv[3])
        ) {
            if (this.product?.csv[3].length) {
                this.bsr = this.product?.csv[3][this.product?.csv[3].length - 1]
            }
        }

        this.buyboxPrice = this.product?.stats?.buyBoxPrice > 0 ? this.product?.stats?.buyBoxPrice / 100 : NaN
        this.fbaPrice = this.lastFbaPrice()

        this.amazonInStock = this.amazonInStock30Day()
        this.avgBuyBox30Day = this.buyBoxAvg30Day()

        this.sellPrice = this.buyboxPrice
            ? this.buyboxPrice
            : this.fbaPrice
            ? this.fbaPrice
            : this.avgBuyBox30Day
            ? this.avgBuyBox30Day
            : this.newPrice30Day()
            ? this.newPrice30Day()
            : 0

        this.keepaFirstImage()

        this.topCalculate()

        this.profitRoiCalculate()
    }

    private topCalculate() {
        if (
            (EnumCategories.TOYS === this.category && this.bsr < 312000) ||
            (EnumCategories.SPORT === this.category && this.bsr < 350000) ||
            (EnumCategories.PET === this.category && this.bsr < 150000) ||
            (EnumCategories.ART === this.category && this.bsr < 250000) ||
            (EnumCategories.PATIO === this.category && this.bsr < 200000) ||
            (EnumCategories.HOME_KITCHEN === this.category && this.bsr < 300000) ||
            (EnumCategories.VIDEO_GAMES === this.category && this.bsr < 30000) ||
            (EnumCategories.INDUSTRIAL === this.category && this.bsr < 250000) ||
            (EnumCategories.TOOLS === this.category && this.bsr < 250000) ||
            (EnumCategories.OFFICE_PRODUCTS === this.category && this.bsr < 240000) ||
            (EnumCategories.GROCERY === this.category && this.bsr < 150000) ||
            (EnumCategories.ELECTRONIC === this.category && this.bsr < 200000) ||
            (EnumCategories.CAMERA === this.category && this.bsr < 35000) ||
            (EnumCategories.BEAUTY === this.category && this.bsr < 320000) ||
            (EnumCategories.AUTOMOTIVE === this.category && this.bsr < 300000) ||
            (EnumCategories.CELL_PHONES === this.category && this.bsr < 250000) ||
            (EnumCategories.BOOKS === this.category && this.bsr < 90000) ||
            (EnumCategories.BABY === this.category && this.bsr < 100000) ||
            (EnumCategories.CLOTHING === this.category && this.bsr < 300000) ||
            (EnumCategories.COMPUTERS === this.category && this.bsr < 150000) ||
            (EnumCategories.HEALTH === this.category && this.bsr < 200000) ||
            (EnumCategories.KITCHEN_DINING === this.category && this.bsr < 250000) ||
            (EnumCategories.MUSICAL_INSTRUMENTS === this.category && this.bsr < 40000)
        ) {
            this.top = true
        }
    }

    private profitRoiCalculate() {
        if (
            this.product?.packageLength &&
            this.product?.packageHeight &&
            this.product?.packageWeight &&
            this.product?.packageWidth
        ) {
            /*const profitClass = new ProfitRoiCalculate({
                sellPrice: this.sellPrice,
                buyCost: this.input.sourcePrice,
                packageLength: this.product?.packageLength * 0.0393701,
                packageWidth: this.product?.packageWidth * 0.0393701,
                packageHeight: this.product?.packageHeight * 0.0393701,
                packageWeight: this.product?.packageWeight * 0.00220462,
                category: this.category,
            })*/

            // this.profit = profitClass.netProfit
            // this.roi = profitClass.roi

            const profitClassBuyBox = new ProfitRoiCalculate({
                sellPrice: this.sellPrice,
                buyCost: this.input.sourcePrice,
                packageLength: this.product?.packageLength * 0.0393701,
                packageWidth: this.product?.packageWidth * 0.0393701,
                packageHeight: this.product?.packageHeight * 0.0393701,
                packageWeight: this.product?.packageWeight * 0.00220462,
                category: this.category,
            })

            this.profit = profitClassBuyBox.netProfit
            this.roi = profitClassBuyBox.roi
            this.size = profitClassBuyBox.size

            /*const profitClassBadge = new ProfitRoiCalculate({
                sellPrice: this.avgBuyBox30Day,
                buyCost: this.input.sourcePrice,
                packageLength: this.product?.packageLength * 0.0393701,
                packageWidth: this.product?.packageWidth * 0.0393701,
                packageHeight: this.product?.packageHeight * 0.0393701,
                packageWeight: this.product?.packageWeight * 0.00220462,
                category: this.category,
            })*/

            if (profitClassBuyBox.netProfit > 4 && profitClassBuyBox.roi > 20 && this.top) {
                this.hasBadge = true
            }
        }
    }

    private lastFbaPrice(): number {
        const data = this.product?.csv[10]
        let price = NaN

        if (data === null) return price

        price = data[data.length - 1]
        if (data[data.length - 1] < 0) {
            price = data[data.length - 3]
        }

        return price / 100
    }

    private amazonInStock30Day(): boolean {
        const data = this.product?.csv[0]

        if (data === null) return false

        let price = NaN
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i].toString().length < 7) {
                price = data[i]
            }
            if (data[i] === -1) {
                continue
            }

            if (data[i].toString().length > 6 && price === -1) {
                const dateDiff = this.dateDiffInDay(new Date(), new Date(this.keepaTimeToTimestamp(data[i])))
                if (dateDiff < 30) return true
                else return false
            }
        }

        return true
    }

    private buyBoxAvg30Day(): number {
        const data = this.product?.csv[18]
        if (data === null) return NaN

        let dateTimeStamp = NaN
        let index = -1
        const newData = []
        let newDataValue: any = {}
        for (let i = 0; i < data.length; i++) {
            if (data[i].toString().length > 6) {
                newDataValue = {}
                dateTimeStamp = this.keepaTimeToTimestamp(data[i])
                const diffDate = this.dateDiffInDay(new Date(), new Date(dateTimeStamp))

                const lastDiffDate = this.dateDiffInDay(
                    new Date(),
                    new Date(this.keepaTimeToTimestamp(data[data.length - 3]))
                )

                if (lastDiffDate > 40 && diffDate !== lastDiffDate) continue

                if (diffDate > 40 && lastDiffDate < 40) continue
                index++
                newDataValue.keepaTime = data[i]
                newDataValue.timestamp = dateTimeStamp
            }

            if ((data[i] === -1 || data[i] === 0) && newDataValue.timestamp) {
                newDataValue.type = data[i]
            }

            if (data[i] > 0 && data[i].toString().length < 6 && newDataValue.timestamp) {
                newDataValue.price = data[i]
            }

            if (Object.keys(newDataValue).length !== 0 && newDataValue.timestamp) {
                newData[index] = newDataValue
            }
        }

        let preTimeStamp = NaN
        let prePrice = NaN

        let days = 0
        let sumPrices = 0

        for (let i = 0; i < newData.length; i++) {
            if (!preTimeStamp && newData[i].type === 0) {
                preTimeStamp = newData[i].timestamp
                prePrice = newData[i].price
            }

            if (preTimeStamp && prePrice) {
                const diffDays = this.dateDiffInDay(new Date(newData[i].timestamp), new Date(preTimeStamp))
                days = days + (diffDays === 0 ? 1 : diffDays)
                sumPrices = sumPrices + (diffDays === 0 ? 1 : diffDays) * prePrice
                preTimeStamp = newData[i].timestamp
                prePrice = newData[i].price
            }
            if (newData[i].type !== 0) {
                preTimeStamp = NaN
                prePrice = 0
            }
        }

        if (!sumPrices) return NaN

        return sumPrices / 100 / days
    }

    private newPrice30Day() {
        const data = this.product?.csv[1]
        if (data === null) return NaN

        let dateTimeStamp = NaN
        let index = -1
        const newData = []
        let newDataValue: any = {}
        for (let i = 0; i < data.length; i++) {
            if (data[i].toString().length > 6) {
                newDataValue = {}
                dateTimeStamp = this.keepaTimeToTimestamp(data[i])
                const diffDate = this.dateDiffInDay(new Date(), new Date(dateTimeStamp))

                const lastDiffDate = this.dateDiffInDay(
                    new Date(),
                    new Date(this.keepaTimeToTimestamp(data[data.length - 2]))
                )

                if (lastDiffDate > 40 && diffDate !== lastDiffDate) continue

                if (diffDate > 40 && lastDiffDate < 40) continue
                index++
                newDataValue.keepaTime = data[i]
                newDataValue.timestamp = dateTimeStamp
            }

            if ((data[i] === -1 || data[i] === 0) && newDataValue.timestamp) {
                newDataValue.type = data[i]
            } else {
                newDataValue.type = 0
            }

            if (data[i] > 0 && data[i].toString().length < 6 && newDataValue.timestamp) {
                newDataValue.price = data[i]
            }

            if (Object.keys(newDataValue).length !== 0 && newDataValue.timestamp) {
                newData[index] = newDataValue
            }
        }

        let preTimeStamp = NaN
        let prePrice = NaN

        let days = 0
        let sumPrices = 0

        for (let i = 0; i < newData.length; i++) {
            if (!preTimeStamp && newData[i].type === 0) {
                preTimeStamp = newData[i].timestamp
                prePrice = newData[i].price
            }

            if (preTimeStamp && prePrice) {
                const diffDays = this.dateDiffInDay(new Date(newData[i].timestamp), new Date(preTimeStamp))
                days = days + (diffDays === 0 ? 1 : diffDays)
                sumPrices = sumPrices + (diffDays === 0 ? 1 : diffDays) * prePrice
                preTimeStamp = newData[i].timestamp
                prePrice = newData[i].price
            }
            if (newData[i].type === -1) {
                preTimeStamp = NaN
                prePrice = 0
            }
        }

        return sumPrices / 100 / days
    }

    private keepaFirstImage() {
        const str = this.product?.imagesCSV
        if (!str) return null
        const stringSplit = str.split(',')
        let imgUrl = ''
        if (stringSplit[0]) {
            imgUrl = `https://m.media-amazon.com/images/I/${stringSplit[0]}`
        }
        this.image = `=IMAGE("${imgUrl}")`
    }

    private dateDiffInDay(date1: Date, date2: Date) {
        const t1 = date1.getTime()
        const t2 = date2.getTime()

        return Math.floor((t1 - t2) / (24 * 3600 * 1000))
    }

    private keepaTimeToTimestamp(time: any) {
        return (time + 21564000) * 60000
    }
}
