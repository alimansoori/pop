import { EnumCatSheets } from '../@types/EnumCatSheets'

export default class CategorySheet {
    static selectSheetKey(category: string | undefined): EnumCatSheets {
        switch (category) {
            case 'google':
                return EnumCatSheets.GOOGLE
            case 'toys':
                return EnumCatSheets.TOYS
            case 'office':
                return EnumCatSheets.OFFICE_PRODUCTS
            case 'kitchen':
                return EnumCatSheets.KITCHEN_DINING
            case 'musical':
                return EnumCatSheets.MUSICAL_INSTRUMENTS
            case 'beauty':
                return EnumCatSheets.BEAUTY
            case 'health':
                return EnumCatSheets.HEALTH
            case 'sport':
                return EnumCatSheets.SPORT
            case 'pet':
                return EnumCatSheets.PET
            case 'clothing':
                return EnumCatSheets.CLOTHING
            case 'tools':
                return EnumCatSheets.TOOLS
            case 'grocery':
                return EnumCatSheets.GROCERY
            case 'patio':
                return EnumCatSheets.PATIO
            case 'art':
                return EnumCatSheets.ART
            case 'baby':
                return EnumCatSheets.BABY
            case 'books':
                return EnumCatSheets.BOOKS
            case 'video_games':
                return EnumCatSheets.VIDEO_GAMES
            case 'camera':
                return EnumCatSheets.CAMERA
            case 'consumer':
                return EnumCatSheets.CONSUMER_ELECTRONIC
            case 'electronic':
                return EnumCatSheets.ELECTRONIC
            case 'home':
                return EnumCatSheets.HOME_KITCHEN
            case 'automotive':
                return EnumCatSheets.AUTOMOTIVE
            case 'industrial':
                return EnumCatSheets.INDUSTRIAL
            case 'cell':
                return EnumCatSheets.CELL_PHONES
            case 'computers':
                return EnumCatSheets.COMPUTERS
            case 'test':
                return EnumCatSheets.TEST
            case 'default':
                return EnumCatSheets.DEFAULT
            default:
                return EnumCatSheets.DEFAULT
        }
    }
}
