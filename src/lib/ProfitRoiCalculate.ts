import { ProfitRoiCalculateType } from '../@types/ProfitRoiCalculateType'
import { SizeTier } from '../@types/EnumSizeTiers'
import { EnumCategories } from '../@types/EnumCategories'

export default class ProfitRoiCalculate {
    private input: ProfitRoiCalculateType
    public size: number
    private fbaCost = 0
    private totalAmazonReferralFees = 0
    private storageFees = 0
    private landedCosts = 0
    netProfit = 0
    netProfitMargin = 0
    roi = 0

    constructor(input: ProfitRoiCalculateType) {
        this.input = input
        this.size = this.fbaCostCalculator()
        this.totalAmazonReferralFeesCalculator()
        this.storageFeesCalculator()
        this.landedCostsCalculator()
        this.netProfitCalculator()
        this.netProfitMarginCalculator()
        this.roiCalculator()
    }

    private fbaCostCalculator(): number {
        if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight <= 0.375 &&
            this.input.packageLength <= 15 &&
            this.input.packageWidth <= 12 &&
            this.input.packageHeight <= 0.75
        ) {
            this.fbaCost = 3.27
            return SizeTier.SMALL_STANDARD_SIZE_LESS_THAN_6OZ_CLOTHING
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight <= 0.75 &&
            this.input.packageLength <= 15 &&
            this.input.packageWidth <= 12 &&
            this.input.packageHeight <= 0.75
        ) {
            this.fbaCost = 3.43
            return SizeTier.SMALL_STANDARD_SIZE_6_12OZ_CLOTHING
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight <= 1 &&
            this.input.packageLength <= 15 &&
            this.input.packageWidth <= 12 &&
            this.input.packageHeight <= 0.75
        ) {
            this.fbaCost = 3.95
            return SizeTier.SMALL_STANDARD_SIZE_12_16OZ_CLOTHING
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight <= 0.375 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 4.22
            return SizeTier.LARGE_STANDARD_SIZE_LESS_THAN_6OZ_CLOTHING
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight <= 0.75 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 4.4
            return SizeTier.LARGE_STANDARD_SIZE_6_12OZ_CLOTHING
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight <= 1 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 5.07
            return SizeTier.LARGE_STANDARD_SIZE_12_16OZ_CLOTHING
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight <= 2 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 5.81
            return SizeTier.LARGE_STANDARD_SIZE_1LBS_2LBS_CLOTHING
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight <= 3 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 6.5
            return SizeTier.LARGE_STANDARD_SIZE_2LBS_3LBS_CLOTHING
        } else if (
            this.input.category === EnumCategories.CLOTHING &&
            this.input.packageWeight <= 20 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 6.68
            const diffWeight = this.input.packageWeight - 3
            if (diffWeight > 1) {
                this.fbaCost = 6.68 + 3 * 0.3
            }
            return SizeTier.LARGE_STANDARD_SIZE_OVER_3LBS_CLOTHING
        } else if (
            this.input.packageWeight <= 0.375 &&
            this.input.packageLength <= 15 &&
            this.input.packageWidth <= 12 &&
            this.input.packageHeight <= 0.75
        ) {
            this.fbaCost = 2.92
            return SizeTier.SMALL_STANDARD_SIZE_LESS_THAN_6OZ
        } else if (
            this.input.packageWeight <= 0.75 &&
            this.input.packageLength <= 15 &&
            this.input.packageWidth <= 12 &&
            this.input.packageHeight <= 0.75
        ) {
            this.fbaCost = 3.07
            return SizeTier.SMALL_STANDARD_SIZE_6_12OZ
        } else if (
            this.input.packageWeight <= 1 &&
            this.input.packageLength <= 15 &&
            this.input.packageWidth <= 12 &&
            this.input.packageHeight <= 0.75
        ) {
            this.fbaCost = 3.59
            return SizeTier.SMALL_STANDARD_SIZE_12_16OZ
        } else if (
            this.input.packageWeight <= 0.375 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 3.54
            return SizeTier.LARGE_STANDARD_SIZE_LESS_THAN_6OZ
        } else if (
            this.input.packageWeight <= 0.75 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 3.77
            return SizeTier.LARGE_STANDARD_SIZE_6_12OZ
        } else if (
            this.input.packageWeight <= 1 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 4.52
            return SizeTier.LARGE_STANDARD_SIZE_12_16OZ
        } else if (
            this.input.packageWeight <= 2 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 5.14
            return SizeTier.LARGE_STANDARD_SIZE_1LBS_2LBS
        } else if (
            this.input.packageWeight <= 3 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 5.79
            return SizeTier.LARGE_STANDARD_SIZE_2LBS_3LBS
        } else if (
            this.input.packageWeight <= 20 &&
            this.input.packageLength <= 18 &&
            this.input.packageWidth <= 14 &&
            this.input.packageHeight <= 8
        ) {
            this.fbaCost = 6.13
            const diffWeight = this.input.packageWeight - 3
            if (diffWeight > 1) {
                this.fbaCost = 6.68 + diffWeight * 0.3
            }
            return SizeTier.LARGE_STANDARD_SIZE_OVER_3LBS
        } else if (
            // Small Oversize
            this.input.packageWeight <= 70 &&
            this.input.packageLength <= 60 &&
            this.input.packageWidth <= 30
        ) {
            this.fbaCost = 8.94
            const diffWeight = this.input.packageWeight - 20
            if (diffWeight > 1) {
                this.fbaCost = 8.94 + diffWeight * 0.38
            }
            return SizeTier.SMALL_OVERSIZE
        } else if (this.input.packageWeight <= 150 && this.input.packageLength <= 108) {
            this.fbaCost = 12.73
            const diffWeight = this.input.packageWeight - 150
            if (diffWeight > 1) {
                this.fbaCost = 12.73 + diffWeight * 0.44
            }
            return SizeTier.MEDIUM_OVERSIZE
        } else {
            this.fbaCost = 82.58
            const diffWeight = this.input.packageWeight - 150
            if (diffWeight > 1) {
                this.fbaCost = 82.58 + diffWeight * 0.79
            }
            return SizeTier.MEDIUM_OVERSIZE
        }
    }

    private totalAmazonReferralFeesCalculator() {
        if (EnumCategories.AUTOMOTIVE) {
            if (this.input.sellPrice * 0.12 > 0.3) {
                this.totalAmazonReferralFees = this.input.sellPrice * 0.12
            } else {
                this.totalAmazonReferralFees = 0.3
            }
        } else if (EnumCategories.BEAUTY || EnumCategories.HEALTH) {
            if (this.input.sellPrice * 0.08 > 0.3) {
                this.totalAmazonReferralFees = this.input.sellPrice * 0.15
            } else {
                this.totalAmazonReferralFees = 0.3
            }
        } else if (EnumCategories.CAMERA || EnumCategories.CELL_PHONES || EnumCategories.CONSUMER_ELECTRONIC) {
            if (this.input.sellPrice * 0.08 > 0.3) {
                this.totalAmazonReferralFees = this.input.sellPrice * 0.08
            } else {
                this.totalAmazonReferralFees = 0.3
            }
        } else if (EnumCategories.CLOTHING) {
            if (this.input.sellPrice * 0.17 > 0.3) {
                this.totalAmazonReferralFees = this.input.sellPrice * 0.17
            } else {
                this.totalAmazonReferralFees = 0.3
            }
        } else if (EnumCategories.ELECTRONIC) {
            if (this.input.sellPrice * 0.15 > 0.15) {
                if (this.input.sellPrice < 100) {
                    this.totalAmazonReferralFees = this.input.sellPrice * 0.15
                } else {
                    this.totalAmazonReferralFees = (this.input.sellPrice - 100) * 0.08 + 100 * 0.15
                }
            } else {
                this.totalAmazonReferralFees = 0.3
            }
        } else {
            if (this.input.sellPrice * 0.15 > 0.3) {
                this.totalAmazonReferralFees = this.input.sellPrice * 0.15
            } else {
                this.totalAmazonReferralFees = 0.3
            }
        }
    }

    private storageFeesCalculator() {
        const cubicInches = this.input.packageHeight * this.input.packageLength * this.input.packageWidth
        const cubicFeet = cubicInches / 1728

        this.storageFees = ((2.4 * 3) / 12 + (0.75 * 9) / 12) * 3 * cubicFeet
    }

    private landedCostsCalculator() {
        const freight = 0.79
        const dutiesRate = 0.07
        const warehouseFees = 0.2
        this.landedCosts = this.input.buyCost + freight + this.input.buyCost * dutiesRate + warehouseFees
    }

    netProfitCalculator() {
        this.netProfit =
            this.input.sellPrice - this.fbaCost - this.totalAmazonReferralFees - this.storageFees - this.landedCosts
        this.netProfit = Math.round(this.netProfit * 10) / 10
    }

    netProfitMarginCalculator() {
        this.netProfitMargin = (this.netProfit / this.input.sellPrice) * 100
        this.netProfitMargin = Math.round(this.netProfitMargin * 10) / 10
    }

    roiCalculator() {
        this.roi = (this.netProfit / this.input.buyCost) * 100
        this.roi = Math.round(this.roi * 10) / 10
    }
}
