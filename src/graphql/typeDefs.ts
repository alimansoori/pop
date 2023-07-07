import { mergeTypeDefs } from '@graphql-tools/merge'
import leadSchema from './schema/leadSchema'
import amazonSchema from './schema/amazonSchema'
import sourceSchema from './schema/sourceSchema'
import querySchema from './schema/querySchema'
import mutationSchema from './schema/mutationSchema'
import statusSchema from './schema/statusSchema'

const typeDefs = mergeTypeDefs([statusSchema, leadSchema, amazonSchema, sourceSchema, querySchema, mutationSchema])

export default typeDefs
