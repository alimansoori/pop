
export default class ProductTitle{
    _title: string = ""

    constructor() {
    }

    getTitle(): string {
        return this._title
    }

    setTitle(title: string) {
        this._title = title
    }

    isValid(): boolean {
        const invalidTexts = [
            "used",
            "pre-order",
            "pre order",
            "damaged package"
        ]

        for (let i = 0; i < invalidTexts.length; i++) {
            if (this._title.toLowerCase().includes(invalidTexts[i].toLowerCase())) {
                return false
            }
        }

        return true
    }
}

















