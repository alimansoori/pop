import fs from 'fs'

export default class FileManager {
    private filePath

    constructor(filePath: string) {
        this.filePath = filePath
    }

    readFile() {
        try {
            return fs.readFileSync(this.filePath, 'utf8')
        } catch (error) {
            console.error('Error reading file:', error)
            return null
        }
    }

    writeFile(data: any) {
        try {
            fs.writeFileSync(this.filePath, data)
            console.log('Data written to file successfully.')
        } catch (error) {
            console.error('Error writing to file:', error)
        }
    }
}
