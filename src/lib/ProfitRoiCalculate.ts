import { ProfitRoiCalculateType } from '../@types/ProfitRoiCalculateType'
import { SizeTier } from '../@types/EnumSizeTiers'
import { EnumCategories } from '../@types/EnumCategories'
import MyDate from './MyDate'

export default class ProfitRoiCalculate {
    public input: ProfitRoiCalculateType
    private size = ''
    public fbaCost = 0
    public totalAmazonReferralFees = 0
    public storageFees = 0
    public landedCosts = 0
    private profit = 0
    private netProfitMargin = 0
    private roi = 0

    constructor(input: ProfitRoiCalculateType) {
        this.input = input
        this.packageSizeToInch()
        this.fbaCostCalculator()
        this.totalAmazonReferralFeesCalculator()
        this.storageFeesCalculator()
        this.landedCostsCalculator()
        this.netProfitCalculator()
        this.netProfitMarginCalculator()
        this.roiCalculator()
    }

    public getProfit(): number {
        return this.profit
    }

    public getROI(): number {
        return this.roi
    }

    public getSize(): string {
        return this.size
    }

    private packageSizeToInch(): void {
        this.input = {
            ...this.input,
            packageLength: this.input.packageLength / 25.4,
            packageWidth: this.input.packageWidth / 25.4,
            packageHeight: this.input.packageHeight / 25.4,
            packageWeight: this.input.packageWeight / 453.59237,
        }
    }

