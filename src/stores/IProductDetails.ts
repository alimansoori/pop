import {Page} from "puppeteer";
import {TypePriceSelector, TypePriceSelectors} from "../@types/TypePriceSelectors";
import ISelectors from "./ISelectors";
import IStoreOptions from "./IStoreOptions";

export default interface IProductDetails {
    priceCalculate(): Promise<void>
    availibilityCalculate(): Promise<void>
}