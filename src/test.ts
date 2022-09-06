import GoogleSheets from "./sheets/GoogleSheets";

export async function main() {
    try {
        await run()
    } catch (e: any) {
        await run()
    }
}

export async function run() {
    try {
        new GoogleSheets()
    } catch (e: any) {
        await run()
    }
}

main()

// netstat -ano | findstr :3000
// tskill typeyourPIDhere
// git reset --hard