    private fbaCostCalculator(): void {
        if (this.input?.fbaFees?.pickAndPackFee) {
            this.fbaCost = this.input?.fbaFees?.pickAndPackFee / 100
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight <= 0.25 &&
            this.input.packageLength <= 15 &&
            this.input.packageWidth <= 12 &&
            this.input.packageHeight <= 0.75
        ) {
            this.fbaCost = 3.43
            this.size = SizeTier.SMALL_STANDARD
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight > 0.25 &&
            this.input.packageWeight <= 0.5 &&
            this.input.packageLength <= 15 &&
            this.input.packageWidth <= 12 &&
            this.input.packageHeight <= 0.75
        ) {
            this.fbaCost = 3.58
            this.size = SizeTier.SMALL_STANDARD
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight > 0.5 &&
            this.input.packageWeight <= 0.75 &&
            this.input.packageLength <= 15 &&
            this.input.packageWidth <= 12 &&
            this.input.packageHeight <= 0.75
        ) {
            this.fbaCost = 3.87
            this.size = SizeTier.SMALL_STANDARD
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight > 0.75 &&
            this.input.packageWeight <= 1 &&
            this.input.packageLength <= 15 &&
            this.input.packageWidth <= 12 &&
            this.input.packageHeight <= 0.75
        ) {
            this.fbaCost = 4.15
            this.size = SizeTier.SMALL_STANDARD
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight <= 0.25 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 4.43
            this.size = SizeTier.LARGE_STANDARD
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight > 0.25 &&
            this.input.packageWeight <= 0.5 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 4.63
            this.size = SizeTier.LARGE_STANDARD
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight > 0.5 &&
            this.input.packageWeight <= 0.75 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 4.84
            this.size = SizeTier.LARGE_STANDARD
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight > 0.75 &&
            this.input.packageWeight <= 1 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 5.32
            this.size = SizeTier.LARGE_STANDARD
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight > 1 &&
            this.input.packageWeight <= 1.5 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 6.1
            this.size = SizeTier.LARGE_STANDARD
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight > 1.5 &&
            this.input.packageWeight <= 2 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 6.37
            this.size = SizeTier.LARGE_STANDARD
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight > 2 &&
            this.input.packageWeight <= 2.5 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 6.83
            this.size = SizeTier.LARGE_STANDARD
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight > 2.5 &&
            this.input.packageWeight <= 3 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 7.05
            this.size = SizeTier.LARGE_STANDARD
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight > 3 &&
            this.input.packageWeight <= 20 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 7.17
            const diffWeight = this.input.packageWeight - 3
            if (diffWeight > 1) {
                this.fbaCost = 7.17 + Math.ceil(diffWeight) * 0.16
            }
            this.size = SizeTier.LARGE_STANDARD
        } else if (
            this.input.packageWeight <= 0.25 &&
            this.input.packageLength <= 15 &&
            this.input.packageWidth <= 12 &&
            this.input.packageHeight <= 0.75
        ) {
            this.fbaCost = 3.22
            this.size = SizeTier.SMALL_STANDARD
        } else if (
            this.input.packageWeight <= 0.5 &&
            this.input.packageLength <= 15 &&
            this.input.packageWidth <= 12 &&
            this.input.packageHeight <= 0.75
        ) {
            this.fbaCost = 3.4
            this.size = SizeTier.SMALL_STANDARD
        } else if (
            this.input.packageWeight <= 0.75 &&
            this.input.packageLength <= 15 &&
            this.input.packageWidth <= 12 &&
            this.input.packageHeight <= 0.75
        ) {
            this.fbaCost = 3.58
            this.size = SizeTier.SMALL_STANDARD
        } else if (
            this.input.packageWeight <= 1 &&
            this.input.packageLength <= 15 &&
            this.input.packageWidth <= 12 &&
            this.input.packageHeight <= 0.75
        ) {
            this.fbaCost = 3.77
            this.size = SizeTier.SMALL_STANDARD
        } else if (
            this.input.packageWeight <= 0.25 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 3.86
            this.size = SizeTier.LARGE_STANDARD
        } else if (
            this.input.packageWeight <= 0.5 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 4.08
            this.size = SizeTier.LARGE_STANDARD
        } else if (
            this.input.packageWeight <= 0.75 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            console.log('OOO')
            this.fbaCost = 4.24
            this.size = SizeTier.LARGE_STANDARD
        } else if (
            this.input.packageWeight <= 1 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 4.75
            this.size = SizeTier.LARGE_STANDARD
        } else if (
            this.input.packageWeight <= 1.5 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 5.4
            this.size = SizeTier.LARGE_STANDARD
        } else if (
            this.input.packageWeight <= 2 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 5.69
            this.size = SizeTier.LARGE_STANDARD
        } else if (
            this.input.packageWeight <= 2.5 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 6.1
            this.size = SizeTier.LARGE_STANDARD
        } else if (
            this.input.packageWeight <= 3 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            console.log('ssss')
            this.fbaCost = 6.39
            this.size = SizeTier.LARGE_STANDARD
        } else if (
            this.input.packageWeight <= 20 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 7.17
            const diffWeight = this.input.packageWeight - 3
            if (diffWeight > 1) {
                this.fbaCost = this.fbaCost + Math.ceil(diffWeight * 2) * 0.16
            }

            this.size = SizeTier.LARGE_STANDARD
        } else if (
            // Small Oversize
            this.input.packageWeight <= 70 &&
            this.input.packageLength <= 60 &&
            this.input.packageWidth <= 30
        ) {
            this.fbaCost = 9.73
            const diffWeight = this.input.packageWeight - 20
            if (diffWeight > 1) {
                this.fbaCost = this.fbaCost + Math.ceil(diffWeight) * 0.42
            }
            this.size = SizeTier.SMALL_OVERSIZE
        } else if (this.input.packageWeight <= 150 && this.input.packageLength <= 108) {
            this.fbaCost = 19.05
            const diffWeight = this.input.packageWeight - 150
            if (diffWeight > 1) {
                this.fbaCost = this.fbaCost + Math.ceil(diffWeight) * 0.42
            }
            this.size = SizeTier.MEDIUM_OVERSIZE
        } else {
            this.fbaCost = 89.98
            const diffWeight = this.input.packageWeight - 150
            if (diffWeight > 1) {
                this.fbaCost = 82.58 + Math.ceil(diffWeight) * 0.83
            }
            this.size = SizeTier.LARGE_OVERSIZE
        }
    }

