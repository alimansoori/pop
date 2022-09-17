export default class Objectt {
    static isEmpty(obj: object): boolean {
        for (const prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                return false
            }
        }

        return JSON.stringify(obj) === JSON.stringify({})
    }
}
