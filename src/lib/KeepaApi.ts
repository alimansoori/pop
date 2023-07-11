import { KeepaInputType } from './keepa/KeepaInputType'
import axios from 'axios'
import { sleep } from '../utils/sleep'
import { KeepaOutputType } from '../@types/KeepaOutputType'
import { KeepaProductType } from '../@types/KeepaProductType'
import ProfitRoiCalculate from './ProfitRoiCalculate'
import { EnumCategories } from '../@types/EnumCategories'
import * as fs from 'fs'

export default class KeepaApi {
    private readonly domain: number = 1
    private readonly stats: number = Math.ceil(Date.now() / 1000)
    private readonly days: number = 90
    private readonly buyBox: number = 1
    private keepaUrl: string
    data: KeepaOutputType | null = null
    public amazonProduct: KeepaProductType | null = null
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
    asin: string
    size = ''
    brand: string | null | undefined = ''
    top = false
    category = ''
    image = ''
    private config: IKeepaConfig

    constructor(asin: string) {
        this.asin = asin
        this.config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))
        this.keepaUrl = `${this.config.keepa_api_url}product?key=${this.config.keepa_api_key}&domain=${this.domain}&days=${this.days}&asin=${asin}&stats=${this.stats}&buybox=${this.buyBox}&offers=20`
    }

    setKeepaUrl(key: string) {
        this.keepaUrl = `${this.config.keepa_api_url}product?key=${key}&domain=${this.domain}&days=${this.days}&asin=${this.asin}&stats=${this.stats}&buybox=${this.buyBox}&offers=20`
    }

    async fetch() {
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

            await this.fetch()
        }

        if (this.data?.tokensLeft && this.data?.tokensLeft < 0) {
            console.log(`Wait ${this.data?.refillIn} mm`)
            await sleep(this.data?.refillIn)
            await this.fetch()
        }

        this.amazonProduct = this.data?.products[0]

        this.brand = this.amazonProduct?.brand
        // this.buyBoxIsAmazon = this.product?.stats?.buyBoxIsAmazon

        this.amazonInStock = this.amazonInStock30Day()
        this.avgBuyBox30Day = this.buyBoxAvg30Day()

        this.topCalculate()

        // this.profitRoiCalculate()
    }

    getCategory(): string {
        if (Array.isArray(this.amazonProduct?.categoryTree)) {
            return this.amazonProduct?.categoryTree[0].name
        }

        return ''
    }

    getBSR(): number {
        if (
            this.amazonProduct?.csv[3] !== undefined &&
            this.amazonProduct?.csv[3] !== null &&
            Array.isArray(this.amazonProduct?.csv[3])
        ) {
            if (this.amazonProduct?.csv[3]?.length) {
                return this.amazonProduct?.csv[3][this.amazonProduct?.csv[3]?.length - 1]
            }
        }

        return NaN
    }

    getBuyBoxPrice(): number {
        if (this?.amazonProduct)
            return this?.amazonProduct?.stats?.buyBoxPrice > 0 ? this.amazonProduct?.stats?.buyBoxPrice / 100 : NaN

        return NaN
    }

    getSellPrice(): number {
        return this.getBuyBoxPrice()
            ? this.getBuyBoxPrice()
            : this.lastFbaPrice()
            ? this.lastFbaPrice()
            : this.buyBoxAvg30Day()
            ? this.buyBoxAvg30Day()
            : this.newPrice30Day()
            ? this.newPrice30Day()
            : 0
    }

    private topCalculate() {
        if (
            (EnumCategories.TOYS === this.category && this.bsr < 312000) ||
            (EnumCategories.SPORT === this.category && this.bsr < 350000) ||
            (EnumCategories.PET === this.category && this.bsr < 150000) ||
            (EnumCategories.ART === this.category && this.bsr < 250000) ||
            (EnumCategories.PATIO === this.category && this.bsr < 300000) ||
            (EnumCategories.HOME_KITCHEN === this.category && this.bsr < 300000) ||
            (EnumCategories.VIDEO_GAMES === this.category && this.bsr < 30000) ||
            (EnumCategories.INDUSTRIAL === this.category && this.bsr < 250000) ||
            (EnumCategories.TOOLS === this.category && this.bsr < 300000) ||
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

    /*private profitRoiCalculate() {
      if (
          this.amazonProduct?.packageLength &&
          this.amazonProduct?.packageHeight &&
          this.amazonProduct?.packageWeight &&
          this.amazonProduct?.packageWidth
      ) {
          /!*const profitClass = new ProfitRoiCalculate({
              sellPrice: this.sellPrice,
              buyCost: this.input.sourcePrice,
              packageLength: this.product?.packageLength * 0.0393701,
              packageWidth: this.product?.packageWidth * 0.0393701,
              packageHeight: this.product?.packageHeight * 0.0393701,
              packageWeight: this.product?.packageWeight * 0.00220462,
              category: this.category,
          })*!/

          // this.profit = profitClass.netProfit
          // this.roi = profitClass.roi

          const profitClassBuyBox = new ProfitRoiCalculate({
              sellPrice: this.sellPrice,
              buyCost: this.input.sourcePrice,
              packageLength: this.amazonProduct?.packageLength * 0.0393701,
              packageWidth: this.amazonProduct?.packageWidth * 0.0393701,
              packageHeight: this.amazonProduct?.packageHeight * 0.0393701,
              packageWeight: this.amazonProduct?.packageWeight * 0.00220462,
              category: this.category,
          })

          this.profit = profitClassBuyBox.netProfit
          this.roi = profitClassBuyBox.roi
          this.size = profitClassBuyBox.size

          /!*const profitClassBadge = new ProfitRoiCalculate({
              sellPrice: this.avgBuyBox30Day,
              buyCost: this.input.sourcePrice,
              packageLength: this.product?.packageLength * 0.0393701,
              packageWidth: this.product?.packageWidth * 0.0393701,
              packageHeight: this.product?.packageHeight * 0.0393701,
              packageWeight: this.product?.packageWeight * 0.00220462,
              category: this.category,
          })*!/

          if (profitClassBuyBox.netProfit > 3.8 && profitClassBuyBox.roi > 20 && this.top) {
              this.hasBadge = true
          }
      }
  }*/

    private lastFbaPrice(): number {
        const data = this.amazonProduct?.csv[10]
        let price = NaN

        if (data === null) return price

        price = data[data?.length - 1]
        if (data[data?.length - 1] < 0) {
            price = data[data?.length - 3]
        }

        return price / 100
    }

    private amazonInStock30Day(): boolean {
        const data = this.amazonProduct?.csv[0]

        if (data === null) return false

        let price = NaN
        for (let i = data?.length - 1; i >= 0; i--) {
            if (data[i].toString()?.length < 7) {
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
        const data = this.amazonProduct?.csv[18]
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
        const data = this.amazonProduct?.csv[1]
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

    getImages(): string[] {
        const str = this.amazonProduct?.imagesCSV
        if (!str) return []
        const stringSplit = str.split(',')
        const imgUrl = []
        for (let i = 0; i < stringSplit.length; i++) {
            imgUrl.push(`https://m.media-amazon.com/images/I/${stringSplit[i]}`)
        }
        return imgUrl
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