    private totalAmazonReferralFeesCalculator() {
        if (this.input?.referralFeePercent) {
            this.totalAmazonReferralFees = this.referralCalc({
                referralPercent1: this.input.referralFeePercent / 100,
            })
        } else if (this.input.category === EnumCategories.AUTOMOTIVE) {
            this.totalAmazonReferralFees = this.referralCalc({
                referralPercent1: 0.12,
            })
        } else if (this.input.category === EnumCategories.BEAUTY || this.input.category === EnumCategories.HEALTH) {
            this.totalAmazonReferralFees = this.referralCalc({
                referralPercent1: 0.08,
                price: 10,
                referralPercent2: 0.15,
            })
        } else if (
            this.input.category === EnumCategories.CAMERA ||
            this.input.category === EnumCategories.CELL_PHONES ||
            this.input.category === EnumCategories.CONSUMER_ELECTRONIC
        ) {
            this.totalAmazonReferralFees = this.referralCalc({
                referralPercent1: 0.08,
            })
        } else if (this.input.category === EnumCategories.CLOTHING) {
            this.totalAmazonReferralFees = this.referralCalc({
                referralPercent1: 0.17,
            })
        } else if (this.input.category === EnumCategories.ELECTRONIC) {
            this.totalAmazonReferralFees = this.referralCalc({
                referralPercent1: 0.15,
                price: 100,
                referralPercent2: 0.08,
            })
        } else if (this.input.category === EnumCategories.GROCERY) {
            this.totalAmazonReferralFees = this.referralCalc({
                referralPercent1: 0.08,
                price: 15,
                referralPercent2: 0.15,
            })
        } else if (this.input.category === EnumCategories.OFFICE_PRODUCTS) {
            this.totalAmazonReferralFees = this.referralCalc({
                referralPercent1: 0.08,
            })
        } else {
            this.totalAmazonReferralFees = this.referralCalc({ referralPercent1: 0.15 })
        }
    }

    private referralCalc(input: { referralPercent1: number; price?: number; referralPercent2?: number }): number {
        if (input?.referralPercent2 && input?.price) {
            if (this.input.sellPrice <= input.price) {
                const ref = this.input.sellPrice * input.referralPercent1
                if (ref > 0.3) {
                    return ref
                } else {
                    return 0.3
                }
            } else {
                const ref = this.input.sellPrice * input.referralPercent2
                if (ref > 0.3) {
                    return ref
                } else {
                    return 0.3
                }
            }
        } else {
            const ref = this.input.sellPrice * input.referralPercent1
            if (ref > 0.3) {
                return ref
            } else {
                return 0.3
            }
        }
    }

    private storageFeesCalculator() {
        const cubicInches = this.input.packageHeight * this.input.packageLength * this.input.packageWidth
        const cubicFeet = cubicInches / 1728

        let fee = 0.87
        if (MyDate.getCurrentMonth() >= 0 && MyDate.getCurrentMonth() <= 8 && this.size.includes('Standard')) {
            fee = 0.87
        } else if (MyDate.getCurrentMonth() >= 0 && MyDate.getCurrentMonth() <= 8 && this.size.includes('Oversize')) {
            fee = 0.56
        } else if (this.size.includes('Standard')) {
            fee = 2.4
        } else if (this.size.includes('Oversize')) {
            fee = 1.4
        }

        this.storageFees = fee * cubicFeet
    }

    private landedCostsCalculator() {
        // const freight = 0.79
        // const dutiesRate = 0.07
        // const warehouseFees = 0.2
        // this.landedCosts = this.input.buyCost + freight + this.input.buyCost * dutiesRate + warehouseFees
        this.landedCosts = this.input.buyCost + this.input.buyCost * 0.02
    }

    netProfitCalculator() {
        this.profit =
            this.input.sellPrice - this.fbaCost - this.totalAmazonReferralFees - this.storageFees - this.input.buyCost
        this.profit = Math.round(this.profit * 10) / 10
    }

    netProfitMarginCalculator() {
        this.netProfitMargin = (this.profit / this.input.sellPrice) * 100
        this.netProfitMargin = Math.round(this.netProfitMargin * 10) / 10
    }

    roiCalculator() {
        this.roi = (this.profit / this.input.buyCost) * 100
        this.roi = Math.round(this.roi * 10) / 10
    }
}
