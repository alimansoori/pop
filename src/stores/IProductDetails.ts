import {Page} from "puppeteer";
import {TypePriceSelector, TypePriceSelectors} from "../@types/TypePriceSelectors";
import ISelectors from "./ISelectors";
import IStoreOptions from "./IStoreOptions";

export default interface IProductDetails {
    productExistCalculate(): Promise<void>
    priceCalculate(): Promise<void>
    availibilityCalculate(): Promise<void>
}