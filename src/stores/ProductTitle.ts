export default class ProductTitle {
    private _title = ''

    constructor() {}

    getTitle(): string {
        return this._title
    }

    setTitle(title: string | undefined) {
        if (title) {
            this._title = title
        }
    }

    isValid(): boolean {
        const invalidTexts = ['used', 'pre-order', 'pre order', 'damaged package', 'refurbished']

        for (let i = 0; i < invalidTexts.length; i++) {
            if (this._title && this._title.toLowerCase().includes(invalidTexts[i].toLowerCase())) {
                return false
            }
        }

        return true
    }
}
