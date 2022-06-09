import IStoreOptions from "./IStoreOptions";

export default class StoreOptions implements IStoreOptions {
    private isCategoryTreeNavigate: boolean = false

    setIsCategoryTreeNavigate(isTree: boolean): this {
        this.isCategoryTreeNavigate = isTree
        return this;
    }

    hasCategoryTreeNavigate(): boolean {
        return this.isCategoryTreeNavigate
    }
}