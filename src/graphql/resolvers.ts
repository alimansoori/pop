import { createAmazon, deleteAmazon, editAmazon, getAmazons } from './resolvers/amazonResolvers'
import { createSource, deleteSource, editSource, getSourceById, getSources } from './resolvers/sourceResolvers'
import { createLead, deleteLead, editLead, getLeads } from './resolvers/leadResolvers'

const resolvers = {
    Query: {
        ...getSourceById,
        ...getSources,
        ...getAmazons,
        ...getLeads,
    },
    Mutation: {
        ...createSource,
        ...deleteSource,
        ...editSource,
        ...createAmazon,
        ...deleteAmazon,
        ...editAmazon,
        ...createLead,
        ...deleteLead,
        ...editLead,
    },
}

export default resolvers
