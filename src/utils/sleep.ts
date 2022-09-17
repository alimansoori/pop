import MyMath from '../lib/MyMath'

async function sleep(milliseconds: number, milliseconds2 = NaN) {
    let random = milliseconds

    if (milliseconds2) {
        random = MyMath.randomIntFromInterval(milliseconds, milliseconds2)
    }

    return new Promise((resolve) => setTimeout(resolve, random))
}

export default sleep
