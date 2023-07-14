import { EnumCatSheets } from '../@types/EnumCatSheets'

export default class CategorySheet {
    static selectSheetKey(category: string | undefined): EnumCatSheets {
        switch (category) {
            case 'leads':
                return EnumCatSheets.LEADS
            case 'google':
                return EnumCatSheets.GOOGLE
            case 'toys1':
                return EnumCatSheets.TOYS1
            case 'toys2':
                return EnumCatSheets.TOYS2
            case 'toys3':
                return EnumCatSheets.TOYS3
            case 'office':
                return EnumCatSheets.OFFICE_PRODUCTS
            case 'kitchen':
                return EnumCatSheets.KITCHEN_DINING
            case 'musical':
                return EnumCatSheets.MUSICAL_INSTRUMENTS
            case 'beauty1':
                return EnumCatSheets.BEAUTY1
            case 'beauty2':
                return EnumCatSheets.BEAUTY2
            case 'beauty3':
                return EnumCatSheets.BEAUTY3
            case 'health1':
                return EnumCatSheets.HEALTH1
            case 'health2':
                return EnumCatSheets.HEALTH2
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
            case 'import':
                return EnumCatSheets.IMPORT
            case 'default':
                return EnumCatSheets.DEFAULT
            default:
                return EnumCatSheets.DEFAULT
        }
    }
}
