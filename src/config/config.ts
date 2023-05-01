import fs from 'fs'
import { IConfig } from './IConfig'

const config: IConfig = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))

export default config
